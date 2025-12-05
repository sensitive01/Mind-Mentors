import React, { useState } from "react";
import {
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  IconButton,
} from "@mui/material";
import { ClassCard, customColors, IconText } from "../../Layout/customStyle";
import {
  AccessTime as TimeIcon,
  Person as TeacherIcon,
  People as StudentsIcon,
  School as SubjectIcon,
  VideoCall as JoinIcon,
  AssignmentTurnedIn as AttendanceIcon,
  OpenInNew as ExternalLinkIcon,
  VideoCall as MeetingIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import WebRtc from "./WebRtc"; // Import the updated component

const RenderClassList = ({
  classes = [],
  handleCardClick,
  handleCreateMeeting, // NEW PROP - Only passed when isLiveTab is true
  isLiveTab = false,
}) => {
  const navigate = useNavigate();
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);

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

  const handleJoinClick = (e, classItem) => {
    e.stopPropagation();

    // For live classes, use coach join URL directly
    if (isLiveTab && classItem.coachJoinUrl) {
      localStorage.setItem("bbTempClassId", classItem.bbTempClassId);
      window.open(classItem.coachJoinUrl, "_blank", "noopener,noreferrer");
      return;
    }

    // Fallback to WebRTC modal for non-live classes or if no coach URL
    setSelectedClassId(classItem._id);
    setIsMeetingOpen(true);
  };

  const handleCloseMeeting = () => {
    setIsMeetingOpen(false);
  };

  const handleAttendanceClick = (e, classItem) => {
    e.stopPropagation();
    navigate(`/coachAttandanceFeedback/${classItem._id}`);
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
            flexDirection: "column",
            gap: 2,
            position: "relative",
          }}
        >
          {/* Main Content Area */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
            }}
          >
            {/* Left Side - Class Information */}
            <Box sx={{ flex: 1 }}>
              <IconText>
                <TimeIcon sx={{ color: customColors.primary }} />
                <Typography
                  variant="body1"
                  sx={{ color: customColors.primary }}
                >
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
                <Typography
                  variant="body2"
                  sx={{ color: customColors.accent }}
                >
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

            {/* Right Side - Action Buttons (Only for Live Classes) */}
            {isLiveTab &&
              (classItem.type === "online" || classItem.type === "offline") && (
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
                  {/* Join Class button - Only for online classes */}
                  {classItem.type === "online" && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={
                        classItem.coachJoinUrl ? (
                          <ExternalLinkIcon />
                        ) : (
                          <JoinIcon />
                        )
                      }
                      onClick={(e) => handleJoinClick(e, classItem)}
                      disabled={!classItem.coachJoinUrl}
                      sx={{
                        flex: { xs: 1, sm: "none" },
                        whiteSpace: "nowrap",
                        bgcolor: classItem.coachJoinUrl
                          ? customColors.primary
                          : "grey.400",
                        "&:hover": {
                          bgcolor: classItem.coachJoinUrl
                            ? `${customColors.primary}dd`
                            : "grey.500",
                        },
                        "&:disabled": {
                          bgcolor: "grey.300",
                          color: "grey.600",
                        },
                      }}
                      title={
                        classItem.coachJoinUrl
                          ? "Click to join class in new tab"
                          : "No join link available"
                      }
                    >
                      {classItem.coachJoinUrl ? "Join Class" : "No Link"}
                    </Button>
                  )}

                  {/* Add Attendance button - For both online and offline classes */}
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

                  {/* Create Meeting button - Only shows if handleCreateMeeting prop exists */}
                  {handleCreateMeeting && (
                    <Button
                      variant="contained"
                      startIcon={<MeetingIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateMeeting(e, classItem);
                      }}
                      sx={{
                        flex: { xs: 1, sm: "none" },
                        whiteSpace: "nowrap",
                        backgroundColor: customColors.accent,
                        color: "white",
                        "&:hover": {
                          backgroundColor: customColors.secondary,
                        },
                      }}
                    >
                      {classItem.meetingLinkCreated
                        ? "Update Meeting"
                        : "Create Meeting"}
                    </Button>
                  )}
                </Box>
              )}
          </Box>

          {/* Meeting Links Section - Shows after meeting is created (ONLY IN LIVE TAB) */}
          {isLiveTab && classItem.meetingLinkCreated && (
            <Box
              sx={{
                mt: 1,
                pt: 2,
                borderTop: `1px solid ${customColors.primary}30`,
                backgroundColor: `${customColors.primary}08`,
                borderRadius: "8px",
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <LinkIcon
                  sx={{ color: customColors.primary, fontSize: 20 }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: customColors.primary,
                    fontWeight: "bold",
                  }}
                >
                  Meeting Links:
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                {/* Coach Join Link */}
                {classItem.coachJoinUrl && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<TeacherIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(classItem.coachJoinUrl, "_blank");
                    }}
                    sx={{
                      borderColor: customColors.accent,
                      color: customColors.accent,
                      "&:hover": {
                        backgroundColor: `${customColors.accent}15`,
                        borderColor: customColors.accent,
                      },
                      borderRadius: "20px",
                      px: 2.5,
                      py: 0.75,
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                    }}
                  >
                    Coach Link
                  </Button>
                )}

                {/* Student Join Link */}
                {classItem.kidJoinUrl && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<StudentsIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(classItem.kidJoinUrl, "_blank");
                    }}
                    sx={{
                      borderColor: customColors.highlight,
                      color: customColors.highlight,
                      "&:hover": {
                        backgroundColor: `${customColors.highlight}15`,
                        borderColor: customColors.highlight,
                      },
                      borderRadius: "20px",
                      px: 2.5,
                      py: 0.75,
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                    }}
                  >
                    Student Link
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </ClassCard>
      ))}
    </>
  );
};

export default RenderClassList;