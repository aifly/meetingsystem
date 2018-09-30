<template>
	<div class="wm-meeting-main-ui">
		<header>
			<div>会议管理 {{showDetail?formMeet.meetid?'>编辑':'>新增':''}}</div>
			<section>
				<Button type="primary" icon='md-add-circle' v-if='!showDetail' @click="addNewAduser">新增会议</Button>
				<Button type="primary" icon='ios-checkmark-circle-outline' v-else @click="meetAction">{{formMeet.meetid?'修改':'保存'}}</Button>
			</section>
		</header>
		<Table v-if='false' ref='scorelist' @on-row-dblclick='entry' :height='viewH - 64- 70 ' :data='meetList' :columns='columns'   stripe></Table>
		
		<div v-if='showDetail' class='wm-meet-form' :style="{height:viewH-64-50+'px'}">
			<section>
				<div class='wm-meet-form-item wm-require'>
					<div><label for="">名称：</label><input v-model='formMeet.meetname' type="text"></div>
					<div class='wm-meet-form-error' v-if='meetnameErr'>{{meetnameErr}}</div>
				</div>
				<div class='wm-meet-form-item wm-require'>
					<div>
						<label for="">会议时间：</label>
						<DatePicker style="width:80%" v-model="formMeet.datetimes" :value="formMeet.datetimes" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="请选择开始和结束日期"></DatePicker>
					</div>
					<div class='wm-meet-form-error'></div>
				</div>
				
				<div class='wm-meet-form-item wm-meet-form-muli'>
					<div><label for="">说明：</label><textarea v-model='formMeet.meetremarks' type="textarea"></textarea></div>
				</div>
				<div class='wm-meet-form-radio'>
					<div>是否开启报名</div>
					<div>
						 <RadioGroup v-model="formMeet.issignup">
							<Radio :value='1' label="是"></Radio>
							<Radio :value='0' label="否"></Radio>
						</RadioGroup>
					</div>
				</div>
				<div class='wm-meet-form-radio'>
					<div>是否开启用户审核</div>
					<div>
						<RadioGroup v-model="formMeet.ischecked">
							<Radio :value='1' label="是"></Radio>
							<Radio :value='0' label="否"></Radio>
						</RadioGroup>
					</div>
				</div>
				<div class='wm-meet-form-radio'>
					<div>是否开启会议报道</div>
					<div>
						<RadioGroup v-model="formMeet.isreport">
							<Radio :value='1' label="是"></Radio>
							<Radio :value='0' label="否"></Radio>
						</RadioGroup>
					</div>
				</div>
			</section>
		</div>
		<div v-else class='wm-meet-list wm-scroll' :style="{height:viewH-64-50+'px'}" >
			<ul>
				<li v-for='(meet,i) in meetList' :key="i">
					<span class='wm-meet-item-status'>
						<img :src="imgs[meet.status === 1 ? 'enable':'disable']" alt="">
					</span>
					<div class='wm-meet-item-header'>
						<div class='wm-meet-item-header-left'>
							<div class='wm-meet-item-name'>{{meet.meetname}}</div>
							<div class='wm-meet-item-info'>时间：{{meet.startdate}} - {{meet.enddate}}</div>
						</div>
						<div class='wm-meet-item-header-right'>
							<div class='wm-meet-item-actions'>
								<div @click="entry(meet,i)">详情</div>
								<div @click='editMeet(meet,i)'>编辑</div>
								<div>
									<Poptip
										confirm
										title="确定要删除吗？"
										@on-ok="delMeet(meet.meetid)"
										>
										<div>删除</div>
									</Poptip>

								</div>
							</div>
							<div class='wm-meet-item-info'>报名人数：{{meet.personnum|| '--' }}</div>
						</div>
					</div>
					<div class='wm-meet-remark'>
						<div>会议说明：</div>
						<div>{{meet.meetremarks}}</div>
					</div>
				</li>
			</ul>
		</div>

		<Modal
		v-if='false'
			v-model="visible"
			:title="currentMeetid === -1? '新增会议':'编辑会议'"
			@on-ok="meetAction"
			@on-cancel="cancel">
			<Form ref="formMeet" :model="formMeet" :label-width="88" >
				<FormItem label="会议名称：" prop="meetname">
					<Input  v-model="formMeet.meetname" placeholder="会议名称" autocomplete="off" />
				</FormItem>
				<FormItem label="说明：" prop="meetremarks">
					<Input v-model="formMeet.meetremarks" placeholder="说明" autocomplete="off" />
				</FormItem>
				<FormItem label="时间：" prop="meetremarks">
					<DatePicker style="width:100%" v-model="formMeet.datetimes" :value="formMeet.datetimes" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="请选择开始和结束日期"></DatePicker>
				</FormItem>

				<FormItem label="banner图 ：" v-show='currentMeetid>-1' prop="bannerurl">
					
					<div id="wm-upload" class="wm-upload">
						
					</div>
					<div class="wm-meeting-banner" v-if='formMeet.bannerurl' :style="{background:'url('+formMeet.bannerurl+') no-repeat center',backgroundSize:'contain'}">

					</div>
				</FormItem>

				<FormItem label="状态：" prop="status">
					<i-switch v-model="formMeet.status" size="large">
						<span slot="open">可用</span>
						<span slot="close">禁用</span>
					</i-switch>
				</FormItem>
			</Form>
		</Modal>

		 
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';
	import Vue from 'vue';
	

	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				content:"",
				showDetail:false,
				provinceList:[],
				visible:false,
				imgs:window.imgs,
				meetnameErr:false,
				
				isLoading:false,
				currentMeetid:-1,
				split1: 0.8,
				showPass:false,
				viewH:window.innerHeight,

				formMeet:{
					datetimes:[],
					cityids:[],
					status:true,
					bannerurl:'',
					url:''
				},
				meetList:[],
			 
				userinfo:{}
			}
		},
		components:{
		},
		watch:{
			visible(val){
				if(val && this.currentMeetid>-1){
					this.upload();
				}
			}
		},

		beforeCreate(){
			//var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

			///this.validate = validate;
		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			//this.getCityData();
			this.getmeetinglist();
			window.meeting = this;

			Vue.obserable.on('entyMeeting',()=>{
				this.showDetail = false;

			})
		},
		
		methods:{
			

			editMeet(meet,i){
				this.currentMeetid = meet.meetid;
				this.formMeet = meet;
				this.formMeet.meetname =  meet.meetname;
				this.formMeet.status = !!meet.status;
				this.formMeet.datetimes = [meet.startdate,meet.enddate];
				this.showDetail = true;
			},

			entry(e,index){
				Vue.obserable.on('getMeetName',()=>{
					return e.meetname;
				});
				
				this.$router.push("/meetingsignup/"+e.meetid+'/'+e.meetname);
			},
			 
			 
			delMeet(meetid){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/delmeet/',
					validate:s.validate,
					data:{
						meetid,
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
					},success(data){
						if(data.getret === 0){
							s.$Message.success(data.getmsg);
							s.getmeetinglist();
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},

			addNewAduser(){
				this.currentMeetid = -1;
				this.formMeet = {
					userpwd:'111111'
				};
				this.showDetail = true;
			},
			getmeetinglist(){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/getmeetlist/',
					//validate:s.validate,
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						pagenum:1000,
						status:-1,//查询全部
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							s.meetList = data.list;
							/* s.meetList = s.meetList.concat(s.meetList);
							s.meetList = s.meetList.concat(s.meetList);
							s.meetList = s.meetList.concat(s.meetList);
							s.meetList = s.meetList.concat(s.meetList); */
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},


			addadUser(){
			},
			meetAction(){
				var s = this;

				if(!this.formMeet.meetname){
					s.$Message.error('会议名称不能为空');
					return;
				}
				if(s.currentMeetid<=-1){	

					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/zmitiadmin/addmeet/',
						validate:s.validate,
						data:{
							adminuserid:s.userinfo.userid,
							admintoken:s.userinfo.accesstoken,
							meetname:s.formMeet.meetname,
							status:s.formMeet.status|0,
							meetremarks:s.formMeet.meetremarks,
							startdate:new Date(s.formMeet.datetimes[0]).toLocaleDateString().replace(/\//ig,'-'),
							enddate:new Date(s.formMeet.datetimes[1]).toLocaleDateString().replace(/\//ig,'-')
						},success(data){
							if(data.getret === 0){
								s.$Message.success(data.getmsg);
								s.getmeetinglist();
								s.showDetail = false;
							}
							else{
								s.$Message.error(data.getmsg);
							}
						}
	
					})
				}else{
					console.log(s.formMeet);
					
					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/zmitiadmin/updatemeet/',
						//validate:s.validate,
						data:{
							meetname:s.formMeet.meetname,
							meetname:s.formMeet.meetname,
							meetid:s.currentMeetid,
							adminuserid:s.userinfo.userid,
							admintoken:s.userinfo.accesstoken,
							status:s.formMeet.status|0,
							bannerurl:s.formMeet.url,
							meetremarks:s.formMeet.meetremarks,
							startdate:new Date(s.formMeet.datetimes[0]).toLocaleDateString().replace(/\//ig,'-'),
							enddate:new Date(s.formMeet.datetimes[1]).toLocaleDateString().replace(/\//ig,'-')
						 
							 
						},success(data){
							if(data.getret === 0){
								s.$Message.success(data.getmsg);
								s.showDetail = false;
							}
							else{
								s.$Message.error(data.getmsg);
							}
						}
	
					})
				}
				
			},
			cancel(){
				this.formMeet = {};
			}
		}
	}
</script>
 