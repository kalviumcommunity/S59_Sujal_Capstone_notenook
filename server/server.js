// initializing dotenv and passport strategies
require("dotenv").config();
require("./src/auth/LocalStrategy");
require("./src/auth/JwtStrategy");
require("./src/auth/GoogleOAuth");

// importing packages
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const app = express();

const port = process.env.PORT || 3000;

// connecting to db
const { connectDB } = require("./src/connection/dbConnection");
connectDB();

// creating a server
const server = http.createServer(app);

// setting up middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: process.env.CLIENT_URI,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Initialize express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000,
      httpOnly: true,
      sameSite: "strict",
    },
  })
);

// Initialize Passport and restore authentication state\
app.use(passport.initialize());
app.use(passport.session());

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
const googleAuthRouter = require("./src/routes/googleOAuthRoutes");
const verificationRouter = require("./src/routes/verificationRoutes");

app.use("/user", userRouter);
app.use("/note", noteRouter);
app.use("/verification", verificationRouter);
app.use("/auth", googleAuthRouter);

// setting up the server to listen
app.get("/", (req, res) => {
  res.send("This is the root endpoint.......");
});

server.listen(port, () => {
  console.log(`App listening at port: ${port}`);
});
