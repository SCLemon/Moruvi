// 涉及 notification 功能的統一管理文件

// 全頁驗證機制
const express = require('express');
const router = express.Router();

const roomModel = require('../models/roomModel');

const {format} = require('date-fns');
const { uuid } = require('uuidv4');
const fs = require('fs');
const authMiddleware = require('../middleware/auth.middleware');
const subscribeModel = require('../models/subscribeModel');
const { pushNotification } = require('./service-worker/serviceWorker');

// 戳戳對方
router.get('/api/notify/poke',authMiddleware, async (req, res) => {
    
    const token = req.headers['x-user-token']
    
    try {
       
        const room = await roomModel.findOne({ owners: token });

        if(!room){
            return res.send({
                type:'error',
                message:'傳送通知失敗（房間不存在）。'
            });
        }

        const partnerToken = room.owners.find(t => t !== token);

        const pSubscription = await subscribeModel.findOne({token: partnerToken})

        if(!pSubscription){
            return res.send({
                type:'error',
                message:'傳送通知失敗（對方尚未開啟訂閱）。'
            });
        }

        const result = await pushNotification('您的伴侶剛才戳了你一下！', '有人偷偷想你了 💌', undefined, pSubscription.subscription)
        return res.send(result);

    } catch (e) {
        console.log(e);
        return res.send({
            type: 'error',
            message: '伺服器錯誤，請洽客服人員協助。',
        });
    }
});


module.exports = router;