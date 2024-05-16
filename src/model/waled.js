const mongoose = require('mongoose');

const waledSchema = new mongoose.Schema({
    userId: { type: String,unique: true },
    amount:{ type: Number,require: true },
    debitBuffer:{type: Number,default:0},
    creditBuffer:{type: Number,default:0},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Waled', waledSchema);