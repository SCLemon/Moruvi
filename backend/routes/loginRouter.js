// 全頁驗證機制
const express = require('express');
const router = express.Router();

const userModel = require('../models/userModel');
const roomModel = require('../models/roomModel');

const {format} = require('date-fns');
const { uuid } = require('uuidv4');
const fs = require('fs');

// 跨平台基準路徑
const baseDirMap = {
  win32: 'D:/moruvi_database/local/',
  darwin: '/Volumes/moruvi_database/local/'
};
const baseDir = baseDirMap[process.platform] || '/mnt/moruvi_database/local/';


function historyGenerator(req){
    return {
        recordingTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        fingerprint: req.headers['x-user-fingerprint'],
        ip: req.headers['cf-connecting-ip'],
        country: req.headers['cf-ipcountry'],
        city: req.headers['cf-ipcity'],
        latitude: req.headers['cf-iplatitude'],
        longitude: req.headers['cf-iplongitude'],
        timezone: req.headers['cf-timezone']
    };
}

// 註冊驗證
router.post('/login/register', async (req, res) => {

    const token =  uuid();
    let { account, password, roomId } = req.body;

    if (!account || !password) {
        return res.send({
            type:'error',
            message:'註冊資料不可為空。'
        });
    }

    try {

        const existingUser = await userModel.findOne({ account });
        if (existingUser) {
            return res.send({
                type:'error',
                message:'帳號已存在，請選擇其他帳號。'
            });
        }

        const room = await roomModel.findOne({ roomId });
        if(!roomId || !room){
            roomId = uuid();
            const dataBaseUrl = `${baseDir}${roomId}/`;

            fs.mkdirSync(dataBaseUrl, { recursive: true });

            const newRoom = new roomModel({
                roomId,
                owners: [token],
                'database.url': dataBaseUrl,
            });
            await newRoom.save(); 
        }
        else if(room.owners.length >= 2){
            return res.send({
                type:'error',
                message:'房間已滿員，請選擇其他房間或建立新房間。'
            });
        }
        else{
            room.owners.push(token);
            await room.save();
        }

        const existingCount = await userModel.countDocuments({});
        const newUser = new userModel({
            createTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            roomId,
            token,
            account,
            password,
            name: `Moruvi #${existingCount + 1}`,
        });

        await newUser.save();

        res.cookie('authToken',token,{
            maxAge:86400 * 1000 * 7, // 7 天
        })

        return res.send({
            type:'success',
            message:'註冊成功。' 
        });
    } catch (e) {
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// 登入驗證
router.post('/login/verify', async (req, res) => {
    const {account, password} = req.body;

    if (!account || !password) {
        return res.send({
            type:'error',
            message:'登入資料不可為空。'
        });
    }

    try {
        const user = await userModel.findOne({ account, password });
        if (!user) {
            return res.send({
                type:'error',
                message:'帳號或密碼錯誤。'
            });
        }

        const loginTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        user.lastOnline = loginTime;

        // 使用者歷史資訊
        const history = historyGenerator(req);

        user.historyRecord = [
            ...(user.historyRecord || []),
            history
        ].slice(-100);

        await user.save();

        res.cookie('authToken',user.token,{
            maxAge:86400 * 1000 * 7, // 7 天
        })

        return res.send({
            type:'success',
            message:'登入成功！'
        });
        
    } catch (e) {
        console.log(e)
        return res.send({
            type:'error',
            message:'伺服器錯誤，請洽客服人員協助。'
        });
    }
});

// token 驗證
router.post('/login/token', async (req, res) => {
    const token = req.headers['x-user-token']
    const save = req.body.save;
    try {
        const user = await userModel.findOne({ token });
        if (!user) {
            return res.send({type:'error', message:'無效使用者，請重新登入', showAlert:true});
        }
  
        const loginTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        user.lastOnline = loginTime;

        // 使用者歷史資訊
        const history = historyGenerator(req);

        user.historyRecord = [
            ...(user.historyRecord || []),
            history
        ].slice(-100);

        if(save) await user.save();

        return res.send({
            type:'success',
            message:'登入成功！',
            showAlert: false
        });
    } 
    catch (e) {
        return res.send({type:'error', message:'伺服器錯誤' ,showAlert:true});
    }
});



module.exports = router;