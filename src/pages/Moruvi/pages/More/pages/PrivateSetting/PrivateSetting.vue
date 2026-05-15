<template>
  <div>
    <div class="info-box">
        <div class="info-box-title">更新時間</div>
        <div class="info-box-content">{{subscribeInfo.createTime || '暫無訂閱'}}</div>
    </div>
    <div class="info-box">
        <div class="info-box-title">訂閱裝置</div>
        <div class="info-box-content">{{subscribeInfo.userAgent || '暫無訂閱'}}</div>
    </div>
    <div class="info-box">
        <div class="info-box-title">訂閱狀態</div>
        <div :class="{'info-box-content':true, 'info-status-true': subscribeInfo.status}">{{ subscribeInfo.status ? '已開啟': '暫無訂閱' }}</div>
    </div>
    <div class="info-box">
        <div class="info-box-title">訂閱設置</div>
        <div class="info-box-button-wrapper">
            <template v-if="!isProcessing">
                <button class="info-box-button info-box-button-1" @click="!isProcessing?subscribe():''">更新</button>
                <button class="info-box-button info-box-button-2" @click="!isProcessing?cancel():''">關閉</button>
            </template>
            <div class="info-box-content" v-else>正在執行中</div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
import { getSubscription } from '@/service-worker/main';
export default {
    name:'PrivateSetting',
    data(){
        return {
            isProcessing: false,
            subscribeInfo:{
                createTime: '',
                userAgent: '',
                status: false,
            }
        }
    },
    async mounted(){
        await this.getData();
    },
    methods:{
        async getData(){
            try{
                const res = await axios.get('/api/subscribe/get-subscribe',{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                if(res.data.type == 'error'){
                    this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
                }
                else this.subscribeInfo = res.data.data
            }
            catch(e){}  
        },
        async subscribe(){
            this.isProcessing = true;

            const result = await getSubscription();
            
            if(result.type == 'error'){
                this.$bus.$emit('handleAlert','系統訊息', result.message, result.type);
                this.isProcessing = false;
                return;
            }

            try{
                const res = await axios.post('/api/subscribe/save-subscribe',{
                    subscription: result
                },{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    },
                });
                if(res.data.type == 'success'){
                    await this.getData();
                }
                this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
            }
            catch(e){}
            finally{
                this.isProcessing = false;
            }
        },
        async cancel(){
            this.isProcessing = true;
            try{
                const res = await axios.delete('/api/subscribe/cancel-subscribe',{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    },
                });
                if(res.data.type == 'success'){
                    await this.getData();
                }
                this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
            }
            catch(e){}
            finally{
                this.isProcessing = false;
            }
        },

    }
}
</script>

<style scoped>
    .info-box{
        width: 100%;
        height: 60px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
        font-size: 14px;
    }
    .info-box-content{
        color: rgba(210,210,210);
    }
    .info-status-true{
        color: pink;
    }
    .info-box-button{
        padding: 5px 12.5px 5px 12.5px;
        box-sizing: border-box;
        background: none;
        border: none;
        box-sizing: border-box;
        box-shadow: 0px 0px 3px rgba(210,210,210);
    }
    .info-box-button-1{
        background: pink;
        color: white;
        margin-right: 7.5px;
    }
    .info-box-button-2{
        color: black;
    }
</style>