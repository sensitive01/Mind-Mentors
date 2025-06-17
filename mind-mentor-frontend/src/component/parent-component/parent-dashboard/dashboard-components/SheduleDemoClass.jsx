import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Book,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getDemoSheduleClass } from "../../../../api/service/employee/EmployeeService";
import { toast, ToastContainer } from "react-toastify";
import { parentBookDemoClassinProfile } from "../../../../api/service/parent/ParentService";

const SheduleDemoClass = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    program: "",
    programLevel: "",
    classMode: "online", // default to online
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedCenterSlot, setSelectedCenterSlot] = useState(null);
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [availableLevels, setAvailableLevels] = useState([]);
  const navigate = useNavigate();

  // Function to get next occurrences of a specific day - MODIFIED to return only 1 date
  const getNextDates = (dayName, count = 1) => {
    // Changed default from 3 to 1
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const targetDay = days.indexOf(dayName);

    if (targetDay === -1) return [];

    const dates = [];
    const today = new Date();

    // Find the next occurrence of the target day
    let daysUntilTarget = (targetDay - today.getDay() + 7) % 7;
    if (daysUntilTarget === 0) daysUntilTarget = 7; // If today is the target day, get next week's

    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + daysUntilTarget + i * 7);
      dates.push({
        date: date,
        formatted: date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    }

    return dates;
  };

  useEffect(() => {
    const fetchDemoClass = async () => {
      try {
        const response = await getDemoSheduleClass();
        console.log("API Response:", response.data);
        const scheduleData = response.data.scheduleData || [];
        setAvailableSlots(scheduleData);

        // Extract unique programs and levels from the data
        const programs = [
          ...new Set(scheduleData.map((slot) => slot.program)),
        ].filter(Boolean);
        const levels = [
          ...new Set(scheduleData.map((slot) => slot.level)),
        ].filter(Boolean);

        setAvailablePrograms(programs);
        setAvailableLevels(levels);
      } catch (error) {
        console.error("Error fetching demo classes:", error);
        toast.error(
          "Failed to load available classes. Please try again later."
        );
      }
    };
    fetchDemoClass();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSelectedSlot(null);
    setSelectedCenter(null);
    setSelectedCenterSlot(null);

    // If program changes, filter levels based on selected program
    if (field === "program") {
      const programLevels = [
        ...new Set(
          availableSlots
            .filter((slot) => slot.program === value)
            .map((slot) => slot.level)
        ),
      ].filter(Boolean);
      setAvailableLevels(programLevels);

      // Reset program level if it's not available for the new program
      if (!programLevels.includes(formData.programLevel)) {
        setFormData((prev) => ({ ...prev, programLevel: "" }));
      }
    }
  };

  const getMatchingSlots = () => {
    return availableSlots.filter(
      (slot) =>
        slot.program === formData.program &&
        slot.level === formData.programLevel &&
        slot.type === "online"
    );
  };

  const getMatchingCenters = () => {
    // Filter offline classes by program and level
    const offlineSlots = availableSlots.filter(
      (slot) =>
        slot.program === formData.program &&
        slot.level === formData.programLevel &&
        slot.type === "offline"
    );

    // Group slots by center
    const groupedByCenter = {};
    offlineSlots.forEach((slot) => {
      const centerKey = slot.centerId || slot.centerName;

      if (!groupedByCenter[centerKey]) {
        groupedByCenter[centerKey] = {
          _id: centerKey,
          centerName: slot.centerName,
          centerId: slot.centerId,
          address: "Visit our center for the demo class",
          coachName: slot.coachName,
          coachId: slot.coachId,
          slots: [],
        };
      }

      // Get next date for this day - MODIFIED to get only 1 date
      const nextDates = getNextDates(slot.day, 1); // Changed from 3 to 1

      // Check if day already exists in slots
      const daySlot = groupedByCenter[centerKey].slots.find(
        (s) => s.day === slot.day
      );

      if (daySlot) {
        // Add time if not already present
        if (!daySlot.times.includes(slot.classTime)) {
          daySlot.times.push(slot.classTime);
        }
        daySlot.slotIds[slot.classTime] = slot._id;
      } else {
        groupedByCenter[centerKey].slots.push({
          day: slot.day,
          times: [slot.classTime],
          slotIds: { [slot.classTime]: slot._id },
          nextDates: nextDates,
          originalSlot: slot,
        });
      }
    });

    return Object.values(groupedByCenter);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.program || !formData.programLevel) {
      toast.error("Please complete all program and level selections");
      return;
    }

    if (
      formData.classMode === "physical" &&
      (!selectedCenter || !selectedCenterSlot)
    ) {
      toast.error("Please select a center and time slot");
      return;
    }

    if (formData.classMode === "online" && !selectedSlot) {
      toast.error("Please select an online slot");
      return;
    }

    // Find the schedule ID for offline classes
    let scheduleId = selectedSlot?._id;
    if (formData.classMode === "physical" && selectedCenterSlot) {
      const centerId = selectedCenter._id;
      const { day, time } = selectedCenterSlot;
      const centerData = getMatchingCenters().find(
        (center) => center._id === centerId
      );
      const daySlot = centerData?.slots.find((slot) => slot.day === day);
      scheduleId = daySlot?.slotIds[time];
    }

    const submitData = {
      programs: [
        {
          program: formData.program,
          programLevel: formData.programLevel,
          classMode: formData.classMode === "online" ? "online" : "offline",
        },
      ],
      scheduleId: scheduleId,
      hasSchedule: !!scheduleId,
    };

    try {
      const response = await parentBookDemoClassinProfile(submitData, id);
      if (response.status === 200) {
        toast.success("Your demo class has been re-scheduled.");
        setTimeout(() => {
          navigate("/parent/kid");
        }, 1500);
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary px-6 py-8 text-white">
            <h1 className="text-3xl font-bold">Schedule a Demo Class</h1>
            <p className="mt-2 text-purple-100">
              Choose your preferred program and discover the perfect learning
              journey for your child
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Book className="w-4 h-4 mr-2" />
                  Select Program
                </label>
                <select
                  value={formData.program}
                  onChange={(e) => handleInputChange("program", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
                  required
                >
                  <option value="">Choose a program</option>
                  {availablePrograms.map((program) => (
                    <option key={program} value={program}>
                      {program}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Select Level
                </label>
                <select
                  value={formData.programLevel}
                  onChange={(e) =>
                    handleInputChange("programLevel", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
                  required
                  disabled={!formData.program}
                >
                  <option value="">Choose a level</option>
                  {availableLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formData.program && formData.programLevel && (
              <div className="space-y-6">
                <div className="flex gap-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="classMode"
                      value="online"
                      checked={formData.classMode === "online"}
                      onChange={(e) =>
                        handleInputChange("classMode", e.target.value)
                      }
                      className="w-4 h-4 text-purple-600"
                    />
                    <span>Online Class</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="classMode"
                      value="physical"
                      checked={formData.classMode === "physical"}
                      onChange={(e) =>
                        handleInputChange("classMode", e.target.value)
                      }
                      className="w-4 h-4 text-purple-600"
                    />
                    <span>Physical Center</span>
                  </label>
                </div>

                {formData.classMode === "online" ? (
                  <div className="mt-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                      Available Online Demo Classes
                    </h4>
                    <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="grid gap-4">
                        {getMatchingSlots().length > 0 ? (
                          getMatchingSlots().map((slot) => {
                            const nextDates = getNextDates(slot.day, 1); // Changed from 3 to 1
                            return (
                              <div
                                key={slot._id}
                                onClick={() => setSelectedSlot(slot)}
                                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:transform hover:scale-[1.01] ${
                                  selectedSlot?._id === slot._id
                                    ? "bg-purple-50 border-2 border-purple-500"
                                    : "border border-gray-200 hover:border-purple-300 hover:shadow-md"
                                }`}
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                                  <div className="flex items-center">
                                    <Calendar className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                                    <span className="font-medium">
                                      {slot.day}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                                    <span>{slot.classTime}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <User className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                                    <span>Coach {slot.coachName}</span>
                                  </div>
                                </div>

                                {/* Show next available date - MODIFIED text from "dates" to "date" */}
                                <div className="border-t pt-3">
                                  <p className="text-sm text-gray-600 mb-2">
                                    Next available date:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {nextDates.map((dateInfo, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-gray-100 text-xs rounded-md text-gray-700"
                                      >
                                        {dateInfo.date.toLocaleDateString(
                                          "en-US",
                                          {
                                            month: "short",
                                            day: "numeric",
                                          }
                                        )}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">
                              No scheduled online demo classes available for
                              this program and level. Register anyway, and our
                              team will contact you to schedule your demo class.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                      Available Physical Centers
                    </h4>
                    <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="grid gap-4">
                        {getMatchingCenters().length > 0 ? (
                          getMatchingCenters().map((center) => (
                            <div
                              key={center._id}
                              className="border rounded-lg p-4"
                            >
                              <div
                                onClick={() => {
                                  setSelectedCenter(center);
                                  setSelectedCenterSlot(null);
                                }}
                                className={`cursor-pointer ${
                                  selectedCenter?._id === center._id
                                    ? "text-purple-600"
                                    : "text-gray-800"
                                }`}
                              >
                                <div className="flex items-start gap-2 mb-2">
                                  <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                                  <div>
                                    <h5 className="font-medium">
                                      {center.centerName}
                                    </h5>
                                    <p className="text-sm text-gray-600">
                                      {center.address}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <User className="w-4 h-4" />
                                  <span>Coach {center.coachName}</span>
                                </div>
                              </div>

                              {selectedCenter?._id === center._id && (
                                <div className="mt-4 pl-4 border-t pt-4">
                                  <h6 className="text-sm font-medium mb-2">
                                    Available Slots:
                                  </h6>
                                  <div className="space-y-4">
                                    {center.slots.map((slot, idx) => (
                                      <div key={idx} className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm">
                                          <Calendar className="w-4 h-4" />
                                          <span className="font-medium">
                                            {slot.day}
                                          </span>
                                        </div>

                                        {/* Show next available date - MODIFIED text from "dates" to "date" */}
                                        <div className="ml-6 mb-3">
                                          <p className="text-xs text-gray-500 mb-1">
                                            Next available date:
                                          </p>
                                          <div className="flex flex-wrap gap-1">
                                            {slot.nextDates.map(
                                              (dateInfo, dateIdx) => (
                                                <span
                                                  key={dateIdx}
                                                  className="px-2 py-1 bg-blue-50 text-xs rounded text-blue-700"
                                                >
                                                  {dateInfo.date.toLocaleDateString(
                                                    "en-US",
                                                    {
                                                      month: "short",
                                                      day: "numeric",
                                                    }
                                                  )}
                                                </span>
                                              )
                                            )}
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 ml-6">
                                          {slot.times.map((time, timeIdx) => (
                                            <button
                                              key={timeIdx}
                                              type="button"
                                              onClick={() =>
                                                setSelectedCenterSlot({
                                                  day: slot.day,
                                                  time: time,
                                                })
                                              }
                                              className={`px-3 py-2 text-sm rounded transition-colors ${
                                                selectedCenterSlot?.day ===
                                                  slot.day &&
                                                selectedCenterSlot?.time ===
                                                  time
                                                  ? "bg-purple-100 text-purple-700 border border-purple-300"
                                                  : "bg-gray-100 hover:bg-gray-200 border border-gray-200"
                                              }`}
                                            >
                                              <Clock className="w-3 h-3 inline mr-1" />
                                              {time}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">
                              No physical centers available for this program and
                              level. Please try the online option or register
                              anyway, and our team will contact you.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-primary to-primary text-white rounded-lg hover:from-primary hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.01]"
              >
                Schedule Demo Class
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default SheduleDemoClass;
