import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Context } from "../App";

const useSocket = (room) => {
  const {
    user,
    currentMessage,
    setCurrentMessage,
    setMessages,
    setRooms,
    setUsers,
    setIsLoading,
    setTypingMessage,
    setIsTyping,
  } = useContext(Context);
  const socket = useRef();
  const navigate = useNavigate();
  let timer;
  let delayTimer = null;

  // socket setup
  useEffect(() => {
    // socket.current = io("http://localhost:5001", {
    //   auth: { token: user?.token },
    // });

    socket.current = io("https://socketio-mern-chat-app.herokuapp.com", {
      auth: { token: user.token },
    });

    socket.current.on("typing", (username) => {
      setIsTyping(true);
      clearTimeout(timer);
      setTypingMessage(`${username} is typing ...`);
      timer = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    });

    socket.current.on("stopTyping", () => {
      setIsTyping(false);
    });

    socket.current.on("message", (data) => {
      setMessages((messages) => [...messages, data]);
    });

    socket.current.on("roomData", (roomData) => {
      setMessages(roomData.messages);
      setUsers(roomData.users);
      setIsLoading(false);
    });

    socket.current.on("roomDoesNotExist", () => {
      alert("Room doesn't exist, would you like to create one?");
    });

    socket.current.on("availableRooms", (data) => {
      setRooms(data);
    });

    // unmount
    return () => {
      socket.current.disconnect();
    };
  }, []);

  // helpers
  const joinRoom = () => {
    socket.current.emit("joinRoom", { room, user }, (error) => {
      if (error) {
        alert(error.message);
        navigate("/chatroom");
      } else {
        socket.current.emit("getRoomData", (error) => {
          if (error) {
            alert(error.message);
          }
        });
      }
    });
  };

  const leaveRoom = () => {
    socket.current.emit("leaveRoom", (error) => {
      if (error) {
        alert(error.message);
      }
    });
  };

  const getAvailableRooms = () => {
    socket.current.emit("getAvailableRooms", (error) => {
      if (error) {
        alert(error.message);
      }
    });
  };

  const sendMessage = () => {
    socket.current.emit("stopTyping", room);

    if (currentMessage) {
      const message = {
        room: room,
        sender: user,
        text: currentMessage,
      };

      socket.current.emit("newMessage", message, (error) => {
        if (error) {
          alert(error.message);
        }
      });

      setCurrentMessage("");
    }
  };

  const handleTyping = (e) => {
    setCurrentMessage(e.target.value);

    if (delayTimer === null) {
      socket.current.emit("typing", room);
      delayTimer = setTimeout(() => {
        delayTimer = null;
      }, 500);
    }
  };

  const checkIfRoomExists = async (roomName) => {
    return new Promise((resolve) => {
      socket.current.emit("checkIfRoomExists", roomName, (roomExists) => {
        resolve(roomExists);
      });
    });
  };

  const createRoom = async (roomName) => {
    return new Promise((resolve) => {
      socket.current.emit("createRoom", {
        userId: user.result._id,
        roomName: roomName,
      });
      resolve(true);
    });
  };

  return {
    createRoom,
    checkIfRoomExists,
    handleTyping,
    sendMessage,
    getAvailableRooms,
    leaveRoom,
    joinRoom,
  };
};

export default useSocket;
