<template>
	<div class="wm-feedback-main-ui">
		<div>
			<Tab :refresh='refresh'></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>意见反馈</div>
				<div>
					
				</div>
			</header>
			
			<div class='wm-feedback-table'>
				<div v-if='showDetail'>
					<div class='wm-feedback-item'>
						<header>产品技术类工单问题</header>
						<div>
							<span>建议：</span><span>产品技术类工单问题</span>
						</div>
						<div>
							2018-11-12 12:12:12
						</div>
					</div>


					<div class='wm-feedback-item'>
						<header>回复</header>
						<div>
							<Input type='textarea'/>
						</div>
						<div>
							
						</div>
					</div>
				</div>
				<Table :data='feedbackList' :columns='columns' v-else></Table>
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

	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
			 
				provinceList:[],
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				showDetail:true,
				currentClassId:-1, 
				address:'',
				showPass:false,
				showMap:false,
				viewH:window.innerHeight,
				feedbackList:[],
				columns:[
					{
						title:'学员姓名',
						key:'studentname',
						align:'center'
					},
					{ 
						title:'用户反馈',
						key:'opinion',
						align:'center'
					},
					{
						title:'操作',
						key:'action',
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
											var s = this;
											s.showDetail = true;
											s.formClass = params.row;
											s.currentClassId = params.row.syllabusid;
											s.formClass.lessonstarttime = new Date(s.formClass.lessonstarttime);
											s.formClass.lessonendtime = new Date(s.formClass.lessonendtime);
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
											this.delClass(params.row.syllabusid);
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
			Tab
		},

		beforeCreate(){
			//var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

			///this.validate = validate;
		},
		mounted(){
			window.s = this;
			this.userinfo = symbinUtil.getUserInfo();
			
			this.getFeedback();
			

		},

		watch:{
		},
		
		methods:{


			refresh(){
				this.showDetail = false;
				this.currentClassId = -1;
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
			 
			getFeedback(){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/getfeedbacklist/',
					//validate:s.validate,
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						meetid:s.$route.params.meetid,
						pagenum:1000,
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							s.feedbackList = data.list;
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
 