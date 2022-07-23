const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const socketHandler = require("./listeners/socketHandler.js");
const usersRoutes = require("./routes/users.js");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

// socket setup
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    jwt.verify(token, "auth", (error, decoded) => {
      if (error) {
        next(new Error("Authentication error"));
      }
      // socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  socketHandler(io, socket);
});

//
app.use(express.json({ limit: "30MB", extended: true }));
app.use(express.urlencoded({ limit: "30MB", extended: true }));
app.use(cors());

app.use("/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Chat App");
});

const PORT = process.env.PORT || 5001;

// mongoose setup
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    server.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));
