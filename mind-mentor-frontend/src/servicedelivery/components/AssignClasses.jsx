import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
} from "@mui/material";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import {
  CalendarToday as DayIcon,
  School as SubjectIcon,
  AccessTime as TimeIcon,
  Person as TeacherIcon,
  Group as StudentsIcon,
  Label as LevelIcon,
  Book as ProgramIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { getClassandStudentData, saveClassDetails } from "../../api/service/employee/serviceDeliveryService";

// Enhanced color palette
const customColors = {
  primary: "#3f51b5",
  secondary: "#f50057",
  background: "#f4f4f4",
  text: "#333333",
  accent: "#4caf50",
  highlight: "#2196f3",
};

// Student Multi-Select Component
const StudentMultiSelect = ({
  students,
  onStudentSelect,
  selectedStudents,
}) => {
  const [localSelectedStudents, setLocalSelectedStudents] = useState(
    selectedStudents || []
  );

  const handleStudentToggle = (student) => {
    setLocalSelectedStudents((prev) => {
      // Check if the student is already in the list
      const isStudentSelected = prev.some(
        (selectedStudent) => selectedStudent._id === student._id
      );

      return isStudentSelected
        ? prev.filter((selectedStudent) => selectedStudent._id !== student._id)
        : [...prev, student];
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: "white",
        borderRadius: 2,
        height: "500px", // Fixed height
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: customColors.primary,
          mb: 2,
          fontWeight: 600,
        }}
      >
        Class Assign
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Scrollable student list */}
      <Box
        sx={{
          overflowY: "auto",
          flexGrow: 1,
          pr: 1, // Add some padding for scrollbar
        }}
      >
        <FormGroup>
          {students?.map((student, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={localSelectedStudents.some(
                    (selectedStudent) => selectedStudent._id === student._id
                  )}
                  onChange={() => handleStudentToggle(student)}
                  color="primary"
                />
              }
              label={student.kidFirstName}
            />
          ))}
        </FormGroup>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
          borderTop: "1px solid rgba(0,0,0,0.12)",
          pt: 2,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          {localSelectedStudents.length} students selected
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onStudentSelect(localSelectedStudents)}
          sx={{
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          Confirm Selection
        </Button>
      </Box>
    </Paper>
  );
};

// Main Class Display Component
const AssignClasses = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const { id } = useParams();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [classData, setClassData] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchRequiredClassStudentData = async () => {
      try {
        const response = await getClassandStudentData(id);
        console.log("Use effect data in demo assign", response);
        setClassData(response?.data?.classData);
        setStudents(response?.data?.kidsData);
      } catch (error) {
        console.error("Error fetching class and student data:", error);
      }
    };
    fetchRequiredClassStudentData();
  }, [id]);

  const handleStudentSelection = async (students) => {
    console.log("Selected Students:", students);
    setSelectedStudents(students);

    // Extract student IDs for the API call
    const studentIds = students.map((student) => student._id);

    try {
      const response = await saveClassDetails(id, studentIds, empId);
      console.log("Save  Class Response:", response);
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/serviceScheduleClass");
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving demo class details:", error);
    }
  };

  const handleRemoveStudent = (studentToRemove) => {
    setSelectedStudents((prev) =>
      prev.filter((student) => student._id !== studentToRemove._id)
    );
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: customColors.background,
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: customColors.primary,
          mb: 4,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        Student Class Assign Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Class Details Column */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: "white",
            }}
          >
            {classData.map((classItem, index) => (
              <Box key={index}>
                {/* Class Details Grid */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DayIcon color="primary" />
                      <Typography variant="subtitle1">
                        {classItem.day}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TimeIcon color="secondary" />
                      <Typography variant="subtitle1">
                        {classItem.classTime}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TeacherIcon color="success" />
                      <Typography variant="subtitle1">
                        {classItem.coachName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <StudentsIcon color="primary" />
                      <Typography variant="subtitle1">
                        {classItem.students || 0} Students
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Program and Level Row */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ProgramIcon color="primary" />
                      <Typography variant="subtitle1">
                        {classItem.program}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LevelIcon color="secondary" />
                      <Typography variant="subtitle1">
                        {classItem.level}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6">Selected Students</Typography>
                    </Box>
                    {/* List of selected students with icons */}
                    <List>
                      {classItem.selectedStudents &&
                        classItem.selectedStudents.map((student, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <ChildCareIcon color="primary" />{" "}
                              {/* Icon for each student */}
                            </ListItemIcon>
                            <Typography variant="body1">
                              {student.kidName}
                            </Typography>
                          </ListItem>
                        ))}
                    </List>
                  </Grid>
                </Grid>

                {/* Selected Students Chips */}
                {selectedStudents.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      sx={{ mb: 1 }}
                    >
                      Selected Students:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selectedStudents.map((student, index) => (
                        <Chip
                          key={index}
                          label={student.kidFirstName}
                          onDelete={() => handleRemoveStudent(student)}
                          deleteIcon={<CloseIcon />}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Student Selection Column */}
        <Grid item xs={12} md={4}>
          <StudentMultiSelect
            students={students}
            onStudentSelect={handleStudentSelection}
            selectedStudents={selectedStudents}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssignClasses;
