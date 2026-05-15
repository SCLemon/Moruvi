<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { registerServiceWorker } from './service-worker/main'
import jsCookie from 'js-cookie'
import axios from 'axios'
export default {
  name: 'App',
  data(){
    return {
      subscribedTriggered: false,
    }
  },
  async mounted(){
    this.$bus.$on('handleAlert',this.handleAlert)
    this.$bus.$on('copyToClipboard',this.copyToClipboard)

    await this.generateFingerprint();
    registerServiceWorker();
  },
  methods:{
    handleAlert(title,message,type){
      // success, warning, info, error
      this.$notify({title,message,type});
    },
    copyToClipboard(title, text) {
      if (!text) return;
      navigator.clipboard.writeText(text)
      .then(() => {
        this.$bus.$emit('handleAlert',title,'已複製到剪貼簿','success');
      })
      .catch(() => {});
    },
  }
}
</script>

<style>
  ::-webkit-scrollbar{
    display: none;
  }
  #app {
    overflow: hidden;
  }
  .PWACSS_MessageBox{
    width: 85vw !important;
  }
  @font-face {
    font-family: "element-icons";
    src: url("~element-ui/lib/theme-chalk/fonts/element-icons.woff") format("woff");
    font-display: swap;
  }
</style>

