import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
} from "@mui/material";
import {
  getProspectsStudents,
  seduleDemoClass,
} from "../../../api/service/employee/EmployeeService";
import { useNavigate } from "react-router-dom";

const customColors = {
  primary: "#642B8F",
  secondary: "#F8A213",
  accent: "#AA88BE",
  highlight: "#F0BA6F",
  background: "#EFE8F0",
};

const DemoClassForm = () => {
  const empId = localStorage.getItem("empId");
  const navigate = useNavigate();
  const [prospectData, setProspectData] = useState([]);
  const [newClassForm, setNewClassForm] = useState({
    _id: "",
    parentFirstName: "",
    kidFirstName: "",
    whatsappNumber: "",
    email: "",
    programs: [],
    selectedProgram: {
      program: "",
      level: "",
      _id: "",
    },
    date: "",
    time: "",
   
  });
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await getProspectsStudents();
        console.log("Fetched Students:", response.data);
        setProspectData(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchStudentData();
  }, []);

  const handleStudentSelection = (studentId) => {
    const selectedStudent = prospectData?.find(
      (student) => student?._id === studentId
    );

    if (selectedStudent) {
      setNewClassForm((prev) => ({
        ...selectedStudent,
        selectedProgram: {
          program: "",
          level: "",
          _id: "",
          logs: "",
        },
        date: prev.date,
        time: prev.time,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "students") {
      handleStudentSelection(value);
    } else if (name === "program") {
      // Find the selected program from student's programs
      const selectedProgramObj = newClassForm.programs.find(
        (p) => p.program === value
      );

      setNewClassForm((prev) => ({
        ...prev,
        selectedProgram: selectedProgramObj || {
          program: value,
          level: "",
          _id: "",
        },
      }));
    } else if (name === "level") {
      setNewClassForm((prev) => ({
        ...prev,
        selectedProgram: {
          ...prev.selectedProgram,
          level: value,
        },
      }));
    } else {
      setNewClassForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmitNewClass = async () => {
    const {
      _id,
      parentFirstName,
      kidFirstName,
      email,
      selectedProgram,
      date,
      time,
      
    } = newClassForm;

    // Validation
    if (
      !_id ||
      !date ||
      !time ||
      !selectedProgram.program ||
      !selectedProgram.level
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const newClass = {
      _id,
      parentFirstName,
      kidFirstName,
      email,
      selectedProgram,
      date,
      time,
    };

    // Console log the complete class details
    console.log("Scheduled class details:", newClass);

    const response = await seduleDemoClass(empId, newClass);

    console.log(response);
    if (response && response.data) {
      navigate("/employee-operation/schedule");
    }
  };

  const handleCloseScheduleDialog = () => {
    setIsDialogOpen(false);
    setNewClassForm({
      _id: "",
      parentFirstName: "",
      kidFirstName: "",
      whatsappNumber: "",
      email: "",
      programs: [],
      selectedProgram: {
        program: "",
        level: "",
        _id: "",
      },
      date: "",
      time: "",
    });
  };

  return (
    <div>
      <Dialog
        open={isDialogOpen}
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
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Student</InputLabel>
                <Select
                  name="students"
                  value={newClassForm._id}
                  onChange={(e) => handleInputChange(e)}
                  label="Student"
                >
                  {prospectData?.map((student) => (
                    <MenuItem key={student?._id} value={student?._id}>
                      {student?.kidFirstName} ({student?.parentFirstName})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Program</InputLabel>
                <Select
                  name="program"
                  value={newClassForm.selectedProgram.program}
                  onChange={(e) => handleInputChange(e)}
                  label="Program"
                  disabled={!newClassForm._id}
                >
                  {newClassForm.programs.map((programObj) => (
                    <MenuItem key={programObj._id} value={programObj.program}>
                      {programObj.program}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Level</InputLabel>
                <Select
                  name="level"
                  value={newClassForm.selectedProgram.level}
                  onChange={(e) => handleInputChange(e)}
                  label="Level"
                  disabled={!newClassForm.selectedProgram.program}
                >
                  {newClassForm.selectedProgram.program ? (
                    <MenuItem value={newClassForm.selectedProgram.level}>
                      {newClassForm.selectedProgram.level}
                    </MenuItem>
                  ) : (
                    <MenuItem value="">Select a program first</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
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
          <Button
            color="secondary"
            onClick={() => navigate("/employee-operation/schedule")}
          >
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
    </div>
  );
};

export default DemoClassForm;
