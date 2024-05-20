const mongoose = require('mongoose');
const { Schema } = mongoose;

const ruleSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description:{type: String, required: true },
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },  
});

module.exports = mongoose.model('rule', ruleSchema);
