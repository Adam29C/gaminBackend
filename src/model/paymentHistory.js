const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentHistorySchema = new Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('paymentHistory', paymentHistorySchema);
