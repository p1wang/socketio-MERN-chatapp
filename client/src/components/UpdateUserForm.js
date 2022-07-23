import React, { useContext } from "react";
import { useForm } from "react-hook-form";

import { Context } from "../App";
import * as api from "../api/index";
import convertToBase64 from "../utils/convertToBase64";

const UpdateUserForm = ({ setOpen }) => {
  const { user, setUser } = useContext(Context);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      username: user.result.username,
      avatar: user.result.avatar,
    },
  });

  const onSubmit = async (formData) => {
    let base64Avatar = formData.avatar;

    // if no changes were made
    if (!isDirty) {
      return;
    }

    if (formData.avatar !== user.result.avatar) {
      if (formData.avatar[0].size > 40000) {
        alert("File size too big, please use smaller image");
        return;
      }
      base64Avatar = await convertToBase64(formData.avatar[0]);
    }

    const updatedUser = await api.updateUser({
      formData: { ...formData, avatar: base64Avatar },
      id: user.result._id,
    });

    localStorage.setItem("profile", JSON.stringify(updatedUser?.data));
    setUser(JSON.parse(localStorage.getItem("profile")));
    setOpen(false);
    reset();
  };

  return (
    <div className="p-5 rounded-md shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <label htmlFor="avatar">New Avatar</label>
        <input {...register("avatar")} type="file" id="avatar" />
        <label htmlFor="username"> New Username</label>
        <input
          {...register("username")}
          type="text"
          id="username"
          required
          className="border-solid border border-slate-200 rounded px-3 py-2 bg-slate-50"
        />
        <button className="px-3 py-2 rounded text-white bg-gray-800 hover:bg-gray-900">
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateUserForm;
