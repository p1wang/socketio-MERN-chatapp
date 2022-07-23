import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BsEyeSlash, BsEye } from "react-icons/bs";

import * as api from "../api";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const onSubmit = async (formData) => {
    if (isSignUp) {
      try {
        const { data } = await api.signUp(formData);
        localStorage.setItem("profile", JSON.stringify({ ...data }));
        navigate("/chatroom");
      } catch (error) {
        alert(error.response.data.message);
      }
    } else {
      try {
        const { data } = await api.signIn(formData);
        localStorage.setItem("profile", JSON.stringify({ ...data }));
        navigate("/chatroom");
      } catch (error) {
        console.log(error);
        alert(error.response.data.message);
      }
    }
    reset();
  };

  return (
    <div className="h-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 w-80 border border-gray-200 p-7 rounded-md shadow-md"
      >
        <div>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="border-solid border border-slate-200	rounded px-3 py-2 bg-slate-50 block mt-1 w-full"
            {...register("email")}
          />
        </div>

        {isSignUp && (
          <div>
            <label htmlFor="username">Username</label>
            <input
              name="username"
              type="text"
              required
              placeholder="Username"
              maxLength="20"
              className="border-solid border border-slate-200	rounded px-3 py-2 bg-slate-50 mt-1 w-full"
              {...register("username")}
            />
          </div>
        )}

        <div>
          <label htmlFor="password">Password</label>
          <div className="flex">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              required
              placeholder="Password"
              minLength="6"
              maxLength="20"
              className="border-y border-l border-solid border-slate-200 rounded-l px-3 py-2 bg-slate-50 mt-1 w-full"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => {
                setShowPass(!showPass);
              }}
              className="border-y border-r border-solid border-slate-200 rounded-r px-3 py-2 bg-slate-200 mt-1"
            >
              {showPass ? <BsEyeSlash size={24} /> : <BsEye size={24} />}
            </button>
          </div>
        </div>

        {isSignUp && (
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="flex">
              <input
                name="confirmPassword"
                type={showConfirmPass ? "text" : "password"}
                required
                minLength="6"
                maxLength="20"
                placeholder="Confirm Password"
                className="border-y border-l border-solid border-slate-200 rounded-l px-3 py-2 bg-slate-50 mt-1 w-full"
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => {
                  setShowConfirmPass(!showConfirmPass);
                }}
                className="border-y border-r border-solid border-slate-200 rounded-r px-3 py-2 bg-slate-200 mt-1"
              >
                {showConfirmPass ? (
                  <BsEyeSlash size={24} />
                ) : (
                  <BsEye size={24} />
                )}
              </button>
            </div>
            {errors.confirmPassword?.type === "validate" && (
              <p className="text-red-500">{errors.confirmPassword.message} </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="rounded px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
        {isSignUp ? (
          <span className="text-gray-500">
            Already a user?
            <button
              className="pl-2 text-blue-600 hover:underline"
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
          </span>
        ) : (
          <span className="text-gray-500">
            Don't have an account?
            <button
              className="pl-2 text-blue-600 hover:underline"
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </span>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
