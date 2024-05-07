require("dotenv").config();

const express = require("express");
const router = express.Router();
const { UserModel } = require("../models/UserModel");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { updateSchema, userJoiSchema } = require("../validation/userJoiSchemas");
const { validateData } = require("../validation/validator");

// user register endpoint
router.post("/register", async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    const { error } = validateData(
      { username, fullname, email, password },
      userJoiSchema
    );
    if (error) {
      console.log(error);
      return res.status(400).json({ message: error.details });
    }

    const existingEmail = await UserModel.exists({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const existingUsername = await UserModel.exists({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const newUser = new UserModel({
      username,
      fullname,
      email,
    });

    await newUser.setPassword(password);

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// user login endpoint
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Error during authentication:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!user) {
      if (info && info.message === "Incorrect password") {
        return res
          .status(401)
          .json({ message: "Incorrect username or password" });
      } else if (info && info.message === "User not found") {
        return res.status(404).json({ message: "User not Found" });
      } else {
        return res.status(401).json({ message: "Authentication failed" });
      }
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1hr",
    });
    console.log("called");
    const userData = {
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      numberOfNotes: user.notes.length,
      numberOfConnections: user.friends.length,
    };
    console.log(userData);
    return res.status(200).json({ user: userData, token });
  })(req, res, next);
});

module.exports = router;
