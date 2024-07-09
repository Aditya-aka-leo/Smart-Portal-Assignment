const mongoose_user = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  console.log(`MongoDB URI: ${process.env.MONGO_API_KEY_USERS}`);
  try {
    return mongoose_user.connect(process.env.MONGO_API_KEY_USERS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database.");
  } catch (err) {
    console.error("Could not connect to database.");
    console.error(err);
  }
};
module.exports = { connectDB };
