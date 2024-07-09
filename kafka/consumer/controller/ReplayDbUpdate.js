const ReplayDb = require("../models/ReplayDb");

const ReplayDbUpdate = async (msg) => {
    try {

        let record = await ReplayDb.findOne({ user_id: msg.user_id, message: msg.message });

        if (record) {
            record.retries -= 1;

            if (record.retries <= 0) {
                await ReplayDb.deleteOne({ _id: record._id });
            } else {
                await record.save();
            }
        } else {
            const newRecord = new ReplayDb({ 
                user_id: msg.user_id, 
                message: msg.message, 
            });
            await newRecord.save();
        }
    } catch (error) {
        console.error("Error updating ReplayDb: ", error);
    }
};

module.exports = { ReplayDbUpdate };