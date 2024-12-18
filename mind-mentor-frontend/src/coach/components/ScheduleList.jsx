import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  Paper,
  styled,
  Modal,
  createTheme,
  ThemeProvider,
  Backdrop,
  Fade,
  IconButton,
  Button,
} from "@mui/material";
import {
  AccessTime as TimeIcon,
  Person as TeacherIcon,
  People as StudentsIcon,
  School as SubjectIcon,
  Close as CloseIcon,
  EventSeat as LevelIcon,
  CalendarToday as DayIcon,
  PlayCircleOutline as LiveIcon,
  ScheduleOutlined as UpcomingIcon
} from "@mui/icons-material";

import { Link } from "react-router-dom";

import { getMyClassData } from "../../api/service/employee/coachService";

// Custom theme colors remain the same
const customColors = {
  primary: "#642b8f",
  secondary: "#F8A213",
  accent: "#AA88BE",
  highlight: "#F0BA6F",
  background: "#EFE8F0",
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f", // Indigo
      // main: '#f8a213', // Indigo
      light: "#818CF8",
      // dark: "#4F46E5",
    },
    secondary: {
      main: "#EC4899", // Pink
      light: "#F472B6",
      dark: "#DB2777",
    },
    warm: {
      main: "#F59E0B", // Amber
      light: "#FCD34D",
      dark: "#D97706",
    },
    cold: {
      main: "#3B82F6", // Blue
      light: "#60A5FA",
      dark: "#2563EB",
    },
    background: {
      default: "#F1F5F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "none",
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
        },
      },
    },
  },
});

