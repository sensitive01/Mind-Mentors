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
import { Link, useNavigate } from "react-router-dom";
import { getDemoSheduleClass } from "../../../api/service/employee/EmployeeService";
import { AnimatedCard, ClassCard, customColors, DetailRow, IconText, ModalContent, theme } from "../../../coach/Layout/customStyle";

const ScheduleKanban = () => {
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchAllClassSchedules = async () => {
      try {
        const response = await getDemoSheduleClass();
        console.log(response);

        // Transform the API data into the required format
        const transformedData = response.data.scheduleData.reduce(
          (acc, classItem) => {
            if (!acc[classItem.day]) {
              acc[classItem.day] = [];
            }

            acc[classItem.day] = [
              ...acc[classItem.day],
              {
                id: classItem._id,
                time: classItem.classTime,
                subject: classItem.program,
                teacher: classItem.coachName,
                students: classItem.selectedStudents.length || 0,
                level: classItem.level,
                classType: classItem.classType,
                status: classItem.status,
                meetingLink: classItem.meetingLink,
              },
            ];

            return acc;
          },
          {}
        );

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
              to="/employee-operation/demoSheduleForm"
              color="primary"
            >
              + Create Schedules
            </Button>
          </Box>

          <Grid container spacing={3}>
            {Object.keys(scheduleData).length === 0 ||
            Object.values(scheduleData).every(
              (classes) => classes.length === 0
            ) ? (
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    color: customColors.primary,
                    fontWeight: "bold",
                    marginTop: "20px",
                  }}
                >
                  No Schedules
                </Typography>
              </Grid>
            ) : (
              Object.entries(scheduleData).map(([day, classes]) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={day}>
                  <AnimatedCard>
                    <CardHeader
                      title={day}
                      sx={{
                        bgcolor: customColors.primary,
                        color: "#ffffff",
                        "& .MuiCardHeader-title": {
                          fontWeight: "bold",
                          textAlign: "center",
                          fontSize: "1.2rem",
                        },
                      }}
                    />
                    <CardContent>
                      {classes.map((classItem, index) => (
                        <ClassCard
                          key={`${day}-${index}`}
                          elevation={2}
                          onClick={() => handleCardClick(classItem, day)}
                          sx={{
                            opacity: 1,
                            transform: "translateY(0)",
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
                            <SubjectIcon
                              sx={{ color: customColors.secondary }}
                            />
                            <Typography
                              variant="h6"
                              component="h2"
                              sx={{
                                color: customColors.primary,
                                fontWeight: "bold",
                              }}
                            >
                              {classItem.subject}
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
              ))
            )}
          </Grid>

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
              <ModalContent
                sx={{
                  maxHeight: "80vh",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: customColors.primary,
                    borderRadius: "4px",
                  },
                }}
              >
                {selectedClass && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",

                        // position: "sticky",
                        top: 0,
                        backgroundColor: "white",
                        zIndex: 10,
                      }}
                    >
                      <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                          color: customColors.primary,
                          fontWeight: "bold",
                          margin: 0,
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
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%", // Ensure the row takes full width
                        }}
                      >
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
                            {selectedClass?.students} Students
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            navigate(
                              `/employeeAssignDemoClass/${selectedClass.id}`
                            );
                          }}
                          disabled={selectedClass.status !== "Scheduled"} // Disable button based on condition
                          sx={{
                            height: "fit-content",
                            backgroundColor:
                              selectedClass.status !== "Scheduled"
                                ? "#cccccc"
                                : "#642b8f", // Grey out if disabled
                            color:
                              selectedClass.status !== "Scheduled"
                                ? "black"
                                : "white", // Adjust text color
                            "&:hover": {
                              backgroundColor:
                                selectedClass.status !== "Scheduled"
                                  ? "#cccccc"
                                  : "#0056b3", // Maintain hover color for active button
                            },
                          }}
                        >
                          Add kids
                        </Button>
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
