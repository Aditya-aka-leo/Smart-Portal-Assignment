const { produceMessage } = require("../utils/producer");

const SendPushNotification = async (msg) => {
  try{ 
    console.log("trying to send push notification");
  }catch(err){
     try {
          await produceMessage("Replay-Failed-Notification", msg);
          console.log("Pushed Into Push-Notification Queue Successfully");
        } catch (err) {
          console.error(
            "Error Sending Payload To Push-Notification Queue",
            err
          );
        }

  }
    console.log("req came for push notification");
    console.log("msg: " + msg.message);
  };
  
module.exports = { SendPushNotification };