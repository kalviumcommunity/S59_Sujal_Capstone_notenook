const express = require("express");
const router = express.Router();
const { UserModel } = require("../models/UserModel");
const passport = require("passport");

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

    newUser.setPassword(password);

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/login-failure", (req, res) => {
  res.status(401).send("Login failed. Please try again.");
});

router.get("/login-success", (req, res) => {
  res.status(200).send("Login success.");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/user/login-failure",
    successRedirect: "/user/login-success",
  })
);

module.exports = router;
