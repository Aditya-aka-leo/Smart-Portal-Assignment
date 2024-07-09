const SendPushNotification = async (msg) => {
    console.log("req came for push notification");
    console.log("msg: " + msg.message);
  };
  
module.exports = { SendPushNotification };