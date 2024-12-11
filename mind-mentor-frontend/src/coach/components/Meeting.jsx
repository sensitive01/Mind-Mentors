import React, { useState } from "react";
// import { createMeeting } from "../../api/service/";

const MeetingScheduler = () => {
  const [meetingDetails, setMeetingDetails] = useState({
    title: "",
    agenda: "",
    start_time: "",
    duration: "",
    timezone: "Asia/Kolkata",
  });
  const [joinLink, setJoinLink] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails({ ...meetingDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createMeeting(meetingDetails);
      console.log(meetingDetails);
      setJoinLink(response.join_url);
      console.log(meetingDetails);
      alert(`Meeting Scheduled! Share this Join URL: ${response.join_url}`);
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      alert("Failed to schedule the meeting. Please try again.");
    }
  };

  return (
    <div>
      <h1>Schedule a Meeting</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={meetingDetails.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Agenda:</label>
          <input
            type="text"
            name="agenda"
            value={meetingDetails.agenda}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Start Time:</label>
          <input
            type="datetime-local"
            name="start_time"
            value={meetingDetails.start_time}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Duration (in minutes):</label>
          <input
            type="number"
            name="duration"
            value={meetingDetails.duration}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Schedule Meeting</button>
      </form>
      {joinLink && (
        <div>
          <p>Meeting Scheduled! Share the Join URL below:</p>
          <a href={joinLink} target="_blank" rel="noopener noreferrer">
            {joinLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default MeetingScheduler;
