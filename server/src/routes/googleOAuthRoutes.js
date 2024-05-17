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

router.get("/google/getSession", async (req, res) => {
  if (req.session.passport) {
    const userId = req.session.passport.user;

    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: "1hr",
    });

    const user = await UserModel.findById(userId);
    
    const userData = {
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      numberOfNotes: user.notes.length,
      numberOfConnections: user.friends.length,
    };

    return res.status(200).json({ user: userData, token });
  } else {
    return res.status(401).json({ message: "Login first please" });
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
