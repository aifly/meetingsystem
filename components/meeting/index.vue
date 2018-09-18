<template>
	<div class="wm-meeting-main-ui">
		<header>
			<div>会议管理</div>
			<section>
				<Button type="primary" icon='md-add-circle' @click="addNewAduser">新增会议</Button>
			</section>
		</header>
		<Table ref='scorelist' @on-row-dblclick='entry' :height='viewH - 64- 70 ' :data='userList' :columns='columns'   stripe></Table>

		<Modal
			v-model="visible"
			:title="currentMeetid === -1? '新增会议':'编辑会议'"
			@on-ok="meetAction"
			@on-cancel="cancel">
			<Form ref="formAdmin" :model="formAdmin" :label-width="88" >
				<FormItem label="会议名称：" prop="meetname">
					<Input  v-model="formAdmin.meetname" placeholder="会议名称" autocomplete="off" />
				</FormItem>
				<FormItem label="说明：" prop="meetremarks">
					<Input v-model="formAdmin.meetremarks" placeholder="说明" autocomplete="off" />
				</FormItem>
				<FormItem label="时间：" prop="meetremarks">
					<DatePicker style="width:100%" v-model="formAdmin.datetimes" :value="formAdmin.datetimes" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="请选择开始和结束日期"></DatePicker>
				</FormItem>

				<FormItem label="banner图 ：" v-show='currentMeetid>-1' prop="bannerurl">
					
					<div id="wm-upload" class="wm-upload">
						
					</div>
					<div class="wm-meeting-banner" v-if='formAdmin.bannerurl' :style="{background:'url('+formAdmin.bannerurl+') no-repeat center',backgroundSize:'contain'}">

					</div>
				</FormItem>

				<FormItem label="状态：" prop="status">
					<i-switch v-model="formAdmin.status" size="large">
						<span slot="open">可用</span>
						<span slot="close">禁用</span>
					</i-switch>
				</FormItem>
			</Form>
		</Modal>

		 
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';
	import Vue from 'vue';
	

	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				content:"",
				provinceList:[],
				visible:false,
				imgs:window.imgs,
				
				isLoading:false,
				currentMeetid:-1,
				split1: 0.8,
				showPass:false,
				viewH:window.innerHeight,

				formAdmin:{
					datetimes:[],
					cityids:[],
					status:true,
					bannerurl:'',
				},
				userList:[],
				columns:[
					{
						title:"会议名称",
						key:'meetname',
						align:'center'
						
					},
					{
						title:"说明",
						key:'meetremarks',
						align:'center'
					},{
						title:'状态',
						key:'status',
						align:'center',
						render:(h,params)=>{
							
							return h('div',{},params.row.status ? '启用':'禁用');
						},
					},{
						title:'操作',
						key:"action",
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
                                        click: (e) => {
											e.preventDefault();
											e.stopPropagation();
											this.currentMeetid = params.row.meetid;
											this.formAdmin = params.row;
											this.formAdmin.meetname =  params.row.meetname;
											this.formAdmin.status = !!params.row.status;
											
											this.formAdmin.datetimes = [params.row.startdate,params.row.enddate];
											this.visible = true;
                                        }
                                    }
                                }, '编辑'),
                                h('Poptip',{
									props:{
										confirm:true,
										title:"确定要删除吗"
									},
									on:{
										'on-ok':()=>{
											this.delAdUser(params.row.meetid);
										},
										
									}
								},[
									h('Button', {
										props: {
											type: 'error',
											size: 'small'
										},
										on: {
											click: (e) => {
												
												return false;
												
												//this.remove(params.index,params.row.employeeid)
											}
										}
									}, '删除')
								]), h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
										display:"none",
										margin: '2px 5px',
										border:'none',
										background:params.row.status*1 === 0 ? 'rgb(2, 29, 236)':'#b20000',
										color:'#fff',
										padding: '3px 7px 2px',
										fontSize: '12px',
										borderRadius: '3px'

                                    },
                                    on: {
                                        click: () => {
											/*this.currentMeetid = params.row.userid;
											this.formAdmin = params.row;
											this.visible = true;*/

											this.checkUser(params);

											
                                        }
                                    }
                                }, params.row.status*1 === 1 ? '撤销':"审核"),
                            ]);
						}
					}
				],

				
				userinfo:{}
			}
		},
		components:{
		},
		watch:{
			visible(val){
				if(val && this.currentMeetid>-1){
					this.upload();
				}
			}
		},

		beforeCreate(){
			//var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

			///this.validate = validate;
		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			//this.getCityData();
			this.getmeetinglist();
			window.meeting = this;
		},
		
		methods:{

			upload(){

				
				var s = this;
				 
				var p = {
						companyid:'company'+s.userinfo.companyid,
						projectclassname:'meetingsystem',
						projectsubclassname:'project'+s.currentMeetid,
						uploadpath:'2018upload',
						userid:s.userinfo.userid

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
					server: window.config.baseUrl+'/wmshare/uploadfile/',
					// 选择文件的按钮。可选。
					// 内部根据当前运行是创建，可能是input元素，也可能是flash.
					pick: '.wm-upload',
					chunked: true, //开启分片上传
					threads: 1, //上传并发数
					method: 'POST',
					compress:false,
					prepareNextFile:true,//是否允许在文件传输时提前把下一个文件准备好。 对于一个文件的准备工作比较耗时，比如图片压缩，md5序列化。 如果能提前在当前文件传输期处理，可以节省总体耗时。
					formData:p,
					accept:'gif,jpg,jpeg,bmp,png,tiff,tif',
					//dnd:'.wm-myreport-left',
					disableGlobalDnd :true,//是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
				});
				uploader.on('dndAccept',(file,a)=>{
					if(accepts[s.currentType].extensions.indexOf(file['0'].type.split('/')[1])<=-1){
						s.$Message.error('目前不支持'+file['0'].type.split('/')[1]+'文件格式');
					}
				})

				uploader.on("beforeFileQueued",function(file){
					/* if(accepts[s.currentType].extensions.indexOf(file['type'].split('/')[1])<=-1){
						s.$Message.error('当前文件格式不支持');
						return;
					} */
					 
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
					if(data.getret === 0){
						s.formAdmin.bannerurl = data.fileurl;
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
					console.log(file);
					if(file.getret === 0){
						s.formAdmin.bannerurl = file.fileurl;
					}
					iNow++;
					if(iNow === i){
						
					}
					//
				
				});
				
			},

			entry(e,index){
				Vue.obserable.on('getMeetName',()=>{
					return e.meetname;
				});
				
				this.$router.push("/meetingsignup/"+e.meetid+'/'+e.meetname);
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
			delAdUser(meetid){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/delmeet/',
					validate:s.validate,
					data:{
						meetid,
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
					},success(data){
						if(data.getret === 0){
							s.$Message.success(data.getmsg);
							s.getmeetinglist();
						}
						else{
							s.$Message.error(data.getmsg);
						}
					}

				})
			},

			addNewAduser(){
				this.currentMeetid = -1;
				this.formAdmin = {
					userpwd:'111111'
				};
				this.visible = true;
			},
			getmeetinglist(){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/getmeetlist/',
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
			meetAction(){
				var s = this;

				if(s.currentMeetid<=-1){	

					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/zmitiadmin/addmeet/',
						validate:s.validate,
						data:{
							adminuserid:s.userinfo.userid,
							admintoken:s.userinfo.accesstoken,
							meetname:s.formAdmin.meetname,
							status:s.formAdmin.status|0,
							meetremarks:s.formAdmin.meetremarks,
							startdate:new Date(s.formAdmin.datetimes[0]).toLocaleDateString().replace(/\//ig,'-'),
							enddate:new Date(s.formAdmin.datetimes[1]).toLocaleDateString().replace(/\//ig,'-')
						},success(data){
							if(data.getret === 0){
								s.$Message.success(data.getmsg);
								s.getmeetinglist();
							}
							else{
								s.$Message.error(data.getmsg);
							}
						}
	
					})
				}else{
					console.log(s.formAdmin);
					
					symbinUtil.ajax({
						_this:s,
						url:window.config.baseUrl+'/zmitiadmin/updatemeet/',
						//validate:s.validate,
						data:{
							meetname:s.formAdmin.meetname,
							meetname:s.formAdmin.meetname,
							meetid:s.currentMeetid,
							adminuserid:s.userinfo.userid,
							admintoken:s.userinfo.accesstoken,
							status:s.formAdmin.status|0,
							bannerurl:s.formAdmin.bannerurl,
							meetremarks:s.formAdmin.meetremarks,
							startdate:new Date(s.formAdmin.datetimes[0]).toLocaleDateString().replace(/\//ig,'-'),
							enddate:new Date(s.formAdmin.datetimes[1]).toLocaleDateString().replace(/\//ig,'-')
						 
							 
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
				this.formAdmin = {};
			}
		}
	}
</script>
 