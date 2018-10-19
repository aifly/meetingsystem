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
				<span> <label for="" style="opacity:0">1</label>	参与评分人数：{{scoreObj.partakenum}}</span><span style="margin-left:20px;color:#ce0000">详情>> </span>
			</div>
			<div>统计时间：{{scoreObj.date}}<label for="" style="opacity:0">1</label></div>
		</div>
		<div class='wm-score-table'>
			<ul>
				<li>
					<div class="wm-scoreitem-groupname">
						<div>
							所属分组
						</div>
					</div>
					<div class="wm-scoreitem-list">
						<div class='wm-scoreitem' >
							<div class="wm-scoreitem-name">评估指标</div>
							<div class="wm-scoreitem-avgscore">平均分</div>
						</div>
					</div>
				</li>
				<li v-for="(item,i) in scoreObj.scoreList" :key='i'>
					<div class="wm-scoreitem-groupname">
						<div>
							{{item.groupname}}
						</div>
					</div>
					<div class="wm-scoreitem-list">
						<div class='wm-scoreitem' v-for="(scoreitem,j) in item.list" :key='j'>
							<div class="wm-scoreitem-name" :class='{"noborder":item.list.length%2===0}'>{{scoreitem.scoreitemname}}</div>
							<div class="wm-scoreitem-avgscore" :class='{"noborder":item.list.length%2===0}'>{{scoreitem.avgscore}}分</div>
						</div>
					</div>
				</li>
			</ul>
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
 