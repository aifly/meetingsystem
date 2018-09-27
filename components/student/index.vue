<template>
	<div class="wm-student-main-ui">
		<header>
			<div>学员管理</div>
			<section>
				<Button type="primary" icon='md-add-circle' @click="addNewAduser">新增学员</Button>
			</section>
		</header>
		<Table ref='scorelist'  :height='viewH - 64- 70 ' :data='userList' :columns='columns'   stripe></Table>

		<Modal
			v-model="visible"
			:title="currentUserId === -1? '新增用户':'编辑用户'"
			@on-ok="ok"
			@on-cancel="cancel">
			<Form ref="formAdmin" :model="formAdmin" :label-width="82" >
				<FormItem label="手机号：" prop="mobile">
					<Input v-model="formAdmin.mobile" placeholder="手机号" autocomplete="off" />
				</FormItem>
				
				<FormItem label="姓名：" prop="studentname">
					<Input v-model="formAdmin.studentname" placeholder="姓名" autocomplete="off" />
				</FormItem>
				<FormItem label="密码：" prop="userpwd">
					<Input ref='pass' :disabled='!showPass' v-model="formAdmin.userpwd" placeholder="密码" autocomplete="off" />
					<Button :disabled='currentUserId ===-1' type="primary" style="margin-top:10px" @click='modifyPass'>{{showPass?'确定修改':'修改密码'}}</Button>
				</FormItem>
				
				<FormItem label="所属会议：" prop="mobile">
					 <Select v-model="formAdmin.meetid">
				       <Option v-for="item in meetList" :value="item.meetid" :key="item.meetid">{{ item.meetname }}</Option>
				    </Select>
				</FormItem>				

			
				<FormItem label="职务：" prop="job">
					<Input v-model="formAdmin.job" placeholder="职务" autocomplete="off" />
				</FormItem>

				<FormItem label="公司名称：" prop="companyname">
					<Input v-model="formAdmin.companyname" placeholder="公司名称" autocomplete="off" />
				</FormItem>
				
				<FormItem label="邮箱：" prop="email">
					<Input v-model="formAdmin.email" placeholder="邮箱" autocomplete="off" />
				</FormItem>
				<FormItem label="地址：" prop="cityids">
					<Cascader v-model="formAdmin.cityids"  :load-data="getCityById"  change-on-select :data='provinceList'></Cascader>
				</FormItem>

				<FormItem label="详细地址：" prop="studentname">
					<Input type="textarea" v-model="formAdmin.detailaddress"></Input>
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
					userpwd:'111111',
					cityids:[]
				},
				meetList:[],
				userList:[],
				columns:[
					{
						title:"用户名",
						key:'username',
						align:'center'
						
					},
					{
						title:"昵称",
						key:'studentname',
						align:'center'
					},{
						title:"职务",
						key:'job',
						align:'center'
					},{
						title:"省份",
						key:'name',
						align:'center'
					},{
						title:"手机号",
						key:'mobile',
						align:'center'
					}
					/* ,{
						title:"状态",
						key:'status',
						align:'center',
						render(h,params){
							return h('div',{},params.row.status ===1?'已审核':'未审核')
						}
					} */,{
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
											this.formAdmin.cityids = [params.row.provinceid*1,params.row.cityid*1,params.row.areaid*1];
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
											this.delAdUser(params.row.userid);
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
			var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

			this.validate = validate;
		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			this.getCityData();
			this.getmeetlist();
			this.getstudentlist();
		},
		
		methods:{
			getCityById(e,callback){
				
				var provinceId = e.__value.split(',')[0];
				var cityid = e.__value.split(',')[1];
				var s = this;

				
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/meetshare/getarealist',
					data:{
						cityid
					},
					success(data){
						if(data.getret === 0){
							console.log(data);
							s.provinceList.forEach((item,i)=>{
								if(item.value === provinceId*1){
									item.children.forEach((child,k)=>{
										if(child.value === cityid*1){
											child.children = child.children || [];
											data.list.map((d,l)=>{
												child.children.push({
													value:d.cityid,
													label:d.name,
													//loading: false
												})
											})
											
										}
									})
									callback();
									
								}
								
							});
							

						}
					}

				})
			},
			getCityData(){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/meetshare/getcitylist/',
					data:{},
					success(data){
						//console.log(data);
						if(data.getret === 0){
							data.list.map((item,i)=>{
								var children = [];
								item.children && item.children.map((child,l)=>{
									children.push({
										value:child.cityid,
										label:child.name,
										loading: false,
										children:[]
										
									})
								})
								s.provinceList.push({
									value:item.cityid,
									label:item.name,
									children,
									loading: false
								})
							})
						}
					}
				})
			},
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
						s.getstudentlist();
					}

				})
			},

			getmeetlist(){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/getmeetlist',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
					},
					success(data){
						if(data.getret === 0){
							s.meetList = data.list;
						}
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
			delAdUser(userid){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/delstudent/',
					validate:s.validate,
					data:{
						userid,
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
					},success(data){
						if(data.getret === 0){
							s.$Message.success(data.getmsg);
							s.getstudentlist();
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
			getstudentlist(){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/getstudentlist/',
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
						url:window.config.baseUrl+'/zmitiadmin/addstudent/',
						validate:s.validate,
						data:{
							adminuserid:s.userinfo.userid,
							studentpwd:s.formAdmin.userpwd,
							admintoken:s.userinfo.accesstoken,
							username:s.formAdmin.mobile,
							mobile:s.formAdmin.mobile,
							companyname:s.formAdmin.companyname,
							studentname:s.formAdmin.studentname,
							email:s.formAdmin.email,
							provinceid:s.formAdmin.cityids[0],
							meetid:s.formAdmin.meetid,
							job:s.formAdmin.job,
							cityid:s.formAdmin.cityids[1],
							areaid:s.formAdmin.cityids[2],
							detailaddress:s.formAdmin.detailaddress
						},success(data){
							if(data.getret === 0){
								s.$Message.success(data.getmsg);
								s.getstudentlist();
							}
							else{
								s.$Message.error(data.getmsg);
							}
						}
	
					})
				}else{
					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/zmitiadmin/updatestudentinfo/',
						//validate:s.validate,
						data:{
							username:s.formAdmin.username,
							studentname:s.formAdmin.studentname,
							meetid:s.formAdmin.meetid,
							job:s.formAdmin.job,
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
 