import React, { useState } from "react";

const BlueButtonKid = () => {
  const [name, setName] = useState("");

  const handleJoinMeeting = () => {
    if (!name.trim()) return alert("Please enter your name");
    const encodedName = encodeURIComponent(name);
    window.open(
      `https://live.mindmentorz.in/api/meeting/join?name=${encodedName}`,
      "_blank"
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold text-green-700">🧒 Join as Kid</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-green-400"
      />
      <button
        onClick={handleJoinMeeting}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
      >
        Join Meeting
      </button>
    </div>
  );
};

export default BlueButtonKid;
