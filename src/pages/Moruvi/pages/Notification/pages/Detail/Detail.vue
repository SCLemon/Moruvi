<template>
  <div class="detail-wrapper">
    <div class="title">{{ detail.title }}</div>
    <div class="author-wrapper">
        <img class="author-avator" :src="detail.author.userImgUrl" alt="">
        <div class="author-name">{{ detail.author.name }}</div>
        <div class="author-date">{{ detail.createTime }}</div>
    </div>
    <div class="content-wrapper" v-html="detail.content"></div>
  </div>
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
export default {
    name: 'Detail',
    data(){
        return {
            idx: this.$route.params.idx,
            detail:{
                title: '',
                subTitle: '',
                content: '',
                createTime: '',
                author: {
                    name: '',
                    userImgUrl: 'img/user.png'
                }
            }
        }
    },
    async mounted(){
        await this.getData();
        await this.markRead();
    },
    methods:{
        async getData(){
            try{
                const res = await axios.get(`/api/notify/getSpecificData/${this.idx}`,{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                if(res.data.type == 'error'){
                    this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
                }
                else this.detail = res.data.data
            }catch(e){}  
        },
        async markRead(){
            try{
                const res = await axios.post('/api/notify/markRead',{
                    idx: this.idx
                },
                {
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                
                if(res.data.type == 'error') return this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
                
                // 跳轉

            }catch(e){}  
        },
    }
}
</script>

<style scoped>
    .detail-wrapper{
        width: 100%;
        padding-left: 15px;
        padding-right: 15px;
        box-sizing: border-box;
    }
    .title{
        margin-top: 10px;
        width: 100%;
        font-size: 24px;
        line-height: 1.25;
        text-align: justify;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
    }
    .author-wrapper{
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        margin-top: 20px;
    }
    .author-avator{
        width: 30px;
        height: 30px;
        margin-right: 7.5px;
        border-radius: 50%;
        border: 0.1px solid rgba(0,0,0,0.3);
    }
    .author-name{
        font-size: 14px;
    }
    .author-date{
        margin-left: auto;
        font-size: 12px;
        color:rgba(210,210,210);
    }
    .content-wrapper{
        margin-top: 25px;
        font-size: 14px;
        text-align: justify;
        line-height: 1.5;
    }
</style>