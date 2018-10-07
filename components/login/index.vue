<template>
	<div  class="wm-login-ui lt-full">
		<header>
			
		</header>
		<section> 
			<div class="wm-login-C">
				<h2>中国文明网会议系统 </h2>
				<div class="wm-login-form">
					<section class='wm-login-logo'>
						<img :src="imgs.logo" alt="">
					</section>
					<div>
						<label>
							<input type="text" v-model="username" placeholder="手机号/用户名">
						</label>
						<div class='wm-login-error' v-if='loginError'>{{loginError}}</div>
					</div>
					<div>
						<label>
							<input @keydown.13='login' type="password" v-model="password" placeholder="请输入密码">
						</label>
					</div>
					<div class='wm-remember-pass'>
						<label><Checkbox v-model="checked">记住密码</Checkbox></label>
					</div>
					<div class='wm-login-btn'>
						<div @click="login">登录 <Icon v-if='showLoading' type="ios-loading" class="demo-spin-icon-load"></Icon></div>
					</div>
				</div>
				<div class='wm-browner-tip' v-if='isNotChrome'>
					<img draggable="false" :src="imgs.brower" alt="">
				</div>
			</div>
			<div class="wm-copyright">
				智媒体 &copy;版权所有
			</div>
		</section>
	</div>
</template>

<script>
	import './index.css';
	import symbinUtil from '../lib/util';
	import Vue from "vue";
	export default {
		props:['obserable'],
		name:'zmitiindex',
		data(){
			return{
				imgs:window.imgs,
				username:'',
				password:'',
				loginError:'',
				checked:false,
				isLogined:false,
				isMove:false,
				isNotChrome:true,
				showLoading:false,
				showError:false,
				errorMsg:'',
				loginType:"员工登录",
				viewH:document.documentElement.clientHeight
			}
		},
		components:{
		},
		
		methods:{
			toastError(msg =  '用户名不能为空'){
				this.$Message.error(msg);
				/*
				this.loginError = msg;
 				setTimeout(()=>{
 					this.loginError = '';
 				},2000)*/
			},
			login(){
				var _this = this;
				if(!this.username){
					this.toastError();
 					return;
				}
				if(!this.password){
					this.toastError('密码不能为空');
 					return;
				}
				this.showLoading = true;
				var s = this;

				symbinUtil.ajax({
					_this:s,
					url:window.config.baseUrl+'/zmitiadmin/login/',
					data:{
						username:_this.username,
						userpwd:_this.password
					},
					success(data){
						if(data.getret === 0){
							var param = data;
							delete param.getret;
							delete param.getmsg;
							var p = param.list;
							
							symbinUtil.clearCookie('adminlogin');
							//symbinUtil.setCookie('adminlogin',JSON.stringify(p),1);
							window.localStorage.setItem('adminlogin',JSON.stringify(p));
							if(_this.checked){
								window.localStorage.setItem('wm_adminusername',_this.username);
								window.localStorage.setItem('wm_adminpassword',_this.password);
							}else{
								window.localStorage.setItem('wm_adminusername','');
								window.localStorage.setItem('wm_adminpassword','');
							}
							window.location.hash = '#/student/';
							
							_this.$Message.success('登录成功~');
							
							window.location.reload();
							_this.isLogined = true;
							
						}else{
							_this.toastError(data.getmsg);
							_this.showLoading = false;
						}
					}
				})
				
			},
			checkCache(){
				var username = window.localStorage.getItem('wm_adminusername'),
					password = window.localStorage.getItem('wm_adminpassword');
				
				if(username && password){
					this.username = username;
					this.password = password;
					this.checked = true;
				}
			}
		
			
		},
		mounted(){
			this.checkCache();
			var ua = navigator.userAgent.toLowerCase();
			this.isNotChrome = !ua.match(/chrome\/([\d.]+)/)

		}
	}
</script>
 <style>
	.demo-spin-icon-load{
		
        animation: ani-demo-spin 1s linear infinite;
        -webkit-animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
 </style>