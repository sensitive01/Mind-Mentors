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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
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
  CheckCircle as AttendanceIcon,
  Today as TodayIcon,
  ViewWeek as AllClassesIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import {
  centerClassTimeTable,
  getClassShedules,
} from "../../../api/service/employee/serviceDeliveryService";
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

// Today's Class Card Component
const TodayClassCard = ({ classItem, onAttendance }) => (
  <Card
    sx={{
      mb: 2,
      borderRadius: 2,
      boxShadow: "0 4px 12px rgba(100, 43, 143, 0.15)",
      border: `1px solid ${customColors.primary}20`,
      "&:hover": {
        boxShadow: "0 6px 20px rgba(100, 43, 143, 0.25)",
        transform: "translateY(-2px)",
      },
      transition: "all 0.3s ease",
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: customColors.primary,
                mr: 2,
                width: 48,
                height: 48,
              }}
            >
              <SubjectIcon />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: customColors.primary,
                  fontWeight: "bold",
                  mb: 0.5,
                }}
              >
                {classItem.subject}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: customColors.secondary }}
              >
                {classItem.level}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TimeIcon
                  sx={{ color: customColors.accent, mr: 1, fontSize: 20 }}
                />
                <Typography variant="body2" sx={{ color: customColors.accent }}>
                  {classItem.time}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TeacherIcon
                  sx={{ color: customColors.highlight, mr: 1, fontSize: 20 }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: customColors.highlight }}
                >
                  {classItem.teacher}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <StudentsIcon
                  sx={{ color: customColors.secondary, mr: 1, fontSize: 20 }}
                />
                <Chip
                  label={`${classItem.students} students`}
                  size="small"
                  sx={{
                    borderColor: customColors.primary,
                    color: customColors.primary,
                  }}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      classItem.status === "Scheduled" ? "green" : "orange",
                    fontWeight: 500,
                  }}
                >
                  Status: {classItem.status}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ ml: 2 }}>
          <Button
            variant="contained"
            startIcon={<AttendanceIcon />}
            onClick={() => onAttendance(classItem.id)}
            sx={{
              bgcolor: customColors.primary,
              "&:hover": {
                bgcolor: customColors.secondary,
              },
              borderRadius: 2,
              px: 3,
            }}
          >
            Add Attendance
          </Button>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const CenterAdminClassShedules = () => {
  const department = localStorage.getItem("department");
  const empId = localStorage.getItem("empId");
  const [scheduleData, setScheduleData] = useState({});
  const [todayClasses, setTodayClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  // Get today's day name
  const getTodayDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date().getDay()];
  };

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
        const response = await centerClassTimeTable(empId);
        console.log(response);

        const transformedData = response.reduce((acc, classItem) => {
          if (!acc[classItem.day]) {
            acc[classItem.day] = [];
          }

          const classInfo = {
            id: classItem._id,
            time: classItem.classTime,
            subject: classItem.program,
            teacher: classItem.coachName,
            students: classItem.selectedStudents.length || 0,
            level: classItem.level,
            classType: classItem.classType,
            status: classItem.status,
            meetingLink: classItem.meetingLink,
          };

          acc[classItem.day] = [...acc[classItem.day], classInfo];
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

        // Set today's classes
        const today = getTodayDay();
        const todayClassList = orderedData[today] || [];
        setTodayClasses(todayClassList);
      } catch (error) {
        console.error("Error fetching class schedules:", error);
        setScheduleData({});
        setTodayClasses([]);
      }
    };

    fetchAllClassSchedules();
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

  const handleAddKids = (e, classInfo) => {
    e.stopPropagation();
    console.log("Add kids for class:", classInfo);
    // navigate(`/serviceAssignClassToKid/${classInfo.id}`);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAttendance = (classId) => {
    navigate(`/centeradmin/department/add-attandance-to-kid/${classId}`);
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

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                color: customColors.secondary,
                fontWeight: 500,
                "&.Mui-selected": {
                  color: customColors.primary,
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: customColors.primary,
              },
            }}
          >
            <Tab
              icon={<TodayIcon />}
              label="Today's Classes"
              iconPosition="start"
            />
            <Tab
              icon={<AllClassesIcon />}
              label="All Classes"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {tabValue === 0 ? (
          // Today's Classes Tab
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: customColors.primary,
                mb: 2,
                fontWeight: 600,
              }}
            >
              Today's Classes ({getTodayDay()})
            </Typography>
            {todayClasses.length > 0 ? (
              todayClasses.map((classItem, index) => (
                <TodayClassCard
                  key={`today-${index}`}
                  classItem={classItem}
                  onAttendance={handleAttendance}
                />
              ))
            ) : (
              <Card
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 2,
                  backgroundColor: "rgba(100, 43, 143, 0.05)",
                  border: "2px dashed rgba(100, 43, 143, 0.2)",
                }}
              >
                <NoScheduleIcon
                  sx={{
                    fontSize: 60,
                    color: customColors.primary,
                    opacity: 0.5,
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: customColors.primary,
                    mb: 1,
                  }}
                >
                  No classes scheduled for today
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: customColors.secondary,
                  }}
                >
                  Enjoy your day off or use this time to plan future classes!
                </Typography>
              </Card>
            )}
          </Box>
        ) : (
          // All Classes Tab (existing grid view)
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
        )}

        {/* Modal (unchanged) */}
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
                        width: "100%",
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
                        disabled={selectedClass.status !== "Scheduled"}
                        sx={{
                          height: "fit-content",
                          backgroundColor:
                            selectedClass.status !== "Scheduled"
                              ? "#cccccc"
                              : "#642b8f",
                          color:
                            selectedClass.status !== "Scheduled"
                              ? "black"
                              : "white",
                          "&:hover": {
                            backgroundColor:
                              selectedClass.status !== "Scheduled"
                                ? "#cccccc"
                                : "#0056b3",
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

export default CenterAdminClassShedules;
