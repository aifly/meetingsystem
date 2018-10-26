<template>
	<div class="">
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
						key:'totalscore',
						align:'center'
					},
					{
						title:"内容",
						key:'avgscore',
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
			this.getScore();
			
		},

		watch:{
			
		},
		
		methods:{

			getScore(){
				var syllabusid = '1679644336',// this.scoreObj.syllabusid,
					s = this;
					symbinUtil.ajax({
						url:window.config.baseUrl+'/zmitiadmin/getavgscore',
						data:{
							admintoken:s.userinfo.accesstoken,
							adminuserid:s.userinfo.userid,
							meetid:s.$route.params.meetid,
							syllabusid
						},
						success(data){
							console.log(data);
							if(data.getret === 0){
								s.$root.eventHub.$emit('setMainType',2);

							}
						}
					})

			},
			
		}
	}
</script>
 