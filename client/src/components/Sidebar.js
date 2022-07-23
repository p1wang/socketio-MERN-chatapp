import React, { useContext } from "react";

import { Context } from "../App";
import Search from "./Search";
import User from "./User";

const Sidebar = ({ checkIfRoomExists, createRoom }) => {
  const { users } = useContext(Context);

  return (
    <div className="sm:block sm:w-96 hidden bg-white border-r border-gray-300">
      <Search checkIfRoomExists={checkIfRoomExists} createRoom={createRoom} />
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <User user={user} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
