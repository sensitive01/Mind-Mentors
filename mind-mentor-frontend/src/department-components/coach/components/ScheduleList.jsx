import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  ThemeProvider,
  Fade,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import {
  PlayCircleOutline as LiveIcon,
  ScheduleOutlined as UpcomingIcon,
  CheckCircleOutline as ConductedIcon,
} from "@mui/icons-material";
import { getMyClassData } from "../../../api/service/employee/coachService";
import { customColors, theme } from "../Layout/customStyle";
import RenderClassList from "./shedule-components/RenderClassList";
import UpcomingClasses from "./shedule-components/UpcommingClasses";
import ClassDetailsModal from "./shedule-components/ClassDetailModel";

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    {...other}
  >
    {value === index && (
      <Box
        sx={{
          p: 3,
          transition: "all 0.3s ease",
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          minHeight: "500px",
          "& > *": {
            animation: "fadeIn 0.5s ease-in-out",
          },
          "@keyframes fadeIn": {
            "0%": {
              opacity: 0,
              transform: "translateY(10px)",
            },
            "100%": {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
          "&:hover": {
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          },
        }}
      >
        {children}
      </Box>
    )}
  </div>
);

const ScheduleKanban = () => {
  const empId = localStorage.getItem("empId");
  const [conductedClasses, setConductedClasses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

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

    let position = targetDay - today;
    if (position <= 0) {
      position += 7;
    }

    return position;
  };

  // Check if a class is currently live
  const isLiveToday = (classItem) => {
    const today = new Date();
    const currentDay = today.toLocaleDateString("en-US", { weekday: "long" });
    const currentTime = today.getHours() * 60 + today.getMinutes();
    const classTime = parseTime(classItem.classTime);

    return (
      classItem.day == currentDay && Math.abs(currentTime - classTime) <= 120
    );
  };

  // Check if a class has been conducted
  const isConducted = (classItem) => {
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
    const currentTime = today.getHours() * 60 + today.getMinutes();
    const classTime = parseTime(classItem.classTime);

    if (classDay === currentDay) {
      return classTime < currentTime;
    }

    // Check if the class day has already passed this week
    let dayDiff = currentDay - classDay;
    return dayDiff > 0;
  };

  useEffect(() => {
    const fetchClassSchedules = async () => {
      try {
        const response = await getMyClassData(empId);
        const classData = response.data.classData;

        // Sort classes by time within each day
        const sortedClasses = classData.sort((a, b) => {
          return parseTime(a.classTime) - parseTime(b.classTime);
        });

        const currentConductedClasses = sortedClasses.filter(isConducted);
        const currentLiveClasses = sortedClasses.filter(isLiveToday);

        // Group upcoming classes by day
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

        // Sort days based on their position relative to today
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

        setConductedClasses(currentConductedClasses);
        setLiveClasses(currentLiveClasses);
        setUpcomingClasses(sortedUpcomingClasses);
      } catch (error) {
        console.error("Error fetching class schedules:", error);
      }
    };

    fetchClassSchedules();

    // Refresh the data every minute to update live classes
    const intervalId = setInterval(fetchClassSchedules, 60000);

    return () => clearInterval(intervalId);
  }, [empId]);

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
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: "text.primary",
              fontWeight: 600,
              mb: 3,
              textAlign: "center",
            }}
          >
            Class Schedules
          </Typography>

          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              md={2}
              sx={{
                borderRight: "1px solid",
                borderColor: "divider",
                pr: 2,
              }}
            >
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                orientation="vertical"
                variant="fullWidth"
                sx={{
                  "& .MuiTab-root": {
                    justifyContent: "flex-start",
                    alignItems: "center",
                    textTransform: "none",
                    color: customColors.primary,
                    "&.Mui-selected": {
                      color: customColors.secondary,
                      fontWeight: "bold",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    left: 0,
                    right: "auto",
                    backgroundColor: customColors.secondary,
                  },
                }}
              >
                <Tab
                  icon={<ConductedIcon />}
                  label="Conducted Classes"
                  iconPosition="start"
                />
                <Tab
                  icon={<LiveIcon />}
                  label="Live Classes"
                  iconPosition="start"
                />
                <Tab
                  icon={<UpcomingIcon />}
                  label="Upcoming Classes"
                  iconPosition="start"
                />
              </Tabs>
            </Grid>

            <Grid item xs={12} md={10}>
              <TabPanel value={currentTab} index={0}>
                {conductedClasses.length > 0 ? (
                  <RenderClassList
                    classes={conductedClasses}
                    handleCardClick={handleCardClick}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "center",
                      color: customColors.primary,
                      mt: 5,
                    }}
                  >
                    No Conducted Classes Found
                  </Typography>
                )}
              </TabPanel>

              <TabPanel value={currentTab} index={1}>
                {liveClasses.length > 0 ? (
                  <RenderClassList
                    classes={liveClasses}
                    handleCardClick={handleCardClick}
                    isLiveTab
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "center",
                      color: customColors.primary,
                      mt: 5,
                    }}
                  >
                    No Live Classes Right Now
                  </Typography>
                )}
              </TabPanel>

              <TabPanel value={currentTab} index={2}>
                {Object.keys(upcomingClasses).length > 0 ? (
                  <UpcomingClasses
                    upcomingClasses={upcomingClasses}
                    handleCardClick={handleCardClick}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "center",
                      color: customColors.primary,
                      mt: 5,
                    }}
                  >
                    No Upcoming Classes
                  </Typography>
                )}
              </TabPanel>
            </Grid>
          </Grid>

          <ClassDetailsModal
            modalOpen={modalOpen}
            handleCloseModal={handleCloseModal}
            selectedClass={selectedClass}
            selectedDay={selectedDay}
          />
        </Box>
      </Fade>
    </ThemeProvider>
  );
};

export default ScheduleKanban;
