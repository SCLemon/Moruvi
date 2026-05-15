import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false

// Element UI 組件
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);

import {
  Icon, Carousel, CarouselItem, Notification, MessageBox, DatePicker, 
  Input, Empty, Radio, RadioButton, RadioGroup
} from 'element-ui'


Vue.prototype.$notify = Notification
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt

Vue.use(Icon)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(DatePicker)
Vue.use(Input)
Vue.use(Empty)
Vue.use(Radio)
Vue.use(RadioButton)
Vue.use(RadioGroup)

// v-lazy
Vue.directive('lazy', {
  inserted(el) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.src = el.dataset.src 
        observer.unobserve(el)
      }
    }, { threshold: 0.1 })

    observer.observe(el)
  }
})

new Vue({
  render: h => h(App),
  router,
  beforeCreate(){
    // 全局事件總線
    Vue.prototype.$bus = this;
  } 
}).$mount('#app')