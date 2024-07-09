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
      read: false,
    });
    if (flag === true) {
      try {
        await produceMessage("Push-Notification", NewNotification);
        return res.json({
          data: NewNotification,
          message: "Pushed Into Push Notification Queue Successfully",
          status: 201,
        });
      } catch (err) {
        console.log("Error Sending Payload To Push Notification Queue", err);
        return res.json(500).json({ error: err });
      }
    } else
      res.json({
        data: NewNotification,
        message: "Pushed Into DB As The User Is Offline",
        status: 201,
      });
  } catch (err) {
    console.log("Error Finding Or Creating Notification", err);
    return res.json({ error: "Internal Server Error", status: 500 });
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
    res.json({ message: error.message, status: 500 });
  }
};

const GetNotificationDetails = async (req, res) => {
  try {
    const notification = await NotificationSchema.findById(req.params.id);
    if (!notification)
      return res.json({ message: "Notification not found", status: 404 });

    res.json({
      data: notification,
      message: "Notification Details For All Authenticated Users",
      status: 200,
    });
  } catch (err) {
    res.json({ message: err.message, status: 500 });
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
      return res.json({ message: "Notification not found", status: 404 });

    res.json({
      data: notification,
      message: `Notification Details For Specific Notification Id : ${req.params.id}`,
      status: 200,
    });
  } catch (err) {
    res.status(500).json({ message: err.message, status: 500 });
  }
};
module.exports = {
  CreateNotification,
  NotifyOnlineUser,
  GetAllNotification,
  GetNotificationDetails,
  UpdateNotificationStatus,
};
