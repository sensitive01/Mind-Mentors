import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Switch,
  FormControlLabel,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VideocamIcon from "@mui/icons-material/Videocam";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  getCoachAvailabilityData,
  sheduleTimeTable,
} from "../../../api/service/employee/serviceDeliveryService";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAllProgrameData } from "../../../api/service/employee/EmployeeService";

// Map day names to their index in the week (0 = Sunday, 1 = Monday, etc.)
const dayToIndex = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

// Utility to convert time string "HH:mm" to minutes
const timeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

// Generate time options in 15-minute intervals between start and end time (inclusive)
const generateTimeOptions = (startTime, endTime) => {
  if (!startTime || !endTime) return [];

  const times = [];
  let current = new Date(`1970-01-01T${startTime}:00Z`);
  const end = new Date(`1970-01-01T${endTime}:00Z`);

  while (current <= end) {
    times.push(current.toISOString().substring(11, 16)); // "HH:mm"
    current = new Date(current.getTime() + 15 * 60000);
  }
  return times;
};

// Calculate the date for the next occurrence of the selected day
const getNextDayDate = (dayName) => {
  const today = new Date();
  const todayIndex = today.getDay();
  const targetIndex = dayToIndex[dayName];
  let daysUntilTarget = targetIndex - todayIndex;
  if (daysUntilTarget <= 0) daysUntilTarget += 7;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntilTarget);
  return `${targetDate.getDate().toString().padStart(2, "0")}-${(
    targetDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${targetDate.getFullYear()}`;
};

