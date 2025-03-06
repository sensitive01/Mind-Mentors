import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  Modal,
  ThemeProvider,
  createTheme,
  styled,
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
  PersonAdd as AddStudentIcon,
  EventBusy as NoScheduleIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { getClassShedules } from "../../../api/service/employee/serviceDeliveryService";
import {
  AnimatedCard,
  ClassCard,
  customColors,
  DetailRow,
  IconText,
  ModalContent,
  theme,
} from "../../coach/Layout/customStyle";

const NoScheduleCard = ({ day }) => (
  <ClassCard
    elevation={2}
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 3,
      backgroundColor: "rgba(100, 43, 143, 0.05)",
      border: "2px dashed rgba(100, 43, 143, 0.2)",
      opacity: 1,
      transform: "translateY(0)",
      mb: 2,
      minHeight: "150px",
    }}
  >
    <NoScheduleIcon
      sx={{
        fontSize: 40,
        color: customColors.primary,
        opacity: 0.5,
        mb: 2,
      }}
    />
    <Typography
      variant="body1"
      sx={{
        color: customColors.primary,
        textAlign: "center",
        fontWeight: 500,
      }}
    >
      No classes scheduled for {day}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        color: customColors.secondary,
        textAlign: "center",
        mt: 1,
      }}
    >
      Click "Create Schedules" to add a class
    </Typography>
  </ClassCard>
);

const ScheduleKanban = () => {
  const [scheduleData, setScheduleData] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchAllClassSchedules = async () => {
      try {
        const response = await getClassShedules();
        console.log(response);

        const transformedData = response.reduce((acc, classItem) => {
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
        }, {});

        const days = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];

        const orderedData = days.reduce((acc, day) => {
          if (transformedData[day] && transformedData[day].length > 0) {
            acc[day] = transformedData[day].sort((a, b) => {
              return parseTime(a.time) - parseTime(b.time);
            });
          } else {
            acc[day] = [];
          }
          return acc;
        }, {});

        setScheduleData(orderedData);
      } catch (error) {
        console.error("Error fetching class schedules:", error);
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

  const handleAddKids = (e, classInfo) => {
    e.stopPropagation();
    console.log("Add kids for class:", classInfo);
    // navigate(`/serviceAssignClassToKid/${classInfo.id}`);
  };

  return (
    <ThemeProvider theme={theme}>
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
            sx={{ color: "text.primary", fontWeight: 600 }}
          >
            Class Schedules
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/centeradmin/department/create-time-table"
            color="primary"
          >
            + Create Schedule
          </Button>
        </Box>

        <Grid
          container
          spacing={3}
          sx={{
            flexWrap: "nowrap",
            overflowX: "auto",
            pb: 2,
          }}
        >
          {Object.entries(scheduleData).map(([day, classes]) => (
            <Grid
              item
              xs={12 / 7}
              key={day}
              sx={{ minWidth: "300px", maxHeight: "calc(100vh - 200px)" }}
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
                  {classes.length > 0 ? (
                    classes.map((classItem, index) => (
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

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
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

                          {classItem.classType === "Class" && (
                            <IconButton
                              onClick={(e) => handleAddKids(e, classItem)}
                              sx={{
                                color: customColors.primary,
                                "&:hover": {
                                  backgroundColor: `${customColors.primary}20`,
                                },
                              }}
                            >
                              <AddStudentIcon />
                            </IconButton>
                          )}
                        </Box>
                      </ClassCard>
                    ))
                  ) : (
                    <NoScheduleCard day={day} />
                  )}
                </CardContent>
              </AnimatedCard>
            </Grid>
          ))}
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
    </ThemeProvider>
  );
};

export default ScheduleKanban;
