<template>
    <div>
        <router-view class="view"></router-view>
        <div class="footer">
            <div :class="{route:true, 'moruvi-route-selected':$route.path.includes('/moruvi/home')}" @click="goTo('/moruvi/home')">
                <div class="route-icon"><i class="el-icon-house"></i></div>
                <div class="route-name">首頁</div>
            </div>
            <div :class="{route:true, 'moruvi-route-selected':$route.path.includes('/moruvi/request')}">
                <div class="route-icon"><i class="el-icon-chat-line-round"></i></div>
                <div class="route-name">請求</div>
            </div>
            <div :class="{route:true, 'moruvi-route-selected':$route.path.includes('/moruvi/memoirs')}">
                <div class="route-icon"><i class="el-icon-reading"></i></div>
                <div class="route-name">回憶錄</div>
            </div>
            <div :class="{route:true, 'moruvi-route-selected':$route.path.includes('/moruvi/notification')}">
                <div class="route-icon"><i class="el-icon-bell"></i></div>
                <div class="route-name">動態通知</div>
            </div>
            <div :class="{route:true, 'moruvi-route-selected':$route.path.includes('/moruvi/more')}" @click="goTo('/moruvi/more')">
                <div class="route-icon"><i class="el-icon-more-outline"></i></div>
                <div class="route-name">更多</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Moruvi',
    methods:{
        goTo(path) {
            this.$router.replace(path).catch((e)=>{});
        },
    }

}
</script>

<style scoped>
    .view{
        width: 100%;
        height: calc(100vh - 80px);
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }
    .footer{
        width: 100%;
        height: 80px;
        position: fixed;
        bottom: 0;
        box-sizing: border-box;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
    .route{
        box-sizing: border-box;
        height: 80px;
        width: calc(100vw / 5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .route-icon{
        font-size: 24px;
        margin-bottom: 6px;
    }
    .route-name{
        font-size: 12px;
    }
    .moruvi-route-selected{
        color: pink;
        border-bottom: 3px solid pink;
        box-sizing: border-box;
    }
</style>