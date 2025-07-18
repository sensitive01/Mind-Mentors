import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Book,
  ChevronRight,
  MapPin,
  Check,
  ChevronDown,
  Monitor,
  Building,
  Edit,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getDemoSheduleClass } from "../../../../api/service/employee/EmployeeService";
import { toast, ToastContainer } from "react-toastify";
import {
  getKidExistProgramData,
  parentBookDemoClassinProfile,
} from "../../../../api/service/parent/ParentService";

const SheduleDemoClass = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    program: "",
    programLevel: "",
    classMode: "online", // default to online
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedOnlineTimeSlot, setSelectedOnlineTimeSlot] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedCenterSlot, setSelectedCenterSlot] = useState(null);
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [availableLevels, setAvailableLevels] = useState([]);
  const [existingProgram, setExistingProgram] = useState(null);
  const [isEditingProgram, setIsEditingProgram] = useState(false);
  const navigate = useNavigate();

  // Function to get next occurrences of a specific day - MODIFIED to return only 1 date
  const getNextDates = (dayName, count = 1) => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getKidExistProgramData(id);
        if (response.data?.programData?.length > 0) {
          const programData = response.data.programData[0];
          setExistingProgram(programData);
          setFormData((prev) => ({
            ...prev,
            program: programData.program,
            programLevel: programData.level,
          }));
        }
      } catch (error) {
        console.error("Error fetching kid's program data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSelectedSlot(null);
    setSelectedOnlineTimeSlot(null);
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

  const handleEditProgram = () => {
    setIsEditingProgram(true);
    setFormData((prev) => ({
      ...prev,
      program: "",
      programLevel: "",
    }));
  };

  const getMatchingSlots = () => {
    return availableSlots.filter(
      (slot) =>
        slot.program === formData.program &&
        slot.level === formData.programLevel &&
        slot.type === "online"
    );
  };

  // Group online slots by day and coach
  const getGroupedOnlineSlots = () => {
    const onlineSlots = getMatchingSlots();
    const groupedByDayAndCoach = {};

    onlineSlots.forEach((slot) => {
      const key = `${slot.day}-${slot.coachId}`;

      if (!groupedByDayAndCoach[key]) {
        groupedByDayAndCoach[key] = {
          _id: key,
          day: slot.day,
          coachName: slot.coachName,
          coachId: slot.coachId,
          times: [],
          slotIds: {},
          nextDates: getNextDates(slot.day, 1),
        };
      }

      groupedByDayAndCoach[key].times.push(slot.classTime);
      groupedByDayAndCoach[key].slotIds[slot.classTime] = slot._id;
    });

    return Object.values(groupedByDayAndCoach);
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

    if (
      formData.classMode === "online" &&
      (!selectedSlot || !selectedOnlineTimeSlot)
    ) {
      toast.error("Please select an online slot and time");
      return;
    }

    // Find the schedule ID for online classes
    let scheduleId;
    if (
      formData.classMode === "online" &&
      selectedSlot &&
      selectedOnlineTimeSlot
    ) {
      scheduleId = selectedSlot.slotIds[selectedOnlineTimeSlot];
    }

    // Find the schedule ID for offline classes
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary px-6 py-8 text-white">
            <h1 className="text-3xl font-bold">Schedule a Demo Class</h1>
            <p className="mt-2 text-purple-100">
              Choose your preferred program and discover the perfect learning
              journey for your child
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {existingProgram && !isEditingProgram ? (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-blue-800">
                      Current Program
                    </h3>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <Book className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="font-medium">Program:</span>
                        </div>
                        <div className="mt-1 text-gray-800">
                          {existingProgram.program}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <ChevronRight className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="font-medium">Level:</span>
                        </div>
                        <div className="mt-1 text-gray-800">
                          {existingProgram.level}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleEditProgram}
                    className="flex items-center text-sm text-blue-700 hover:text-blue-900 font-medium"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Change Program
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Book className="w-4 h-4 mr-2" />
                    Select Program
                  </label>
                  <select
                    value={formData.program}
                    onChange={(e) =>
                      handleInputChange("program", e.target.value)
                    }
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
            )}

            {formData.program && formData.programLevel && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Choose Your Class Type
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.classMode === "online"
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 bg-white hover:border-purple-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="classMode"
                        value="online"
                        checked={formData.classMode === "online"}
                        onChange={(e) =>
                          handleInputChange("classMode", e.target.value)
                        }
                        className="w-4 h-4 text-purple-600 mr-3"
                      />
                      <Monitor className="w-6 h-6 text-purple-600 mr-3" />
                      <div>
                        <div className="font-medium">Online Class</div>
                        <div className="text-sm text-gray-600">
                          Join from home
                        </div>
                      </div>
                    </label>
                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.classMode === "physical"
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 bg-white hover:border-purple-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="classMode"
                        value="physical"
                        checked={formData.classMode === "physical"}
                        onChange={(e) =>
                          handleInputChange("classMode", e.target.value)
                        }
                        className="w-4 h-4 text-purple-600 mr-3"
                      />
                      <Building className="w-6 h-6 text-purple-600 mr-3" />
                      <div>
                        <div className="font-medium">Physical Center</div>
                        <div className="text-sm text-gray-600">
                          Visit our center
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {formData.classMode === "online" ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-blue-800">
                            📋 Select Your Online Demo Class
                          </h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <p className="font-medium">Follow these steps:</p>
                            <ol className="list-decimal list-inside mt-1 space-y-1">
                              <li>Choose your preferred coach and day</li>
                              <li>Select your preferred time slot</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">
                        Step 1: Choose Your Coach & Day
                      </h4>
                      {getGroupedOnlineSlots().length > 0 ? (
                        getGroupedOnlineSlots().map((slot) => (
                          <div
                            key={slot._id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                              selectedSlot?._id === slot._id
                                ? "border-purple-500 bg-purple-50 shadow-md"
                                : "border-gray-200 hover:border-purple-300 hover:shadow-sm"
                            }`}
                            onClick={() => {
                              setSelectedSlot(slot);
                              setSelectedOnlineTimeSlot(null);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    selectedSlot?._id === slot._id
                                      ? "border-purple-500 bg-purple-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {selectedSlot?._id === slot._id && (
                                    <Check className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Calendar className="w-5 h-5 text-purple-600" />
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {slot.day} Classes
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Next class:{" "}
                                      {slot.nextDates[0]?.date.toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "short",
                                          day: "numeric",
                                        }
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <User className="w-5 h-5 text-purple-600" />
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      Coach {slot.coachName}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Online Instructor
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <ChevronDown
                                className={`w-5 h-5 text-gray-400 transition-transform ${
                                  selectedSlot?._id === slot._id
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">
                            No scheduled online demo classes available for this
                            program and level. Register anyway, and our team
                            will contact you to schedule your demo class.
                          </p>
                        </div>
                      )}

                      {selectedSlot && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            Step 2: Choose Your Time Slot
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {selectedSlot.times.map((time, timeIdx) => (
                              <button
                                key={timeIdx}
                                type="button"
                                onClick={() => setSelectedOnlineTimeSlot(time)}
                                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                  selectedOnlineTimeSlot === time
                                    ? "border-green-500 bg-green-50 text-green-800"
                                    : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50"
                                }`}
                              >
                                <div className="flex items-center justify-center space-x-2">
                                  <Clock className="w-5 h-5" />
                                  <span className="font-medium">{time}</span>
                                  {selectedOnlineTimeSlot === time && (
                                    <Check className="w-5 h-5 text-green-600" />
                                  )}
                                </div>
                                {selectedOnlineTimeSlot === time && (
                                  <div className="text-sm mt-1">Selected ✓</div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-blue-800">
                            🏢 Select Your Physical Center
                          </h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <p className="font-medium">Follow these steps:</p>
                            <ol className="list-decimal list-inside mt-1 space-y-1">
                              <li>Choose your preferred center location</li>
                              <li>Select your preferred time slot</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">
                        Step 1: Choose Your Center
                      </h4>
                      {getMatchingCenters().length > 0 ? (
                        getMatchingCenters().map((center) => (
                          <div
                            key={center._id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                              selectedCenter?._id === center._id
                                ? "border-purple-500 bg-purple-50 shadow-md"
                                : "border-gray-200 hover:border-purple-300 hover:shadow-sm"
                            }`}
                            onClick={() => {
                              setSelectedCenter(center);
                              setSelectedCenterSlot(null);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    selectedCenter?._id === center._id
                                      ? "border-purple-500 bg-purple-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {selectedCenter?._id === center._id && (
                                    <Check className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <div className="flex items-center space-x-3">
                                  <MapPin className="w-5 h-5 text-purple-600" />
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {center.centerName}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {center.address}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <User className="w-5 h-5 text-purple-600" />
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      Coach {center.coachName}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Center Instructor
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <ChevronDown
                                className={`w-5 h-5 text-gray-400 transition-transform ${
                                  selectedCenter?._id === center._id
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </div>
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

                      {selectedCenter && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            Step 2: Choose Your Time Slot
                          </h4>
                          <div className="space-y-4">
                            {selectedCenter.slots.map((slot, idx) => (
                              <div key={idx} className="space-y-3">
                                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                  <Calendar className="w-4 h-4" />
                                  <span>{slot.day}</span>
                                  <span className="text-xs text-gray-500">
                                    (Next class:{" "}
                                    {slot.nextDates[0]?.date.toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )}
                                    )
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 ml-6">
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
                                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                        selectedCenterSlot?.day === slot.day &&
                                        selectedCenterSlot?.time === time
                                          ? "border-green-500 bg-green-50 text-green-800"
                                          : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50"
                                      }`}
                                    >
                                      <div className="flex items-center justify-center space-x-2">
                                        <Clock className="w-5 h-5" />
                                        <span className="font-medium">
                                          {time}
                                        </span>
                                        {selectedCenterSlot?.day === slot.day &&
                                          selectedCenterSlot?.time === time && (
                                            <Check className="w-5 h-5 text-green-600" />
                                          )}
                                      </div>
                                      {selectedCenterSlot?.day === slot.day &&
                                        selectedCenterSlot?.time === time && (
                                          <div className="text-sm mt-1">
                                            Selected ✓
                                          </div>
                                        )}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8">
              <button
                type="submit"
                disabled={
                  (formData.classMode === "online" &&
                    (!selectedSlot || !selectedOnlineTimeSlot)) ||
                  (formData.classMode === "physical" &&
                    (!selectedCenter || !selectedCenterSlot))
                }
                className={`w-full px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                  (formData.classMode === "online" &&
                    selectedSlot &&
                    selectedOnlineTimeSlot) ||
                  (formData.classMode === "physical" &&
                    selectedCenter &&
                    selectedCenterSlot)
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-[1.01]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {(formData.classMode === "online" &&
                  selectedSlot &&
                  selectedOnlineTimeSlot) ||
                (formData.classMode === "physical" &&
                  selectedCenter &&
                  selectedCenterSlot)
                  ? "✓ Schedule My Demo Class"
                  : "Please Complete Your Selection"}
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