const ClassScheduleForm = () => {
  const navigate = useNavigate();
  const department = localStorage.getItem("department");
  const empId = localStorage.getItem("empId");
  const [availabilityData, setAvailabilityData] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [centerData, setCenterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([
    {
      mode: "",
      day: "",
      date: "",
      centerId: "",
      centerName: "",
      coachId: "",
      coachName: "",
      program: "",
      level: "",
      fromTime: "",
      toTime: "",
      isDemo: false,
      maxKids: 0,
    },
  ]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [availabilityResponse, programResponse] = await Promise.all([
        getCoachAvailabilityData(),
        getAllProgrameData(),
      ]);
      if (availabilityResponse.data && availabilityResponse.data.success) {
        setAvailabilityData(availabilityResponse.data.availableDays);

        const uniqueCentersMap = new Map();
        availabilityResponse.data.availableDays.forEach((item) => {
          if (
            item.centerInfo &&
            item.coachInfo &&
            !uniqueCentersMap.has(item.centerInfo.centerId)
          ) {
            uniqueCentersMap.set(item.centerInfo.centerId, {
              id: item.centerInfo.centerId,
              name: item.coachInfo.centerName,
              centerType: item.centerInfo.centerType,
              businessHours: item.centerInfo.businessHours,
            });
          }
        });
        setCenterData(Array.from(uniqueCentersMap.values()));
      }
      if (programResponse.data && programResponse.data.success) {
        setProgramData(programResponse.data.programs);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch required data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Find center business hours for a given day
  const getCenterBusinessHoursForDay = (centerId, day) => {
    if (!centerId || !day) return null;
    const center = centerData.find((c) => c.id === centerId);
    if (!center || !center.businessHours) return null;
    const dayBusiness = center.businessHours.find((bh) => bh.day === day);
    return dayBusiness || null;
  };

  // Validate if scheduled time fits both coach availability and center business hours
  const validateTimeSlot = (schedule, fromTime, toTime) => {
    if (!schedule.mode || !fromTime || !toTime) return true;

    const availableSlots = availabilityData.filter((item) => {
      if (item.coachId !== schedule.coachId) return false;
      if (item.day !== schedule.day) return false;
      if (!item.coachInfo?.modes.includes(schedule.mode)) return false;
      if (item.centerInfo?.centerId !== schedule.centerId) return false;
      const itemFrom = timeToMinutes(item.fromTime);
      const itemTo = timeToMinutes(item.toTime);
      const schFrom = timeToMinutes(fromTime);
      const schTo = timeToMinutes(toTime);
      return itemFrom <= schFrom && itemTo >= schTo;
    });

    if (availableSlots.length === 0) return false;

    const businessHours = getCenterBusinessHoursForDay(
      schedule.centerId,
      schedule.day
    );
    if (!businessHours) return false;
    if (businessHours.isClosed) return false;

    const schFrom = timeToMinutes(fromTime);
    const schTo = timeToMinutes(toTime);

    const fitsBusinessHours = businessHours.periods.some((period) => {
      const openMins = timeToMinutes(period.openTime);
      const closeMins = timeToMinutes(period.closeTime);
      return schFrom >= openMins && schTo <= closeMins;
    });

    return fitsBusinessHours;
  };

  const getFilteredCoaches = (schedule) => {
    if (!availabilityData?.length) return [];
    let filtered = availabilityData;

    if (schedule.mode) {
      filtered = filtered.filter((item) =>
        item.coachInfo?.modes?.includes(schedule.mode)
      );
    }
    if (schedule.centerId) {
      filtered = filtered.filter(
        (item) => item.centerInfo?.centerId === schedule.centerId
      );
    }
    if (schedule.program) {
      filtered = filtered.filter((item) => item.program === schedule.program);
    }
    if (schedule.day) {
      filtered = filtered.filter((item) => item.day === schedule.day);
    }
    if (schedule.fromTime && schedule.toTime) {
      const fromMins = timeToMinutes(schedule.fromTime);
      const toMins = timeToMinutes(schedule.toTime);
      filtered = filtered.filter((item) => {
        const itemFrom = timeToMinutes(item.fromTime);
        const itemTo = timeToMinutes(item.toTime);
        return itemFrom <= fromMins && itemTo >= toMins;
      });
    }

    const coachesMap = new Map();
    filtered.forEach((item) => {
      if (!coachesMap.has(item.coachId)) {
        coachesMap.set(item.coachId, {
          id: item.coachId,
          name: item.coachName,
          centerId: item.coachInfo?.centerId || "",
          centerName: item.coachInfo?.centerName || "",
        });
      }
    });
    return Array.from(coachesMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  };

  const getFilteredCenters = (schedule) => {
    if (!centerData?.length) return [];
    let filtered = centerData;

    if (schedule.mode) {
      filtered = filtered.filter((center) => {
        if (typeof center.centerType === "string") {
          return center.centerType.includes(schedule.mode);
        }
        return false;
      });
    }

    if (schedule.coachId) {
      const coachCenters = availabilityData
        .filter(
          (item) =>
            item.coachId === schedule.coachId &&
            item.coachInfo?.modes?.includes(schedule.mode)
        )
        .map((item) => item.centerInfo?.centerId);
      filtered = filtered.filter((center) => coachCenters.includes(center.id));
    }

    if (schedule.program) {
      const programCenters = availabilityData
        .filter(
          (item) =>
            item.program === schedule.program &&
            item.coachInfo?.modes?.includes(schedule.mode)
        )
        .map((item) => item.centerInfo?.centerId);
      filtered = filtered.filter((center) =>
        programCenters.includes(center.id)
      );
    }

    if (schedule.day) {
      const dayCenters = availabilityData
        .filter(
          (item) =>
            item.day === schedule.day &&
            item.coachInfo?.modes?.includes(schedule.mode)
        )
        .map((item) => item.centerInfo?.centerId);
      filtered = filtered.filter((center) => dayCenters.includes(center.id));
    }

    if (schedule.fromTime && schedule.toTime) {
      const fromMins = timeToMinutes(schedule.fromTime);
      const toMins = timeToMinutes(schedule.toTime);

      const timeCenters = availabilityData
        .filter((item) => {
          const itemFrom = timeToMinutes(item.fromTime);
          const itemTo = timeToMinutes(item.toTime);
          return (
            itemFrom <= fromMins &&
            itemTo >= toMins &&
            item.coachInfo?.modes?.includes(schedule.mode)
          );
        })
        .map((item) => item.centerInfo?.centerId);

      filtered = filtered.filter((center) => timeCenters.includes(center.id));
    }

    const uniqueCenters = [];
    const seen = new Set();
    filtered.forEach((center) => {
      if (!seen.has(center.id)) {
        seen.add(center.id);
        uniqueCenters.push(center);
      }
    });

    return uniqueCenters;
  };

  const getFilteredPrograms = (schedule) => {
    if (!availabilityData?.length) return [];

    let filtered = availabilityData;

    if (schedule.mode) {
      filtered = filtered.filter((item) =>
        item.coachInfo?.modes?.includes(schedule.mode)
      );
    }
    if (schedule.centerId) {
      filtered = filtered.filter(
        (item) => item.centerInfo?.centerId === schedule.centerId
      );
    }
    if (schedule.coachId) {
      filtered = filtered.filter((item) => item.coachId === schedule.coachId);
    }
    if (schedule.day) {
      filtered = filtered.filter((item) => item.day === schedule.day);
    }
    if (schedule.fromTime && schedule.toTime) {
      const fromMins = timeToMinutes(schedule.fromTime);
      const toMins = timeToMinutes(schedule.toTime);
      filtered = filtered.filter((item) => {
        const itemFrom = timeToMinutes(item.fromTime);
        const itemTo = timeToMinutes(item.toTime);
        return itemFrom <= fromMins && itemTo >= toMins;
      });
    }

    const programSet = new Set(filtered.map((item) => item.program));
    return Array.from(programSet).sort();
  };

  const getFilteredDays = (schedule) => {
    if (!availabilityData?.length) return [];

    let filtered = availabilityData;
    if (schedule.mode) {
      filtered = filtered.filter((item) =>
        item.coachInfo?.modes?.includes(schedule.mode)
      );
    }
    if (schedule.centerId) {
      filtered = filtered.filter(
        (item) => item.centerInfo?.centerId === schedule.centerId
      );
    }
    if (schedule.coachId) {
      filtered = filtered.filter((item) => item.coachId === schedule.coachId);
    }
    if (schedule.program) {
      filtered = filtered.filter((item) => item.program === schedule.program);
    }
    if (schedule.fromTime && schedule.toTime) {
      const fromMins = timeToMinutes(schedule.fromTime);
      const toMins = timeToMinutes(schedule.toTime);
      filtered = filtered.filter((item) => {
        const itemFrom = timeToMinutes(item.fromTime);
        const itemTo = timeToMinutes(item.toTime);
        return itemFrom <= fromMins && itemTo >= toMins;
      });
    }
    const daysSet = new Set(filtered.map((item) => item.day));
    const daysArray = Array.from(daysSet);
    daysArray.sort((a, b) => dayToIndex[a] - dayToIndex[b]);
    return daysArray;
  };

  const getFilteredTimeSlots = (schedule) => {
    if (!availabilityData?.length) {
      return {
        min: "00:00",
        max: "23:59",
        options: generateTimeOptions("00:00", "23:59"),
        slots: [],
      };
    }

    let filtered = availabilityData;

    if (schedule.mode) {
      filtered = filtered.filter((item) =>
        item.coachInfo?.modes?.includes(schedule.mode)
      );
    }
    if (schedule.centerId) {
      filtered = filtered.filter(
        (item) => item.centerInfo?.centerId === schedule.centerId
      );
    }
    if (schedule.coachId) {
      filtered = filtered.filter((item) => item.coachId === schedule.coachId);
    }
    if (schedule.program) {
      filtered = filtered.filter((item) => item.program === schedule.program);
    }
    if (schedule.day) {
      filtered = filtered.filter((item) => item.day === schedule.day);
    }

    if (filtered.length === 0) {
      return {
        min: "00:00",
        max: "23:59",
        options: generateTimeOptions("00:00", "23:59"),
        slots: [],
      };
    }

    const fromTimesMins = filtered.map((i) => timeToMinutes(i.fromTime));
    const toTimesMins = filtered.map((i) => timeToMinutes(i.toTime));

    const minAvailable = Math.min(...fromTimesMins);
    const maxAvailable = Math.max(...toTimesMins);

    const padTime = (m) => {
      const h = Math.floor(m / 60);
      const min = m % 60;
      return `${h.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")}`;
    };

    const options = generateTimeOptions(
      padTime(minAvailable),
      padTime(maxAvailable)
    );

    // Now, intersect center business hours for selected day to disable unavailable start times in UI

    const businessHours = getCenterBusinessHoursForDay(
      schedule.centerId,
      schedule.day
    );
    if (businessHours && !businessHours.isClosed) {
      // Get open-close periods as array of [startMinutes, endMinutes]
      const openPeriods = businessHours.periods.map((p) => {
        return [timeToMinutes(p.openTime), timeToMinutes(p.closeTime)];
      });

      // Filter time options to those inside any open period
      const filteredOptions = options.filter((timeStr) => {
        const timeMins = timeToMinutes(timeStr);
        return openPeriods.some(
          ([start, end]) => timeMins >= start && timeMins <= end
        );
      });

      return {
        min: padTime(minAvailable),
        max: padTime(maxAvailable),
        options: filteredOptions,
        slots: filtered,
      };
    }

    return {
      min: padTime(minAvailable),
      max: padTime(maxAvailable),
      options,
      slots: filtered,
    };
  };

  const getLevelsForProgram = (programName) => {
    const program = programData.find((p) => p.programName === programName);
    return program ? program.programLevel : [];
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...schedules];
    const schedule = { ...newSchedules[index] };

    switch (field) {
      case "mode":
        schedule.mode = value;
        schedule.centerId = "";
        schedule.centerName = "";
        schedule.coachId = "";
        schedule.coachName = "";
        schedule.program = "";
        schedule.level = "";
        schedule.day = "";
        schedule.date = "";
        schedule.fromTime = "";
        schedule.toTime = "";
        break;

      case "coachName":
        {
          const coaches = getFilteredCoaches(schedule);
          const selectedCoach = coaches.find((c) => c.name === value);
          if (selectedCoach) {
            schedule.coachName = selectedCoach.name;
            schedule.coachId = selectedCoach.id;
            if (!schedule.centerId && selectedCoach.centerId) {
              schedule.centerId = selectedCoach.centerId;
              schedule.centerName = selectedCoach.centerName;
            }
          }
        }
        break;

      case "centerName":
        {
          const centers = getFilteredCenters(schedule);
          const selectedCenter = centers.find((c) => c.name === value);
          if (selectedCenter) {
            schedule.centerName = selectedCenter.name;
            schedule.centerId = selectedCenter.id;
            // Reset times and day if new center incompatible with previous
            schedule.day = "";
            schedule.date = "";
            schedule.fromTime = "";
            schedule.toTime = "";
          }
        }
        break;

      case "program":
        schedule.program = value;
        schedule.level = "";
        break;

      case "level":
        schedule.level = value;
        break;

      case "day":
        schedule.day = value;
        if (value) {
          // Check center business hours for that day
          const businessHours = getCenterBusinessHoursForDay(
            schedule.centerId,
            value
          );
          if (!businessHours || businessHours.isClosed) {
            toast.error(
              `Center "${schedule.centerName}" is closed on ${value}. Please select another day or center.`
            );
            schedule.day = "";
            schedule.date = "";
            schedule.fromTime = "";
            schedule.toTime = "";
          } else {
            schedule.date = getNextDayDate(value);
            // Reset times on day change
            schedule.fromTime = "";
            schedule.toTime = "";
          }
        } else {
          schedule.date = "";
          schedule.fromTime = "";
          schedule.toTime = "";
        }
        break;

      case "fromTime":
      case "toTime":
        if (field === "fromTime") {
          schedule.fromTime = value;
          if (
            schedule.toTime &&
            timeToMinutes(schedule.toTime) <= timeToMinutes(value)
          ) {
            schedule.toTime = "";
          }
        } else {
          schedule.toTime = value;
        }
        if (schedule.fromTime && schedule.toTime) {
          if (!validateTimeSlot(schedule, schedule.fromTime, schedule.toTime)) {
            toast.error("Selected time slot is not within available hours.");
            return;
          }
        }
        break;

      case "isDemo":
        schedule.isDemo = value;
        break;

      default:
        schedule[field] = value;
    }

    newSchedules[index] = schedule;
    setSchedules(newSchedules);
  };

  const addSchedule = () => {
    setSchedules([
      ...schedules,
      {
        mode: "",
        day: "",
        date: "",
        centerId: "",
        centerName: "",
        coachId: "",
        coachName: "",
        program: "",
        level: "",
        fromTime: "",
        toTime: "",
        isDemo: false,
      },
    ]);
  };

  const removeSchedule = (index) => {
    setSchedules(schedules.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const schedule of schedules) {
      const {
        mode,
        coachName,
        coachId,
        program,
        level,
        day,
        fromTime,
        toTime,
        centerId,
        centerName,
      } = schedule;

      if (
        !mode ||
        !coachName ||
        !coachId ||
        !program ||
        !level ||
        !day ||
        !fromTime ||
        !toTime ||
        !centerId ||
        !centerName
      ) {
        toast.error("Please fill in all required fields for all schedules.");
        return;
      }

      if (!validateTimeSlot(schedule, fromTime, toTime)) {
        toast.error(
          `Time slot for coach ${coachName} on ${day} is not valid based on availability and center hours.`
        );
        return;
      }
    }

    try {
      const response = await sheduleTimeTable(empId, schedules);
      console.log(response)

      if (response.status === 201) {
        toast.success(
          response.data.message || "Schedules submitted successfully"
        );
        setSchedules([
          {
            mode: "",
            day: "",
            date: "",
            centerId: "",
            centerName: "",
            coachId: "",
            coachName: "",
            program: "",
            level: "",
            fromTime: "",
            toTime: "",
            isDemo: false,
          },
        ]);
        setTimeout(() => {
          navigate(`/${department}/department/class-timetable-list`);
        }, 1500);
      }
    } catch (error) {
      console.error("Schedule submission error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit schedules"
      );
    }
  };

  const handleReset = () => {
    setSchedules([
      {
        mode: "",
        day: "",
        date: "",
        centerId: "",
        centerName: "",
        coachId: "",
        coachName: "",
        program: "",
        level: "",
        fromTime: "",
        toTime: "",
        isDemo: false,
      },
    ]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Typography variant="h5">Loading class scheduling data...</Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white border shadow-lg rounded-lg">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-4 rounded-t-lg text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Class Schedule Form</h2>
            <p className="text-sm opacity-90">
              Create class schedules for students
            </p>
          </div>
          <button
            onClick={() =>
              navigate("/super-admin/department/class-timetable-list")
            } // replace with your actual handler
            className="bg-white text-[#642b8f] px-4 py-2 rounded font-medium hover:bg-gray-100 transition"
          >
            View Schedule
          </button>
        </div>

        <form onSubmit={handleSubmit} onReset={handleReset} className="p-4">
          {schedules.map((schedule, index) => {
            const coaches = getFilteredCoaches(schedule);
            const centers = getFilteredCenters(schedule);
            const programs = getFilteredPrograms(schedule);
            const days = getFilteredDays(schedule);
            const timeRange = getFilteredTimeSlots(schedule);

            return (
              <Card
                key={index}
                variant="outlined"
                className="mb-4"
                sx={{
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "10px",
                    left: "12px",
                    backgroundColor: "#642b8f",
                    color: "white",
                    borderRadius: "4px",
                    padding: "2px 8px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}
                >
                  #{index + 1}
                </Box>

                {schedules.length > 1 && (
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      padding: "4px",
                    }}
                    onClick={() => removeSchedule(index)}
                    color="error"
                    size="small"
                    aria-label={`Remove schedule #${index + 1}`}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}

                <CardContent sx={{ pt: 4, pb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8} md={3}>
                      <FormControl size="small" fullWidth required>
                        <InputLabel>Class Mode</InputLabel>
                        <Select
                          value={schedule.mode}
                          label="Class Mode*"
                          onChange={(e) =>
                            handleScheduleChange(index, "mode", e.target.value)
                          }
                          startAdornment={
                            schedule.mode === "online" ? (
                              <VideocamIcon
                                fontSize="small"
                                sx={{ ml: 0.5, mr: 0.5, color: "#1976d2" }}
                              />
                            ) : schedule.mode === "offline" ? (
                              <LocationOnIcon
                                fontSize="small"
                                sx={{ ml: 0.5, mr: 0.5, color: "#2e7d32" }}
                              />
                            ) : null
                          }
                        >
                          <MenuItem value="online">Online</MenuItem>
                          <MenuItem value="offline">
                            Offline (In-Person)
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4} md={2}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={schedule.isDemo}
                              onChange={(e) =>
                                handleScheduleChange(
                                  index,
                                  "isDemo",
                                  e.target.checked
                                )
                              }
                              color="secondary"
                            />
                          }
                          label={
                            <Typography variant="body2">Demo Class</Typography>
                          }
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl
                        size="small"
                        fullWidth
                        required
                        disabled={!schedule.mode}
                        aria-label="Coach select"
                      >
                        <InputLabel>Coach</InputLabel>
                        <Select
                          value={schedule.coachName}
                          label="Coach*"
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "coachName",
                              e.target.value
                            )
                          }
                        >
                          {coaches.length ? (
                            coaches.map((coach) => (
                              <MenuItem key={coach.id} value={coach.name}>
                                {coach.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No coaches available</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl
                        size="small"
                        fullWidth
                        required
                        aria-label="Center select"
                      >
                        <InputLabel>Center</InputLabel>
                        <Select
                          value={schedule.centerName}
                          label="Center*"
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "centerName",
                              e.target.value
                            )
                          }
                          disabled={!schedule.mode}
                        >
                          {centers.length ? (
                            centers.map((center) => (
                              <MenuItem key={center.id} value={center.name}>
                                {center.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No centers available</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl
                        size="small"
                        fullWidth
                        required
                        disabled={!schedule.mode}
                        aria-label="Program select"
                      >
                        <InputLabel>Program</InputLabel>
                        <Select
                          value={schedule.program}
                          label="Program*"
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "program",
                              e.target.value
                            )
                          }
                        >
                          {programs.length ? (
                            programs.map((program) => (
                              <MenuItem key={program} value={program}>
                                {program}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No programs available</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl
                        size="small"
                        fullWidth
                        required
                        disabled={!schedule.program}
                        aria-label="Level select"
                      >
                        <InputLabel>Level</InputLabel>
                        <Select
                          value={schedule.level}
                          label="Level*"
                          onChange={(e) =>
                            handleScheduleChange(index, "level", e.target.value)
                          }
                        >
                          {schedule.program &&
                          getLevelsForProgram(schedule.program).length ? (
                            getLevelsForProgram(schedule.program).map(
                              (level) => (
                                <MenuItem key={level} value={level}>
                                  {level}
                                </MenuItem>
                              )
                            )
                          ) : (
                            <MenuItem disabled>No Levels available</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4} md={2}>
                      <FormControl
                        size="small"
                        fullWidth
                        required
                        aria-label="Day select"
                      >
                        <InputLabel>Day</InputLabel>
                        <Select
                          value={schedule.day}
                          label="Day*"
                          onChange={(e) =>
                            handleScheduleChange(index, "day", e.target.value)
                          }
                        >
                          {days.length ? (
                            days.map((day) => {
                              // Disable days where center is closed
                              const bh = getCenterBusinessHoursForDay(
                                schedule.centerId,
                                day
                              );
                              const disabled = !bh || bh.isClosed;
                              return (
                                <MenuItem
                                  key={day}
                                  value={day}
                                  disabled={disabled}
                                >
                                  {day} {disabled ? "(Closed)" : ""}
                                </MenuItem>
                              );
                            })
                          ) : (
                            <MenuItem disabled>No days available</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={8} md={4}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Date"
                        value={schedule.date || ""}
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                        aria-label="Selected date"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl
                        size="small"
                        fullWidth
                        required
                        aria-label="Start Time select"
                      >
                        <InputLabel>Start Time</InputLabel>
                        <Select
                          value={schedule.fromTime}
                          label="Start Time*"
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "fromTime",
                              e.target.value
                            )
                          }
                          disabled={!schedule.day}
                        >
                          {timeRange.options.length ? (
                            timeRange.options.map((time) => (
                              <MenuItem key={time} value={time}>
                                {time}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              No available start times
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl
                        size="small"
                        fullWidth
                        required
                        disabled={!schedule.fromTime}
                        aria-label="End Time select"
                      >
                        <InputLabel>End Time</InputLabel>
                        <Select
                          value={schedule.toTime}
                          label="End Time*"
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "toTime",
                              e.target.value
                            )
                          }
                        >
                          {timeRange.options
                            .filter((time) => time > schedule.fromTime)
                            .map((time) => (
                              <MenuItem key={time} value={time}>
                                {time}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl
                        size="small"
                        fullWidth
                        required
                        aria-label="Maximum Number of Kids"
                      >
                        <TextField
                          type="number"
                          label="Maximum Number of Kids"
                          value={schedule.maxKids || ""}
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "maxKids",
                              e.target.value
                            )
                          }
                          inputProps={{ min: 1 }}
                          size="small"
                          required
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 3,
              mb: 2,
            }}
          >
            <Button
              onClick={addSchedule}
              variant="outlined"
              color="secondary"
              size="small"
              startIcon={<span>+</span>}
              aria-label="Add schedule"
            >
              Add Schedule
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#642b8f",
                "&:hover": { backgroundColor: "#53197a" },
              }}
              aria-label="Submit all schedules"
            >
              Submit All Schedules
            </Button>
            <Button
              type="reset"
              variant="outlined"
              color="error"
              size="small"
              aria-label="Reset form"
            >
              Reset
            </Button>
          </Box>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        style={{ marginTop: "50px" }}
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default ClassScheduleForm;
