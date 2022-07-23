const RoomModel = require("../models/roomModel.js");

const { getRoomData } = require("../utils/user.js");
const { saveMessage } = require("../utils/message.js");

module.exports = (io, socket) => {
  let currentRoomName;
  let currentUser;

  // send message
  socket.on("newMessage", async (message, callback) => {
    try {
      const newMessage = await saveMessage(
        message.sender.result._id,
        message.text,
        message.room
      );

      io.in(message.room).emit("message", await newMessage.populate("sender"));
    } catch (error) {
      callback({ message: "Please sign in" });
    }
  });

  // join room
  socket.on("joinRoom", async (options, callback) => {
    const { room, user } = options;
    currentRoomName = room;
    currentUser = user;

    try {
      let room = await RoomModel.findOne({ name: currentRoomName });

      socket.join(currentRoomName);

      const inRoom = await RoomModel.findOne({
        name: currentRoomName,
        users: currentUser.result._id,
      });

      if (!inRoom) {
        room.users.push(currentUser.result._id);
        await RoomModel.findOneAndUpdate({ name: currentRoomName }, room);
      }

      // update room data to everyone in the room
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

      socket.broadcast.to(currentRoomName).emit("roomData", roomData);

      callback();
    } catch (error) {
      callback({ message: "Something went wrong." });
    }
  });

  // check if room exists
  socket.on("checkIfRoomExists", async (roomName, callback) => {
    let room = await RoomModel.findOne({ name: roomName });

    if (room) {
      callback(true);
    } else {
      callback(false);
    }
  });

  // create new room
  socket.on("createRoom", async (options) => {
    const { roomName, userId } = options;

    const newRoom = new RoomModel({
      socketId: socket.id,
      name: roomName,
      users: [userId],
      messages: [],
    });
    await newRoom.save();
  });

  // user is typing
  socket.on("typing", (room) =>
    io.in(room).emit("typing", currentUser.result.username)
  );

  // user stops typing
  socket.on("stopTyping", (room) => {
    io.in(room).emit("stopTyping");
  });

  // get messages
  socket.on("getRoomData", async (callback) => {
    try {
      const roomData = await getRoomData(currentRoomName);

      socket.emit("roomData", roomData);
    } catch (error) {
      callback({ message: "Something went wrong." });
    }
  });

  // get rooms
  socket.on("getAvailableRooms", async (callback) => {
    try {
      const rooms = await RoomModel.find()
        .select({
          name: 1,
          _id: 1,
          users: 1,
        })
        .populate("users");

      socket.emit("availableRooms", rooms);
    } catch (error) {
      callback({ message: "Something went wrong." });
    }
  });

  socket.on("leaveRoom", async (callback) => {
    try {
      if (currentUser && currentRoomName) {
        await RoomModel.updateMany({
          $pull: { users: currentUser.result._id },
        });

        socket.leave(currentRoomName);

        // update room data to everyone in the room
        const roomData = await getRoomData(currentRoomName);

        socket.broadcast.to(currentRoomName).emit("roomData", roomData);
      }
    } catch (error) {
      callback({ message: "Something went wrong." });
    }
  });

  // disconnect
  socket.on("disconnect", async () => {
    try {
      console.log("-------------");
      console.log("disconnected");

      if (currentRoomName) {
        // remove user that left
        await RoomModel.findOneAndUpdate(
          { name: currentRoomName },
          {
            $pull: { users: currentUser.result._id },
          }
        );

        // update room data to everyone in the room
        const roomData = await getRoomData(currentRoomName);

        socket.broadcast.to(currentRoomName).emit("roomData", roomData);
      }
    } catch (error) {
      console.log(error);
    }
  });
};
