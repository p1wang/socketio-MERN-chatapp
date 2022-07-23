import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import Modal from "./Modal";

const Search = ({ checkIfRoomExists, createRoom }) => {
  const { register, handleSubmit, reset } = useForm();
  const [open, setOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const { rooms } = useContext(Context);

  const handleFilter = (e) => {
    const searchKeyword = e.target.value;

    if (searchKeyword) {
      const filteredData = rooms.filter((room) => {
        return room.name.toLowerCase().includes(searchKeyword.toLowerCase());
      });
      setFilteredData(filteredData);
    } else {
      setFilteredData("");
    }
  };

  const onSubmit = async (formData) => {
    const roomExists = await checkIfRoomExists(formData.room);

    if (roomExists) {
      navigate(`/chatroom/${formData.room}`);
    } else {
      setNewRoomName(formData.room);
      console.log(formData.room);
      setOpen(true);
    }

    reset();
  };

  return (
    <div className="m-4">
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex border border-gray-300 overflow-hidden rounded"
        >
          <input
            {...register("room")}
            type="text"
            required
            autoComplete="off"
            className="px-4 py-2 w-full outline-0 bg-slate-50"
            placeholder="Search..."
            onChange={handleFilter}
          />
          <button
            type="submit"
            className="px-3 py-2 border-l hover:text-cyan-500"
          >
            Join
          </button>
        </form>
      </div>

      {filteredData.length != 0 && (
        <div>
          <ul className="w-full flex flex-col border border-t-0 border-gray-300 rounded">
            {filteredData.slice(0, 5).map((room) => (
              <li
                key={room._id}
                className="px-4 py-2 hover:bg-sky-100 cursor-pointer"
                onClick={() => {
                  navigate(`/chatroom/${room.name}`);
                }}
              >
                {room.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal
        open={open}
        setOpen={setOpen}
        createRoom={createRoom}
        newRoomName={newRoomName}
      />
    </div>
  );
};

export default Search;
