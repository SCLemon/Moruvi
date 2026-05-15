<template>
  <div>
    <div class="header">
      <div class="header-title" @click="toggleLock()">戀愛日誌 <i :class="`fa-solid fa-${roomInfo.locked ? 'lock' : 'unlock'} lock-icon`"></i></div>
      <div class="header-list-add" @click="goTo('/moruvi/home-modifier')"><i class="el-icon-plus"></i></div>
    </div>
    <div class="first-content">
      <div class="first-content-box-wrapper">
        <div class="first-content-box">
          <div class="first-content-user-wrapper">
            <img class="first-content-user-avator" :src="roomInfo.owners[0]?.userImgUrl || 'img/user.png'" alt="">
            <div class="first-content-user-name">{{ roomInfo.owners[0]?.name }}</div>
          </div>
          <i class="fa-solid fa-heart first-content-user-heart"></i>
          <div class="first-content-user-wrapper" @click="togglePartnerOptions()">
            <img v-if="roomInfo.owners[1]" class="first-content-user-avator" :src="roomInfo.owners[1]?.userImgUrl || 'img/user.png'" alt="">
            <div v-else class="first-content-user-avator first-content-user-avator-unknown">
              <i class="fa-solid fa-plus"></i>
            </div>
            <div class="first-content-user-name">{{ roomInfo.owners[1]?.name || '尋覓良緣' }}</div>
            <div class="first-content-partner-options" v-if="showPartnerOptions">
              <div :class="{'first-content-partner-options-item': true, 'first-content-partner-options-item-disabled': roomInfo.owners[1]}" @click.stop="handlePartnerOption('invite')"><i class="fa-solid fa-plus first-content-partner-options-item-icon"></i> 發出邀請</div>
              <div :class="{'first-content-partner-options-item': true, 'first-content-partner-options-item-disabled': !roomInfo.owners[1]}" @click.stop="handlePartnerOption('poke')"><i class="fa-solid fa-bell first-content-partner-options-item-icon"></i> 戳戳對方</div>
              <div :class="{'first-content-partner-options-item': true, 'first-content-partner-options-item-disabled': !roomInfo.owners[1]}" @click.stop="handlePartnerOption('message')"><i class="fa-solid fa-envelope first-content-partner-options-item-icon"></i> 傳送訊息</div>
              <div :class="{'first-content-partner-options-item': true, 'first-content-partner-options-item-disabled': !roomInfo.owners[1]}" @click.stop="handlePartnerOption('disconnect')"><i class="fa-solid fa-trash first-content-partner-options-item-icon" style="margin-right: 7px;"></i> 解除關係</div>
            </div>
          </div>
        </div>
        <div class="first-content-text">
          我們的羈絆長達 <span class="first-content-text-large">{{ totalDays }}</span> 天
        </div>
      </div>
    </div>
    <div class="list-wrapper" v-if="list.length">
      <div class="list-item" v-for="(i,id) in list" :key="id" @click="openEdit(i)">
        <div class="list-item-icon"><i :class="icons[i.icon] || 'fa-solid fa-heart'"></i></div>
        <div class="list-item-content">
          <div class="list-item-event">{{i.event}}</div>
          <div class="list-item-date">{{i.date}}</div>
        </div>
        <div class="list-item-day"><span class="list-item-day-large">{{i.deltaDays}}</span> 天</div>
      </div>
    </div>
    <div class="list-wrapper list-wrapper-empty" v-else>
      <el-empty description="篇章未開"></el-empty>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';

