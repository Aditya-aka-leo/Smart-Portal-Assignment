const mongoose_user = require("mongoose");

const ReplayDb = mongoose_user.Schema({
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
  retries : {
    type: Number,
    default : 3
  }
});

module.exports = mongoose_user.model("ReplayDb",ReplayDb );