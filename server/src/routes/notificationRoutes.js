const express = require("express");
const router = express.Router();
const { UserModel } = require("../models/UserModel"); 
const NotificationList = require("../models/NotificationModel");
const authenticateJWT = require("../middleware/authenticateJWT"); 

const authenticateJWT = passport.authenticate("jwt", { session: false });

router.get("/notifications", authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const notificationList = await NotificationList.findOne({ user: userId });

    if (!notificationList) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.status(200).json(notificationList.notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/notifications/read", authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const { notificationIds } = req.body; 

  try {
    const notificationList = await NotificationList.findOne({ user: userId });

    if (!notificationList) {
      return res.status(404).json({ message: "No notifications found" });
    }

    notificationList.notifications.forEach((notification) => {
      if (notificationIds.includes(notification._id.toString())) {
        notification.read = true;
      }
    });

    await notificationList.save();

    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
