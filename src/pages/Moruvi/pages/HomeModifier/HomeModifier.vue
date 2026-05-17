<template>
    <div>
        <div class="header">
            <div class="header-list-back" @click="goTo('/moruvi/home')"><i class="el-icon-arrow-left"></i></div>
            <div class="header-title">日誌記錄</div>
        </div>
        <div class="form">
            <div class="form-date"><span class="form-flag">日期：</span><el-date-picker v-model="form.date" type="date" placeholder="選擇日期"></el-date-picker></div>
            <div class="form-event"><span class="form-flag">事件：</span><el-input class="form-event-input" v-model="form.event" placeholder="輸入事件"></el-input></div>
        </div>
        <div class="icon-title">顯示圖標</div>
        <div class="icon-grid">
            <div :class="{'icon-item':true, 'icon-item-selected':form.icon===0}" @click="form.icon=0"><i class="fa-solid fa-user-group"></i></div>
            <div :class="{'icon-item':true, 'icon-item-selected':form.icon===1}" @click="form.icon=1"><i class="fa-regular fa-envelope"></i></div>
            <div :class="{'icon-item':true, 'icon-item-selected':form.icon===2}" @click="form.icon=2"><i class="fa-regular fa-heart"></i></div>
            <div :class="{'icon-item':true, 'icon-item-selected':form.icon===3}" @click="form.icon=3"><i class="fa-regular fa-star"></i></div>
            <div :class="{'icon-item':true, 'icon-item-selected':form.icon===4}" @click="form.icon=4"><i class="fa-regular fa-face-smile"></i></div>
            <div :class="{'icon-item':true, 'icon-item-selected':form.icon===5}" @click="form.icon=5"><i class="fa-regular fa-calendar"></i></div>
            <div :class="{'icon-item':true, 'icon-item-selected':form.icon===6}" @click="form.icon=6"><i class="fa-regular fa-map"></i></div>
            <div :class="{'icon-item':true, 'icon-item-selected':form.icon===7}" @click="form.icon=7"><i class="fa-solid fa-utensils"></i></div>
            <div :class="{'icon-item':true, 'icon-item-selected':form.icon===8}" @click="form.icon=8"><i class="fa-solid fa-champagne-glasses"></i></div>
            <div :class="{'icon-item':true, 'icon-item-selected':form.icon===9}" @click="form.icon=9"><i class="fa-solid fa-medal"></i></div>
            <div :class="{'icon-item':true, 'icon-item-selected':form.icon===10}" @click="form.icon=10"><i class="fa-solid fa-venus-mars"></i></div>
            <div :class="{'icon-item':true, 'icon-item-selected':form.icon===11}" @click="form.icon=11"><i class="fa-solid fa-person-pregnant"></i></div>
            <div :class="{'icon-item':true, 'icon-item-selected':form.icon===12}" @click="form.icon=12"><i class="fa-solid fa-baby"></i></div>
        </div>
        <div class="button-wrapper" v-if="!editMode">
            <button class="send-button" @click="addData()">保存</button>
        </div>
        <div class="button-wrapper" v-else>
            <button class="send-button" @click="editData()">修改</button>
            <button class="remove-button" @click="removeData()">刪除</button>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
import jsCookie from 'js-cookie';

export default {
    name:'HomeModifier',
    mounted(){
        const item = this.$route.query.item;
        if(item){
            this.form = JSON.parse(item);
            this.editMode = true;
        }
    },
    data() {
        return {
            editMode: false,
            form:{
                itemId: null,
                date:'',
                event:'',
                icon:0,
            }

        }
    },
    methods: {
        goTo(path) {
            this.$router.replace(path).catch((e)=>{});
        },
        async addData(){
            try{
                const res = await axios.post('/api/milestone/add', this.form, {
                headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
                if(res.data.type == 'success'){
                    this.goTo('/moruvi/home');
                }
            }
            catch(e){}
        },
        async editData(){
            try{
                const res = await axios.put('/api/milestone/edit', this.form, {
                headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
                if(res.data.type == 'success'){
                    this.goTo('/moruvi/home');
                }
            }
            catch(e){}
        },
        async removeData(){
            try{
                const res = await axios.delete(`/api/milestone/remove/${this.form.itemId}`, {
                headers: {
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
                if(res.data.type == 'success'){
                    this.goTo('/moruvi/home');
                }
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
    .header-title{
        font-size: 18px;
        text-align: center;
        line-height: 60px;
    }
    .header-list-back{
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
    .form{
        margin-left: 20px;
        margin-top: 10px;
    }
    .form-flag{
        font-size: 16px;
        margin-right: 10px;
        width: 50px;
    }
    .form-date{
        width: calc(100% - 20px);
        height: 70px;
        display: flex;
        align-items: center;
    }
    .form-date .el-date-editor{
        width: calc(100% - 50px);
    }
    .form-event{
        width: calc(100% - 20px);
        height: 70px;
        display: flex;
        align-items: center;
    }
    .form-event-input{
        width: calc(100% - 50px);
    }
    .icon-title{
        margin-left: 20px;
        margin-top: 10px;
        font-size: 16px;
    }
    .icon-grid{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 5px;
        width: calc(100% - 40px);
        margin: 20px auto 0;
        box-sizing: border-box;
    }
    .icon-item{
        width: 60px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 12px;
        border: 1px solid rgba(255, 182, 193, 0.35);
        background: rgba(255, 255, 255, 0.7);
        transition: all 0.2s ease;
        margin-bottom: 10px;
    }

    .icon-item-selected{
        color: #FF5C8A;

        background: rgba(255, 92, 138, 0.12);

        border: 1px solid rgba(255, 92, 138, 0.45);

        box-shadow: 
            0 0 0 2px rgba(255, 92, 138, 0.15),
            0 4px 12px rgba(255, 92, 138, 0.15);

        transform: scale(1.05);
    }
    .button-wrapper{
        width: calc(100% - 40px);
        margin: 0 auto;
    }
    .send-button{
        width: 100%;
        margin-top: 20px;
        background-color: #ff7ea3;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        height: 40px;
    }
    .remove-button{
        width: 100%;
        margin-top: 15px;
        color: black;
        background: 0;
        border: 1px solid rgba(210,210,210,0.8);
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        height: 40px;
    }
</style>