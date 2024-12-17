// utils/dateFormatter.js
export const formatDateOnly = (isoString) => {
  try {
    console.log(isoString)
    if (!isoString) return "No Date Available";

    const date = new Date(isoString);
    if (isNaN(date.getTime())) throw new Error("Invalid Date");

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }); // Example: "December 16, 2024"
  } catch (error) {
    console.error("Date Formatting Error:", error.message);
    return "Invalid Date";
  }
};
