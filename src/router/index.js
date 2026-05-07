import Vue from 'vue'
import VueRouter from 'vue-router'
import jsCookie from 'js-cookie'
import axios from 'axios'

import Index from '../pages/Index/Index.vue'
import Login from '../pages/Login/Login.vue'

import Moruvi from '@/pages/Moruvi/Moruvi.vue'
import Overview from '../pages/Moruvi/pages/Overview/Overview.vue'


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
                    path:'overview',
                    component: Overview,
                },
                {
                    path:'/',
                    redirect:'overview'
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
    if (!token) {
        return next('/login')
    }
    
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