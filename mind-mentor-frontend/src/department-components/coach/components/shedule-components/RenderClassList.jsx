import React, { useState } from "react";
import { Chip, Typography, Button, Box } from "@mui/material";
import { ClassCard, customColors, IconText } from "../../Layout/customStyle";
import {
  AccessTime as TimeIcon,
  Person as TeacherIcon,
  People as StudentsIcon,
  School as SubjectIcon,
  VideoCall as JoinIcon,
  AssignmentTurnedIn as AttendanceIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ZoomMeeting from "./zoom2/ZoomMeeting"; // Import the video SDK component

const RenderClassList = ({
  classes = [],
  handleCardClick,
  isLiveTab = false,
}) => {
  const navigate = useNavigate();
  const [activeMeeting, setActiveMeeting] = useState(null);
  console.log(classes)

  if (!classes || classes.length === 0) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          textAlign: "center",
          p: 2,
        }}
      >
        No classes to display
      </Typography>
    );
  }

  // Function to extract meeting details
  const extractMeetingDetails = (meetingLink) => {
    try {
      console.log("meetingLink",meetingLink)
      const url = new URL(meetingLink);
      console.log("url",url)
      const params = new URLSearchParams(url.search);
      const meetingId = params.get("meetingId") || "86278368257";
      const password = params.get("password") || "NCRojxPdabjCUKIgDX2prRy9qaI0wq";
      console.log("meetingId",meetingId)
      console.log("password",password)


      return { meetingId, password };
    } catch (error) {
      console.error("Invalid meeting link:", meetingLink);
      return { meetingId: "", password: "" };
    }
  };

  const handleJoinClick = (e, classItem) => {
    e.stopPropagation();
    if (classItem.meetingLink) {
      const { meetingId, password } = extractMeetingDetails(
        classItem.meetingLink
      );
      if (meetingId) {
        setActiveMeeting({ meetingId, password });
      } else {
        console.error("Invalid or missing meeting ID.");
      }
    } else {
      console.error("No meeting link available for this class.");
    }
  };

  const handleAttendanceClick = (e, classItem) => {
    e.stopPropagation();
    console.log("Adding attendance for:", classItem);
    navigate(`/coachAttendanceFeedback/${classItem._id}`);
  };

  return (
    <>
      {classes.map((classItem, index) => (
        <ClassCard
          key={`${classItem.day}-${index}`}
          elevation={2}
          onClick={() => handleCardClick?.(classItem, classItem.day)}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            position: "relative",
            pr: isLiveTab ? { xs: 2, sm: "200px" } : 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <IconText>
              <TimeIcon sx={{ color: customColors.primary }} />
              <Typography variant="body1" sx={{ color: customColors.primary }}>
                {classItem.classTime}
              </Typography>
            </IconText>

            <IconText>
              <SubjectIcon sx={{ color: customColors.secondary }} />
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  color: customColors.primary,
                  fontWeight: "bold",
                }}
              >
                {classItem.program}
              </Typography>
            </IconText>

            <IconText>
              <TeacherIcon sx={{ color: customColors.accent }} />
              <Typography variant="body2" sx={{ color: customColors.accent }}>
                {classItem.coachName}
              </Typography>
            </IconText>

            <IconText>
              <StudentsIcon sx={{ color: customColors.highlight }} />
              <Chip
                label={`${classItem.selectedStudents?.length || 0} students`}
                size="small"
                sx={{
                  borderColor: customColors.primary,
                  color: customColors.primary,
                }}
                variant="outlined"
              />
            </IconText>
          </Box>

          {isLiveTab && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", sm: "column" },
                gap: 1,
                position: { xs: "relative", sm: "absolute" },
                right: { sm: "16px" },
                top: { sm: "50%" },
                transform: { sm: "translateY(-50%)" },
                justifyContent: "center",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<JoinIcon />}
                onClick={(e) => handleJoinClick(e, classItem)}
                sx={{
                  flex: { xs: 1, sm: "none" },
                  whiteSpace: "nowrap",
                  bgcolor: customColors.primary,
                  "&:hover": {
                    bgcolor: `${customColors.primary}dd`,
                  },
                }}
              >
                Join Now
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AttendanceIcon />}
                onClick={(e) => handleAttendanceClick(e, classItem)}
                sx={{
                  flex: { xs: 1, sm: "none" },
                  whiteSpace: "nowrap",
                  borderColor: customColors.primary,
                  color: customColors.primary,
                  "&:hover": {
                    borderColor: customColors.primary,
                    bgcolor: `${customColors.primary}11`,
                  },
                }}
              >
                Add Attendance
              </Button>
            </Box>
          )}
        </ClassCard>
      ))}

      {activeMeeting && (
        <ZoomMeeting
          meetingId={"86278368257"}
          password={"NCRojxPdabjCUKIgDX2prRy9qaI0wq"}
          onClose={() => setActiveMeeting(null)}
        />
      )}
    </>
  );
};

export default RenderClassList;
