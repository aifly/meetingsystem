<template>
	<div class="wm-signup-ui lt-full">
		<div>
			<Tab :refresh='refresh'></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>学员报名管理</div>
				<div class='wm-header-right-action'>
					<div>
						<Button size='small' @click='addStudent' type="primary" icon='ios-add-circle'>新增学员</Button>
						<Button size='small' @click='exportData' type="primary" icon='md-cloud-upload'>导出</Button>
					</div>
					<div>
						<Input v-model='keyword' placeholder="请输入学员姓名或者电话" class='wm-signup-search'/>
					</div>
				</div>
			</header>
			<div v-if='currentUserId<=-1'>
				
				<Table ref='scorelist'   :height='viewH - 64- 72 ' :data='userList' :columns='columns'   stripe></Table>
			</div>
			<div v-else class="wm-signup-wrap">
				<div class="wm-signup-item">
					<div>用户名：</div> <div>{{formUser.username}}</div>
				</div>
				<div class="wm-signup-item">
					<div>昵称：</div> <div>{{formUser.nickname}}</div>
				</div>
				<div class="wm-signup-item">
					<div>省份：</div><div>{{formUser.provinceid[0].name}}</div>
				</div>
				<div class="wm-signup-item">
					<div>手机号：</div><div>{{formUser.mobile}}</div>
				</div>

				<div class="wm-signup-item">
					<div>职位：</div><div>{{formUser.job}}</div>
				</div>

				<div class="wm-signup-item">
					<div>座机号：</div><div>{{formUser.telphone}}</div>
				</div>

				<div class="wm-signup-item">
					<div>邮箱：</div><div>{{formUser.email}}</div>
				</div>
				
				<div class="wm-signup-item">
					<div>性别：</div><div>{{formUser.sex?'女':'男'}}</div>
				</div>
				<div class="wm-signup-item">
					<div>是否签到：</div><div>{{formUser.issign?'是':'否'}}</div>
				</div>

				<div class="wm-signup-item">
					<div>状态：</div><div>{{formUser.status?'已审核':'未审核'}}</div>
				</div>

				


				
			</div>
		</div>
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import Tab from '../commom/tab/index';
	import symbinUtil from '../lib/util';
	/**
	 * 学员报名管理、
	 */
	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				visible:false,
				imgs:window.imgs,
				showPassWord:false,
				isLoading:false,
				showDetail:false,
				userError:"",
				companyError:"",
				usernameError:"",
				viewH:window.innerHeight,
				passError:"",
				repassError:"",
				mobileError:"",
				currentUserId:-1,
				keyword:"",

				columns:[
					{
						title:"姓名",
						key:'studentname',
						align:'center'
						
					},{
						title:"电话",
						key:'mobile',
						align:'center'
						
					},{
						title:"省/市",
						key:'provincename',
						align:'center'
						
					},
					{
						title:"公司",
						key:'companyname',
						align:'center'
						
					},{
						title:"职务",
						key:'job',
						align:'center'
						
					},
					{
						title:'审核状态',
						key:'status',
						align:'center',
						render:(h,params)=>{
							
							return h('div',[
								h('Icon',{
									style:{
										cursor:'pointer',
										fontSize:'20px',
										color:params.row.status===0?'#f90':'#5c6b77'
									},
									props:{
										type:params.row.status===0?'ios-alert':'ios-alert-outline'
									}
								},1),
								h('Icon',{
									style:{
										cursor:'pointer',
										fontSize:'20px',
										color:params.row.status===1?'green':'#5c6b77'
									},
									props:{
										type:params.row.status===1?'ios-checkmark-circle':'ios-checkmark-circle-outline'
									}
								},'3'),
								h('Icon',{
									style:{
										cursor:'pointer',
										fontSize:'20px',
										color:params.row.status===2?'#be0000':'#5c6b77'
									},
									props:{ 
										type:params.row.status===2?'ios-remove-circle':'ios-remove-circle-outline'
									}
								},'2')
								
							],'1')
								
						},
					}
					/* ,{
						title:'操作',
						key:'action',
						width:200,
						align:'center',
						render(h,params){
							return h('div', {
								
							},[
                               
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
											//this.currentUserId = params.row.userid;
											//this.formAdmin = params.row;
											//this.formAdmin.cityids = [params.row.provinceid*1,params.row.cityid*1,params.row.areaid*1];
											//this.visible = true;
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
								]), 
								h('Button', {
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
										borderRadius: '3px'

                                    },
                                    on: {
                                        click: () => {
											//this.currentUserId = params.row.userid;
											//this.formAdmin = params.row;
											//this.visible = true;

											//this.checkUser(params);

											
                                        }
                                    }
                                }, '详情'),
							]);
						}
					} */
				],

				userList:[
					 
				],
				formUser:{
				 
				},
				userinfo:{}
			}
		},
		components:{
			Tab
		},

		beforeCreate(){
			var validate = sysbinVerification.validate(this);
			this.validate = validate;
			
		},
		mounted(){
			
			this.userinfo = symbinUtil.getUserInfo();
			this.getsignupList();
			
		},
		watch:{
			keyword(val){
				if(val){
					this.userList = this.defaultUserList.filter((item)=>{
						return item.mobile.indexOf(val)>-1 || item.studentname.indexOf(val)>-1;
					})
				}else{
					this.userList = this.defaultUserList.concat([]);
				}
			}
		},
		
		methods:{

			addStudent(){//添加学员。

			},
			
			exportData(){
				this.$refs.scorelist.exportCsv({
					filename: '学员报名管理'
				});
			},

			refresh(){
				this.getsignupList();
				this.currentUserId =  -1;
			},
			entry(e){
				this.currentUserId = e.userid;
				
			},

			getsignupList(){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/getmeetstudentlist',
					data:{
						adminuserid:s.userinfo.userid,
						admintoken:s.userinfo.accesstoken,
						meetid:s.$route.params.meetid
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							s.userList = data.list;
							s.defaultUserList = s.userList.concat([]);
							s.formUser = s.userList[0];
						}
					}
				})
			}
		
		}
	}
</script>
 