const AnimatedCard = styled(Card)({
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 12px 20px rgba(100, 43, 143, 0.2)`,
    cursor: "pointer",
  },
  height: "100%",
  background: customColors.background,
  position: "relative",
});

const ClassCard = styled(Paper)({
  padding: "16px",
  marginBottom: "16px",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  background: "#ffffff",
  borderLeft: `4px solid ${customColors.primary}`,
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: `0 8px 16px rgba(100, 43, 143, 0.2)`,
    borderLeft: `4px solid ${customColors.secondary}`,
  },
});

const IconText = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "8px",
  "& svg": {
    transition: "transform 0.3s ease-in-out",
  },
  "&:hover svg": {
    transform: "scale(1.1)",
  },
});

const ModalContent = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "500px",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 24px 48px rgba(100, 43, 143, 0.2)",
  padding: "24px",
  outline: "none",
});

const DetailRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "16px",
  borderRadius: "8px",
  marginBottom: "16px",
  backgroundColor: customColors.background,
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateX(8px)",
  },
});

const ScheduleKanban = () => {
  const empId = localStorage.getItem("empId");
  const [liveClasses, setLiveClasses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Helper function to parse time and convert to 24-hour format
  const parseTime = (timeString) => {
    const [time, period] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    }
    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  // Function to determine if a class is live today
  const isLiveToday = (classItem) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return classItem.day === today;
  };

  useEffect(() => {
    const fetchClassSchedules = async () => {
      try {
        const response = await getMyClassData(empId);
        const classData = response.data.classData;

        // Sort classes by time
        const sortedClasses = classData.sort(
          (a, b) => parseTime(a.classTime) - parseTime(b.classTime)
        );

        // Separate live and upcoming classes
        const currentLiveClasses = sortedClasses.filter(isLiveToday);
        const currentUpcomingClasses = sortedClasses.filter(
          (classItem) => !isLiveToday(classItem)
        );

        setLiveClasses(currentLiveClasses);
        setUpcomingClasses(currentUpcomingClasses);
      } catch (error) {
        console.error("Error fetching class schedules:", error);
      }
    };

    fetchClassSchedules();
  }, [empId]);

  const handleCardClick = (classInfo, day) => {
    setSelectedClass(classInfo);
    setSelectedDay(day);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedClass(null);
    setSelectedDay(null);
  };

  // Render function for class list
  const renderClassList = (classes, isLive = false) => {
    if (classes.length === 0) {
      return (
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            p: 2,
          }}
        >
          {isLive ? "No live classes today" : "No upcoming classes"}
        </Typography>
      );
    }

    return classes.map((classItem, index) => (
      <ClassCard
        key={`${classItem.day}-${index}`}
        elevation={2}
        onClick={() => handleCardClick(classItem, classItem.day)}
        sx={{
          opacity: 1,
          transform: "translateY(0)",
          mb: 2,
          "&:last-child": { mb: 0 },
        }}
      >
        {/* Class card content remains the same as in previous implementation */}
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
              "&:hover": {
                backgroundColor: "rgba(100, 43, 143, 0.1)",
              },
            }}
            variant="outlined"
          />
        </IconText>
      </ClassCard>
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <Fade in={true}>
        <Box
          sx={{
            p: 3,
            bgcolor: customColors.background,
            minHeight: "100vh",
            background: `linear-gradient(45deg, ${customColors.background} 0%, #ffffff 100%)`,
          }}
        >
          <Box
            mb={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "text.primary", fontWeight: 600, mb: 3 }}
            >
              Class Schedules
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/serviceClassShedule"
              color="primary"
            >
              + Create Schedules
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* Live Classes Section */}
            <Grid item xs={12} md={6}>
              <AnimatedCard>
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center">
                      <LiveIcon sx={{ mr: 1, color: "red" }} />
                      <Typography variant="h6">Live Classes Today</Typography>
                    </Box>
                  }
                  sx={{
                    bgcolor: customColors.primary,
                    color: "#ffffff",
                    "& .MuiCardHeader-title": {
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    },
                  }}
                />
                <CardContent sx={{ maxHeight: "500px", overflow: "auto" }}>
                  {renderClassList(liveClasses, true)}
                </CardContent>
              </AnimatedCard>
            </Grid>

            {/* Upcoming Classes Section */}
            <Grid item xs={12} md={6}>
              <AnimatedCard>
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center">
                      <UpcomingIcon
                        sx={{ mr: 1, color: customColors.secondary }}
                      />
                      <Typography variant="h6">Upcoming Classes</Typography>
                    </Box>
                  }
                  sx={{
                    bgcolor: customColors.primary,
                    color: "#ffffff",
                    "& .MuiCardHeader-title": {
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    },
                  }}
                />
                <CardContent sx={{ maxHeight: "500px", overflow: "auto" }}>
                  {renderClassList(upcomingClasses)}
                </CardContent>
              </AnimatedCard>
            </Grid>
          </Grid>
          {/* Modal remains the same as in the previous version */}
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
              sx: {
                backgroundColor: "rgba(100, 43, 143, 0.4)",
              },
            }}
          >
            <Fade in={modalOpen}>
              <ModalContent>
                {selectedClass && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                          color: customColors.primary,
                          fontWeight: "bold",
                        }}
                      >
                        Class Details
                      </Typography>
                      <IconButton
                        onClick={handleCloseModal}
                        sx={{
                          color: customColors.primary,
                          "&:hover": {
                            backgroundColor: `${customColors.primary}20`,
                          },
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>

                    <DetailRow>
                      <DayIcon
                        sx={{ color: customColors.primary, fontSize: 28 }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ color: customColors.primary }}
                      >
                        {selectedDay}
                      </Typography>
                    </DetailRow>

                    <DetailRow>
                      <SubjectIcon
                        sx={{ color: customColors.secondary, fontSize: 28 }}
                      />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ color: customColors.primary }}
                        >
                          {selectedClass.subject}
                        </Typography>
                      </Box>
                    </DetailRow>

                    <DetailRow>
                      <TimeIcon
                        sx={{ color: customColors.accent, fontSize: 28 }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ color: customColors.accent }}
                      >
                        {selectedClass.time}
                      </Typography>
                    </DetailRow>

                    <DetailRow>
                      <TeacherIcon
                        sx={{ color: customColors.highlight, fontSize: 28 }}
                      />
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{ color: customColors.primary }}
                        >
                          Instructor
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ color: customColors.highlight }}
                        >
                          {selectedClass.teacher}
                        </Typography>
                      </Box>
                    </DetailRow>

                    <DetailRow>
                      <StudentsIcon
                        sx={{ color: customColors.secondary, fontSize: 28 }}
                      />
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{ color: customColors.primary }}
                        >
                          Class Size
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ color: customColors.secondary }}
                        >
                          {selectedClass.students} Students
                        </Typography>
                      </Box>
                    </DetailRow>

                    {selectedClass.level && selectedClass.level !== "N/A" && (
                      <DetailRow>
                        <LevelIcon
                          sx={{ color: customColors.accent, fontSize: 28 }}
                        />
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ color: customColors.primary }}
                          >
                            Level
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ color: customColors.accent }}
                          >
                            {selectedClass.level}
                          </Typography>
                        </Box>
                      </DetailRow>
                    )}

                    {selectedClass.classType && (
                      <DetailRow>
                        <Typography
                          variant="body1"
                          sx={{ color: customColors.primary }}
                        >
                          Class Type: {selectedClass.classType}
                        </Typography>
                      </DetailRow>
                    )}

                    {selectedClass.status && (
                      <DetailRow>
                        <Typography
                          variant="body1"
                          sx={{ color: customColors.primary }}
                        >
                          Status: {selectedClass.status}
                        </Typography>
                      </DetailRow>
                    )}
                  </>
                )}
              </ModalContent>
            </Fade>
          </Modal>
        </Box>
      </Fade>
    </ThemeProvider>
  );
};

export default ScheduleKanban;
