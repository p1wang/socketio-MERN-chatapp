const MessageModel = require("../models/messageModel");
const RoomModel = require("../models/roomModel");

const saveMessage = async (sender, text, roomName) => {
  const newMessage = new MessageModel({
    sender: sender,
    text: text,
  });

  await newMessage.save();

  let room = await RoomModel.findOne({ name: roomName });

  room.messages.push(newMessage._id);

  await RoomModel.findOneAndUpdate({ name: roomName }, room);

  return newMessage;
};

module.exports = {
  saveMessage,
};
