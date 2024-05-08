require("dotenv").config();

const express = require("express");
const router = express.Router();
const { UserModel } = require("../models/UserModel");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const {
  userUpdateJoiSchema,
  userJoiSchema,
  passwordUpdateJoiSchema,
} = require("../validation/userJoiSchemas");
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

router.get(
  "/userDetails",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      const userData = {
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        numberOfNotes: user.notes.length,
        numberOfConnections: user.friends.length,
      };

      return res.status(200).json({ user: userData });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

router.patch(
  "/update",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { username, fullname, email, password } = req.body;

      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const { error } = validateData(
        { username, fullname, email },
        userUpdateJoiSchema
      );
      if (error) {
        return res
          .status(400)
          .json({ message: error.details.map((detail) => detail.message) });
      }

      if (username && username !== user.username) {
        const existingUser = await UserModel.findOne({ username });
        if (
          existingUser &&
          existingUser._id.toString() !== user._id.toString()
        ) {
          return res.status(400).json({ message: "Username is already taken" });
        }
        user.username = username;
      }

      if (email && email !== user.email) {
        const existingEmail = await UserModel.findOne({ email });
        if (
          existingEmail &&
          existingEmail._id.toString() !== user._id.toString()
        ) {
          return res.status(400).json({ message: "Email is already taken" });
        }
        user.email = email;
      }

      if (fullname) {
        user.fullname = fullname;
      }

      await user.save();

      res.json({ message: "User data updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.patch(
  "/update/password",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, newPassword } = req.body;

      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const { error } = validateData(
        { password, newPassword },
        passwordUpdateJoiSchema
      );

      if (error) {
        return res
          .status(400)
          .json({ message: error.details.map((detail) => detail.message) });
      }

      await user.setPassword(newPassword);
      await user.save();

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
