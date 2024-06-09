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
    successRedirect: process.env.CLIENT_DASHBOARD_URI,
    failureRedirect: process.env.CLIENT_LOGIN_URI,
  })
);

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
      return res.status(200).json({ user: userData, token: newToken });
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
