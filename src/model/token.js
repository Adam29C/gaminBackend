const mongoose = require("mongoose");

const { Schema } = mongoose;
const tokenDataSchema = new Schema(
  {
    token: {
      type: String,
    },
    userId: {
      type: String,
    },
    deviceId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const tokenData = mongoose.model("tokenData", tokenDataSchema);

module.exports = tokenData;