<template>
    <div>
        <div class="header">
            <div class="header-back" @click="goTo('/moruvi/home')" v-if="$route.path.includes('/sendMessage')"><i class="el-icon-arrow-left"></i></div>
            <div class="header-title">發送訊息</div>
        </div>
        <div class="form-wrapper">
            <div class="form-title-box"><span class="form-flag">主旨</span><input class="form-title-input" v-model="form.title" placeholder="請輸入信件標題"></input></div>
            <div class="form-content-flag">內文</div>
            <div class="form-content" contenteditable="true" ref="form-content" placeholder="請輸入信件內容" @input="handleInput($event)"></div>
            <div class="button-wrapper">
                <button :class="{'send-button': true, 'send-button-enabled': sendEnabled && !uploadStatus.uploading}" @click="(sendEnabled && !uploadStatus.uploading)?send():''">送出</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
export default {
    name: 'SendMessage',
    data(){
        return {
            uploadStatus:{
                uploading: false,
                status: ''
            },
            form:{
                title:'',
                content:''
            }
        }
    },
    computed:{
      sendEnabled(){
        return !(Object.values(this.form).some(value => value == null || String(value).trim() === '')) && (this.$refs['form-content']?.innerText.trim()!='');
      },
    },
    methods:{
        goTo(path) {
            this.$router.replace(path).catch((e)=>{});
        },
        handleInput(event){
            const target = event.target;
            if(target.innerText.trim() == '') target.innerHTML = '';
            this.form.content = event.target.innerHTML;
        },
        async send(){
            try{
                const res = await axios.post('/api/notify/sendMessage', this.form, {
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                })
                this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
                if(res.data.type == 'success') this.goTo('/moruvi/home');
            }
            catch(e){}
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
    .form-wrapper{
        width: 100%;
        height: calc(100vh - 140px);
        padding-left: 20px;
        padding-right: 20px;
        box-sizing: border-box;
    }
    .form-title-box{
        width: 100%;
        height: 40px;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid pink;
        
    }
    .form-flag{
        font-size: 14px;
        margin-right: 10px;
        width: 50px;
    }
    .form-title-input{
        width: calc(100% - 75px);
        height: 40px;
        border: none;
        box-sizing: border-box;
        outline: none;
        font-size: 14px;
    }
    .form-content-flag{
        margin-bottom: 15px;
        font-size: 14px;
    }
    .form-content{
        width: 100%;
        min-height: 100px;
        max-height: calc(100vh - 320px);
        border: 1px solid pink;
        box-sizing: border-box;
        overflow-y: scroll;
        outline: none;
        padding: 7.5px;
        font-size: 14px;
        line-height: 1.5;
    }
    .form-content:empty::before{
        content: attr(placeholder);
        color: #999;
        pointer-events: none;
    }
    .button-wrapper{
        width: 100%;
        margin: 0 auto;
    }
    .send-button{
        width: 100%;
        margin-top: 20px;
        background-color: pink;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        height: 40px;
    }
    .send-button-enabled{
        background-color: #ff7ea3;
        cursor: pointer;
    }
</style>