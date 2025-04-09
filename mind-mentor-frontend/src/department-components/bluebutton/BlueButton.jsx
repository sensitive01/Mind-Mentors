import React, { useState } from "react";

const BlueButton = () => {
  const [loading, setLoading] = useState(false);

  const handleStartMeeting = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://live.mindmentorz.in/api/meeting/start");
      const data = await res.json();
      window.open(data.joinModUrl, "_blank"); // Open coach's (moderator) URL
    } catch (err) {
      console.error("Error starting meeting:", err);
      alert("Failed to start meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold text-blue-700">🎓 Coach Meeting Panel</h1>
      <button
        onClick={handleStartMeeting}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Starting Meeting..." : "Start Meeting (Coach)"}
      </button>
    </div>
  );
};

export default BlueButton;
