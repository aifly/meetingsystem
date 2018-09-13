<template>
	<div class="wm-myreport-main-ui">


		

		 <Split v-model="split1">
			<div slot="left" class="wm-myreport-left">
				<div class="wm-myreport-upload-C lt-full">

				</div>
				<header > 
					 <span>我的上报 </span><span style='font-size:12px;color:#f5a420;left:70px;'>(双击打开浏览)</span>
					 <ul>
						 <li @click='changeCurrentType(i)' v-for='(menu,i) in menus' :key="i" :class="{'active':currentType === i}">
							 <img v-if='i===0' :src="imgs.imgIco" alt="">
							 <img v-if='i===1' :src="imgs.videoIco" alt="">
							 <img v-if='i===2' :src="imgs.audioIco" alt="">
							 <img v-if='i===3' :src="imgs.dongmanIco" alt="">
							 <img v-if='i===4' :src="imgs.h5Ico" alt="">
							 上报{{menu.split('-')[0]}}
						 </li>
					 </ul>
				</header>
				<section>
					<div class="wm-myreport-list-C">
						<div v-show='reportList.length<=0' class="wm-no-report">
							<div >
								<img :src="imgs['upload'+(currentType+1)]" alt="">
								<Button type="primary" size='large'>点我上报</Button>
								<div class="wm-upload-tip">按住ctrl键可以上传多个文件，支持拖拽上传</div>
								<div class="wm-upload-tip" style="color:#f5a420;font-size:16px;font-weight:bold;" v-html='"支持上传格式："+accepts[currentType].extensions'></div>
								<div class="wm-upload"  @click='showUploadDialog = true' ></div>
							</div>
						</div>
						<div v-if='reportList.length>0' class="wm-report-list" :style="{height:viewH - 60-60-20- 80+'px'}">
							<ul>
								<li @dblclick="previewReport(report)" @click.prevent='showDetail(report,i)'  class="wm-report-item" v-for='(report,i) in reportList' :key="i">
									<div class="wm-report-status" v-if='report.status === 0'>
										<img :src="imgs.uncheck1" alt="">
									</div>
									<div  class="wm-report-status" v-if='report.status === 1'>
										<img :src="imgs.pass1" alt="">
									</div>
									<div :class="{'active':i === currentReportIndex}" class='wm-report-item-bg'>
										<img :src="report.pcbilethum||imgs.poster" alt="">
									</div>
									<span v-if='!report.isLoaded' class="wm-file-progress">{{report.process}}</span>
									
									<div v-if='!report.isLoaded' class="wm-uploading"></div>
									<div class="wm-report-disabled-mask" v-if='report.status===2'></div>
									<span class="wm-file-disabled" v-if='report.status === 2'>
										<span>
										</span>
										被管理员发回，不可用
									</span>
									<div class="wm-report-action" v-if='report.isLoaded'>
										<div class="wm-report-action-icon"></div>
										<ul>
											<li @click='showReportDetail(report)'>
												<Icon type="ios-create" /> 编辑
											</li>
											<li>

												<Poptip	
													style="color:#000"
													confirm
													title="确定要删除此作品吗?"
													@on-ok="deleteReport(i)"
													>
													<div class="wm-del-ico"><Icon type="ios-trash-outline" /> 删除</div>
												</Poptip>
												
											</li>
										</ul>
									</div>
									<div v-if='report' :title='report.filetitle' class="wm-report-item-name zmiti-text-overflow">{{report.filetitle}}</div>
								</li>	
							</ul>
						</div>
					</div>
					<footer class="wm-report-footer">
						<div v-show='currentType === 0 && reportList.length>0' >
							<div class="wm-upload" @click='showUploadDialog = true'></div>
							<div class="lt-full">
								<Icon type="md-add" /> <span>点击添加图片</span>
							</div>
							<div class="wm-upload-tip">按住ctrl键可以上传多个文件，支持拖拽上传</div>
						</div>
						<div v-show='currentType === 1 && reportList.length>0' class="wm-uplad-add-video">
							<div class="wm-upload" @click='showUploadDialog = true'></div>
							<div class="lt-full">
								<Icon type="md-add" /> <span>点击添加视频</span>
							</div>
							<div class="wm-upload-tip">按住ctrl键可以上传多个文件，支持拖拽上传</div>
						</div>
						<div v-show='currentType === 2 && reportList.length>0' class="wm-uplad-add-audio">
							<div class="wm-upload" @click='showUploadDialog = true'></div>
							<div class="lt-full">
								<Icon type="md-add" /> <span>点击添加音频</span>
								<div class="wm-upload-tip">按住ctrl键可以上传多个文件，支持拖拽上传</div>
							</div>
						</div>
						<div v-show='currentType === 3 && reportList.length>0' class="wm-uplad-add-dongman">
							<div class="wm-upload" @click='showUploadDialog = true'></div>
							<div class="lt-full">
								<Icon type="md-add" /> <span>点击添加动漫</span>
								<div class="wm-upload-tip">按住ctrl键可以上传多个文件，支持拖拽上传</div>
							</div>
						</div>
						<div v-show='currentType === 4 && reportList.length>0' class="wm-uplad-add-h5">
							<div class="wm-upload" @click='showUploadDialog = true'></div>
							<div class="lt-full">
								<Icon type="md-add" /> <span>点击添加h5</span>
								
							</div>
						</div>
					</footer>
				</section>
			</div>
			<div slot="right" class="wm-myreport-right wm-scroll" v-if='reportList[currentReportIndex]'>
				<div   class="wm-right-thumb">
					<img :src='reportList[currentReportIndex].pcbilethum||imgs.poster' />	
				</div>
				
				<div v-if='item.loading' class="wm-myreport-title wm-myreport-item" v-for='(item,i) in configList' :key='i'>
					<div v-if='item.fieldname!=="userlabel" && (item.type === "text" ||item.type === "textarea"  ||item.type === "select")'>{{item.name}}：</div>
					<div v-if='item.fieldname!=="userlabel" && item.fieldname!=="filesize"&&(item.type === "text" ||item.type === "textarea")' >
						<span v-if='!item.edit'>{{reportList[currentReportIndex][item.fieldname]}}</span>

						<input :placeholder="item.placeholder" @blur='modifyReport(reportList[currentReportIndex][item.fieldname],item.fieldname)' v-else type="text" v-model="reportList[currentReportIndex][item.fieldname]">
					</div>

					<div v-if='item.fieldname ==="filesize && false" &&(item.type === "text" ||item.type === "textarea"  ||item.type === "select")'>{{item.name}}：</div>
					<div v-if='item.fieldname ==="filesize" &&(item.type === "text" ||item.type === "textarea")' @dblclick="editItem(item)" >
						<span v-if='!item.canedit'>{{reportList[currentReportIndex][item.fieldname]+ ' ' +reportList[currentReportIndex]['filesizeunit']}}</span>
					</div>

					<div  v-if='item.type ===  "select"'>
						<Select @on-change='modifyPublicadtype(item.fieldname)'   v-model="formAdmin[item.fieldname]" size='small'  style="width:100px">
							<Option v-for="(dt,k) in item.data" :value="dt" :key="k">{{ dt.split('-')[0] }}</Option>
						</Select>
					</div>
					
					<div @dblclick="editItem(item)" v-if='false && item.type === "select" && !item.canedit '>
						{{formAdmin[item.fieldname]&& formAdmin[item.fieldname].split('-')[0]}}
					</div>

					<section class="wm-tag-list-C" v-if='item.fieldname === "userlabel"'>
						<div class="wm-userlabel-header">
							<div>标签</div>
							<div><input type="text" placeholder="输入标签名" v-model="detailtag" @keydown.13='addTagByDetail(item)' /></div>
							<div>
								<div class="wm-add-label" @click='addTagByDetail(item)'>

								</div>
							</div>
							
						</div>
						<div class="wm-tag-list">
							<Tag @on-close='removeTag(item.fieldname,i)' :color="colorList[i]?colorList[i]:colorList[i-formAdmin.tagList.length]" :key='i' closable v-if='tag' v-for="(tag,i) in (reportList[currentReportIndex][item.fieldname]||'').split(',')">{{tag}}</Tag>
						</div>
					</section>
				</div>


			</div>
		</Split>


		<Modal
			v-model="visible"
			title="编辑作品信息"
			@on-ok="ok"
			@on-cancel="cancel">
			<Form ref="formAdmin" :model="formAdmin" :label-width="72" :rules="ruleValidate">
				<FormItem v-if='item.edit' :label="item.name+'：'" :prop="item.field" v-for='(item,i) in configList' :key='i'> 
					<Input v-if='item.type === "text"'  v-model="formAdmin[item.fieldname]" :placeholder="item.name" autocomplete="off" />
					<Input v-if='item.type === "textarea" ' :type="item.type"  v-model="formAdmin[item.fieldname]" :placeholder="item.placeholder||item.name" autocomplete="off"/>
					<Select v-model="formAdmin[item.fieldname]" v-if='item.type === "select"'>
						<Option v-for="(dt,k) in item.data" :value="dt" :key="dt">{{ dt.split('-')[0] }}</Option>
					</Select>

					<div class="wm-tags" v-if='item.type === "label"'>
						<input placeholder="按回车添加标签" type="text" v-model="tag" @keydown.13='addTag' />
						<Tag @on-close="deltag(tag)" closable :color="colorList[i]?colorList[i]:colorList[i-formAdmin.tagList.length]" v-for="(tag,i) in formAdmin.tagList" :key='i'>{{tag}}</Tag>
					</div>
				</FormItem>
				 
			</Form>
		</Modal>


		<Modal
			:footer-hide='true'
			v-model="showUploadDialog "
			:title="'添加上报'+(menus[currentType]?menus[currentType].split('-')[0]:'')"
			@on-ok="ok"
			@on-cancel="cancel">
			<Form  ref="formUpload" :model="formUpload" :label-width="90" >
				<FormItem class="wm-report-upload-item" v-if='item.edit || item.fieldname === "userlabel"' :label="item.name+'：'" :prop="item.field" v-for='(item,i) in configList' :key='i'  :class="{'wm-require':item.notnull}"> 
					<Input @on-blur='checkUpload' v-if='item.type === "text"&& item.fieldname !== "userlabel"'  v-model="formUpload[item.fieldname]" :placeholder="item.placeholder||item.name" autocomplete="off" />
					
					<Input  @on-blur='checkUpload' v-if='item.fieldname === "filedesc"'  :type="item.type"  v-model="formUpload[item.fieldname]"  :placeholder="item.placeholder||item.name" autocomplete="off"/>
					<div  v-if='item.type === "select"'>
						<Select @on-change='checkUpload($event,"select")' v-model="formAdmin[item.fieldname]">
							<Option v-for="(dt,k) in item.data" :value="dt" :key="dt">{{ dt.split('-')[0] }}</Option>
						</Select>
					</div>

					<div class="wm-tags" v-if='item.fieldname === "userlabel"'>
						<input placeholder="按回车添加标签" type="text" v-model="beforeUploadTag" @keydown.13='addTagBeforeUpload' />
						<Tag color='warning' @on-close="deltag(tag)" closable  v-for="(tag,i) in formUpload.tagList" :key='i'>{{tag}}</Tag>
					</div>
				</FormItem>

				<FormItem class="wm-before-upload-C">
					<section :class="{'disabled':!showUploadFile}">
						<div class="wm-upload-before" v-show='showUploadFile'></div>
						<Icon type="ios-add-circle" />
						<div>上传附件</div>
					</section>
					<div class="wm-upload-tip" style="position: absolute;bottom: 0;width: 300px;margin-left: 30px;color:#f5a420;font-size:16px;font-weight:bold;    word-wrap: break-word;" v-html='"支持上传格式："+accepts[currentType].extensions'></div>
				</FormItem>

				<FormItem class="wm-before-upload-C" label="">
					<div style="margin-left:-80px;color:#b20000">提示：选择文件后自动上传</div>
				</FormItem>
				 
			</Form>
		</Modal>
		<Detail  :configList='configList' type="myreport" :showPreview='showPreview'  :showMaskDetail='showMaskDetail' :currentReportIndex='currentReportIndex' :closePreview='closePreview' :reportList='reportList'></Detail>

		<div class="wm-report-tips lt-full" v-if='showReportTip'>
			<img :src="imgs.tip" alt="" @click="showReportTip = false">
		</div>



	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';
	import Vue from 'vue';
	import QRCode from '../lib/qrcode';
	import Detail from '../../common/mask/detail';

	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				showUploadDialog:false,
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				tag:"",
				beforeUploadTag:"",
				currentType:0,
				accepts:[
					{
						title: 'Images',
						extensions: 'gif,jpg,jpeg,bmp,png,tiff,tif',
						mimeTypes: 'image/*'
					},{
						title: 'Video',
						extensions: 'mp4,webm',
						mimeTypes: 'video/*'
					},{
						title: 'Audio',
						extensions: 'aac,ogg,aac,wma,mp3,vnd.dlna.adts',
						mimeTypes: 'auido/*'
					},{
						title: 'All',
						extensions: 'mp3,gif,jpg,jpeg,bmp,png,tiff,tif,mp4,webm,aac,ogg,aac,wma,vnd.dlna.adts',
						mimeTypes: '*/*'
					},{
						title: 'Images',
						extensions: 'gif,jpg,jpeg,bmp,png,tiff,tif',
						mimeTypes: 'image/*'
					}
				],
				publicadtype:"",
				currentReportIndex:0,
				showOriginalImg:false,
				showPreview:false,
				showMaskDetail:true,
				detailtag:'',
				showReportTip:false,
				defaultReportList:[],
				menus:[],
				colorList:['default','success','primary','error','warning','red','orange','gold','yellow'],
				split1: 0.8,
				viewH:window.innerHeight,
				showUploadFile:false,
				configList:[],
				formUpload:{
					tagList:[]
				},
				formAdmin:{
					tagList:[]
				},
				ruleValidate: {
                     author:{
						 required:true,
						 trigger:'blur'
					 }
                },
				
				reportList:[],
				userinfo:{}
			}
		},
		components:{
			Detail
		},

		beforeCreate(){
			window.s = this;
			//var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

			///this.validate = validate;
		},
		watch:{
			showUploadDialog(val){
				this.configList.forEach((item)=>{
					if(item.fieldname === 'previewurl' && this.menus[this.currentType] === 'h5-zmiti'){
						item.notnull = val|0;
					}
				});
			}
		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			this.getMyreportList(()=>{
				this.changeCurrentType(0,'first');
			});
			var {obserable} = Vue;
			var t = setInterval(()=>{
				
				var id  = obserable.trigger({
					type:'getCurrentSourceId'
				});
				
				if(id){
					clearInterval(t);
					setTimeout(() => {
						this.upload(id);
					}, 1000);
				}
			},20)

			obserable.on('searchReport',data=>{
				this.searchByKW(data);
			})
			window.onkeydown = (e)=>{
				if(e.keyCode === 27 || e.keyCode === 8){
					this.showReportTip = false;
					this.closePreview();
				}
				if(this.showPreview){
					if(e.keyCode === 37 ){
						this.currentReportIndex--;
						if(this.currentReportIndex<=-1){
							this.currentReportIndex = this.reportList.length -1;
						}
						this.currentReportIndex %= this.reportList.length;
						
					}
					else if(e.keyCode === 39){
						this.currentReportIndex++;
						this.currentReportIndex %= this.reportList.length;
					}
				}
			}
			this.getConfigFile();
			

			/* this.$Notice.info({
				title: '双击上报作品可以预览'
			}); */

			if(!window.localStorage.getItem('wm-report-tip')){
				this.showReportTip = true;
				window.localStorage.setItem('wm-report-tip',1);
			} 
		},
		
		methods:{

			checkUpload(val,type){
				this.showUploadFile = true;
				
				this.configList.map((item)=>{
					if(item.notnull && item.edit){
						if(!this.formUpload[item.fieldname] && item.fieldname !== 'publicadtype'){
							this.showUploadFile = false;		
						}
					}
				});

				if(s.menus[this.currentType] === 'h5-zmiti'){
					if(!this.formUpload['previewurl']){
						this.showUploadFile = false;	
					}
				}
				
				if(type === 'select'){
					this.configList.forEach((item)=>{
						if(item.fieldname === 'previewurl'){
							item.notnull = val === 'h5-zmiti' ? 1 : 0;
						}
					});
					
					this.configList.forEach((item)=>{
						if(val === 'h5-zmiti' && !this.formUpload.previewurl){
							this.showUploadFile = false;		
							//item.notnull = val === 'h5-zmiti' ? 1 : 0;
							
						}
					});
				
					s.menus.map((item,i)=>{
						if(item === val){
							this.changeCurrentType(i);
						}
					})
				}
				//console.log(this.showUploadFile);
				if(this.showUploadFile){
					var id  = Vue.obserable.trigger({
						type:'getCurrentSourceId'
					});
					this.upload(id);
				}
			},

			changeCurrentType(index,type){
				var s = this;
				this.currentType = index;
				var id  = Vue.obserable.trigger({
					type:'getCurrentSourceId'
				});
				this.upload(id);
				this.currentReportIndex = 0;
				this.filterReportList();
				
				this.formAdmin['publicadtype'] = this.menus[index];
				if(!type && false){
					s.formUpload = s.reportList[s.currentReportIndex ] || {
						tagList:[],
						publicadtype:s.menus[index]
					};
	
					s.formUpload.userlabel  = s.formUpload.tagList? s.formUpload.tagList.join(',') : '';
					s.formAdmin = s.reportList[s.currentReportIndex ] || {
						tagList:[],
						publicadtype:s.menus[index]
					};

					s.formAdmin.userlabel && (s.formAdmin.tagList = s.formAdmin.userlabel.split(','));
				}
			


			},

			deleteReport(i){
				var s = this;
				var id  = Vue.obserable.trigger({
					type:'getCurrentSourceId'
				})
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/wmadvuser/delresource/',
					data:{
						username:s.userinfo.username,
						usertoken:s.userinfo.accesstoken,
						resourceid:id,
						id:s.formAdmin.id
					},
					success(data){
						s.$Message[data.getret === 0?'success':'error'](data.getmsg); 
						s.reportList.splice(i,1);

						s.currentReportIndex  = s.reportList.length -1;
						s.getMyreportList();
						
					}
				})
			},

			searchByKW(kw){
				var s = this;
				if(kw){
					s.reportList = s.reportList.filter((item)=>{
						return item.filetitle.indexOf(kw)>-1;
					});
				}else{
					s.getMyreportList();
				}
			},

			editReportByItem(p){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/wmadvuser/editresource',
					data:p,
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						if(data.getret === 0){
							s.configList.forEach((it)=>{
								it.canedit = false;
							});
							s.reportList[s.currentReportIndex].status = 0;
							s.filterReportList();
							s.configList = s.configList.concat([]);
						}
					}
				})
			},
			removeTag(filename,index){
				
				var s = this;
				var id  = Vue.obserable.trigger({
					type:'getCurrentSourceId'
				})

				this.formAdmin.tagList.splice(index,1);
				this.detailtag = '';
				
				var p = {
					username:s.userinfo.username,
					usertoken:s.userinfo.accesstoken,
					resourceid:id,
					id:s.formAdmin.id,
					[filename]:this.formAdmin.tagList.join(',')
				}
			
				this.editReportByItem(p,'移除标签');
				setTimeout(() => {
					this.getMyreportList();
				}, 400);
			},
			addTagByDetail(item){
				if(!this.detailtag){
					this.$Message.error('标签名不能为空');
					return;
				}
				var s = this;
				var id  = Vue.obserable.trigger({
					type:'getCurrentSourceId'
				})
				this.formAdmin.tagList = this.formAdmin.tagList||[];
				this.formAdmin.tagList.push(this.detailtag);
				this.detailtag = '';
				
				var p = {
					username:s.userinfo.username,
					usertoken:s.userinfo.accesstoken,
					resourceid:id,
					id:s.formAdmin.id,
					[item.fieldname]:this.formAdmin.tagList.join(',')
				}
			
				this.editReportByItem(p,'添加标签');
				setTimeout(() => {
					this.getMyreportList();
				}, 400);
			},

			modifyPublicadtype(key){
				var s = this;
				var id  = Vue.obserable.trigger({
					type:'getCurrentSourceId'
				})
				if(!s.formAdmin.id){
					return;
				}
				var p = {
					username:s.userinfo.username,
					usertoken:s.userinfo.accesstoken,
					resourceid:id,
					id:s.formAdmin.id,
					[key]:s.formAdmin[key]
				}
				this.editReportByItem(p,'修改分类');
			},

			modifyReport(model,key){
				
				var s = this;
				var id = Vue.obserable.trigger({
					type:'getCurrentSourceId'
				});
				
				var p = {
					username:s.userinfo.username,
					usertoken:s.userinfo.accesstoken,
					resourceid:id,
					id:s.formAdmin.id,
					[key]:model
				}
				this.editReportByItem(p,'修改作品 :'+key);
			},

			editItem(item){
				if(!item.edit){
					return;
				}
				this.configList.forEach((it)=>{
					it.canedit = false;
				});
				item.canedit = true;
				this.configList = this.configList.concat([]);
			},
			closePreview(){
				this.showPreview = false;
				this.showMaskDetail = true;
				this.showOriginalImg = false;
			},

			previewReport(){//双击预览作品、
				this.showPreview = true;
				var s = this;
				if(s.menus[s.currentType] === "h5-zmiti"&&s.reportList[s.currentReportIndex].previewurl){
					setTimeout(() => {
						new QRCode(this.$refs['qrcode'],{
							height:130,
							width:130,
							text:s.reportList[s.currentReportIndex].previewurl
						})
					}, 100);
				}
			},

			showDetail(report,index){
				this.currentReportIndex = index;
				this.formAdmin = report;
				this.formAdmin.tagList = this.formAdmin.userlabel.split(',');
				//this.currentReport = report;
			},
			showReportDetail(report){
				this.visible = true;
				this.formAdmin = report;
				this.formAdmin.tagList = this.formAdmin.userlabel.split(',');
				var s = this;
				this.configList.map((col,i)=>{
					//s.formAdmin[col.fieldname] = '';
					if(col.notnull){
						s.ruleValidate[col.fieldname] = { required: true, message: col.name+'不能为空', trigger: 'blur' }
					}
				})
			},

			deltag(name){

				var index = this.formUpload.tagList.indexOf(name);
				this.formUpload.tagList.splice(index,1);

				if(this.showUploadFile){
					var id  = Vue.obserable.trigger({
						type:'getCurrentSourceId'
					});
					this.upload(id);
				}
			},
			addTagBeforeUpload(){
				if(!this.beforeUploadTag){
					return;
				}
				this.formUpload.tagList = this.formUpload.tagList || [];
				this.formUpload.tagList.push(this.beforeUploadTag);
				this.beforeUploadTag =  '';
				if(this.showUploadFile){
					var id  = Vue.obserable.trigger({
						type:'getCurrentSourceId'
					});
					this.upload(id);
				}
			},
			addTag(){
				if(!this.tag){
					return;
				}
		
				this.formAdmin.tagList = this.formAdmin.tagList || [];
				this.formAdmin.tagList.push(this.tag);
				this.tag = '';
			},
			
			getConfigFile(){
				/*var s = this;
				$.getJSON('./components/myreport/data.json',(data)=>{
					console.log(data);
					s.configList = data.collectionitems;
					data.collectionitems.map((col,i)=>{
						s.formAdmin[col.fieldname] = '';
						if(col.notnull){
							s.ruleValidate[col.field] = { required: true, message: col.name+'不能为空', trigger: 'blur' }
						}
					})
				})*/
			},

			filterReportList(){
				
				this.reportList = JSON.parse(this.defaultReportList).filter((item)=>{
					console.log(item.publicadtype , this.menus[this.currentType])
					return item.publicadtype === this.menus[this.currentType];
				});
				this.currentReportIndex = 0;
				this.formAdmin = this.reportList[this.currentReportIndex]||{};
				//this.reportList = this.reportList.concat([]);
			},
			getMyreportList(fn){
				var s = this;
				var {obserable} = Vue;
				var t = setInterval(()=>{


					var id  = obserable.trigger({
						type:'getCurrentSourceId'
					})
					var tableFields = obserable.trigger({
						type:"getFeildList"
					})
				
					
					if(id){


					
						
						this.configList = tableFields.concat([]);

						this.configList.map((col,i)=>{
							
							///s.formAdmin[col.fieldname] = '';
							if(col.fieldname === 'publicadtype'){
								s.menus = col.data.concat([]);
							}
							/* if(col.notnull){
								setTimeout(() => {
									s.ruleValidate[col.fieldname] = { required: true, message: col.name + '不能为空', trigger: 'blur' }
								}, 1000);
							} */
						})
						
						clearInterval(t);
						symbinUtil.ajax({
							_this:s,
							url:window.config.baseUrl+"/wmadvuser/getmyreportdata",
							data:{
								username:s.userinfo.username,
								accesstoken:s.userinfo.accesstoken,
								resourceid:id
							},
							success(data){
								if(data.getret === 0){
									data.list.forEach((item)=>{
										item.isLoaded = true;
									});
									s.reportList = data.list.concat([]);
									s.defaultReportList =  JSON.stringify(data.list);

									window.list=  JSON.stringify(data.list);
									
									fn && fn();
									if(s.reportList.length>0){

										s.filterReportList();
										if( s.currentReportIndex>-1){
											s.formAdmin = s.reportList[ s.currentReportIndex ]||{};
										
										    s.formAdmin && s.formAdmin.userlabel &&(s.formAdmin.tagList = s.formAdmin.userlabel.split(','));
										}
									}
									//s.currentReport = s.reportList[0];
								}
							}
						})
					}
					
				},20)

			},

			upload(id){

				
				var s = this;
				var data = s.configList.filter((item)=>{return  item.fieldname === 'publicadtype'})[0].data
				s.formUpload.tagList = s.formUpload.tagList || [];
				var p = {
						username:s.userinfo.username,
						usertoken:s.userinfo.accesstoken,
						resourceid:id,
						uploadfilename:s.formUpload.filetitle,
						filedesc:s.formUpload.filedesc,
						publicadtype:s.menus[s.currentType],
						userlabel:s.formUpload.tagList.concat([]).join(','),
						author:s.formUpload.author,
						telphone:s.formUpload.telphone,
						previewurl:s.formUpload.previewurl
				}
				this.p = p;
				if(s.uploader){
					s.uploader.destroy();
				}
				var accepts  =  s.accepts;
				var uploader = WebUploader.create({
					// 选完文件后，是否自动上传。
					auto: true,
					// swf文件路径
					swf: './webuploader-0.1.5/Uploader.swf',
					// 文件接收服务端。
					//server: 'http://api.zmiti.com/v2/fileupload',
					server: window.config.baseUrl+'/wmadvuser/uploadfile/',
					// 选择文件的按钮。可选。
					// 内部根据当前运行是创建，可能是input元素，也可能是flash.
					pick: '.wm-upload-before',
					chunked: true, //开启分片上传
					threads: 1, //上传并发数
					method: 'POST',
					compress:false,
					prepareNextFile:true,//是否允许在文件传输时提前把下一个文件准备好。 对于一个文件的准备工作比较耗时，比如图片压缩，md5序列化。 如果能提前在当前文件传输期处理，可以节省总体耗时。
					formData:p,
					accept:accepts[s.currentType],
					dnd:'.wm-myreport-left',
					disableGlobalDnd :true,//是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
				});

				
				uploader.on('dndAccept',(file,a)=>{
					if(accepts[s.currentType].extensions.indexOf(file['0'].type.split('/')[1])<=-1){
						s.$Message.error('目前不支持'+file['0'].type.split('/')[1]+'文件格式');
					}
				})

				uploader.on("beforeFileQueued",function(file){
					if(accepts[s.currentType].extensions.indexOf(file['type'].split('/')[1])<=-1){
						s.$Message.error('当前文件格式不支持');
						return;
					}
					var data = s.configList.filter((item)=>{return item.fieldname === 'publicadtype'})[0]?s.configList.filter((item)=>{return item.fieldname === 'publicadtype'})[0].data:[]
					s.publicadtype = {data:data[s.currentType]}||'';
					s.showUploadDialog = false;
				});

				s.uploader = uploader;

				// 当有文件添加进来的时候
				var i = 0;
				uploader.on('fileQueued', function (file) {

					i++;
					 
					s.reportList.unshift({
						reportid:file.id,
						reportname:file.name,
						status:0,
						thumi:imgs.poster,
						type:file.type,
						process:0,
						bulk:file.size,
						size:'1920*1080',
						remark:'',
						suffix:file.ext,
						labels:''
					})
					uploader.upload();
					/* // webuploader事件.当选择文件后，文件被加载到文件队列中，触发该事件。等效于 uploader.onFileueued = function(file){...} ，类似js的事件定义。
					$list.append('<div id="' + file.id + '" class="item">' +
						'<h4 class="info">' + file.name + '</h4>' +
						'<p class="state">等待上传...</p>' +
						'</div>'); */
				});
				// 文件上传过程中创建进度条实时显示。
				uploader.on('uploadProgress', function (file, percentage) {

					
					var index = -1;
					var scale = (percentage * 100|0);
					s.reportList.forEach((item,i)=>{
						if(item.reportid === file.id){
							index = i;
							item.process = scale + '%';
							if(scale >=100){
								setTimeout(()=>{
									item.isLoaded = true;
									s.reportList = s.reportList.concat([]);
								},500)
							}
						}
					});
				 
				});

				// 文件上传成功，给item添加成功class, 用样式标记上传成功。
				uploader.on('uploadSuccess', function (file) {
					console.log('success')
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
					iNow++;
					if(iNow === i){
						s.formUpload = {
							tagList:[]
						};
						s.formAdmin = {
							tagList:[]
						}
						s.getMyreportList();
					}
					//
					/* $('#' + file.id).find('.progress').remove();
					$('#' + file.id).find('p.state').text('已上传'); */
				});
				
			},
			ok(){
				
				var {obserable} = Vue;
				var s = this;
				var id  = obserable.trigger({
					type:'getCurrentSourceId'
				})
				
				var p = {
					username:s.userinfo.username,
					usertoken:s.userinfo.accesstoken,
					resourceid:id,
					id:s.formAdmin.id
				}
				for(var attr in s.formAdmin){
					if(s.formAdmin[attr] && attr !== 'username' && attr !== 'tagList'){
						p[attr] = s.formAdmin[attr]
					}
					if(attr === 'tagList' && s.formAdmin[attr].length){
						p.userlabel = s.formAdmin[attr].join(',')
					}
				}
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/wmadvuser/editresource',
					data:p,
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
					}

				})
				
			},
			cancel(){
			//	this.formUser = {};
			},
			
		}
	}
</script>
 

