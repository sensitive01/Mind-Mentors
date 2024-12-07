import { useState } from "react";
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
  Backdrop,
  Fade,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  AccessTime as TimeIcon,
  Person as TeacherIcon,
  People as StudentsIcon,
  School as SubjectIcon,
  Close as CloseIcon,
  EventSeat as LevelIcon,
  CalendarToday as DayIcon,
  AddCircle as AddIcon,
} from "@mui/icons-material";

// Custom theme colors
const customColors = {
  primary: "#642B8F",
  secondary: "#F8A213",
  accent: "#AA88BE",
  highlight: "#F0BA6F",
  background: "#EFE8F0",
};

// Styled components
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
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // New state for scheduling dialog
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({
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
  });

  // New state for new class form
  const [newClassForm, setNewClassForm] = useState({
    students: "",
    program: "",
    level: "",
    date: "",
    time: "",
  });

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

  // New methods for scheduling
  const handleOpenScheduleDialog = () => {
    setScheduleDialogOpen(true);
  };

  const handleCloseScheduleDialog = () => {
    setScheduleDialogOpen(false);
    // Reset form
    setNewClassForm({
      students: "",
      program: "",
      level: "",
      date: "",
      student: "",
      time: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClassForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitNewClass = () => {
    // Validate form
    const { students, program, level, date, time } = newClassForm;
    if (!students || !program || !level || !time) {
      alert("Please fill in all required fields");
      return;
    }

    // Create a new class object
    const newClass = {
      students,
      program,
      level,
      date,
      time,
    };

    console.log("Sheduled class", newClass);

    // Close dialog and reset form
    handleCloseScheduleDialog();
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: customColors.background,
        minHeight: "100vh",
        background: `linear-gradient(45deg, ${customColors.background} 0%, #ffffff 100%)`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: customColors.primary,
            fontWeight: "bold",
          }}
        >
          Class Schedule
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenScheduleDialog}
          sx={{
            backgroundColor: customColors.primary,
            "&:hover": {
              backgroundColor: customColors.secondary,
            },
          }}
        >
          Schedule New Class
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

      <Dialog
        open={scheduleDialogOpen}
        onClose={handleCloseScheduleDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: customColors.primary,
            color: "white",
            fontWeight: "bold",
          }}
        >
          Schedule New Class
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* First Row */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Kids' Chess ID & Name</InputLabel>
                <Select
                  name="students"
                  value={newClassForm.students}
                  onChange={handleInputChange}
                  label="Kids' Chess ID & Name"
                >
                  <MenuItem value="MM451214">MM451214 - Aswinraj</MenuItem>
                  <MenuItem value="MM451215">MM451215 - Alex</MenuItem>
                  <MenuItem value="MM451216">MM451216 - John</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Program</InputLabel>
                <Select
                  name="program"
                  value={newClassForm.program}
                  onChange={handleInputChange}
                  label="Program"
                >
                  <MenuItem value="Chess">Chess</MenuItem>
                  <MenuItem value="RubiksCube">Rubik's Cube</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Level</InputLabel>
                <Select
                  name="level"
                  value={newClassForm.level}
                  onChange={handleInputChange}
                  label="Level"
                >
                  <MenuItem value="">Not Specified</MenuItem>
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Second Row */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="date"
                label="Date"
                type="date"
                value={newClassForm.date}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Time</InputLabel>
                <Select
                  name="time"
                  value={newClassForm.time}
                  onChange={handleInputChange}
                  label="Time"
                >
                  {[
                    "10:00 AM - 12:00 PM",
                    "12:00 PM - 2:00 PM",
                    "2:00 PM - 4:00 PM",
                    "4:00 PM - 6:00 PM",
                  ].map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseScheduleDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitNewClass}
            color="primary"
            variant="contained"
          >
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduleKanban;
