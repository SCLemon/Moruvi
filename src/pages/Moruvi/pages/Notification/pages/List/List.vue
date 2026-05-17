<template>
  <div>
    <div v-if="list.length" class="list-wrapper">
        <div class="list" v-for="(item, id) in list" :key="id" @click="goToDetail(item.idx)">
            <div class="list-unRead" v-if="!item.isRead"></div>
            <div class="list-title-wrapper">
                <div class="list-title-box">
                    <div class="list-title">{{ item.title }}</div>
                    <div class="list-date">{{ item.createTime }}</div>
                </div>
                <div class="list-subTitle">{{ item.content }}</div>
            </div>
            <div class="list-arrow-wrapper">
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        </div>
    </div>
    <div class="list-wrapper-none" v-else>
        <el-empty description="暫無通知"></el-empty>
    </div>
  </div>
</template>

<script>
import jsCookie from 'js-cookie';
import axios from 'axios';
export default {
    name:"List",
    data(){
        return {
            list:[]
        }
    },
    async mounted(){
        await this.getData();
    },
    methods:{
        goToDetail(idx){
            this.$router.replace(`/moruvi/notification/detail/${idx}`).catch((e)=>{})
        },
        async getData(){
            try{
                const res = await axios.get('/api/notify/getData',{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                if(res.data.type == 'error'){
                    this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
                }
                else this.list = res.data.data
            }catch(e){}  
        },

    }

}
</script>

<style scoped>
    .list{
        width: 100%;
        height: 60px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        margin-bottom: 1px;
    }
    .list-wrapper-none{
        height: calc(100vh - 140px);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .list-unRead{
        width: 3.5px;
        height: 60px;
        background: pink;
    }
    .list-title-wrapper{
        width: 90vw;
        height: 60px;
        box-sizing: border-box;
        padding-left: 10px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .list-title-box{
        font-size: 14px;
        margin-bottom: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .list-title{
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: justify;
        overflow: hidden;
        margin-right: 5px;
    }
    .list-date{
        color: rgba(210,210,210);
        font-size: 12px;
    }
    .list-subTitle{
        max-height: 30px;
        line-height: 15px;
        font-size: 10px;
        color: rgba(210,210,210);
        text-align: justify;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }
    .list-arrow-wrapper{
        width: 10vw;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgba(210,210,210);
    }
</style>