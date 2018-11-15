<template>
	<div class="wm-signup-ui lt-full">
		<div>
			<Tab :refresh='refresh'></Tab>
		</div>
		<div class="wm-tab-content" v-show='!showAddStudent'>
			<header class="wm-tab-header">
				<div>学员报名管理</div>
				<div class='wm-header-right-action'>
					<div>
						<div class='wm-header-temp'>
							<a :href='importModel' target='_blank' download="templet">导入模板下载</a>
						</div>
						<div class='wm-exportexcel-btn ivu-btn ivu-btn-default'>
							<div class='wm-upload'></div>
							<span>导入</span>
						</div>
						<div>
							<Button  @click='exportData' type="default" icon='md-cloud-upload'>导出</Button>
							<Button   @click='addStudent' icon='ios-add-circle'>新增学员</Button>
						</div>
					</div>
					<div>
						<Input v-model='keyword' placeholder="请输入学员姓名或者电话" class='wm-signup-search'/>
					</div>
				</div>
			</header>
			<div v-if='currentUserId<=-1'>
				
				<Table ref='scorelist'   :height='viewH - 64- 72 ' :data='userList' :columns='columns'   stripe></Table>
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
		<add-student :steps='addStudentSteps'  v-show='showAddStudent' :title='"学员报名管理"' ></add-student>
		<Modal v-model="showErr" width="360">
			<p slot="header" style="color:#f60;text-align:center">
				<Icon type="ios-close-circle" />
				<span>导入信息</span>
			</p>
			<div v-for="(item,i) in errList" :key='i'>
				{{item}}
			</div>
			<div slot="footer">
				<Button type="error" size="large" long  @click="showErr = false;errList = []">关闭</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import Tab from '../commom/tab/index';
	import AddStudent from '../commom/addstudent/index';
	import symbinUtil from '../lib/util';
	import Vue from 'vue';
	/**
	 * 学员报名管理、
	 */
	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				importModel:window.config.importModel,
				showAddStudent:false,//
				addStudentSteps:[
					{
						title:'录入电话号码',
						content:""
					},
					{
						title:'录入学员信息',
						content:""
					}
				],
				errList:[],
				showErr:false,
				visible:false,
				imgs:window.imgs,
				showPassWord:false,
				isLoading:false,
				showDetail:false,
				userError:"",
				companyError:"",
				usernameError:"",
				viewH:window.innerHeight,
				passError:"",
				repassError:"",
				mobileError:"",
				currentUserId:-1,
				keyword:"",

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
							return h('div',{},params.row.sex === 1? '男':'女');
						}
						
					},{
						title:"省/市",
						key:'provincename',
						align:'center',
						filters:[

						] ,
                        filterMultiple: false,
                        filterMethod (value, row) {
							return row.provinceid  === value;
                        },
						
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
						title:"单位及职务",
						key:'companyname',
						align:'center'
						
					},
					{
						title:'审核状态',
						key:'status',
						align:'center',
						width:180,
						render:(h,params)=>{
							
							return h('div',[
								h('Icon',{
									style:{
										cursor:'pointer',
										fontSize:'20px',
										color:params.row.status===0?'#f90':'#5c6b77'
									},
									props:{
										type:params.row.status===0?'ios-alert':'ios-alert-outline'
									},
									on:{
										click:()=>{
											this.updateStatus(0,params.row.status,params.row.id);
										}
									}
								},1),
								h('Icon',{
									style:{
										cursor:'pointer',
										fontSize:'20px',
										color:params.row.status===1?'green':'#5c6b77'
									},
									props:{
										type:params.row.status===1?'ios-checkmark-circle':'ios-checkmark-circle-outline'
									},
									on:{
										click:()=>{
											this.updateStatus(1,params.row.status,params.row.id);
										}
									}
								},'3'),
								h('Icon',{
									props:{
									},
									style:{
										cursor:'pointer',
										fontSize:'20px',
										color:params.row.status===2?'#be0000':'#5c6b77'
									},
									props:{ 
										type:params.row.status===2?'ios-remove-circle':'ios-remove-circle-outline'
									},
									on:{
										click:()=>{
											this.updateStatus(2,params.row.status,params.row.id);
										}
									}
								},'2'),
								 h('Poptip',{
									props:{
										confirm:true,
										title:"确定要删除吗"
									},
									style:{
										marginLeft:'20px'
									},
									on:{
										'on-ok':()=>{
											this.delMeetStudent(params.row.userid,params.index);
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
												
												//this.remove(params.index,params.row.employeeid)
											}
										}
									}, '删除')
								])
								
							],'1')
								
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
		components:{
			Tab,
			'add-student':AddStudent
		},

		beforeCreate(){
			var validate = sysbinVerification.validate(this);
			this.validate = validate;
			
		},
		mounted(){
			
			this.userinfo = symbinUtil.getUserInfo();
			this.getsignupList();
			this.getGroupList();
			this.getProvinceList();
			this.upload({
				accept:{
						title: 'All',
						extensions: 'xls,xlsx',
						mimeTypes: '*/*'
					}
			});
			
			Vue.obserable.on('hideAddStudent',()=>{
				this.showAddStudent = false;
				this.getsignupList();
			})

		},
		watch:{
			keyword(val){
				if(val){
					this.userList = this.defaultUserList.filter((item)=>{
						return item.mobile.indexOf(val)>-1 || item.studentname.indexOf(val)>-1 ||item.companyname.indexOf(val)>-1;
					})
				}else{
					this.userList = this.defaultUserList.concat([]);
				}
			}
		},
		
		methods:{

			updateStatus(status,status1,id){
				if(status === status1){
					return;
				}
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/updatemeetstudent',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						id,
						status
					},
					success(data){
						s.$Message[data.getret === 0?'success':'error'](data.getmsg);
						if(data.getret === 0){
							s.getsignupList();
						}
					}
				})

			},

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
								s.columns[4].filters = s.columns[4].filters || [];
								s.columns[4].filters.push({
									value:item.groupid,
									label:item.groupname
								})
							});
						}
					}
				})
			},

			getProvinceList(){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/share/getcitylist/',
					data:{},
					success(data){
						if(data.getret === 0){
							data.list.map((item,i)=>{

								s.columns[3].filters = s.columns[3].filters || [];
								s.columns[3].filters.push({
									value:item.cityid,
									label:item.name
								})
								
								 
							})
						}
					}
				})
			},

			delMeetStudent(studentid,index){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/delmeetstudent',
					data:{
						adminuserid:s.userinfo.userid,
						admintoken:s.userinfo.accesstoken,
						meetid:s.$route.params.meetid,
						studentid
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							s.userList.splice(index,1);
						}
						s.$Message[data.getret ===0 ?'success':'error'](data.getmsg);
					}
				})
				
			},


			upload(option = {}){

				window.ss = this;
				var s = this;
				 
				var p = this.directoryList;
				this.p = p;
				if(s.uploader){
					//s.uploader.destroy();
				}

				var params = {
					// 选完文件后，是否自动上传。
					auto: true,
					// swf文件路径
					swf: './webuploader-0.1.5/Uploader.swf',
					// 文件接收服务端。
					//server: 'http://api.zmiti.com/v2/fileupload',
					server: window.config.baseUrl+'/wmshare/uploadfile/',
					
					pick:option.pick || '.wm-upload',
					chunked: true, //开启分片上传
					threads: 1, //上传并发数
					method: 'POST',
					compress:false,
					prepareNextFile:true,//是否允许在文件传输时提前把下一个文件准备好。 对于一个文件的准备工作比较耗时，比如图片压缩，md5序列化。 如果能提前在当前文件传输期处理，可以节省总体耗时。
					formData:p,
					accept:option.appcet,
					//dnd:'.wm-myreport-left',
					disableGlobalDnd :true,//是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
				};

			
				
				var uploader = WebUploader.create(params);
				/* uploader.on('dndAccept',(file,a)=>{
					if(accepts[s.currentType].extensions.indexOf(file['0'].type.split('/')[1])<=-1){
						s.$Message.error('目前不支持'+file['0'].type.split('/')[1]+'文件格式');
					}
				}) */

				uploader.on("beforeFileQueued",function(file){
					
					if(option.accept.extensions.indexOf(file.name.split('.')[1])<=-1){
						s.$Message.error('当前文件格式不支持');
						
						return;
					}
					
					 
				});

				s.uploader = uploader;

				// 当有文件添加进来的时候
				var i = 0;
				uploader.on('fileQueued', function (file) {
					uploader.upload();
					if(option.pick === '.news-encryptfile'){//加密文件上传
						s.showEncryptfileBtn = false;
					}else if(option.pick === '.wm-upload'){//附件上传
						/* s.formNews.download.push({url:file.name});
						s.formNews.download[s.formNews.download.length-1].isUploading = true;
						console.log(file);
						i++; */
					}
					 
				});
				// 文件上传过程中创建进度条实时显示。
				uploader.on('uploadProgress', function (file, percentage) {
					/* 	var index = -1;
					var scale = (percentage * 100|0);
					
					if(option.pick === '.news-encryptfile'){//加密文件上传
						s.percent = scale;

					}else if(option.pick === '.wm-upload'){//附件上传
						s.formNews.download.forEach((item)=>{
							//console.log(item.url , file.name)
							if(item.url === file.name){
								item.percent = scale;
							}
						})
						s.formNews.download = s.formNews.download.concat([]);
					} */
				
				 
				});

				// 文件上传成功，给item添加成功class, 用样式标记上传成功。
				var iNow = 0;
				uploader.on('uploadSuccess', function (file,data) {
					console.log('success ....',data);
					if(data.getret === 0){

						symbinUtil.ajax({
							url:window.config.baseUrl+'/zmitiadmin/importstudent',
							data:{
								filename:data.url,
								adminuserid:s.userinfo.userid,
								admintoken:s.userinfo.accesstoken,
								meetid:s.$route.params.meetid,
								companyid:'100000001',

							},
							success(data){
								console.log(data);
								if(data.getret === 0){
									s.$Message.success("导入成功");
									s.getsignupList();
								}
								else {
									var iNow = 0;
									s.errList = data.error;
									if(s.errList.length){
										s.showErr = true;
									}
									return;
									var t =  setInterval(()=>{
										if(data.error[iNow]){
											s.$Message.error(data.error[iNow]);
										}else{
											clearInterval(t);
										}
										iNow++;
									},1000)
								}
							}
						})
						
						/* s.formNews.download.splice(s.formNews.download.length-1,1,{url:data.fileurl});
						s.formNews.download.forEach((item)=>{
							if(item.url === file.name){
								item.isUploading = false;
							}
						})
						s.formNews.download = s.formNews.download.concat([]);
						//s.formNews.download[s.formNews.download.length-1].isUploading = false;
						iNow++;
						if(iNow === i){
							if(s.formNews.newsid){
								s.newsAction();
							}
						} */
						//s.formNews.bannerurl = data.fileurl;
					}
				//	$('#' + file.id).addClass('upload-state-done');
				});

				// 文件上传失败，显示上传出错。
				uploader.on('uploadError', function (file) {
				//	console.log('error')
					//$('#' + file.id).find('p.state').text('上传出错');
				});

				// 完成上传完了，成功或者失败，先删除进度条。
				

				uploader.on('uploadComplete', function (file) {

					
					if(option.pick === '.wm-upload'){//上传附件
						
					}
					//
				
				});
				
			},


			exportExcelData(){
				
			},

			addStudent(){//添加学员。
				this.showAddStudent = true;
			},
			
			exportData(){
				this.$refs.scorelist.exportCsv({
					filename: '学员报名管理'
				});
			},

			refresh(){
				this.getsignupList();
				this.currentUserId =  -1;
				this.showAddStudent = false;
				Vue.obserable.trigger({
					type:'initAddStudentUI'
				})
			},
			entry(e){
				this.currentUserId = e.userid;
				
			},

			getsignupList(){
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
						}
					}
				})
			}
		
		}
	}
</script>
 