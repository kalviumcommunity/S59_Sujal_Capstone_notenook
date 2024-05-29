const express = require("express");
const router = express.Router();
const passport = require("passport");
const { FriendRequestModel } = require("../models/FriendRequestModel");
const { UserModel } = require("../models/UserModel");
const { NotificationListModel } = require("../models/NotificationModel");

const authenticateJWT = passport.authenticate("jwt", { session: false });

const { addNotification } = require("../functions/AddNofitications");

router.post("/sendFriendRequest", authenticateJWT, async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user.id;

  try {
    const existingRequest = await FriendRequestModel.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const existingFriendship = await UserModel.findOne({
      _id: senderId,
      friends: receiverId,
    });
    if (existingFriendship) {
      return res.status(400).json({ message: "You are already friends" });
    }

    const friendRequest = new FriendRequestModel({
      sender: senderId,
      receiver: receiverId,
    });
    await friendRequest.save();

    await UserModel.findByIdAndUpdate(receiverId, {
      $push: { friendRequests: friendRequest._id },
    });

    await addNotification(
      receiverId,
      `${req.user.username} sent you a friend request.`,
      "friends",
      senderId
    );

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post(
  "/acceptFriendRequest/:requestId",
  authenticateJWT,
  async (req, res) => {
    const requestId = req.params.requestId;
    const userId = req.user.id;

    try {
      const friendRequest = await FriendRequestModel.findById(requestId);
      if (!friendRequest || friendRequest.receiver.toString() !== userId) {
        return res.status(404).json({ message: "Friend request not found" });
      }

      if (friendRequest.status !== "pending") {
        return res
          .status(400)
          .json({ message: "Friend request is not pending" });
      }

      friendRequest.status = "accepted";
      await friendRequest.save();

      await UserModel.findByIdAndUpdate(userId, {
        $push: { friends: friendRequest.sender },
      });
      await UserModel.findByIdAndUpdate(friendRequest.sender, {
        $push: { friends: userId },
      });

      await FriendRequestModel.findByIdAndDelete(requestId);

      await addNotification(
        friendRequest.sender,
        `${req.user.username} accepted your friend request.`,
        "friends",
        userId
      );

      res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/rejectFriendRequest/:requestId",
  authenticateJWT,
  async (req, res) => {
    const requestId = req.params.requestId;
    const userId = req.user.id;

    try {
      const friendRequest = await FriendRequestModel.findById(requestId);
      if (!friendRequest || friendRequest.receiver.toString() !== userId) {
        return res.status(404).json({ message: "Friend request not found" });
      }

      if (friendRequest.status !== "pending") {
        return res
          .status(400)
          .json({ message: "Friend request is not pending" });
      }

      await FriendRequestModel.findByIdAndDelete(requestId);

      await UserModel.findByIdAndUpdate(userId, {
        $pull: { friendRequests: requestId },
      });

      res.status(200).json({ message: "Friend request declined and deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.delete("/unsendFriendRequest", authenticateJWT, async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user.id;

  try {
    const friendRequest = await FriendRequestModel.findOneAndDelete({
      sender: senderId,
      receiver: receiverId,
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    await UserModel.findByIdAndUpdate(receiverId, {
      $pull: { friendRequests: friendRequest._id.toString() },
    });

    res.status(200).json({ message: "Friend request unsent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/removeFriend", authenticateJWT, async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.id;

  try {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { friends: friendId },
    });

    await UserModel.findByIdAndUpdate(friendId, {
      $pull: { friends: userId },
    });

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
