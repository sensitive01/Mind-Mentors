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
  Tabs,
  Tab,
  TextField,
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
  VideoCall as MeetingIcon,
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
import {
  deleteSheduleClass,
  generateClassMeetingLink,
} from "../../../api/service/employee/EmployeeService";

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

// New component for Today's class card with meeting button
const TodayClassCard = ({
  classItem,
  day,
  onCardClick,
  onAddKids,
  onCreateMeeting,
  index,
}) => (
  <ClassCard
    elevation={2}
    onClick={() => onCardClick(classItem, day)}
    sx={{
      opacity: 1,
      transform: "translateY(0)",
      mb: 2,
      cursor: "pointer",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 20px rgba(100, 43, 143, 0.15)",
      },
      "&:last-child": {
        mb: 0,
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        p: 2,
      }}
    >
      {/* Left side - Class information */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <IconText sx={{ minWidth: "auto" }}>
            <TimeIcon sx={{ color: customColors.primary, fontSize: 20 }} />
            <Typography
              variant="body1"
              sx={{ color: customColors.primary, fontWeight: 600 }}
            >
              {classItem.time}
            </Typography>
          </IconText>

          <IconText sx={{ minWidth: "auto" }}>
            <SubjectIcon sx={{ color: customColors.secondary, fontSize: 20 }} />
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: customColors.primary,
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              {classItem.subject}
            </Typography>
          </IconText>

          <IconText sx={{ minWidth: "auto" }}>
            <TeacherIcon sx={{ color: customColors.accent, fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: customColors.accent }}>
              {classItem.teacher}
            </Typography>
          </IconText>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <IconText sx={{ minWidth: "auto" }}>
            <StudentsIcon
              sx={{ color: customColors.highlight, fontSize: 20 }}
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

        {/* Meeting Links Section - Only show if meetingLinkCreated is true */}
        {classItem.meetingLinkCreated && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 1,
              p: 1.5,
              backgroundColor: "rgba(100, 43, 143, 0.05)",
              borderRadius: 1,
              border: `1px solid ${customColors.primary}20`,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: customColors.primary,
                fontWeight: "bold",
                mb: 0.5,
              }}
            >
              Meeting Links:
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {classItem.coachJoinUrl && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<TeacherIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(classItem.coachJoinUrl, "_blank");
                  }}
                  sx={{
                    borderColor: customColors.accent,
                    color: customColors.accent,
                    "&:hover": {
                      backgroundColor: `${customColors.accent}10`,
                      borderColor: customColors.accent,
                    },
                    borderRadius: "15px",
                    fontSize: "0.75rem",
                  }}
                >
                  Coach Link
                </Button>
              )}

              {classItem.kidJoinUrl && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<StudentsIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(classItem.kidJoinUrl, "_blank");
                  }}
                  sx={{
                    borderColor: customColors.highlight,
                    color: customColors.highlight,
                    "&:hover": {
                      backgroundColor: `${customColors.highlight}10`,
                      borderColor: customColors.highlight,
                    },
                    borderRadius: "15px",
                    fontSize: "0.75rem",
                  }}
                >
                  Student Link
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Right side - Action buttons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
        

        <Button
          variant="contained"
          startIcon={<MeetingIcon />}
          onClick={(e) => onCreateMeeting(e, classItem)}
          sx={{
            backgroundColor: customColors.accent,
            color: "white",
            "&:hover": {
              backgroundColor: customColors.secondary,
            },
            borderRadius: "20px",
            px: 2,
            py: 1,
            fontSize: "0.875rem",
          }}
        >
          {classItem.meetingLinkCreated ? "Update Meeting" : "Create Meeting"}
        </Button>
      </Box>
    </Box>
  </ClassCard>
);

