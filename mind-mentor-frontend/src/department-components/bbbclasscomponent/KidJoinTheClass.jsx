import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const KidJoinTheClass = () => {
  const { classId } = useParams();
  const [kidName, setKidName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!kidName.trim()) {
      alert("Please enter your name.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://3.104.84.126:3000/api/class/get-class/${classId}`
      );

      const { meetingID } = response.data;

      const joinUrl = `https://aswinraj.online/join?fullName=${encodeURIComponent(
        kidName
      )}&meetingID=${meetingID}&password=apwd&redirect=true`;

      window.location.href = joinUrl;
    } catch (error) {
      console.error("Error joining class:", error);
      alert("Failed to join class. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-700">Join Your Class</h2>
          <p className="text-gray-600 mt-2">Enter your name to get started</p>
        </div>
        <form onSubmit={handleJoinClass} className="space-y-4">
          <input
            type="text"
            value={kidName}
            onChange={(e) => setKidName(e.target.value)}
            placeholder="Your Name"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            {loading ? "Joining..." : "Join Class"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KidJoinTheClass;
