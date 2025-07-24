import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  Award,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Edit,
  MapPin,
  X,
  RefreshCw,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  employeeBookDemoClassData,
  employeeCancelDemoClass,
  getDemoClassData,
  getKidSheduleDemoDetailsEmployee,
  // cancelDemoClass,
} from "../../../api/service/employee/EmployeeService";

const SheduleDemoClass = () => {
  const navigate = useNavigate();
  const { enqId, isSheduled } = useParams();
  const department = localStorage.getItem("department");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoDetails, setDemoDetails] = useState(null);
  const [kidData, setKidData] = useState(null);

  // Form state
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [classType, setClassType] = useState("online");
  const [currentStep, setCurrentStep] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 6)); // July 2025
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getDemoResponse = await getDemoClassData(enqId, isSheduled);
        if (getDemoResponse.status === 200) {
          const response = await getKidSheduleDemoDetailsEmployee(
            getDemoResponse.data.kidData.kidId
          );

          // Demo already scheduled
          setDemoDetails(getDemoResponse.data.demoDetails);
          setKidData(getDemoResponse.data.kidData);
          setApiData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load demo class details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enqId, isSheduled]);

  // Check if kid has selected programs
  const hasSelectedPrograms = apiData?.kidData?.selectedProgram?.length > 0;

  // Extract programs and levels from demoClassData
  const programs = useMemo(() => {
    if (!apiData?.demoClassData) return [];
    return [
      ...new Set(apiData.demoClassData.map((item) => item.program)),
    ].sort();
  }, [apiData]);

  const levels = useMemo(() => {
    if (!selectedProgram || !apiData?.demoClassData) return [];
    return [
      ...new Set(
        apiData.demoClassData
          .filter((item) => item.program === selectedProgram)
          .map((item) => item.level)
      ),
    ].sort();
  }, [selectedProgram, apiData]);

  // Set initial values if kid has selected programs
  useEffect(() => {
    if (hasSelectedPrograms && !isEditing) {
      const firstProgram = apiData.kidData.selectedProgram[0];
      setSelectedProgram(firstProgram.program);
      setSelectedLevel(firstProgram.level);
    }
  }, [apiData, hasSelectedPrograms, isEditing]);

  // Get available dates for selected program and level based on days
  const availableDates = useMemo(() => {
    if (!selectedProgram || !selectedLevel || !apiData?.demoClassData)
      return new Set();

    const availableDays = apiData.demoClassData
      .filter(
        (slot) =>
          slot.program === selectedProgram &&
          slot.level === selectedLevel &&
          slot.enrolledKidCount < slot.maximumKidCount
      )
      .map((slot) => slot.day);

    const uniqueDays = [...new Set(availableDays)];

    const dates = new Set();
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);

    const dayNameToNumber = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    for (
      let date = new Date(today);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      if (uniqueDays.includes(dayName)) {
        dates.add(new Date(date).toDateString());
      }
    }

    return dates;
  }, [selectedProgram, selectedLevel, apiData]);

  // Get time slots for selected date and type (online/offline) based on day
  const availableTimeSlots = useMemo(() => {
    if (
      !selectedProgram ||
      !selectedLevel ||
      !selectedDate ||
      !apiData?.demoClassData
    )
      return [];

    const selectedDayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    return apiData.demoClassData
      .filter(
        (slot) =>
          slot.program === selectedProgram &&
          slot.level === selectedLevel &&
          slot.day === selectedDayName &&
          slot.enrolledKidCount < slot.maximumKidCount &&
          slot.type === classType
      )
      .sort((a, b) => {
        const timeA = a.classTime.split(" - ")[0];
        const timeB = b.classTime.split(" - ")[0];
        return timeA.localeCompare(timeB);
      });
  }, [selectedProgram, selectedLevel, selectedDate, apiData, classType]);

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatMonthYear = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const isDateAvailable = (date) => {
    return availableDates.has(date.toDateString());
  };

  const isDateSelected = (date) => {
    return selectedDate && selectedDate.toDateString() === date.toDateString();
  };

  const handleDateSelect = (date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedSlot(null);
    }
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSelectedProgram("");
    setSelectedLevel("");
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleReschedule = () => {
    // Reset form to allow rescheduling
    setIsEditing(true);
    setCurrentStep(0);
    setSelectedProgram(demoDetails.program);
    setSelectedLevel(demoDetails.level);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleCancelDemo = async () => {
    try {
      console.log(demoDetails._id);
      const response = await employeeCancelDemoClass(
        demoDetails._id,
        kidData.kidId
      );
      if (response.status === 200) {
        toast.success("Demo class cancelled successfully");
        // Refresh the data
        const getDemoResponse = await getDemoClassData(enqId, false);
        if (getDemoResponse.status === 200) {
          const response = await getKidSheduleDemoDetailsEmployee(
            getDemoResponse.data.kidData.kidId
          );
          setApiData(response.data);
          setDemoDetails(null);
        }
      }
    } catch (error) {
      console.error("Error cancelling demo:", error);
      toast.error("Failed to cancel demo class");
    }
  };

  const handleBookDemo = async () => {
    if (selectedSlot) {
      const formattedDate = selectedDate.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const bookingDetails = {
        classId: selectedSlot._id,
        program: selectedProgram,
        level: selectedLevel,
        date: formattedDate,
        time: selectedSlot.classTime,
        coachName: selectedSlot.coachName,
        type: classType,
        centerName: selectedSlot.centerName,
        centerId: selectedSlot.centerId,
      };

      console.log("Booking details:", bookingDetails);
      const response = await employeeBookDemoClassData(
        kidData.kidId,
        bookingDetails
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        setTimeout(() => {
          // navigate(`/${department}/department/schedule-demo-class-list-individually/${enqId}/true`);
          navigate(`/${department}/department/enrollment-data`);
        }, 1500);
      }
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return selectedProgram && selectedLevel;
    if (currentStep === 1) return selectedDate;
    if (currentStep === 2) return selectedSlot;
    return false;
  };

  const steps = [
    { title: "Choose Program & Level", icon: BookOpen },
    { title: "Pick Date", icon: Calendar },
    { title: "Choose Time", icon: Clock },
  ];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const dayHeaders = dayNames.map((day) => (
      <div
        key={day}
        className="text-center text-sm font-medium text-gray-600 py-2"
      >
        {day}
      </div>
    ));

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isAvailable = isDateAvailable(date);
      const isSelected = isDateSelected(date);
      const isPast = date < new Date().setHours(0, 0, 0, 0);

      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const slotsCount =
        apiData?.demoClassData?.filter(
          (slot) =>
            slot.day === dayName &&
            slot.program === selectedProgram &&
            slot.level === selectedLevel &&
            slot.enrolledKidCount < slot.maximumKidCount
        ).length || 0;

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(date)}
          disabled={!isAvailable || isPast}
          className={`p-3 text-center rounded-lg transition-all duration-200 ${
            isSelected
              ? "bg-blue-600 text-white shadow-lg transform scale-110"
              : isAvailable && !isPast
              ? "bg-green-100 text-primary hover:bg-green-200 border-2 border-green-300"
              : isPast
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          <div className="font-medium">{day}</div>
          {isAvailable && !isPast && slotsCount > 0 && (
            <div className="text-xs mt-1">{slotsCount} slots</div>
          )}
        </button>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1
                )
              )
            }
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold text-gray-800">
            {formatMonthYear(currentMonth)}
          </h3>
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1
                )
              )
            }
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {dayHeaders}
          {days}
        </div>

        <div className="flex items-center justify-center mt-6 space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded mr-2"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
            <span className="text-gray-600">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <span className="text-gray-600">No slots</span>
          </div>
        </div>
      </div>
    );
  };

  const getProgramIcon = (program) => {
    const icons = {
      Chess: "♟️",
      Math: "🧮",
      English: "📚",
      Science: "🔬",
      Coding: "💻",
    };
    return icons[program] || "📚";
  };

  const getLevelIcon = (level) => {
    if (level.includes("Beginner") || level.includes("Absolute")) return "🌱";
    if (level.includes("Intermediate")) return "📈";
    if (level.includes("Advanced")) return "🏆";
    return "📊";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading demo class details...</p>
        </div>
      </div>
    );
  }

  if (!apiData && !demoDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error loading demo class details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {demoDetails ? "Manage Demo Class" : "Book Your Free Demo Class"}
          </h1>
          <p className="text-lg text-gray-600">
            {demoDetails
              ? "View or modify scheduled demo class"
              : "Choose your child's program and find the perfect date & time"}
          </p>
        </div>

        {/* Display scheduled demo details if exists */}
        {demoDetails && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Currently Scheduled Demo
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800 mb-1">
                      Student
                    </h3>
                    <p className="font-semibold">{kidData.kidFirstName}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-800 mb-1">
                      Program
                    </h3>
                    <p className="font-semibold">
                      {demoDetails.program} - {demoDetails.level}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-800 mb-1">
                      Date & Time
                    </h3>
                    <p className="font-semibold">
                      {demoDetails.date} at {demoDetails.time}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-yellow-800 mb-1">
                      Coach
                    </h3>
                    <p className="font-semibold">{demoDetails.coachName}</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-indigo-800 mb-1">
                      Type
                    </h3>
                    <p className="font-semibold">
                      {demoDetails.type === "online" ? "Online" : "Offline"}
                    </p>
                  </div>
                  {demoDetails.type === "offline" && (
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-pink-800 mb-1">
                        Center
                      </h3>
                      <p className="font-semibold">{demoDetails.centerName}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleReschedule}
                  className="flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reschedule
                </button>
                <button
                  onClick={handleCancelDemo}
                  className="flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Demo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Show scheduling form if no demo scheduled or rescheduling */}
        {(!demoDetails || isEditing) && (
          <>
            {/* Progress Steps */}
            <div className="flex justify-center mb-8 overflow-x-auto">
              <div className="flex items-center space-x-2 md:space-x-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === index;
                  const isCompleted = currentStep > index;

                  return (
                    <React.Fragment key={index}>
                      <div
                        className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all whitespace-nowrap ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : isCompleted
                            ? "bg-green-600 text-white"
                            : "bg-white text-gray-500"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                        <span className="font-medium text-sm md:text-base">
                          {step.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-gray-400 hidden md:block" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              {/* Step 0: Program & Level Selection */}
              {currentStep === 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Choose Program & Level
                  </h2>

                  {hasSelectedPrograms && !isEditing ? (
                    <div className="max-w-2xl mx-auto">
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">
                              Current Selection
                            </h3>
                            <div className="flex items-center space-x-4">
                              <div>
                                <span className="text-gray-600 block">
                                  Program
                                </span>
                                <span className="font-semibold text-gray-800">
                                  {selectedProgram}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 block">
                                  Level
                                </span>
                                <span className="font-semibold text-gray-800">
                                  {selectedLevel}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={handleEdit}
                            className="flex items-center px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-2xl mx-auto space-y-6">
                      {/* Program Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Program *
                        </label>
                        <div className="relative">
                          <select
                            value={selectedProgram}
                            onChange={(e) => {
                              setSelectedProgram(e.target.value);
                              setSelectedLevel("");
                              setSelectedDate(null);
                              setSelectedSlot(null);
                            }}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg appearance-none bg-white focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
                          >
                            <option value="">Choose a program...</option>
                            {programs.map((program) => (
                              <option key={program} value={program}>
                                {getProgramIcon(program)} {program}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Level Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Level *
                        </label>
                        <div className="relative">
                          <select
                            value={selectedLevel}
                            onChange={(e) => {
                              setSelectedLevel(e.target.value);
                              setSelectedDate(null);
                              setSelectedSlot(null);
                            }}
                            disabled={!selectedProgram}
                            className={`w-full px-4 py-3 border-2 rounded-lg appearance-none bg-white focus:border-green-500 focus:outline-none transition-colors ${
                              !selectedProgram
                                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                : "border-gray-200 text-gray-800"
                            }`}
                          >
                            <option value="">
                              {!selectedProgram
                                ? "First select a program..."
                                : "Choose a level..."}
                            </option>
                            {levels.map((level) => (
                              <option key={level} value={level}>
                                {getLevelIcon(level)} {level}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Selection Preview */}
                      {selectedProgram && selectedLevel && (
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-xl p-4 mt-6">
                          <div className="flex items-center justify-center space-x-4">
                            <div className="text-center">
                              <div className="text-2xl mb-1">
                                {getProgramIcon(selectedProgram)}
                              </div>
                              <div className="text-sm font-medium text-gray-800">
                                {selectedProgram}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <div className="text-center">
                              <div className="text-2xl mb-1">
                                {getLevelIcon(selectedLevel)}
                              </div>
                              <div className="text-sm font-medium text-gray-800">
                                {selectedLevel}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Date Selection */}
              {currentStep === 1 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Choose a date for your demo class
                    </h2>
                    <div className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full">
                      <span className="text-blue-800 font-medium">
                        {selectedProgram} • {selectedLevel}
                      </span>
                    </div>
                  </div>

                  {availableDates.size === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">😔</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No dates available
                      </h3>
                      <p className="text-gray-600">
                        Please try a different program or level combination
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-2xl mx-auto">{renderCalendar()}</div>
                  )}
                </div>
              )}

              {/* Step 2: Time Slot Selection */}
              {currentStep === 2 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Choose your preferred time
                    </h2>
                    <div className="inline-flex items-center bg-purple-50 px-4 py-2 rounded-full">
                      <span className="text-purple-800 font-medium">
                        {selectedDate?.toLocaleDateString("en-IN", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Class Type Selection */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-white p-2 rounded-xl border border-gray-200 inline-flex">
                      <button
                        onClick={() => setClassType("online")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                          classType === "online"
                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        Online Classes
                      </button>
                      <button
                        onClick={() => setClassType("offline")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                          classType === "offline"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        Offline Classes
                      </button>
                    </div>
                  </div>

                  {availableTimeSlots.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">😕</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No {classType} slots available
                      </h3>
                      <p className="text-gray-600">
                        Please try a different date or switch to{" "}
                        {classType === "online" ? "offline" : "online"} classes
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                      {availableTimeSlots.map((slot) => (
                        <button
                          key={slot._id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                            selectedSlot?._id === slot._id
                              ? "border-purple-500 bg-purple-50 shadow-lg ring-2 ring-purple-300 ring-offset-2"
                              : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center text-gray-800 mb-2">
                                <Clock className="w-5 h-5 mr-2 text-purple-600" />
                                <span className="text-lg font-bold">
                                  {slot.classTime}
                                </span>
                              </div>
                            </div>
                            {selectedSlot?._id === slot._id && (
                              <div className="bg-purple-100 text-purple-800 p-1 rounded-full flex items-center gap-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    slot.type === "online"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {slot.type}
                                </span>
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          {slot.type === "offline" && (
                            <div className="mt-3 flex items-center text-gray-700">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span className="text-sm">{slot.centerName}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                    currentStep === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>

                {currentStep < 2 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all ${
                      canProceed()
                        ? "bg-primary text-white hover:bg-primary shadow-lg"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleBookDemo}
                    disabled={!selectedSlot}
                    className={`px-8 py-3 rounded-lg font-medium transition-all ${
                      selectedSlot
                        ? "bg-primary text-white hover:bg-primary shadow-lg"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {demoDetails ? "Reschedule Demo" : "Book Free Demo Class"}
                  </button>
                )}
              </div>
            </div>

            {/* Selected Summary (when on final step) */}
            {currentStep === 2 && selectedSlot && (
              <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Check className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-primary">
                    {demoDetails
                      ? "New Demo Class Details"
                      : "Your Demo Class Details"}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 block">Program</span>
                    <span className="font-semibold text-gray-800">
                      {selectedProgram}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Level</span>
                    <span className="font-semibold text-gray-800">
                      {selectedLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Date & Time</span>
                    <span className="font-semibold text-gray-800">
                      {selectedDate?.toLocaleDateString("en-IN")} at{" "}
                      {selectedSlot.classTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-600 block">Class Type</span>
                    <span className="font-semibold text-gray-800">
                      {classType === "online" ? "Online" : "Offline"}
                    </span>
                  </div>
                  {classType === "offline" && (
                    <div>
                      <span className="text-gray-600 block">Center</span>
                      <span className="font-semibold text-gray-800">
                        {selectedSlot.centerName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SheduleDemoClass;
