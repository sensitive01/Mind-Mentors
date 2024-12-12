// import axios from "axios";

// const CLIENT_ID = "1000.1UWQSW8I3GYQXMS8DU29HZ7X5SCH5N";
// const REDIRECT_URI = "http://localhost:5173/";
// const AUTH_URL = "https://accounts.zoho.com/oauth/v2/auth";
// const TOKEN_URL = "https://accounts.zoho.com/oauth/v2/token";
// const MEETING_API_URL = "https://meeting.zoho.com/api/v1/meetings";

// let accessToken = "";

// export const getAccessToken = async () => {
//     if (accessToken) return accessToken;
  
//     const authCode = new URLSearchParams(window.location.search).get("code");
//     if (!authCode) {
//       // Use the correct scope for Zoho Meeting API
//       const authRequestUrl = `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=ZohoMeeting.Meeting.Create,ZohoMeeting.Meeting.Read`; // Add necessary scopes
//       window.location.href = authRequestUrl;
//     } else {
//       const response = await axios.post(
//         TOKEN_URL,
//         {
//           grant_type: "authorization_code",
//           client_id: CLIENT_ID,
//           redirect_uri: REDIRECT_URI,
//           code: authCode,
//         },
//         { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
//       );
  
//       accessToken = response.data.access_token;
//       return accessToken;
//     }
//   };
  

// export const createMeeting = async (meetingDetails) => {
//   const token = await getAccessToken();

//   const response = await axios.post(
//     MEETING_API_URL,
//     {
//       title: meetingDetails.title,
//       agenda: meetingDetails.agenda,
//       start_time: meetingDetails.start_time,
//       duration: meetingDetails.duration,
//       timezone: meetingDetails.timezone,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   return response.data.data; // Includes `join_url`
// };

// Required dependencies
// npm install axios qs
import axios from "axios";
import qs from "qs";

const CLIENT_ID = "1000.1UWQSW8I3GYQXMS8DU29HZ7X5SCH5N"; // Replace with your client ID
const CLIENT_SECRET = "4757031cae854af4ed9e5fade4931a6fd6d15c2a01"; // Replace with your client secret
const REDIRECT_URI = "http://localhost:5173/"; // Replace with your redirect URI
const AUTH_URL = "https://accounts.zoho.com/oauth/v2/auth";
const TOKEN_URL = "https://accounts.zoho.com/oauth/v2/token";
const MEETING_API_URL = "https://meeting.zoho.com/api/v1/meetings";

let accessToken = "";
let refreshToken = "";

// Function to get access token
export const getAccessToken = async () => {
  if (accessToken) return accessToken;

  const authCode = new URLSearchParams(window.location.search).get("code");
  if (!authCode) {
    // Redirect to Zoho authorization URL
    const authRequestUrl = `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=ZohoMeeting.meeting.CREATE,ZohoMeeting.meeting.READ`;
    window.location.href = authRequestUrl;
  } else {
    try {
      const response = await axios.post(
        TOKEN_URL,
        qs.stringify({
          grant_type: "authorization_code",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          code: authCode,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      accessToken = response.data.access_token;
      refreshToken = response.data.refresh_token; // Save refresh token for future use
      return accessToken;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw new Error("Failed to get access token");
    }
  }
};

// Function to refresh access token
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      TOKEN_URL,
      qs.stringify({
        grant_type: "refresh_token",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw new Error("Failed to refresh access token");
  }
};

// Function to create a meeting
export const createMeeting = async (meetingDetails) => {
  try {
    const token = await getAccessToken();

    const response = await axios.post(
      MEETING_API_URL,
      {
        title: meetingDetails.title,
        agenda: meetingDetails.agenda,
        start_time: meetingDetails.start_time,
        duration: meetingDetails.duration,
        timezone: meetingDetails.timezone,
        participants: meetingDetails.participants,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data; // Includes meeting details such as join URL
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Token expired, refresh it
      await refreshAccessToken();
      return createMeeting(meetingDetails);
    } else {
      console.error("Error creating meeting:", error);
      throw new Error("Failed to create meeting");
    }
  }
};

// Example usage
const setupMeeting = async () => {
  const meetingDetails = {
    title: "Team Discussion",
    agenda: "Discuss project updates",
    start_time: "2024-12-12T10:00:00", // ISO 8601 format
    duration: 60, // in minutes
    timezone: "Asia/Kolkata",
    participants: [
      { email: "narayaneaadiraj@gmail.com", role: "HOST" },
      { email: "Aswinraj <aswinrajr07@gmail.com>", role: "ATTENDEE" },
      { email: "aadiraj1997@gmail.com", role: "ATTENDEE" },
      { email: "pujasamantaray45@gmail.com", role: "ATTENDEE" },
      { email: "prajapatipreeti271@gmail.com", role: "ATTENDEE" },
    ],
  };

  try {
    const meeting = await createMeeting(meetingDetails);
    console.log("Meeting created successfully:", meeting);
    alert(`Meeting created! Join URL: ${meeting.join_url}`);
  } catch (error) {
    console.error("Error setting up meeting:", error);
    alert("Failed to create meeting. Please try again.");
  }
};

// Call the setupMeeting function to create a meeting
setupMeeting();
