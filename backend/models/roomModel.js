const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    room:{
        type: String,
        trim: true,
        default: '',
    },
    roomName:{
        type: String,
        trim: true,
        default: '甜蜜小屋',
    },
    owners:{ // 最多兩人
        type: Array,
        default: [],
    },
    database:{
        url:{
            type: String,
            trim: true,
            default: '',
        },
        limit:{
            memory: 1*1024*1024 // 預設 1GB
        }

    }
});


const roomModel = mongoose.model('Room', roomSchema);

module.exports = roomModel;
