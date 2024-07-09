const UserSchema = require("../models/UserSchema");
const NotificationSchema = require("../models/NotificationSchema");
const { produceMessage } = require("../utils/kafka/Producer");
const CreateNotification = async (req, res) => {
  try {
    flag = false;

    const user = await UserSchema.findOne({ _id: req.body.user_id });
    if (user["connected"] === true) flag = true;

    const NewNotification = await NotificationSchema.create({
      user_id: req.body.user_id,
      message: req.body.message,
      read: flag,
    });
    if (flag === true) {
      try {
        await produceMessage("Push-Notification", req.body);
        return res.json("Pushed Into Push Notification Queue Successfully");
      } catch (err) {
        console.log("Error Sending Payload To Push Notification Queue", err);
        return res.json(500).json({ error: err });
      }
    } else res.json("Pushed Into DB As The User Is Offline");
  } catch (err) {
    console.log("Error Finding Or Creating Notification", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const NotifyOnlineUser = async (req, res) => {
  try {
    await produceMessage("Notify-Online-Users", req.body);
    return res.json("Pushed Into Notify-Online-Users Queue Successfully");
  } catch (err) {
    console.log("Error Sending Payload To Notify-Online-Users Queue", err);
    return res.json(500).json({ error: err });
  }
};

const GetAllNotification = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notifications = await NotificationSchema.find({})
      .skip(skip)
      .limit(limit);

    const total = await NotificationSchema.countDocuments({});

    res.json({
      notifications,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalNotifications: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetNotificationDetails = async (req, res) => {
  try {
    console.log("Getting notification details");
    console.log(req.params.id);
    const notification = await NotificationSchema.findById(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const UpdateNotificationStatus = async (req, res) => {
  try {
    const notification = await NotificationSchema.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  CreateNotification,
  NotifyOnlineUser,
  GetAllNotification,
  GetNotificationDetails,
  UpdateNotificationStatus,
};
