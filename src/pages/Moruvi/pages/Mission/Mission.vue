<template>
  <div class="wrapper">
    <div class="user-wrapper">
      <img :src="userInfo.userImgUrl" alt="" class="user-avator">
      <div class="user-info-wrapper">
        <div class="user-info-name">{{ userInfo.name }}</div>
        <div class="user-info-money">{{ userInfo.money }} 金幣</div>
      </div>
      <div class="user-bagpack-wrapper">
        <i class="fa-solid fa-wallet"></i>
      </div>
    </div>
    <div class="options-wrapper">
      <div :class="{option: true, 'option-selected': $route.path.includes('/moruvi/mission/mission-list') }" @click="goTo('/moruvi/mission/mission-list')">任務接取</div>
      <div :class="{option: true, 'option-selected': $route.path.includes('/moruvi/mission/get-mission-list')}" @click="goTo('/moruvi/mission/get-mission-list')">我的任務</div>
      <div :class="{option: true, 'option-selected': $route.path.includes('/moruvi/mission/prize-list')}" @click="goTo('/moruvi/mission/prize-list')">兌換獎勵</div>
      <div :class="{option: true, 'option-selected': $route.path.includes('/moruvi/mission/get-purchase-list')}" @click="goTo('/moruvi/mission/get-purchase-list')">我的背包</div>
    </div>
    <router-view class="router-view"></router-view>
  </div>
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
export default {
    name: 'Mission',
    data(){
      return {
        userInfo:{
          name:'',
          userImgUrl:'img/user.png',
          money:0
        }
      }
    },
    async mounted(){
      await this.getData();
      this.$bus.$on('refreshUserMoney', this.getData)
    },
    methods:{
      goTo(path) {
        this.$router.replace(path).catch((e)=>{});
      },
      async getData(){
        try{
          const res = await axios.get('/api/prize/getUserInfo',{
            headers:{
              'x-user-token': jsCookie.get('authToken')
            }
          });
          if(res.data.type == 'error'){
            this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
          }
          else this.userInfo = res.data.data
        }catch(e){}  
      },
    }
}
</script>

<style scoped>
  .wrapper{
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    box-sizing: border-box;
  }
  .user-wrapper{
    width: 100%;
    height: 100px;
    margin: 0 auto;
    margin-top: 20px;
    box-shadow: 0 0 6px rgba(210,210,210);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .user-avator{
    width: 75px;
    height: 75px;
    border-radius: 50%;
    border: 0.1px solid rgba(0,0,0,0.3);
    box-sizing: border-box;
  }
  .user-info-wrapper{
    width: calc(100% - 210px);
    height: 100px;
    margin-left: 7.5px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .user-info-name{
    font-size: 18px;
    font-weight: bolder;
    margin-bottom: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: justify;
    overflow: hidden;
  }
  .user-info-money{
    font-size: 14px;
    color: pink;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: justify;
    overflow: hidden;
  }
  .user-bagpack-wrapper{
    width: 75px;
    height: 75px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    color: pink;
  }
  .options-wrapper{
    width: 100%;
    height: 40px;
    margin-top: 15px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .option{
    width: 24%;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .option-selected{
    color: pink;
    border-bottom: 3px solid pink;
    box-sizing: border-box;
  }
  .router-view{
    width: 100%;
    height: calc(100vh - 195px);
    box-sizing: border-box;
    overflow-y: scroll;
  }
</style>