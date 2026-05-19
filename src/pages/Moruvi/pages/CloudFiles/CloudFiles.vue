<template>
  <div class="cloud-wrapper">
    <div class="folder-list-wrapper-mask" v-if="uploadStatus.isUploading">
        {{ uploadStatus.status }}
    </div>
    <div class="folder-list-wrapper-mask" v-if="previewStatus.isPreviewing" @click="closePreview()">
        <img v-if="previewStatus.imageUrl" class="preview-image" :src="previewStatus.imageUrl" alt="">
        <div v-else>{{ previewStatus.status }}</div>
    </div>
    <div class="header">
        <div class="header-back" @click="goTo('/moruvi/cloud-folders')"><i class="el-icon-arrow-left"></i></div>
        <div class="header-title">{{folderName}}</div>
    </div>
    <div class="folder-list-wrapper" v-if="list.length" ref="folder-list-wrapper" @scroll="handleScroll()">
        <div class="folder-list-item" v-for="(item, id) in list" :key="id" @click="previewFile(item)">
            <i class="fa-solid fa-image folder-list-item-icon"></i>
            <div class="folder-list-item-content">
                <div class="folder-list-item-content-title">{{ item.fileName }}</div>
                <div class="folder-list-item-content-createTime">創建時間 {{ item.createTime }}</div>
            </div>
            <div :class="{'folder-list-item-more': true, 'more-selected': item.showOptions}" @click.stop="toggleOptionsList(item)">
                <i class="fa-solid fa-bars"></i>
                <div :class="{'folder-list-item-more-options-box': true, 'folder-list-item-more-options-box-last': (id === list.length - 1 && id !== 0)}" v-if="item.showOptions">
                    <div class="folder-list-item-more-option" @click.stop="renameFile(item.fileId)">重新命名</div>
                    <div class="folder-list-item-more-option" @click.stop="!isDownloading?downloadFile(item):''">{{ !isDownloading? '下載': '下載中' }}</div>
                    <div class="folder-list-item-more-option" @click.stop="removeFile(item.fileId)">刪除</div>
                </div>
            </div>
        </div>
    </div>
    <div class="folder-list-wrapper folder-list-wrapper-none" v-else>
        <el-empty description="查無回憶錄"></el-empty>
    </div>
    <div class="folder-add-button" v-if="showAddButton" @click="openUpload()"><i class="fa-solid fa-plus"></i></div>
    <input type="file" ref="uploadImages" multiple accept="image/*" style="display: none;" @change="addFile()">
  </div>
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
import { compressImage } from '@/utils/js/compressor';
export default {
    name: 'CloudFiles',
    data(){
        return {
            previewStatus:{
                imageUrl:'',
                isPreviewing: false,
                status:'',
            },
            isDownloading: false,
            uploadStatus:{
                isUploading: false,
                status: '',
            },
            folderId: this.$route.params.folderId,
            folderName:'',
            list: [],
            keyword:'',
            showAddButton: true,
        }
    },
    async mounted(){
        await this.getData();
    },
    methods:{
        handleScroll(){
            const buffer = 10;
            const el = this.$refs['folder-list-wrapper'];

            if(el.scrollTop + el.clientHeight >= el.scrollHeight - buffer){
                this.showAddButton = false;
            }
            else this.showAddButton = true;
        },
        goTo(path) {
            this.$router.replace(path).catch((e)=>{});
        },
        toggleOptionsList(item){
            this.$set(item, 'showOptions', !item.showOptions);
        },
        async getData(){
            try{
                const res = await axios.get(`/api/cloud/files/${this.folderId}`,{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                if(res.data.type == 'error'){
                    this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
                }
                else {
                    this.list = res.data.data.files;
                    this.folderName = res.data.data.folderName;
                }
            }catch(e){}  
        },

        openUpload(){
            this.$refs['uploadImages'].click();
        },

        async addFile(){

            this.uploadStatus.isUploading = true;

            try{
                this.uploadStatus.status = '程序開始執行...';
                const files = this.$refs.uploadImages.files;

                if(!files || files.length === 0) return;

                for(const file of files){


                    this.uploadStatus.status = `${file.name} 準備上傳...`;

                    let formData = new FormData();
                    formData.append('folderId', this.folderId)
                    formData.append("attachments", file, file.name);

                    const res = await axios.post("/api/cloud/uploadFile", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "x-user-token": jsCookie.get('authToken'),
                        },
                        onUploadProgress:(progressEvent) => {
                            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                            this.uploadStatus.status = `正在上傳 ${file.name} ${percent}%`;
                        },
                    });

                    if(res.data.type !== 'success'){
                        this.uploadStatus.status = `${file.name} 上傳失敗`;
                    }
                    else await this.getData();
                }
                this.uploadStatus.status = '全部上傳完成';
            }
            catch(e){
                console.error(e);
                this.uploadStatus.status = '上傳失敗';
            }
            finally{
                this.uploadStatus.isUploading = false;
                this.$refs.uploadImages.value = '';
            }
        },
        async renameFile(fileId){
            try{
                const { value } = await this.$prompt('請輸入檔案名稱',{
                    cancelButtonText:'取消',
                    confirmButtonText:'修改',
                    customClass:'PWACSS_MessageBox',
                    type:'warning'
                })
                const res = await axios.put('/api/cloud/renameFile',{
                    folderId: this.folderId,
                    fileId,
                    fileName: value
                },{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                if(res.data.type == 'success'){
                    await this.getData();
                }
                this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
            }catch(e){}  
        },
        async downloadFile(file){
            this.isDownloading = true;
            try{
                const res = await axios.get(`/api/cloud/downloadFile/${this.folderId}/${file.fileId}`,{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    },
                    responseType:'blob',
                });

                let filename = 'image.png';
                const disposition = res.headers['content-disposition'];

                if(disposition){
                    const match = disposition.match(/filename="?(.+?)"?$/);
                    if(match){
                        filename = decodeURIComponent(match[1]);
                    }
                }

                const url = window.URL.createObjectURL(new Blob([res.data]));
                const a = document.createElement('a');

                a.href = url;
                a.download = filename;

                document.body.appendChild(a);
                a.click();
                a.remove();

                window.URL.revokeObjectURL(url);

                this.$bus.$emit('handleAlert','系統訊息','檔案下載成功','success');
                this.toggleOptionsList(file);
            }
            catch(e){
                console.log(e)
                this.$bus.$emit('handleAlert','系統訊息','下載失敗','error');
            }
            finally{
                this.isDownloading = false;
            }
        },
        async removeFile(fileId){
            try{
                await this.$confirm('確認刪除檔案？',{
                    cancelButtonText:'取消',
                    confirmButtonText:'刪除',
                    customClass:'PWACSS_MessageBox',
                    type:'warning'
                })
                const res = await axios.post(`/api/cloud/deleteFile`,{
                    folderId: this.folderId,
                    fileId,
                },{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                if(res.data.type == 'success'){
                    await this.getData();
                }
                this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
            }catch(e){}              
        },

        async previewFile(file){
            this.previewStatus.isPreviewing = true;
            try{
                this.previewStatus.status = '圖片下載中...'
                const res = await axios.get(`/api/cloud/downloadFile/${this.folderId}/${file.fileId}`,{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    },
                    responseType:'blob',
                });

                this.previewStatus.imageUrl = URL.createObjectURL(res.data);

            }
            catch(e){
                console.log(e)
                this.$bus.$emit('handleAlert','系統訊息','檔案預覽失敗','error');
            }
            finally{
                this.isDownloading = false;
            }
        },
        closePreview(){
            this.previewStatus = {
                isPreviewing: false,
                imageUrl: '',
                status:'',
            }
            window.URL.revokeObjectURL(this.previewStatus.imageUrl);
        }
    }
}
</script>

<style scoped>
    .cloud-wrapper{
        position: relative;
        width: 100%;
        height: calc(100vh - 80px);
    }
    .header{
        width: 100%;
        height: 60px;
        box-sizing: border-box;
        box-sizing: border-box;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
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
        width: 250px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .folder-list-wrapper{
        width: 100%;
        height: calc(100vh - 140px);
        margin: 0 auto;
        box-sizing: border-box;
        overflow-y: scroll;
        position: relative;
    }
    .folder-list-wrapper-mask{
        width: 100%;
        height: calc(100vh - 80px);
        position: absolute;
        top:0;
        left:0;
        background: rgba(0,0,0,0.8);
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 18px;
    }
    .folder-list-wrapper-none{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .preview-image{
        width: 85%;
    }
    .folder-list-item{
        width: 100%;
        height: 60px;
        box-sizing: border-box;
        margin-bottom: 5px;
        padding-left: 10px;
        padding-right: 10px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
    .folder-list-item-icon{
        width: 40px;
        height: 60px;
        line-height: 60px;
        text-align: center;
    }
    .folder-list-item-content{
        width: calc(100% - 120px);
        box-sizing: border-box;
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 5px;
    }
    .folder-list-item-content-title{
        width: 100%;
        margin-bottom: 7.5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .folder-list-item-content-createTime{
        width: 100%;
        font-size: 12px;
        color: rgba(210, 210, 210);
    }
    .folder-list-item-more{
        width: 40px;
        text-align: center;
        height: 60px;
        line-height: 60px;
        position: relative;
    }
    .more-selected{
        background: pink;
        color: white;
    }
    .folder-list-item-more-options-box{
        position: absolute;
        width: 80px;
        font-size: 14px;
        top: 20px;
        right: 55px;
        box-shadow: 0 0 9px pink;
        background: white;
        z-index: 1;
        font-size: 12px;
        color: black;
    }
    .folder-list-item-more-options-box-last{
        top:auto;
        bottom: 0px;
    }
    .folder-list-item-more-option{
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
    }
    .folder-add-button{
        width: 60px;
        height: 60px;
        border-radius: 60px;
        box-sizing: border-box;
        box-shadow: 0 0 9px pink;
        background: white;
        color: pink;
        position: absolute;
        bottom: 25px;
        right: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
    }
</style>