<template>
  <div>
    <div class="form">
      <div class="form-item"><div class="form-input-title">帳號：</div><input class="input" disabled placeholder="請輸入帳號" :value="form.account"></input></div>
      <div class="form-item"><div class="form-input-title">密碼：</div><input class="input" type="password" placeholder="請輸入密碼" v-model="form.password"></input></div>
      <div class="form-item"><div class="form-input-title">暱稱：</div><input class="input" placeholder="請輸入暱稱" v-model="form.name"></input></div>
      <div class="form-item"><div class="form-input-title">信箱：</div><input class="input" placeholder="請輸入信箱地址" v-model="form.mailAddress"></input></div>
    </div>
    <div class="button-wrapper">
        <button :class="{'send-button': true, 'send-button-enabled': sendEnabled && !uploadStatus.uploading}" @click="uploadStatus.uploading?'':modify()">{{ uploadStatus.uploading ? uploadStatus.status : '保存' }}</button>
    </div>
  </div>
  
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
export default {
    name: 'MyInfo',
    data(){
      return {
        uploadStatus:{
          uploading: false,
          status: ''
        },
        form:{
          account:'',
          password:'',
          name:'',
          mailAddress:'',
        }
      }
    },
    computed:{
      sendEnabled(){
        return !(Object.values(this.form).some(value => value == null || String(value).trim() === ''));
      }
    },
    async mounted(){
      await this.getData();
    },
    methods:{
      async getData(){
        try{
          const res = await axios.get('/api/myInfo/getData',{
            headers:{
              'x-user-token': jsCookie.get('authToken')
            }
          });
          if(res.data.type == 'error'){
            this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
          }
          else this.form = res.data.data
        }catch(e){}  
      },
      async modify(){
        this.uploadStatus.status = '執行中...'
        this.uploadStatus.uploading = true;
        try{
          const res = await axios.put('/api/myInfo/modifyData',this.form,{
            headers:{
              'x-user-token': jsCookie.get('authToken')
            },
            onUploadProgress:(progressEvent) => {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              this.uploadStatus.status = percent + '%';
            },
          });
          if(res.data.type == 'success'){
            await this.getData();
          }
          this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
        }
        catch(e){}
        finally{
          this.uploadStatus.uploading = false;
          this.uploadStatus.status = ''
        }
      }
    }
}
</script>

<style scoped>
  .form{
    padding-top: 20px;
  }
  .form-item{
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    margin-bottom: 20px;
  }
  .form-input-title{
    width: 60px;
  }
  .input{
    width: calc(100% - 70px);
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
  .button-wrapper{
    width: 100%;
    margin: 0 auto;
    padding-left: 15px;
    padding-right: 15px;
    box-sizing: border-box;
  }
  .send-button{
    width: 100%;
    margin-top: 5px;
    background-color: pink;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: not-allowed;
    height: 40px;

  }
  .send-button-enabled{
    background-color: #ff7ea3;
    cursor: pointer;
  }
</style>