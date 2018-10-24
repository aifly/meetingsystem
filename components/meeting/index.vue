<template>
	<div class="wm-meeting-main-ui">
		<header>
			<div>培训管理 {{showDetail?formMeet.meetid?'>编辑':'>新增':''}}</div>
			<section>
				<Button type="primary" icon='md-add-circle' v-if='!showDetail' @click="addNewAduser">新增培训</Button>
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
						<label for="">培训时间：</label>
						<DatePicker style="width:80%" v-model="formMeet.datetimes" :value="formMeet.datetimes" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="请选择开始和结束日期"></DatePicker>
					</div>
					<div class='wm-meet-form-error'></div>
				</div>
				
				<div class='wm-meet-form-item wm-meet-form-muli'>
					<div><label for="">说明：</label><textarea v-model='formMeet.meetremarks' type="textarea"></textarea></div>
				</div>
				<div class='wm-meet-banner-C'>
					<div>上传培训banner图（750*380）</div>
					<div class='wm-meet-banner-upload'>
						<div id="wm-upload" class="wm-upload">
							
						</div>
						<Icon type="md-add-circle" />
					</div>
					<div class='wm-meet-banner-img' @click='formMeet.bannerurl = ""'>
						<img v-if='formMeet.bannerurl' :src="formMeet.bannerurl" alt="">
						<span v-if='formMeet.bannerurl' class='wm-close'></span>
					</div>
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
					<div>是否开启培训报道</div>
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
						<img :src="imgs[meet.status === 1||meet.status ? 'enable':'disable']" alt="">
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
						<div>培训说明：</div>
						<div>{{meet.meetremarks}}</div>
						<div :title="meet.qrcode?'点击下载':'点击生成二维码'" @click="createQrcode(meet)"> 
							<a target='_blank' :href='meet.qrcode' v-if='meet.qrcode'>
								<img :src="meet.qrcode||imgs.createcode" alt="">
							</a>
							<img :src="meet.qrcode||imgs.createcode" alt="" v-else />
						</div>
					</div>
				</li>
			</ul>
		</div>

		 
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
			showDetail(val){
				if(val && this.currentMeetid>-1){
					
					setTimeout(() => {
						this.upload();
					}, 100);
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
			upload(){
				
				var s = this;
				
				 
				var p = {
						companyid:'company'+s.userinfo.companyid,
						projectclassname:'meetingsystem',
						projectsubclassname:'project'+s.currentMeetid,
						uploadpath:'2018upload',
						userid:s.userinfo.userid
				}
				this.p = p;
				if(s.uploader){
					s.uploader.destroy();
				}
				var accepts  =  s.accepts;
				var uploader = WebUploader.create({
					// 选完文件后，是否自动上传。
					auto: true,
					// swf文件路径
					swf: './webuploader-0.1.5/Uploader.swf',
					// 文件接收服务端。
					//server: 'http://api.zmiti.com/v2/fileupload',
					server: window.config.baseUrl+'/wmshare/uploadfile/',
					// 选择文件的按钮。可选。
					// 内部根据当前运行是创建，可能是input元素，也可能是flash.
					pick: '.wm-upload',
					chunked: true, //开启分片上传
					threads: 1, //上传并发数
					method: 'POST',
					compress:false,
					prepareNextFile:true,//是否允许在文件传输时提前把下一个文件准备好。 对于一个文件的准备工作比较耗时，比如图片压缩，md5序列化。 如果能提前在当前文件传输期处理，可以节省总体耗时。
					formData:p,
					accept:window.config.accepts[0],
					//dnd:'.wm-myreport-left',
					disableGlobalDnd :true,//是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
				});
				uploader.on('dndAccept',(file,a)=>{
					if(accepts[s.currentType].extensions.indexOf(file['0'].type.split('/')[1])<=-1){
						s.$Message.error('目前不支持'+file['0'].type.split('/')[1]+'文件格式');
					}
				})
				uploader.on("beforeFileQueued",function(file){
					/* if(accepts[s.currentType].extensions.indexOf(file['type'].split('/')[1])<=-1){
						s.$Message.error('当前文件格式不支持');
						return;
					} */
					 
				});
				s.uploader = uploader;
				// 当有文件添加进来的时候
				var i = 0;
				uploader.on('fileQueued', function (file) {
					uploader.upload();
					 
				});
				// 文件上传过程中创建进度条实时显示。
				/* uploader.on('uploadProgress', function (file, percentage) {
					
					var index = -1;
					var scale = (percentage * 100|0);
					 
				 
				}); */
				// 文件上传成功，给item添加成功class, 用样式标记上传成功。
				uploader.on('uploadSuccess', function (file,data) {
					if(data.getret === 0){
						s.formMeet.bannerurl = data.fileurl;
						s.formMeet.url = data.url;
					}
				//	$('#' + file.id).addClass('upload-state-done');
				});
				// 文件上传失败，显示上传出错。
				uploader.on('uploadError', function (file) {
					console.log('error')
					//$('#' + file.id).find('p.state').text('上传出错');
				});
				// 完成上传完了，成功或者失败，先删除进度条。
				var iNow = 0;
				uploader.on('uploadComplete', function (file) {
					console.log(file);
					if(file.getret === 0){
						s.formMeet.bannerurl = file.fileurl;
						s.formMeet.url = file.url;
					}
					iNow++;
					if(iNow === i){
						
					}
					//
				
				});
				
			},
			createQrcode(meet){
				if(meet.qrcode){
					return;
				}
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+ '/zmitiadmin/createmeetqrcode',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						meetid:meet.meetid,
						url:window.config.qrcodeUrl+'?meetid='+meet.meetid
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							meet.qrcode = data.qrcodeurl;
							s.meetList = s.meetList.concat([]);
						}
					}
				});

			},

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
					s.$Message.error('培训名称不能为空');
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
							status:1,//s.formMeet.status|0,
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
							bannerurl:s.formMeet.url||"",
							meetremarks:s.formMeet.meetremarks,
							startdate:new Date(s.formMeet.datetimes[0]).toLocaleDateString().replace(/\//ig,'-'),
							enddate:new Date(s.formMeet.datetimes[1]).toLocaleDateString().replace(/\//ig,'-'),
							ischecked:s.formMeet.ischecked|0,
							isreport:s.formMeet.isreport|0,
							issignup:s.formMeet.issignup|0

						 
							 
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
 