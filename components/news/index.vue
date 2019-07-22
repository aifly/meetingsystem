<template>
	<div class="wm-news-main-ui">
		<div>
			<Tab :refresh='refresh'></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>新闻信息管理</div>
				<div>
					<Button type="primary"　@click='addNews'>新增新闻</Button>
				</div>
			</header>
			<div class="wm-news-wrap">
				<Form ref="formValidate" v-show='showDetail' class="wm-meet-form wm-scroll" :style='{height:viewH - 64- 90+"px"}' :model="formNews" :rules="ruleValidate" :label-width="100">
					<FormItem label="是否为公告：" prop="type" v-if='!formNews.newsid'>
						<i-switch v-model="formNews.isNotice" size="large">
							<span slot="open">是</span>
							<span slot="close">否</span>
						</i-switch>
					</FormItem>
					<FormItem label="公告内容：" prop="isNotice" v-if='formNews.isNotice'>
						<Input :rows='5' type="textarea" ref='content' v-model="formNews.content" />
					</FormItem>
					<FormItem label="标题：" prop="title"  v-if='!formNews.isNotice'>
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
					<FormItem label="新闻分类：" prop="type" v-if='!formNews.isNotice'>
						<Select v-model="formNews.type" placeholder="请选择新闻分类">
							<Option :value="ntype.id" v-for='(ntype,i) in newsTypeList' :key="i">{{ntype.newstype}}</Option>
						</Select>
					</FormItem>
					<FormItem label="内容：" prop="content" v-if='!formNews.isNotice'>
						
						 <quill-editor 
							v-model="formNews.content" 
							ref="myQuillEditor" 
							aria-placeholder="123"
							:options="editorOption" 
							@blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
							@change="onEditorChange($event)">
							</quill-editor>
					</FormItem>
					
					<FormItem label="保密文件：" prop="encryptfile" class='wm-news-form-item' v-if='!formNews.isNotice'>
						<div class="wm-news-encryptfile" v-show='!formNews.pdfurl'>
							<div class=" news-encryptfile">

							</div>
							<span v-if='showEncryptfileBtn'>
								 <Button icon="ios-cloud-upload-outline">上传保密文件</Button> (保密文件仅支持pdf文件，最大支持8M)
							</span>	
							<span v-else class='wm-news-encryptfile-progressbar'>
								<label>{{percent}}%</label>
								<span :style="{WebkitTransform:'translate3d('+(percent-100)+'%,0,0)'}"></span>
							</span>
						</div>
						<div  v-if='formNews.pdfurl' class="wm-news-encryptfile-name" >
							<span>
								<a   v-html='formNews.pdfurl.split("/").pop()' target='_blank' :href='formNews.pdfurl'></a>
							</span>
							<span @click='delencryptfile' class="wm-news-remove-encryptfile wm-close"></span>
							<span v-if='isDisabledBtn' class='wm-news-encrypting'>文件加密中，请稍后... <Icon  type="ios-loading" class="demo-spin-icon-load"></Icon></span>

						</div>
					</FormItem>

					<FormItem label="附件：" prop="download" class="wm-news-download-wrap" v-if='!formNews.isNotice'>
						<section>
							<div class='wm-upload wm-news-download'>
								<div></div>
							</div>
							<div class="wm-news-download-list" v-if='formNews.download'>
								<div v-for='(dl,i) in formNews.download' v-if='dl' :key="i">
									
									<span class='wm-close' @click="deldownloadfile(dl,i)"></span>
									<a :href='dl.url' target='_blank'>
										<img :src='imgs[dl.url.split(".").pop()]' alt="">
										<span v-if='dl.isUploading' class='wm-news-download-progress'>{{dl.percent||0}}%</span>
										{{dl.url.split('/').pop()}}
									</a>
								</div>
							</div>
						</section>
					</FormItem>
			
					<FormItem label="新闻状态：" prop="encrypsign" v-if='!formNews.isNotice'>
						<RadioGroup v-model="formNews.state">
							<Radio :label="0">待发</Radio>
							<Radio :label="1">签发</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem label="提醒谁看：">
					    <Select @on-change="senduserlist" multiple  v-model="userids" placeholder='默认推送全部用户' style="width:200px">

					    <Option v-for="item in groupsitem" :value="item.value" :key="item.value+'1'">{{ item.label }}</Option>

					    </Select>
					</FormItem>
					<FormItem>
						<Button :disabled='isDisabledBtn' type="primary" @click="newsAction('click')" size='large'>{{currentNewsId>-1?'保存':'添加'}}</Button>
					</FormItem>
				</Form>
				<div v-if='!showDetail' class="wm-news-list">
					<Table :row-class-name="rowClassName" highlight-row   :loading="loading" @on-row-click='getRow' :disabled-hover='true' ref='scorelist' :border='false'  :data='newsList' :columns='columns'>
						<div slot='loading' class='wm-table-loading'>加载中<span>.</span><span>.</span><span>.</span></div>
					</Table>
					<div class='wm-news-list-action'>
						<div>
							<span title='上移一位' @click='changePos(1)' v-show='currentNews.newsid'>
								<Icon type="md-arrow-round-up" />
							</span>
							<span title='下移一位' @click='changePos(2)' v-show='currentNews.newsid'>
								<Icon type="md-arrow-round-down" />
							</span>
							<span v-if='false' title='上移至第一位' class='wm-go-top1' @click='changePos(3)'>
								<Icon type="md-arrow-round-up" />
							</span>
							<span v-if='false' title='上移至最后一位' class='wm-go-down' @click='changePos(4)'>
								<Icon type="md-arrow-round-down" />
							</span>
						</div>
						<Page @on-change='pageChange' :total="total" size="small" :page-size='pagenum'   />
					</div>
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
/* 	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css' */
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
				loading:true,
				
				provinceList:[],
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				currentNewsId:-1, 
				isDisabledBtn:false,
				showDetail:false,
				showPass:false,
				percent:0,
				page:1,
				defaultPagenum:(window.innerHeight - 200) / 50 | 0,
				pagenum:(window.innerHeight - 200) / 50 | 0,
				showEncryptfileBtn:true,
				viewH:window.innerHeight,
				newsTypeList:[],
				currentNews:{},
				meetid:'',
				meetname:'',
				newsauthtype:1,//是否推送				
				ruleValidate:{
					title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' }
					],
					type: [
                        { required: true, message: '新闻分类不能为空', trigger: 'blur' }
                    ]
				},
				columns:[
					 {
                        title:"序号",
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },{
						title:"标题",
						key:'title',
						align:'left',
						tooltip:true
					}
					,{
						title:"类型",
						key:'newstype',
						align:'left',
						width:120,
						render:(h,params)=>{
							return h('div',{},params.row.type*1 === -1 ? '系统公告':params.row.newstype);
						}
					},{
						title:"是否推荐",
						key:'iscommend',
						align:'center',
						width:100,
						render:(h,params)=>{
							return h('div',{},params.row.iscommend?'是':'否');
						}
					},{
						title:"是否签发",
						key:'state',
						align:'center',
						width:100,
						render:(h,params)=>{
							
							return h('div',{},params.row.state*1===1?'是':'否');
						}
					},{
						title:"创建时间",
						key:'createtime',
						align:'center',
						width:150
					},{
						title:'操作',
						key:'action',
						align:'center',
						width:240,
						render:(h,params)=>{


							return h('div', [
                               
                                h('Button', {
                                    props: {
                                        type: 'primary',
										size: 'small',
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
											s.formNews.isNotice = !s.formNews.type;
											if(!s.formNews.download instanceof Array){
												//s.formNews.download = s.formNews.download ? s.formNews.download.split(','):[];
											}
                                        }
                                    }
                                }, '详情'),
                                h('Button',{
                                	props: {
                                        type: 'primary',
										size: 'small'
										//disabled:params.row.newsauthtype===0?false:true
                                    },
                                    style: {
										margin: '2px 5px',
										border:'none',
										//background:params.row.newsauthtype===0?'#2db7f5':'#cccccc',
										background:'#2db7f5',
										color:'#fff',
										padding: '3px 7px 2px',
										fontSize: '12px',
										borderRadius: '3px'
                                    },
                                    on: {
										click: () => {
											this.goreadstatus(params.row.newsid,params.row.title);
										}
									}
                                },'阅读统计'),
                                h('Poptip',{
									props:{
										confirm:true,
										title:"确定要删除吗"
									},
									on:{
										'on-ok':()=>{
											this.delNews(params.row);
										},
										
									}
								},[
									h('Button', {
										props: {
											type: 'error',
											size: 'small'
										},
										style: {
											margin: '2px 5px'
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
					download:[],
					encrypsign:false,
					iscommend:false,
					state:1,
					isNotice:false,//是否是公告
					userids:'',//推送的用户
				},
				newsList:[],
				 
				directoryList:{

				},
				total:0,
				
				userinfo:{},
				userids:[],//推送的用户
				groupsitem:[]
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
			};
			this.meetid=s.$route.params.meetid;
			this.meetname=s.$route.params.meetname;
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
					extensions: 'doc,docx,pdf,zip,rar,vnd.openxmlformats-officedocument.wordprocessingml.document,msword,x-zip-compressed,octet-stream',
					mimeTypes: '*/*'
				}
			});
			this.getuserlist();//获取推送用户
		},

		watch:{
			formNews:()=>{

			},
			showDetail(val){
				if(val){
					s.isDisabledBtn = false;
				}
			},
			'formNews.content':{
				handler(val,oldval){
					var s = this;
					if(s.formNews.isNotice && val.length>55){
						val  = val.substr(0,55);
						s.formNews.content = val.substr(0,55);
						//s.$refs['content'].value  = val;
					
						s.$Message.error('公告内容最多55个字');
						return;
					}
				}
				
			}
		},
		
		methods:{

			rowClassName (row, index) {
				if(row.newsid === this.currentNews.newsid){
					return 'active';
				}
                return '';
            },

			changePos(index){

				var s = this;
				var sort = 0;
				switch (index) {
					case 1://上移一个
					if(s.currentRowIndex-1 >= 0){
						var tempSort = s.newsList[s.currentRowIndex-1].sort;
						var currentSort = s.newsList[s.currentRowIndex].sort;

						symbinUtil.ajax({
							url:window.config.baseUrl+'/zmitiadmin/updatenews',
							data:{
								admintoken : s.userinfo.accesstoken,
								adminuserid: s.userinfo.userid,
								newsid:s.currentNews.newsid,
								sort:tempSort
							},
							success(data){
								if(data.getret === 0 ){
									s.getNewsList();
								}
							}
						});
						symbinUtil.ajax({
							url:window.config.baseUrl+'/zmitiadmin/updatenews',
							data:{
								admintoken : s.userinfo.accesstoken,
								adminuserid: s.userinfo.userid,
								newsid:s.newsList[s.currentRowIndex-1].newsid,
								sort:currentSort
							},
							success(data){
								if(data.getret === 0 ){
									s.getNewsList();
								}
							}
						});
					//	this.currentNews = this.newsList[this.currentRowIndex];
						this.currentRowIndex = this.currentRowIndex -1;
					}else{
						
						if(this.page - 1<=0){
							return;
						}
						var pagenum = this.pagenum;
						this.pagenum += this.pagenum;
						this.page = this.page - 1;
						this.currentNews = {};
						this.getNewsList();
					}
					break;
					case 2://下移一个
					if(s.currentRowIndex+1<=s.newsList.length-1){
						var tempSort = s.newsList[s.currentRowIndex+1].sort;
						var currentSort = s.newsList[s.currentRowIndex].sort;
						symbinUtil.ajax({
							url:window.config.baseUrl+'/zmitiadmin/updatenews',
							data:{
								admintoken : s.userinfo.accesstoken,
								adminuserid: s.userinfo.userid,
								newsid:s.currentNews.newsid,
								sort:tempSort
							},
							success(data){
								if(data.getret === 0 ){
									s.getNewsList();
								}
							}
						});
						symbinUtil.ajax({
							url:window.config.baseUrl+'/zmitiadmin/updatenews',
							data:{
								admintoken : s.userinfo.accesstoken,
								adminuserid: s.userinfo.userid,
								newsid:s.newsList[s.currentRowIndex+1].newsid,
								sort:currentSort
							},
							success(data){
								if(data.getret === 0 ){
									s.getNewsList();
								}
							}
						});
						
						this.currentRowIndex = this.currentRowIndex + 1;
					}else{
						if(this.total<= this.newsList.length){
							return;
						}
						this.pagenum += this.pagenum;
						this.getNewsList();
					}
					break;
					case 3://移到第一个
						sort = s.total;
						this.currentRowIndex = 0;
					break;
					case 4://移到最一个。
						sort = 0;
						this.currentRowIndex = this.newsList.length -1;
					break;
				
					default:
						break;
				}
				if(index === 1 && s.currentRowIndex === 0){
					return;//移动第一行。
				}
				if(index === 4 && s.currentRowIndex === s.newsList.length-1){
					return;//移动最后一行。
				}
				
				

			},

			pageChange(page){
				this.page = page;
				this.getNewsList();
			},

			getRow(row,i){
				if(i === this.lastIndex && this.lastIndex>-1){
					this.currentNews = {};
					this.currentRowIndex = -1;
					this.lastIndex = -1;
				}
				else{
					this.currentNews = row;
					this.currentRowIndex = i;
					this.lastIndex = i;
				}
				//this.rowClassName(row,i);
			},

			refresh(){
				this.showDetail = false;
				this.pagenum = this.defaultPagenum;
				this.page = 1;
				this.getNewsList();
				this.formNews = {
					download:[]
				};
			},

			addNews(){
				this.showDetail = true;
				this.currentNewsId = -1;
				this.formNews = {
					pdfurl:'',
					download:[],
					encrypsign:false,
					iscommend:false,
					state:1
				};
			},

			delfile(url,fn){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/delnewsfile',
					data:{
						admintoken : s.userinfo.accesstoken,
						adminuserid: s.userinfo.userid,
						url
					},
					success(data){
						if(data.getret ===0||data.getret ===1005){//1005文件不存在。
							fn && fn();
						}
					}
				})
			},

			deldownloadfile(dl,i){
				var s = this;
				this.delfile(dl.url,()=>{
					s.formNews.download.splice(i,1);
					if(s.formNews.newsid){
						s.newsAction();
					}
				})
				//console.log(this.formNews.download);
			},

			delencryptfile(){
				this.delfile(this.formNews.pdfurl,()=>{
					this.formNews.pdfurl  = '';
					if(this.formNews.newsid){
						this.newsAction();
					}
				});
			},

			newsAction(type){
				var s = this;

				if(!s.formNews.newsid && s.formNews.isNotice){//添加
					s.formNews.title = '公告-'+new Date().toLocaleDateString();
					s.formNews.type = -1;//类型为-1的时候表示为公告。
					if(s.formNews.content.length>55){
						s.$Message.error('公告内容最多55个字');
						return;
					}
				}

				if(!s.formNews.title){
					this.$Message.error('新闻标题不能为空');
					return;
				}
				if(!s.formNews.type && !s.formNews.isNotice){
					this.$Message.error('新闻分类不能为空');
					return;
				}

				

				var p = JSON.parse(JSON.stringify(this.formNews));
				p.admintoken = s.userinfo.accesstoken;
				p.adminuserid = s.userinfo.userid;
				p.meetid = s.$route.params.meetid;
				p.newsauthtype=s.newsauthtype;
				var url = window.config.baseUrl+'/zmitiadmin/addnews';
				if(s.currentNewsId>-1){
					url = window.config.baseUrl+'/zmitiadmin/updatenews';
					p.newsid = s.currentNewsId;
				}
				p.iscommend = p.iscommend|0;
				p.encrypsign = p.encrypsign|0;
				if(p.encryptfile){
					p.encrypsign = 1;
				}
				 
				var arr = [];
				p.download.forEach((item,i)=>{
					arr.push(item.url);
				});
			 	p.download = arr.join(',');
				
				symbinUtil.ajax({
					url,
					data:p,
					success(data){
					//	console.log(data);
						if(data.getret === 0 ){
							if(type){
								s.$Message.success(data.getmsg);
								s.getNewsList();
								s.showDetail = false;
							}
							if(s.currentNewsId>-1 && p.encryptfile && p.encryptfile.length>0){//新增完成后，更新加密文件
								console.log('开始更新加密文件')
                                s.newsAction();
                            }
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
					accept:option.accept||{
						title: 'All',
						extensions: 'pdf',
						mimeTypes: '*/*'
					},
					//dnd:'.wm-myreport-left',
					disableGlobalDnd :true,//是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
				};

				if(option.pick === '.news-encryptfile'){
					params.fileSingleSizeLimit = 8*1024*1024;
				}

				
				var uploader = WebUploader.create(params);
				/* uploader.on('dndAccept',(file,a)=>{
					if(accepts[s.currentType].extensions.indexOf(file['0'].type.split('/')[1])<=-1){
						s.$Message.error('目前不支持'+file['0'].type.split('/')[1]+'文件格式');
					}
				}) */

				uploader.on("beforeFileQueued",function(file){
					
					if(option.accept.extensions.indexOf(file['type'].split('/')[1])<=-1){
						s.$Message.error('当前文件格式不支持');
						
						return;
					}
					if(file.size>params.fileSingleSizeLimit){
						s.$Message.error('当前文件过大。最大8M');
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
						s.formNews.download.push({url:file.name});
						s.formNews.download[s.formNews.download.length-1].isUploading = true;
						console.log(file);
						i++;
					}
					 
				});
				// 文件上传过程中创建进度条实时显示。
				uploader.on('uploadProgress', function (file, percentage) {
						var index = -1;
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
					}
				
				 
				});

				// 文件上传成功，给item添加成功class, 用样式标记上传成功。
				var iNow = 0;
				uploader.on('uploadSuccess', function (file,data) {
					console.log('success ....',data.getret );
					if(data.getret === 0){
						if(option.pick === '.news-encryptfile'){//加密文件上传
							s.showEncryptfileBtn = true;
							s.formNews.pdfurl = data.url;
							s.isDisabledBtn = true;
							s.formNews.encrypsign = true;
							symbinUtil.ajax({
								url:window.config.baseUrl+'/zmitiadmin/pdftrunimage',
								data:{
									adminuserid:s.userinfo.userid,
									admintoken:s.userinfo.accesstoken,
									pdfurl:data.fileurl
								},
								success(data){
									s.isDisabledBtn = false;
									if(data.getret === 0){
										s.formNews.encryptfile = data.list;
										if(s.formNews.newsid){
											s.newsAction();
										}
									//	console.log(data.list);
									}
									else{
									//	console.log(data);
										s.$Message.success('pdf转图片失败');
									}
								}
							})

						}else if(option.pick === '.wm-upload'){//附件上传
							s.formNews.download.splice(s.formNews.download.length-1,1,{url:data.fileurl});
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
							}
							
						}
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
			
			
 
			delNews(row){
				var newsid = row.newsid;
				var s = this;
				var url = [];
				if(row.pdfurl){
					url.push(row.pdfurl);
				}
				if(row.wordurl){
					url.push(row.wordurl);
				}
				if(row.encryptfile){
					url = url.concat(row.encryptfile.split(','));
				}
				if(row.download && row.download instanceof Array && row.download.length){
					row.download.forEach((item)=>{
						url.push(item.url)
					})
					
				}
			
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/delnews/',
					validate:s.validate,
					data:{
						newsid,
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
					},success(data){
						if(data.getret === 0){
							s.$Message.success(data.getmsg);
							if(url.length){

								symbinUtil.ajax({
									url:window.config.baseUrl+'/zmitiadmin/delfiles',
									data:{
										admintoken:s.userinfo.accesstoken,
										adminuserid:s.userinfo.userid,
										url:url.join(',')
									},
									success(data){
										console.log(data);
									}
								})
							}
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
						pagenum:s.pagenum,
						page:s.page,
						meetid:s.$route.params.meetid,
						//status:-1,//查询全部
					},
					success(data){
					//	console.log(data);
						if(data.getret === 0){
							s.total =  data.totalnum.num;
							data.list.forEach((item=>{
								item.iscommend = !!item.iscommend;
								item.encrypsign = !!item.encrypsign;
								var download = [];
								
								(item.download||"").split(',').map((d)=>{
									if(d){
										download.push({
											url:d
										})
									}
								});
								item.download = download;
							}))
							s.formNews = {
								pdfurl:'',
								download:[],
								iscommend:false,
								encryptfile:false
							}
							s.newsList = data.list;
							s.loading = false;

							
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
            getuserlist(){//获取推送用户
            	var s = this;
            	symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/getstudentlist/',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						meetid:s.meetid,
						pagenum:1000,
						status:-1,//查询全部
					},
					success(data){
						if(data.getret === 0){
							console.log(data,'获取推送用户');
							//s.groupsitem = data.list;
							data.list.map(function(item,index){
								s.groupsitem[index]={
									'label':item.studentname,
									'value':item.userid
								}
							})
							console.log(s.groupsitem,'s.groupsitem'); 
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})	
            	
            },
            senduserlist(){//推送指定用户
            	var s = this;
            	s.formNews.userids=s.userids.join(',');//推送指定用户
            	console.log(s.formNews.userids,'推送指定用户');
            	s.formNews.userids==''?s.newsauthtype=1:s.newsauthtype=0;
            	console.log(s.newsauthtype,'推送状态');
            },
            goreadstatus(id,newtitle){//查看阅读状态
            	var s = this;
            	console.log(id,'查看阅读状态');
            	window.location.hush='./#/meetingreadstatus/'+s.meetid+'/'+s.meetname+'/'+id+'/'+encodeURIComponent(newtitle);
            }
		}
	}
</script>
 <style>
	.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
        -webkit-animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
	 .ivu-table .active td{
        background-color: #ff6600;
        color: #fff;
    }
 </style>