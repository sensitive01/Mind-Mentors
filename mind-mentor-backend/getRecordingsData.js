const axios = require("axios");

const meetingIDs = "class-9plvn7qy";

axios
  .get(
    `https://live.mindmentorz.in/api/new-class/get-recordings-link/${meetingIDs}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  .then((response) => {
    const { links } = response.data;

    console.log("Meeting Recordings:\n", links);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
