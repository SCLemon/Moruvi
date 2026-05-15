<template>
  <div>
    <div class="user-box">
        <div class="logout" @click="logout()">登出</div>
        <div class="user-avator-wrapper">
            <div class="user-avator-mask" v-if="userAvatorStatus.processing">{{ userAvatorStatus.status }}</div>
            <img class="user-avator" :src="overviewData.user?.userImgUrl || 'img/user.png'" @click="openUpload()">
        </div>
        <div class="user-name-box">
            <span class="user-name">{{ overviewData.user.name }}</span>
        </div>
        <div class="user-member-no-box">
            <div class="user-member-no">{{ overviewData.user.memberNo }}</div>
        </div>
        <div class="user-overview">
            <div class="user-overview-item">
                <div class="user-overview-item-content">{{overviewData.roomInfo.createTime}}</div>
                <div class="user-overview-item-title">創建時間</div>
            </div>
            <div class="user-overview-item">
                <div class="user-overview-item-content">{{overviewData.roomInfo.roomName}}</div>
                <div class="user-overview-item-title">房間名稱</div>
            </div>
            <div class="user-overview-item">
                <div class="user-overview-item-content">{{overviewData.roomInfo.partner}}</div>
                <div class="user-overview-item-title">親密伴侶</div>
            </div>
        </div>
        <div class="user-option-box">
            <div :class="{'user-option':true, 'user-option-selected':$route.path.includes('/my-info')}" @click="goTo('/moruvi/more/my-info')"><i class="fa-solid fa-circle-user"></i></div>
            <div :class="{'user-option':true, 'user-option-selected':$route.path.includes('/home-setting')}" @click="goTo('/moruvi/more/home-setting')"><i class="fa-solid fa-house"></i></div>
            <div :class="{'user-option':true, 'user-option-selected':$route.path.includes('/private-setting')}" @click="goTo('/moruvi/more/private-setting')"><i class="fa-solid fa-bell"></i></div>
            <div :class="{'user-option':true, 'user-option-selected':$route.path.includes('/program-info')}" @click="goTo('/moruvi/more/program-info')"><i class="fa-solid fa-circle-info"></i></div>
        </div>
    </div>
    <input type="file" ref="uploadUserAvator" style="display: none;" @change="onUpload()" accept="image/*" multiple="false">
    <router-view class="router-view"></router-view>
  </div>
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
import { compressImage } from "../../../../utils/js/compressor"
export default {
    name:'More',
    data(){
        return{
            userAvatorStatus:{
                processing: false,
                status: '',
            },
            overviewData:{
                user:{},
                roomInfo:{},
            },
        }
    },
    async mounted(){
        await this.getData();
    },
    methods:{
        goTo(path) {
            this.$router.replace(path).catch((e)=>{});
        },
        async logout(){
            try{
                await this.$confirm('確認是否登出此帳號？','登出帳號',{
                    type:'warning',
                    confirmButtonText:'確認',
                    cancelButtonText:'取消',
                    customClass: 'PWACSS_MessageBox'
                })
                jsCookie.remove('authToken');
                this.goTo('/login');
            }
            catch(e){}
        },
        async getData(){
            try{
                const res = await axios.get('/api/overview/getData',{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                if(res.data.type == 'error'){
                    this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
                }
                else{
                    this.overviewData = res.data.data;
                }
            }catch(e){}  
        },
        openUpload(){
            this.$refs.uploadUserAvator.click();
        },
        async onUpload(){
            this.userAvatorStatus.processing = true;
            try{

                this.userAvatorStatus.status = '程序開始執行...';
                const files = this.$refs.uploadUserAvator.files;
                if(!files) return;
                const file = files[0];

                this.userAvatorStatus.status = '圖片壓縮中...';
                const compressedFile = await compressImage(file, 250);
                console.log(`原始: ${(file.size / 1024).toFixed(1)} KB → 壓縮後: ${(compressedFile.size / 1024).toFixed(1)} KB`);

                this.userAvatorStatus.status = '準備上傳...';
                let formData = new FormData();
                formData.append("attachments", compressedFile);
                const res = await axios.post("/api/img/updateUserAvator", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "x-user-token": jsCookie.get('authToken'),
                    },
                    onUploadProgress:(progressEvent) => {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        this.userAvatorStatus.status = percent + '%';
                    },
                })
                if(res.data.type == 'success') await this.getData();
                else this.$bus.$emit('handleAlert','頭像上傳通知',res.data.message,res.data.type)
                this.userAvatorStatus.processing = false;
                this.userAvatorStatus.status = '';
            }
            catch(e){
                this.userAvatorStatus.status = '異常錯誤...';
                setTimeout(()=>{
                    this.userAvatorStatus.processing = false;
                    this.userAvatorStatus.status = '';
                }, 3000)
            }
            finally{
                this.$refs.uploadUserAvator.value = ''
            }
        }
    }
}
</script>

<style scoped>
    .user-box{
        width: 100%;
        border-bottom: 0.1px solid rgba(230,230,230);
        box-sizing: border-box;
        position: relative;
    }
    .logout{
        position: absolute;
        right: 15px;
        top: 12.5px;
        background: pink;
        border-radius: 5px;
        color: white;
        box-sizing: border-box;
        padding: 7.5px 12.5px 7.5px 12.5px;
        text-align: center;
        font-size: 14px;
    }
    .user-avator-wrapper{
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin: 0 auto;
        margin-top: 30px;
        border: 0.1px solid rgba(0,0,0,0.3);
        box-sizing: border-box;
        display: block;
        position: relative;
        overflow: hidden;
    }
    .user-avator-mask{
        position: absolute;
        width: 100px;
        height: 100px;
        top:0;
        left:0;
        background: rgba(0,0,0,0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
    }
    .user-avator{
        width: 100%;
    }
    .user-name-box{
        width: 100%;
        margin-top: 12px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .user-name{
        font-size: 18px;
        font-weight: bolder;
    }
    .user-member-no-box{
        width: 100%;
        margin-top: 14px;
        display: flex;
        justify-content: center;
    }
    .user-member-no{
        font-size: 12px;
        text-align: center;
        padding: 5px 10px 5px 10px;
        border-radius: 14px;
        background: pink;
        color: white;
    }
    .user-overview{
        margin-top: 15px;
        margin-bottom: 8px;
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
    .user-overview-item{
        width: 32%;
        box-sizing: border-box;
        text-align: center;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .user-overview-item-content{
        font-size: 18px;
        font-weight: bolder;
    }
    .user-overview-item-title{
        font-size: 14px;
        margin-top: 12px;
        color: rgba(210,210,210);
    }
    .user-option-box{
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
    .user-option{
        width: 50px;
        height: 50px;
        box-sizing: border-box;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgba(210,210,210);
    }
    .user-option-selected{
        color: pink;
        border-bottom: 3px solid pink;
        box-sizing: border-box;
    }
    .router-view{
        width: 100%;
        height: calc(100vh - 413.5px);
        box-sizing: border-box;
        overflow-y: scroll;
    }
</style>