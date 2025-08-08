import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ClassCalenderLayout = ({
  kidData,
  availableClasses,
  selectedClasses,
  onClassSelection,
  classMode,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [classType, setClassType] = useState("all");
  const [showSelectedSummary, setShowSelectedSummary] = useState(false);

  // Get unique days that have available classes
  const availableDays = useMemo(() => {
    const days = new Set();
    availableClasses.forEach((cls) => {
      if (classType === "all" || cls.type === classType) {
        days.add(cls.day);
      }
    });
    return days;
  }, [availableClasses, classType]);

  // Generate available dates for the next 3 months based on available days
  const availableDates = useMemo(() => {
    const dates = new Set();
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);

    for (
      let date = new Date(today);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      if (availableDays.has(dayName) && date >= today.setHours(0, 0, 0, 0)) {
        dates.add(new Date(date).toDateString());
      }
    }

    return dates;
  }, [availableDays]);

  // Get classes available for selected date
  const availableClassesForDate = useMemo(() => {
    if (!selectedDate) return [];

    const selectedDayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    return availableClasses
      .filter((cls) => {
        const matchesDay = cls.day === selectedDayName;
        const matchesType = classType === "all" || cls.type === classType;

        return matchesDay && matchesType;
      })
      .sort((a, b) => {
        // Sort by time
        const timeA = a.classTime.split(" - ")[0];
        const timeB = b.classTime.split(" - ")[0];
        return timeA.localeCompare(timeB);
      });
  }, [selectedDate, availableClasses, classType]);

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

  const isPastDate = (date) => {
    return date < new Date().setHours(0, 0, 0, 0);
  };

  const handleDateSelect = (date) => {
    if (isDateAvailable(date) && !isPastDate(date)) {
      setSelectedDate(date);
    }
  };

  const getClassCountForDate = (date) => {
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return availableClasses.filter(
      (cls) =>
        cls.day === dayName && (classType === "all" || cls.type === classType)
    ).length;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();

    // Day headers
    const dayHeaders = dayNames.map((day) => (
      <div
        key={day}
        className="text-center text-sm font-semibold text-gray-600 py-2"
      >
        {day}
      </div>
    ));

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isAvailable = isDateAvailable(date);
      const isSelected = isDateSelected(date);
      const isPast = isPastDate(date);
      const isToday = date.toDateString() === today.toDateString();
      const classCount = getClassCountForDate(date);

      days.push(
        <div key={day} className="relative p-1">
          <button
            onClick={() => handleDateSelect(date)}
            disabled={!isAvailable || isPast}
            className={`w-full h-12 text-center rounded-lg transition-all duration-200 ${
              isSelected
                ? "bg-blue-600 text-white shadow-md"
                : isAvailable && !isPast
                ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300"
                : isPast
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-400 cursor-not-allowed"
            } ${isToday && !isSelected ? "ring-2 ring-orange-400" : ""}`}
          >
            <div
              className={`font-semibold ${
                isToday && !isSelected ? "text-orange-600" : ""
              }`}
            >
              {day}
            </div>
            {isAvailable && !isPast && classCount > 0 && !isSelected && (
              <div className="text-xs opacity-75">{classCount}</div>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
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

          <h3 className="text-lg font-bold text-gray-800">
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

        {/* Class Type Filter */}
        {classMode === "hybrid" && (
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex text-sm">
              <button
                onClick={() => setClassType("all")}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  classType === "all"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setClassType("online")}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  classType === "online"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Online
              </button>
              <button
                onClick={() => setClassType("offline")}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  classType === "offline"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Offline
              </button>
            </div>
          </div>
        )}

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {dayHeaders}
          {days}
        </div>

        {/* Simple Legend */}
        <div className="flex justify-center mt-4 space-x-4 text-xs text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-1"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded mr-1"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>
    );
  };

  const renderTimeSlots = () => {
    if (!selectedDate) {
      return (
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="text-center text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">Select a Date</h3>
            <p>Choose a date from the calendar to view available classes</p>
          </div>
        </div>
      );
    }

    if (availableClassesForDate.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No classes available
            </h3>
            <p className="text-gray-600">
              No classes scheduled for{" "}
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border">
        {/* Header */}
        <div className="p-4 border-b bg-gray-50 rounded-t-xl">
          <h3 className="font-semibold text-gray-800">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <p className="text-sm text-gray-600">
            {availableClassesForDate.length} classes available
          </p>
        </div>

        {/* Time Slots */}
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {availableClassesForDate.map((classItem) => {
            const isSelected = selectedClasses.some(
              (c) => c._id === classItem._id
            );

            return (
              <div
                key={classItem._id}
                onClick={() => onClassSelection(classItem)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onClassSelection(classItem)}
                      className="w-4 h-4 text-blue-600 rounded"
                      onClick={(e) => e.stopPropagation()}
                    />

                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-800">
                          {classItem.classTime}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="w-3 h-3" />
                        <span>{classItem.coachName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        classItem.type === "online"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {classItem.type}
                    </span>

                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Selected Classes Summary - Collapsible */}
      {selectedClasses.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl">
          <button
            onClick={() => setShowSelectedSummary(!showSelectedSummary)}
            className="w-full p-4 flex items-center justify-between hover:bg-blue-100 transition-colors rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                {selectedClasses.length}
              </div>
              <span className="font-semibold text-blue-800">
                Classes Selected
              </span>
            </div>
            {showSelectedSummary ? (
              <ChevronUp className="w-5 h-5 text-blue-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-blue-600" />
            )}
          </button>

          {showSelectedSummary && (
            <div className="px-4 pb-4 border-t border-blue-200 bg-blue-25">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {selectedClasses.map((cls) => (
                  <div
                    key={cls._id}
                    className="bg-white rounded-lg p-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">
                          {cls.day}
                        </div>
                        <div className="text-sm text-gray-600">
                          {cls.classTime}
                        </div>
                        <div className="text-xs text-gray-500">
                          {cls.coachName}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            cls.type === "online"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {cls.type}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClassSelection(cls);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Calendar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Select Date
          </h3>
          {renderCalendar()}
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Available Classes
          </h3>
          {renderTimeSlots()}
        </div>
      </div>
    </div>
  );
};

export default ClassCalenderLayout;
