<template>
	<div class="wm-student-main-ui">
		<header>
			<div>学员管理</div>
			<section>
				<Button type="primary" icon='md-add-circle' @click="addNewAduser">新增学员</Button>
				<Input v-model="keyword" placeholder="请输入关键字(手机号、姓名、单位及职务)搜索" />
			</section>
		</header>
		<Form v-if='visible' class='wm-student-form wm-scroll' ref="formAdmin" :style="{height:viewH-150+'px'}"  :model="formAdmin" :label-width="86" >
				<FormItem label="手机号：" prop="mobile">
					<Input v-model="formAdmin.mobile" placeholder="手机号" autocomplete="off" />
				</FormItem>
				
				<FormItem label="姓名：" prop="studentname">
					<Input v-model="formAdmin.studentname" placeholder="姓名" autocomplete="off" />
				</FormItem>
				<FormItem label="性别：" prop="sex">
					<RadioGroup v-model="formAdmin.sex">
						<Radio :label="1">男</Radio>
						<Radio :label="0">女</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="密码：" prop="userpwd">
					<Input ref='pass' :disabled='!showPass' v-model="formAdmin.userpwd" placeholder="密码" autocomplete="off" />
					<Button :disabled='currentUserId ===-1' type="primary" style="margin-top:10px" @click='modifyPass'>{{showPass?'确定修改':'修改密码'}}</Button>
				</FormItem>
				
				<FormItem label="所属培训：" prop="mobile" v-if='!formAdmin.userid'>
					 <Select v-model="formAdmin.meetid">
				       <Option v-for="item in meetList" :value="item.meetid" :key="item.meetid">{{ item.meetname }}</Option>
				    </Select>
				</FormItem>	

				<FormItem label="所属小组：" prop="mobile" v-if='!formAdmin.userid'>
					 <Select v-model="formAdmin.groupid">
				       <Option v-for="item in groupList" :value="item.groupid+''" :key="item.groupid">{{ item.groupname }}</Option>
				    </Select>
				</FormItem>				
			
				<FormItem label="民族：" prop="nation">
					<Input v-model="formAdmin.nation" placeholder="民族" autocomplete="off" />
				</FormItem>
				<FormItem label="出生年月：" prop="birthdate">
					<!-- <DatePicker v-model="formAdmin.birthdate" type="month" placeholder="出生年月" style="width:100%;"></DatePicker> -->
					<Input v-model="formAdmin.birthdate" placeholder="出生年月" autocomplete="off" />
				</FormItem>
				<FormItem label="文化程度：" prop="education">
					<Input v-model="formAdmin.education" placeholder="文化程度" autocomplete="off" />
				</FormItem>
				<FormItem label="任职时间：" prop="tenuretime">
					<!-- <DatePicker v-model="formAdmin.tenuretime" type="date" placeholder="任职时间" style="width:100%;"></DatePicker> -->
					<Input v-model="formAdmin.tenuretime" placeholder="任职时间" autocomplete="off" />
				</FormItem>

				<FormItem label="单位及职务：" prop="companyname">
					<Input v-model="formAdmin.companyname" placeholder="单位及职务" autocomplete="off" />
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

				<FormItem label="" prop="studentname" style="text-align:right">
					<Button type="default" @click="visible=false">返回</Button>
					<Button type="primary" @click="ok">确定</Button>
				</FormItem>


				<FormItem label="" prop="studentname" >
					<Card>
						<p slot="title">所属会议</p>
						<p v-for="(stu,u) in studentObj.info" :key="u">
							{{stu.meetname}}
						</p>
					</Card>

				</FormItem>



			</Form>
		<Table ref='scorelist' v-else  :height='viewH - 64- 70 ' :data='userList' :columns='columns'   stripe></Table>

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
				keyword:'',
				provinceList:[],
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				currentUserId:-1,
				split1: 0.8,
				showPass:false,
				groupList:[],
				viewH:window.innerHeight,
				studentObj:{
					info:[]
				},

				formAdmin:{
					userpwd:'111111',
					cityids:[]
				},
				meetList:[],
				userList:[],
				columns:[
					{
						title:"姓名",
						key:'studentname',
						align:'center'
					},{
						title:"性别",
						key:'sex',
						align:'center',
						render:(h,params)=>{
							return h('div',{},params.row.sex === 0? '男':'女');
						}
					},{
						title:"省份",
						key:'provincename',
						align:'center'
					},{
						title:"民族",
						key:'nation',
						align:'center'
					},{
						title:"手机号",
						key:'mobile',
						align:'center'
					},{
						title:"单位及职务",
						key:'companyname',
						align:'center'
					}
					,{
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
											this.studentObj = {
												info:[]
											};
											this.currentUserId = params.row.userid;
											this.formAdmin = params.row;
											this.formAdmin.cityids = [params.row.provinceid*1,params.row.cityid*1,params.row.areaid*1];
											this.visible = true;
											var s = this;
											symbinUtil.ajax({
												url:window.config.baseUrl+'/zmitiadmin/getstudentinfo',
												data:{
													admintoken:s.userinfo.accesstoken,
													adminuserid:s.userinfo.userid,
													userid:params.row.userid,
												},
												success(data){
													
													if(data.getret === 0){
														s.studentObj = data.list;
													}
												}
											})
                                        }
                                    }
                                }, '编辑'),
                                h('Poptip',{
									props:{
										confirm:true,
										title:"确定要删除吗"
									},
									style:{
										display:'none'
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
			this.getGroupList();

			
		},
		watch:{
			keyword(val){
				if(val){
					this.userList = this.defaultUserList.filter((item,i)=>{
						return item.studentname.indexOf(val)>-1 ||item.companyname.indexOf(val)>-1||item.mobile.indexOf(val)>-1;
					})
				}else{
					this.userList = this.defaultUserList.concat([]);
				}
			}
		},
		
		methods:{
			getGroupList(){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/getusergrouplist',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
					},
					success(data){
						if(data.getret === 0){
							s.groupList = data.list;
						}
					}
				})
			},
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
						url:window.config.baseUrl+'/zmitiadmin/updatestudentpwd',
						data:{
							admintoken:s.userinfo.accesstoken,
							adminuserid:s.userinfo.userid,
							userid:s.formAdmin.userid,
							studentpwd:s.formAdmin.userpwd
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
						//meetid:'2072951143',
						pagenum:1000,
						status:-1,//查询全部
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							s.userList = data.list;
							s.defaultUserList = s.userList.concat([]);
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
							sex:s.formAdmin.sex,
							groupid:s.formAdmin.groupid,
							cityid:s.formAdmin.cityids[1],
							areaid:s.formAdmin.cityids[2],
							detailaddress:s.formAdmin.detailaddress,
							nation:s.formAdmin.nation,
							birthdate:s.formAdmin.birthdate,
							education:s.formAdmin.education,
							tenuretime:s.formAdmin.tenuretime,

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
						url:window.config.baseUrl+'/zmitiadmin/updatestudentinfo/',
						//validate:s.validate,
						data:{
							username:s.formAdmin.username,
							studentname:s.formAdmin.studentname,
							meetid:s.formAdmin.meetid,
							job:s.formAdmin.job,
							sex:s.formAdmin.sex,
							userid:s.currentUserId,
							adminuserid:s.userinfo.userid,
							admintoken:s.userinfo.accesstoken,
							groupid:s.formAdmin.groupid,
							provinceid:s.formAdmin.cityids[0],
							cityid:s.formAdmin.cityids[1],
							areaid:s.formAdmin.cityids[2],
							detailaddress:s.formAdmin.detailaddress,
							mobile:s.formAdmin.mobile,
							email:s.formAdmin.email,
							companyname:s.formAdmin.companyname,
							nation:s.formAdmin.nation,
							birthdate:s.formAdmin.birthdate,
							education:s.formAdmin.education,
							tenuretime:s.formAdmin.tenuretime,
							 
						},success(data){
							if(data.getret === 0){
								s.$Message.success(data.getmsg);
								
								s.visible = false;
								s.getstudentlist();
							}
							else if(data.getret === 1001){
								s.$Message.success('学员信息修改成功');
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
 