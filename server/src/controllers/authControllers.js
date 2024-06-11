const { UserModel } = require("../models/UserModel");
const { userJoiSchema } = require("../validation/userJoiSchemas");
const { validateData } = require("../validation/validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    const { error } = validateData(
      { username, fullname, email, password },
      userJoiSchema
    );
    if (error) {
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
};

const loginUser = (req, res, next) => {
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

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SECRET_KEY,
      {
        expiresIn: "12hr",
      }
    );

    return res.status(200).json({ token });
  })(req, res, next);
};

const getSessionHandler = async (req, res) => {
  try {
    let userId;
    let username;
    let newToken;

    if (req.session?.passport?.user) {
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
};

module.exports = { registerUser, loginUser, getSessionHandler };
