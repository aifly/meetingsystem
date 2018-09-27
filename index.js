import Vue from "vue";
import Obserable from './components/lib/obserable';
import Main from './components/main/index';
import Student from './components/student/index';
import User from './components/user/index';
import Class from './components/class/index';
import News from './components/news/index';
import Login from './components/login/index';
import Course from './components/course/index';
import Attendance from './components/attendance/index';
import Meeting from './components/meeting/index';
import Teacher from './components/teacher/index';
import Signup from './components/signup/index';
import Adminuser from './components/adminuser/index';
//import Collection from './components/collection/index';
import iView from 'iview';
import VueRouter from 'vue-router'
import './components/css/index.css';
import './components/css/theme.less'
///import 'iview/dist/styles/iview.css';

Vue.use(VueRouter)
Vue.use(iView)
var obserable = new Obserable();

Vue.obserable = obserable;
const router = new VueRouter({
	routes: [
		//{path: '*', name: 'error', component: FError },
		{
			path: '/student/',
			name: 'student',
			component: Student,
			props: true
		}, {
			path: '/adminuser/',
			name: 'adminuser',
			component: Adminuser,
			props: true
		},
		{
			path: '/login/',
			name: 'login',
			component: Login,
			props: true
		}, {
			path: '/',
			name: 'login',
			component: Login,
			props: true
		},
		{
			path: '/meetingnews/:meetid/:meetname/:hash?/',
			name: 'meetingnews',
			component: News,
			props: true
		},  {
			path: '/meeting/',
			name: 'meeting',
			component: Meeting,
			props: true
		}, {
			path: '/meetingcourse/:meetid/:meetname/:hash?/',
			name: 'meetingcourse',
			component: Course,
			props: true
		}, {
			path: '/class/',
			name: 'class',
			component: Class,
			props: true
		}, {
			path: '/user/',
			name: 'user',
			component: User,
			props: true
		}, {
			path: '/teacher/',
			name: 'teacher',
			component: Teacher,
			props: true
		
		}, {
			path: '/meetingattendance/:meetid/:meetname/:hash?/',
			name: 'meetingattendance',
			component: Attendance,
			props: true
		}, {
			path: '/meetingsignup/:meetid/:meetname/:hash?/',
			name: 'meetingsignup',
			component:Signup,
			props: true
		}
	]
});

router.beforeEach((to, from, next) => { //导航守卫。
	next();
});

new Vue({
	router,
	data: {
		obserable,
		imgs,
		viewH: document.documentElement.clientHeight,
	},
	el: '#app',
	template: `<div id="app1">
      <Main :obserable='obserable'></Main>
    </div>`,
	methods: {},
	components: {
		Main
	},
	mounted() {
		this.$router.obserable = obserable;
		window.addEventListener("online", function (e) {
			this.$Message.success('网络已链接')
		})

		window.addEventListener("offline", function (e) {
			this.$Message.success('网络已断开');
		})

	}
}).$mount('#app1')