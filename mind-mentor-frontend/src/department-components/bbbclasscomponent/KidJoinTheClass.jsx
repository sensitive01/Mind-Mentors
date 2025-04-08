import React, { useState } from "react";
import { useParams } from "react-router-dom";

const KidJoinTheClass = () => {
  const { classId } = useParams();
  const [kidName, setKidName] = useState("");

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!kidName.trim()) {
      alert("Please enter your name.");
      return;
    }
    try {
      const response = await fetch(
        `http://3.104.84.126:3000/api/class/${classId}`
      );
      const classData = await response.json();
      const { meetingID } = classData;

      const joinUrl = `https://aswinraj.online/join?fullName=${encodeURIComponent(
        kidName
      )}&meetingID=${meetingID}&password=apwd&redirect=true`;

      window.location.href = joinUrl;
    } catch (error) {
      console.error("Error joining class:", error);
      alert("Failed to join class. Please try again.");
    }
  };

  return (
    <div className="join-class-page">
      <h2>Join Class</h2>
      <form onSubmit={handleJoinClass}>
        <div>
          <label>Your Name:</label>
          <input
            type="text"
            value={kidName}
            onChange={(e) => setKidName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Join Class</button>
      </form>
    </div>
  );
};

export default KidJoinTheClass;
