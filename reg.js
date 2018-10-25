import Vue from "vue";
import Obserable from './components/lib/obserable';
//import Collection from './components/collection/index';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import vueTap from 'vue-js-tap';
import symbinUtil from './components/lib/util';
Vue.use(vueTap);
Vue.use(iView)
var obserable = new Obserable();

Vue.obserable = obserable;
window.baseUrl = 'http://api.symbin.cn/v1/'
new Vue({
	data: {
		obserable,
		viewH: document.documentElement.clientHeight,
		provinceList:[],
		cityList:[],
		areaList:[],
		count:0,
		meetInfo:{},
		showVerifycode:false,
		formStudent: {
			userpwd: '',
			cityids: []
		},
	},
	el: '#app',
	template: `<div id="app">
		  <div class="wm-banner" id='wm-banner'>
			  <img  v-if='meetInfo.bannerurl' :src='meetInfo.bannerurl' />
			  <h2 v-if='!meetInfo.bannerurl'>{{meetInfo.meetname}}</h2>
			  <div v-if='!meetInfo.bannerurl'>{{formatDate(meetInfo.startdate) + ' ~ ' + formatDate(meetInfo.enddate)}}</div>
			  
			  
        </div>
        <div class='wm-form-item require'>
            <label for="">手机号：</label><input v-model='formStudent.mobile' @blur="checkUser" placeholder="请输入手机号" />
		</div>
		 <div class='wm-form-item require' v-if='showVerifycode'>
            <label for="">验证码：</label><input  v-model='formStudent.verifycode' type='text' placeholder="验证码：" /><div class='wm-getcode' v-tap='[getCode]'>{{count?count+"s后重新获取":"获取验证码"}}</div>
        </div>
        <div class='wm-form-item require'>
            <label for="">密<span style="opacity:0">机</span>码：</label><input v-model='formStudent.userpwd' type='password' placeholder="请输入密码" />
        </div>
        <div class='wm-form-item require'>
            <label for="">姓<span style="opacity:0">机</span>名：</label><input v-model='formStudent.studentname' type='text' placeholder="请输入姓名" />
		</div>
        <div class='wm-form-item'>
			<label for="">性<span style="opacity:0">机</span>别：</label> 
			<RadioGroup v-model='formStudent.sex'>
				<Radio :label="0">男</Radio>
				<Radio :label="1">女</Radio>
			</RadioGroup>
        </div>
        <div class='wm-form-item'>
            <label for="">职<span style="opacity:0">机</span>务：</label><input v-model='formStudent.job' type='text' placeholder="请输入职务" />
        </div>
        <div class='wm-form-item'>
            <label for="">公<span style="opacity:0">机</span>司：</label><input v-model='formStudent.companyname' type='text' placeholder="请输入公司" />
        </div>
        <div class='wm-form-item'>
            <label for="">邮<span style="opacity:0">机</span>箱：</label><input type='text' v-model='formStudent.email' placeholder="请输入邮箱" />
        </div>
        <div class='wm-form-item'>
            <label for="">昵<span style="opacity:0">机</span>称：</label><input type='text' v-model='formStudent.nickname' placeholder="请输入昵称" />
        </div>
        <div class='wm-form-item'>
            <label for="">座机号：</label><input type='text' placeholder="请输入座机号" v-model='formStudent.telphone'/>
        </div>
        <div class='wm-form-item'>
			<label for="">省/市 ：</label>
			<select @change='getCity($event)' v-model='formStudent.provinceid'>
				<option :value='-1'>==请选择==</option>
				<option v-for="(city,i) in provinceList" :value='city.value' :key='i'>{{city.label}}</option>
			</select>
			<select v-if='formStudent.cityid||cityList.length' @change='getCityById($event)' v-model='formStudent.cityid'>
				<option :value='-1'>==请选择==</option>
				<option v-for="(city,i) in cityList" :value='city.value' :key='i'>{{city.label}}</option>
			</select>
			<select v-if='formStudent.areaid||areaList.length' v-model='formStudent.areaid'>
				<option v-for="(city,i) in areaList" :value='city.cityid' :key='i'>{{city.name}}</option>
			</select>
		</div>
		
		<div class='wm-form-item'>
			<label for="">地<span style="opacity:0">机</span>址：</label>
			<textarea v-model='formStudent.detailaddress'></textarea>
        </div>

        <div class='wm-form-item '>
            <div class='wm-submit-btn' id='wm-submit-btn' v-tap='[submit]'>提交</div>
        </div>
    </div>`,
	methods: {
		init () {
			this.getMeetInfo();
		},
		submit(){
			var s = this;
			if (!this.isPoneAvailable(s.formStudent.mobile)) {
				this.$Message.error('手机号格式不正确');
				return;
			}
			if(!s.formStudent.userpwd){
				
				this.$Message.error('密码不能为空');
				return;
			}
			symbinUtil.ajax({
				url: window.baseUrl + "/zmitistudent/registered",
				data: {
					mobile: s.formStudent.mobile,
					meetid: s.getQueryString('meetid'),
					groupid: '1362650453',
					studentpwd:s.formStudent.userpwd,
					issignup:s.meetInfo.issignup,
					ischecked:s.meetInfo.ischecked,
					isreport:s.meetInfo.isreport,
					verifycode: s.formStudent.verifycode,
					sex:s.formStudent.sex,
					studentname:s.formStudent.studentname,
					provinceid:s.formStudent.provinceid,
					cityid:s.formStudent.cityid,
					areaid:s.formStudent.areaid,
					telphone:s.formStudent.telphone,
					detailaddress:s.formStudent.detailaddress,
					email:s.formStudent.email,
					nickname:s.formStudent.nickname,
					job:s.formStudent.job,
					companyname:s.formStudent.companyname,
				},
				success(data) {
					console.log(data);
					s.$Message[data.getret === 0 ? 'success' : 'error'](data.getmsg);
					if(data.getret === 0){
						s.formStudent = {};
					}
				}
			})
		},
		getCode(){
			var s = this;
			if (this.count || !this.isPoneAvailable(this.formStudent.mobile)) {
				return;
			}
			this.count = 60;
			var t = setInterval(()=>{
				this.count--;
				if(this.count<=0){
					clearInterval(t);
				}
			},1000)
			symbinUtil.ajax({
				url: window.baseUrl + "/zmitistudent/send_mobilecode",
				data:{
					setmobile:s.formStudent.mobile,
					smstype: 0 //短信类型：0,注册；1,登陆；
				},
				success(data){
					s.$Message[data.getret === 0 ? 'success':'error'](data.getmsg);
				}
			})
		},
		checkUser(){
			
			var s = this;
			if (this.isPoneAvailable(this.formStudent.mobile)){
				var mobile = this.formStudent.mobile;
				symbinUtil.ajax({
					_this: s,
					url: window.baseUrl + '/zmitistudent/existsphone',
					data: {
						mobile
					},
					success(data) {
						s.showVerifycode = data.getret === 0;
						if (data.getret === 0) {
							s.formStudent = data.list;
							
							if (s.formStudent.provinceid) {
								s.getCity(s.formStudent.provinceid);
								
							}
							if(s.formStudent.cityid){
								s.getCityById(s.formStudent.cityid);
							}
						}else{
							s.formStudent ={};
							s.formStudent.mobile = mobile;
						}
					}

				})
			}
		},
		getQueryString (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return (r[2]);
			return null;
		},
		changeURLPar (url, arg, val) {
			var pattern = arg + '=([^&]*)';
			var replaceText = arg + '=' + val;
			return url.match(pattern) ? url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);
		},
		getMeetInfo: function () {
			var s = this;
			$.post(window.baseUrl + 'zmitistudent/getmeetinfo', {
				meetid: s.getQueryString('meetid')
			}, function (data) {
				if (data.getret === 0) {
					s.meetInfo = data.list[0];
					document.title = s.meetInfo.meetname + '~'+ document.title;
				}
			});
		},
		formatDate: function (sj) {
			var now = new Date(sj * 1000);
			var year = now.getFullYear();
			var month = now.getMonth() + 1;
			var date = now.getDate();
			return year + "-" + month + "-" + date;
		},
		getCity(e){
			var cityid = e.target ? e.target.value:e;
			
			this.provinceList.forEach((city,i)=>{
				if(city.value*1 === cityid*1){
					this.cityList = city.children.concat([]);
				}
			});
		},
		getCityById(e, callback) {
			var cityid = e.target ? e.target.value : e;
			var s = this;


			symbinUtil.ajax({
				_this: s,
				url: window.baseUrl + '/meetshare/getarealist',
				data: {
					cityid
				},
				success(data) {
					if (data.getret === 0) {
						s.areaList = data.list;
						 
					}
				}

			})
		},
		getCityData() {
			var s = this;
			symbinUtil.ajax({
				_this: s,
				url: window.baseUrl + '/meetshare/getcitylist/',
				data: {},
				success(data) {
					//console.log(data);
					if (data.getret === 0) {
						data.list.map((item, i) => {
							var children = [];
							item.children && item.children.map((child, l) => {
								children.push({
									value: child.cityid,
									label: child.name,
									loading: false,
									children: []

								})
							})
							s.provinceList.push({
								value: item.cityid,
								label: item.name,
								children,
								loading: false
							});
							//s.getCity(s.provinceList[0].value);
						})
					}
				}
			})
		},
		isPoneAvailable($poneInput) {
			var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
			return myreg.test($poneInput);
		}
		
	},
	components: {
	},
	mounted() {

		this.$Message.config({
			top: 50,
			duration: 2
		});
		
		this.init();
		this.getCityData();
	}
})