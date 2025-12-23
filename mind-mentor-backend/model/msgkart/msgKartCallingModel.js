const mongoose = require("mongoose");

const msgKartCallingSchema = new mongoose.Schema({
    parentMobile: { type: String, index: true },
    fromNumber: String,

    transactionId: { type: String, index: true },
    callSid: { type: String, index: true },

    status: String, // INITIATED | completed | failed

    direction: String,

    startTime: Date,
    endTime: Date,

    conversationDuration: Number,

    recordingUrl: String,

    legs: Array,

    rawCallbackData: Object

}, { timestamps: true });

module.exports = mongoose.model("MsgKartCalling", msgKartCallingSchema);
