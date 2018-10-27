<template>
	<section class="wm-scoredetail-main-ui wm-scroll" :style="{height:viewH-150+'px'}">
		
		<div ref='page'>
			<div class='wm-scoredetail-scorebg'>
				<img :src="imgs.scoreBg" alt="">
				<span>总分：{{scoreObj.totalscore}}</span>
			</div>
			<h2 class='wm-course-title'>
				{{scoreObj.syallabustitle}}
				
			</h2>
			<div class='wm-teachername'>
				老师：{{scoreObj.teachername}}
			</div>
			<div class='wm-statisitcs'>
				<div>
					<span> <label for="" style="opacity:0">1</label>	参与评分人数：{{scoreObj.totalperson}}</span><span style="margin-left:20px;color:#ce0000;cursor:pointer;" @click='getScore'>详情>> </span>
				</div>
				<div>统计时间：{{date}}<label for="" style="opacity:0">1</label></div>
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
								<div class="wm-scoreitem-avgscore ">总分</div>
								<div class="wm-scoreitem-avgscore wm-scoreitem-score">人数</div>
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
								<div class="wm-scoreitem-avgscore " :class='{"noborder":item.list.length%2===0}'>{{scoreitem.totalscore}}分</div>
								<div class="wm-scoreitem-avgscore wm-scoreitem-score" :class='{"noborder":item.list.length%2===0}'>{{scoreitem.studentnum}}人</div>
								<div class="wm-scoreitem-avgscore" :class='{"noborder":item.list.length%2===0}'>{{scoreitem.avgscore}}分</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<div class='wm-score-table-action'>
				<div>
					<Button size='small' @click='html2img()'>下载</Button>
					<Button size='small' @click='printPage'>打印</Button>
				</div>
			</div>
			
		</div>

		<a class='wm-score-download' :href='createImg' ref='download' target='_blank' v-if='createImg' download="score"></a>
	</section>
</template>

<script>
	import './scoredetail.css';
	import sysbinVerification from '../lib/verification';
	import symbinUtil from '../lib/util';
	import '../lib/html2canvas';
	import Vue from 'vue';
	window.$ = window.jQuery  = $;
	var printAreaCount = 0;
	$.fn.printArea = function () {
		var ele = this;
		var idPrefix = "printArea_";
		removePrintArea(idPrefix + printAreaCount);
		printAreaCount++;
		var iframeId = idPrefix + printAreaCount;
		var iframeStyle = 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;';
		var iframe = document.createElement('IFRAME');
		$(iframe).attr({
			style: iframeStyle,
			id: iframeId
		});
		document.body.appendChild(iframe);
		var doc = iframe.contentWindow.document;
		$(document).find("link").filter(function () {
			return $(this).attr("rel").toLowerCase() == "stylesheet";
		}).each(function () {
			doc.write('<link type="text/css" rel="stylesheet" href="'
					+ $(this).attr("href") + '" >');
			});
		doc.write('<div class="' + $(ele).attr("class") + '">' + $(ele).html()
				+ '</div>');
		doc.close();
		var frameWindow = iframe.contentWindow;
		frameWindow.close();
		frameWindow.focus();
		frameWindow.print();
	}
		function removePrintArea(id) {
		$("iframe#" + id).remove();
	};

	export default {
		props:['obserable','scoreObj'],
		name:'zmitiindex',
		data(){
			return{
				imgs:window.imgs,
				viewH:window.innerHeight,
				date:'',
				createImg:"",
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
			
			var d = new Date();
			this.date = d.getFullYear() + '-' + (d.getMonth()+1)+'-'+d.getDate();
		},

		watch:{
			
		},
		
		methods:{

			getScore(){
				var syllabusid = this.scoreObj.syllabusid,
					syallabustitle = this.scoreObj.syallabustitle,
					s = this;
				s.$root.eventHub.$emit('setMainType',2);
				setTimeout(()=>{
					s.$root.eventHub.$emit('getScoreByStudent',syllabusid,syallabustitle);
				},100)

			},
			html2img(){
				var s = this;

				setTimeout(()=>{
					var ref = 'page';
					var dom = this.$refs[ref];
					html2canvas(dom,{
						useCORS: true,
						onrendered: function(canvas) {
					        var src = canvas.toDataURL();
							//s.mergeImg = '';
							s.createImg = src;

							setTimeout(() => {
								s.$refs['download'].click();
							}, 100);
							
					      },
					      width: dom.clientWidth,
					      height:dom.clientHeight
					})
				},100)
			},
			printPage(){//打印页面
				$(this.$refs['page']).printArea();
			}
			
		}
	}
</script>
 