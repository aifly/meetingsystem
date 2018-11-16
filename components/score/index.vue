<template>
	<div class="wm-score-main-ui">
		<div>
			<Tab :refresh='refresh'></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>评分结果 {{scoreObj.title?">"+scoreObj.title:''}}</div>
				<div style="font-size:14px;">
					<a :href='"#/meetingscoreitem/"+$route.params.meetid+"/"+$route.params.meetname'>评分项管理</a>
				</div>
			</header>
			<div v-if='mainType === 0'  :style="{height:viewH - 150+'px'}" class='wm-scroll'>
				<Table @on-row-click='getScoreByCourse' :data='scoreList' :columns='columns'></Table>				
			</div>
			<ScoreDetail :scoreObj="scoreObj" v-else-if='mainType === 1'></ScoreDetail>
			<StudentDetail v-else-if='mainType === 2'></StudentDetail>
		</div>
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';
	import Vue from 'vue';
	import ScoreDetail from './scoredetail';
	import StudentDetail from './studentdetail'

	import Tab from '../commom/tab/index';

	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{

				mainType:0,
				scoreList:[],
				columns:[
					{
						title:"课程名称",
						key:'title',
						align:'center'
					},
					{
						title:"老师",
						key:'teachername',
						align:'center'
					},
					{
						title:"参评人数",
						key:'totalperson',
						align:'center'
					},
					{
						title:"总分",
						key:'totalscore',
						align:'center'
					},
					{
						title:"平均分",
						key:'avgscore',
						align:'center'
					}
				],

				scoreObj:{
					totalscore:98,
					syallabustitle:"思想品德",
					teachername:'张三',
					totalperson:129,//参与人数。
					date:'2018-10-10',
					syllabusid:'',
					scoreList:[
						{
							groupname:'教学内容',
							list:[
								{
									scoreitemname:'与培训目标一致性',
									avgscore:9,
									totalscore:180,
									studentnum:20
								},
								{
									scoreitemname:'科学性，前沿性',
									avgscore:9,
									totalscore:180,
									studentnum:20
								},
								{
									scoreitemname:'信息量',
									avgscore:9,
									totalscore:180,
									studentnum:20
								}
							]
						},
						{
							groupname:'教学方法',
							list:[
								{
									scoreitemname:'多样性，有效性',
									avgscore:9,
									totalscore:180,
									studentnum:20
								}
							]
						},{
							groupname:'教学水平',
							list:[
								{
									scoreitemname:'教学态度',
									avgscore:9,
									totalscore:180,
									studentnum:20
								},
								{
									scoreitemname:'语言表达',
									avgscore:9,
									totalscore:180,
									studentnum:20
								},
								{
									scoreitemname:'调动学员参与度',
									avgscore:9,
									totalscore:180,
									studentnum:20
								}
							]
						},{
							groupname:'教学效果',
							list:[
								{
									scoreitemname:'推动工作帮助度',
									avgscore:9,
									totalscore:180,
									studentnum:20
								},
								{
									scoreitemname:'对个人成长帮助度',
									avgscore:9,
									totalscore:180,
									studentnum:20
								}
							]
						}
					]


				},
				
				provinceList:[],
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				showDetail:false,
				currentClassId:-1, 
				address:'',
				showPass:false,
				showMap:false,
				viewH:window.innerHeight,
				classTeacherList:[],
			 
				ruleValidate:{
					title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' }
                    ],
                    teacherid: [
                        { required: true, message: '上课老师不能为空', trigger: 'change' }
                    ]
				},
				formClass:{
					pdfurl:'',
					longitude :'116.585856',
					latitude :'40.364989'
				},
				courseList:[],
				 
				directoryList:{

				},
				
				userinfo:{}
			}
		},
		components:{
			Tab,
			ScoreDetail,
			StudentDetail
		},

		beforeCreate(){
			//var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

			///this.validate = validate;
		},
		mounted(){
			window.s = this;
			this.userinfo = symbinUtil.getUserInfo();
			this.directoryList = {
				companyid:'company'+s.userinfo.companyid,
				projectclassname:'meetingsystem',
				projectsubclassname:'project'+s.$route.params.meetid,
				uploadpath:'public'
			}
			this.getClassList();
			this.getTeacherList();
			this.getScoreList();
	
			this.$root.eventHub.$on('setMainType',(index)=>{
				this.mainType = index;
			})

		},

		watch:{
			 
		},
		
		methods:{


			getScoreByCourse(row,index){
				this.mainType = 1;
				this.getAvgScore(row.syllabusid);
				this.scoreObj.syllabusid = row.syllabusid;
				this.scoreObj.title = row.title;
			},


			getScoreList(){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/getallsyllabuavg',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						meetid:s.$route.params.meetid,
					},
					success(data){
						///s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						if(data.getret === 0){
							s.scoreList = data.list;
						}
					}
				})
			},

			getAvgScore(syllabusid='1679644336'){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/getavgscore',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						meetid:s.$route.params.meetid,
						syllabusid
					},
					success(data){
						if(data.getret === 0){
							s.scoreObj.syallabustitle = data.syallabustitle;
							s.scoreObj.teachername = data.teachername;
							s.scoreObj.totalperson = data.totalperson;
							s.scoreObj.totalscore = data.totalscore;
							s.scoreObj.scoreList  = data.list;

						}
					}
				})
			},

			addCourse(){
				this.showDetail = true;
				this.currentClassId = -1;
				this.formClass = {
				}
			},


			refresh(){
				this.showDetail = false;
				this.currentClassId = -1;
				this.mainType = 0;
				this.scoreObj.title =  '';
			},
 


			delencryptfile(){
				this.formClass.pdfurl  = '';
			},
			delClass(syllabusid){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/delcourse',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						syllabusid
					},
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						if(data.getret === 0){
							s.getClassList();
						}
					}
				})
			},
			classAction(){
				var s = this;
				var p = JSON.parse(JSON.stringify(this.formClass));
				p.admintoken = s.userinfo.accesstoken;
				p.adminuserid = s.userinfo.userid;
				p.meetid = s.$route.params.meetid;
				p.lessonstarttime =  new Date(s.formClass.lessonstarttime).getTime()/1000;
				p.lessonendtime =  new Date(s.formClass.lessonendtime).getTime()/1000;

				var url = window.config.baseUrl+'/zmitiadmin/addcourse';
				if(s.currentClassId>-1){
					url = window.config.baseUrl+'/zmitiadmin/updatecourse';
					p.syllabusid = s.currentClassId;
				}

				symbinUtil.ajax({
					url,
					data:p,
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						s.showDetail = false;
						s.getClassList();
					}
				})
			},
			
 
			
			

		  
			getTeacherList(){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/getteacherlist',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
					},
					success(data){
						if(data.getret === 0){
							s.classTeacherList = data.list;
						}
					}
				});
			},

			 
			getClassList(){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/getcourselist/',
					//validate:s.validate,
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						meetid:s.$route.params.meetid,
						pagenum:1000,
						status:-1,//查询全部
					},
					success(data){
						if(data.getret === 0){
							s.courseList = data.list;
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},


			addadUser(){

				 
			},

			 
			 
			onEditorBlur(){//失去焦点事件
            },
            onEditorFocus(){//获得焦点事件
            },
            onEditorChange(){//内容改变事件
            },
		}
	}
</script>
 