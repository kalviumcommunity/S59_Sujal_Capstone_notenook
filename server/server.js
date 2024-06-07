// initializing dotenv and passport strategies
require("dotenv").config();
require("./src/auth/LocalStrategy");
require("./src/auth/JwtStrategy");

// importing packages
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3000;

// creating a server
const server = http.createServer(app);

// setting up middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URI,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// creating a socket instance
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URI,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

// sockets with different namespaces
const textEditorNamespace = io.of("/text-editor");
const { textEditorSocket } = require("./src/socketHandlers/textEditorSocket");
textEditorSocket(textEditorNamespace);

//  setting up routes
const userRouter = require("./src/routes/userRoutes");
const noteRouter = require("./src/routes/noteRoutes");
const verificationRouter = require("./src/routes/verificationRoutes");

app.use("/user", userRouter);
app.use("/note", noteRouter);
app.use("/verification", verificationRouter);

// setting up the server to listen
app.get("/", (req, res) => {
  res.send("This is the root endpoint.......");
});

server.listen(port, () => {
  console.log(`App listening at port: ${port}`);
});
