<template>
	<div class="wm-outattendance-main-ui">
		<div>
			<Tab :refresh='refresh'></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>外出考勤</div>
				<div>
					<Button type="primary" @click="addCourse">新增外出考勤</Button>
				</div>
			</header>

			
				<div  v-if='(activeDetail.title && activeDetail.list.length)' class='wm-scroll wm-outattendance-detail' :class="{'hiddentable':showDetail}" :style='{height:viewH-150+"px"}'>

					<div class='wm-outattendance-detail-main'>
						<h3>活动名称：{{activeDetail.title}}</h3>
						<div class='wm-outattendance-title'>出发签到：</div>
						<div class='wm-outattendance-title'>
							<span>应该到人数：{{activePersonNum}}</span>
							<span>未到人数：{{outActivePersonNum}}</span>
						</div>
						<div class='wm-outattendance-title'>返回签到：</div>
						<div class='wm-outattendance-title'>
							<span>应该到人数：{{activePersonNum}}</span>
							<span>未到人数：{{backActivePersonNum}}</span>
						</div>

						<ul class='wm-outattendance-group-list'>
							<li v-for='(list,i) in activeDetail.list' :key='i' class='wm-outattendance-group'>
								<h4>{{list.groupname}}</h4>
								<div class='wm-outattendance-group-item'>
									<div>出发签到：</div>
									<div>
										<span>应该到人数：{{list.outAllNum}}</span>
										<span>未到人数：{{list.outUnsiginNum}}</span>
									</div>
								</div>
								<div class='wm-outattendance-group-item'>
									<div>返回签到：</div>
									<div>
										<span>应该到人数：{{list.backallNum}}</span>
										<span>未到人数：{{list.backUnsiginNum}}</span>
									</div>
								</div>
								<div v-for="(user,k) in list.grouplist" :key='k' class='wm-outattendance-user-item'>
									<div class='username'>{{user.studentname}}</div>
									<div>
										<span :class='user.startcheckin === 0?"wm-outattendance-err":"wm-outattendance-success"'>出发：
											<Icon type="md-close-circle" v-if='user.startcheckin === 0' />
											<Icon type="md-checkmark-circle" v-else/>
											{{user.startcheckintime}}
										</span>
										<span :class='user.backsignin === 0?"wm-outattendance-err":"wm-outattendance-success"'>
											返回：
											<Icon type="md-close-circle" v-if='user.backsignin === 0' />
											<Icon type="md-checkmark-circle" v-else/>
											{{user.backsignintime}}
										</span>
										
									</div>
								</div>
							</li>
						</ul>
					</div>
					
				</div>

			<div class='wm-outattendance-main' :class="{'hiddentable':showDetail}" v-else>
				<div class='wm-outattendance-table' >
					<Table :data='outattendanceList' :columns='columns'></Table>
				</div>
			</div>
			
			<div v-if='showDetail' class="wm-outattendance-formitems wm-scroll" :style='{height:viewH - 64- 90+"px"}'>
				<div class='wm-outattendance-form'>
					<Form :model="formOutAttendance"  :label-width="100">
						<FormItem label="地址名称：" prop="title">
							<Input v-model="formOutAttendance.title" placeholder="请输入地址名称"></Input>
						</FormItem>
						<FormItem label="内容：" prop="content">
							<Input type="textarea" v-model="formOutAttendance.content" :rows='5' placeholder="请输入内容"></Input>
						</FormItem>
						<FormItem label="去程签到位置：">
							<div class="wm-outattendance-timea">								
							    <span>{{address}}</span> <Button style='margin-left:20px;' size='small' @click='showMap = true'>设置去程签到位置 </Button>
								<div class='wm-outattendance-pos' v-show='showMap'>{{formOutAttendance.golatitude}} &nbsp;&nbsp; {{formOutAttendance.golongitude}}
									<span class='wm-outattendance-pos-close' @click="showMap = false">
										<Icon type="ios-close-circle" />
									</span>
								</div>
								<div v-if='showMap' class="wm-classroom-pos" id='wm-classroom-posb'>

								</div>
							</div>
						</FormItem>
						<FormItem label="去程签到时间：">
							<Row justify="space-between" class="wm-outattendance-timea-bg">
						        <Col span="6" style="width:200px; margin-right: 20px;">
						        	<FormItem prop="starttime">							        	
							        	<DatePicker type="datetime" :value="formOutAttendance.starttime"
							        		@on-change="setstarttime"
							        	 placeholder="去程签到开始时间" style="width:100%" v-model="formOutAttendance.starttime"></DatePicker>
						        	 </FormItem>
						    	</Col>
						        <Col span="6" style="width:200px;">
						        	<FormItem prop="endtime">
						        		<DatePicker type="datetime" @on-change="setendtime" 						        		
						        		placeholder="去程签到结束时间" style="width:100%" v-model="formOutAttendance.endtime"></DatePicker>						        		
						        	</FormItem>
						    	</Col>
							</Row>
						</FormItem>
						<FormItem label="回程签到位置：">
							<div class="wm-outattendance-timea">								
							    <span>{{addressa}}</span> <Button style='margin-left:20px;' size='small' @click='showMapa = true'>设置回程签到位置</Button>
								<div class='wm-outattendance-posa' v-show='showMapa'>{{formOutAttendance.returnlatitude}} &nbsp;&nbsp; {{formOutAttendance.returnlongitude}}
									<span class='wm-outattendance-posa-close' @click="showMapa = false">
										<Icon type="ios-close-circle" />
									</span>
								</div>
								<div v-if='showMapa' class="wm-classroom-pos" id='wm-classroom-pos'>

								</div>
							</div>
						</FormItem>
						<FormItem label="回程签到时间：">
							<div class="wm-outattendance-timeb">
								<Row justify="space-between" class="wm-outattendance-timeb-bg">
							        <Col span="6" style="width:200px; margin-right: 20px;">
							        <DatePicker type="datetime"
							        @on-change="setreturnstarttime"
							         placeholder="回程签到开始时间" 
							         style="width:100%" v-model="formOutAttendance.returnstarttime">
							        	
							        </DatePicker></Col>
							        <Col span="6" style="width:200px;"><DatePicker type="datetime"
							        @on-change="setreturnendtime"
							         placeholder="回程签到结束时间" style="width:100%" v-model="formOutAttendance.returnendtime"></DatePicker></Col>
							    </Row>
							</div>
						</FormItem>
						<FormItem label="出行时间：">
							<DatePicker type="datetime" 
							@on-change="setsetouttime" 
							format="yyyy-MM-dd HH:mm:ss" placeholder="请选择出行时间" style="width:200px" v-model="formOutAttendance.setouttime"></DatePicker>
						</FormItem>
						<FormItem label="回程时间：">
							<DatePicker type="datetime" 
							@on-change="setreturntime" 
							format="yyyy-MM-dd HH:mm:ss" placeholder="请选择回程时间" style="width:200px" v-model="formOutAttendance.returntime"></DatePicker>
						</FormItem>
						<FormItem>
							<Button @click='showDetail = false' type='default' style="margin-right:20px;">返回</Button>
							<Button type='primary' @click='outattendanceAction'>{{formOutAttendance.activityid?'保存':'确定'}}</Button>
						</FormItem>
					</Form>
				</div>
			</div>
			
		</div>
	</div>
