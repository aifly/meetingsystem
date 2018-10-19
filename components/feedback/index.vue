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
						<header>{{formFeedback.studentname}}</header>
						<div>
							<span>{{formFeedback.studentname}}建议：</span><span>{{formFeedback.opinion}}</span>
						</div>
						<div>
							{{formFeedback.createtime}} <span class='wm-feedback-reply' @click='getReplyInfo(formFeedback)'>回复</span>
						</div>

						<div id='wm-reply-component'></div>
					</div>

					<div class='wm-feedback-item fixed' v-if='showFirstReply'>
						<header>回复给：{{currentObj.studentname}}</header>
						<div>
							<Input v-model='myopinion' type='textarea' placeholder="请输入回复内容"/>
						</div>
						<div>
							<Button @click='reply(formFeedback.id)'>提交</Button>							
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
				myopinion:'',
				showFirstReply:false,
				provinceList:[],
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				showDetail:false,
				currentClassId:-1, 
				address:'',
				currentObj:{

				},
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
											//s.showDetail = true;
											
											symbinUtil.ajax({
												url:window.config.baseUrl+'/zmitiadmin/getfeedbackinfo',
												data:{
													admintoken:s.userinfo.accesstoken,
													adminuserid:s.userinfo.userid,
													fid:params.row.id,
												},
												success(data){
													console.log(data);
													if(data.getret === 0){
														
													}
												}
											})


											return;

											s.formFeedback = params.row;
										
											var myReplyComponent = Vue.extend({
												template:s.bindReply(s.formFeedback.children),
												methods:{
													reply(feed){
														console.log(id);
														Vue.obserable.trigger({
															type:'reply',
															data:id
														})
													}
												}
											});
											 
											var component= new myReplyComponent().$mount();

											setTimeout(() => {
												var c = document.getElementById('wm-reply-component');
												c.innerHTML = '';
												c.appendChild(component.$el);
											}, 100);
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
				formFeedback:{
					
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

			Vue.obserable.on('reply',(id)=>{
				this.reply(id);
			})
			

		},

		watch:{
		},
		
		methods:{

			getReplyInfo(formFeedback){
				this.showFirstReply = !this.showFirstReply;
				this.currentObj = formFeedback;
			},

			bindReply(data){
				var html =  '';
				
				if(data.children && data.children.length){
					return this.bindReply(data.children);
				}else{
				
					data.forEach((feed,i)=>{
						html += `<div class='wm-feedback-item'>
							<header>${feed.studentname||"管理员回复："}</header>
							<div>
								<span>管理员建议：</span><span>${feed.opinion}</span>
							</div>
							<div>
								${feed.createtime} <span class='wm-feedback-reply' @click='reply("${feed.id}")' >回复</span>
							</div>
						</div>`
					});
					if(data.length<=0){
						html = '<div></div>';
					}
					
				}
				
				return html;

			},

			reply(id){
				var s = this;
				
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/replystudentopinion',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						id,
						meetid:s.$route.params.meetid,
						opinion:s.myopinion
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							s.getFeedback();
							s.showDetail = false;
						}
					}
				})
			},
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
				var p = JSON.parse(JSON.stringify(this.formFeedback));
				p.admintoken = s.userinfo.accesstoken;
				p.adminuserid = s.userinfo.userid;
				p.meetid = s.$route.params.meetid;
				p.lessonstarttime =  new Date(s.formFeedback.lessonstarttime).getTime()/1000;
				p.lessonendtime =  new Date(s.formFeedback.lessonendtime).getTime()/1000;

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
				 
			}
		}
	}
 
	
</script>
 