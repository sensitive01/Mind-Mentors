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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
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
  const department = localStorage.getItem("department");
  const [scheduleData, setScheduleData] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClass, setEditedClass] = useState(null);
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
        const response = await getClassShedules(department);
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
    setIsEditing(false); // Reset editing state when opening modal
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedClass(null);
    setSelectedDay(null);
    setIsEditing(false);
  };

  const handleAddKids = (e, classInfo) => {
    e.stopPropagation();
    console.log("Add kids for class:", classInfo);
    navigate(`/serviceAssignClassToKid/${classInfo.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Here you would add the API call to delete the class
    console.log("Deleting class:", selectedClass?.id);

    // Remove the class from scheduleData
    if (selectedClass && selectedDay) {
      const updatedData = { ...scheduleData };
      updatedData[selectedDay] = updatedData[selectedDay].filter(
        (cls) => cls.id !== selectedClass.id
      );
      setScheduleData(updatedData);
    }

    setDeleteDialogOpen(false);
    setModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleEditClick = () => {
    setEditedClass({ ...selectedClass });
    setIsEditing(true);
  };

  const handleEditChange = (field, value) => {
    setEditedClass((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSubmit = () => {
    // Here you would add the API call to update the class
    console.log("Updating class:", editedClass);

    // Update the class in scheduleData
    if (editedClass && selectedDay) {
      const updatedData = { ...scheduleData };
      const classIndex = updatedData[selectedDay].findIndex(
        (cls) => cls.id === editedClass.id
      );

      if (classIndex !== -1) {
        updatedData[selectedDay][classIndex] = { ...editedClass };
        setScheduleData(updatedData);
        setSelectedClass({ ...editedClass });
      }
    }

    setIsEditing(false);
  };

  const goBack = () => {
    navigate(-1);
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
          <Box display="flex" alignItems="center">
            <IconButton
              onClick={goBack}
              sx={{
                mr: 2,
                color: customColors.primary,
                "&:hover": {
                  backgroundColor: `${customColors.primary}20`,
                },
              }}
            >
              <BackIcon />
            </IconButton>
            <Typography
              variant="h5"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              Class Schedules
            </Typography>
          </Box>
          <Button
            variant="contained"
            component={Link}
            to="/super-admin/department/class-shedules"
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
              {selectedClass && !isEditing && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 2,
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
                    <Box>
                      <IconButton
                        onClick={handleEditClick}
                        sx={{
                          color: customColors.secondary,
                          marginRight: 1,
                          "&:hover": {
                            backgroundColor: `${customColors.secondary}20`,
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={handleDeleteClick}
                        sx={{
                          color: "#d32f2f",
                          marginRight: 1,
                          "&:hover": {
                            backgroundColor: "rgba(211, 47, 47, 0.1)",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
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
                        onClick={(e) => {
                          e.stopPropagation();
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

              {selectedClass && isEditing && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 3,
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
                      Edit Class
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

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Day</InputLabel>
                    <Select
                      value={selectedDay}
                      label="Day"
                      onChange={(e) => setSelectedDay(e.target.value)}
                    >
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ].map((day) => (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Subject/Program"
                    value={editedClass?.subject || ""}
                    onChange={(e) =>
                      handleEditChange("subject", e.target.value)
                    }
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Time"
                    value={editedClass?.time || ""}
                    onChange={(e) => handleEditChange("time", e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Instructor"
                    value={editedClass?.teacher || ""}
                    onChange={(e) =>
                      handleEditChange("teacher", e.target.value)
                    }
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Level"
                    value={editedClass?.level || ""}
                    onChange={(e) => handleEditChange("level", e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Class Type</InputLabel>
                    <Select
                      value={editedClass?.classType || ""}
                      label="Class Type"
                      onChange={(e) =>
                        handleEditChange("classType", e.target.value)
                      }
                    >
                      <MenuItem value="Class">Class</MenuItem>
                      <MenuItem value="Demo">Demo</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={editedClass?.status || ""}
                      label="Status"
                      onChange={(e) =>
                        handleEditChange("status", e.target.value)
                      }
                    >
                      <MenuItem value="Scheduled">Scheduled</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>

                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleEditSubmit}
                      startIcon={<SaveIcon />}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </>
              )}
            </ModalContent>
          </Fade>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm Deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this class schedule? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ScheduleKanban;
