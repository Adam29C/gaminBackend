const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentHistorySchema = new Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['accept', 'pending', 'decline'], 
    default: 'pending' 
  },
  isBank:{type: Boolean, required: true},
  accountId:{type:String,required: true},
  paymentStatus: { 
    type: String, 
    enum: ['debit', 'credit'] 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('paymentHistory', paymentHistorySchema);
