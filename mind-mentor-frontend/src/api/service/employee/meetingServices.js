import axios from "axios";

// Create a base configuration for API calls
const zoomApi = axios.create({
  baseURL: "https://api.zoom.us/v2", // Zoom API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

class ZoomApiService {
  // Method to generate meeting signature
  static async generateSignature(meetingNumber, role) {
    try {
      const response = await axios.post("/generate-signature", {
        meetingNumber,
        role,
      });
      return response.data.signature;
    } catch (error) {
      console.error("Signature generation error:", error);
      throw error;
    }
  }

  // Method to create a meeting
  static async createMeeting(meetingDetails) {
    try {
      const response = await axios.post("/create-meeting", {
        topic: meetingDetails.topic || "Instant Meeting",
        userName: meetingDetails.userName,
      });
      return response.data;
    } catch (error) {
      console.error("Meeting creation error:", error);
      throw error;
    }
  }

  // Method to get meeting details
  static async getMeetingDetails(meetingId) {
    try {
      const response = await zoomApi.get(`/meetings/${meetingId}`, {
        headers: {
          Authorization: `Bearer YOUR_JWT_TOKEN`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Get meeting details error:", error);
      throw error;
    }
  }

  // Method to list user's meetings
  static async listMeetings() {
    try {
      const response = await zoomApi.get("/users/me/meetings", {
        headers: {
          Authorization: `Bearer YOUR_JWT_TOKEN`,
        },
      });
      return response.data.meetings;
    } catch (error) {
      console.error("List meetings error:", error);
      throw error;
    }
  }
}

export default ZoomApiService;
