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
import OutAttendance from './components/outattendance/index';
import Meeting from './components/meeting/index';
import Teacher from './components/teacher/index';
import Signup from './components/signup/index';
import Report from './components/report/index';
import Adminuser from './components/adminuser/index';
import ScoreItem from './components/scoreitem/index';
import Score from './components/score/index';
import Feedback from './components/feedback/index';
import Place from './components/place/index';
import Readstatus from './components/readstatus/index';

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
			path: '/meetingnews/:meetid/:meetname/',
			name: 'meetingnews',
			component: News,
			props: true
		},  {
			path: '/meeting/',
			name: 'meeting',
			component: Meeting,
			props: true
		}, {
			path: '/meetingcourse/:meetid/:meetname/',
			name: 'meetingcourse',
			component: Course,
			props: true
		}, {
			path: '/meetingreport/:meetid/:meetname/',
			name: 'meetingreport',
			component: Report,
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
			path: '/meetingattendance/:meetid/:meetname/',
			name: 'meetingattendance',
			component: Attendance,
			props: true
		}, {
			path: '/meetingsignup/:meetid/:meetname/',
			name: 'meetingsignup',
			component:Signup,
			props: true
		},
		{
			path: '/meetingscoreitem/:meetid/:meetname/',
			name: 'meetingscoreitem',
			component: ScoreItem,
			props: true
		}, {
			path: '/meetingscrore/:meetid/:meetname/',
			name: 'meetingscrore',
			component: Score,
			props: true
	 
		}, {
			path: '/meetingfeedback/:meetid/:meetname/',
			name: 'meetingfeedback',
			component: Feedback,
			props: true 
		}, {
			path: '/meetingoutattendance/:meetid/:meetname/',
			name: 'meetingoutattendance',
			component: OutAttendance,
			props: true
		},{
			path: '/meetingplace/:meetid/:meetname/',
			name: 'meetingplace',
			component: Place,
			props: true	 
		},{
			path: '/meetingreadstatus/:meetid/:meetname/:classid/:newtitle/',
			name: 'meetingreadstatus',
			component: Readstatus,
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
		eventHub: new Vue()
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
		

	}
}).$mount('#app1')
