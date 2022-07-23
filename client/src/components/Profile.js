import React, { useContext, useState } from "react";

import { Context } from "../App";
import defaultAvatar from "../assets/images/default-avatar.jpeg";
import UpdateUserModal from "./UpdateUserModal";

const Profile = () => {
  const { user } = useContext(Context);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center mt-5">
      <img
        src={user.result.avatar ? user.result.avatar : defaultAvatar}
        width="60px"
        height="60px"
        alt="avatar"
        className="mb-5 w-24 h-24 rounded-full shadow-md object-cover"
      />
      <span>{user.result.username}</span>

      <button
        onClick={() => {
          setOpen(true);
        }}
        className="w-32 px-3 py-2 mt-5 rounded text-white bg-gray-800 hover:bg-gray-900"
      >
        Edit
      </button>

      <UpdateUserModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
