import Vue from 'vue'
import VueRouter from 'vue-router'
import jsCookie from 'js-cookie'
import axios from 'axios'

import Index from '../pages/Index/Index.vue'

Vue.use(VueRouter)
const router = new VueRouter({
    routes:[
        {
            path:'/',
            component:Index,
        },
        // 不存在的路徑 → 直接跳轉
        {
            path: '*',
            redirect: '/'
        }
    ]
})
router.beforeEach(async (to, from, next) => {

    return next();
});

export default router