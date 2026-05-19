<template>
  <div class="list-wrapper">
    <template v-if="list.length">
        <div class="list" v-for="(item, id) in list" :key="id" @click="goTo(`/moruvi/prize-modifier/${item.itemId}?from=get-purchase-list`)">
            <div class="list-content-wrapper">
                <div class="list-content">{{item.title}}</div>
                <div class="list-money">{{item.money}} 金幣</div>
            </div>
            <div class="list-button-wrapper">
                <template v-if="!item.status">
                        <div class="list-button list-button-get" @click.stop="completePrize(item.itemId)">兌換</div>
                        <div class="list-button list-button-deny" @click.stop="cancelPrize(item.itemId)">退款</div>
                </template>
                <div v-else class="list-status">已兌換</div>
            </div>
        </div>
    </template>
    <div v-else>
        <el-empty description="尚未購買商品"></el-empty>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
export default {
    name: 'GetPrizeList',
    data(){
        return {
            list:[]
        }
    },
    async mounted(){
        await this.getData();
    },
    methods:{
        goTo(path) {
            this.$router.replace(path).catch((e)=>{});
        },
        async getData(){
            try{
                const res = await axios.get('/api/prize/getPurchasedList',{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                if(res.data.type == 'error'){
                    this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
                }
                else {
                    this.list = res.data.data
                }
            }catch(e){}  
        },
        async completePrize(itemId){
            try{
                await this.$confirm(`確認進行操作（兌換商品）？`,'兌換商品',{
                    confirmButtonText:'確認',
                    cancelButtonText:'取消',
                    customClass: 'PWACSS_MessageBox',
                    type:'warning',
                })
                const res = await axios.get(`/api/prize/completePrize/${itemId}`,{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                if(res.data.type == 'success'){
                   await this.getData();
                }
                this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
            }
            catch(e){}   
        },
        async cancelPrize(itemId){
            try{
                await this.$confirm(`確認進行操作（申請退貨）？`,'申請退貨',{
                    confirmButtonText:'確認',
                    cancelButtonText:'取消',
                    customClass: 'PWACSS_MessageBox',
                    type:'warning',
                })
                const res = await axios.get(`/api/prize/cancelPrize/${itemId}`,{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                if(res.data.type == 'success'){
                   await this.getData();
                   this.$bus.$emit('refreshUserMoney');
                }
                this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
            }
            catch(e){}   
        },
    }
}
</script>

<style scoped>
    .list-wrapper{
        width: 100%;
        padding-left: 3px;
        padding-right: 3px;
        padding-top: 10px;
        box-sizing: border-box;
    }
    .list{
        width: 100%;
        height: 75px;
        border-radius: 10px;
        margin-bottom: 15px;
        box-sizing: border-box;
        box-shadow: 0 0 6px rgba(210,210,210);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 15px;
        padding-right: 15px;
    }
    .list-content-wrapper{
        width: calc(100% - 120px);
    }
    .list-content{
        font-size: 16px;
        font-weight: bolder;
        margin-bottom: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: justify;
        overflow: hidden;
    }
    .list-money{
        font-size: 14px;
        color: pink;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: justify;
        overflow: hidden;
    }
    .list-button-wrapper{
        width: 120px;
        display: flex;
        justify-content: right;
        align-items: center;
    }
    .list-button{
        height: 30px;
        padding-left: 10px;
        padding-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        font-size: 12px;
        border-radius: 5px;
    }
    .list-button-get{
        background: pink;
        color: white;
        margin-right: 10px;
    }
    .list-button-deny{
        box-shadow: 0 0 3px rgba(0,0,0,0.2);
    }
    .list-status{
        color: rgba(210,210,210);
    }
</style>