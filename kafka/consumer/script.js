const { Kafka } = require("kafkajs");
const {
  SendPushNotification,
} = require("./controller/SendPushNotification.js");
const { QueryOnlineUser } = require("./controller/QueryOnlineUser.js");
const { ReplayDbUpdate } =  require("./controller/ReplayDbUpdate.js");
const kafka = new Kafka({
  brokers: ["kafka:9092"],
});

const consume = async (topic, consumer) => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  consumer
    .connect()
    .then(() => {
      console.log(`Consumer Connected To The ${topic} Queue`);
    })
    .catch((err) => {
      console.log(`Failed Consumer Connected To The ${topic} Queue`, err);
    });
};

const run_consumer = async (consumer, next_prod) => {
  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      const payload = JSON.parse(message.value.toString());
      // console.log("payload is : ", payload);
      console.log(`Msg Pulled From ${topic} Queue`);
      next_prod(payload);
    },
  });
};

const run = async () => {
  const Push_Notification_consumer = kafka.consumer({
    groupId: "Push-Notification",
  });
  const NotifyOnlineUser = kafka.consumer({
    groupId: "Notify-Online-Users",
  });
  const ReplayFailedNotification = kafka.consumer({
    groupId: "Replay-Failed-Notification",
  });

  await consume("Push-Notification", Push_Notification_consumer);
  await consume("Notify-Online-Users", NotifyOnlineUser);
  await consume("Replay-Failed-Notification",ReplayFailedNotification );

  run_consumer(Push_Notification_consumer, SendPushNotification);
  run_consumer(NotifyOnlineUser, QueryOnlineUser);
  run_consumer(ReplayFailedNotification,ReplayDbUpdate);

  await require("./utils/MongoClient.js").connectDB();
};

run();
