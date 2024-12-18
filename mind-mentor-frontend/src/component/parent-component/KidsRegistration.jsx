import { useContext, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { parentBookDemoClass } from "../../api/service/parent/ParentService";
import LeftLogoBar from "./parent-dashboard/layout/LeftLogoBar";
import { StepperContext } from "../completion-status-bar/StepperContext";
import Stepper from "../completion-status-bar/Stepper";
import { getDemoSheduleClass } from "../../api/service/employee/EmployeeService";
import { useDispatch, useSelector } from "react-redux";
import { setFormData } from "../../store/regDataParentKidsSlice";

const KidsRegistration = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { previousStep } = useContext(StepperContext);

  const [enrollments, setEnrollments] = useState([
    {
      id: Date.now(),
      program: "",
      programLevel: "",
    },
  ]);
  const [date, setDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [usePredefineSlot, setUsePredefineSlot] = useState(true);
  const regFormData = useSelector((state) => state.formData);
  console.log("Toolkit datas in KidsRegistration", regFormData);

  // Function to get day of the week from a date
  const getDayOfWeek = (dateString) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  useEffect(() => {
    const fetchDemoClass = async () => {
      try {
        const response = await getDemoSheduleClass();
        console.log(response.data.scheduleData);
        setAvailableSlots(response.data.scheduleData);
      } catch (error) {
        console.error("Error fetching demo classes:", error);
      }
    };
    fetchDemoClass();
  }, []);

  useEffect(() => {
    if (date) {
      const day = getDayOfWeek(date);
      setSelectedDay(day);

      setFromTime("");
      setToTime("");
    }
  }, [date]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
  };

  const handleAddProgram = () => {
    setEnrollments([
      ...enrollments,
      { id: Date.now(), program: "", programLevel: "" },
    ]);
  };

  const handleRemoveProgram = (id) => {
    if (enrollments.length > 1) {
      setEnrollments(enrollments.filter((item) => item.id !== id));
    }
  };

  const handleProgramChange = (id, field, value) => {
    setEnrollments(
      enrollments.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      enrollments.some(
        (enrollment) => !enrollment.program || !enrollment.programLevel
      )
    ) {
      toast.error("Please complete all program and level selections");
      return;
    }

    // Validate date and time
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    // Prepare time based on selection method
    let timeToSubmit = "";
    if (usePredefineSlot) {
      // Use predefined slot time
      timeToSubmit = fromTime;
    } else {
      // Use custom time input
      if (!fromTime || !toTime) {
        toast.error("Please enter both from and to times");
        return;
      }
      timeToSubmit = `${fromTime} - ${toTime}`;
    }

    const programsData = enrollments.map(({ program, programLevel }) => ({
      program,
      programLevel,
    }));

    const formData = {
      programs: programsData,
      date,
      time: timeToSubmit,
      day: selectedDay,
    };

    dispatch(
      setFormData((prevData) => ({
        ...prevData,
        ...formData,
      }))
    );

    try {
      console.log("Registration data:", formData, state);
      const response = await parentBookDemoClass(formData, state);
      console.log(response);

      if (response.status === 201) {
        toast.success(response.data.message);
        localStorage.setItem("parentId", response?.data?.parentId);
        setTimeout(() => {
          navigate("/parent/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  // Filter available slots based on selected day
  const filteredSlots = availableSlots.filter(
    (slot) => slot.day === selectedDay
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <LeftLogoBar />

      <div className="lg:w-3/5 w-auto p-8 bg-white ml-0 mt-8 lg:mt-10 lg:ml-20 lg:mr-20 flex-1 min-h-auto rounded-lg">
        <Stepper />

        <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-md">
          <h2 className="text-2xl font-bold text-primary text-center mb-2">
            Enrol your Program - Level
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Program Selection Section */}
            <div className="border p-8 rounded-lg border-primary mb-6 relative">
              <h3 className="text-xl font-semibold text-primary mb-6">
                Program Selection
              </h3>

              <div className="space-y-6">
                {enrollments.map((enrollment, index) => (
                  <div key={enrollment.id} className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                      <div className="flex flex-col">
                        <label
                          htmlFor={`program-${index}`}
                          className="font-medium mb-2 text-gray-700"
                        >
                          Program
                        </label>
                        <select
                          id={`program-${index}`}
                          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full bg-white transition-all duration-200"
                          value={enrollment.program}
                          onChange={(e) =>
                            handleProgramChange(
                              enrollment.id,
                              "program",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="">Choose a program</option>
                          <option value="Chess">Chess</option>
                          <option value="Coding">Coding</option>
                          <option value="Rubiks Cube">Rubiks Cube</option>
                          <option value="Robotics">Robotics</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label
                          htmlFor={`program-level-${index}`}
                          className="font-medium mb-2 text-gray-700"
                        >
                          Program Level
                        </label>
                        <select
                          id={`program-level-${index}`}
                          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full bg-white transition-all duration-200"
                          value={enrollment.programLevel}
                          onChange={(e) =>
                            handleProgramChange(
                              enrollment.id,
                              "programLevel",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="">Choose a level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    {enrollments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProgram(enrollment.id)}
                        className="absolute right-0 top-8 p-2 text-red-500 hover:text-red-700 transition-colors duration-200 hover:bg-red-50 rounded-full"
                        aria-label="Remove program"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddProgram}
                className="flex items-center gap-2 text-primary hover:text-opacity-80 mt-6 py-2 px-4 rounded-lg hover:bg-purple-50 transition-all duration-200"
              >
                <Plus size={20} />
                <span>Add Another Program</span>
              </button>
            </div>

            {/* Date and Time Selection Section */}
            <div className="border p-6 rounded-md border-primary">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Suitable Date & Time
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="date" className="text-sm mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={date}
                    onChange={handleDateChange}
                    required
                  />
                </div>

                {selectedDay && (
                  <div className="flex flex-col">
                    <label className="text-sm mb-2">Select Time Option</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="timeOption"
                          checked={usePredefineSlot}
                          onChange={() => setUsePredefineSlot(true)}
                          className="mr-2"
                        />
                        Predefined Slots
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="timeOption"
                          checked={!usePredefineSlot}
                          onChange={() => setUsePredefineSlot(false)}
                          className="mr-2"
                        />
                        Custom Time
                      </label>
                    </div>
                  </div>
                )}

                {selectedDay && usePredefineSlot && (
                  <div className="flex flex-col">
                    <label htmlFor="time" className="text-sm mb-2">
                      Available Time Slots for {selectedDay}
                    </label>
                    <select
                      id="time"
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                      required
                    >
                      <option value="">Select Time</option>
                      {filteredSlots.map((slot, index) => (
                        <option key={index} value={slot.classTime}>
                          {slot.classTime} - {slot.program} ({slot.coachName})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedDay && !usePredefineSlot && (
                  <>
                    <div className="flex flex-col">
                      <label htmlFor="fromTime" className="text-sm mb-2">
                        From Time
                      </label>
                      <input
                        type="time"
                        id="fromTime"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={fromTime}
                        onChange={(e) => setFromTime(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="toTime" className="text-sm mb-2">
                        To Time
                      </label>
                      <input
                        type="time"
                        id="toTime"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={toTime}
                        onChange={(e) => setToTime(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={() => {
                  previousStep();
                  navigate(-1);
                }}
                type="button"
                className="w-1/4 bg-primary text-white py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 flex items-center justify-center"
              >
                ← Back
              </button>

              <button
                type="button"
                className="w-1/2 bg-primary text-white py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300"
                onClick={() => navigate("/parent/dashboard")}
              >
                Skip to Dashboard
              </button>

              <button
                type="submit"
                className="w-1/4 bg-primary text-white py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300"
              >
                Submit →
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
};

export default KidsRegistration;
