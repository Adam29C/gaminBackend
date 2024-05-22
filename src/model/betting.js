const mongoose = require('mongoose');
const { Schema } = mongoose;

const bettingDetailsSchema = new Schema({
    userId: {
        type: String,
    },
    amount: {
        type: Number,
    },
    bettingParsent: {
        type: Number,
    },
    bettingType: {
        type: String,
    },
    bettingId: {
        type: String,
    },
    bettingOption: {
        type: String,
    },
    teamName: {
        type: String,
    },
    teamId: {
        type: String,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('bettingDetails', bettingDetailsSchema)