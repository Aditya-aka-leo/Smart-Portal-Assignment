const { Kafka } = require("kafkajs");
const fs = require("fs");

const kafka = new Kafka({
  clientId: "Notify",
  brokers: ["kafka:9092"],
});

const topicConfigurations = [
  { topic: "Push-Notification", numPartitions: 1 },
  { topic: "Notify-Online-Users", numPartitions: 1 },
  { topic: "Replay-Failed-Notification", numPartitions: 1 },
];

const createTopics = async (admin) => {
  try {
    const data = await admin.listTopics();
    if (data.length != 0) {
      console.log("Topics Were Already Created");
      return;
    }
    await admin.createTopics({
      topics: topicConfigurations,
    });
    console.log("New topics created successfully");
  } catch (error) {
    console.error("Error creating topics:", error);
    throw error;
  }
};

const signalCompletion = () => {
  fs.writeFileSync("/tmp/admin_done", "done");
  console.log("Admin tasks completed, signaled completion");
};

const kafka_admin = async () => {
  const admin = kafka.admin();
  try {
    await admin.connect();
    console.log("Kafka Admin Connected Successfully");
    await createTopics(admin);
    signalCompletion();
  } catch (error) {
    console.error("Error connecting with Kafka Admin Client:", error);
  } finally {
    await admin.disconnect();
  }
};

kafka_admin().then(() => {
  console.log("Admin tasks finished, keeping process alive");
  // Keep the process running
  setInterval(() => {}, 1000);
});
