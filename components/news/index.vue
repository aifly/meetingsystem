<template>
	<div class="wm-news-main-ui">
		<div>
			<Tab></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>新闻信息管理</div>
				<div>
					<Button type="primary">新增新闻</Button>
				</div>
			</header>
			<div class="wm-news-wrap">
				<Form ref="formValidate" class="wm-meet-form wm-scroll" :style='{height:viewH - 64- 90+"px"}' :model="formNews" :rules="ruleValidate" :label-width="90">
					<FormItem label="标题：" prop="title">
						<Row type='flex' :gutter='20' justify='space-between'>
							<Col :span='12'><Input v-model="formNews.title" placeholder="请填写标题"></Input></Col>
							<Col :span="3">
								<Checkbox label="Eat" v-model="formNews.iscommend">推荐</Checkbox>
							</Col>
							<Col :span="6">
								加密开关：
								<i-switch v-model="formNews.encrypsign" size="large">
									<span slot="open">开启</span>
									<span slot="close">关闭</span>
								</i-switch>
							</Col>
							
						</Row>
					</FormItem>
					<FormItem label="新闻分类：" prop="type">
						<Select v-model="formNews.type" placeholder="请选择新闻分类">
							<Option :value="ntype.id" v-for='(ntype,i) in newsTypeList' :key="i">{{ntype.newstype}}</Option>
						</Select>
					</FormItem>
					<FormItem label="内容：" prop="content">
						
						 <quill-editor 
							v-model="formNews.content" 
							ref="myQuillEditor" 
							aria-placeholder="123"
							:options="editorOption" 
							@blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
							@change="onEditorChange($event)">
							</quill-editor>
					</FormItem>
					
					<FormItem label="保密文件：" prop="encryptfile" class='wm-news-form-item'>
						<div class="wm-news-encryptfile">
							<div class=" news-encryptfile">

							</div>
							<Button icon="ios-cloud-upload-outline">上传保密文件</Button> (保密文件仅支持pdf文件)
						</div>
						<div class="wm-news-encryptfile-name">
							<span v-if='formNews.pdfurl' v-html='formNews.pdfurl.split("/").pop()'></span>
							<span v-if='formNews.pdfurl' @click='delencryptfile' class="wm-news-remove-encryptfile"></span>
						</div>
					</FormItem>

					<FormItem label="附件：" prop="download">
						<div class='wm-upload wm-news-download'>
							<div></div>
						</div>
						<div>

						</div>
					</FormItem>
			
					<FormItem label="新闻状态：" prop="encrypsign">
						<RadioGroup v-model="formNews.state">
							<Radio :label="0">待发</Radio>
							<Radio :label="1">已发</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem>
						<Button type="primary" @click="addNews()" size='large'>添加新闻</Button>
					</FormItem>
				</Form>

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
						  ['bold', 'italic', 'underline','code', 'strike','color','link'],        // toggled buttons
						  [{size:['small',false,'large','huge','12']}],//'12','14',false,'16','18','20','22','24'
						  [{ 'color': [] }],
						  [{ 'align': [] }],
						  [{list:'ordered'},{list:'bullet'}],
                          ['code-block','image','video','clean']
                        ]
                    }
				},
				provinceList:[],
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				currentUserId:-1, 
				showPass:false,
				viewH:window.innerHeight,
				newsTypeList:[],
				ruleValidate:{
					title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '新闻分类不能为空', trigger: 'change' }
                    ]
				},
				formNews:{
					pdfurl:'wm-news-remove-encryptfile.pdf'	
				},
				userList:[],
				 
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
			this.getNewsList();
			this.getNewsTypeList();
			this.upload({
				pick:'.news-encryptfile',
				 
			});
			this.upload({
				pick:'.wm-upload',
				accept:{
					title: 'All',
					extensions: 'doc,docx,pdf,xls,slsx',
					mimeTypes: '*/*'
				}
			});
		},
		
		methods:{


			delencryptfile(){
				this.formNews.pdfurl  = '';
			},

			addNews(){
				var s = this;
				var p = this.formNews;
				p.admintoken = s.userinfo.accesstoken;
				p.adminuserid = s.userinfo.userid;
				p.meetid = s.$route.params.meetid;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/addnews',
					data:p,
					success(data){
						console.log(data);
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
				var accepts  =  s.accepts;
				var uploader = WebUploader.create({
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
					accept:option.accept||{
						title: 'All',
						extensions: 'pdf',
						mimeTypes: '*/*'
					},
					//dnd:'.wm-myreport-left',
					disableGlobalDnd :true,//是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
				});
				uploader.on('dndAccept',(file,a)=>{
					if(accepts[s.currentType].extensions.indexOf(file['0'].type.split('/')[1])<=-1){
						s.$Message.error('目前不支持'+file['0'].type.split('/')[1]+'文件格式');
					}
				})

				uploader.on("beforeFileQueued",function(file){
					if('pdf'.indexOf(file['type'].split('/')[1])<=-1){
						s.$Message.error('当前文件格式不支持');
						return;
					}
					 
				});

				s.uploader = uploader;

				// 当有文件添加进来的时候
				var i = 0;
				uploader.on('fileQueued', function (file) {
					uploader.upload();
					 
				});
				// 文件上传过程中创建进度条实时显示。
				/* uploader.on('uploadProgress', function (file, percentage) {

					
					var index = -1;
					var scale = (percentage * 100|0);
					 
				 
				}); */

				// 文件上传成功，给item添加成功class, 用样式标记上传成功。
				uploader.on('uploadSuccess', function (file,data) {
					console.log(file,data,option);
					if(data.getret === 0){
						if(option.pick === '.news-encryptfile'){//加密文件
							s.formNews.pdfurl = data.fileurl;

						}else if(option.pick === '.wm-upload'){
							s.formNews.download += ','+data.fileurl;
						}
						//s.formNews.bannerurl = data.fileurl;
					}
				//	$('#' + file.id).addClass('upload-state-done');
				});

				// 文件上传失败，显示上传出错。
				uploader.on('uploadError', function (file) {
					console.log('error')
					//$('#' + file.id).find('p.state').text('上传出错');
				});

				// 完成上传完了，成功或者失败，先删除进度条。
				var iNow = 0;
				uploader.on('uploadComplete', function (file) {
					
					
					//
				
				});
				
			},
			
			

			modifyPass(){
				if(!this.showPass){
					this.showPass = true;
					this.$refs['pass'].focus();

				}else{
					if(!this.formAdmin.userpwd){
						this.$Message.error('密码不能为空');
						return;
					}
					var s = this;
					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/zmitiadmin/updatestuedntpwd',
						data:{
							admintoken:s.userinfo.accesstoken,
							adminuserid:s.userinfo.userid,
							userid:s.formAdmin.userid,
							studentpwd:s.formAdmin.userpwd
						},
						success(data){
							s.$Message[data.getret === 0 ?'success':'error'](data.getmsg);
						}
					})
				}
			},
			delAdUser(userid){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/delstudent/',
					validate:s.validate,
					data:{
						userid,
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
					},success(data){
						if(data.getret === 0){
							s.$Message.success(data.getmsg);
							s.getNewsList();
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},

			getNewsTypeList(){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/getnewstypelist',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
					},
					success(data){
						if(data.getret === 0){
							s.newsTypeList = data.list;
						}
					}
				});
			},

			 
			getNewsList(){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/getstudentlist/',
					//validate:s.validate,
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						pagenum:1000,
						status:-1,//查询全部
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							s.userList = data.list;
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},


			addadUser(){

				 
			},

			 
			ok(){
				var s = this;

				if(s.currentUserId<=-1){

					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/zmitiadmin/addstudent/',
						validate:s.validate,
						data:{
							adminuserid:s.userinfo.userid,
							studentpwd:s.formAdmin.userpwd,
							admintoken:s.userinfo.accesstoken,
							username:s.formAdmin.username,
							mobile:s.formAdmin.mobile,
							companyname:s.formAdmin.companyname,
							studentname:s.formAdmin.studentname,
							email:s.formAdmin.email,
							provinceid:s.formAdmin.cityids[0],
							cityid:s.formAdmin.cityids[1],
							areaid:s.formAdmin.cityids[2],
							detailaddress:s.formAdmin.detailaddress
						},success(data){
							if(data.getret === 0){
								s.$Message.success(data.getmsg);
								s.getNewsList();
							}
							else{
								s.$Message.error(data.getmsg);
							}
						}
	
					})
				}else{
					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/zmitiadmin/updatestuedntinfo/',
						//validate:s.validate,
						data:{
							username:s.formAdmin.username,
							studentname:s.formAdmin.studentname,
							userid:s.currentUserId,
							adminuserid:s.userinfo.userid,
							admintoken:s.userinfo.accesstoken,
							provinceid:s.formAdmin.cityids[0],
							cityid:s.formAdmin.cityids[1],
							areaid:s.formAdmin.cityids[2],
							detailaddress:s.formAdmin.detailaddress,
							mobile:s.formAdmin.mobile,
							email:s.formAdmin.email,
							companyname:s.formAdmin.companyname,
							 
						},success(data){
							if(data.getret === 0){
								s.$Message.success(data.getmsg);
							}
							else{
								s.$Message.error(data.getmsg);
							}
						}
	
					})
				}
				
			},
			cancel(){
				this.formUser = {};
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
 