</template>

<script>
	import './index.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';
	import formatimes from '../lib/formatimes';
	import Vue from 'vue';
	import Tab from '../commom/tab/index';
	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{

				visible:false,
				imgs:window.imgs,
				isLoading:false,
				showDetail:false,
				currentClassId:-1, 
				address:'',
				addressa:'',
				activePersonNum:0,
				outActivePersonNum:0,
				backActivePersonNum:0,
				showPass:false,
				showMap:false,
				showMapa:false,
				viewH:window.innerHeight,
				viewW:window.innerWidth,
				outattendanceList:[],
				activeDetail:{
					title:'',
					list:[]
				},
				columns:[
					{
						title:"外出名称",
						key:'title',
						align:'center'
						
					},
					{
						title:'内容',
						key:'content',
						align:'center'
					},
					{
						title:'外出时间',
						key:'setouttime',
						align:'center',
						render:(h,params)=>{
							return h('div',[
								h('span', {},params.row.setouttime)
							]);
						}
					},
					{
						title:'操作',
						key:'action',
						width:200,
						align:'center',
						render:(h,params)=>{
							return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
										//margin: '2px 5px',
										border:'none',
										background:'#515a6e',
										color:'#fff',
										padding: '3px 7px 2px',
										fontSize: '12px',
										borderRadius: '3px'

                                    },
                                    on: {
                                        click: () => {
											var s = this;
											s.getmeetactivityinfo(params.row.activityid);
                                        }
                                    }
                                }, '签到统计'),
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
											//s.formOutAttendance = params.row;
											s.formOutAttendance.golatitude = params.row.golatitude;
											s.formOutAttendance.golongitude = params.row.golongitude;
											s.formOutAttendance.returnlatitude = params.row.returnlatitude;
											s.formOutAttendance.returnlongitude = params.row.returnlongitude;
											s.formOutAttendance.setouttime = params.row.setouttime;
											s.formOutAttendance.returntime = params.row.returntime;
											s.formOutAttendance.meetid = params.row.meetid;
											s.formOutAttendance.title = params.row.title;
											s.formOutAttendance.starttime = s.formatDateTime(params.row.starttime);
											s.formOutAttendance.endtime = s.formatDateTime(params.row.endtime);
											s.formOutAttendance.returnstarttime = s.formatDateTime(params.row.returnstarttime);
											s.formOutAttendance.returnendtime = s.formatDateTime(params.row.returnendtime);
											s.formOutAttendance.content = params.row.content;
											s.formOutAttendance.activityid=params.row.activityid;
											console.log(s.formOutAttendance,'s.formOutAttendance');
											s.initMap();
											s.initMapa();
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
											this.delOutAttendance(params.row.activityid);
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
				
				formOutAttendance:{
					golatitude:'116.585856',
					golongitude:'40.364989',
					starttime:'',
					endtime:'',
					returnlatitude:'116.585856',
					returnlongitude:'40.364989',
					returnstarttime:'',
					returnendtime:'',
					pdfurl:'',
					longitude :'116.585856',
					latitude :'40.364989',
					returntime:''
				},
				defaultClass:{
					longitude :'116.585856',
					latitude :'40.364989',
					rlongitude :'116.585856',
					rlatitude :'40.364989'
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
			this.getOutattendanceList();
			this.initMap();
			this.initMapa();
		},

		watch:{
			showMap(val){
				if(val){
					setTimeout(() => {
						this.initMap();
					}, 100);
				}
			},
			showMapa(val){
				if(val){
					setTimeout(() => {
						this.initMapa();
					}, 100);
				}
			}
			
		},
		
		methods:{

			getmeetactivityinfo(activityid='1904614349'){

				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/getmeetactivityinfo',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						activityid
					},
					success(data){
						
						if(data.getret === 0){
							s.activeDetail = data.list;
							s.activePersonNum = 0;
							s.outActivePersonNum = 0;
							s.backActivePersonNum = 0;
							data.list.list.forEach((ls)=>{
								s.activePersonNum += ls.grouplist.length;
								ls.outAllNum = ls.grouplist.length;
								ls.backallNum = ls.grouplist.length;
								ls.backUnsiginNum = 0;
								ls.outUnsiginNum = 0;
								ls.grouplist.forEach((item)=>{

									if(item.startcheckin === 0){
										s.outActivePersonNum++;
										ls.outUnsiginNum++;
									}
									if(item.backsignin === 0){
										ls.backUnsiginNum++;
										s.backActivePersonNum++;
									}
								})
							});
						}
					}
				})

			},

			addCourse(){
				this.formOutAttendance = {
				};
				this.formOutAttendance.golongitude='116.585856';
				this.formOutAttendance.golatitude='40.364989';
				this.formOutAttendance.returnlongitude='116.585856';
				this.formOutAttendance.returnlatitude='40.364989';
				this.defaultClass={
					longitude :'116.585856',
					latitude :'40.364989',
					rlongitude :'116.585856',
					rlatitude :'40.364989'
				};
				this.initMap();
				this.initMapa();
				this.showDetail = true;
				this.currentClassId = -1;
			},


			refresh(){
				this.showDetail = false;
				this.currentClassId = -1;
				this.activeDetail = {
					list:[],
					title:''
				};
			},

			getOutattendanceList(){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/getmeetactivitylist',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						meetid:s.$route.params.meetid
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							s.outattendanceList = data.list;
							
						}
					}
				})
			},

			

		
			delOutAttendance(activityid){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/deletemeetactivity',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						activityid
					},
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						if(data.getret === 0){
							s.getOutattendanceList();
						}
					}
				})
			},
			outattendanceAction(){
				var s = this;
				var p = JSON.parse(JSON.stringify(this.formOutAttendance));
				p.admintoken = s.userinfo.accesstoken;
				p.adminuserid = s.userinfo.userid;
				p.meetid = s.$route.params.meetid;
				console.log(this.formOutAttendance,'this.formOutAttendance');
				p.setouttime=formatimes.changeDate(this.formOutAttendance.setouttime);
				p.returntime=formatimes.changeDate(this.formOutAttendance.returntime);
				var url = window.config.baseUrl+'/zmitiadmin/addmeetactivity';
				if(p.activityid>-1){
					url = window.config.baseUrl+'/zmitiadmin/updatemeetactivity';
					p.id = p.activityid;
				}else{
					this.formOutAttendance = {
					}
				}

				symbinUtil.ajax({
					url,
					data:p,
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						
						s.getOutattendanceList();
					}
				})
			},
			initMap(){
				var s = this;

				console.log(s.formOutAttendance.golongitude,s.formOutAttendance.golatitude,'加载地图-去程');
			
				var map = new AMap.Map('wm-classroom-posb', {
					turboMode: false,
					defaultCursor: 'pointer',
					showBuildingBlock: false,
					expandZoomRange: true,
					zooms: [16, 40],
					zoom: 4,
					center:new AMap.LngLat(s.defaultClass.longitude,s.defaultClass.latitude),
					forceVector: true,
				});
				
				//s.formClass.longitude,s.formClass.latitude
				var g = new AMap.Geocoder({city: "010"});

				  g.getAddress([s.formOutAttendance.golongitude,s.formOutAttendance.golatitude],function(status,result){
					if (status === 'complete'&&result.regeocode) {
						var address = result.regeocode.formattedAddress;
						s.address = address;
					}else{
						//alert(JSON.stringify(result))
					}
				  })

				var s = this;
				var clickEventListener = map.on('click', function(e) {
					s.formOutAttendance.golongitude = e.lnglat.getLng();
					s.formOutAttendance.golatitude = e.lnglat.getLat();
					
					g.getAddress([s.formOutAttendance.golongitude,s.formOutAttendance.golatitude],function(status,result){
						if (status === 'complete'&&result.regeocode) {
							var address = result.regeocode.formattedAddress;
							s.address = address;
						}else{
							//alert(JSON.stringify(result))
						}
					})
				});
				
			},
			initMapa(){
				var s = this;
				console.log(s.formOutAttendance.returnlongitude,s.formOutAttendance.returnlatitude,'加载地图-回程');
				var map = new AMap.Map('wm-classroom-pos', {
					turboMode: false,
					defaultCursor: 'pointer',
					showBuildingBlock: false,
					expandZoomRange: true,
					zooms: [16, 40],
					zoom: 4,
					center:new AMap.LngLat(s.defaultClass.rlongitude,s.defaultClass.rlatitude),
					forceVector: true,
				});
				
				//s.formClass.longitude,s.formClass.latitude
				var g = new AMap.Geocoder({city: "010"});

				  g.getAddress([s.formOutAttendance.returnlongitude,s.formOutAttendance.returnlatitude],function(status,result){
					if (status === 'complete'&&result.regeocode) {
						var address = result.regeocode.formattedAddress;
						s.addressa = address;
					}else{
						//alert(JSON.stringify(result))
					}
				  })

				var s = this;
				var clickEventListener = map.on('click', function(e) {
					s.formOutAttendance.returnlongitude = e.lnglat.getLng();
					s.formOutAttendance.returnlatitude = e.lnglat.getLat();
					
					g.getAddress([s.formOutAttendance.returnlongitude,s.formOutAttendance.returnlatitude],function(status,result){
						if (status === 'complete'&&result.regeocode) {
							var address = result.regeocode.formattedAddress;
							s.addressa = address;
						}else{
							//alert(JSON.stringify(result))
						}
					})
				});
			},
			formatDateTime(inputTime) {
				var date = new Date(inputTime*1000);
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? ('0' + m) : m;
				var d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				var h = date.getHours();
				h = h < 10 ? ('0' + h) : h;
				var minute = date.getMinutes();
				var second = date.getSeconds();
				minute = minute < 10 ? ('0' + minute) : minute;
				second = second < 10 ? ('0' + second) : second;
				return y + '-' + m + '-' + d + ' ' + '　' + h + ':' + minute + ':' + second;
			},
			setstarttime(val){
				this.formOutAttendance.starttime=val;
				console.log(val,'时间');
			},
			setendtime(val){
				this.formOutAttendance.endtime=val;
			},
			setreturnstarttime(val){
				this.formOutAttendance.returnstarttime=val;
			},
			setreturnendtime(val){
				this.formOutAttendance.returnendtime=val;
			},
			setsetouttime(val){
				this.formOutAttendance.setouttime=val;
				console.log(val,'去程时间');
			},
			setreturntime(val){
				this.formOutAttendance.returntime=val;
				console.log(val,'回程时间');
			},
		}
	}
</script>
 