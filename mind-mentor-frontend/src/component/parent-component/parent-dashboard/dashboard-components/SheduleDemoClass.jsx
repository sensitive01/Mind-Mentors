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
  Monitor,
  Home,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getKidSheduleDemoDetails,
  parentBookDemoClassData,
} from "../../../../api/service/parent/ParentService";
import { ToastContainer, toast } from "react-toastify";

const SheduleDemoClass = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getKidSheduleDemoDetails(id);
        setApiData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [classType, setClassType] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1); // Set to first day of current month
  });
  const [isEditing, setIsEditing] = useState(false);

  const hasSelectedPrograms = apiData?.kidData?.selectedProgram?.length > 0;

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

  const availableClassTypes = useMemo(() => {
    if (!selectedProgram || !selectedLevel || !apiData?.demoClassData)
      return [];

    const types = new Set(
      apiData.demoClassData
        .filter(
          (slot) =>
            slot.program === selectedProgram &&
            slot.level === selectedLevel &&
            slot.enrolledKidCount < slot.maximumKidCount
        )
        .map((slot) => slot.type)
    );

    return Array.from(types);
  }, [selectedProgram, selectedLevel, apiData]);

  useEffect(() => {
    if (hasSelectedPrograms && !isEditing) {
      const firstProgram = apiData.kidData.selectedProgram[0];
      setSelectedProgram(firstProgram.program);
      setSelectedLevel(firstProgram.level);
    }
  }, [apiData, hasSelectedPrograms, isEditing]);

  useEffect(() => {
    if (availableClassTypes.length > 0 && !classType) {
      if (availableClassTypes.includes("online")) {
        setClassType("online");
      } else if (availableClassTypes.includes("offline")) {
        setClassType("offline");
      }
    }
  }, [availableClassTypes, classType]);

  const availableDates = useMemo(() => {
    if (
      !selectedProgram ||
      !selectedLevel ||
      !classType ||
      !apiData?.demoClassData
    )
      return new Set();

    const availableDays = apiData.demoClassData
      .filter(
        (slot) =>
          slot.program === selectedProgram &&
          slot.level === selectedLevel &&
          slot.type === classType &&
          slot.enrolledKidCount < slot.maximumKidCount
      )
      .map((slot) => slot.day);

    const uniqueDays = [...new Set(availableDays)];

    const dates = new Set();
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);

    for (
      let date = new Date(today);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      if (uniqueDays.includes(dayName) && date >= today.setHours(0, 0, 0, 0)) {
        dates.add(new Date(date).toDateString());
      }
    }

    return dates;
  }, [selectedProgram, selectedLevel, classType, apiData]);

  const availableTimeSlots = useMemo(() => {
    if (
      !selectedProgram ||
      !selectedLevel ||
      !selectedDate ||
      !classType ||
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
  }, [selectedProgram, selectedLevel, selectedDate, classType, apiData]);

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

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        setIsProcessing(true);

        console.log("programLevelData")

        const programLevelData = {
          program: selectedProgram,
          level: selectedLevel,
        };

        const response = await parentBookDemoClassData(id, programLevelData);

        if (response.status === 201) {
          setCurrentStep(currentStep + 1);
          toast.success("Program and level saved successfully!");
        } else {
          toast.error("Failed to save program and level. Please try again.");
        }
      } catch (error) {
        console.error("Error saving program and level:", error);
        toast.error("An error occurred while saving. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    } else if (currentStep < 2) {
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
    setClassType("");
    setSelectedDate(null);
    setSelectedSlot(null);
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
      const response = await parentBookDemoClassData(id, bookingDetails);
      if (response.status === 201) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate(`/parent/kid/demo-class/${id}`);
        }, 1500);
      }
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return selectedProgram && selectedLevel;
    if (currentStep === 1) return classType && selectedDate;
    if (currentStep === 2) return selectedSlot;
    return false;
  };

  const steps = [
    { title: "Choose Program & Level", icon: BookOpen },
    { title: "Select Mode & Date", icon: Calendar },
    { title: "Choose Time", icon: Clock },
  ];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Add day headers
    const dayHeaders = dayNames.map((day) => (
      <div
        key={day}
        className="text-center text-sm font-medium text-gray-600 py-2"
      >
        {day}
      </div>
    ));

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isAvailable = isDateAvailable(date);
      const isSelected = isDateSelected(date);
      const isPast = date < new Date().setHours(0, 0, 0, 0);

      // Get day name and count available slots for this day with selected class type
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const slotsCount =
        apiData?.demoClassData?.filter(
          (slot) =>
            slot.day === dayName &&
            slot.program === selectedProgram &&
            slot.level === selectedLevel &&
            slot.type === classType &&
            slot.enrolledKidCount < slot.maximumKidCount
        ).length || 0;

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(date)}
          disabled={!isAvailable || isPast}
          className={`p-3 text-center rounded-lg transition-all duration-200 ${isSelected
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
        {/* Calendar Header */}
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

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {dayHeaders}
          {days}
        </div>

        {/* Calendar Legend */}
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

  if (!apiData) {
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
            Book Your Free Demo Class
          </h1>
          <p className="text-lg text-gray-600">
            Choose your child's program and find the perfect date & time
          </p>
        </div>

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
                    className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all whitespace-nowrap ${isActive
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
                          setSelectedLevel(""); // Reset level when program changes
                          setClassType(""); // Reset class type
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
                          setClassType(""); // Reset class type
                          setSelectedDate(null);
                          setSelectedSlot(null);
                        }}
                        disabled={!selectedProgram}
                        className={`w-full px-4 py-3 border-2 rounded-lg appearance-none bg-white focus:border-green-500 focus:outline-none transition-colors ${!selectedProgram
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

          {/* Step 1: Class Mode & Date Selection */}
          {currentStep === 1 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Choose class mode and date
                </h2>
                <div className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full">
                  <span className="text-blue-800 font-medium">
                    {selectedProgram} • {selectedLevel}
                  </span>
                </div>
              </div>

              {/* Class Type Selection */}
              <div className="max-w-lg mx-auto mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  Select Class Mode
                </h3>
                <div className="flex justify-center gap-4">
                  {availableClassTypes.includes("online") && (
                    <button
                      onClick={() => {
                        setClassType("online");
                        setSelectedDate(null);
                        setSelectedSlot(null);
                      }}
                      className={`px-6 py-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 min-w-[140px] shadow-md hover:shadow-lg ${classType === "online"
                          ? "border-blue-500 bg-blue-50 ring-4 ring-blue-200 shadow-xl transform scale-105"
                          : "border-gray-200 hover:border-blue-300 bg-white"
                        }`}
                    >
                      <div
                        className={`p-3 rounded-full ${classType === "online" ? "bg-blue-100" : "bg-gray-100"
                          }`}
                      >
                        <Monitor
                          className={`w-6 h-6 ${classType === "online"
                              ? "text-blue-600"
                              : "text-gray-600"
                            }`}
                        />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-800">
                          Online
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Learn from home
                        </div>
                      </div>
                      {classType === "online" && (
                        <Check className="w-5 h-5 text-blue-600 absolute top-2 right-2" />
                      )}
                    </button>
                  )}

                  {availableClassTypes.includes("offline") && (
                    <button
                      onClick={() => {
                        setClassType("offline");
                        setSelectedDate(null);
                        setSelectedSlot(null);
                      }}
                      className={`px-6 py-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-3 min-w-[140px] shadow-md hover:shadow-lg relative ${classType === "offline"
                          ? "border-green-500 bg-green-50 ring-4 ring-green-200 shadow-xl transform scale-105"
                          : "border-gray-200 hover:border-green-300 bg-white"
                        }`}
                    >
                      <div
                        className={`p-3 rounded-full ${classType === "offline"
                            ? "bg-green-100"
                            : "bg-gray-100"
                          }`}
                      >
                        <Home
                          className={`w-6 h-6 ${classType === "offline"
                              ? "text-green-600"
                              : "text-gray-600"
                            }`}
                        />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-800">
                          Offline
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Visit center
                        </div>
                      </div>
                      {classType === "offline" && (
                        <Check className="w-5 h-5 text-green-600 absolute top-2 right-2" />
                      )}
                    </button>
                  )}
                </div>

                {availableClassTypes.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">😔</div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No class modes available
                    </h3>
                    <p className="text-gray-600">
                      Please try a different program or level combination
                    </p>
                  </div>
                )}
              </div>

              {/* Date Selection - Show only when class type is selected */}
              {classType && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                    Choose a Date
                  </h3>

                  {availableDates.size === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">😔</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No dates available for {classType} classes
                      </h3>
                      <p className="text-gray-600">
                        Please try selecting a different class mode
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-2xl mx-auto">{renderCalendar()}</div>
                  )}
                </div>
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
                <div className="space-y-2">
                  <div className="inline-flex items-center bg-purple-50 px-4 py-2 rounded-full">
                    <span className="text-purple-800 font-medium">
                      {selectedDate?.toLocaleDateString("en-IN", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full ml-2">
                    <span className="text-blue-800 font-medium capitalize">
                      {classType} Classes
                    </span>
                  </div>
                </div>
              </div>

              {availableTimeSlots.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😕</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No {classType} slots available
                  </h3>
                  <p className="text-gray-600">Please try a different date</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot._id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`group relative p-6 rounded-2xl border-3 transition-all duration-300 text-left transform hover:scale-102 cursor-pointer ${selectedSlot?._id === slot._id
                          ? "border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-2xl ring-4 ring-purple-200 ring-opacity-50 scale-105"
                          : "border-gray-300 bg-white hover:border-purple-400 hover:shadow-xl hover:bg-gradient-to-br hover:from-white hover:to-purple-25 shadow-md"
                        }`}
                      style={{
                        boxShadow:
                          selectedSlot?._id === slot._id
                            ? "0 20px 40px rgba(147, 51, 234, 0.2), 0 8px 16px rgba(147, 51, 234, 0.15)"
                            : "0 8px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      {/* Selection Indicator */}
                      {selectedSlot?._id === slot._id && (
                        <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full p-2 shadow-lg">
                          <Check className="w-4 h-4" />
                        </div>
                      )}

                      {/* Hover Pulse Effect */}
                      <div
                        className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${selectedSlot?._id === slot._id
                            ? "opacity-0"
                            : "opacity-0 group-hover:opacity-20"
                          } bg-gradient-to-r from-purple-400 to-blue-400`}
                      ></div>

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center text-gray-800 mb-3">
                              <div
                                className={`p-2 rounded-full mr-3 ${selectedSlot?._id === slot._id
                                    ? "bg-purple-200"
                                    : "bg-gray-100 group-hover:bg-purple-100"
                                  }`}
                              >
                                <Clock
                                  className={`w-5 h-5 ${selectedSlot?._id === slot._id
                                      ? "text-purple-700"
                                      : "text-gray-600 group-hover:text-purple-600"
                                    }`}
                                />
                              </div>
                              <span className="text-xl font-bold">
                                {slot.classTime}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600 mb-2 ml-2">
                              <User className="w-4 h-4 mr-2" />
                              <span className="text-sm font-medium">
                                Coach: {slot.coachName}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${slot.type === "online"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-green-100 text-green-800 border-green-200"
                                }`}
                            >
                              {slot.type.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {slot.type === "offline" && (
                          <div className="mt-3 flex items-center text-gray-700 ml-2">
                            <MapPin className="w-4 h-4 mr-2 text-green-600" />
                            <span className="text-sm font-medium">
                              {slot.centerName}
                            </span>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                          <div className="text-xs text-gray-500 font-medium">
                            Available:{" "}
                            {slot.maximumKidCount - slot.enrolledKidCount} of{" "}
                            {slot.maximumKidCount} spots
                          </div>
                          {selectedSlot?._id === slot._id ? (
                            <div className="flex items-center text-purple-600 font-bold text-sm">
                              <Check className="w-4 h-4 mr-1" />
                              SELECTED
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 group-hover:text-purple-500 font-medium transition-colors">
                              Click to select
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom accent line */}
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-300 ${selectedSlot?._id === slot._id
                            ? "bg-gradient-to-r from-purple-500 to-blue-500"
                            : "bg-gray-200 group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-blue-300"
                          }`}
                      ></div>
                    </button>
                  ))}
                </div>
              )}

              {/* Instruction text */}
              <div className="text-center mt-6 text-gray-500 text-sm">
                💡 Click on any time slot card above to select it
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${currentStep === 0
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
                disabled={!canProceed() || isProcessing}
                className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all ${canProceed() && !isProcessing
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {isProcessing && currentStep === 0 ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleBookDemo}
                disabled={!selectedSlot}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${selectedSlot
                    ? "bg-green-600 text-white hover:bg-green-700 shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                Book Free Demo Class
              </button>
            )}
          </div>
        </div>

        {/* Selected Summary (when on final step) */}
        {currentStep === 2 && selectedSlot && (
          <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Check className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-green-800">
                Your Demo Class Details
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
                <span className="font-semibold text-gray-800 capitalize">
                  {classType}
                </span>
              </div>
              <div>
                <span className="text-gray-600 block">Coach</span>
                <span className="font-semibold text-gray-800">
                  {selectedSlot.coachName}
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
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default SheduleDemoClass;
