const express = require("express");
const router = express.Router();

const {
  registerUser,
  getSessionHandler,
  loginUser,
} = require("../controllers/authControllers");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getSession", getSessionHandler);

module.exports = router;
