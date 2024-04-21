require("dotenv").config();

const express = require("express");
const router = express.Router();
const { UserModel } = require("../models/UserModel");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { updateSchema, userJoiSchema } = require("../validation/userJoiSchemas");
const { validateData } = require("../validation/validator");

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

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.SECRET_KEY, {
      expiresIn: "1hr",
    });

    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = user._doc;

    delete userData.password;

    res.status(200).json({ user: userData, token });
  }
);

router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { error, value } = validateData(req.body, updateSchema);
      if (error) {
        return res
          .status(400)
          .json({ message: error.details.map((detail) => detail.message) });
      }
      console.log(req.body.password);
      const isPasswordValid = await user.validatePassword(req.body.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      if (req.body.username) {
        user.username = req.body.username;
      }
      if (req.body.fullname) {
        user.fullname = req.body.fullname;
      }
      if (req.body.newPassword) {
        await user.setPassword(req.body.newPassword);
      }

      await user.save();

      res.json({ message: "User data updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.post(
  "/verifySession",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.user.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
);


module.exports = router;
