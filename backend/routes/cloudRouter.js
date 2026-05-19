
// 雲端儲存空間

// 全頁驗證機制
const express = require('express');
const router = express.Router();

const userModel = require('../models/userModel');
const roomModel = require('../models/roomModel');
const cloudModel = require('../models/cloudModel');

const {format} = require('date-fns');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const authMiddleware = require('../middleware/auth.middleware')
// const { checkUsageMemory } = require('../middleware/checkUsageMemory.middleware')
const { upload, autoCleanupTmp } = require('../config/multer.config');
const path = require('path');


// 獲取資料夾列表
router.get('/api/cloud/folders', authMiddleware, async (req, res) => {
    const token = req.headers['x-user-token']

    try {
        const room = await roomModel.findOne({ owners: token });
        if(!room) return res.send({ type:'error', message:'查無房間。'});

        let cloud = await cloudModel.findOne({ roomId: room.roomId });
        if(!cloud){
            cloud = new cloudModel({
                roomId: room.roomId,
                folders: []
            });
            await cloud.save();
        }

        let folders = cloud.folders.map(folder => ({
            folderId: folder.folderId,
            folderName: folder.folderName,
            createTime: format(folder.createTime, 'yyyy/MM/dd'),
        })).reverse();

        return res.send({
            type:'success',
            message:'資料夾列表獲取成功。',
            data: folders
        });
    } catch (e) {
        console.log(e);
        return res.send({
            type: 'error',
            message: '伺服器錯誤，請洽客服人員協助。',
        });
    }
});

// 創建資料夾
router.post('/api/cloud/createFolder',authMiddleware, async (req, res) => {
    
    // 本次專屬 id
    const uuid = uuidv4();

    const token = req.headers['x-user-token']
    
    const { folderName } = req.body;

    try {

        const room = await roomModel.findOne({ owners: token });
        if(!room) return res.send({ type:'error', message:'查無房間。'});

        const databaseUrl = room.database.url;
        if(!fs.existsSync(databaseUrl)) fs.mkdirSync(databaseUrl, { recursive: true });

        const newFolderPath = path.join(databaseUrl, uuid);
        if(!fs.existsSync(newFolderPath)) fs.mkdirSync(newFolderPath, { recursive: true });
       
        let cloud = await cloudModel.findOne({ roomId: room.roomId });
        if(!cloud){
            cloud = new cloudModel({
                roomId: room.roomId,
                folders: []
            });
        }

        cloud.folders.push({
            createTime: format(new Date(), 'yyyy/MM/dd HH:mm:ss'),
            folderId: uuid,
            folderPath: newFolderPath,
            folderName,
            files: []
        });

        await cloud.save();

        return res.send({
            type:'success',
            message:'資料夾創建成功。'
        });
    } catch (e) {
        console.log(e);
        return res.send({
            type: 'error',
            message: '伺服器錯誤，請洽客服人員協助。',
        });
    }
});

// 刪除資料夾
router.delete('/api/cloud/deleteFolder/:folderId', authMiddleware, async (req, res) => {
    
    const token = req.headers['x-user-token']
    
    const { folderId } = req.params;

    try {
        const room = await roomModel.findOne({ owners: token });
        if(!room) return res.send({ type:'error', message:'查無房間。'});

        let cloud = await cloudModel.findOne({ roomId: room.roomId });
        if(!cloud) return res.send({ type:'error', message:'查無雲端資料。'});

        const folderIndex = cloud.folders.findIndex(folder => folder.folderId === folderId);
        if(folderIndex === -1) return res.send({ type:'error', message:'查無資料夾。'});

        const folderPath = cloud.folders[folderIndex].folderPath;
        if(fs.existsSync(folderPath)) fs.rmdirSync(folderPath, { recursive: true });

        cloud.folders.splice(folderIndex, 1);
        await cloud.save();

        return res.send({
            type:'success',
            message:'資料夾刪除成功。'
        });
    } catch (e) {
        console.log(e);
        return res.send({
            type: 'error',
            message: '伺服器錯誤，請洽客服人員協助。',
        });
    }
});

// 更改資料夾名稱
router.put('/api/cloud/renameFolder', authMiddleware, async (req, res) => {
    
    const token = req.headers['x-user-token']
    
    const { folderId, folderName } = req.body;

    try {
        const room = await roomModel.findOne({ owners: token });
        if(!room) return res.send({ type:'error', message:'查無房間。'});

        let cloud = await cloudModel.findOne({ roomId: room.roomId });
        if(!cloud) return res.send({ type:'error', message:'查無雲端資料。'});

        const folderIndex = cloud.folders.findIndex(folder => folder.folderId === folderId);
        if(folderIndex === -1) return res.send({ type:'error', message:'查無資料夾。'});

        cloud.folders[folderIndex].folderName = folderName;
        await cloud.save();

        return res.send({
            type:'success',
            message:'資料夾名稱更新成功。'
        });
    } catch (e) {
        console.log(e);
        return res.send({
            type: 'error',
            message: '伺服器錯誤，請洽客服人員協助。',
        });
    }
});


module.exports = router;
   