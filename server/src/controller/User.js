const UserSchema = require("../models/UserSchema");
const NotificationSchema = require("../models/NotificationSchema");
const jwt = require("jsonwebtoken");

const Register = async (req, res) => {
  try {
    const userExist = await UserSchema.findOne({ email: req.body.email });

    if (userExist) return res.json("User Already Exists");
    else {
      const newUser = await UserSchema.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        connected: req.body.connected,
      });

      return res.json({ data: newUser, message: "User Created", status: 200 });
    }
  } catch (err) {
    console.log("Error Finding Or Creating User", err);
    return res.json({ error: "Internal Server Error", status: 500 });
  }
};

const Login = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ error: "User not found", status: 404 });
    }
    const isMatch = await user.comparePassword(req.body.password);

    if (isMatch) {
      const token = jwt.sign({ user }, "privatekey", {
        expiresIn: "1h",
      });
      return res.json({
        data: token,
        message: "Login successful",
        status: 200,
      });
    } else {
      return res.json({ error: "Invalid credentials", status: 401 });
    }
  } catch (err) {
    console.log("Error Finding User", err);
    return res.json({ error: "Internal Server Error", status: 500 });
  }
};

const VerifyJwt = async (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    try {
      const authorizedData = await jwt.verify(header, "privatekey");
      req.authorizedData = authorizedData;
      next();
    } catch (err) {
      console.log("ERROR: Could not connect to the protected route", err);
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
};

module.exports = {
  Register,
  Login,
  VerifyJwt,
};
