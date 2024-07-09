const express = require("express");
const jwt = require("jsonwebtoken");
const { Register, Login, VerifyJwt } = require("../controller/User");
const {
  CreateNotification,
  NotifyOnlineUser,
  GetAllNotification,
  GetNotificationDetails,
  UpdateNotificationStatus,
} = require("../controller/Notification");

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/notifications", VerifyJwt, CreateNotification);
router.post("/notifyOnlineUser", NotifyOnlineUser);
router.get("/notifications", VerifyJwt, GetAllNotification);
router.get("/notifications/:id", VerifyJwt, GetNotificationDetails);
router.put("/notifications/:id", UpdateNotificationStatus);
// router.post("/create_user", Create_User);
// router.post("/notify", Notify_User_Prod);
// router.post("/delete_user", Delete_User);

module.exports = router;
