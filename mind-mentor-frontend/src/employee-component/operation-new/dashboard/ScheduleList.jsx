import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { getAllSheduleClass } from "../../../api/service/employee/EmployeeService";

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
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchScheduleClass = async () => {
      try {
        const response = await getAllSheduleClass();
        console.log(response);
        setScheduleData(response.data);
      

      } catch (error) {
        console.error("Error fetching schedule:", error);
        // Fallback to default data if API call fails
      }
    };
    fetchScheduleClass();
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

  // Group schedule data by day
  const groupedScheduleData = scheduleData.reduce((acc, classItem) => {
    if (!acc[classItem.day]) {
      acc[classItem.day] = [];
    }
    // Only add non-empty classes
    if (classItem.subject !== "No classes scheduled") {
      acc[classItem.day].push(classItem);
    }
    return acc;
  }, {});

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
          onClick={() => navigate("/employee-operation/demoSheduleForm")}
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
        {Object.entries(groupedScheduleData).map(([day, classes]) => (
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
                {classes.length > 0 ? (
                  classes.map((classItem, index) => (
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
                          {classItem.time || "Time Not Specified"}
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
                          {classItem.teacher || "No Teacher Assigned"}
                        </Typography>
                      </IconText>

                      <IconText>
                        <StudentsIcon sx={{ color: customColors.highlight }} />
                        <Chip
                          label={`${classItem.studentCount} students`}
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
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      color: customColors.primary,
                      textAlign: "center",
                      fontStyle: "italic",
                    }}
                  >
                    No classes scheduled
                  </Typography>
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

                {selectedClass.date && (
                  <DetailRow>
                    <CalendarToday
                      sx={{ color: customColors.accent, fontSize: 28 }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ color: customColors.accent }}
                    >
                      {selectedClass.date}
                    </Typography>
                  </DetailRow>
                )}

                <DetailRow>
                  <TimeIcon sx={{ color: customColors.accent, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: customColors.accent }}>
                    {selectedClass.time || "Time Not Specified"}
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
                      {selectedClass.teacher || "No Teacher Assigned"}
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
                      {selectedClass.studentCount} Students
                    </Typography>
                  </Box>
                </DetailRow>
              </>
            )}
          </ModalContent>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ScheduleKanban;
