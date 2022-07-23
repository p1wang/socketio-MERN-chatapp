const mongoose = require("mongoose");

const message = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: String,
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", message);

module.exports = MessageModel;
