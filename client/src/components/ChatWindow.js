import React, { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import Message from "./Message";
import EmojiPicker from "./EmojiPicker";
import { useParams } from "react-router-dom";

const ChatWindow = ({
  sendMessage,
  handleTyping,
  isTyping,
  typingMessage,
  messages,
  currentMessage,
  setCurrentMessage,
}) => {
  const chatList = useRef(null);
  const chatContainer = useRef(null);
  const inputRef = useRef(null);
  const [isBottom, setIsBottom] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { id: room } = useParams();
  let prevMessage = null;
  let isSameSender = false;

  useEffect(() => {
    isBottom && scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatList.current.scrollIntoView({
      block: "end",
    });
  };

  const handleScroll = () => {
    if (chatContainer.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    }
  };

  const handleOnEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const onEmojiClick = (emojiObject) => {
    inputRef.current.focus();
    setShowEmojiPicker(false);
    setCurrentMessage(currentMessage + emojiObject.native);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {room && (
        <div className="bg-gray-200 p-2">
          <span className="text-slate-500">To:</span> {room.toUpperCase()}
        </div>
      )}
      {/* chat window */}
      <div
        className="flex flex-col gap-5 px-2 basis-full overflow-auto"
        ref={chatContainer}
        onScroll={handleScroll}
      >
        <ul ref={chatList}>
          {messages.map((message) => {
            if (prevMessage) {
              isSameSender = message.sender._id === prevMessage?.sender?._id;
            }

            prevMessage = message;
            return (
              <li key={message._id}>
                <Message message={message} isSameSender={isSameSender} />
              </li>
            );
          })}
        </ul>
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-5">
            <EmojiPicker onEmojiSelect={onEmojiClick} />
          </div>
        )}
      </div>

      <div className="h-7 mx-10 my-2">
        {isTyping && <span>{typingMessage}</span>}
      </div>

      {/* message box */}
      <div className="bg-slate-200 rounded-full m-6 mt-0 py-2 px-5 gap-5 flex items-center">
        <input
          type="text"
          ref={inputRef}
          value={currentMessage}
          onChange={handleTyping}
          onKeyPress={handleOnEnterKeyPress}
          placeholder="Start chatting"
          className="w-full bg-slate-200 text-lg outline-none"
        />

        <button
          onClick={() => {
            setShowEmojiPicker((showEmojiPicker) => !showEmojiPicker);
          }}
          className="bg-slate-200 font-light hover:text-cyan-500"
        >
          <BsEmojiSmile className="text-2xl" />
        </button>
        <button
          onClick={sendMessage}
          className="bg-slate-200 font-light hover:text-cyan-500"
        >
          <FiSend className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
