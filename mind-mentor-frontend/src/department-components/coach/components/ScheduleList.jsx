import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  ThemeProvider,
  Fade,
  Tabs,
  Tab,
  Container,
  Paper,
  Badge,
  Chip,
} from "@mui/material";
import {
  PlayCircleOutline as LiveIcon,
  ScheduleOutlined as UpcomingIcon,
} from "@mui/icons-material";
import {
  getMyClassData,
  getSuperAdminAllClassData,
} from "../../../api/service/employee/coachService";
import { customColors, theme } from "../Layout/customStyle";
import RenderClassList from "./shedule-components/RenderClassList";
import UpcomingClasses from "./shedule-components/UpcommingClasses";
import ClassDetailsModal from "./shedule-components/ClassDetailModel";

const TabPanel = ({ children, value, index, ...other }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    {...other}
  >
    {value === index && (
      <Fade in={true} timeout={500}>
        <Box
          sx={{
            mt: 3,
            minHeight: "400px",
            "& > *": {
              animation: "slideUp 0.4s ease-out",
            },
            "@keyframes slideUp": {
              "0%": {
                opacity: 0,
                transform: "translateY(20px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          {children}
        </Box>
      </Fade>
    )}
  </Box>
);

const ScheduleKanban = () => {
  const [department, setDepartment] = useState(null);
  const [empId, setEmpId] = useState(null);
  const [liveClasses, setLiveClasses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);

  // Initialize localStorage values safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDepartment(localStorage.getItem("department"));
      setEmpId(localStorage.getItem("empId"));
    }
  }, []);

  // Helper function to parse time and convert to 24-hour format
  const parseTime = (timeString) => {
    try {
      if (!timeString || typeof timeString !== "string") {
        throw new Error("Invalid time string");
      }

      const [time, period] = timeString.trim().split(" ");

      if (!time || !period) {
        throw new Error("Invalid time format");
      }

      let [hours, minutes] = time.split(":").map(Number);

      if (isNaN(hours) || isNaN(minutes)) {
        throw new Error("Invalid time values");
      }

      if (period.toUpperCase() === "PM" && hours !== 12) {
        hours += 12;
      }
      if (period.toUpperCase() === "AM" && hours === 12) {
        hours = 0;
      }

      return hours * 60 + minutes;
    } catch (error) {
      console.error("Error parsing time:", timeString, error);
      return 0;
    }
  };

  const getDayPosition = (day) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date().getDay();
    const targetDay = days.indexOf(day);

    if (targetDay === -1) {
      console.warn("Invalid day:", day);
      return 7;
    }

    let position = targetDay - today;
    if (position <= 0) {
      position += 7;
    }

    return position;
  };

  // Check if a class is currently live
  const isLiveToday = (classItem) => {
    try {
      const today = new Date();
      const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });
      const currentTime = today.getHours() * 60 + today.getMinutes();
      const classTime = parseTime(classItem.classTime);

      return (
        classItem.day === currentDay && Math.abs(currentTime - classTime) <= 120
      );
    } catch (error) {
      console.error("Error checking if class is live:", error);
      return false;
    }
  };

  // Check if a class has been conducted
  const isConducted = (classItem) => {
    try {
      const today = new Date();
      const currentDay = today.getDay();
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const classDay = days.indexOf(classItem.day);

      if (classDay === -1) {
        console.warn("Invalid class day:", classItem.day);
        return false;
      }

      const currentTime = today.getHours() * 60 + today.getMinutes();
      const classTime = parseTime(classItem.classTime);

      if (classDay === currentDay) {
        return classTime < currentTime;
      }

      let dayDiff = currentDay - classDay;
      return dayDiff > 0;
    } catch (error) {
      console.error("Error checking if class is conducted:", error);
      return false;
    }
  };

  useEffect(() => {
    if (!department || !empId) {
      return;
    }

    const fetchClassSchedules = async () => {
      try {
        setLoading(true);
        let response;
        if (department === "super-admin") {
          response = await getSuperAdminAllClassData();
        } else {
          response = await getMyClassData(empId);
        }

        const classData = response?.data?.classData;

        if (!Array.isArray(classData)) {
          console.error("Invalid class data received:", classData);
          return;
        }

        const sortedClasses = classData.sort((a, b) => {
          return parseTime(a.classTime) - parseTime(b.classTime);
        });

        // For live classes, filter and modify to only include coach join URL
        const currentLiveClasses = sortedClasses
          .filter(isLiveToday)
          .map((classItem) => ({
            ...classItem,
            // Keep only coach join URL, remove kid join URL
            joinUrl: classItem.coachJoinUrl,
            bbTempClassId: classItem.bbTempClassId,
            // Remove kidJoinUrl to avoid confusion
            kidJoinUrl: undefined,
          }));

        const upcomingClassesByDay = sortedClasses
          .filter(
            (classItem) => !isConducted(classItem) && !isLiveToday(classItem)
          )
          .reduce((acc, classItem) => {
            if (!acc[classItem.day]) {
              acc[classItem.day] = [];
            }
            acc[classItem.day].push(classItem);
            return acc;
          }, {});

        const sortedUpcomingClasses = Object.entries(upcomingClassesByDay)
          .sort(([dayA], [dayB]) => {
            const posA = getDayPosition(dayA);
            const posB = getDayPosition(dayB);
            return posA - posB;
          })
          .reduce((acc, [day, classes]) => {
            acc[day] = classes;
            return acc;
          }, {});

        setLiveClasses(currentLiveClasses);
        setUpcomingClasses(sortedUpcomingClasses);
      } catch (error) {
        console.error("Error fetching class schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassSchedules();

    const intervalId = setInterval(fetchClassSchedules, 60000);
    return () => clearInterval(intervalId);
  }, [empId, department]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

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

  if (!department || !empId) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${customColors.background} 0%, #f8fafc 100%)`,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Loading...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${customColors.background} 0%, #f8fafc 100%)`,
          pb: 4,
        }}
      >
        <Container maxWidth="xl" sx={{ pt: 3 }}>
          {/* Main Content Card */}
          <Fade in={true} timeout={800}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Tab Navigation */}
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${customColors.primary}15 0%, ${customColors.secondary}15 100%)`,
                  borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <Container maxWidth="xl">
                  <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                      "& .MuiTab-root": {
                        minHeight: 80,
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: customColors.primary,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.1)",
                          transform: "translateY(-2px)",
                        },
                        "&.Mui-selected": {
                          color: customColors.secondary,
                          fontWeight: 600,
                          background: "rgba(255, 255, 255, 0.2)",
                        },
                      },
                      "& .MuiTabs-indicator": {
                        height: 4,
                        borderRadius: 2,
                        background: `linear-gradient(45deg, ${customColors.secondary}, ${customColors.primary})`,
                      },
                    }}
                  >
                    <Tab
                      icon={
                        <Badge
                          badgeContent={liveClasses.length}
                          color="error"
                          max={99}
                          variant={liveClasses.length > 0 ? "dot" : "standard"}
                        >
                          <LiveIcon
                            sx={{
                              fontSize: 28,
                              color:
                                liveClasses.length > 0 ? "#ff4444" : "inherit",
                              animation:
                                liveClasses.length > 0
                                  ? "pulse 2s infinite"
                                  : "none",
                            }}
                          />
                        </Badge>
                      }
                      label="Today's Classes"
                      iconPosition="top"
                    />
                    <Tab
                      icon={
                        <Badge
                          badgeContent={Object.keys(upcomingClasses).reduce(
                            (total, day) => total + upcomingClasses[day].length,
                            0
                          )}
                          color="primary"
                          max={99}
                        >
                          <UpcomingIcon sx={{ fontSize: 28 }} />
                        </Badge>
                      }
                      label="Upcoming Classes"
                      iconPosition="top"
                    />
                  </Tabs>
                </Container>
              </Box>

              {/* Tab Content */}
              <Container maxWidth="xl" sx={{ py: 4 }}>
                <TabPanel value={currentTab} index={0}>
                  {loading ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography variant="h6" color="text.secondary">
                        Checking for live classes...
                      </Typography>
                    </Box>
                  ) : liveClasses.length > 0 ? (
                    <Box>
                      <Box
                        sx={{
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Chip
                          icon={<LiveIcon />}
                          label="LIVE NOW"
                          color="error"
                          variant="filled"
                          sx={{
                            fontWeight: 600,
                            animation: "pulse 2s infinite",
                            "@keyframes pulse": {
                              "0%": { opacity: 1 },
                              "50%": { opacity: 0.7 },
                              "100%": { opacity: 1 },
                            },
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {liveClasses.length} class
                          {liveClasses.length > 1 ? "es" : ""} currently active
                          - Coach access only
                        </Typography>
                      </Box>
                      <RenderClassList
                        classes={liveClasses}
                        handleCardClick={handleCardClick}
                        isLiveTab
                      />
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <LiveIcon
                        sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        No Live Classes Right Now
                      </Typography>
                      <Typography variant="body2" color="text.disabled">
                        Active classes will appear here when they're in session
                      </Typography>
                    </Box>
                  )}
                </TabPanel>

                <TabPanel value={currentTab} index={1}>
                  {loading ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography variant="h6" color="text.secondary">
                        Loading upcoming classes...
                      </Typography>
                    </Box>
                  ) : Object.keys(upcomingClasses).length > 0 ? (
                    <UpcomingClasses
                      upcomingClasses={upcomingClasses}
                      handleCardClick={handleCardClick}
                    />
                  ) : (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <UpcomingIcon
                        sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        No Upcoming Classes
                      </Typography>
                      <Typography variant="body2" color="text.disabled">
                        Your scheduled classes will appear here
                      </Typography>
                    </Box>
                  )}
                </TabPanel>
              </Container>
            </Paper>
          </Fade>
        </Container>

        <ClassDetailsModal
          modalOpen={modalOpen}
          handleCloseModal={handleCloseModal}
          selectedClass={selectedClass}
          selectedDay={selectedDay}
        />

        {/* Add pulse animation for live indicator */}
        <style jsx>{`
          @keyframes pulse {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
            100% {
              opacity: 1;
            }
          }
        `}</style>
      </Box>
    </ThemeProvider>
  );
};

export default ScheduleKanban;
