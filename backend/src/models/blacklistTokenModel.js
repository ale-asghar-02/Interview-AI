const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
    token : {
        type : String,
        required : [ true , 'token is required']
    }
}, { timestamps : true });

const blacklistTokenModel = mongoose.model( 'blacklistToken', tokenBlacklistSchema );
module.exports = blacklistTokenModel;