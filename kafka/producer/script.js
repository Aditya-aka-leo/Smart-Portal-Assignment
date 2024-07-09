const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "Notify",
  brokers: ["kafka:9092"],
});
const producer = kafka.producer();

producer.connect();
