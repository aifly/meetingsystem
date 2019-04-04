<template>
	<div class="wm-place-main-ui">
		<div class="wm-tab-leftpane">
			<Tab :refresh="refresh"></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>上课地点管理</div>
				<div>
					<Button type="primary" @click="addCourse">新增上课地点</Button>
				</div>
			</header>
			<div class="wm-place-wrap" >
				<Form v-show='showDetail' ref="formValidate" class="wm-meet-form wm-scroll" :style='{height:viewH - 64- 90+"px"}' :model="formClass" :label-width="100">
					<FormItem label="上课地点" prop="title">
						<Input v-model="formClass.placename" placeholder="请填写上课地点"></Input>
					</FormItem>
					
					<FormItem>
						<Button type="primary" @click="placeAction()" size='large'>保存上课地点</Button>
					</FormItem>
				</Form>
				<div v-if='!showDetail' class="wm-place-list wm-scroll">
					<Table :border='false' :data='placeList' :columns='columns'  ></Table>

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
	/* import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css' */
	Vue.use(VueQuillEditor)
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
				currentRowIndex:0,
				page:1,
				defaultPagenum:(window.innerHeight - 200) / 50 | 0,
				pagenum:(window.innerHeight - 200) / 50 | 0,
				total:0,
				showPass:false,
				showMap:false,
				viewH:window.innerHeight,
				formClass:{},
				columns:[
					{
						title:"上课地点",
						key:'label',
						align:'center'						
					},{
						title:'操作',
						key:'action',
						align:'center',
						width:150,
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
											s.formClass.placename = params.row.label;
											s.formClass.placeid = params.row.value;
											s.currentClassId = params.row.value;
                                        }
                                    }
                                },'详情'),
                                h('Poptip',{
									props:{
										confirm:true,
										title:"确定要删除吗"
									},
									on:{
										'on-ok':()=>{
											this.delPlace(params.row.value);
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
							])
						}
					}
				],
				placeList:[]
			}
		},
		components:{
			Tab
		},

		beforeCreate(){

		},
		mounted(){
			window.s = this;
			this.userinfo = symbinUtil.getUserInfo();
			this.getPlaceList();
		},

		watch:{

		},
		
		methods:{
			refresh(){
				this.showDetail = false;
				this.currentClassId = -1;				
			},
			addCourse(){
				this.showDetail = true;
				this.currentClassId = -1;
				this.formClass = {
				}
			},
			placeAction(){//添加上课地点
				var s = this;
				var p = JSON.parse(JSON.stringify(this.formClass));
				p.admintoken = s.userinfo.accesstoken;
				p.adminuserid = s.userinfo.userid;
				p.meetid = s.$route.params.meetid;
				var url = window.config.baseUrl+'/zmitiadmin/addclassplace';
				if(s.currentClassId>-1){
					url = window.config.baseUrl+'/zmitiadmin/updateclassplace';
					p.placeid = s.currentClassId;
				}
				symbinUtil.ajax({
					url,
					data:p,
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						s.showDetail = false;
						s.getPlaceList();
					}
				})
				
			},
			getPlaceList(){//获取上课地点
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/getclassplacelist',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
					},
					success(data){
						if(data.getret === 0){
							s.placeList = data.list;
						}
					}
				});
			},
			delPlace(placeid){//删除上课地点
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/delclassplace',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						placeid:placeid
					},
					success(data){
						s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
						if(data.getret === 0){
							s.getPlaceList();
						}
					}
				})
			}
		}
	}
</script>
