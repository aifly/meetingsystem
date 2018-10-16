<template>
    <div class="wm-addstudent-ui">
        <header class="wm-addstudent-header">
			<div>{{title}} > 新增学员</div>
		</header>
		<div class='wm-addstudent-main' :style="{height:viewH- 64 - 64+'px'}">
			<ul class='wm-addstudent-step'>
				<li v-for="(step,i) in steps" :key='i' :class="{'active':current>=i,' active1':current>i}" :title="step.title" :content="step.content">
					<div>
						<div class='wm-step-index' ><span>{{i+1}}</span></div>
						<section>{{step.title}}</section>
					</div>
				</li>
			</ul>

			<div class='wm-step-content-wrap'>
				<ol :style="{width:400*steps.length+'px',WebkitTransform:'translate3d('+-400*current+'px,0,0)',transform:'translate3d('+-400*current+'px,0,0)'}">
					<li>
						<div class='wm-addstudent-form-item'>
							<label for="">手机：</label><input placeholder="请输入手机号" @blur.stop='checkMobile' type='text' v-model="formStudent.mobile"/>
						</div>
						<div class='wm-next-step-btn' @click='current++'>下一步</div>
					</li>
					<li>
						<div class='wm-addstudent-form-item'>
							<label for="">姓名：</label><input placeholder="请输入姓名" type='text' v-model="formStudent.username"/>
						</div>
						<div class='wm-addstudent-form-item'>
							<label for="">密码：</label><input disabled placeholder="请输入密码" type='text' v-model="formStudent.userpwd"/>
						</div>
						<div class='wm-addstudent-form-item'>
							<label for="">职务：</label><input placeholder="请输入职务" type='text' v-model="formStudent.job"/>
						</div>
						<div class='wm-addstudent-form-item'>
							<label for="">公司名称：</label><input placeholder="请输入公司名称" type='text' v-model="formStudent.companyname"/>
						</div>
						<div class='wm-addstudent-form-item'>
							<label for="">邮箱：</label><input placeholder="请输入邮箱" type='text' v-model="formStudent.email"/>
						</div>
						<div class='wm-addstudent-form-item displayFlex'>
							<div><label for="">所在城市：</label></div><Cascader v-model="formStudent.cityids"  :load-data="getCityById"  change-on-select :data='provinceList'></Cascader>
						</div>
						<div class='wm-addstudent-form-item'>
							<label for="">详细地址：</label><textarea placeholder="请输入详细地址"  v-model="formStudent.detailaddress" ></textarea>
						</div>
						<div class='wm-next-step-btn'>{{current>=steps.length-1?'完成':'下一步'}}</div>
					</li>
				</ol>
			</div>

		</div>
    </div>
</template>


<script>
	import './index.css';
	import Vue from 'vue';
	import symbinUtil  from '../../lib/util';
    export default {
		props:['obserable','title','steps'],
		name:'zmitiindex',
		data(){
			return{
				userinfo:{},
				viewH:window.innerHeight,
				current:0,
				formStudent:{
					mobile:"",
					userpwd:'123456',
					cityids:[]
				},
				provinceList:[]

			}
		},
		components:{
		},
		watch:{
			
		},
		beforeCreate(){
			
		},
		mounted(){
			 this.getCityData();
			 this.userinfo = symbinUtil.getUserInfo();
		},
		
		methods:{
			checkMobile(e){
				e.preventDefault();
				
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/validationrepeat',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
						meetid:s.$route.params.meetid,
						mobile:s.formStudent.mobile
					},
					success(data){
						console.log(data);
					}
				})
			},
			getCityById(e,callback){
				var provinceId = e.__value.split(',')[0];
				var cityid = e.__value.split(',')[1];
				var s = this;

				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/meetshare/getarealist',
					data:{
						cityid
					},
					success(data){
						if(data.getret === 0){
							console.log(data);
							s.provinceList.forEach((item,i)=>{
								if(item.value === provinceId*1){
									item.children.forEach((child,k)=>{
										if(child.value === cityid*1){
											child.children = child.children || [];
											data.list.map((d,l)=>{
												child.children.push({
													value:d.cityid,
													label:d.name,
													//loading: false
												})
											})
											
										}
									})
									callback();
									
								}
								
							});
							

						}
					}

				})
			},
			getCityData(){
				var s = this;
				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/meetshare/getcitylist/',
					data:{},
					success(data){
						//console.log(data);
						if(data.getret === 0){
							data.list.map((item,i)=>{
								var children = [];
								item.children && item.children.map((child,l)=>{
									children.push({
										value:child.cityid,
										label:child.name,
										loading: false,
										children:[]
										
									})
								})
								s.provinceList.push({
									value:item.cityid,
									label:item.name,
									children,
									loading: false
								})
							})
						}
					}
				})
			},
        }
	}
</script>
