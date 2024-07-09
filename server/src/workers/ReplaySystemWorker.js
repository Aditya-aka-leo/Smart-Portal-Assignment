const cron = require("node-cron");
const ReplayDb = require("../models/ReplayDb");
const { produceMessage } = require("../utils/kafka/Producer");

const ExtractFromDb = async () => {
  try {
    console.log("Extracting from db");
    const data = await ReplayDb.find({});

    data.forEach(async (msg) => {
      try {
          await produceMessage("Push-Notification", msg)
        }catch (error) {
        console.error("Error processing message:", error);
      }
    });
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
  }
};

module.exports = () => {
  cron.schedule("*/30 * * * *", () => {
    console.log("Running cron job...");
    ExtractFromDb();
  });
};
