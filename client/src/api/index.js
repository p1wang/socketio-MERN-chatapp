import axios from "axios";

// const API = axios.create({ baseURL: "http://localhost:5001" });

const API = axios.create({
  baseURL: "https://socketio-mern-chat-app.herokuapp.com",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

// users
export const signUp = (formData) => API.post("/users/signup", formData);
export const signIn = (formData) => API.post("/users/signin", formData);
export const updateUser = ({ formData, id }) =>
  API.patch(`/users/${id}`, formData);

// chat
export const getMessages = (formData) => API.get("/messages", formData);
