<template>
	<section class="wm-scoredetail-main-ui">
		<div class='wm-scoredetail-scorebg'>
			<img :src="imgs.scoreBg" alt="">
			<span>总分：{{scoreObj.totalscore}}</span>
		</div>
		<h2 class='wm-course-title'>
			{{scoreObj.title}}
			
		</h2>
		<div class='wm-teachername'>
			老师：{{scoreObj.teachername}}
		</div>
		<div class='wm-statisitcs'>
			<div>
				<span> <label for="" style="opacity:0">1</label>	参与评分人数：{{scoreObj.partakenum}}</span><span>详情>> </span>
			</div>
			<div>统计时间：{{scoreObj.date}}<label for="" style="opacity:0">1</label></div>
		</div>
		<div class='wm-score-table'>
			
		</div>
	</section>
</template>

<script>
	import './scoredetail.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';
	import Vue from 'vue';

	export default {
		props:['obserable','scoreObj'],
		name:'zmitiindex',
		data(){
			return{
				imgs:window.imgs,
				viewH:window.innerHeight,
				userinfo:{
					
				}
			}
		},
		components:{
		},

		beforeCreate(){
			
		},
		mounted(){
			this.userinfo = symbinUtil.getUserInfo();
			
			
		},

		watch:{
			
		},
		
		methods:{

			
		}
	}
</script>
 