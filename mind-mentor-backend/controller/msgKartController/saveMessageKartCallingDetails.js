const msgKartCallingModel = require("../../model/msgkart/msgKartCallingModel");



const handleCDRCallback = async (req, res) => {
    try {
        const {
            CallSid,
            Status,
            RecordingUrl,
            ConversationDuration,
            StartTime,
            EndTime,
            Direction,
            To,
            From,
            Legs
        } = req.body;

        console.log("📞 CDR Callback received:", CallSid);

        const updatePayload = {
            callSid: CallSid,
            transactionId: CallSid, // fallback overwrite if different
            parentMobile: To,
            fromNumber: From,
            status: Status,
            direction: Direction,
            recordingUrl: RecordingUrl,
            conversationDuration: ConversationDuration,
            legs: Legs || [],
            rawCallbackData: req.body
        };

        if (StartTime) updatePayload.startTime = new Date(StartTime);
        if (EndTime) updatePayload.endTime = new Date(EndTime);

        const updatedRecord = await msgKartCallingModel.findOneAndUpdate(
            {
                $or: [
                    { transactionId: CallSid },
                    { callSid: CallSid }
                ]
            },
            { $set: updatePayload },
            { new: true, upsert: true }
        );

        console.log("✅ Call record saved/updated:", updatedRecord._id);

        return res.status(200).json({
            success: true,
            message: "Callback processed successfully"
        });

    } catch (error) {
        console.error("❌ Error processing callback:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = { handleCDRCallback };
