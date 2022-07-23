import React from "react";

import defaultAvatar from "../assets/images/default-avatar.jpeg";

const User = ({ user }) => {
  return (
    <div className="w-full flex items-center justify-between px-3 py-2 border-b border-gray-300">
      <img
        className="object-cover w-10 h-10 rounded-full ring-2 ring-blue-400"
        src={user.avatar ? user.avatar : defaultAvatar}
        alt="username"
      />
      <div>
        <span className="ml-5">{user.username}</span>
      </div>
    </div>
  );
};

export default User;
