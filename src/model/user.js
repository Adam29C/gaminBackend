const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String },
    mobileNumber: { type: Number,unique: true },
    password: { type: String },
    knowPassword: { type: String },
    otp: { type: Number },
    isVerified: { type: Boolean, default: false },
    createdBy: { type: String, default: "self" },
    loginStatus: {type: String, default: "logOut"},
    role: { type: Number }, // Role will be defined for each user(admin-0,subAdmin-1,user-2)
    // Additional fields specific to admin
    userName: { type: String },
    // Additional fields specific to sub-admin
    email: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    //admin give the permissions to sub admin
    permissions: {
        createGame: { type: Boolean, default: false },
        editGame: { type: Boolean, default: false },
        deleteGame: { type: Boolean, default: false },
        viewGame: { type: Boolean, default: false },
        createUser: { type: Boolean, default: false },
        viewUser: { type: Boolean, default: false }
    },
    //For user Withdraw password 
    isWithdraw:{
       type:Boolean,
       default:false
    },
    withdrawalPassword:{ type:String},
    knowWithdrawalPassword:{type:String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
