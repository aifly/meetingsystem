import Vue from "vue";
import Obserable from './components/lib/obserable';
//import Collection from './components/collection/index';
import iView from 'iview';
import './components/css/theme.less'
import vueTap from 'vue-js-tap';
import symbinUtil from './components/lib/util';
Vue.use(vueTap);
Vue.use(iView)
var obserable = new Obserable();

Vue.obserable = obserable;
 
new Vue({
	data: {
		obserable,
		viewH: document.documentElement.clientHeight,
		provinceList:[],
		cityList:[],
		areaList:[],
		isSubmit:false,
		count:0,
		successImg:'./assets/images/success.png',
		meetInfo:{},
		showVerifycode:false,
		cacheFormStudent:{
			userpwd: '',
			cityids: []
		},
		nationData:[
			{ id: 1, name: '汉族' },
			{ id: 2, name: '蒙古族' },
			{ id: 3, name: '回族' },
			{ id: 4, name: '藏族' },
			{ id: 5, name: '维吾尔族' },
			{ id: 6, name: '苗族' },
			{ id: 7, name: '彝族' },
			{ id: 8, name: '壮族' },
			{ id: 9, name: '布依族' },
			{ id: 10, name: '朝鲜族' },
			{ id: 11, name: '满族' },
			{ id: 12, name: '侗族' },
			{ id: 13, name: '瑶族' },
			{ id: 14, name: '白族' },
			{ id: 15, name: '土家族' },
			{ id: 16, name: '哈尼族' },
			{ id: 17, name: '哈萨克族' },
			{ id: 18, name: '傣族' },
			{ id: 19, name: '黎族' },
			{ id: 20, name: '傈僳族' },
			{ id: 21, name: '佤族' },
			{ id: 22, name: '畲族' },
			{ id: 23, name: '高山族' },
			{ id: 24, name: '拉祜族' },
			{ id: 25, name: '水族' },
			{ id: 26, name: '东乡族' },
			{ id: 27, name: '纳西族' },
			{ id: 28, name: '景颇族' },
			{ id: 29, name: '柯尔克孜族' },
			{ id: 30, name: '土族' },
			{ id: 31, name: '达翰尔族' },
			{ id: 32, name: '么佬族' },
			{ id: 33, name: '羌族' },
			{ id: 34, name: '布朗族' },
			{ id: 35, name: '撒拉族' },
			{ id: 36, name: '毛南族' },
			{ id: 37, name: '仡佬族' },
			{ id: 38, name: '锡伯族' },
			{ id: 39, name: '阿昌族' },
			{ id: 40, name: '普米族' },
			{ id: 41, name: '塔吉克族' },
			{ id: 42, name: '怒族' },
			{ id: 43, name: '乌孜别克族' },
			{ id: 44, name: '俄罗斯族' },
			{ id: 45, name: '鄂温克族' },
			{ id: 46, name: '德昂族' },
			{ id: 47, name: '保安族' },
			{ id: 48, name: '裕固族' },
			{ id: 49, name: '京族' },
			{ id: 50, name: '塔塔尔族' },
			{ id: 51, name: '独龙族' },
			{ id: 52, name: '鄂伦春族' },
			{ id: 53, name: '赫哲族' },
			{ id: 54, name: '门巴族' },
			{ id: 55, name: '珞巴族' },
			{ id: 56, name: '基诺族' }
		],
		formStudent: {
			userpwd: '',
			cityids: []
		},
	},
	el: '#app',
	template: `<div id="app">
		  <template v-if='!isSubmit'>
				<div class="wm-banner" id='wm-banner'>
					<img  v-if='meetInfo.bannerurl' :src='meetInfo.bannerurl' />
					<h2 v-if='!meetInfo.bannerurl'>{{meetInfo.meetname}}</h2>
					<div v-if='!meetInfo.bannerurl'>{{formatDate(meetInfo.startdate) + ' ~ ' + formatDate(meetInfo.enddate)}}</div>
				</div>
				
				<div class='wm-form-item require'>
					<label class='label' for="">手机号：</label><input v-model='formStudent.mobile' @blur="checkUser" placeholder="请输入手机号" />
				</div>
				<div class='wm-form-item require' v-if='showVerifycode'>
					<label class='label' for="">验证码：</label><input ref='code' @blur='checkCode'  v-model='formStudent.verifycode' type='text' placeholder="验证码：" /><div class='wm-getcode' v-tap='[getCode]'>{{count?count+"s后重新获取":"获取验证码"}}</div>
				</div>
				<div class='wm-form-item require' v-if='!showVerifycode'>
					<label class='label' for="">密<span style="opacity:0">机</span>码：</label><input v-model='formStudent.userpwd' type='password' placeholder="请输入密码" />
				</div>
				<div class='wm-form-item require'>
					<label class='label' for="">姓<span style="opacity:0">机</span>名：</label><input v-model='formStudent.studentname' type='text' placeholder="请输入姓名" />
				</div>
				<div class='wm-form-item require'>
					<label class='label' for="">性<span style="opacity:0">机</span>别：</label> 
					<RadioGroup v-model='formStudent.sex'>
						<Radio :label="0">男</Radio>
						<Radio :label="1">女</Radio>
					</RadioGroup>
				</div>
				<div class='wm-form-item require'>
					<label class='label' for="">单<span style="opacity:0">机</span>位：</label><input v-model='formStudent.companyname' type='text' placeholder="请输入单位" />
				</div>

				<div class='wm-form-item require'>
					<label class='label' for="">职<span style="opacity:0">机</span>务：</label><input v-model='formStudent.job' type='text' placeholder="请输入职务" />
				</div>
				
				<div class='wm-form-item'>
					<label class='label' for="">邮<span style="opacity:0">机</span>箱：</label><input type='text' v-model='formStudent.email' placeholder="请输入邮箱" />
				</div>
				<div class='wm-form-item '>
					<label class='label' for="">昵<span style="opacity:0">机</span>称：</label><input type='text' v-model='formStudent.nickname' placeholder="请输入昵称" />
				</div>
				<div class='wm-form-item require'>
					<label class='label' for="">民族 ：</label>
					<select style='width:420px' v-model='formStudent.nation'>
						<option :value='-1'>==请选择==</option>
						<option v-for="(city,i) in nationData" :value='city.name' :key='i'>{{city.name}}</option>
					</select>
				</div>
				<div class='wm-form-item'>
					<label class='label' for="">座机号：</label><input type='text' placeholder="请输入座机号" v-model='formStudent.telphone'/>
				</div>
				<div class='wm-form-item require'>
					<label class='label' for="">省/市 ：</label>
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
					<label class='label' for="">地<span style="opacity:0">机</span>址：</label>
					<textarea v-model='formStudent.detailaddress'></textarea>
				</div>

				<div class='wm-form-item '>
					<div class='wm-submit-btn' id='wm-submit-btn' v-tap='[submit]'>提交</div>
				</div>
		  </template>

		  <div class='lt-full wm-submit-success' v-else>
		  		<img :src='successImg'/>
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
			if(!s.formStudent.userpwd && !s.showVerifycode){
				this.$Message.error('密码不能为空');
				return;
			}
			if (!s.formStudent.provinceid) {
				this.$Message.error('省份不能为空');
				return;
			}
			if (!s.formStudent.cityid) {
				this.$Message.error('城市不能为空');
				return;
			}
			if (!s.formStudent.job) {
				this.$Message.error('职位不能为空');
				return;
			}
			if (!s.formStudent.companyname) {
				this.$Message.error('单位不能为空');
				return;
			}
			if (s.formStudent.nation === -1) {
				this.$Message.error('民族不能为空');
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
					

					nation:s.formStudent.nation,
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
					s.isSubmit = data.getret === 0;
					s.$Message[data.getret === 0 ? 'success' : 'error'](data.getmsg);
					if(data.getret === 0){
						s.formStudent = {};
						s.showVerifycode = false;
						s.count = 0;
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
		checkCode(){
			var s = this;
			if (!s.formStudent.verifycode || s.isEdit){
				return;
			}
			symbinUtil.ajax({
				url: window.baseUrl + "/zmitistudent/mobile_validation",
				data: {
					mobile: s.formStudent.mobile,
					verifycode: s.formStudent.verifycode //短信类型：0,注册；1,登陆；
				},
				success(data) {
					if(data.getret === 0){
						var mobile = s.formStudent.mobile,
							code = s.formStudent.verifycode;
						s.formStudent = s.cacheFormStudent;
						s.formStudent.mobile = mobile;
						s.formStudent.verifycode = code;
						s.isEdit = true;

					}
					s.$Message[data.getret === 0 ? 'success' : 'error'](data.getmsg);
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
							//s.formStudent = data.list;
							s.cacheFormStudent = data.list;
							
							if (s.cacheFormStudent.provinceid) {
								s.getCity(s.cacheFormStudent.provinceid);
								
							}
							if (s.cacheFormStudent.cityid) {
								s.getCityById(s.cacheFormStudent.cityid);
							}
						}else{
							s.cacheFormStudent = {};
							s.cacheFormStudent.mobile = mobile;
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

		this.t = null;
		$('input').blur(()=>{
			this.t = setTimeout(() => {
				document.body.scrollTo(0,0);
			}, 500);
		}).focus(()=>{
			clearTimeout(this.t);
		});
		$('textarea').blur(() => {
			this.t = setTimeout(() => {
				document.body.scrollTo(0, 0);
			}, 500);
		}).focus(() => {
			clearTimeout(this.t);
		});
	}
})