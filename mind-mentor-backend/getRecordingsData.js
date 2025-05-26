const axios = require("axios");

const meetingIDs = [
  "class-qeuidcda",
];

axios
  .post(
    "http://localhost:3000/api/new-class/get-recordings-link",
    {
      meetingIDs,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  .then((response) => {
    const { links } = response.data;

    if (!Array.isArray(links)) {
      console.error("Unexpected response format:", response.data);
      return;
    }

    const result = meetingIDs.map((id, index) => ({
      meetingID: id,
      recordingLink: links[index] || "No recording available",
    }));

    console.log("Meeting Recordings:\n", result);
  })
  .catch((error) => {
    console.error("Error:", error.response?.data || error.message);
  });
