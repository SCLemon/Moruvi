<template>
    <div>
        <div class="header">
            <div class="header-back" @click="goBack()"><i class="el-icon-arrow-left"></i></div>
            <div class="header-title">{{ editMode ? '新增商品': '商品內容' }}</div>
        </div>
        <div class="form-wrapper">
            <div class="form-title-box"><span class="form-flag">商品</span><input class="form-title-input" v-model="form.title" placeholder="請輸入商品名稱"></input></div>
            <div class="form-content-flag">商品內容</div>
            <div class="form-content" contenteditable="true" ref="form-content" placeholder="請輸入商品內容" @input="handleInput($event)"></div>
            <div class="form-title-box form-money-box"><span class="form-flag">金額</span><input type="number" class="form-title-input" v-model="form.money" placeholder="請輸入金幣數量"></input></div>
            <div class="button-wrapper" v-if="editMode">
                <button :class="{'send-button': true, 'send-button-enabled': sendEnabled && !uploadStatus.uploading}" @click="(sendEnabled && !uploadStatus.uploading)?postPrize():''">新增商品</button>
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
            editMode: false,
            uploadStatus:{
                uploading: false,
                status: ''
            },
            form:{
                title:'',
                description:'',
                money: null,
            }
        }
    },
    computed:{
      sendEnabled(){
        return !(Object.values(this.form).some(value => value == null || String(value).trim() === '')) && (this.$refs['form-content']?.innerText.trim()!='');
      },
    },
    async mounted(){
        const { itemId } = this.$route.params;
        if(itemId){
            await this.getData(itemId);
            this.editMode = false;
        }
        else this.editMode = true;
    },
    methods:{
        async getData(itemId){
            try{
                const res = await axios.get(`/api/prize/getSpecificPrize/${itemId}`,{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                if(res.data.type == 'error'){
                    this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
                }
                else {
                    this.form = res.data.data
                    this.$refs['form-content'].innerHTML = res.data.data.description;
                }
            }catch(e){}  
        },
        goTo(path) {
            this.$router.replace(path).catch((e)=>{});
        },
        goBack(){
            const from = this.$route.query.from;
            this.goTo('/moruvi/mission/'+from +'?isMineList=true');
        },
        handleInput(event){
            const target = event.target;
            if(target.innerText.trim() == '') target.innerHTML = '';
            this.form.description = event.target.innerHTML;
        },
        async postPrize(){
            try{
                const res = await axios.post('/api/prize/postPrize',this.form,{
                    headers:{
                    'x-user-token': jsCookie.get('authToken')
                    }
                });
                if(res.data.type == 'success'){
                   this.goTo('/moruvi/mission/prize-list?isMineList=true');
                }
                this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
            }catch(e){}   
        },
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
        overflow-y: scroll;
    }
    .form-title-box{
        width: 100%;
        height: 40px;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid pink;   
    }
    .form-money-box{
        margin-top: 10px;
        border-bottom: none;
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
        max-height: calc(100vh - 370px);
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