const ScheduleKanban = () => {
  const department = localStorage.getItem("department");
  const [scheduleData, setScheduleData] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [meetingFormData, setMeetingFormData] = useState({
    className: "",
    coachName: "",
  });
  const navigate = useNavigate();

  const getCurrentDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date();
    return days[today.getDay()];
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

  // Helper function to update a specific class in the schedule data
  const updateClassInSchedule = (classId, updatedClassData) => {
    setScheduleData((prevData) => {
      const newData = { ...prevData };

      // Find and update the class in the appropriate day
      Object.keys(newData).forEach((day) => {
        const classIndex = newData[day].findIndex((cls) => cls.id === classId);
        if (classIndex !== -1) {
          newData[day][classIndex] = {
            ...newData[day][classIndex],
            ...updatedClassData,
          };
        }
      });

      return newData;
    });
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
              coachJoinUrl: classItem.coachJoinUrl,
              kidJoinUrl: classItem.kidJoinUrl,
              meetingLinkCreated: classItem.meetingLinkCreated,
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
    console.log("Deleting class:", selectedClass?.id);

    const response = await deleteSheduleClass(selectedClass?.id);
    if (response.status === 200) {
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
      navigate(
        `/super-admin/department/edit-class-shedules/${selectedClass.id}`
      );
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreateMeetingClick = (e, classInfo) => {
    e.stopPropagation();
    setSelectedClass(classInfo);
    setMeetingFormData({
      className: classInfo.subject || "",
      coachName: classInfo.teacher || "",
    });
    setMeetingDialogOpen(true);
  };

  const handleMeetingDialogClose = () => {
    setMeetingDialogOpen(false);
    setMeetingFormData({
      className: "",
      coachName: "",
    });
    setSelectedClass(null);
  };

  const handleMeetingFormChange = (field, value) => {
    setMeetingFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMeetingSubmit = async () => {
    try {
      console.log("Creating meeting for:", {
        classId: selectedClass?.id,
        className: meetingFormData.className,
        coachName: meetingFormData.coachName,
      });

      const response = await generateClassMeetingLink(
        selectedClass?.id,
        meetingFormData.className,
        meetingFormData.coachName
      );

      console.log("Class link created", response);

      // Extract the meeting link data from response
      if (response && response.data) {
        const { joinCoachUrl, joinKidUrl, meetingLinkCreated } = response.data;

        // Update the class in schedule data instantly
        const updatedClassData = {
          coachJoinUrl: joinCoachUrl,
          kidJoinUrl: joinKidUrl,
          meetingLinkCreated: meetingLinkCreated,
        };

        // Update the class in the schedule data
        updateClassInSchedule(selectedClass.id, updatedClassData);

        // Update selectedClass if modal is open
        if (selectedClass) {
          setSelectedClass((prev) => ({
            ...prev,
            ...updatedClassData,
          }));
        }
      }

      handleMeetingDialogClose();
    } catch (error) {
      console.error("Error creating meeting link:", error);
      // You might want to show an error message to the user here
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

  // Filter data based on selected tab
  const getFilteredData = () => {
    if (tabValue === 0) {
      // Today's classes
      const currentDay = getCurrentDay();
      return {
        [currentDay]: scheduleData[currentDay] || [],
      };
    } else {
      // All classes
      return scheduleData;
    }
  };

  const filteredData = getFilteredData();

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

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                color: customColors.secondary,
                "&.Mui-selected": {
                  color: customColors.primary,
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: customColors.primary,
              },
            }}
          >
            <Tab label="Today's Classes" />
            <Tab label="All Classes" />
          </Tabs>
        </Box>

        <Grid
          container
          spacing={3}
          sx={{
            flexWrap: tabValue === 0 ? "wrap" : "nowrap",
            overflowX: tabValue === 0 ? "visible" : "auto",
            pb: 2,
          }}
        >
          {Object.entries(filteredData).map(([day, classes]) => (
            <Grid
              item
              xs={tabValue === 0 ? 12 : 12 / 7}
              key={day}
              sx={{
                minWidth: tabValue === 0 ? "100%" : "300px",
                maxHeight: "calc(100vh - 200px)",
              }}
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
                    tabValue === 0 ? (
                      // Today's classes - one class per row
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {classes.map((classItem, index) => (
                          <TodayClassCard
                            key={`${day}-${index}`}
                            classItem={classItem}
                            day={day}
                            onCardClick={handleCardClick}
                            onAddKids={handleAddKids}
                            onCreateMeeting={handleCreateMeetingClick}
                            index={index}
                          />
                        ))}
                      </Box>
                    ) : (
                      // All classes - grid layout
                      <Grid container spacing={2}>
                        {classes.map((classItem, index) => (
                          <Grid item xs={12} key={`${day}-${index}`}>
                            <ClassCard
                              elevation={2}
                              onClick={() => handleCardClick(classItem, day)}
                              sx={{
                                opacity: 1,
                                transform: "translateY(0)",
                                mb: 2,
                                height: "100%",
                                "&:last-child": {
                                  mb: 0,
                                },
                                padding: "10px",
                              }}
                            >
                              <IconText>
                                <TimeIcon
                                  sx={{ color: customColors.primary }}
                                />
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
                                <TeacherIcon
                                  sx={{ color: customColors.accent }}
                                />
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
                                        backgroundColor:
                                          "rgba(100, 43, 143, 0.1)",
                                      },
                                    }}
                                    variant="outlined"
                                  />
                                </IconText>

                                <Box>
                                  
                                  <IconButton
                                    onClick={(e) =>
                                      handleCreateMeetingClick(e, classItem)
                                    }
                                    sx={{
                                      color: customColors.accent,
                                      "&:hover": {
                                        backgroundColor: `${customColors.accent}20`,
                                      },
                                    }}
                                  >
                                    <MeetingIcon />
                                  </IconButton>
                                </Box>
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
                          </Grid>
                        ))}
                      </Grid>
                    )
                  ) : (
                    <NoScheduleCard day={day} />
                  )}
                </CardContent>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>

        {/* Class Details Modal */}
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

        {/* Meeting Link Creation Dialog */}
        {/* Meeting Link Creation Dialog */}
        <Dialog
          open={meetingDialogOpen}
          onClose={handleMeetingDialogClose}
          aria-labelledby="meeting-dialog-title"
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle
            id="meeting-dialog-title"
            sx={{
              textAlign: "center",
              pb: 2,
              fontSize: "1.25rem",
              fontWeight: 600,
            }}
          >
            Create Meeting Link
          </DialogTitle>

          <DialogContent sx={{ px: 3, pb: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", mb: 1 }}
              >
                Are you sure you want to create a meeting link with the
                following details?
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  backgroundColor: "grey.50",
                  borderRadius: 1,
                  p: 2.5,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Class Name:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "text.primary" }}
                  >
                    MindMentorz Online
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Coach Name:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "text.primary" }}
                  >
                    {meetingFormData.coachName}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{ px: 3, py: 2.5, gap: 2, justifyContent: "flex-end" }}
          >
            <Button
              onClick={handleMeetingDialogClose}
              color="inherit"
              variant="outlined"
              sx={{
                minWidth: 100,
                textTransform: "none",
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleMeetingSubmit}
              color="primary"
              variant="contained"
              sx={{
                minWidth: 140,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Create Meeting Link
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ScheduleKanban;
