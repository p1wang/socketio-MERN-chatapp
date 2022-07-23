import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import decode from "jwt-decode";
import { createContext } from "react";

import "./App.css";
import Auth from "./components/AuthForm";
import ChatRoomPage from "./pages/ChatRoomPage";
import Layout from "./layout/Layout";
import ProfilePage from "./pages/ProfilePage";

export const Context = createContext();

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [roomData, setRoomData] = useState();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [typingMessage, setTypingMessage] = useState("");
  let location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("profile")));
    setShowMenu(false);

    // check token expiration
    const token = user?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp < new Date().getTime() / 1000) {
        localStorage.clear();
        navigate("/");
      }
    }
  }, [location]);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        users,
        setUsers,
        rooms,
        setRooms,
        showMenu,
        setShowMenu,
        isLoading,
        setIsLoading,
        roomData,
        setRoomData,
        messages,
        setMessages,
        isTyping,
        setIsTyping,
        currentMessage,
        setCurrentMessage,
        typingMessage,
        setTypingMessage,
      }}
    >
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              user ? <Navigate to={"/chatroom"} /> : <Navigate to={"/auth"} />
            }
          />
          <Route
            path="/auth"
            element={user ? <Navigate to={"/chatroom"} /> : <Auth />}
          />
          <Route
            path="/chatroom"
            element={user ? <ChatRoomPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/chatroom/:id"
            element={user ? <ChatRoomPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/auth" />}
          />
        </Routes>
      </Layout>
    </Context.Provider>
  );
}

export default App;
