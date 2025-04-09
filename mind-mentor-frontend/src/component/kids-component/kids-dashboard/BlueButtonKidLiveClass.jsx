import React, { useState, useEffect } from "react";

const BlueButtonKidLiveClass = () => {
  const [name, setName] = useState("");
  const [activeClasses, setActiveClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch active classes
  useEffect(() => {
    const fetchActiveClasses = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://live.mindmentorz.in/sample/meeting/active-classes"
        );
        const data = await res.json();

        // Convert object to array
        const classesArray = Object.entries(data.classes).map(([id, info]) => ({
          id,
          name: info.className,
          coachName: info.coachName,
        }));

        setActiveClasses(classesArray);
      } catch (err) {
        console.error("Error fetching active classes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveClasses();

    // Refresh active classes every 30 seconds
    const interval = setInterval(fetchActiveClasses, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinMeeting = () => {
    if (!name.trim()) return alert("Please enter your name");
    if (!selectedClass) return alert("Please select a class to join");

    const encodedName = encodeURIComponent(name);
    window.open(
      `https://live.mindmentorz.in/sample/meeting/join?name=${encodedName}&classId=${selectedClass}`,
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

      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-full focus:ring-2 focus:ring-green-400"
      >
        <option value="">Select a class to join</option>
        {activeClasses.map((classInfo) => (
          <option key={classInfo.id} value={classInfo.id}>
            {classInfo.name} (Coach: {classInfo.coachName})
          </option>
        ))}
      </select>

      {loading && <p className="text-gray-500">Loading available classes...</p>}
      {!loading && activeClasses.length === 0 && (
        <p className="text-amber-600">No active classes available to join.</p>
      )}

      <button
        onClick={handleJoinMeeting}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        disabled={activeClasses.length === 0}
      >
        Join Meeting
      </button>
    </div>
  );
};

export default BlueButtonKidLiveClass;