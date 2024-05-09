const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String },
    mobileNumber: { type: Number,unique: true },
    password: { type: String },
    knowPassword: { type: String },
    otp: { type: Number },
    isVerified: { type: Boolean, default: false },
    createdBy: { type: String, default: "self" },
    role: { type: Number }, // Role will be defined for each user
    // Additional fields specific to admin
    userName: { type: String },
    // Additional fields specific to sub-admin
    email: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    permissions: {
        createGame: { type: Boolean, default: false },
        editGame: { type: Boolean, default: false },
        deleteGame: { type: Boolean, default: false },
        viewGame: { type: Boolean, default: false },
        createUser: { type: Boolean, default: false },
        viewUser: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
