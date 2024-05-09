const mongoose = require('mongoose');

const waledSchema = new mongoose.Schema({
    userId: { type: String,unique: true },
    amount:{ type: Number,require: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Waled', waledSchema);