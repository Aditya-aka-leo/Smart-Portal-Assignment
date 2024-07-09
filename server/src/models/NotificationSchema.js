const mongoose_user = require("mongoose");

const Notification = mongoose_user.Schema({
  user_id: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose_user.model("Notification", Notification);
