<template>
  <div>
    <div class="header">
        <div class="header-back" @click="goTo('/moruvi/notification')" v-if="$route.path.includes('/detail')"><i class="el-icon-arrow-left"></i></div>
        <div class="header-title">動態通知</div>
    </div>
    <router-view class="router-view"></router-view>
  </div>
</template>

<script>
export default {
    name: 'Notification',
    methods:{
        goTo(path){
            this.$router.replace(path).catch((e)=>{})
        }
    }
}
</script>

<style scoped>
    .header{
        width: 100%;
        height: 60px;
        box-sizing: border-box;
        box-sizing: border-box;
        position: relative;
    }
    .header-back{
        position: absolute;
        top:0;
        left: 0px;
        height: 60px;
        width: 60px;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .header-title{
        font-size: 18px;
        text-align: center;
        line-height: 60px;
    }
    .router-view{
        width: 100%;
        height: calc(100vh - 140px);
        box-sizing: border-box;
        overflow-y: scroll;
    }
</style>