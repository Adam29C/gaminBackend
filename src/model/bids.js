const mongoose = require('mongoose');
const { Schema } = mongoose;

const bidsSchema = new Schema({
    userId: {
        type: String,
    },
    bidAmount: {
        type: Number,
    },
    bidParsent: {
        type: Number
    },
    winingAmount: {
        type: Number
    },
    teamid: {
        type: String,
    },
    teamName: {
        type: String,
    },
    selectOptionid: {
        type: String,
    },
    selectOptionName: {
        type: String,
    },
    isWin: {
        type: Boolean,
    },
    status: {
        type: String,
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('bids', bidsSchema)