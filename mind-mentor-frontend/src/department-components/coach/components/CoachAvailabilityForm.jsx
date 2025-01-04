import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { saveAvailableDays } from "../../../api/service/employee/coachService";

const programs = [
  { name: "Chess", levels: ["Beginner", "Intermediate", "Advanced"] },
  { name: "Rubiks Cube", levels: ["Beginner", "Intermediate", "Advanced"] },
  { name: "Math", levels: ["Beginner", "Intermediate", "Advanced"] },
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeIntervals = ["00", "15", "30", "45"];
const hours = Array.from({ length: 9 }, (_, i) => i + 10); // 10 AM to 6 PM

const CoachAvailabilityForm = () => {
  const empId = localStorage.getItem("empId");
  const [availabilities, setAvailabilities] = useState([
    {
      program: "",
      levels: [],
      days: [],
      times: [],
    },
  ]);

  const [loading, setLoading] = useState(false);

  const handleProgramChange = (index, e) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[index] = {
      ...newAvailabilities[index],
      program: e.target.value,
      levels: [],
    };
    setAvailabilities(newAvailabilities);
  };

  const handleLevelChange = (index, level) => {
    const newAvailabilities = [...availabilities];
    const currentLevels = newAvailabilities[index].levels;
    
    if (currentLevels.includes(level)) {
      newAvailabilities[index].levels = currentLevels.filter(l => l !== level);
    } else {
      newAvailabilities[index].levels = [...currentLevels, level];
    }
    setAvailabilities(newAvailabilities);
  };

  const handleDayChange = (index, day) => {
    const newAvailabilities = [...availabilities];
    const currentDays = newAvailabilities[index].days;
    
    if (currentDays.includes(day)) {
      newAvailabilities[index].days = currentDays.filter(d => d !== day);
    } else {
      newAvailabilities[index].days = [...currentDays, day];
    }
    setAvailabilities(newAvailabilities);
  };

  const handleTimeChange = (index, time) => {
    const newAvailabilities = [...availabilities];
    const currentTimes = newAvailabilities[index].times;
    
    if (currentTimes.includes(time)) {
      newAvailabilities[index].times = currentTimes.filter(t => t !== time);
    } else {
      newAvailabilities[index].times = [...currentTimes, time];
    }
    setAvailabilities(newAvailabilities);
  };

  const addAvailability = () => {
    setAvailabilities([
      ...availabilities,
      {
        program: "",
        levels: [],
        days: [],
        times: [],
      },
    ]);
  };

  const removeAvailability = (indexToRemove) => {
    setAvailabilities(availabilities.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isValid = availabilities.every(
      (avail) =>
        avail.program &&
        avail.levels.length > 0 &&
        avail.days.length > 0 &&
        avail.times.length > 0
    );

    if (!isValid) {
      alert("Please fill in all fields for each availability");
      setLoading(false);
      return;
    }
    
    const response = await saveAvailableDays(empId, availabilities);
    console.log(response);
    setLoading(false);
  };

  const handleReset = () => {
    setAvailabilities([
      {
        program: "",
        levels: [],
        days: [],
        times: [],
      },
    ]);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Coach Availability Form</h2>
          <p className="text-sm opacity-90">
            Please select your available programs, levels, days and times
          </p>
        </div>

        <form className="p-8" onSubmit={handleSubmit} onReset={handleReset}>
          {availabilities.map((availability, index) => (
            <div key={index} className="mb-8 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Program Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Program</label>
                  <select
                    value={availability.program}
                    onChange={(e) => handleProgramChange(index, e)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Program</option>
                    {programs.map((prog) => (
                      <option key={prog.name} value={prog.name}>
                        {prog.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Levels Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Levels</label>
                  <div className="flex flex-wrap gap-2">
                    {availability.program &&
                      programs
                        .find((p) => p.name === availability.program)
                        ?.levels.map((level) => (
                          <label key={level} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={availability.levels.includes(level)}
                              onChange={() => handleLevelChange(index, level)}
                              className="rounded border-gray-300"
                            />
                            <span className="ml-2">{level}</span>
                          </label>
                        ))}
                  </div>
                </div>

                {/* Days Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Days</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {days.map((day) => (
                      <label key={day} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={availability.days.includes(day)}
                          onChange={() => handleDayChange(index, day)}
                          className="rounded border-gray-300"
                        />
                        <span className="ml-2">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Times Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Times</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                    {hours.map((hour) =>
                      timeIntervals.map((interval) => {
                        const timeString = `${hour}:${interval}`;
                        return (
                          <label key={timeString} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={availability.times.includes(timeString)}
                              onChange={() => handleTimeChange(index, timeString)}
                              className="rounded border-gray-300"
                            />
                            <span className="ml-2">{timeString}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {availabilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAvailability(index)}
                  className="mt-4 p-2 text-red-600 hover:text-red-800"
                >
                  <DeleteIcon />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addAvailability}
            className="mb-6 px-4 py-2 border border-[#642b8f] text-[#642b8f] rounded-lg hover:bg-[#efe8f0]"
          >
            Add Availability
          </button>

          <div className="flex justify-center gap-6 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Available Slot"}
            </button>
            <button
              type="reset"
              className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoachAvailabilityForm;