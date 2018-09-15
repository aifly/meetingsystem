<template>
    <div class="layout">
        <Layout v-if='$route.name !== "login" && $route.name !== "register"'>
            <Header>
               <div>
                    <div class="wm-title">
                        <img :src="imgs.adminLoginTitle" alt="">
                    </div>
               </div>
               <div>
                   <div v-if='false'>
                       <span><img :src="imgs.search" alt=""></span><input type="text" placeholder="查询我的上报" />
                   </div>
               </div>
               <div class="wm-user-info">
                   <span><img :src='imgs.man' /></span>
                   <span class="zmiti-text-overflow">{{userinfo.realname}}</span>
                   <div @click="logout">
                       <img :src="imgs.logout" alt="">
                   </div>
               </div>
            </Header>
            <Layout class="wm-main-layout">
                <div class="wm-tab-C" :style='{height:(viewH - 64)+"px"}'>
                    <Menu width='300'   theme='dark'>
                        
                        <Submenu name="1">
                            <template slot="title">
                                <Icon type="ios-paper" />
                                人员管理
                            </template>
                            <!--  <MenuItem :class='{"ivu-menu-item-active ivu-menu-item-selected":$route.name === "rate"}' :key='i' v-for="(item,i) in sourceList" :name="item.resourceid">{{item.resourcecnname}}
                            </MenuItem> -->
                            <MenuItem name='student' to='/student/' :class='{"ivu-menu-item-active ivu-menu-item-selected":$route.name === "student"}'>
                                学员管理
                            </MenuItem>
                            <!--  <MenuItem :class='{"ivu-menu-item-active ivu-menu-item-selected":$route.name === "rate"}' :key='i' v-for="(item,i) in sourceList" :name="item.resourceid">{{item.resourcecnname}}
                            </MenuItem> -->
                            <MenuItem to='/teacher/' name='teacher' :class='{"ivu-menu-item-active ivu-menu-item-selected":$route.name === "teacher"}'>
                                教师管理
                            </MenuItem>
                            <MenuItem to='/adminuser/' name='adminuser' :class='{"ivu-menu-item-active ivu-menu-item-selected":$route.name === "adminuser"}'>
                                管理员管理
                            </MenuItem>
                        </Submenu>
                         <Submenu name='4'>
                            <template slot="title">
                                <Icon type="ios-paper-plane" />
                                会议系统
                            </template>
                            <MenuItem name='meeting' to='/meeting/' :class='{"ivu-menu-item-active ivu-menu-item-selected":$route.name.indexOf("meeting")>-1}'>
                                会议管理
                            </MenuItem>
                            <MenuItem name='news' to='/news/' :class='{"ivu-menu-item-active ivu-menu-item-selected":$route.name.indexOf("news")>-1}'>
                                新闻管理
                            </MenuItem>
                            <MenuItem name='class' to='/class/' :class='{"ivu-menu-item-active ivu-menu-item-selected":$route.name.indexOf("class")>-1}'>
                                课程管理
                            </MenuItem>
                            <MenuItem name='attendance' to='/attendance/' :class='{"ivu-menu-item-active ivu-menu-item-selected":$route.name.indexOf("attendance")>-1}'>
                                考勤管理
                            </MenuItem>
                            <!-- <MenuItem v-for='(resource,i) in resourceList' :key="i" :name='"collection"+i' :to='"/collection/"+resource.resourceid+"/0"' :class='{"ivu-menu-item-active ivu-menu-item-selected":$route.name === "collection"}'>
                                {{resource.resourcecnname}}
                            </MenuItem> -->
                        </Submenu>
                        <Submenu name='2'>
                            <template slot="title">
                                <Icon type="ios-paper" />
                                我的
                            </template>
                            <MenuItem name='user' to='/user/' :class='{"ivu-menu-item-active ivu-menu-item-selected":$route.name === "user"}'>
                                个人中心
                            </MenuItem>
                        </Submenu>
                    </Menu>
                </div>
                <Layout :style="{maxWidth:viewW-300+'px'}">
                   <router-view></router-view>
                </Layout>
            </Layout>
        </Layout>
        <div v-else>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
	import './index.css';
    import Vue from 'vue';
    import symbinUtil from '../lib/util';
    import sysbinVerification from '../lib/verification';

	export default {
		props:[],
		name:'zmitiindex',
		data(){
			return{
				imgs:window.imgs,
                viewH:document.documentElement.clientHeight,
                viewW:window.innerWidth,
                tabIndex:0,
                userinfo:{},
                
                resourceList:[],
                menus:[]
			}
		},
		components:{
		},
        beforeCreate(){
            this.validateData = sysbinVerification.validate(this);
        },
        watch:{
           $route(e){
               //console.log(e)
           }
        },
		mounted(){
            window.s = this;
           ///this.menus = this.defaultMenu.concat([]);
            var obserable = Vue.obserable;
            
            var userinfo = symbinUtil.getUserInfo();

            this.userinfo = userinfo; 
            
            window.onresize = ()=>{
                this.viewW  = window.innerWidth;
            }
            
            if(this.$route.name !== 'login'){
              // this.getResourceList();
            }
            setTimeout(() => {
                $('.ivu-menu-submenu-title').trigger('click')
            }, 100);
        },
       
		methods:{

            getResourceList(){
                var s = this;
                
                symbinUtil.ajax({
                    _this:s,
                    url:window.config.baseUrl+'/wmadadmin/getsourcelist/',
                    data:{
                        admintoken:s.userinfo.accesstoken,
					    adminuserid:s.userinfo.userid,
                    },
                    success(data){
                        if(data.getret === 0){
                            s.resourceList = data.list;
                            Vue.obserable.on('getResource',()=>{
                                return data.list;
                            });
                        }
                    }
                })
			},

            
            tab(index){
                this.tabIndex = index;
            },
           
            loadMenu(option,fn){
                var s = this;
                return;
                symbinUtil.ajax({
                    _this:s,
                    url:window.config.baseUrl+"/admin/getmenulist",
                    validate:s.validateData,
                    data:{
                        status:option.status,
                    },
                    fn(data){

                       // console.log(JSON.stringify(data));
                        
                        if(data.getret===0){

                            fn && fn(data);
                        }
                        else{
                            s.$Message.error({
                                content:data.getmsg,
                                duration: 10
                            });
                             
                        }
                        
                    }
                })
            },
            logout(){
                var s = this;
                symbinUtil.ajax({
                    _this:s,
                    url:window.config.baseUrl+'/zmitiadmin/exitlogin/',
                    data:{
                        adminuserid:s.userinfo.userid,
						admintoken:s.userinfo.accesstoken
                    },
                    
                    success(data){
                        if(data.getret === 0){
                            s.$Message.success('注销成功');
                            symbinUtil.clearCookie('login');
                            window.location.hash = '/login';
                            window.sessionStorage.clear();
                        }
                    }
                });
            }
		}
	}
</script>
 

 <style >
     .ivu-layout-header{
        padding: 0 !important; 
     }
     .ivu-layout{
        position: relative;
     }
 </style>