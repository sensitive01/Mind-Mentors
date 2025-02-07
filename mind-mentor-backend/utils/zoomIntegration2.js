const fetch = require("node-fetch");
const base64 = require("base-64");

const ZOOM_CLIENT_ID = "1R8cvp2KTCGJQl9zzX8gQ";
const ZOOM_CLIENT_SECRET = "vraDNr4XDr8C3itjb6q8ml5CPMMH8QXs";
const ZOOM_ACCOUNT_ID = "zvlCx8XqQaCwi-sO-7GOhQ";

const getAuthHeaders = () => {
  return {
    Authorization: `Basic ${base64.encode(
      `${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`
    )}`,
    "Content-Type": "application/json",
  };
};

const generateZoomAccessToken = async () => {
  try {
    console.log("Inside the generateZoomAccessToken");
    const response = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );

    const jsonResponse = await response.json();

    if (jsonResponse?.access_token) {
      return jsonResponse.access_token;
    } else {
      throw new Error("Unable to get Zoom access token");
    }
  } catch (error) {
    console.log("generateZoomAccessToken Error --> ", error);
    throw error;
  }
};

const zoomIntegration2 = async () => {
  try {
    const zoomAccessToken = await generateZoomAccessToken();
    console.log("zoomAccessToken", zoomAccessToken);

    const startTime = new Date().toISOString(); // Use ISO string for start time

    const response = await fetch(`https://api.zoom.us/v2/users/me/meetings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${zoomAccessToken}`,
      },
      body: JSON.stringify({
        agenda: "Class room for mind-mentorz students",
        default_password: false,
        duration: 120,
        password: "12345", // Consider generating or removing this for a more secure approach
        settings: {
          allow_multiple_devices: true,
          alternative_hosts_email_notification: true,
          breakout_room: {
            enable: true,
            rooms: [
              {
                name: "chess",
                participants: [
                  "aswinrajachu09@gmail.com",
                  "new498259@gmail.com",
                ],
              },
            ],
          },
          calendar_type: 1,
          contact_email: "aswinrajr07@gmail.com",
          contact_name: "Aswinraj R",
          email_notification: true,
          encryption_type: "enhanced_encryption",
          focus_mode: true,
          host_video: true,
          join_before_host: true,
          meeting_authentication: true,
          meeting_invitees: [
            {
              email: "aswinrajachu09@gmail.com",
            },
          ],
          mute_upon_entry: true,
          participant_video: true,
          private_meeting: true,
          waiting_room: false,
          watermark: false,
          continuous_meeting_chat: {
            enable: true,
          },
        },
        start_time: startTime, // Use ISO string formatted start time
        timezone: "Asia/Kolkata",
        topic: "Class meeting for mind-Mentorz",
        type: 2, // 1 -> Instant Meeting, 2 -> Scheduled Meeting
      }),
    });

    const jsonResponse = await response.json();

    console.log("zoomIntegration2 JsonResponse --> ", jsonResponse);
    if (jsonResponse?.join_url) {
      return jsonResponse.join_url; // Return the join URL
    } else {
      throw new Error("Error generating Zoom meeting");
    }
  } catch (error) {
    console.log("zoomIntegration2 Error --> ", error);
    throw error;
  }
};

module.exports = { zoomIntegration2 };
