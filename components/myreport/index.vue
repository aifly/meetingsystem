<template>
	<div class="wm-myreport-main-ui">


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
				showUploadDialog:false,
				visible:false,
				imgs:window.imgs,
				isLoading:false,
				tag:"",
				beforeUploadTag:"",
				currentType:0,
				accepts:[
					{
						title: 'Images',
						extensions: 'gif,jpg,jpeg,bmp,png,tiff,tif',
						mimeTypes: 'image/*'
					},{
						title: 'Video',
						extensions: 'mp4,webm',
						mimeTypes: 'video/*'
					},{
						title: 'Audio',
						extensions: 'aac,ogg,aac,wma,mp3,vnd.dlna.adts',
						mimeTypes: 'auido/*'
					},{
						title: 'All',
						extensions: 'mp3,gif,jpg,jpeg,bmp,png,tiff,tif,mp4,webm,aac,ogg,aac,wma,vnd.dlna.adts',
						mimeTypes: '*/*'
					},{
						title: 'Images',
						extensions: 'gif,jpg,jpeg,bmp,png,tiff,tif',
						mimeTypes: 'image/*'
					}
				],
				publicadtype:"",
				currentReportIndex:0,
				showOriginalImg:false,
				showPreview:false,
				showMaskDetail:true,
				detailtag:'',
				showReportTip:false,
				defaultReportList:[],
				menus:[],
				colorList:['default','success','primary','error','warning','red','orange','gold','yellow'],
				split1: 0.8,
				viewH:window.innerHeight,
				showUploadFile:false,
				configList:[],
				formUpload:{
					tagList:[]
				},
				formAdmin:{
					tagList:[]
				},
				ruleValidate: {
                     author:{
						 required:true,
						 trigger:'blur'
					 }
                },
				
				reportList:[],
				userinfo:{}
			}
		},
		components:{
		},

		beforeCreate(){
			window.s = this;
			
		},
		watch:{
			
		},
		mounted(){
			
		},
		
		methods:{

			 
			
		}
	}
</script>
 

