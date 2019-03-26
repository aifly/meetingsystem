<template>
	<div class="wm-readstatus-main-ui">
		<div class="wm-tab-leftpane">
			<Tab :refresh="refresh"></Tab>
		</div>
		<div class="wm-tab-content">
			<header class="wm-tab-header">
				<div>用户阅读状态</div>
			</header>
			<div class="wm-readstatus-wrap" >
				<div class="wm-readstatus-list wm-scroll">
					<div class="wm-readstatus-title">当前标题：{{newtitle}}</div>
					<Table :border='false' :data='dataList' :columns='columns'  ></Table>

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
		name:'zmitiindex',
		data(){
			return{

				visible:false,
				imgs:window.imgs,
				isLoading:false,
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
				columns:[
					{
						title:"用户",
						key:'studentname',
						align:'center'						
					},{
						title:'状态',
						key:'viewtime',
						align:'center',
						render:(h,params)=>{
							//return h('div',{},params.row.viewtime>1?'已读':'未读');
							return h('div',[
								h('span', {
									style: {
										color:params.row.viewtime>1?'#19be6b':'#ed4014',
                                    },
								},params.row.viewtime>1?'已读':'未读')
							]);
						}
					}
				],
				dataList:[],
				meetid:'',
				meetname:'',
				newsid:'',
				newtitle:''
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
			this.meetid=s.$route.params.meetid;
			this.meetname=s.$route.params.meetname;
			this.newsid=s.$route.params.classid;
			this.newtitle=s.$route.params.newtitle;
			console.log(this.meetid,this.meetname,this.newsid,'信息');
			this.getuserList();

		},

		watch:{

		},
		
		methods:{
			refresh(){
				this.currentClassId = -1;				
			},
			getuserList(){//获取用户列表
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/getpushlist',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						newsid:s.newsid,
					},
					success(data){
						if(data.getret === 0){
							console.log(data,'状态列表');
							s.dataList = data.list;
						}
					}
				});
			}
		}
	}
</script>
