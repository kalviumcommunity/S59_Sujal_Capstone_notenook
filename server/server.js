require("dotenv").config();
require("./src/auth/localStrategy");
require("./src/auth/JwtStrategy");

const express = require("express");

const app = express();

const cors = require("cors");

const port = process.env.PORT || 3000;

const mongoose = require("mongoose");

const userRouter = require("./src/routes/userRoutes");

const { connectDB } = require("./src/connection/dbConnection");
connectDB();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("This is the root endpoint.......");
});

mongoose.connection.once("open", () => {
  app.listen(port, () => {
    console.log(`App listening at port: ${port}`);
  });
});
