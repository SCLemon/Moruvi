<template>
  <div>
    <div class="form">
        <div class="form-item"><div class="form-input-title">ID：</div><input class="input" placeholder="房間 ID" @click="copyId()" readonly :value="form.roomId"></div>
        <div class="form-item"><div class="form-input-title">房名：</div><input class="input" placeholder="請輸入房間名稱" v-model="form.roomName"></div>
        <div class="form-item"><div class="form-input-title">狀態：
        </div>
            <el-radio-group v-model="form.locked">
                <el-radio-button :label="false">允許申請</el-radio-button>
                <el-radio-button :label="true">鎖定房間</el-radio-button>
            </el-radio-group>
        </div>
        <div class="form-item">
            <div class="form-input-title">用量：</div>
            <div class="form-memory"> {{form.memory.usage}} MB / {{ form.memory.limit }} MB</div>
        </div>
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
    name: 'HomeSetting',
    data(){
      return {
        uploadStatus:{
          uploading: false,
          status: ''
        },
        form:{
            roomId:'',
            roomName:'',
            locked: true,
            memory:{
                usage: 0,
                limit: 0,
            }
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
      copyId(){
        try{
          navigator.clipboard.writeText(this.form.roomId);
          this.$bus.$emit('handleAlert','系統訊息', '房間 ID 已複製到剪貼簿，請將此 ID 發送給對方以建立連結','success');
        }
        catch(e){
          this.$bus.$emit('handleAlert','邀請碼', this.form.roomId,'success');
        }
      },
      async getData(){
        try{
          const res = await axios.get('/api/homeSetting/getData',{
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
          const res = await axios.put('/api/homeSetting/modifyData',this.form,{
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
  .form-memory{
    color: rgba(210,210,210);
    font-size: 14px;
    margin-right: 5px;
  }
  .button-wrapper{
    width: 100%;
    margin: 0 auto;
    padding-left: 12.5px;
    padding-right: 12.5px;
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
  :deep(.el-radio-button__orig-radio:checked+.el-radio-button__inner){
    background-color: pink;
    border-color: pink;
    box-shadow: -1px 0 0 0 pink;
  }
</style>