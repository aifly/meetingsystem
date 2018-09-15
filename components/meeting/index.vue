<template>
	<div class="wm-meeting-main-ui">
		<header>
			<div>会议管理</div>
			<section>
				<Button type="primary" icon='md-add-circle' @click="addNewAduser">新增会议</Button>
			</section>
		</header>
		<Table ref='scorelist'  :height='viewH - 64- 70 ' :data='userList' :columns='columns'   stripe></Table>

		<Modal
			v-model="visible"
			:title="currentUserId === -1? '新增用户':'编辑用户'"
			@on-ok="ok"
			@on-cancel="cancel">
			<Form ref="formAdmin" :model="formAdmin" :label-width="82" >
				<FormItem label="会议名称：" prop="username">
					<Input :disabled = 'currentUserId !== -1'  v-model="formAdmin.username" placeholder="会议名称" autocomplete="off" />
				</FormItem>
				<FormItem label="说明：" prop="meetremarks">
					<Input v-model="formAdmin.meetremarks" placeholder="说明" autocomplete="off" />
				</FormItem>
				<FormItem label="时间：" prop="meetremarks">
					<DatePicker style="width:100%" v-model="formAdmin.datetimes" :value="formAdmin.datetimes" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="请选择开始和结束日期"></DatePicker>
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
				provinceList:[],
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				currentUserId:-1,
				split1: 0.8,
				showPass:false,
				viewH:window.innerHeight,

				formAdmin:{
					datetimes:[],
					cityids:[]
				},
				userList:[],
				columns:[
					{
						title:"用户名",
						key:'meetname',
						align:'center'
						
					},
					{
						title:"说明",
						key:'meetremarks',
						align:'center'
					},{
						title:'操作',
						key:"action",
						align:'center',
						render:(h,params)=>{
							return h('div', [
                               
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
										margin: '2px 5px',
										border:'none',
										background:'#fab82e',
										color:'#fff',
										padding: '3px 7px 2px',
										fontSize: '12px',
										borderRadius: '3px'

                                    },
                                    on: {
                                        click: () => {
											this.currentUserId = params.row.userid;
											this.formAdmin = params.row;
											this.formAdmin.datetimes = [params.row.startdate,params.row.enddate];
											this.visible = true;
                                        }
                                    }
                                }, '编辑'),
                                h('Poptip',{
									props:{
										confirm:true,
										title:"确定要删除吗"
									},
									on:{
										'on-ok':()=>{
											this.delAdUser(params.row.meetid);
										},
										
									}
								},[
									h('Button', {
										props: {
											type: 'error',
											size: 'small'
										},
										on: {
											click: () => {
												
												//this.remove(params.index,params.row.employeeid)
											}
										}
									}, '删除')
								]), h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
										display:"none",
										margin: '2px 5px',
										border:'none',
										background:params.row.status*1 === 0 ? 'rgb(2, 29, 236)':'#b20000',
										color:'#fff',
										padding: '3px 7px 2px',
										fontSize: '12px',
										borderRadius: '3px'

                                    },
                                    on: {
                                        click: () => {
											/*this.currentUserId = params.row.userid;
											this.formAdmin = params.row;
											this.visible = true;*/

											this.checkUser(params);

											
                                        }
                                    }
                                }, params.row.status*1 === 1 ? '撤销':"审核"),
                            ]);
						}
					}
				],

				
				userinfo:{}
			}
		},
		components:{
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
		},
		
		methods:{
			 
			modifyPass(){
				if(!this.showPass){
					this.showPass = true;
					this.$refs['pass'].focus();

				}else{
					if(!this.formAdmin.userpwd){
						this.$Message.error('密码不能为空');
						return;
					}
					var s = this;
					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/zmitiadmin/updatestuedntpwd',
						data:{
							admintoken:s.userinfo.accesstoken,
							adminuserid:s.userinfo.userid,
							userid:s.formAdmin.userid,
							studentpwd:s.formAdmin.userpwd
						},
						success(data){
							s.$Message[data.getret === 0 ?'success':'error'](data.getmsg);
						}
					})
				}
			},
			delAdUser(meetid){
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
				this.currentUserId = -1;
				this.formAdmin = {
					userpwd:'111111'
				};
				this.visible = true;
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
							s.userList = data.list;
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},


			addadUser(){
			},
			ok(){
				var s = this;

				if(s.currentUserId<=-1){	

					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/zmitiadmin/addmeet/',
						validate:s.validate,
						data:{
							adminuserid:s.userinfo.userid,
							admintoken:s.userinfo.accesstoken,
							meetname:s.formAdmin.username,
							status:1,
							meetremarks:s.formAdmin.meetremarks,
							startdate:new Date(s.formAdmin.datetimes[0]).toLocaleDateString().replace(/\//ig,'-'),
							enddate:new Date(s.formAdmin.datetimes[1]).toLocaleDateString().replace(/\//ig,'-')
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
				}else{
					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/zmitiadmin/updatestuedntinfo/',
						//validate:s.validate,
						data:{
							username:s.formAdmin.username,
							studentname:s.formAdmin.studentname,
							userid:s.currentUserId,
							adminuserid:s.userinfo.userid,
							admintoken:s.userinfo.accesstoken,
							provinceid:s.formAdmin.cityids[0],
							cityid:s.formAdmin.cityids[1],
							areaid:s.formAdmin.cityids[2],
							detailaddress:s.formAdmin.detailaddress,
							mobile:s.formAdmin.mobile,
							email:s.formAdmin.email,
							companyname:s.formAdmin.companyname,
							 
						},success(data){
							if(data.getret === 0){
								s.$Message.success(data.getmsg);
							}
							else{
								s.$Message.error(data.getmsg);
							}
						}
	
					})
				}
				
			},
			cancel(){
				this.formUser = {};
			}
		}
	}
</script>
 