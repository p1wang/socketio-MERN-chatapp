import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

import { Context } from "../App";
import ChatWindow from "../components/ChatWindow";
import Loader from "../components/Loader";
import Sidebar from "../components/Sidebar";
import Drawer from "../components/Drawer";
import waitingRoomImage from "../assets/images/purr-7.png";
import useSocket from "../utils/useSocket";

const ChatRoomPage = () => {
  const {
    // room,
    user,
    setUsers,
    isLoading,
    setIsLoading,
    messages,
    setMessages,
    isTyping,
    setIsTyping,
    currentMessage,
    setCurrentMessage,
    typingMessage,
  } = useContext(Context);

  const location = useLocation();
  const { id: room } = useParams();

  const {
    createRoom,
    checkIfRoomExists,
    handleTyping,
    sendMessage,
    getAvailableRooms,
    leaveRoom,
    joinRoom,
  } = useSocket(room);

  useEffect(() => {
    setUsers([]);
    setMessages([]);
    setIsLoading(false);

    leaveRoom();

    getAvailableRooms();

    if (user && room) {
      setIsLoading(true);
      setTimeout(() => {
        joinRoom();
      }, 500);
    }
  }, [location]);

  return (
    <>
      <Drawer checkIfRoomExists={checkIfRoomExists} createRoom={createRoom} />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="h-full w-full flex">
          <Sidebar
            checkIfRoomExists={checkIfRoomExists}
            createRoom={createRoom}
          />
          {room ? (
            <ChatWindow
              sendMessage={sendMessage}
              handleTyping={handleTyping}
              isTyping={isTyping}
              setIsTyping={setIsTyping}
              typingMessage={typingMessage}
              messages={messages}
              currentMessage={currentMessage}
              setCurrentMessage={setCurrentMessage}
            />
          ) : (
            <div className="m-auto">
              <img src={waitingRoomImage} width="200px" alt="waiting room" />
              <p className="text-2xl font-thin m-auto">
                Not currently in any chat ...
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatRoomPage;
