import React, { useState } from "react";

const CoachClassMeeting = () => {
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [uniqueId, setUniqueId] = useState("");

  const handleStartMeeting = async () => {
    if (!uniqueId.trim()) {
      return alert("Please enter a unique ID");
    }

    if (!coachName.trim()) {
      return alert("Please enter your name");
    }

    try {
      setLoading(true);

      const res = await fetch("https://live.mindmentorz.in/sample/meeting/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: uniqueId,
          className: uniqueId, // Using the uniqueId as className
          coachName,
        }),
      });

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
      <h1 className="text-2xl font-bold text-blue-700">
        🎓 Coach Meeting Panel
      </h1>

      <input
        type="text"
        placeholder="Enter your name"
        value={coachName}
        onChange={(e) => setCoachName(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="text"
        placeholder="Enter a unique ID"
        value={uniqueId}
        onChange={(e) => setUniqueId(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
      />

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

export default CoachClassMeeting;