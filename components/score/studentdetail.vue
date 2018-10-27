<template>
	<div class="wm-scroll" :style="{height:viewH-150+'px'}">
			<Table  :data='scoreList' :columns='columns'></Table>	
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
				scoreList:[],
				viewH:window.innerHeight,
				columns:[
					{
						title:"姓名",
						key:'studentname',
						align:'center'
					},
					{
						title:"课程名称",
						key:'syllabusname',
						align:'center'
					},
					{
						title:"组名",
						key:'groupname',
						align:'center'
					},
					{
						title:"评估标准",
						key:'scoreitemname',
						align:'center'
					},
					{
						title:"内容",
						key:'scorecontent',
						align:'center'
					},
					{
						title:"考评时间",
						key:'createtime',
						align:'center'
					}
				],
				userinfo:{},
			}
		},
		components:{
		},

		beforeCreate(){
			//var validate = sysbinVerification.validate(this);
			//symbinUtil.clearCookie('login');

			///this.validate = validate;
		},
		mounted(){
			window.s = this;
			this.userinfo = symbinUtil.getUserInfo();
			
			this.$root.eventHub.$on('getScoreByStudent',(syllabusid,syallabustitle)=>{
				this.getScore(syllabusid,syallabustitle);
			})
		},

		watch:{
			
		},
		
		methods:{

			getScore(syllabusid,syallabustitle){
				var s = this;
					symbinUtil.ajax({
						url:window.config.baseUrl+'/zmitiadmin/getscoredetail',
						data:{
							admintoken:s.userinfo.accesstoken,
							adminuserid:s.userinfo.userid,
							meetid:s.$route.params.meetid,
							syllabusid
						},
						success(data){
							console.log(data);
							if(data.getret === 0){
								//s.$root.eventHub.$emit('setMainType',2);
								s.scoreList = data.list;
								s.scoreList.forEach((item,i)=>{
									item.syllabusname = syallabustitle;
								})

							}
						}
					})

			},
			
		}
	}
</script>
 