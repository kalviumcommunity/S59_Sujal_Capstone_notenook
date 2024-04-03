require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {});
    console.log("📦 connected to mongoDB");
  } catch (error) {
    console.log("❌ error connecting to mongoDB: ", error.message);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("📦 disconnected from mongoDB");
  } catch (error) {
    console.log("❌ error disconnecting from mongoDB: ", error.message);
  }
};

module.exports = { connectDB, disconnectDB };
