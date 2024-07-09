const UserSchema = require("../models/UserSchema");
const NotificationSchema = require("../models/NotificationSchema");
const jwt = require("jsonwebtoken");

// const Relayer = require("../models/relayer");

const Register = async (req, res) => {
  try {
    const userExist = await UserSchema.findOne({ user_id: req.body.user_id });
    if (userExist) {
      return res.json("User Already Exists");
    } else {
      const newUser = await UserSchema.create({
        user_id: req.body.user_id,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        connected: req.body.connected,
      });
      return res.json("The New User Is Created Successfully");
    }
  } catch (err) {
    console.log("Error Finding Or Creating User", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const Login = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await user.comparePassword(req.body.password);

    if (isMatch) {
      const token = jwt.sign({ user }, "privatekey", {
        expiresIn: "1h",
      });
      return res.status(200).json({ message: "Login successful", token });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.log("Error Finding User", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// const replay_msg = async (msg) => {
//   try {
//     if (msg.retries === undefined) {
//       msg.retries = 0;
//     } else {
//       msg.retries = msg.retries + 1;
//     }
//     if (msg.retries <= 2) {
//       const newUser = Relayer.create({
//         content: msg.content,
//         services: {
//           sms: msg.services.sms,
//           email: msg.services.email,
//           ivr: msg.services.ivr,
//           push_notification: msg.services.push_notification,
//         },
//         email_subject: msg.email_subject,
//         email: msg.email,
//         number: msg.number,
//         push_socket: msg.push_socket,
//         retries: msg.retries,
//         priority: msg.priority,
//         createdAt: new Date(),
//       });
//     } else {
//       console.log("Max Retries Reached , Dropping The Request");
//     }
//   } catch (error) {
//     console.error("error replaying the msg into Db", error);
//   }
// };

const VerifyJwt = async (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    try {
      // console.log(header);
      const authorizedData = await jwt.verify(header, "privatekey");
      req.authorizedData = authorizedData; // Attach authorized data to the request object
      next(); // Call next to pass control to the next middleware
    } catch (err) {
      console.log("ERROR: Could not connect to the protected route", err);
      res.sendStatus(403); // Forbidden
    }
  } else {
    res.sendStatus(403); // Forbidden
  }
};

module.exports = {
  Register,
  Login,
  VerifyJwt,
};
