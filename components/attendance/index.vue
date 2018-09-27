<template>
	<div class="wm-attendance-ui">
		<div>
			<Tab :refresh="refresh"></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>考勤请假管理</div>
				<div>
					<Button type="primary" v-if='false'>新增课程</Button>
				</div>
			</header>
			<div class="wm-attendance-wrap" >
				<div class="wm-attendance-list">
					<Table :disabled-hover='true' ref='scorelist' :border='false'  :height='viewH - 64- 72 ' :data='attendanceList' :columns='columns'   stripe></Table>
				</div>

			</div>
			
		</div>
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';
	import Vue from 'vue';

	import Tab from '../commom/tab/index';
	

	var status = [
		{
			id:0,
			name:'未签到'
		},
		{
			id:1,
			name:'已签到'
		},{
			id:2,
			name:'请假未审批'
		},{
			id:3,
			name:'请假已通过审批'
		},{
			id:4,
			name:'打卡异常'
		}
	];

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
				attendanceList:[],
				viewH:window.innerHeight,
				columns:[
					{
						title:"学员姓名",
						key:'studentname',
						align:'center'
						
					},
					{
						title:'课程名称',
						key:'title',
						align:'center'
					},
					{
						title:'状态',
						key:'content',
						align:'center',
						render:(h,params)=>{
							return h('div',{},status[params.row.status].name);
						}
					},{
						title:'事由',
						key:'excuse',
						align:'center',
						render(h,params){
							return h('div',{},params.row.excuse||'暂无');
						}
					}
				],
				formAdmin:{
					userpwd:'111111',
					cityids:[]
				},
				userList:[],
				 

				
				userinfo:{}
			}
		},
		components:{
			Tab
		},

		beforeCreate(){
			//var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

			///this.validate = validate;
		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			this.getAttendanceList();
		},
		
		methods:{
			 
			refresh(){

			},
			getAttendanceList(){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/getsigncourselist/',
					//validate:s.validate,
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						pagenum:1000,
						
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							s.attendanceList = data.list;
							for(var i = 0;i<5;i++){
								s.attendanceList = s.attendanceList.concat(s.attendanceList);
							}
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},
 
 
		}
	}
</script>
 