<template>
	<div class="wm-rater-main-ui">
		<header>
			<div>教师管理</div>
			<section>
				<Button type="primary" icon='md-add-circle' @click="addRater">新增教师</Button>
			</section>
		</header>
		<Table ref='scorelist'  :height='viewH - 64- 70 ' :data='teacherList' :columns='columns'   stripe></Table>
		<Modal
			v-model="visible"
			:title="teacherid === -1? '新增教师':'编辑教师'"
			@on-ok="ok"
			@on-cancel="cancel">
			<Form ref="formAdmin" :model="formAdmin" :label-width="72" >
				<FormItem label="账号：" prop="accounts">
					<Input style="width:310px;" v-model="formAdmin.accounts" placeholder="账号" autocomplete="off" />
					<RadioGroup v-model="formAdmin.sex">
						<Radio :label="1">
							<span>男</span>
						</Radio>
						<Radio :label="0">
							<span>女</span>
						</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="密码：" prop="teacherpwd">
					<Input ref='pass' :disabled='!showPass' v-model="formAdmin.teacherpwd" placeholder="密码" autocomplete="off" />
					<Button :disabled='teacherid === -1' type="primary" style="margin-top:10px" @click='modifyPass'>{{showPass?'确定修改':'修改密码'}}</Button>
				</FormItem>
				<FormItem label="姓名：" prop="realname">
					<Input v-model="formAdmin.realname" placeholder="姓名" autocomplete="off" />
				</FormItem>
				<FormItem label="电话：" prop="mobile">
					<Input v-model="formAdmin.mobile" placeholder="电话" autocomplete="off" />
				</FormItem>
				<FormItem label="邮箱：" prop="email">
					<Input v-model="formAdmin.email" placeholder="邮箱" autocomplete="off" />
				</FormItem>
				<FormItem label="单位：" prop="companyname">
					<Input v-model="formAdmin.companyname" placeholder="单位" autocomplete="off" />
				</FormItem>
				<FormItem label="职务：" prop="job">
					<Input v-model="formAdmin.job" placeholder="职务" autocomplete="off" />
				</FormItem>
			</Form>
		</Modal>
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';
	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				split1: 0.8,
				showPass:false,
				viewH:window.innerHeight,
				teacherid:-1,
				formAdmin:{
					teacherpwd:'111111'
				},
				columns:[					
					{
						title:"姓名",
						key:'realname',
						align:'center'
					},{
						title :'手机号',
						key:'mobile',
						align:'center'
					},{
						title:'性别',
						key:'sex',
						align:'center',
						render:(h,params)=>{
							return h('div',{},params.row.sex === 1 ? '男':'女')
						}
					},{
						title:'所在单位',
						key:'companyname',
						align:'center'
					},{
						title:'职务',
						key:'job',
						align:'center'
					},{
						title:'备注',
						key:'remark',
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
											this.formAdmin = params.row;
											this.teacherid = params.row.teacherid;
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
											this.delTeacher(params.row.teacherid);
										},
										
									}
								},[
									h('Button', {
										props: {
											type: 'error',
											size: 'small',
										},
										on: {
											click: () => {
												
												//this.remove(params.index,params.row.employeeid)
											}
										}
									}, '删除')
								]),
                            ]);
						}
					}
				],
				teacherList:[],
				
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
			this.getTeacherList();
			window.teacher = this;
		},
		
		methods:{
			modifyPass(){
				if(!this.showPass){
					this.showPass = true;
					this.$refs['pass'].focus();
				}else{
					if(!this.formAdmin.teacherpwd){
						this.$Message.error('密码不能为空');
						return;
					}
					var s = this;
					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/zmitiadmin/updateteacherpwd',
						data:{
							admintoken:s.userinfo.accesstoken,
					    	adminuserid:s.userinfo.userid,
							teacherid:s.teacherid,
							teacherpwd:s.formAdmin.teacherpwd
						},
						success(data){
							s.$Message[data.getret === 0 ?'success':'error'](data.getmsg);
						}
					})
				}
			},
			addRater(){
				this.formAdmin = {
					teacherpwd:'111111'
				}
				this.teacherid = -1;
				this.visible = true;
			},
			getTeacherList(){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/getteacherlist/',
					//validate:s.validate,
					data:{
						admintoken:s.userinfo.accesstoken,
					    adminuserid:s.userinfo.userid,
					    pagenum:1000
					},success(data){
						if(data.getret === 0){
							s.teacherList = data.list;
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}
				})
			},
			delTeacher(teacherid){
				
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/delteacher/',
					validate:s.validate,
					data:{
						teacherid,
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
					},success(data){
						if(data.getret === 0){
							s.$Message.success(data.getmsg);
							s.getTeacherList();
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}
				})
			},
			
			ok(){
				
				var s = this;
				if(s.teacherid<=-1){
					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/zmitiadmin/addteacher/',
						validate:s.validate,
						data:{
							accounts:s.formAdmin.accounts,
							teacherpwd:s.formAdmin.teacherpwd,
							admintoken:s.userinfo.accesstoken,
							adminuserid:s.userinfo.userid,
							sex:s.formAdmin.sex,
							email:s.formAdmin.email,
							nickname:s.formAdmin.nickname,
							mobile:s.formAdmin.mobile,
							realname:s.formAdmin.realname,
							companyname:s.formAdmin.companyname,
							job:s.formAdmin.job,
						},success(data){
							if(data.getret === 0){
								s.$Message.success(data.getmsg);
								s.getTeacherList();
							}
							else{
								s.$Message.error(data.getmsg);
							}
						}
	
					})
				}else{
					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/zmitiadmin/updateteacherinfo/',
						validate:s.validate,
						data:{
							accounts:s.formAdmin.accounts,
							teacherpwd:s.formAdmin.teacherpwd,
							admintoken:s.userinfo.accesstoken,
							adminuserid:s.userinfo.userid,
							sex:s.formAdmin.sex,
							email:s.formAdmin.email,
							nickname:s.formAdmin.nickname,
							mobile:s.formAdmin.mobile,
							realname:s.formAdmin.realname,
							teacherid:s.teacherid,
							companyname:s.formAdmin.companyname,
							job:s.formAdmin.job,
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