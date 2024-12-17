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
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { getClassShedules } from "../../api/service/employee/serviceDeliveryService";

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
  const [scheduleData, setScheduleData] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchAllClassSchedules = async () => {
      try {
        const response = await getClassShedules();
        console.log(response);

        // Transform the API data into the required format
        const transformedData = response.reduce((acc, classItem) => {
          if (!acc[classItem.day]) {
            acc[classItem.day] = [];
          }

          acc[classItem.day] = [
            ...acc[classItem.day],
            {
              time: classItem.classTime,
              subject: classItem.program,
              teacher: classItem.coachName,
              students: 0,
              level: classItem.level,
              classType: classItem.classType,
              status: classItem.status,
              meetingLink: classItem.meetingLink,
            },
          ];

          return acc;
        }, {});

        // Days in sequence from Monday to Sunday
        const days = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];

        // Ensure all days are represented and sorted
        const orderedData = days.reduce((acc, day) => {
          acc[day] = transformedData[day] || [
            {
              subject: "No class scheduled",
              teacher: "N/A",
              students: 0,
              level: "N/A",
              time: "N/A",
            },
          ];
          return acc;
        }, {});

        setScheduleData(orderedData);
      } catch (error) {
        console.error("Error fetching class schedules:", error);
        // Optionally set a default or error state
        setScheduleData({});
      }
    };

    fetchAllClassSchedules();
  }, []);

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

          <Grid
            container
            spacing={3}
            sx={{
              flexWrap: "nowrap",
              overflowX: "auto",
              pb: 2, // For scrollbar space
            }}
          >
            {Object.entries(scheduleData).map(([day, classes]) => (
              <Grid
                item
                xs={12 / 7}
                key={day}
                sx={{
                  minWidth: "300px",
                  maxHeight: "calc(100vh - 200px)", // Adjust this value based on your layout
                }}
              >
                <AnimatedCard
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardHeader
                    title={day}
                    sx={{
                      bgcolor: customColors.primary,
                      color: "#ffffff",
                      flexShrink: 0,
                      "& .MuiCardHeader-title": {
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: "1.2rem",
                      },
                    }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      overflow: "auto",
                      "&::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: customColors.primary,
                        borderRadius: "4px",
                        "&:hover": {
                          background: customColors.secondary,
                        },
                      },
                      padding: "16px",
                      "&:last-child": {
                        paddingBottom: "16px",
                      },
                    }}
                  >
                    {classes.map((classItem, index) => (
                      <ClassCard
                        key={`${day}-${index}`}
                        elevation={2}
                        onClick={() => handleCardClick(classItem, day)}
                        sx={{
                          opacity: 1,
                          transform: "translateY(0)",
                          mb: 2,
                          "&:last-child": {
                            mb: 0,
                          },
                        }}
                      >
                        <IconText>
                          <TimeIcon sx={{ color: customColors.primary }} />
                          <Typography
                            variant="body1"
                            sx={{ color: customColors.primary }}
                          >
                            {classItem.time}
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
                            {`${classItem.subject}`}
                          </Typography>
                        </IconText>

                        <IconText>
                          <TeacherIcon sx={{ color: customColors.accent }} />
                          <Typography
                            variant="body2"
                            sx={{ color: customColors.accent }}
                          >
                            {classItem.teacher}
                          </Typography>
                        </IconText>

                        <IconText>
                          <StudentsIcon
                            sx={{ color: customColors.highlight }}
                          />
                          <Chip
                            label={`${classItem.students} students`}
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
                    ))}
                  </CardContent>
                </AnimatedCard>
              </Grid>
            ))}
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
