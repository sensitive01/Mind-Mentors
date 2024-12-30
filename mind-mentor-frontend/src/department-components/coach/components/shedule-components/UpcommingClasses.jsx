import { Typography, Box } from "@mui/material";

import { CalendarToday as DayIcon } from "@mui/icons-material";
import { customColors } from "../../Layout/customStyle";
import RenderClassList from "./RenderClassList";

const UpcomingClasses = ({ upcomingClasses, handleCardClick }) => {
  if (Object.keys(upcomingClasses).length === 0) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          textAlign: "center",
          p: 2,
        }}
      >
        No upcoming classes
      </Typography>
    );
  }

  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return dayOrder
    .filter((day) => upcomingClasses[day]?.length > 0)
    .map((day) => (
      <Box key={day} sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            color: customColors.primary,
            mb: 2,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          <DayIcon sx={{ mr: 1 }} />
          {day}
        </Typography>
        <RenderClassList
          classes={upcomingClasses[day]}
          handleCardClick={handleCardClick}
        />
      </Box>
    ));
};

export default UpcomingClasses;
