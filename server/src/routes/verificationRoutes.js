const express = require("express");
const router = express.Router();
const { UserModel } = require("../models/UserModel");
const passport = require("passport");

// verify session endpoint
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
