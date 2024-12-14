import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { sheduleTimeTable } from "../../api/service/employee/serviceDeliveryService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const coaches = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"];

const programs = [
  { name: "Chess", levels: ["Beginner", "Intermediate", "Advanced"] },
  { name: "Rubiks Cube", levels: ["Beginner", "Intermediate", "Advanced"] },
  { name: "Math", levels: ["Beginner", "Intermediate", "Advanced"] },
];

const ClassScheduleForm = () => {
  const navigate = useNavigate()
  const empId = localStorage.getItem("empId");
  const [schedules, setSchedules] = useState([
    {
      day: "",
      coachName: "",
      program: "",
      level: "",
      startTime: "",
      endTime: "",
      meetingLink: "",
      isDemo: false
    },
  ]);

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index] = {
      ...newSchedules[index],
      [field]: value,
    };

    // Reset level if program changes
    if (field === "program") {
      newSchedules[index].level = "";
    }

    setSchedules(newSchedules);
  };

  const addSchedule = () => {
    setSchedules([
      ...schedules,
      {
        day: "",
        coachName: "",
        program: "",
        level: "",
        startTime: "",
        endTime: "",
        meetingLink: "",
        isDemo: false
      },
    ]);
  };

  const removeSchedule = (indexToRemove) => {
    setSchedules(schedules.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate schedules
    const isValid = schedules.every(
      (schedule) =>
        schedule.coachName &&
        schedule.program &&
        schedule.level &&
        schedule.day &&
        schedule.startTime &&
        schedule.endTime
       
    );

    if (!isValid) {
      alert("Please fill in all fields");
      return;
    }

    console.log(schedules);
    const response = await sheduleTimeTable(empId, schedules);
    console.log(response);
    if(response.status===201){
      toast.success(response.data.message)
      setTimeout(() => {
        navigate("/serviceScheduleClass")
        
      }, 1500);
    }
  };

  const handleReset = () => {
    setSchedules([
      {
        day: "",
        coachName: "",
        program: "",
        level: "",
        startTime: "",
        endTime: "",
        meetingLink: "",
        isDemo: false
      },
    ]);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Class Schedule Form</h2>
          <p className="text-sm opacity-90">Enter class schedule details</p>
        </div>

        <form onSubmit={handleSubmit} onReset={handleReset} className="p-8">
          {schedules.map((schedule, index) => (
            <React.Fragment key={index}>
              {/* First Row: Coach, Program, Level, Demo/Class */}
              <Grid
                container
                spacing={2}
                className="mb-4 p-4 border rounded-lg"
                alignItems="center"
              >
                {/* Coach Dropdown */}
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Coach</InputLabel>
                    <Select
                      value={schedule.coachName}
                      label="Coach"
                      onChange={(e) =>
                        handleScheduleChange(index, "coachName", e.target.value)
                      }
                    >
                      {coaches.map((coach) => (
                        <MenuItem key={coach} value={coach}>
                          {coach}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Program Dropdown */}
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Program</InputLabel>
                    <Select
                      value={schedule.program}
                      label="Program"
                      onChange={(e) =>
                        handleScheduleChange(index, "program", e.target.value)
                      }
                    >
                      {programs.map((program) => (
                        <MenuItem key={program.name} value={program.name}>
                          {program.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Level Dropdown */}
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Level</InputLabel>
                    <Select
                      value={schedule.level}
                      label="Level"
                      disabled={!schedule.program}
                      onChange={(e) =>
                        handleScheduleChange(index, "level", e.target.value)
                      }
                    >
                      {schedule.program &&
                        programs
                          .find((p) => p.name === schedule.program)
                          ?.levels.map((level) => (
                            <MenuItem key={level} value={level}>
                              {level}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Demo/Class Switch */}
                <Grid item xs={12} sm={3} container alignItems="center" justifyContent="center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={schedule.isDemo}
                        onChange={(e) =>
                          handleScheduleChange(index, "isDemo", e.target.checked)
                        }
                        color="primary"
                      />
                    }
                    label={schedule.isDemo ? "Demo" : "Class"}
                    labelPlacement="start"
                  />
                </Grid>
              </Grid>

              {/* Second Row: Day, Time, Meeting Link */}
              <Grid
                container
                spacing={2}
                className="mb-8 p-4 border rounded-lg "
                alignItems="center"
              >
                {/* Day Dropdown */}
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Day</InputLabel>
                    <Select
                      value={schedule.day}
                      label="Day"
                      onChange={(e) =>
                        handleScheduleChange(index, "day", e.target.value)
                      }
                    >
                      {days.map((day) => (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Start Time Input */}
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Start Time"
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) =>
                      handleScheduleChange(index, "startTime", e.target.value)
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />
                </Grid>

                {/* End Time Input */}
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="End Time"
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) =>
                      handleScheduleChange(index, "endTime", e.target.value)
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />
                </Grid>

                {/* Meeting Link Input */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Meeting Link"
                    value={schedule.meetingLink}
                    onChange={(e) =>
                      handleScheduleChange(index, "meetingLink", e.target.value)
                    }
                    placeholder="Enter meeting link (Zoom, Google Meet, etc.)"
                  />
                </Grid>

                {/* Remove Schedule Button */}
                {schedules.length > 1 && (
                  <Grid item xs={12} sm={1}>
                    <IconButton
                      onClick={() => removeSchedule(index)}
                      color="error"
                      size="medium"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </React.Fragment>
          ))}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={addSchedule} variant="outlined" color="secondary">
              Add Another Schedule
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit Schedules
            </Button>
            <Button type="reset" variant="outlined" color="error">
              Reset Form
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassScheduleForm;