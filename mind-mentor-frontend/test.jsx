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
  Modal,  createTheme,
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
// Updated modern color scheme
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

// Styled components remain the same
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

// New Modal Styles
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
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(()=>{
    const fetchAllClassShedules = async()=>{
      const response = await getClassShedules()
      console.log(response)

    }
    fetchAllClassShedules()

  },[])







  // Schedule data remains the same
  const scheduleData = {
    Monday: [
      {
        time: "09:00 AM",
        subject: "Chess: Beginner",
        teacher: "Dr. Smith",
        students: 25,
        level: "Beginner",
      },
      {
        time: "11:00 AM",
        subject: "Physics",
        teacher: "Prof. Johnson",
        students: 22,
        level: "N/A",
      },
      {
        time: "02:00 PM",
        subject: "Chemistry",
        teacher: "Dr. Williams",
        students: 20,
        level: "N/A",
      },
    ],
    Tuesday: [
      {
        time: "10:00 AM",
        subject: "Rubik's Cube: Level 1",
        teacher: "Ms. Davis",
        students: 28,
        level: "Beginner",
      },
      {
        time: "01:00 PM",
        subject: "English",
        teacher: "Ms. Davis",
        students: 28,
        level: "N/A",
      },
    ],
    Wednesday: [
      {
        time: "09:30 AM",
        subject: "Chess: Intermediate",
        teacher: "Mr. Wilson",
        students: 24,
        level: "Intermediate",
      },
      {
        time: "11:30 AM",
        subject: "History",
        teacher: "Mrs. Taylor",
        students: 26,
        level: "N/A",
      },
    ],
    Thursday: [
      {
        time: "10:00 AM",
        subject: "Rubik's Cube: Level 2",
        teacher: "Ms. White",
        students: 18,
        level: "Intermediate",
      },
      {
        time: "02:00 PM",
        subject: "Art",
        teacher: "Ms. White",
        students: 18,
        level: "N/A",
      },
    ],
    Friday: [
      {
        time: "09:00 AM",
        subject: "Chess: Advanced",
        teacher: "Mr. Lee",
        students: 30,
        level: "Advanced",
      },
      {
        time: "11:00 AM",
        subject: "Physical Education",
        teacher: "Mr. Clark",
        students: 35,
        level: "N/A",
      },
    ],
    Saturday: [
      {
        time: "10:00 AM",
        subject: "Chess: Tournament Preparation",
        teacher: "Dr. Smith",
        students: 15,
        level: "Advanced",
      },
    ],
    Sunday: [
      {
        time: "11:00 AM",
        subject: "No class scheduled",
        teacher: "N/A",
        students: 0,
        level: "N/A",
      },
    ],
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
          Class Schedule Form
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/serviceClassShedule"
          color="primary"

        >
          + Create Shedules
        </Button>
      </Box>

      <Grid container spacing={3}>
        {Object.entries(scheduleData).map(([day, classes], dayIndex) => (
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

                    <IconText>
                      <StudentsIcon sx={{ color: customColors.highlight }} />
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

      {/* Animated Modal */}
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
                  <DayIcon sx={{ color: customColors.primary, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: customColors.primary }}>
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
                  <TimeIcon sx={{ color: customColors.accent, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: customColors.accent }}>
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

                {selectedClass.level !== "N/A" && (
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
