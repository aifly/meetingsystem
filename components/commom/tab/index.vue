<template>
    <div class="wm-tab-ui">
        <ul :style="{height:viewH - 64+'px'}" class="wm-tab-list" >
			<li>{{meetname||$route.params.meetname}}</li>
            <li @click='refresh' v-for="(menu ,i ) in menus " :key="i" :class="{'active':menu.to ===$route.name }">
				<router-link :to="'/'+menu.to+'/'+$route.params.meetid+'/'+(meetname||$route.params.meetname)"> {{menu.name}}</router-link>
            </li>
        </ul>
    </div>
</template>
<script>
	import './index.css';
	import Vue from 'vue';
    export default {
		props:['obserable','refresh'],
		name:'zmitiindex',
		data(){
			return{
				visible:false,
				meetname:'',
				imgs:window.imgs,
				viewH:window.innerHeight,
				menus:[
					{
						name:'学员报名管理',
						to:'meetingsignup'
					},
					{
						name:'培训报到管理',
						to:'meetingreport'
					},{
						name:'培训信息管理',
						to:'meetingnews'
					},{
						name:'课程管理',
						to:'meetingcourse'
					},{
						name:'投稿管理',
						to:'meetingattendance'
					},{
						name:'评分结果',
						to:'meetingscrore'
					},{
						name:'意见反馈',
						to:'meetingfeedback'
					},{
						name:'外出考勤',
						to:'meetingoutattendance'
					},{
						name:'上课地点管理',
						to:'meetingplace'
					}
				],
				formUser:{
					studentmame:'',
					nickname:'',
					mobile:'',
					telphone:'',
					email:'',
					sex:'',
					companyname:'',
					job:'',
					cityids:[],
					
				},
				userinfo:{}
			}
		},
		components:{
		},
		watch:{
			$route(){

			}
		},
		beforeCreate(){
			
		},
		mounted(){
			this.meetname  = Vue.obserable.trigger({
				type:'getMeetName'
			})
		},
		
		methods:{
        }
	}
</script>
