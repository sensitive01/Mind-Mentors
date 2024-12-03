import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [eventTitle, setEventTitle] = useState("");

  const eventTypes = {
    longEvent: { bg: "bg-red-500", text: "text-white" },
    allDayEvent: { bg: "bg-purple-500", text: "text-white" },
    repeatir: { bg: "bg-blue-500", text: "text-white" },
    birthday: { bg: "bg-yellow-500", text: "text-white" },
  };

  const getMonthStart = () => {
    const start = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    return start;
  };

  const getMonthEnd = () => {
    const end = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    return end;
  };

  const generateCalendarDays = () => {
    const start = getMonthStart();
    const end = getMonthEnd();
    const days = [];
    const padding = start.getDay();

    for (let i = 0; i < padding; i++) {
      days.push(null);
    }

    for (let i = 1; i <= end.getDate(); i++) {
      days.push(i);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleAddEvent = () => {
    if (!selectedDay || !eventTitle) return;

    const newEvent = { type: "longEvent", title: eventTitle };
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      if (!updatedEvents[selectedDay]) {
        updatedEvents[selectedDay] = [];
      }
      updatedEvents[selectedDay].push(newEvent);
      return updatedEvents;
    });
    setEventTitle("");
    setSelectedDay(null);
  };

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
            Today
          </button>
        </div>
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
            Month
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
            Week
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
            Day
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="bg-white p-4 text-center text-gray-500 text-sm"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          const isCurrentMonth = day && day <= getMonthEnd().getDate();
          const hasEvents = events[day] && events[day].length > 0;

          return (
            <div
              key={index}
              className={`bg-white border-t relative min-h-[100px] p-2 cursor-pointer ${
                !isCurrentMonth ? "text-gray-300" : ""
              }`}
              onClick={() => (isCurrentMonth ? handleDayClick(day) : null)}
            >
              <span className="text-sm text-gray-500">
                {isCurrentMonth ? day : ""}
              </span>

              {isCurrentMonth &&
                hasEvents &&
                events[day].map((event, idx) => (
                  <div
                    key={idx}
                    className={`${eventTypes[event.type].bg} ${
                      eventTypes[event.type].text
                    } text-sm p-1 rounded mt-1`}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">
            Create Event for Day {selectedDay}
          </h3>
          <input
            type="text"
            placeholder="Event Title"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleAddEvent}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
