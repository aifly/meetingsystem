<template>
	<div class="wm-signup-ui lt-full">
		<div>
			<Tab :refresh='refresh'></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>培训报到管理</div>
				<div class='wm-header-right-action'>
					<div>
						<span>应到：<label>{{totalNum}}</label>人</span>
						<span>已到：<label>{{participantsNum}}</label>人</span>
						<span>未到：<label>{{unparticipantsNum}}</label>人</span>
						<Button @click='exportData' size="small" type="primary" icon='md-cloud-upload' style="height:26px;margin-top:14px;margin-left:5px">导出</Button>
					</div>
					<div>
						<Input v-model='keyword' placeholder="请输入学员姓名或者电话" class='wm-signup-search'/>
					</div>
				</div>
			</header>
			<div v-if='currentUserId<=-1' class='wm-scroll'>
				<Table ref='scorelist' @on-row-click='entry'  :height='viewH - 64- 72 ' :data='userList' :columns='columns'   stripe></Table>
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
				keyword:'',
				companyError:"",
				usernameError:"",
				viewH:window.innerHeight,
				passError:"",
				repassError:"",
				mobileError:"",
				currentUserId:-1,
				totalNum:0,
				participantsNum:0,
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
						title:"性别",
						key:'sex',
						align:'center',
						render:(h,params)=>{
							return h('div',{},params.row.sex === 0? '男':'女');
						}
					},{
						title:"所属小组",
						key:'groupname',
						align:'center',
						filters:[

						] ,
                        filterMultiple: false,
                        filterMethod (value, row) {
							return row.groupid  === value;
                        },
						
					},
					{
						title:'签到时间',
						key:'signdate',
						align:'center'
					},
					{
						title:'报到状态',
						key:'status',
						align:'center',
						filters: [
                            {
                                label: '未报到',
                                value: 0
                            },
                            {
                                label: '已报到',
                                value:1
                            }
                        ],
                        filterMultiple: false,
                        filterMethod (value, row) {
							return row.issign  === value;
                        },
						render:(h,params)=>{
						
							return h('div',[
								h('Icon',{
									style:{
										display:params.row.issign === 0?'inline-block':'none',
										cursor:'pointer',
										fontSize:'24px',
										color:params.row.issign===0?'#f90':'#5c6b77'
									},
									props:{
										type:params.row.issign===0?'ios-clock-outline':'ios-clock-outline'
									}
								},1),
								h('Icon',{

									style:{
										display:params.row.issign===1?'inline-block':'none',
										cursor:'pointer',
										fontSize:'24px',
										color:params.row.issign===1?'green':'#5c6b77'
									},
									props:{
										type:params.row.issign===1?'md-checkmark-circle-outline':'md-checkmark-circle-outline'
									}
								})
								
							])
							
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
		computed:{
			unparticipantsNum(){
				return this.totalNum - this.participantsNum;
			}
		},
		components:{
			Tab
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

		beforeCreate(){
			var validate = sysbinVerification.validate(this);
			this.validate = validate;
			
		},
		mounted(){
			
			this.userinfo = symbinUtil.getUserInfo();

			console.log(this.userinfo);

			this.getReportList();
			this.getGroupList();
			
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
							data.list.forEach((item,i)=>{
								s.columns[3].filters = s.columns[3].filters || [];
								s.columns[3].filters.push({
									value:item.groupid,
									label:item.groupname
								})
							});
						}
					}
				})
			},
			exportData(){
				this.$refs.scorelist.exportCsv({
					filename: '培训报到管理',
					data:this.userList.slice().map((item,i)=>{
						item.sex = item.sex === 0 ?  '男':'女'
						item.status = item.issign === 0 ? '未报道' : '已报道';
						return  true;
					})
				});
			},
			refresh(){
				this.getReportList();
				this.currentUserId = -1;
				
			},
			entry(e){
				this.currentUserId = e.userid;
				
			},

			getReportList(){
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
							s.totalNum = data.totalnum.num;
							s.participantsNum = data.signnum.num
						}
					}
				})
			}
		
		}
	}
</script>
 