<template>
	<div class="wm-attendance-ui">
		<div>
			<Tab :refresh="refresh"></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>考勤管理  <span v-if='name'>>{{name}}</span> </div>
				<div class='wm-header-tabs'>
					<h2 style='height:10px;'></h2>
					
				</div>
				<div>
					<!-- <Input v-model="keyword" placeholder="请输入学员姓名"/> -->
					<div>
						<Button type="primary"　@click='addNews'>新增考勤</Button>
					</div>
				</div>
			</header>
			<div class="wm-news-wrap">
				<Form ref="formValidate" v-show='showDetail' class="wm-meet-form wm-scroll" :style='{height:viewH - 64- 90+"px"}' :model="formNews" :rules="ruleValidate" :label-width="100">
				 
					 
					<FormItem label="标题：" prop="title"  v-if='!formNews.isNotice'>
						<Input v-model="formNews.title" placeholder="请填写标题"></Input>
					</FormItem>
					
					<FormItem label="内容：" prop="content" v-if='!formNews.isNotice'>
						 <quill-editor 
							v-model="formNews.content" 
							ref="myQuillEditor" 
							aria-placeholder="123"
							:options="editorOption" 
							>
							</quill-editor>
					</FormItem>
			
					<FormItem label="新闻状态：" prop="encrypsign" v-if='!formNews.isNotice'>
						<RadioGroup v-model="formNews.state">
							<Radio :label="0">待发</Radio>
							<Radio :label="1">签发</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem>
						<Button :disabled='isDisabledBtn' type="primary" @click="newsAction('click')" size='large'>{{currentNewsId>-1?'保存':'添加'}}</Button>
					</FormItem>
				</Form>
				<div class="wm-news-list" v-if='!showDetail'>
					<Table  :loading="loading" :disabled-hover='true' ref='scorelist' :border='false'  :height='viewH - 64- 72 ' :data='newsList' :columns='columns1'   stripe>
						<div slot='loading' class='wm-table-loading'>加载中<span>.</span><span>.</span><span>.</span></div>
					</Table>
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
				currentNewsId:-1,
				isDisabledBtn:false,
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
				ruleValidate:{
					title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' }
					]
				},
				formNews:{
					pdfurl:'',
					download:[],
					state:1,
					isNotice:false,//是否是公告
				},
				showDetail:false,
				loading:false,
				keyword:"",
				content:"",
				name:"",
				provinceList:[],
				visible:false,
				newsList:[],
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
				columns1:[
					 {
                        title:"序号",
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },{
						title:"标题",
						key:'title',
						align:'left',
						tooltip:true
					}
					,{
						title:"类型",
						key:'newstype',
						align:'left',
						width:60,
						render:(h,params)=>{
							return h('div',{}, '考勤');
						}
					},{
						title:"是否推荐",
						key:'iscommend',
						align:'center',
						width:100,
						render:(h,params)=>{
							return h('div',{},params.row.iscommend?'是':'否');
						}
					},{
						title:"是否签发",
						key:'state',
						align:'center',
						width:100,
						render:(h,params)=>{
							
							return h('div',{},params.row.state*1===1?'是':'否');
						}
					},{
						title:"创建时间",
						key:'createtime',
						align:'center',
						width:150
					},{
						title:'操作',
						key:'action',
						align:'center',
						width:150,
						render:(h,params)=>{


							return h('div', [
                               
                                h('Button', {
                                    props: {
                                        type: 'primary',
										size: 'small',
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
											var s = this;
											s.showDetail = true;
											s.formNews = params.row;
											s.formNews.type = params.row.id;
											s.currentNewsId = params.row.newsid;
											 
                                        }
                                    }
                                }, '详情'),
                                h('Poptip',{
									props:{
										confirm:true,
										title:"确定要删除吗"
									},
									on:{
										'on-ok':()=>{
											this.delNews(params.row,params.index);
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
											}
										}
									}, '删除')
								])
                            ]);
							
							 
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
			this.getNewsList();
		},
		
		methods:{


			

			delNews(row,index){
				var newsid = row.newsid;
				var s = this;
			
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/delnews/',
					validate:s.validate,
					data:{
						newsid,
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
					},success(data){
						if(data.getret === 0){
							s.$Message.success(data.getmsg);
							s.newsList.splice(index,1);
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}
				})
			},
			newsAction(type){
				var s = this;

				s.formNews.type = -2;//类型为-1的时候表示为考勤。
				if(!s.formNews.title){
					this.$Message.error('新闻标题不能为空');
					return;
				}

				var p = JSON.parse(JSON.stringify(this.formNews));
				p.admintoken = s.userinfo.accesstoken;
				p.adminuserid = s.userinfo.userid;
				p.meetid = s.$route.params.meetid;

				var url = window.config.baseUrl+'/zmitiadmin/addnews';
				if(s.currentNewsId>-1){
					url = window.config.baseUrl+'/zmitiadmin/updatenews';
					p.newsid = s.currentNewsId;
				}
				p.iscommend = p.iscommend|0;
				p.encrypsign = p.encrypsign|0;
				if(p.encryptfile){
					p.encrypsign = 1;
				}
				 
				var arr = [];
				p.download.forEach((item,i)=>{
					arr.push(item.url);
				});
			 	p.download = arr.join(',');
				
				symbinUtil.ajax({
					url,
					data:p,
					success(data){
					//	console.log(data);
						if(data.getret === 0 ){
							if(type){
								s.$Message.success(data.getmsg);
								s.getNewsList();
								s.showDetail = false;
							}
						}
					}
				})
			},
			getNewsList(){
				var s = this;
				 
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/getnewslist/',
					//validate:s.validate,
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						pagenum:1000,
						type:-2,
						meetid:s.$route.params.meetid,
						//status:-1,//查询全部
					},
					success(data){
					//	console.log(data);
						if(data.getret === 0){
							data.list.forEach((item=>{
								item.iscommend = !!item.iscommend;
								item.encrypsign = !!item.encrypsign;
								var download = [];
								(item.download||"").split(',').map((d)=>{
									if(d){
										download.push({
											url:d
										})
									}
								});
								item.download = download;
							}))
							s.formNews = {
								pdfurl:'',
								download:[],
								iscommend:false,
								encryptfile:false
							}
							s.newsList = data.list;
							s.loading = false;

							
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},
			addNews(){
				this.showDetail = true;
				this.currentNewsId = -1;
				this.formNews = {
					pdfurl:'',
					download:[],
					encrypsign:false,
					iscommend:false,
					state:1
				};
			},
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
				this.showDetail = false;
				this.currentNewsId = -1;
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
 