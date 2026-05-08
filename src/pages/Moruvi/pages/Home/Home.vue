<template>
  <div>
    <div class="header">
      <div class="header-title">甜蜜小屋</div>
      <div class="header-list-add"><i class="el-icon-plus"></i></div>
    </div>
    <div class="first-content">
      <div class="first-content-box-wrapper">
        <div class="first-content-box">
          <div class="first-content-user-wrapper">
            <img class="first-content-user-avator" src="img/author.jpg" alt="">
            <div class="first-content-user-name">小檸檬</div>
          </div>
          <i class="fa-solid fa-heart first-content-user-heart"></i>
          <div class="first-content-user-wrapper">
            <img class="first-content-user-avator" src="img/author2.jpg" alt="">
            <div class="first-content-user-name">小呆呆</div>
          </div>
        </div>
        <div class="first-content-text">
          我們在一起已經 <span class="first-content-text-large">1215</span> 天
        </div>
      </div>
    </div>
    <div class="list-wrapper">
      <div class="list-item">
        <div class="list-item-icon"><i class="fa-regular fa-heart"></i></div>
        <div class="list-item-content">
          <div class="list-item-title">交往的第一天</div>
          <div class="list-item-date">2023-01-09</div>
        </div>
        <div class="list-item-day"><span class="list-item-day-large">1215</span> 天</div>
      </div>
            <div class="list-item">
        <div class="list-item-icon"><i class="fa-regular fa-heart"></i></div>
        <div class="list-item-content">
          <div class="list-item-title">交往的第一天</div>
          <div class="list-item-date">2023-01-09</div>
        </div>
        <div class="list-item-day"><span class="list-item-day-large">1215</span> 天</div>
      </div>
            <div class="list-item">
        <div class="list-item-icon"><i class="fa-regular fa-heart"></i></div>
        <div class="list-item-content">
          <div class="list-item-title">交往的第一天</div>
          <div class="list-item-date">2023-01-09</div>
        </div>
        <div class="list-item-day"><span class="list-item-day-large">1215</span> 天</div>
      </div>
            <div class="list-item">
        <div class="list-item-icon"><i class="fa-regular fa-heart"></i></div>
        <div class="list-item-content">
          <div class="list-item-title">交往的第一天</div>
          <div class="list-item-date">2023-01-09</div>
        </div>
        <div class="list-item-day"><span class="list-item-day-large">1215</span> 天</div>
      </div>
            <div class="list-item">
        <div class="list-item-icon"><i class="fa-regular fa-heart"></i></div>
        <div class="list-item-content">
          <div class="list-item-title">交往的第一天</div>
          <div class="list-item-date">2023-01-09</div>
        </div>
        <div class="list-item-day"><span class="list-item-day-large">1215</span> 天</div>
      </div>
            <div class="list-item">
        <div class="list-item-icon"><i class="fa-regular fa-heart"></i></div>
        <div class="list-item-content">
          <div class="list-item-title">交往的第一天</div>
          <div class="list-item-date">2023-01-09</div>
        </div>
        <div class="list-item-day"><span class="list-item-day-large">1215</span> 天</div>
      </div>
            <div class="list-item">
        <div class="list-item-icon"><i class="fa-regular fa-heart"></i></div>
        <div class="list-item-content">
          <div class="list-item-title">交往的第一天</div>
          <div class="list-item-date">2023-01-09</div>
        </div>
        <div class="list-item-day"><span class="list-item-day-large">1215</span> 天</div>
      </div>
            <div class="list-item">
        <div class="list-item-icon"><i class="fa-regular fa-heart"></i></div>
        <div class="list-item-content">
          <div class="list-item-title">交往的第一天</div>
          <div class="list-item-date">2023-01-09</div>
        </div>
        <div class="list-item-day"><span class="list-item-day-large">1215</span> 天</div>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
    name: 'Home',
    methods: {

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
  .header-list-add{
    position: absolute;
    top:0;
    right: 0px;
    height: 60px;
    width: 60px;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .first-content{
    width: 95%;
    aspect-ratio: 16/9;
    margin: 0 auto;
    margin-top: 5px;
    border-radius: 15px;
    background-image: url(../../../../../public/img/home/love.jpg);
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .first-content-box-wrapper{
    width: 65%;
    box-sizing: border-box;
    margin: 0 auto;
  }
  .first-content-box{
    width: 100%;
    display: flex;
    justify-content: space-evenly;
  }
  .first-content-user-avator{
    width: 75px;
    height: 75px;
    border-radius: 50%;
  }
  .first-content-user-name{
    font-size: 12px;
    color: white;
    margin-top: 6px;
    text-align: center;
  }
  .first-content-user-heart{
    height: 75px;
    line-height: 75px;
    font-size: 18px;
    color: white;
  }
  .first-content-text{
    width: 100%;
    text-align: center;
    font-size: 18px;
    color: white;
    margin-top: 20px;
  }
  .first-content-text-large{
    font-size: 28px;
    font-weight: bold;
  }
  .list-wrapper{
    width:95%;
    margin: 0 auto;
    margin-top: 5px;
    height: calc(100vh - 340px);
    box-sizing: border-box;
    overflow-y: scroll;
  }
  .list-item{
    width: 100%;
    height: 80px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
  }
  .list-item-icon{
    width: 60px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: rgb(247, 134, 152);
  }
  .list-item-content{
    width: calc(100% - 160px);
    padding-left: 10px;
    height: 80px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .list-item-title{
    font-size: 16px;
    margin-bottom: 10px;
  }
  .list-item-date{
    font-size: 12px;
    color: #999;
  }
  .list-item-day{
    width: 100px;
    height: 80px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .list-item-day-large{
    font-size: 24px;
    margin-right: 7.5px;
    color: rgb(247, 134, 152);
  }

</style>