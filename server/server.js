require("dotenv").config();
require("./src/auth/localStrategy");
require("./src/auth/JwtStrategy");

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const { textEditorSocket } = require("./src/socketHandlers/textEditorSocket");
const cors = require("cors");

const port = process.env.PORT || 3000;
const userRouter = require("./src/routes/userRoutes");
const noteRouter = require("./src/routes/noteRoutes");
const mongoose = require("mongoose");
const { connectDB } = require("./src/connection/dbConnection");
connectDB();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

textEditorSocket(io);

app.use("/user", userRouter);
app.use("/note", noteRouter);

app.get("/", (req, res) => {
  res.send("This is the root endpoint.......");
});

mongoose.connection.once("open", () => {
  app.listen(port, () => {
    console.log(`App listening at port: ${port}`);
  });
});
