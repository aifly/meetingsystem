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
			<div class='wm-outattendance-main'>
				<div class='wm-outattendance-table' :class="{'active':showDetail}">
					<Table :data='outattendanceList' :columns='columns'></Table>
				</div>
				<transition name='detail'>
					<div class='wm-outattendance-form' v-if='showDetail'>
						<header>
							{{formOutAttendance.activityid?'编辑评分项':'新增外出考勤'}}
						</header>
						<div class='wm-outattendance-form-item'>
							<label for="">地址名称：</label><input class='wm-outattendance-input' placeholder="请输入地址名称" v-model="formOutAttendance.title" />
						</div>
						<div class='wm-outattendance-form-item'>
							<label for="">内<span style='opacity:0'>每位</span>容 ：</label><input class='wm-outattendance-input' placeholder="请输入内容 " v-model="formOutAttendance.content" />
						</div>
						<div class='wm-outattendance-form-item'>
							<label for="">出行时间：</label>
							 <DatePicker v-model="formOutAttendance.setouttime" type="date" placeholder="任职时间" style="width:70%;" ></DatePicker>
						</div>
						<div class='wm-outattendance-form-item wm-outattendance-btns'>
							<Button @click='showDetail = false' size ='small' type='default'>返回</Button>
							<Button size ='small' type='primary' @click='outattendanceAction'>{{formOutAttendance.activityid?'保存':'确定'}}</Button>
						</div>
					</div>
				</transition>
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

				visible:false,
				imgs:window.imgs,
				isLoading:false,
				showDetail:false,
				currentClassId:-1, 
				address:'',
				showPass:false,
				showMap:false,
				viewH:window.innerHeight,
				viewW:window.innerWidth,
				outattendanceList:[],
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
											s.formOutAttendance = params.row;
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
		},

		watch:{
			
		},
		
		methods:{

			addCourse(){
				this.showDetail = true;
				this.currentClassId = -1;
				this.formOutAttendance = {
				}
			},


			refresh(){
				this.showDetail = false;
				this.currentClassId = -1;
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
				p.setouttime =  new Date(p.setouttime).toLocaleDateString();
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
		}
	}
</script>
 