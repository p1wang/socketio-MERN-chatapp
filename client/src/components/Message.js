import React, { useContext, useState } from "react";
import Moment from "react-moment";
import { Context } from "../App";

import defaultAvatar from "../assets/images/default-avatar.jpeg";

const Message = ({ message, isSameSender }) => {
  const { user } = useContext(Context);
  const isSender = message.sender._id === user.result._id;

  return (
    <div
      className={
        isSender
          ? "p-3 flex justify-start overflow-hidden"
          : "p-3 flex justify-end overflow-hidden"
      }
    >
      <div className="w-10/12">
        {!isSameSender && (
          <div
            className={
              message.sender._id === user.result._id
                ? "flex items-center gap-2"
                : "flex items-center gap-2 flex-row-reverse"
            }
          >
            <img
              src={
                message.sender.avatar ? message.sender.avatar : defaultAvatar
              }
              alt="avatar"
              className="inline-block h-10 w-10 rounded-full mr-2 shadow-md cursor-pointer object-cover"
            />

            <span className="text-cyan-500">{`${message.sender.username}: `}</span>
            <Moment format="hh:mm:ss" className="font-light text-xs">
              {message.createdAt}
            </Moment>
          </div>
        )}

        <div
          className={
            isSender
              ? "w-fit mr-auto bg-gray-200 rounded-xl mt-3 relative"
              : "w-fit ml-auto bg-sky-500 text-white rounded-xl mt-3 relative"
          }
        >
          <p className="px-4 py-2 break-words w-fit">{`${message.text} `}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
