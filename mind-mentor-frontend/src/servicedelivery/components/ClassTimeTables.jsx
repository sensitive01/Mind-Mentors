import React, { useEffect, useState } from "react";
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
import {
  getCoachAvailabilityData,
  sheduleTimeTable,
} from "../../api/service/employee/serviceDeliveryService";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const programs = [
  { name: "Chess", levels: ["Beginner", "Intermediate", "Advanced"] },
  { name: "Rubiks Cube", levels: ["Beginner", "Intermediate", "Advanced"] },
  { name: "Math", levels: ["Beginner", "Intermediate", "Advanced"] },
];

const ClassScheduleForm = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const [availabilityData, setAvailabilityData] = useState([]);
  const [schedules, setSchedules] = useState([
    {
      day: "",
      coachId: "",
      coachName: "",
      program: "",
      level: "",
      fromTime: "",
      toTime: "",
      meetingLink: "",
      isDemo: false,
    },
  ]);

  useEffect(() => {
    const fetchAvailableData = async () => {
      try {
        const response = await getCoachAvailabilityData();
        console.log("CoachAvialbility", response);
        setAvailabilityData(response.data.availableDays);
      } catch (error) {
        console.error("Error fetching availability data:", error);
        toast.error("Failed to fetch coach availability");
      }
    };
    fetchAvailableData();
  }, []);

  const coaches = [
    ...new Set(
      availabilityData.map((item) => ({
        id: item.coachId,
        name: item.coachName,
      }))
    ),
  ].filter(
    (coach, index, self) => index === self.findIndex((c) => c.id === coach.id)
  );

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    try {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    } catch (error) {
      return null;
    }
  };

  // Helper function to check if a time is within available slots
  const validateTimeSlot = (schedule, fromTime, toTime) => {
    if (!schedule.coachName || !schedule.program || !schedule.day) {
      return true; // Skip validation if required fields are not filled
    }

    const timeSlots = getTimeSlots(
      schedule.coachName,
      schedule.program,
      schedule.day
    );
    if (!timeSlots.length) return false;

    const selectedStart = timeToMinutes(fromTime);
    const selectedEnd = timeToMinutes(toTime);

    if (!selectedStart || !selectedEnd) return true; // Skip validation if times are incomplete

    return timeSlots.some((slot) => {
      const slotStart = timeToMinutes(slot.fromTime);
      const slotEnd = timeToMinutes(slot.toTime);
      return selectedStart >= slotStart && selectedEnd <= slotEnd;
    });
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...schedules];
    const currentSchedule = { ...newSchedules[index] };

    if (field === "coachName") {
      // When coach is selected, find and set both name and ID
      const selectedCoach = coaches.find(coach => coach.name === value);
      if (selectedCoach) {
        currentSchedule.coachName = selectedCoach.name;
        currentSchedule.coachId = selectedCoach.id;
      }
    } else {
      currentSchedule[field] = value;
    }


    // Validate time slots if either time is changed
    if (field === "fromTime" || field === "toTime") {
      const isValid = validateTimeSlot(
        currentSchedule,
        field === "fromTime" ? value : currentSchedule.fromTime,
        field === "toTime" ? value : currentSchedule.toTime
      );

      if (!isValid && currentSchedule.fromTime && currentSchedule.toTime) {
        toast.error("Selected time slot is not within coach's available hours");
        return;
      }
    }

    newSchedules[index] = currentSchedule;
    setSchedules(newSchedules);
  };

  const getProgramsForCoach = (coachName) => {
    return [
      ...new Set(
        availabilityData
          .filter((item) => item.coachName === coachName)
          .map((item) => item.program)
      ),
    ];
  };

  const getDaysForCoachProgram = (coachName, program) => {
    return [
      ...new Set(
        availabilityData
          .filter(
            (item) => item.coachName === coachName && item.program === program
          )
          .map((item) => item.day)
      ),
    ];
  };

  const getTimeSlots = (coachName, program, day) => {
    return availabilityData.filter(
      (item) =>
        item.coachName === coachName &&
        item.program === program &&
        item.day === day
    );
  };

  const addSchedule = () => {
    setSchedules([
      ...schedules,
      {
        day: "",
        coachId: "",
        coachName: "",
        program: "",
        level: "",
        fromTime: "",
        toTime: "",
        meetingLink: "",
        isDemo: false,
      },
    ]);
  };

  const removeSchedule = (indexToRemove) => {
    setSchedules(schedules.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all schedules
    const isValid = schedules.every((schedule) => {
      // Check required fields
      if (
        !schedule.coachName ||
        !schedule.program ||
        !schedule.level ||
        !schedule.day ||
        !schedule.fromTime ||
        !schedule.toTime
      ) {
        toast.error("Please fill in all required fields");
        return false;
      }

      // Validate time slots
      const isTimeValid = validateTimeSlot(
        schedule,
        schedule.fromTime,
        schedule.toTime
      );

      if (!isTimeValid) {
        toast.error(
          `Invalid time slot selected for ${schedule.coachName}'s schedule`
        );
        return false;
      }

      return true;
    });

    if (!isValid) return;

    try {
      const response = await sheduleTimeTable(empId, schedules);
      if (response.status === 201) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/serviceScheduleClass");
        }, 1500);
      }
    } catch (error) {
      toast.error("Failed to submit schedules");
      console.error("Submission error:", error);
    }
  };

  const handleReset = () => {
    setSchedules([
      {
        day: "",
        coachId: "",
        coachName: "",
        program: "",
        level: "",
        fromTime: "",
        toTime: "",
        meetingLink: "",
        isDemo: false,
      },
    ]);
  };

  // Helper function to get available time range for a schedule
  const getAvailableTimeRange = (schedule) => {
    if (!schedule.coachName || !schedule.program || !schedule.day) {
      return { min: "00:00", max: "23:59" };
    }

    const timeSlots = getTimeSlots(
      schedule.coachName,
      schedule.program,
      schedule.day
    );
    if (!timeSlots.length) return { min: "00:00", max: "23:59" };

    const fromTimes = timeSlots.map((slot) => slot.fromTime);
    const toTimes = timeSlots.map((slot) => slot.toTime);

    return {
      min: fromTimes.sort()[0],
      max: toTimes.sort()[toTimes.length - 1],
    };
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Class Schedule Form</h2>
          <p className="text-sm opacity-90">Enter class schedule details</p>
        </div>

        <form onSubmit={handleSubmit} onReset={handleReset} className="p-8">
          {schedules.map((schedule, index) => {
            const timeRange = getAvailableTimeRange(schedule);

            return (
              <React.Fragment key={index}>
                <Grid
                  container
                  spacing={2}
                  className="mb-4 p-4 border rounded-lg"
                  alignItems="center"
                >
                  {/* Coach Dropdown */}
                  <Grid item xs={12} sm={4}>
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
                          <MenuItem key={coach.id} value={coach.name}>
                            {coach.name}
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
                        disabled={!schedule.coachName}
                        onChange={(e) =>
                          handleScheduleChange(index, "program", e.target.value)
                        }
                      >
                        {schedule.coachName &&
                          getProgramsForCoach(schedule.coachName).map(
                            (program) => (
                              <MenuItem key={program} value={program}>
                                {program}
                              </MenuItem>
                            )
                          )}
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
                  <Grid
                    item
                    xs={12}
                    sm={1}
                    container
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={schedule.isDemo}
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "isDemo",
                              e.target.checked
                            )
                          }
                          color="primary"
                        />
                      }
                      label={schedule.isDemo ? "Demo" : "Class"}
                      labelPlacement="start"
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={2}
                  className="mb-8 p-4 border rounded-lg"
                  alignItems="center"
                >
                  {/* Day Dropdown */}
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Day</InputLabel>
                      <Select
                        value={schedule.day}
                        label="Day"
                        disabled={!schedule.coachName || !schedule.program}
                        onChange={(e) =>
                          handleScheduleChange(index, "day", e.target.value)
                        }
                      >
                        {schedule.coachName &&
                          schedule.program &&
                          getDaysForCoachProgram(
                            schedule.coachName,
                            schedule.program
                          ).map((day) => (
                            <MenuItem key={day} value={day}>
                              {day}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Time Selection */}
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Start Time"
                      type="time"
                      value={schedule.fromTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "fromTime", e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: timeRange.min,
                        max: timeRange.max,
                        step: 300,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="End Time"
                      type="time"
                      value={schedule.toTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "toTime", e.target.value)
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: timeRange.min,
                        max: timeRange.max,
                        step: 300,
                      }}
                    />
                  </Grid>

                  {/* Meeting Link */}
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Meeting Link"
                      value={schedule.meetingLink}
                      onChange={(e) =>
                        handleScheduleChange(
                          index,
                          "meetingLink",
                          e.target.value
                        )
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
            );
          })}

          {/* Form Action Buttons */}
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
};

export default ClassScheduleForm;