export default {
    name: 'Home',
    data(){
      return{
        showPartnerOptions: false,
        roomInfo:{
          roomId:'',
          owners:[]
        },
        list:[],
        icons:[
            'fa-solid fa-user-group',
            'fa-regular fa-envelope',
            'fa-regular fa-heart',
            'fa-regular fa-star',
            'fa-regular fa-face-smile',
            'fa-regular fa-calendar',
            'fa-regular fa-map',
            'fa-solid fa-utensils',
            'fa-solid fa-champagne-glasses',
            'fa-solid fa-medal',
            'fa-solid fa-venus-mars',
            'fa-solid fa-person-pregnant',
            'fa-solid fa-baby'
        ]
      }
    },
    computed:{
      totalDays(){
        if(this.list.length === 0) return 0;
        const firstDate = new Date(this.list[0].date);
        const now = new Date();
        return Math.floor((now - firstDate) / (1000 * 60 * 60 * 24));
      }
    },
    async mounted(){
      await this.getData();
      await this.getRoomInfo();
    },
    methods: {
      // 通用操作
      goTo(path) {
        this.$router.replace(path).catch((e)=>{});
      },
      openEdit(item){
        this.goTo(`/moruvi/home-modifier?item=${JSON.stringify(item)}`);
      },

      // 汲取資料
      async getData(){
        try{
          const res = await axios.get('/api/milestone/getData',{
            headers:{
              'x-user-token': jsCookie.get('authToken')
            }
          });
          if(res.data.type == 'error'){
            this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
          }
          else{
            res.data.data.forEach(item => {
              item.deltaDays = Math.floor(
                  (new Date() - new Date(item.date)) / (1000 * 60 * 60 * 24)
              );
            });
            this.list = res.data.data;
          }
        }catch(e){}  
      },
      async getRoomInfo(){
        try{
          const res = await axios.get('/api/milestone/getRoomInfo',{
            headers:{
              'x-user-token': jsCookie.get('authToken')
            }
          });
          if(res.data.type == 'error'){
            this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
          }
          else{
            this.roomInfo = res.data.data;
          }
        }
        catch(e){
          console.log(e)
        }
      },

      // 鎖定/解鎖房間
      async toggleLock(){
        try{
          const res = await axios.put('/api/milestone/toggleLock',{},{
            headers:{
              'x-user-token': jsCookie.get('authToken')
            }
          });
          if(res.data.type == 'error'){
            this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
          }
          await this.getRoomInfo();
        }
        catch(e){
          console.log(e)
        }
      },

      // 夥伴選項
      togglePartnerOptions(){
        this.showPartnerOptions = !this.showPartnerOptions;
      },
      async handlePartnerOption(option){
        switch(option){
          case 'invite':
            // 發出邀請
            if(this.roomInfo.owners.length >= 2) return;
            this.invite();
            break;
          case 'poke':
            // 戳戳對方
            if(this.roomInfo.owners.length < 2) return;
            await this.poke();
            break;
          case 'message':
            // 傳送訊息
            if(this.roomInfo.owners.length < 2) return;
            break;
          case 'breakup':
            // 解除關係
            if(this.roomInfo.owners.length < 2) return;
            break;
        }
      },
      invite(){
        try{
          if(navigator.share){
            navigator.share({
              title: '【Moruvi 戀愛日誌邀請】',
              text: `\n我邀請你加入我的 Moruvi 戀愛日誌，讓我們一起記錄美好的回憶！\n\n邀請連結：${window.location.origin}/#/login?roomId=${this.roomInfo.roomId}\n\n點擊此連結並完成註冊即可加入！`,
            }).then(() => {}).catch((e) => {});
          }
          else{
            navigator.clipboard.writeText(this.roomInfo.roomId);
            this.$bus.$emit('handleAlert','系統訊息', '房間 ID 已複製到剪貼簿，請將此 ID 發送給對方以建立連結','success');
          }
        }
        catch(e){
          this.$bus.$emit('handleAlert','邀請碼', this.roomInfo.roomId,'success');
        }
        this.showPartnerOptions = false;
      },
      async poke(){
        try{
          const res = await axios.get('/api/notify/poke',{
            headers:{
              'x-user-token': jsCookie.get('authToken')
            }
          });
          if(res.data.type == 'error'){
            this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
          }
          else this.$bus.$emit('handleAlert','戳戳對方', '您成功戳了對方一下 🥰🥰', 'success');
        }
        catch(e){
          console.log(e)
        }
        this.showPartnerOptions = false;
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
  .header-title{
    font-size: 18px;
    text-align: center;
    line-height: 60px;
  }
  .lock-icon{
    font-size: 10px;
    color: rgb(215,215,215);
    margin-left: 5px;
  }
  .header-list-add{
    position: absolute;
    top:0;
    right: 0px;
    height: 60px;
    width: 60px;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .first-content{
    width: 95%;
    aspect-ratio: 16/9;
    margin: 0 auto;
    margin-top: 5px;
    border-radius: 15px;
    background-image: url(../../../../../public/img/home/love.jpg);
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .first-content-box-wrapper{
    width: 65%;
    box-sizing: border-box;
    margin: 0 auto;
  }
  .first-content-box{
    width: 100%;
    display: flex;
    justify-content: space-evenly;
  }
  .first-content-user-wrapper{
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }
  .first-content-user-avator{
    width: 75px;
    height: 75px;
    border-radius: 50%;
    box-sizing: border-box;
    background-color: white;
    overflow: hidden;
  }
  .first-content-user-avator-unknown{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: rgb(170,170,170);
    background-color: rgba(255,255,255,0.2);
  }
  .first-content-user-name{
    font-size: 12px;
    color: white;
    margin-top: 6px;
    text-align: center;
  }
  .first-content-user-heart{
    height: 75px;
    line-height: 75px;
    font-size: 18px;
    color: white;
  }
  .first-content-partner-options{
    position: absolute;
    top: 42.5px;
    left: 42.5px;
    width: 100px;
    font-size: 12px;
    cursor: pointer;
    background: white;
  }
  .first-content-partner-options-item{
    width: 100%;
    height: 32px;
    line-height: 32px;
    text-align: center;
  }
  .first-content-partner-options-item-disabled{
    color: rgb(200,200,200);
    cursor: not-allowed;
  }
  .first-content-partner-options-item-icon{
    margin-right: 5px;
  }
  .first-content-text{
    width: 100%;
    text-align: center;
    font-size: 18px;
    color: white;
    margin-top: 20px;
  }
  .first-content-text-large{
    font-size: 28px;
    font-weight: bold;
  }
  .list-wrapper{
    width:95%;
    margin: 0 auto;
    margin-top: 5px;
    height: calc(100vh - 360px);
    box-sizing: border-box;
    overflow-y: scroll;
  }
  .list-wrapper-empty{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .list-item{
    width: 100%;
    height: 80px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
  }
  .list-item-icon{
    width: 60px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: rgb(247, 134, 152);
  }
  .list-item-content{
    width: calc(100% - 160px);
    padding-left: 10px;
    height: 80px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .list-item-event{
    font-size: 16px;
    margin-bottom: 10px;
  }
  .list-item-date{
    font-size: 12px;
    color: #999;
  }
  .list-item-day{
    width: 100px;
    height: 80px;
    box-sizing: border-box;
    display: flex;
    justify-content: right;
    margin-right: 10px;
    align-items: center;
  }
  .list-item-day-large{
    font-size: 24px;
    margin-right: 7.5px;
    color: rgb(247, 134, 152);
  }

</style>