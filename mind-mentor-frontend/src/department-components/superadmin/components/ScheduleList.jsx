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
  Backdrop,
  Fade,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  DateRange as DateIcon,
  LocationOn as LocationIcon,
  Groups as MaxStudentsIcon,
  Wifi as OnlineIcon,
  Store as CenterIcon,
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
import { deleteSheduleClass } from "../../../api/service/employee/EmployeeService";

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
        console.log("API response:", response);

        // Assuming response structure has classData array
        const classData = response.classData || response;

        const transformedData = classData.reduce((acc, classItem) => {
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
              students: classItem.selectedStudents?.length || 0,
              level: classItem.level,
              classType: classItem.isDemo ? "Demo" : "Class",
              status: classItem.status,
              meetingLink: classItem.meetingLink,
              classDate: classItem.classDate,
              type: classItem.type,
              centerName: classItem.centerName,
              centerId: classItem.centerId,
              maximumKidCount: classItem.maximumKidCount,
              isDemoAdded: classItem.isDemoAdded,
              scheduledBy: classItem.scheduledBy,
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
    navigate(`/serviceAssignClassToKid/${classInfo.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    // Here you would add the API call to delete the class
    console.log("Deleting class:", selectedClass?.id);

    const response = await deleteSheduleClass(selectedClass?.id);
    if (response.status === 200) {
      // Remove the class from scheduleData
      if (selectedClass && selectedDay) {
        const updatedData = { ...scheduleData };
        updatedData[selectedDay] = updatedData[selectedDay].filter(
          (cls) => cls.id !== selectedClass.id
        );
        setScheduleData(updatedData);
      }
    }

    setDeleteDialogOpen(false);
    setModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    // Navigate to edit page with class ID
    if (selectedClass) {
      navigate(`/super-admin/department/edit-class-shedules/${selectedClass.id}`);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
                              label={`${classItem.students}/${
                                classItem.maximumKidCount || "∞"
                              } students`}
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

                          {(classItem.classType === "Class" ||
                            !classItem.isDemoAdded) && (
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

                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Chip
                            label={classItem.status}
                            size="small"
                            sx={{
                              backgroundColor:
                                classItem.status === "Completed"
                                  ? "#4caf50"
                                  : classItem.status === "Cancelled"
                                  ? "#f44336"
                                  : "#2196f3",
                              color: "white",
                            }}
                          />
                          <Chip
                            label={classItem.type || "N/A"}
                            size="small"
                            sx={{
                              backgroundColor: customColors.primary,
                              color: "white",
                            }}
                          />
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
                    <DateIcon
                      sx={{ color: customColors.accent, fontSize: 28 }}
                    />
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ color: customColors.primary }}
                      >
                        Class Date
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: customColors.accent }}
                      >
                        {formatDate(selectedClass.classDate)}
                      </Typography>
                    </Box>
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
                          {selectedClass.students} /{" "}
                          {selectedClass.maximumKidCount || "∞"} Students
                        </Typography>
                      </Box>
                      {(!selectedClass.isDemoAdded ||
                        selectedClass.classType === "Class") && (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/serviceAssignClassToKid/${selectedClass.id}`
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
                      )}
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

                  <DetailRow>
                    <OnlineIcon
                      sx={{ color: customColors.primary, fontSize: 28 }}
                    />
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ color: customColors.primary }}
                      >
                        Class Type
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: customColors.primary }}
                      >
                        {selectedClass.type === "online" ? "Online" : "Offline"}
                      </Typography>
                    </Box>
                  </DetailRow>

                  <DetailRow>
                    <CenterIcon
                      sx={{ color: customColors.highlight, fontSize: 28 }}
                    />
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ color: customColors.primary }}
                      >
                        Center
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: customColors.highlight }}
                      >
                        {selectedClass.centerName || "N/A"}
                      </Typography>
                    </Box>
                  </DetailRow>

                  <DetailRow>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        backgroundColor:
                          selectedClass.status === "Completed"
                            ? "#4caf50"
                            : selectedClass.status === "Cancelled"
                            ? "#f44336"
                            : "#2196f3",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      Status: {selectedClass.status}
                    </Typography>
                  </DetailRow>

                  {selectedClass.scheduledBy && (
                    <DetailRow>
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{ color: customColors.primary }}
                        >
                          Scheduled By
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: customColors.secondary }}
                        >
                          {selectedClass.scheduledBy.name} (
                          {selectedClass.scheduledBy.department})
                        </Typography>
                      </Box>
                    </DetailRow>
                  )}

                  {selectedClass.isDemoAdded && (
                    <DetailRow>
                      <Typography
                        variant="body1"
                        sx={{
                          backgroundColor: "#ff9800",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        Demo Added
                      </Typography>
                    </DetailRow>
                  )}
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
