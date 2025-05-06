/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useState } from "react";

const BusinessHoursSelector = ({ onChange, initialData = [] }) => {
  // Initialize business hours for each day of the week

  const [businessHours, setBusinessHours] = useState(
    initialData && initialData.length > 0
      ? initialData
      : [
          {
            day: "Monday",
            periods: [{ openTime: "09:00", closeTime: "21:00" }],
            is24Hours: false,
            isClosed: false,
          },
          {
            day: "Tuesday",
            periods: [{ openTime: "09:00", closeTime: "21:00" }],
            is24Hours: false,
            isClosed: false,
          },
          {
            day: "Wednesday",
            periods: [{ openTime: "09:00", closeTime: "21:00" }],
            is24Hours: false,
            isClosed: false,
          },
          {
            day: "Thursday",
            periods: [{ openTime: "09:00", closeTime: "21:00" }],
            is24Hours: false,
            isClosed: false,
          },
          {
            day: "Friday",
            periods: [{ openTime: "09:00", closeTime: "21:00" }],
            is24Hours: false,
            isClosed: false,
          },
          {
            day: "Saturday",
            periods: [{ openTime: "09:00", closeTime: "21:00" }],
            is24Hours: false,
            isClosed: false,
          },
          {
            day: "Sunday",
            periods: [{ openTime: "09:00", closeTime: "21:00" }],
            is24Hours: false,
            isClosed: false,
          },
        ]
  );

  // Copy hours from one day to all other days
  const [expandedDay, setExpandedDay] = useState(null);

  // Generate time options for dropdowns
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour < 10 ? `0${hour}` : hour;
    timeOptions.push(`${formattedHour}:00`);
    timeOptions.push(`${formattedHour}:30`);
  }

  // Handle mode change
  const handleModeChange = (index, mode) => {
    const updatedHours = [...businessHours];

    if (mode === "timeBased") {
      updatedHours[index] = {
        ...updatedHours[index],
        is24Hours: false,
        isClosed: false,
        periods: updatedHours[index].periods.length
          ? updatedHours[index].periods
          : [{ openTime: "09:00", closeTime: "21:00" }],
      };
    } else if (mode === "twentyFourHours") {
      updatedHours[index] = {
        ...updatedHours[index],
        is24Hours: true,
        isClosed: false,
      };
    } else if (mode === "closed") {
      updatedHours[index] = {
        ...updatedHours[index],
        is24Hours: false,
        isClosed: true,
      };
    }

    setBusinessHours(updatedHours);
    onChange(updatedHours);
  };

  // Toggle day expanded state
  const toggleDayExpanded = (index) => {
    if (expandedDay === index) {
      setExpandedDay(null);
    } else {
      setExpandedDay(index);
    }
  };

  // Handle time change
  const handleTimeChange = (dayIndex, periodIndex, field, value) => {
    const updatedHours = [...businessHours];
    updatedHours[dayIndex].periods[periodIndex] = {
      ...updatedHours[dayIndex].periods[periodIndex],
      [field]: value,
    };
    setBusinessHours(updatedHours);
    onChange(updatedHours);
  };

  // Add a new time period to a day
  const addTimePeriod = (dayIndex) => {
    const updatedHours = [...businessHours];
    const lastPeriod =
      updatedHours[dayIndex].periods[updatedHours[dayIndex].periods.length - 1];

    // Default to the closeTime of the last period + 1 hour for new period's openTime
    let defaultOpenHour = parseInt(lastPeriod.closeTime.split(":")[0]) + 1;
    if (defaultOpenHour >= 24) defaultOpenHour = 23;

    const defaultOpenTime = `${
      defaultOpenHour < 10 ? "0" + defaultOpenHour : defaultOpenHour
    }:00`;
    let defaultCloseHour = defaultOpenHour + 2;
    if (defaultCloseHour >= 24) defaultCloseHour = 23;

    const defaultCloseTime = `${
      defaultCloseHour < 10 ? "0" + defaultCloseHour : defaultCloseHour
    }:00`;

    updatedHours[dayIndex].periods.push({
      openTime: defaultOpenTime,
      closeTime: defaultCloseTime,
    });

    setBusinessHours(updatedHours);
    onChange(updatedHours);
  };

  // Remove a time period from a day
  const removeTimePeriod = (dayIndex, periodIndex) => {
    const updatedHours = [...businessHours];
    updatedHours[dayIndex].periods.splice(periodIndex, 1);

    // If no periods left, add a default one
    if (updatedHours[dayIndex].periods.length === 0) {
      updatedHours[dayIndex].periods.push({
        openTime: "09:00",
        closeTime: "21:00",
      });
    }

    setBusinessHours(updatedHours);
    onChange(updatedHours);
  };

  // Apply current day's schedule to all other days
  const applyToAllDays = (dayIndex) => {
    const sourceDay = businessHours[dayIndex];
    const updatedHours = businessHours.map((day) => ({
      ...day,
      periods: [...sourceDay.periods],
      is24Hours: sourceDay.is24Hours,
      isClosed: sourceDay.isClosed,
    }));

    setBusinessHours(updatedHours);
    onChange(updatedHours);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <label className="block text-gray-700 font-medium">
          Operational Timings*
        </label>
        <div className="text-xs text-gray-500">
          You can add multiple time periods per day by expanding a day and
          clicking the + button
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {businessHours.map((dayData, dayIndex) => (
          <div
            key={dayData.day}
            className="border-b border-gray-200 last:border-b-0"
          >
            {/* Day Header Row */}
            <div className="grid grid-cols-12 p-3 items-center hover:bg-gray-50">
              {/* Expand/Collapse and Day */}
              <div className="col-span-3 flex items-center">
                <button
                  type="button"
                  onClick={() => toggleDayExpanded(dayIndex)}
                  className="mr-2 h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      expandedDay === dayIndex ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <span className="font-medium">{dayData.day}</span>
              </div>

              {/* Status */}
              <div className="col-span-5">
                {dayData.isClosed ? (
                  <span className="text-sm px-2 py-1 bg-red-50 text-red-600 rounded-md">
                    Closed
                  </span>
                ) : dayData.is24Hours ? (
                  <span className="text-sm px-2 py-1 bg-green-50 text-green-600 rounded-md">
                    24 Hours
                  </span>
                ) : (
                  <div>
                    {dayData.periods.map((period, idx) => (
                      <span key={idx} className="text-sm mr-2">
                        {period.openTime} - {period.closeTime}
                        {idx < dayData.periods.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Mode Selection */}
              <div className="col-span-4">
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleModeChange(dayIndex, "timeBased")}
                    className={`flex-1 py-1 px-2 text-xs flex items-center justify-center transition-colors ${
                      !dayData.isClosed && !dayData.is24Hours
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Time
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleModeChange(dayIndex, "twentyFourHours")
                    }
                    className={`flex-1 py-1 px-2 text-xs flex items-center justify-center transition-colors ${
                      dayData.is24Hours
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16z"
                        clipRule="evenodd"
                      />
                    </svg>
                    24 Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange(dayIndex, "closed")}
                    className={`flex-1 py-1 px-2 text-xs flex items-center justify-center transition-colors ${
                      dayData.isClosed
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Closed
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Time Periods */}
            {expandedDay === dayIndex &&
              !dayData.isClosed &&
              !dayData.is24Hours && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="mb-2 flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-700">
                      Time Periods
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => applyToAllDays(dayIndex)}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                          <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                        </svg>
                        Copy to all days
                      </button>
                    </div>
                  </div>

                  {dayData.periods.map((period, periodIndex) => (
                    <div
                      key={periodIndex}
                      className="mb-2 last:mb-0 bg-white p-2 rounded-md border border-gray-200 flex items-center"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Open Time
                          </label>
                          <select
                            value={period.openTime}
                            onChange={(e) =>
                              handleTimeChange(
                                dayIndex,
                                periodIndex,
                                "openTime",
                                e.target.value
                              )
                            }
                            className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {timeOptions.map((time) => (
                              <option key={`open-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Close Time
                          </label>
                          <select
                            value={period.closeTime}
                            onChange={(e) =>
                              handleTimeChange(
                                dayIndex,
                                periodIndex,
                                "closeTime",
                                e.target.value
                              )
                            }
                            className="w-full p-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {timeOptions.map((time) => (
                              <option key={`close-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="ml-3">
                        {dayData.periods.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeTimePeriod(dayIndex, periodIndex)
                            }
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addTimePeriod(dayIndex)}
                    className="mt-3 flex items-center justify-center w-full p-1.5 border border-dashed border-gray-300 text-primary rounded-md hover:bg-blue-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Add Time Period</span>
                  </button>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessHoursSelector;
