import { useContext, useEffect, useState } from "react";
import { Plus, Trash2, Calendar, Clock, MapPin, User } from "lucide-react";
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
  const regFormData = useSelector((state) => state.formData);
  console.log("regFormData", regFormData);

  const [enrollments, setEnrollments] = useState([
    {
      id: Date.now(),
      program: "",
      programLevel: "",
    },
  ]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [uniquePrograms, setUniquePrograms] = useState([]);
  const [uniqueLevels, setUniqueLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCooldown, setIsCooldown] = useState(false);

  // Function to get next occurrence of a specific day
  const getNextDateForDay = (dayName) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date();
    const targetDay = days.indexOf(dayName);

    if (targetDay === -1) return null;

    const daysUntilTarget = (targetDay - today.getDay() + 7) % 7;
    const nextDate = new Date(today);

    // If it's the same day, get next week's occurrence
    if (daysUntilTarget === 0) {
      nextDate.setDate(today.getDate() + 7);
    } else {
      nextDate.setDate(today.getDate() + daysUntilTarget);
    }

    return nextDate;
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchDemoClass = async () => {
      setIsLoading(true);
      try {
        const response = await getDemoSheduleClass();
        console.log("API Response:", response); // Debug log

        // Check if response has the expected structure
        if (response && response.data && response.data.scheduleData) {
          const scheduleData = response.data.scheduleData;

          setAvailableSlots(scheduleData);

          // Extract unique programs - Add null check
          const programs = [
            ...new Set(
              scheduleData.map((slot) => slot.program).filter(Boolean)
            ),
          ];
          setUniquePrograms(programs);

          // Extract unique levels - Add null check
          const levels = [
            ...new Set(scheduleData.map((slot) => slot.level).filter(Boolean)),
          ];
          setUniqueLevels(levels);
        } else {
          console.error("Unexpected API response structure:", response);
          toast.error("Invalid data received from server");
        }
      } catch (error) {
        console.error("Error fetching demo classes:", error);
        toast.error("Failed to load demo classes. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDemoClass();
  }, []);

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
    console.log(`Changing ${field} to ${value} for enrollment ${id}`); // Debug log

    setEnrollments((prevEnrollments) =>
      prevEnrollments.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );

    // Reset selected slot when program or level changes
    if (field === "program" || field === "programLevel") {
      setSelectedSlot(null);
    }
  };

  // Get available levels for a specific program
  const getAvailableLevels = (selectedProgram) => {
    if (!selectedProgram || !availableSlots.length) return [];

    const programSlots = availableSlots.filter(
      (slot) => slot.program && slot.program === selectedProgram
    );
    const levels = [
      ...new Set(programSlots.map((slot) => slot.level).filter(Boolean)),
    ];
    console.log(`Available levels for ${selectedProgram}:`, levels); // Debug log
    return levels;
  };

  // Filter available slots based on selected program and level
  const getMatchingSlots = (program, level) => {
    if (!program || !level || !availableSlots.length) return [];

    const matchingSlots = availableSlots.filter(
      (slot) => slot.program === program && slot.level === level
    );
    console.log(`Matching slots for ${program} - ${level}:`, matchingSlots); // Debug log
    return matchingSlots;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate enrollments
    const incompleteEnrollments = enrollments.filter(
      (enrollment) => !enrollment.program || !enrollment.programLevel
    );

    if (incompleteEnrollments.length > 0) {
      toast.error("Please complete all program and level selections");
      return;
    }

    if (!selectedSlot) {
      toast.error("Please select a demo class slot");
      return;
    }

    const programsData = enrollments.map(({ program, programLevel }) => ({
      program,
      programLevel,
    }));

    const formData = {
      programs: programsData,
      scheduleId: selectedSlot?._id,
      selectedSlot: selectedSlot,
      hasSchedule: !!selectedSlot,
      scheduledDate: selectedSlot ? getNextDateForDay(selectedSlot.day) : null,
    };

    dispatch(
      setFormData((prevData) => ({
        ...prevData,
        ...formData,
      }))
    );

    try {
      const response = await parentBookDemoClass(formData, state);
      console.log("Registration response:", response);

      if (response.status === 200) {
        toast.success(
          "Registration successful! Your demo class has been scheduled."
        );
        console.log("FormData formData.parentId:", state, formData.parentId);
        localStorage.setItem("parentId", state?.parent?._id);
        setTimeout(() => {
          navigate("/parent/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed. Please try again.");
    }
  };
  const handleSkipDashboard = () => {
    if (state?.parent) {
      localStorage.setItem("parentId", state?.parent?._id);
    }
    toast.info("Kids Registration is incomplete, moving to dashboard");
    if (isCooldown) return;
    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 5000);

    setTimeout(() => {
      navigate("/parent/dashboard");
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <LeftLogoBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading demo classes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
      <LeftLogoBar />

      <div className="flex-1 flex flex-col p-2 lg:p-4">
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="p-3 lg:p-4 flex-1 overflow-y-auto">
            <Stepper />

            <div className="mt-3">
              <h2 className="text-lg lg:text-xl font-bold text-primary text-center mb-3">
                Enrol your Program - Level
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Program Selection Section */}
                <div className="border border-primary rounded-lg p-3 lg:p-4">
                  <h3 className="text-base lg:text-lg font-semibold text-primary mb-3 lg:mb-4">
                    Program Selection
                  </h3>

                  <div className="space-y-4">
                    {enrollments.map((enrollment, index) => (
                      <div key={enrollment.id} className="relative">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 pr-0 lg:pr-8">
                          <div className="flex flex-col">
                            <label
                              htmlFor={`program-${index}`}
                              className="font-medium mb-1 text-gray-700 text-sm"
                            >
                              Program *
                            </label>
                            <select
                              id={`program-${index}`}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full bg-white transition-all duration-200 text-sm"
                              value={enrollment.program}
                              onChange={(e) => {
                                const selectedProgram = e.target.value;
                                console.log(
                                  "Program selected:",
                                  selectedProgram
                                ); // Debug log

                                handleProgramChange(
                                  enrollment.id,
                                  "program",
                                  selectedProgram
                                );
                                // Reset program level when program changes
                                handleProgramChange(
                                  enrollment.id,
                                  "programLevel",
                                  ""
                                );
                              }}
                              required
                            >
                              <option value="">Choose a program</option>
                              {uniquePrograms.map((program) => (
                                <option key={program} value={program}>
                                  {program}
                                </option>
                              ))}
                            </select>
                            {uniquePrograms.length === 0 && (
                              <p className="text-xs text-red-500 mt-1">
                                No programs available
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col">
                            <label
                              htmlFor={`program-level-${index}`}
                              className="font-medium mb-1 text-gray-700 text-sm"
                            >
                              Program Level *
                            </label>
                            <select
                              id={`program-level-${index}`}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full bg-white transition-all duration-200 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                              value={enrollment.programLevel}
                              onChange={(e) => {
                                const selectedLevel = e.target.value;
                                console.log("Level selected:", selectedLevel); // Debug log

                                handleProgramChange(
                                  enrollment.id,
                                  "programLevel",
                                  selectedLevel
                                );
                              }}
                              disabled={!enrollment.program}
                              required
                            >
                              <option value="">
                                {enrollment.program
                                  ? "Choose a level"
                                  : "Select program first"}
                              </option>
                              {getAvailableLevels(enrollment.program).map(
                                (level) => (
                                  <option key={level} value={level}>
                                    {level}
                                  </option>
                                )
                              )}
                            </select>
                            {enrollment.program &&
                              getAvailableLevels(enrollment.program).length ===
                                0 && (
                                <p className="text-xs text-orange-500 mt-1">
                                  No levels available for this program
                                </p>
                              )}
                          </div>
                        </div>

                        {/* Available Slots Section */}
                        {enrollment.program && enrollment.programLevel && (
                          <div className="mt-3">
                            <h4 className="font-medium text-gray-700 mb-2 text-sm flex items-center gap-2">
                              <Calendar size={14} className="text-primary" />
                              Available Demo Classes
                            </h4>
                            {(() => {
                              const matchingSlots = getMatchingSlots(
                                enrollment.program,
                                enrollment.programLevel
                              );

                              if (matchingSlots.length > 0) {
                                return (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {matchingSlots.map((slot) => {
                                      const nextDate = getNextDateForDay(
                                        slot.day
                                      );
                                      return (
                                        <div
                                          key={slot._id}
                                          className={`p-2 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                                            selectedSlot?._id === slot._id
                                              ? "border-primary bg-purple-50 shadow-md"
                                              : "border-gray-200 hover:border-primary"
                                          }`}
                                          onClick={() => {
                                            console.log("Slot selected:", slot); // Debug log
                                            setSelectedSlot(slot);
                                          }}
                                        >
                                          <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                              <Calendar
                                                size={12}
                                                className="text-primary"
                                              />
                                              <p className="font-medium text-xs">
                                                {slot.day}
                                              </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                              <Clock
                                                size={12}
                                                className="text-gray-600"
                                              />
                                              <p className="text-gray-600 text-xs">
                                                {slot.classTime}
                                              </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                              <User
                                                size={12}
                                                className="text-gray-600"
                                              />
                                              <p className="text-gray-600 text-xs">
                                                {slot.coachName}
                                              </p>
                                            </div>

                                            {slot.centerName && (
                                              <div className="flex items-start gap-2">
                                                <MapPin
                                                  size={12}
                                                  className="text-gray-600 mt-0.5 flex-shrink-0"
                                                />
                                                <p className="text-gray-600 text-xs leading-tight">
                                                  {slot.centerName}
                                                </p>
                                              </div>
                                            )}

                                            {nextDate && (
                                              <div className="mt-1 pt-1 border-t border-gray-100">
                                                <p className="text-xs text-primary font-medium">
                                                  Next: {formatDate(nextDate)}
                                                </p>
                                              </div>
                                            )}

                                            {selectedSlot?._id === slot._id && (
                                              <div className="mt-1 pt-1 border-t border-primary">
                                                <p className="text-xs text-primary font-bold">
                                                  ✓ Selected
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-gray-600 text-xs text-center">
                                      No scheduled demo classes available for
                                      this program and level. You can still
                                      register and our team will contact you to
                                      schedule your demo class.
                                    </p>
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        )}

                        {enrollments.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProgram(enrollment.id)}
                            className="absolute right-0 top-6 p-1 text-red-500 hover:text-red-700 transition-colors duration-200 hover:bg-red-50 rounded-full lg:block hidden"
                            aria-label="Remove program"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}

                        {/* Mobile remove button */}
                        {enrollments.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProgram(enrollment.id)}
                            className="mt-2 w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-700 transition-colors duration-200 py-1 px-3 border border-red-200 hover:border-red-300 rounded-lg lg:hidden text-xs"
                          >
                            <Trash2 size={14} />
                            <span>Remove Program</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-2 mt-4">
                  <button
                    onClick={() => {
                      previousStep();
                      navigate(-1);
                    }}
                    type="button"
                    className="order-2 lg:order-1 w-full lg:w-1/4 bg-gray-500 text-white py-2 px-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 flex items-center justify-center text-sm"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="order-3 lg:order-2 w-full lg:w-1/2 bg-secondary text-white py-2 px-3 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition duration-300 text-sm"
                    onClick={handleSkipDashboard}
                  >
                    Skip to Dashboard
                  </button>

                  <button
                    type="submit"
                    className="order-1 lg:order-3 w-full lg:w-1/4 bg-primary text-white py-2 px-3 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300 text-sm font-medium"
                  >
                    Submit →
                  </button>
                </div>
              </form>
            </div>
          </div>
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
        className="mt-16 lg:mt-0 z-50"
      />
    </div>
  );
};

export default KidsRegistration;
