<template>
    <div>
        <div class="paragraph-wrapper">
            <div class="paragraph-title">
                使用聲明與免責條款
                <div class="declare-date">2026.05.15</div>
            </div>
            <div class="paragraph">
                本平台及其相關作品（以下簡稱「本服務」）之程式、設計、介面與內容，除另有標示外，均為「Moruvi」所有，未經授權不得擅自重製、散布、修改、轉載或作其他商業用途。
            </div>

            <div class="paragraph">
                本服務不主動蒐集、儲存或要求使用者提供涉及重大風險之敏感個人資料，包括但不限於：身分證字號、金融帳戶資訊、信用卡資訊、支付密碼或其他可能直接導致財產損失之資料。
            </div>

            <div class="paragraph">
                使用者於本服務中主動提供、記錄、分享或揭露之個人資訊、內容或隱私資料，均屬使用者自主決定之行為。部分資訊可能用於提供特定功能或改善使用體驗，包括但不限於：推播通知、個人化內容、互動功能、配對功能或其他相關服務。使用者應自行評估並承擔公開、分享或儲存相關資訊可能產生之風險。
            </div>

            <div class="paragraph">
                本服務主要作為資料記錄、整理與功能性服務平台，不保證資料之永久保存、完整性、正確性、即時性、可用性或安全性。因系統維護、版本更新、設備故障、第三方服務異常、網路問題、不可抗力因素或其他非可控因素所造成之資料遺失、內容異常、服務中斷或資訊錯誤，本服務不承擔任何保證責任，使用者應自行備份重要資料。
            </div>

            <div class="paragraph">
                本服務不得視為法律、醫療、金融或其他重大決策用途之正式保存媒介或專業依據。
            </div>

            <div class="paragraph">
                於法律允許範圍內，因使用、無法使用本服務，或因資料遺失、隱私揭露、第三方行為、功能異常、服務中斷等所導致之任何直接、間接、附帶、衍生或其他損害，本服務及其開發者不承擔相關法律責任。
            </div>

            <div class="paragraph">
                本服務可能依功能需求、技術更新或法規要求，不定期調整、修改、限制或終止部分功能，而無須另行個別通知。使用者持續使用本服務，即視為已閱讀、理解並同意本聲明及相關條款內容。
            </div>

            <div class="paragraph">
                本聲明內容得依服務更新、功能調整或相關需求進行修改，恕不另行個別通知，最新版本將以本平台公告內容為準。
            </div>
            <div class="paragraph-title">
                聯絡窗口
                <div class="declare-date">版本序：v1.0.1.0</div>
            </div>
            <div class="paragraph">
                blc0000421@gmail.com 
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProgramInfo'
}
</script>

<style scoped>
    .paragraph-wrapper{
        width: 100%;
        padding:20px;
        padding-bottom: 5px;
        box-sizing: border-box;
        overflow-y: scroll;
    }
    .paragraph-title{
        font-weight: bolder;
        margin-bottom: 15px;
        position: relative;
        display: flex;
        align-items: center;
    }
    .declare-date{
        position: absolute;
        right: 0;
        font-weight: normal;
        font-size: 12px;
        color: rgba(210,210,210);
    }
    .paragraph{
        text-align: justify;
        line-height: 1.5;
        margin-bottom: 15px;
        font-size: 12px;
    }
</style>