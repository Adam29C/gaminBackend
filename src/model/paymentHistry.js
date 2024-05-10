const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameSchema = new Schema({
  gameName: { type: String ,require: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('game', gameSchema)