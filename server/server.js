require("dotenv").config();
require("./src/auth/localStrategy");

const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

const mongoose = require("mongoose");

const passport = require("passport");

const expressSession = require("express-session");

const userRouter = require("./src/routes/userRoutes");

const { connectDB } = require("./src/connection/dbConnection");
connectDB();

app.use(express.json());
app.use(
  expressSession({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("This is a basic Test Route");
});

mongoose.connection.once("open", () => {
  app.listen(port, () => {
    console.log(`App listening at port: ${port}`);
  });
});
