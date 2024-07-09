const Users = require("../models/UsersSchema");
const Notification = require("../models/NotificationsSchema");
const { produceMessage } = require("../utils/producer");

const QueryOnlineUser = async (msg) => {
  try {
    if (msg.status === "offline") {
      const result = await Users.findOneAndUpdate(
        { _id: msg.user_id },
        { $set: { connected: false } },
        { returnDocument: "after" }
      );
      console.log(`User ${msg.user_id} connection status updated to offline.`);
    } else {
      const result = await Users.findOneAndUpdate(
        { _id: msg.user_id },
        { $set: { connected: true } },
        { returnDocument: "after" }
      );
      console.log(`User ${msg.user_id} connection status updated to online.`);
      const all_notifications = await Notification.find({
        user_id: msg.user_id,
        read: false,
      });

      if (all_notifications.length === 0) {
        console.log(`No notifications found for user ${msg.user_id}`);
        return;
      }

      for (const notification of all_notifications) {
        try {
          await produceMessage("Push-Notification", notification);
          console.log("Pushed Into Push-Notification Queue Successfully");
        } catch (err) {
          console.error(
            "Error Sending Payload To Push-Notification Queue",
            err
          );
        }
      }
    }
  } catch (e) {
    console.error("Error Querying Online User", e);
  }
};

module.exports = { QueryOnlineUser };
