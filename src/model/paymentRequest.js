const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentRequestSchema = new Schema({
    userId: { type: String, required: true },
    amount: { type: Number },
    utr: { type: String },
    description: { type: String },
    status: {
        type: String,
        enum: ['approve', 'pending', 'decline'],
        default: 'pending'
    },
    imageUrl: { type: String },
    paymentStatus: {
        type: String,
        enum: ['debit', 'credit']
    },
    paymentHistoryId:{type:String}

}, {
    timestamps: true
});

module.exports = mongoose.model('paymentRequest', paymentRequestSchema);