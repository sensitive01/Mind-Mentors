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
      <div className="min-h-screen bg-gray-50 p-1 xs:p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-0.5rem)] xs:h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
          <LeftLogoBar />
          <div className="lg:w-3/5 w-full p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto max-h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading demo classes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-1 xs:p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-0.5rem)] xs:h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
        <LeftLogoBar />

        <div className="lg:w-3/5 w-full p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto max-h-full flex flex-col">
          {/* Sticky Stepper */}
          <div className="sticky top-0 z-10 bg-white pb-4">
            <Stepper />
          </div>

          {/* Scrollable Form Section */}
          <div className="w-full flex-grow overflow-y-auto">
            <h2 className="text-2xl font-bold text-primary mb-2 text-center">
              Enrol your Program - Level
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 pr-2">
              {/* Program Selection Section */}
              <div className="p-4 rounded-lg shadow-md bg-white border border-primary mb-4">
                <h3 className="text-lg font-semibold text-primary mb-3">
                  Program Selection
                </h3>

                <div className="space-y-4">
                  {enrollments.map((enrollment, index) => (
                    <div key={enrollment.id} className="relative">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Program *
                          </label>
                          <select
                            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            value={enrollment.program}
                            onChange={(e) => {
                              const selectedProgram = e.target.value;
                              console.log("Program selected:", selectedProgram); // Debug log

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

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Program Level *
                          </label>
                          <select
                            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm flex items-center gap-2">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {matchingSlots.map((slot) => {
                                    const nextDate = getNextDateForDay(
                                      slot.day
                                    );
                                    return (
                                      <div
                                        key={slot._id}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                                          selectedSlot?._id === slot._id
                                            ? "border-primary bg-purple-50 shadow-md"
                                            : "border-gray-200 hover:border-primary"
                                        }`}
                                        onClick={() => {
                                          console.log("Slot selected:", slot); // Debug log
                                          setSelectedSlot(slot);
                                        }}
                                      >
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-2">
                                            <Calendar
                                              size={14}
                                              className="text-primary"
                                            />
                                            <p className="font-medium text-sm">
                                              {slot.day}
                                            </p>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <Clock
                                              size={14}
                                              className="text-gray-600"
                                            />
                                            <p className="text-gray-600 text-sm">
                                              {slot.classTime}
                                            </p>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <User
                                              size={14}
                                              className="text-gray-600"
                                            />
                                            <p className="text-gray-600 text-sm">
                                              {slot.coachName}
                                            </p>
                                          </div>

                                          {slot.centerName && (
                                            <div className="flex items-start gap-2">
                                              <MapPin
                                                size={14}
                                                className="text-gray-600 mt-0.5 flex-shrink-0"
                                              />
                                              <p className="text-gray-600 text-sm leading-tight">
                                                {slot.centerName}
                                              </p>
                                            </div>
                                          )}

                                          {nextDate && (
                                            <div className="mt-2 pt-2 border-t border-gray-100">
                                              <p className="text-sm text-primary font-medium">
                                                Next: {formatDate(nextDate)}
                                              </p>
                                            </div>
                                          )}

                                          {selectedSlot?._id === slot._id && (
                                            <div className="mt-2 pt-2 border-t border-primary">
                                              <p className="text-sm text-primary font-bold">
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
                                  <p className="text-gray-600 text-sm text-center">
                                    No scheduled demo classes available for this
                                    program and level. You can still register
                                    and our team will contact you to schedule
                                    your demo class.
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
                          className="absolute right-0 top-0 p-1 text-red-500 hover:text-red-700 transition-colors duration-200 hover:bg-red-50 rounded-full"
                          aria-label="Remove program"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between gap-4 mt-6">
                <button
                  onClick={() => {
                    previousStep();
                    navigate(-1);
                  }}
                  type="button"
                  className="w-1/4 bg-primary text-white py-3 px-4 rounded-md border-b-4 hover:border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 flex items-center justify-center"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  className={`w-1/2 bg-primary text-white py-3 px-4 rounded-md border-b-4 hover:border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300 ${
                    isCooldown ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleSkipDashboard}
                  disabled={isCooldown}
                >
                  Skip to Dashboard
                </button>

                <button
                  type="submit"
                  className={`w-1/4 bg-primary text-white py-3 px-4 rounded-md border-b-4 hover:border-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300 ${
                    isCooldown ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isCooldown}
                >
                  Submit →
                </button>
              </div>
            </form>
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
      />
    </div>
  );
};

export default KidsRegistration;
