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
							<label for="">手机：</label><input placeholder="请输入手机号"  type='text' v-model="formStudent.mobile"/>
							<span class="msg" :class='{"success":success}'>{{msg}}</span>
						</div>
						<div class='wm-next-step-btn' @click='next'>下一步</div>
					</li>
					<li v-show='current===1'>
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
							<div><label for="">所属小组：</label></div>
							<Select v-model="formStudent.groupid" style="width:240px;background:transparent">
						       <Option v-for="item in groupList" :value="item.groupid+''" :key="item.groupid">{{ item.groupname }}</Option>
						    </Select>
						</div>
						<div class='wm-addstudent-form-item displayFlex'>
							<div><label for="">所在城市：</label></div><Cascader v-model="formStudent.cityids"  :load-data="getCityById"  change-on-select :data='provinceList'></Cascader>
						</div>
						<div class='wm-addstudent-form-item'>
							<label for="">详细地址：</label><textarea placeholder="请输入详细地址"  v-model="formStudent.detailaddress" ></textarea>
						</div>
						<div class='wm-next-step-btn' @click='insertStudent'>{{current>=steps.length-1?'完成':'下一步'}}</div>
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
				groupList:[],
				viewH:window.innerHeight,
				current:0,
				formStudent:{
					mobile:"",
					userpwd:'123456',
					cityids:[]
				},
				success:false,
				msg:'',
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
			 this.getGroupList();
		},
		
		methods:{
			insertStudent(){
				var s = this;
				if(this.current >= this.steps.length - 1){//添加
					symbinUtil.ajax({
						url:window.config.baseUrl+'/zmitiadmin/addstudent/',
						data:{
							adminuserid:s.userinfo.userid,
							studentpwd:s.formStudent.userpwd,
							admintoken:s.userinfo.accesstoken,
							username:s.formStudent.mobile,
							mobile:s.formStudent.mobile,
							companyname:s.formStudent.companyname,
							studentname:s.formStudent.studentname,
							email:s.formStudent.email,
							provinceid:s.formStudent.cityids[0],
							meetid:s.$route.params.meetid,
							job:s.formStudent.job,
							groupid:s.formStudent.groupid,
							cityid:s.formStudent.cityids[1],
							areaid:s.formStudent.cityids[2],
							detailaddress:s.formStudent.detailaddress
						},
						success(data){
							if(data.getret === 0){
								s.$Message.success(data.getmsg);
								Vue.obserable.trigger({
									type:"hideAddStudent"
								});
							}
							else{
								s.$Message.error(data.getmsg);
							}
						}
	
					})
				}else{
					this.current++;
				}
			},

			getGroupList(){
				var s = this;
				symbinUtil.ajax({
					url:window.config.baseUrl+'/zmitiadmin/getusergrouplist',
					data:{
						admintoken:s.userinfo.accesstoken,
						adminuserid:s.userinfo.userid,
					},
					success(data){
						if(data.getret === 0){
							s.groupList = data.list;
						}
					}
				})
			},
			isPoneAvailable(val) {
	            var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
	            return myreg.test(val);
	        },
			next(){
				if(this.isPoneAvailable(this.formStudent.mobile)){
					this.checkMobile();
				}else{
					this.msg = '手机号格式错误';
					this.success = false;
					setTimeout(()=>{
						this.msg = '';
					},2000)
				}


			},
			checkMobile(e){
				
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

						if(data.getret === 0){
							s.success = true;
							setTimeout(()=>{
								s.current++;
							},1000);
						}
						s.msg = data.getmsg;

						setTimeout(()=>{
							s.msg = '';
							s.success = '';
						},2000)
						
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
