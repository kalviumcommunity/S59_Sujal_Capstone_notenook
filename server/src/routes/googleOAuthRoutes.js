const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const { UserModel } = require("../models/UserModel");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_LOGIN_URI,
  }),
  (req, res) => {
    const user = req.user;
    if (user.username === user.oauthId) {
      res.redirect("set-username");
    } else {
      res.redirect(process.env.CLIENT_DASHBOARD_URI);
    }
  }
);

router.get("/google/set-username", (req, res) => {
  if (!req.isAuthenticated() || req.user.username !== req.user.oauthId) {
    return res.redirect(process.env.CLIENT_URI);
  }
  res.render("register", {
    user: req.user,
    error: null,
    homeUrl: process.env.CLIENT_URI,
  });
});

const UserModel = require("./path/to/userModel"); // Import the UserModel

router.post("/google/set-username", async (req, res) => {
  try {
    if (!req.isAuthenticated() || req.user.username !== req.user.oauthId) {
      return res.redirect(process.env.CLIENT_DASHBOARD_URI);
    }

    const { username } = req.body;

    if (!username || username.trim().length === 0) {
      return res.render("set-username", {
        user: req.user,
        error: "Username cannot be empty.",
      });
    }

    const existingUser = await UserModel.findOne({ username });
    if (
      existingUser &&
      existingUser._id.toString() !== req.user._id.toString()
    ) {
      return res.render("set-username", {
        user: req.user,
        error: "Username already exists. Please choose a different one.",
      });
    }

    const result = await UserModel.updateOne(
      { _id: req.user._id },
      { $set: { username: username } }
    );

    if (result.modifiedCount > 0) {
      res.redirect(process.env.CLIENT_DASHBOARD_URI);
    } else {
      res.status(404).json({ message: "User not found or username unchanged" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/getSession", async (req, res) => {
  try {
    let userId;
    let username;
    let newToken;

    if (req.session.passport && req.session.passport.user) {
      userId = req.session.passport.user;
      const user = await UserModel.findById(userId);
      if (user) {
        username = user.username;
        newToken = jwt.sign({ userId, username }, process.env.SECRET_KEY, {
          expiresIn: "12hr",
        });
      }
    } else {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
          const decoded = jwt.verify(token, process.env.SECRET_KEY);
          userId = decoded.userId;
          username = decoded.username;
        } catch (error) {
          return res.status(401).json({ message: "Invalid or expired token" });
        }
      } else {
        return res
          .status(401)
          .json({ message: "Authorization header missing" });
      }
    }

    if (!userId) {
      return res.status(401).json({ message: "Login first please" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      numberOfNotes: user.notes.length,
      numberOfConnections: user.friends.length,
    };

    if (newToken) {
      return res.status(200).json({ user: userData, newToken });
    } else {
      return res.status(200).json({ user: userData });
    }
  } catch (error) {
    console.error("Error fetching session:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/google/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logged out" });
  });
});

module.exports = router;
