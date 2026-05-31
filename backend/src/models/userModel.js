const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [ true , 'username is required' ],
        min: 3,
        max: 30,
    },
    email : {
        type : String,
        required : [ true , 'email is required' ],
        unique : true,
        min: 13,
    },
    password : {
        type : String,
        required : [ true , 'password is required' ],
        min : '6'
    },
    userImage : { type : String },
    linkedlnURL : { type : String },
    GithubURL : { type : String },

    resetPasswordToken : { type : String },
    resetPasswordExpire : { type : Date },
    
}, { timestamps : true });

const userModel = mongoose.model( 'users', userSchema );
module.exports = userModel;