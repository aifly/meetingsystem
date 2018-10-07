<template>
	<div class="wm-adminuser-main-ui">
		<header>
			<div>管理员管理</div>
			<section>
				<Button type="primary" icon='md-add-circle' @click="addNewAduser">新增员管理</Button>
			</section>
		</header>
		<Table ref='scorelist'  :height='viewH - 64- 70 ' :data='userList' :columns='columns'   stripe></Table>

		<Modal
			v-model="visible"
			:title="currentUserId === -1? '新增用户':'编辑用户'"
			@on-ok="ok"
			@on-cancel="cancel">
			<Form ref="formAdmin" :model="formAdmin" :label-width="72" >
				<FormItem label="账号：" prop="ratername">
					<Input :disabled = 'currentUserId !== -1'  v-model="formAdmin.username" placeholder="账号" autocomplete="off" />
				</FormItem>
				<FormItem label="密码：" prop="userpwd">
					<Input ref='pass' :disabled='!showPass' v-model="formAdmin.userpwd" placeholder="密码" autocomplete="off" />
					<Button :disabled='currentUserId ===-1' type="primary" style="margin-top:10px" @click='modifyPass'>{{showPass?'确定修改':'修改密码'}}</Button>
				</FormItem>
				<FormItem label="昵称：" prop="realname">
					<Input v-model="formAdmin.realname" placeholder="昵称" autocomplete="off" />
				</FormItem>
				<FormItem label="手机号：" prop="usermobile">
					<Input v-model="formAdmin.usermobile" placeholder="手机号" autocomplete="off" />
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
				editorOption:{
					modules:{
                        toolbar:[
						  ['bold', 'italic', 'underline','code', 'strike','color','link'],        // toggled buttons
						  [{size:['small',false,'large','huge','12']}],//'12','14',false,'16','18','20','22','24'
						  [{ 'color': [] }],
						  [{ 'align': [] }],
						  [{list:'ordered'},{list:'bullet'}],
                          ['code-block','image','video','clean']
                        ]
                    }
				},
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				currentUserId:-1,
				split1: 0.8,
				showPass:false,
				viewH:window.innerHeight,

				formAdmin:{
					userpwd:'111111'
				},
				userList:[],
				columns:[
					{
						title:"用户名",
						key:'username',
						align:'center'
						
					},
					{
						title:"昵称",
						key:'realname',
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
											this.delAdmin(params.row.userid);
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
										margin: '2px 5px',
										border:'none',
										background:params.row.status*1 === 0 ? 'rgb(2, 29, 236)':'#b20000',
										color:'#fff',
										padding: '3px 7px 2px',
										fontSize: '12px',
										borderRadius: '3px',
										display:'none'

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
			this.getAdminList();


		},
		
		methods:{
			checkUser(params){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/wmadadmin/checkregistuser?t=1',
					data:{
						admintoken:s.userinfo.admintoken,
						adminusername:s.userinfo.adminusername,
						userids:params.row.userid,
						status:params.row.status === 1 ? 0 : 1,
					},
					success(data){
						console.log(data);
						s.$Message[data.getret === 0 ? "success":"error"](data.getmsg);
						s.getAdminList();
					}

				})
			},

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
						url:window.config.baseUrl+'/zmitiadmin/updateadminpwd',
						data:{
							admintoken:s.userinfo.accesstoken,
							adminuserid:s.userinfo.userid,
							userid:s.formAdmin.userid,
							userpwd:s.formAdmin.userpwd
						},
						success(data){
							s.$Message[data.getret === 0 ?'success':'error'](data.getmsg);
							if(data.getret === 0){
								s.visible = false;
							}
						}
					})
				}
			},
			delAdmin(userid){
				
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/deladmin/',
					validate:s.validate,
					data:{
						userid,
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
					},success(data){
						if(data.getret === 0){
							s.$Message.success(data.getmsg);
							s.getAdminList();
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
			getAdminList(){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/getadminlist/',
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
						url:window.config.baseUrl+'/zmitiadmin/addadmin/',
						validate:s.validate,
						data:{
							adminuserid:s.userinfo.userid,
							admintoken:s.userinfo.accesstoken,
							userpwd:s.formAdmin.userpwd,
							username:s.formAdmin.username,
							realname:s.formAdmin.realname,
							usermobile:s.formAdmin.usermobile,
							usertypesign:2,
						},success(data){
							if(data.getret === 0){
								s.$Message.success(data.getmsg);
								//s.getAdminList();
							}
							else{
								s.$Message.error(data.getmsg);
							}
						}
	
					})
				}else{
					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/wmadadmin/editaduser/',
						validate:s.validate,
						data:{
							username:s.formAdmin.username,
							studentname:s.formAdmin.studentname,
							userid:s.currentUserId,
							admintoken:s.userinfo.admintoken,
							adminusername:s.userinfo.adminusername
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
 