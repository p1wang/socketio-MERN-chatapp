const mongoose = require("mongoose");

const room = new mongoose.Schema({
  socketId: { type: String, unique: true, required: true },
  name: { type: String, unique: true, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const RoomModel = mongoose.model("Room", room);

module.exports = RoomModel;
