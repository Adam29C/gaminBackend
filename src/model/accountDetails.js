const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountDetailsSchema = new Schema({
  userId:{type:String},
  bank: [{
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String, required: true },
  }],
  upi: [{
    upiId: { type: String, required: true },
    upiName: { type: String, required: true },
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('accountDetail', accountDetailsSchema)