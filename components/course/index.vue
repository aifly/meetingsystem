<template>
	<div class="wm-course-main-ui">
		<div>
			<Tab :refresh='refresh'></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>课程管理</div>
				<div>
					<Button type="primary" @click="addCourse">新增课程</Button>
				</div>
			</header>
			<div class="wm-course-wrap" >
				<Form v-show='showDetail' ref="formValidate" class="wm-meet-form wm-scroll" :style='{height:viewH - 64- 90+"px"}' :model="formClass" :rules="ruleValidate" :label-width="100">
					<FormItem label="标题：" prop="title">
						<Input v-model="formClass.title" placeholder="请填写标题"></Input>
					</FormItem>
					<FormItem label="上课老师：" prop="type">
						<Select v-model="formClass.teacherid" placeholder="请选择上课老师">
							<Option :value="ntype.teacherid" v-for='(ntype,i) in classTeacherList' :key="i">{{ntype.accounts}}</Option>
						</Select>
					</FormItem>
					<FormItem label="教室位置：" prop="classroom">
						<div class="wm-classroom-pos" id='wm-classroom-pos'>

						</div>
					</FormItem>
					<FormItem label="课程说明：" prop="content">
						<Input type='textarea' v-model="formClass.content" :rows='5' />
					</FormItem>
				
					<FormItem label="上课时间：">
						 <DatePicker type="datetime" placeholder="请选择上课时间" style="width:100%" v-model="formClass.lessonstarttime"></DatePicker>
					</FormItem>

					<FormItem label="下课时间：">
						<DatePicker type="datetime" placeholder="请选择下课时间" style="width:100%" v-model="formClass.lessonendtime"></DatePicker>
					</FormItem>

					<FormItem label="上课教室：" prop="classroom">
						<Input v-model="formClass.classroom" placeholder="请填写上课教室"></Input>
					</FormItem>
					<FormItem>
						<Button type="primary" @click="classAction()" size='large'>添加课程</Button>
					</FormItem>
				</Form>
				<div v-if='!showDetail' class="wm-course-list">
					<Table :disabled-hover='true' ref='scorelist' :border='false'  :height='viewH - 64- 72 ' :data='courseList' :columns='columns'   stripe></Table>
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
	import VueQuillEditor from 'vue-quill-editor';
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	Vue.use(VueQuillEditor)
	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				editorOption:{
					modules:{
                        toolbar:[
						       // toggled buttons
						  //[{size:['small',false,'large','huge','12']}],//'12','14',false,'16','18','20','22','24'
                        ]
                    }
				},
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
						title:"课程名称",
						key:'title',
						align:'center'
						
					},
					{
						type:'html',
						title:'上课老师',
						key:'accounts',
						align:'center'
					},
					{
						title:'上课教室',
						key:'classroom',
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
					pdfurl:''	
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
			this.getClassList();
			this.getTeacherList();
			

			this.initMap();
		},
		
		methods:{

			addCourse(){
				this.showDetail = true;
				this.currentClassId = -1;
				this.formClass = {
				}
			},


			refresh(){
				this.showDetail = false;
				this.currentClassId = -1;
			},

			initMap(){
				var map = new AMap.Map('wm-classroom-pos', {
					viewMode: '3D',
					turboMode: false,
					defaultCursor: 'pointer',
					showBuildingBlock: false,
					expandZoomRange: true,
					zooms: [2, 40],
					zoom: 4,
					forceVector: true,
				});
				var object3Dlayer = new AMap.Object3DLayer({
					zIndex: 110,
					opacity: 1
				});
				map.add(object3Dlayer)

				var s = this;
				var clickEventListener = map.on('click', function(e) {
					s.formClass.longitude = e.lnglat.getLng();
					s.formClass.latitude = e.lnglat.getLat();
					console.log( e.lnglat.getLng() + ',' + e.lnglat.getLat())
				});
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
 