require("dotenv").config();

const express = require("express");
const router = express.Router();
const { UserModel } = require("../models/UserModel");
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    const existingEmail = await UserModel.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const newUser = new UserModel({
      username: username,
      fullname: fullname,
      email: email,
    });

    await newUser.setPassword(password);
    console.log(newUser);
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token });
  }
);

module.exports = router;
