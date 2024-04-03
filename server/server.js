require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000; 
const mongoose = require("mongoose");

const { connectDB } = require("./src/connection/dbConnection");
connectDB();

app.get("/", (req, res) => {
  res.send("This is a basic Test Route");
});


mongoose.connection.once("open", () => {
  app.listen(port, () => {
    console.log(`App listening at port: ${port}`);
  });
});
