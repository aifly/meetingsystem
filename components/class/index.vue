<template>
	<div class="wm-class-main-ui">
		
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
				showDetail:false,
				currentClassId:-1, 
				showPass:false,
				viewH:window.innerHeight,
				classTeacherList:[],
				columns:[
					{
						title:"标题",
						key:'title',
						align:'center'
						
					},
					{
						type:'html',
						title:'内容',
						key:'content',
						align:'center'
					}
					,{
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
					pdfurl:'wm-news-remove-encryptfile.pdf'	
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
			this.directoryList = {
				companyid:'company'+s.userinfo.companyid,
				projectclassname:'meetingsystem',
				projectsubclassname:'project'+s.$route.params.meetid,
				uploadpath:'public'
			}
		
			

		},
		
		methods:{

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

				 
			}
		}
	}
</script>
 