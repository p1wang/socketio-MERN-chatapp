const mongoose = require("mongoose");

const conversation = new mongoose.Schema({
  socketId: { type: String, unique: true, required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const ConversationModel = mongoose.model("Conversation", conversation);

module.exports = ConversationModel;
