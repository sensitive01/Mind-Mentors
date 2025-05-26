router.post("/get-recordings-link", async (req, res) => {
  const { meetingIDs } = req.body;

  try {
    if (!Array.isArray(meetingIDs)) {
      return res.status(400).json({ error: "meetingIDs should be an array" });
    }

    const recordingsLinks = [];

    for (const meetingID of meetingIDs) {
      const classRecord = await Class.findOne({ meetingID },{internalMeetingID:1});

      if (classRecord && classRecord.internalMeetingID) {
        const link = `https://class.mindmentorz.in/playback/presentation/2.3/${classRecord.internalMeetingID}`;
        recordingsLinks.push(link);
      }
    }

    console.log("recordingsLinks",recordingsLinks)

    res.status(200).json({ links: recordingsLinks });
  } catch (error) {
    console.error("Error in getting the recordings:", error);
    res.status(500).json({ error: "Failed to get the recordings" });
  }
});