function convertTo12HourFormat(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12; // Convert 0 hours to 12 for AM/PM format
  return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

module.exports = convertTo12HourFormat;
