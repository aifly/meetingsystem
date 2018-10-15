<template>
	<div class="wm-attendance-ui">
		<div>
			<Tab :refresh="refresh"></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>考勤请假管理  <span v-if='name'>>{{name}}</span> </div>
				<div class='wm-header-tabs'>
					<h2 style='height:10px;'></h2>
					
				</div>
				<div>
					<Input v-model="keyword" placeholder="请输入学员姓名"/>
				</div>
			</header>
			<div class="wm-attendance-wrap" v-if='currentCourseId<=-1'>
				<Row type='flex'   class='wm-attendance-statistics-C' >
					<Col span='6'>
						<div class='wm-attendance-statistics-title'>请假待批</div>
						<Row type='flex'>
							<Col class='wm-attendance-statistics-count' span='12'>{{countInfo.totalno||0}}</Col>
							<Col span='12' class='wm-attendance-statistics-detail'><span  @click='getDetail("status",2,"请假待批")'>详情>></span><span style='opacity:0;'>22</span></Col>
						</Row>
					</Col>
					<Col span='6'>
						<div class='wm-attendance-statistics-title'>请假已批</div>
						<Row type='flex'>
							<Col class='wm-attendance-statistics-count' span='12'>{{countInfo.totalyes||0}}</Col>
							<Col span='12' class='wm-attendance-statistics-detail' ><span  @click='getDetail("status",3,"请假已批")'>详情>></span><span style='opacity:0;'>22</span></Col>
						</Row>
					</Col>
					<Col span='6'>
						<div class='wm-attendance-statistics-title'>请假驳回</div>
						<Row type='flex'>
							<Col class='wm-attendance-statistics-count' span='12'>{{countInfo.totalreject||0}}</Col>
							<Col span='12' class='wm-attendance-statistics-detail' ><span  @click='getDetail("status",5,"请假驳回")'>详情>></span><span style='opacity:0;'>22</span></Col>
						</Row>
					</Col>
					<Col span='6'>
						<div class='wm-attendance-statistics-title'>考勤异常</div>
						<Row type='flex'>
							<Col class='wm-attendance-statistics-count' span='12'>{{countInfo.totalnormal||0}}</Col>
							<Col span='12' class='wm-attendance-statistics-detail' ><span  @click='getDetail("status",4,"考勤异常")'>详情>></span><span style='opacity:0;'>22</span></Col>
						</Row>
					</Col>			
				</Row>
				<div class="wm-attendance-list" >
					<Table :disabled-hover='true' ref='scorelist' :border='false'  :height='viewH - 64- 72 -174 ' :data='attendanceList' :columns='columns'   stripe></Table>
				</div>
			</div>
			<div v-else class='wm-attendance-course-list'>
				<Table :disabled-hover='true' ref='scorelist' :border='false'  :height='viewH - 64- 72 ' :data='detailList' :columns='columns1'   stripe></Table>
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
		'未签到',
		'已签到',
		'请假未审批',
		'请假已通过审批',
		'打卡异常',
		'请假驳回',
	];
	var filter =[
		{
			label: '缺勤',
			value: 0
		},
		{
			label: '正常',
			value: 1
		},
		{
			label: '请假待批',
			value:2
		},
		{
			label: '请假已批',
			value:3
		},
		{
			label: '考勤异常',
			value:4
		},
		{
			label: '请假驳回',
			value:5
		}
	];
	var excuse = {
		title:'事由',
		key:'excuse',
		align:'center'
	}
	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				keyword:"",
				content:"",
				name:"",
				provinceList:[],
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				currentCourseId:-1,//当前的课程id
				

				showPass:false,
				attendanceList:[],
				countInfo:{},
				detailList:[],
				viewH:window.innerHeight,
				columns1:[
					{
						title:'学员姓名',
						key:'studentname',
						align:'center'
					},{
						title:'电话',
						key:'mobile',
						align:'center'
					},{
						title:'课程名称',
						key:'title',
						align:'center'
					},
					{
						title:'状态',
						key:'status',
						align:'center',
						render:(h,params)=>{
							return h('div',{},status[params.row.status]);
						},
						filters:filter ,
                        filterMultiple: false,
                        filterMethod (value, row) {
							return row.status  === value;
                        },
					},excuse,{
						title:'操作',
						key:'action',
						align:'center',
						render:(h,params)=>{
							if(params.row.status === 2){
								return h('div',{},[
									h('Button',{
										props:{
											size:'small',
											type:'error'
										},
										on:{
											click:()=>{
												this.checked(5,params.row.id,params.index);
											}
										}
									},'驳回'),
									h('Button',{
										style:{
											marginLeft:'10px',
											background:'green',
											color:"#fff"
										},
										props:{
											size:'small',
										},
										on:{
											click:()=>{
												this.checked(3,params.row.id,params.index);
											}
										}
									},'同意'),
								]);
							}
							else{
								if(params.row.status !== 1){

									return h('Button',{
										props:{
											type:'primary',
											size:'small'
										},
										on:{
											click:()=>{
												this.checked(1,params.row.id,params.index);
												this.detailList.splice(params.index,1);
											}
										}
									},'修正');
								}
								return h('div',{},'');
							}
						}
					}
				],
				columns:[
					{
						title:'课程名称',
						key:'title',
						align:'center'
					},
					{
						title:'上课时间',
						key:'lessonendtime',
						align:'center',
						width:300,
						render:(h,params)=>{
							return h('div',{},params.row.lessonstarttime+' - '+ params.row.lessonendtime)
						}
					},{
						title:'到课',
						key:'totalpersonnum',
						align:'center'
					},{
						title:'已批请假',
						key:'totalyes',
						align:'center'
					},{
						title:'待批',
						key:'totalno',
						align:'center'
					},{
						title:'异常签到',
						key:'totalnormal',
						align:'center'
					},{
						title:'详情',
						key:'excuse',
						align:'center',
						render:(h,params)=>{
							return h('div',{
								style:{
									cursor:'pointer',
									color:'#f90'
								},
								on:{
									click:()=>{
										this.getDetail('courseid',params.row.courseid,params.row.title);
									}
								}
							}, '详情>>');
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

		watch:{
			keyword(val){
				if(val){
					this.detailList = this.defaultDetailList.filter((item)=>{
						return item.mobile.indexOf(val)>-1 || item.studentname.indexOf(val)>-1;
					})
				}else{
					this.detailList = this.defaultDetailList.concat([]);
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
			this.getAttendanceList();
			this.getCountmeetclassnum();
		},
		
		methods:{
			checked(val,id,index){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/checkmeetclass/',
					//validate:s.validate,
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						status:val,
						id
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							s.$Message.success('审批成功');
							s.detailList[index].status = val;
							s.detailList = s.detailList.concat([]);
						 
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},

			getDetail(type,val,name){

				var s = this;
				this.name = name;
				if(val === 2 || val === 3 || val === 4 || val === 5){
					//this.cacheColumns =  this.cacheColumns || this.columns1.concat([]);
					if(val === 4){//考勤异常
						if(this.columns1[4].key === 'excuse'){
							this.columns1.splice(4,1);
							this.columns1.splice(4,0,{
								title:'考勤地址',
								key:'addressname',
								align:'center',

							})
						}
					}else{
						if(this.columns1[4].key !== 'excuse'){
							this.columns1.splice(4,0,excuse);
						}
						this.columns1.forEach((item,i)=>{
							if(item.key === 'addressname'){
								this.columns1.splice(i,1);
							}
						})
						
					}
					this.columns1[3].filters = null;
				}else{
					this.columns1[3].filters = filter;
				}
				 
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/meetclassdetail/',
					//validate:s.validate,
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						meetid:s.$route.params.meetid,
						[type]:val
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							s.detailList = data.list;
							s.defaultDetailList = s.detailList.concat([]);
							s.currentCourseId = 1;
							//s.countInfo = data.list;
							//s.attendanceList = data.list;
							
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},
			 
			refresh(){
				this.currentCourseId = -1;
				this.name =  '';
				
			},
			getCountmeetclassnum(){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/countmeetclassnum/',
					//validate:s.validate,
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						meetid:s.$route.params.meetid,
						
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							s.countInfo = data.list;
							//s.attendanceList = data.list;
							
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},
			getAttendanceList(){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/getmeetclasslist/',
					//validate:s.validate,
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						meetid:s.$route.params.meetid,
						pagenum:1000,
						
					},
					success(data){
						if(data.getret === 0){
							s.attendanceList = data.list;
							
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
 