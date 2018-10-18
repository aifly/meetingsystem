<template>
	<div class="wm-scoreitem-main-ui">
		<div>
			<Tab :refresh='refresh'></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>评分项设置</div>
				<div>
					<Button type="primary" @click="addCourse">新增评分项</Button>
				</div>
			</header>
			<div class='wm-scoreitem-main'>
				<div class='wm-scoreitem-table' :class="{'active':showDetail}">
					<Table :data='scoreItemList' :columns='columns'></Table>
				</div>
				<transition name='detail'>
					<div class='wm-scoreitem-form' v-if='showDetail'>
						<header>
							{{formScoreItem.scoreitemid?'编辑评分项':'新增评分项'}}
						</header>
						<div class='wm-scoreitem-form-item'>
							<label for="">评估内容：</label><input placeholder="请输入评估内容" v-model="formScoreItem.scoreitemname" />
						</div>
						<div class='wm-scoreitem-form-item'>
							<label for="">所属分组：</label><input placeholder="请输入所属分组" v-model="formScoreItem.groupname" />
						</div>
						<div class='wm-scoreitem-form-item'>
							<label for="">类<span style='opacity:0'>属分</span> 别：</label>
							 <RadioGroup v-model="formScoreItem.scoretype">
								<Radio :label="1">打分</Radio>
								<Radio :label="2">录入</Radio>
							</RadioGroup>
						</div>
						<div class='wm-scoreitem-form-item wm-scoreitem-btns'>
							<Button @click='showDetail = false' size ='small' type='default'>返回</Button>
							<Button size ='small' type='primary' @click='scoreItemAction'>{{formScoreItem.scoreitemid?'保存':'确定'}}</Button>
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
				scoreItemList:[],
				columns:[
					{
						title:"评估指标",
						key:'scoreitemname',
						align:'center'
						
					},
					{
						title:'所属分组',
						key:'groupname',
						align:'center'
					},
					{
						title:'类别',
						key:'scoretype',
						align:'center',
						render:(h,params)=>{
							return h('div',{},params.row.scoretype === 1 ? '评分':"意见建议")
						}
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
											s.formScoreItem = params.row;
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
											this.delScoreItem(params.row.scoreitemid);
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
				
				formScoreItem:{
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
			
			this.getScoreItemList();
			

			
		},

		watch:{
			
		},
		
		methods:{

			addCourse(){
				this.showDetail = true;
				this.currentClassId = -1;
				this.formScoreItem = {
				}
			},


			refresh(){
				this.showDetail = false;
				this.currentClassId = -1;
			},

			getScoreItemList(){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/getrateditemslist',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid
					},
					success(data){
						console.log(data);
						if(data.getret === 0){
							s.scoreItemList = data.list;
							
						}
					}
				})
			},

			

		
			delScoreItem(id){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/delrateditems',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						id
					},
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						if(data.getret === 0){
							s.getScoreItemList();
						}
					}
				})
			},
			scoreItemAction(){
				var s = this;
				var p = JSON.parse(JSON.stringify(this.formScoreItem));
				p.admintoken = s.userinfo.accesstoken;
				p.adminuserid = s.userinfo.userid;
				var url = window.config.baseUrl+'/zmitiadmin/addrateditems';
				if(p.scoreitemid>-1){
					url = window.config.baseUrl+'/zmitiadmin/updaterateditems';
					p.id = p.scoreitemid;
				}

				symbinUtil.ajax({
					url,
					data:p,
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						s.showDetail = false;
						s.getScoreItemList();
					}
				})
			},
		}
	}
</script>
 