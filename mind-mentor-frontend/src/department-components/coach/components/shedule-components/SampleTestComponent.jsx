import React, { useState } from "react";

const BlueButton = () => {
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState("");
  const [coachName, setCoachName] = useState("");

  // Sample class types - you can fetch these from your database
  const classTypes = [
    { id: "math101", name: "Mathematics 101" },
    { id: "sci202", name: "Science 202" },
    { id: "eng303", name: "English 303" },
    { id: "art404", name: "Art 404" },
  ];

  const [selectedClass, setSelectedClass] = useState("");

  const handleStartMeeting = async () => {
    if (!selectedClass) {
      return alert("Please select a class");
    }

    if (!coachName.trim()) {
      return alert("Please enter your name");
    }

    try {
      setLoading(true);

      const selectedClassInfo = classTypes.find((c) => c.id === selectedClass);

      const res = await fetch("http://3.104.84.126:3000/sample/meeting/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: selectedClass,
          className: selectedClassInfo.name,
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

      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select a class</option>
        {classTypes.map((classType) => (
          <option key={classType.id} value={classType.id}>
            {classType.name}
          </option>
        ))}
      </select>

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
