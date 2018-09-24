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
				<Form ref="formValidate" v-show='showDetail' class="wm-meet-form wm-scroll" :style='{height:viewH - 64- 90+"px"}' :model="formNews" :rules="ruleValidate" :label-width="90">
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
						<div class="wm-news-encryptfile" v-show='!formNews.pdfurl'>
							<div class=" news-encryptfile">

							</div>
							<Button icon="ios-cloud-upload-outline">上传保密文件</Button> (保密文件仅支持pdf文件)
						</div>
						<div  v-if='formNews.pdfurl' class="wm-news-encryptfile-name" >
							<span  v-html='formNews.pdfurl.split("/").pop()'></span>
							<span @click='delencryptfile' class="wm-news-remove-encryptfile wm-close"></span>
						</div>
					</FormItem>

					<FormItem label="附件：" prop="download" class="wm-news-download-wrap">
						<section>
							<div class='wm-upload wm-news-download'>
								<div></div>
							</div>
							<div class="wm-news-download-list" v-if='formNews.download'>
								<div v-for='(dl,i) in formNews.download.split(",")' v-if='dl' :key="i">
									<span class='wm-close' @click="deldownloadfile(dl,i)"></span>
									<img :src='imgs[dl.split(".").pop()]' alt="">
									{{dl.split('/').pop()}}
								</div>
							</div>
						</section>
					</FormItem>
			
					<FormItem label="新闻状态：" prop="encrypsign">
						<RadioGroup v-model="formNews.state">
							<Radio :label="0">待发</Radio>
							<Radio :label="1">已发</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem>
						<Button type="primary" @click="newsAction()" size='large'>{{currentNewsId>-1?'编辑新闻':'添加新闻'}}</Button>
					</FormItem>
				</Form>
				<div v-if='!showDetail' class="wm-news-list">
					<Table :disabled-hover='true' ref='scorelist' :border='false'  :height='viewH - 64- 72 ' :data='newsList' :columns='columns'   stripe></Table>
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
		name:'zmitinews',
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
				currentNewsId:-1, 
				showDetail:false,
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
				columns:[
					{
						title:"标题",
						key:'title',
						align:'center'
						
					}
					,{
						title:"新闻类型",
						key:'newstype',
						align:'center'
					},{
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
											s.formNews = params.row;
											s.formNews.type = params.row.id;
											s.currentNewsId = params.row.newsid;
											s.formNews.iscommend = !!s.formNews.iscommend;
											s.formNews.encrypsign = !!s.formNews.encrypsign;
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
											//this.delAdUser(params.row.userid);
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
				formNews:{
					pdfurl:'',
					download:'',
					encrypsign:false,
					iscommend:false
				},
				newsList:[],
				 
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
				accept:{
					title: 'All',
					extensions: 'pdf',
					mimeTypes: '*/*'
				}
				 
			});
			this.upload({
				pick:'.wm-upload',
				accept:{
					title: 'All',
					extensions: 'doc,docx,pdf,zip,rar',
					mimeTypes: '*/*'
				}
			});
		},

		watch:{
			formNews:()=>{

			}
		},
		
		methods:{

			deldownloadfile(dl,index){
				
				var delstr = dl+','
				if(index>=this.formNews.download.split(',').length-1){
					delstr = ','+dl;
				}
				if(this.formNews.download.split(',').length === 1){
					this.formNews.download =  '';
				}else{
					this.formNews.download = this.formNews.download.replace(delstr,'');
				}
				console.log(this.formNews.download);
			},

			delencryptfile(){
				this.formNews.pdfurl  = '';
			},

			newsAction(){
				var s = this;
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
				if(p.download){

					p.download = p.download.replace(/http:/ig,'https:');
					p.download = p.download.replace(/https:\/\//ig,'');
					var arr = [];
					var http = window.config.baseUrl.replace('https://','').split('/');
					http.pop();
					p.download.split(',').map((dl)=>{
						var dl = dl.replace(http,'');
						arr.push(dl.replace('https//',''));
					});
					p.download = arr.join('/');
				}
				if(p.encryptfile){
					p.encryptfile = p.encryptfile.replace(/http:/ig,'https:');
					p.encryptfile = p.encryptfile.replace(/https:\/\//ig,'');
					var arr1 = [];
					p.encryptfile.split(',').map((dl)=>{
						//http.pop();
						var dl = dl.replace(http,'');
						arr1.push(dl.replace('https//',''));
					});
					p.encryptfile = arr1.join(',');
				}
				if(p.wordurl){
					p.wordurl = p.wordurl.replace(/http:/ig,'https:');
					p.wordurl = p.wordurl.replace(/https:\/\//ig,'');
					p.wordurl = p.wordurl.replace(http,''); 
				}
				
				if(p.pdfurl){
					p.pdfurl = p.pdfurl.replace(/http:/ig,'https:');
					p.pdfurl = p.pdfurl.replace(/https:\/\//ig,'');
					p.pdfurl = p.pdfurl.replace(http,'');
				}
				
				symbinUtil.ajax({
					url,
					data:p,
					success(data){
						console.log(data);
						if(data.getret === 0 ){
						 
							s.getNewsList();
							s.$Message.success(data.getmsg);
							s.showDetail = false;
						}
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
					if(option.accept.extensions.indexOf(file['type'].split('/')[1])<=-1){
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
						if(option.pick === '.news-encryptfile'){//加密文件上传
							s.formNews.pdfurl = data.fileurl;
							symbinUtil.ajax({
								url:window.config.baseUrl+'/zmitiadmin/pdftrunimage',
								data:{
									adminuserid:s.userinfo.userid,
									admintoken:s.userinfo.accesstoken,
									pdfurl:s.formNews.pdfurl
								},
								success(data){
									if(data.getret === 0){
										s.$Message.success('pdf转图片成功');
										s.formNews.encryptfile = data.list;
										console.log(data.list);
									}
									else{
										console.log(data);
										s.$Message.success('pdf转图片失败');
									}
								}
							})

						}else if(option.pick === '.wm-upload'){//附件上传
							if(s.formNews.download.length <=0){
								s.formNews.download = data.fileurl;
							}else{
								s.formNews.download += ',' + data.fileurl;
							}
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
					url:window.config.baseUrl+'/zmitiadmin/getnewslist/',
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
							data.list.forEach((item=>{
								item.iscommend = !!item.iscommend;
								item.encrypsign = !!item.encrypsign;
							}))
							s.formNews = {
								pdfurl:'',
								download:'',
								iscommend:false,
								encryptfile:false
							}
							s.newsList = data.list;
							
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
 