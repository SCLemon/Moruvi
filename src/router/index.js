import Vue from 'vue'
import VueRouter from 'vue-router'
import jsCookie from 'js-cookie'
import axios from 'axios'

import Index from '../pages/Index/Index.vue'
import Login from '../pages/Login/Login.vue'

import Moruvi from '@/pages/Moruvi/Moruvi.vue'
import Home from '../pages/Moruvi/pages/Home/Home.vue'
import HomeModifier from '../pages/Moruvi/pages/HomeModifier/HomeModifier.vue'
import More from '../pages/Moruvi/pages/More/More.vue'

import MyInfo from '@/pages/Moruvi/pages/More/pages/MyInfo/MyInfo.vue'
import HomeSetting from '@/pages/Moruvi/pages/More/pages/HomeSetting/HomeSetting.vue'
import PrivateSetting from '@/pages/Moruvi/pages/More/pages/PrivateSetting/PrivateSetting.vue'
import ProgramInfo from '@/pages/Moruvi/pages/More/pages/ProgramInfo/ProgramInfo.vue'

import Notification from '@/pages/Moruvi/pages/Notification/Notification.vue'
import List from '@/pages/Moruvi/pages/Notification/pages/List/List.vue'
import Detail from '@/pages/Moruvi/pages/Notification/pages/Detail/Detail.vue'
import SendMessage from '@/pages/Moruvi/pages/SendMessage/SendMessage.vue'

Vue.use(VueRouter)
const router = new VueRouter({
    routes:[
        {
            path:'/',
            component:Index,
        },
        {
            path:'/login',
            component:Login,
        },
        {
            path:'/moruvi',
            component:Moruvi,
            children:[
                {
                    path:'home',
                    component: Home,
                },
                {
                    path:'home-modifier',
                    component: HomeModifier,
                },
                {
                    path:'sendMessage',
                    component: SendMessage,
                },
                {
                    path:'more',
                    component: More,
                    children:[
                        {
                            path:'my-info',
                            component: MyInfo,
                        },
                        {
                            path:'home-setting',
                            component: HomeSetting,
                        },
                        {
                            path:'private-setting',
                            component: PrivateSetting,
                        },
                        {
                            path:'program-info',
                            component: ProgramInfo,
                        },
                        {
                            path:'/',
                            redirect:'my-info'
                        },
                    ]
                },
                {
                    path:'notification',
                    component: Notification,
                    children:[
                        {
                            path:'',
                            component: List,
                        },
                        {
                            path:'detail/:idx',
                            component: Detail,
                        }
                    ]
                },
                {
                    path:'/',
                    redirect:'home'
                },
            ]
        },
        // 不存在的路徑 → 直接跳轉
        {
            path: '*',
            redirect: '/'
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const token = jsCookie.get('authToken')
    
    // 通用驗證
    const allowedPaths = ['/', '/login'];
    if (allowedPaths.includes(to.path)) {
        return next()
    }
    
    if (!token) return next('/login')
    
    const res = await axios.post('/login/token',{save:false},{
        headers:{
            'x-user-token':token,
        }
    })

    if(res.data.type !== 'success'){
        jsCookie.remove('authToken')
        return next('/login')
    }

    return next();
});

export default router