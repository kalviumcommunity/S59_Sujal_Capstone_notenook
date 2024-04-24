require("dotenv").config();
require("./src/auth/localStrategy");
require("./src/auth/JwtStrategy");
require("dotenv").config();

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URI,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URI,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

const textEditorNamespace = io.of("/text-editor");
const { textEditorSocket } = require("./src/socketHandlers/textEditorSocket");
textEditorSocket(textEditorNamespace);

const port = process.env.PORT || 3000;
const userRouter = require("./src/routes/userRoutes");
const noteRouter = require("./src/routes/noteRoutes");

const mongoose = require("mongoose");
const { connectDB } = require("./src/connection/dbConnection");
connectDB();

app.use("/user", userRouter);
app.use("/note", noteRouter);

app.get("/", (req, res) => {
  res.send("This is the root endpoint.......");
});

server.listen(port, () => {
  console.log(`App listening at port: ${port}`);
});
