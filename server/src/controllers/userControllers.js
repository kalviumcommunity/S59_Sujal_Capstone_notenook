const { UserModel } = require("../models/UserModel");
const { NotificationListModel } = require("../models/NotificationModel");
const { FriendRequestModel } = require("../models/FriendRequestModel");
const { validateData } = require("../validation/validator");
const {
  userUpdateJoiSchema,
  passwordUpdateJoiSchema,
} = require("../validation/userJoiSchemas");

const getUserDetails = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userWithFriends = await UserModel.findById(user._id).populate({
      path: "friends",
      select: "username",
    });

    if (!userWithFriends) {
      return res.status(404).json({ message: "User not found" });
    }

    const notificationList = await NotificationListModel.findOne({
      user: user._id,
    })
      .populate({
        path: "userNotifications.relatedUser",
        select: "username",
      })
      .populate({
        path: "postNotifications.relatedUser",
        select: "username",
      })
      .populate({
        path: "postNotifications.relatedPost",
        select: "title content",
      });

    if (notificationList) {
      notificationList.userNotifications.sort(
        (a, b) => b.createdAt - a.createdAt
      );
      notificationList.postNotifications.sort(
        (a, b) => b.createdAt - a.createdAt
      );
    }

    const userData = {
      username: userWithFriends.username,
      fullname: userWithFriends.fullname,
      email: userWithFriends.email,
      numberOfNotes: userWithFriends.notes.length,
      numberOfConnections: userWithFriends.friends.length,
      friends: userWithFriends.friends,
      notifications: notificationList || {
        userNotifications: [],
        postNotifications: [],
      },
    };

    return res.status(200).json({ user: userData });
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.status(401).json({ message: "Unauthorized access" });
    } else if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getMyProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await UserModel.findById(req.user._id)
      .populate({
        path: "notes",
        select: "title subject updatedAt",
      })
      .populate({
        path: "postedNotes",
        select: "-postedBy",
      })
      .populate({
        path: "friends",
        select: "username",
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      numberOfNotes: user.notes.length,
      numberOfPostedNotes: user.postedNotes.length,
      numberOfConnections: user.friends.length,
      friends: user.friends,
      notes: user.notes,
      postedNotes: user.postedNotes,
    };

    return res.status(200).json({ user: userData });
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.status(401).json({ message: "Unauthorized access" });
    } else if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const viewUserDetails = async (req, res) => {
  try {
    const usrId = req.params.userId;
    const authenticatedUserId = req.user.id;

    const user = await UserModel.findById(usrId)
      .populate({
        path: "friends",
        select: "_id username",
      })
      .populate({
        path: "postedNotes",
        select: "-postedBy",
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendRequest = await FriendRequestModel.findOne({
      $or: [
        { sender: authenticatedUserId, receiver: usrId },
        { sender: usrId, receiver: authenticatedUserId },
      ],
    });

    let friendshipStatus = "none";

    if (friendRequest) {
      const requestStatus = friendRequest.status;
      if (requestStatus === "pending") {
        if (friendRequest.sender.toString() === authenticatedUserId) {
          friendshipStatus = "pending";
        } else if (friendRequest.receiver.toString() === authenticatedUserId) {
          friendshipStatus = "incoming";
        }
      } else if (requestStatus === "accepted") {
        friendshipStatus = "friends";
      }
    } else {
      const areFriends = user.friends.some(
        (friend) => friend._id.toString() === authenticatedUserId
      );
      if (areFriends) {
        friendshipStatus = "friends";
      }
    }

    const userData = {
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      numberOfNotes: user.postedNotes.length,
      numberOfConnections: user.friends.length,
      friendshipStatus: friendshipStatus,
      requestId: friendRequest?._id,
      friends: user.friends,
      postedNotes: user.postedNotes,
    };

    return res.status(200).json({ user: userData });
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.status(401).json({ message: "Unauthorized access" });
    } else if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, fullname, email } = req.body;

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
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Username is already taken" });
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      if (user.oauthId) {
        return res.status(400).json({
          message: "Cannot change email for accounts signed up using gmail.",
        });
      }
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
};

const updatePassword = async (req, res) => {
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
};

const searchUsers = async (req, res) => {
  try {
    const { searchInput } = req.query;

    if (!searchInput) {
      return res.status(400).json({ message: "Search input is required" });
    }

    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    const escapedSearchInput = escapeRegExp(searchInput);

    const query = {
      $and: [
        {
          $or: [
            { fullname: { $regex: escapedSearchInput, $options: "i" } },
            { username: { $regex: escapedSearchInput, $options: "i" } },
          ],
        },
        { _id: { $ne: req.user._id } },
      ],
    };

    const users = await UserModel.find(query).select("fullname username");
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUserDetails,
  getMyProfile,
  viewUserDetails,
  updateUser,
  updatePassword,
  searchUsers,
};
