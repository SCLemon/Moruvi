<template>
  <div class="view">
    <div class="form_wrapper">
        <div class="banner" @click="goTo('/')">
          <img src="logo/full_logo_white.png" alt="">
        </div>
        <div class="normalForm">
          <div class="login"><div class="login_text">帳號：</div><input class="input" placeholder="請輸入帳號" v-model="loginData.account"></input></div>
          <div class="login"><div class="login_text">密碼：</div><input class="input" type="password" placeholder="請輸入密碼" v-model="loginData.password"></input></div>
          <div class="btn_wrapper">
            <button class="btn" @click="challenge('register')">會員註冊</button>
            <button class="btn" @click="challenge('login')">會員登入</button>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name:'Login',
  data(){
    return {
      text:'',
      loginData:{
        account:'',
        password:'',
      },
    }
  },
  mounted(){
  },
  methods:{

    async challenge(type){

      let url;
      if(type == 'register') url = '/login/register'
      else if(type == 'login') url = '/login/verify'
      else  window.location.reload();

      let data;
      if(Object.values(this.loginData).some(value => value === null || value === undefined || value.trim() === '')){
          return this.$bus.$emit('handleAlert','系統訊息','輸入資料不可為空。','error')
      }
      try{
        const res = await axios.post(url,this.loginData)

        data = res.data;

        if(data.type == 'success'){
          this.$router.replace('/moruvi').catch((e)=>{})
        }
      }
      catch(e){}
      finally{
        this.$bus.$emit('handleAlert','系統訊息',data.message,data.type)
      }
    },

    goTo(path){
      this.$router.push(path).catch((e)=>{})
    },
  }
}
</script>

<style scoped>
  .view{
    width: 100vw;
    height: 100vh;
    padding-left: 50px;
    padding-right: 50px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .banner{
    width: 100%;
    margin: 0 auto;
    display: block;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .banner>img{
    max-width: 100%;
    max-height: 100%;
  }
  .banner:hover{
    cursor: pointer;
  }
  .form_wrapper{
    width: 100%;
    height: auto;
    box-sizing: border-box;
  }
  .normalForm{
    width: 100%;
    height: 338px;
    margin-top: 20px;
    box-sizing: border-box;
  }
  .login_text{
    line-height: 3;
  }
  .input{
    width: 100%;
    height: 40px;
    padding: 0 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 15px;
    color: rgba(0,0,0,0.5);
  }
  .input:focus{
    outline: none;
  }
  .input::placeholder{
    font-size: 14px;
  }
  .btn_wrapper{
    margin-top: 35px;
    float: right;
  }
  .btn{
    margin-left: 10px;
    text-align: center;
    line-height: 30px;
    padding-left: 10px;
    padding-right: 10px;
    border: none;
  }
</style>