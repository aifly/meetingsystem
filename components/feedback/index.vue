<template>
	<div class="wm-feedback-main-ui" >
		<div>
			<Tab :refresh='refresh'></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>意见反馈</div>
				<div>
					
				</div>
			</header>
			
			<div class='wm-feedback-table wm-scroll' :style="{height:viewH-180+'px'}">
				<div v-if='showDetail'>
					<div class='wm-feedback-item'>
						<header>{{formFeedback.studentname}}</header>
						<div class='wm-feedback-replay'>
							<span>{{formFeedback.studentname}}建议：</span><span :class="{'delete':formFeedback.status === 2}">{{formFeedback.opinion}}</span>
						</div>
						<div class='wm-feedback-reply' >
							{{formFeedback.createtime}} <span @click='getReplyInfo(formFeedback)'>回复</span>
							<Poptip
								confirm
								title="确定要删除吗?"
								@on-ok="delFeedBack(formFeedback)"
								>
								<span　class='wm-feedback-del'>删除</span>
							</Poptip>
							
						</div>

						<div class='wm-feedback-item' v-for='(item,i) in detailList' :key="i" >
							<header>{{item.studentname === null ? "管理员":item.studentname}}</header>
							<div class='wm-feedback-replay'>
								<span>回复给{{item.userid?formFeedback.studentname:"管理员"}} ：</span><span :class="{'delete':item.status === 2}">{{item.opinion}}</span>
							</div>
							<div class='wm-feedback-reply' >
								{{item.createtime}} <span @click='getReplyInfo(item)'>回复</span>
								<Poptip
									confirm
									title="确定要删除吗?"
									@on-ok="delFeedBack(item)"
									>
									<span　class='wm-feedback-del'>删除</span>
								</Poptip>
							</div>
							
						</div>
						
					</div>

					<div class='wm-feedback-item fixed' v-if='currentObj.fid'>
						<header>回复给：{{currentObj.studentname === null ? "管理员":currentObj.studentname}}</header>
						<div class=''>
							<Input v-model='myopinion' type='textarea' placeholder="请输入回复内容"/>
						</div>
						<div class='wm-feedback-submit'>
							<Button @click='reply(currentObj)'>提交</Button>							
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
				viewW:window.innerWidth,
				feedbackList:[],
				columns:[
					{
						title:'学员姓名',
						key:'studentname',
						align:'center',
						render:(h,params)=>{
							return h('div',{},[
								h('span',{

								},params.row.studentname),
								h('span',{
									
								},'')
							]);
						}
					},
					{ 
						title:'用户反馈',
						key:'opinion',
						align:'center'
					},{ 
						title:'创建时间',
						key:'createtime',
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
											s.formFeedback = params.row;
											
											symbinUtil.ajax({
												url:window.config.baseUrl+'/zmitiadmin/getfeedbackinfo',
												data:{
													admintoken:s.userinfo.accesstoken,
													adminuserid:s.userinfo.userid,
													fid:params.row.id,
												},
												success(data){
													if(data.getret === 0){
														s.detailList = data.list;
													}
												}
											});
											symbinUtil.ajax({
												url:window.config.baseUrl+'/zmitiadmin/updatereadstate',
												data:{
													admintoken:s.userinfo.accesstoken,
													adminuserid:s.userinfo.userid,
													id:params.row.id,
												},
												success(data){
													
												}
											});



											return;

										
											/* var myReplyComponent = Vue.extend({
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
											}, 100); */
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
											this.delClass(params.row.id);
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
				detailList:[],
				 
				
				
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

				
				
				this.currentObj = formFeedback;
				console.log(this.currentObj )
			},
			delFeedBack(obj){
				var s = this;
				
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/updatefeedback',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						id:obj.id,
						meetid:s.$route.params.meetid,
						opinion:"此信息已被管理员删除",
						status:2
					},
					success(data){
						console.log(data);
						s.$Message[data.getret === 0? 'success':'error'](data.getmsg);
						if(data.getret === 0){
							s.currentObj = {};
							s.myopinion = '';
						}
					}
				})
			},
			reply(obj){
				var s = this;
				
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/replystudentopinion',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						id:obj.id,
						meetid:s.$route.params.meetid,
						opinion:s.myopinion,
						fid:obj.fid
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							s.getFeedback();
							s.currentObj = {};
							s.myopinion = '';
							s.showDetail = false;
						}
					}
				})
			},
			refresh(){
				this.showDetail = false;
				this.currentClassId = -1;
			},
			delClass(id){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/delfeedback',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						id
					},
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						if(data.getret === 0){
							s.getFeedback();
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
 