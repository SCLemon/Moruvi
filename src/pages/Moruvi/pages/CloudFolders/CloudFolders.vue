<template>
  <div class="cloud-wrapper">
    <div class="search-box-wrapper">
        <i class="fa-solid fa-magnifying-glass search-box-icon"></i>
        <input type="text" v-model="keyword" class="search-box-input" placeholder="在回憶錄中搜尋">
        <div class="search-box-subText">Powered by Moruvi</div>
    </div>
    <div class="folder-list-wrapper">
        <div class="folder-list-item" v-for="(item, id) in list" :key="id">
            <i class="fa-solid fa-folder-open folder-list-item-icon"></i>
            <div class="folder-list-item-content">
                <div class="folder-list-item-content-title">{{ item.folderName }}</div>
                <div class="folder-list-item-content-createTime">創建時間 {{ item.createTime }}</div>
            </div>
            <div class="folder-list-item-more" @click="toggleOptionsList(item)">
                <i class="fa-solid fa-bars"></i>
                <div class="folder-list-item-more-options-box" v-if="item.showOptions">
                    <div class="folder-list-item-more-option" @click.stop="renameFolder(item.folderId)">重新命名</div>
                    <div class="folder-list-item-more-option" @click.stop="removeFolder(item.folderId)">刪除</div>
                </div>
            </div>
        </div>
    </div>
    <div class="folder-add-button" @click="addFolder()"><i class="fa-solid fa-plus"></i></div>
  </div>
</template>

<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
export default {
    name: 'CloudFolders',
    data(){
        return {
            list: [],
            keyword:'',
        }
    },
    async mounted(){
        await this.getData();
    },
    methods:{
        toggleOptionsList(item){
            this.$set(item, 'showOptions', !item.showOptions);
        },
        async getData(){
            try{
                const res = await axios.get('/api/cloud/folders',{
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
        async addFolder(){
            try{
                const { value } = await this.$prompt('請輸入資料夾名稱',{
                    cancelButtonText:'取消',
                    confirmButtonText:'創建',
                    customClass:'PWACSS_MessageBox',
                    type:'warning'
                })
                const res = await axios.post('/api/cloud/createFolder',{
                    folderName: value
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
         async renameFolder(folderId){
            try{
                const { value } = await this.$prompt('請輸入資料夾名稱',{
                    cancelButtonText:'取消',
                    confirmButtonText:'修改',
                    customClass:'PWACSS_MessageBox',
                    type:'warning'
                })
                const res = await axios.put('/api/cloud/renameFolder',{
                    folderId,
                    folderName: value
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
        async removeFolder(folderId){
            try{
                await this.$confirm('確認刪除資料夾？',{
                    cancelButtonText:'取消',
                    confirmButtonText:'刪除',
                    customClass:'PWACSS_MessageBox',
                    type:'warning'
                })
                const res = await axios.delete(`/api/cloud/deleteFolder/${folderId}`,{
                    headers:{
                        'x-user-token': jsCookie.get('authToken')
                    }
                });
                if(res.data.type == 'success'){
                    await this.getData();
                }
                this.$bus.$emit('handleAlert','系統訊息', res.data.message,res.data.type);
            }catch(e){}              
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
    .search-box-wrapper{
        width: calc(100% - 40px);
        margin: 0 auto;
        margin-top: 20px;
        margin-bottom: 20px;
        height: 60px;
        box-shadow: 0 0 3px rgba(210, 210, 210);
        border-radius: 30px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
    .search-box-icon{
        width: 50px;
        text-align: center;
    }
    .search-box-input{
        width: calc(100% - 210px);
        border: 0;
        font-size: 16px;
        outline: 0;
    }
    .search-box-input::placeholder{
        color: rgba(180,180,180);
    }
    .search-box-subText{
        font-size: 12px;
        color: rgba(210,210,210);
        width: 120px;
        text-align: center;
        box-sizing: border-box;
    }
    .folder-list-wrapper{
        width: calc(100% - 40px);
        height: calc(100vh - 155px);
        margin: 0 auto;
        box-sizing: border-box;
        overflow-y: scroll;
    }
    .folder-list-item{
        width: 100%;
        height: 60px;
        box-sizing: border-box;
        margin-bottom: 5px;
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
    .folder-list-item-more-options-box{
        position: absolute;
        width: 80px;
        font-size: 14px;
        top: 50px;
        right: 10px;
        box-shadow: 0 0 3px rgba(210,210,210);
        background: white;
        z-index: 1;
        font-size: 12px;
    }
    .folder-list-item-more-option{
        width: 100%;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .folder-add-button{
        width: 60px;
        height: 60px;
        border-radius: 60px;
        box-sizing: border-box;
        box-shadow: 0 0 3px rgba(210,210,210);
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