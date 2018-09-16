<template>
	<div class="wm-signup-ui lt-full">
		<div>
			<Tab></Tab>
		</div>
		<div class="wm-tab-content">
			<div v-if='currentUserId<=-1'>
				<Table ref='scorelist' @on-row-click='entry'  :height='viewH - 64- 70 ' :data='userList' :columns='columns'   stripe></Table>
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
				currentUserId:1,

				columns:[
					{
						title:"用户名",
						key:'username',
						align:'center'
						
					},
					{
						title:'是否签到',
						key:'issign',
						align:'center',
						render:(h,params)=>{
							return h('div',{},params.row.issign===0 ?'未签到':'已签到');
						}

					},
					{
						title:'状态',
						key:'status',
						align:'center',
						render:(h,params)=>{
							
							return h('div',{},params.row.status===0 ?'未审核':params.row.status ===  1 ?'已审核':'未通过');
						},
					}
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

			console.log(this.userinfo);

			this.getsignupList();
			
		},
		
		methods:{

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
							s.formUser = s.userList[0];
						}
					}
				})
			}
		
		}
	}
</script>
 