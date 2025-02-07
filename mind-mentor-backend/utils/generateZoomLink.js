const fetch = require("node-fetch");
const base64 = require("base-64");

ZOOM_ACCOUNT_ID="5SvuRyPFRly74MiJHMIPaQ"
ZOOM_CLIENT_ID="cFNIRob2ReiHwmo2P4tgXA"
ZOOM_CLIENT_SECRET="X5jubMHKo1lWzCuyAG81ibJnoGXbIBRC"



const getAuthHeaders = () => {
    return {
        Authorization: `Basic ${base64.encode(
            `${ZOOM_CLIENT_ID }:${ZOOM_CLIENT_SECRET}`
        )}`,
        "Content-Type": "application/json",
    };
};

const generateZoomAccessToken = async () => {
    try {
        console.log("Inside the generateZoomAccessToken")
        const response = await fetch(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
            {
                method: "POST",
                headers: getAuthHeaders(),
            }
        );

        const jsonResponse = await response.json();

        return jsonResponse?.access_token;
    } catch (error) {
        console.log("generateZoomAccessToken Error --> ", error);
        throw error;
    }
};

const generateZoomMeeting = async () => {
    try {
        const zoomAccessToken = await generateZoomAccessToken();
        console.log("zoomAccessToken",zoomAccessToken)

        const response = await fetch(
            `https://api.zoom.us/v2/users/me/meetings`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${zoomAccessToken}`,
                },
                body: JSON.stringify({
                    agenda: "Class room for mind-mentorz students",
                    default_password: false,
                    duration: 120,
                    password: "12345",

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
                        // global_dial_in_countries: ["US"],
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
                    start_time: new Date().toLocaleDateString(),
                    timezone: "Asia/Kolkata",
                    topic: "Class meeting for mind-Mentorz",
                    type: 2, // 1 -> Instant Meeting, 2 -> Scheduled Meeting
                }),
            }
        );

        const jsonResponse = await response.json();

        console.log("generateZoomMeeting JsonResponse --> ", jsonResponse);
        const {join_url} = jsonResponse
        return join_url
    } catch (error) {
        console.log("generateZoomMeeting Error --> ", error);
        throw error;
    }
};

module.exports = {generateZoomMeeting}