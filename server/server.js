// initializing dotenv and passport strategies
require("dotenv").config();
require("./src/auth/LocalStrategy");
require("./src/auth/JwtStrategy");
require("./src/auth/GoogleOAuth");

// importing packages
const express = require("express");
const http = require("http");
const { initializeSocketIO } = require("./src/socketHandlers/socketConfig");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const app = express();
const RedisStore = require("connect-redis").default;

const { redisClient } = require("./src/config/redisConfig");

const apolloServer = require("./src/graphql/apolloServer");

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "notenook:",
});

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
    store: redisStore,
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

// Initialize Passport and restore authentication state
app.use(passport.initialize());
app.use(passport.session());

// setting view engine
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Initialize Apollo Server
const { expressMiddleware } = require("@apollo/server/express4");

async function startApolloServer() {
  try {
    await apolloServer.start();
    app.use("/graphql", expressMiddleware(apolloServer));
    console.log(`Apollo Server ready at http://localhost:${port}/graphql`);
  } catch (error) {
    console.error("Failed to start Apollo Server:", error);
  }
}

startApolloServer();

// creating a socket instance
const io = initializeSocketIO(server);

// sockets with different namespaces
const textEditorNamespace = io.of("/text-editor");
const { textEditorSocket } = require("./src/socketHandlers/textEditorSocket");
textEditorSocket(textEditorNamespace);

const chatNamespace = io.of("/chat");
const { chatSocket } = require("./src/socketHandlers/chatSocket");
chatSocket(chatNamespace);

const AiChatNamespace = io.of("/aiChat");
const { aiChatSocket } = require("./src/socketHandlers/aiChatSocket");
aiChatSocket(AiChatNamespace);

// setting up routes
const authRouter = require("./src/routes/authRoutes");
const userRouter = require("./src/routes/userRoutes");
const noteRouter = require("./src/routes/noteRoutes");
const googleAuthRouter = require("./src/routes/googleOAuthRoutes");
const friendRequestRouter = require("./src/routes/friendRequestRoutes");
const messageRouter = require("./src/routes/messageRoutes");

const { rateLimiter } = require("./src/middlewares/rateLimiter");

// app.use(
//   rateLimiter({
//     excludedRoutes: ["/auth", "/google/auth", "/message"],
//     maxRequests: 30,
//     windowSizeInSeconds: 60,
//   })
// );

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/note", noteRouter);
app.use("/google/auth", googleAuthRouter);
app.use("/friendRequest", friendRequestRouter);
app.use("/message", messageRouter);

// setting up the server to listen
app.get("/", (req, res) => {
  res.send("This is the root endpoint.......");
});

server.listen(port, () => {
  console.log(`App listening at port: ${port}`);
});

const cron = require("node-cron");

const {
  sendReviewReminderEmail,
} = require("./src/utils/sendReviewRemainderEmail");

// Schedule the task to run every Sunday at 5 AM
cron.schedule("0 5 * * 0", async () => {
  try {
    await sendReviewReminderEmail();
    console.log("Review reminder emails sent successfully.");
  } catch (error) {
    console.error("Error sending review reminder emails:", error);
  }
});
