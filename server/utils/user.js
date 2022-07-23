const RoomModel = require("../models/roomModel");

const getRoomData = async (currentRoomName) => {
  const roomData = await RoomModel.findOne({
    name: currentRoomName,
  }).populate([
    {
      path: "messages",
      populate: { path: "sender" },
    },
    {
      path: "users",
    },
  ]);

  return roomData;
};

module.exports = {
  getRoomData,
};
