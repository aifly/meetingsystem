<template>
	<div class="wm-score-main-ui">
		<div>
			<Tab :refresh='refresh'></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>评分结果</div>
				<div>
				</div>
			</header>
			<div v-if='mainType === 0'></div>
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

				mainType:1,

				scoreObj:{
					totalscore:98,
					title:"思想品德",
					teachername:'张三',
					partakenum:129,//参与人数。
					date:'2018-10-10',
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
			

			this.initMap();
		},

		watch:{
			showMap(val){
				if(val){
					setTimeout(() => {
						this.initMap();
					}, 100);
				}
			}
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
				var s = this;
				var map = new AMap.Map('wm-classroom-pos', {
					turboMode: false,
					defaultCursor: 'pointer',
					showBuildingBlock: false,
					expandZoomRange: true,
					zooms: [16, 40],
					zoom: 4,
					center:new AMap.LngLat(s.formClass.longitude,s.formClass.latitude),
					forceVector: true,
				});
				//s.formClass.longitude,s.formClass.latitude
				var g = new AMap.Geocoder({city: "010"});

				  g.getAddress([s.formClass.longitude,s.formClass.latitude],function(status,result){
					if (status === 'complete'&&result.regeocode) {
						var address = result.regeocode.formattedAddress;
						s.address = address;
					}else{
						//alert(JSON.stringify(result))
					}
				  })

				var s = this;
				var clickEventListener = map.on('click', function(e) {
					s.formClass.longitude = e.lnglat.getLng();
					s.formClass.latitude = e.lnglat.getLat();
					
					g.getAddress([s.formClass.longitude,s.formClass.latitude],function(status,result){
						if (status === 'complete'&&result.regeocode) {
							var address = result.regeocode.formattedAddress;
							s.address = address;
						}else{
							//alert(JSON.stringify(result))
						}
					})
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
 