<template>
    <div class="layout">
        <Layout v-if='$route.name !== "login" && $route.name !== "register"'>
            <Header>
               <div>
                    <div class="wm-title">
                        <img :src="imgs.userLoginTitle" alt="">
                    </div>
               </div>
               <div>
                   <div>
                       <span><img :src="imgs.search" alt=""></span><input type="text" v-model='kw'  placeholder="查询我的上报" />
                   </div>
               </div>
               <div class="wm-user-info">
                   <span><img :src='imgs.man' /></span>
                   <span class="zmiti-text-overflow">{{userinfo.nickname}}</span>
                   <div title='退出' @click="logout">
                       <img :src="imgs.logout" alt="">
                   </div>
               </div>
            </Header>
            <Layout class="wm-main-layout">
                <div class="wm-tab-C" :style='{height:(viewH - 64- 10)+"px"}'>
                   <div>
                      <Menu width='300' :open-names="['1']"  >
                            <Submenu name="1">
                                <template slot="title">
                                    <Icon type="ios-paper" />
                                    我的上报
                                </template>
                                    <MenuItem to='/myreport/' :class='{"ivu-menu-item-active ivu-menu-item-selected":$route.name === "myreport"}' :key='i' v-for="(item,i) in sourceList" :name="item.resourceid">{{item.resourcecnname}}
                                    </MenuItem>
                            </Submenu>
                             <Submenu name="2">
                                <template slot="title">
                                    <Icon type="ios-paper" />
                                    我的
                                </template>
                                     <MenuItem to='/user/' name="13">个人中心 </MenuItem>
                            </Submenu>
                           
                        </Menu>
                   </div>
                </div>
                <Layout>
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
                tabIndex:0,
                userinfo:{},
                sourceList:[],
                kw:"",
                topMenu:[
                ],
                defaultMenu:[
                  
                ],
                menus:[]
			}
		},
		components:{
		},
        beforeCreate(){
                this.validateData = sysbinVerification.validate(this);
            if(this.$route.name !== 'login' && this.$route.name !== 'register'){
            }

        },
		mounted(){
           ///this.menus = this.defaultMenu.concat([]);
            var obserable = Vue.obserable;
            
            var userinfo = symbinUtil.getUserInfo();

            this.userinfo = userinfo; 
            if(this.$route.name !== 'login' && this.$route.name !== 'register'){
                this.getSourceList();
            }
            
        },
        watch:{
            kw(val){
                var s = this;
                Vue.obserable.trigger({
                    type:"searchReport",
                    data:val
                });
            }
        },
		methods:{
            logout(){
                var s = this;
                
                symbinUtil.ajax({
                    _this:s,
                    url:window.config.baseUrl+'/zmitiadmin/exitlogin',
                    data:{
                        username:s.userinfo.username,
                        accesstoken:s.userinfo.accesstoken
                    },
                    success(data){
                        if(data.getret === 0){
                            s.$Message.success('注销成功');
                            setTimeout(() => {
                                window.location.hash = '#/login';
                            }, 500);
                        }
                        else{
                            s.$Message.error('注销失败');
                        }
                    }
                })
            },
            tab(index){
                this.tabIndex = index;
            },
            getSourceList(){
      			var s = this;
                return;
                var {obserable} = Vue;
      				
                symbinUtil.ajax({
                    _this:s,
                    url:window.config.baseUrl+'/wmadvuser/getsourcelist/',
                    data:{
                        username:s.userinfo.username,
                        usertoken:s.userinfo.accesstoken
                    },
                    success(data){
                        if(data.getret === 0){
                                s.sourceList = data.list;
                                obserable.on("getCurrentSourceId",()=>{
                                    return data.list[0].resourceid;
                                })
                                obserable.on("getFeildList",()=>{
                                    return JSON.parse(data.list[0].tablefield).fieldlist;
                                })
                            }
                    }
                })
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