<template>
  <div>
    <div class="user-box">
        <img class="user-avator" src="img/user.png"></img>
        <div class="user-name-box">
            <span class="user-name">小檸檬</span>
        </div>
        <div class="user-member-no-box">
            <div class="user-member-no">Moruvi #1</div>
        </div>
        <div class="user-overview-title">房間資訊</div>
        <div class="user-overview">
            <div class="user-overview-item">
                <div class="user-overview-item-content">2026.05.14</div>
                <div class="user-overview-item-title">創建時間</div>
            </div>
            <div class="user-overview-item">
                <div class="user-overview-item-content">甜蜜小屋</div>
                <div class="user-overview-item-title">房間名稱</div>
            </div>
            <div class="user-overview-item">
                <div class="user-overview-item-content">小呆呆</div>
                <div class="user-overview-item-title">親密夥伴</div>
            </div>
        </div>
        <div class="user-option-box">
            <div class="user-option user-option-selected"><i class="fa-solid fa-circle-user"></i></div>
            <div class="user-option"><i class="fa-solid fa-house"></i></div>
            <div class="user-option"><i class="fa-solid fa-bell"></i></div>
            <div class="user-option"><i class="fa-solid fa-circle-info"></i></div>
        </div>
    </div>
    <router-view class="router-view"></router-view>
  </div>
</template>

<script>
export default {
    name:'More'
}
</script>

<style scoped>
    .user-box{
        width: 100%;
        border-bottom: 0.1px solid rgba(230,230,230);
        box-sizing: border-box;
    }
    .user-avator{
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin: 0 auto;
        margin-top: 20px;
        border: 0.1px solid rgba(0,0,0,0.3);
        box-sizing: border-box;
        display: block;
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
        margin-top: 12px;
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
    .user-overview-title{
        margin-left: 12px;
        margin-top: 10px;
        margin-bottom: 10px;
        font-size: 14px;
        color: pink;
    }
    .user-overview{
        margin-top:5px;
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
        height: calc(100vh - 402.8px);
        box-sizing: border-box;
        border: 1px solid red;
    }
</style>