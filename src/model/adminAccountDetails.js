const mongoose = require('mongoose');
const { Schema } = mongoose;
const accountDetailsSchema = new Schema({
  adminId: { type: String },
  bank: [{
    accountNumber: { type: String, required: true },
    accountHolderName:{ type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String, required: true },
    isBank: { type: String, require: true },
    bankImage :{type: String}
  }],   
  upi: [{
    upiId: { type: String, required: true },
    upiName: { type: String, required: true },
    isBank: { type: String, require: true },
    barCodeImage:{ type: String }

  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('adminAccountDetail', accountDetailsSchema)