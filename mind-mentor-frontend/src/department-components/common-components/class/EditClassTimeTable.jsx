import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

// Import your API services
import { getCoachAvailabilityData } from "../../../api/service/employee/serviceDeliveryService";
import {
  editSheduledClassData,
  editSheduleTimeTable,
  getAllProgrameData,
} from "../../../api/service/employee/EmployeeService";

// Utility functions
const dayToIndex = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const timeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const generateTimeOptions = (startTime, endTime) => {
  if (!startTime || !endTime) return [];
  const times = [];
  let current = new Date(`1970-01-01T${startTime}:00Z`);
  const end = new Date(`1970-01-01T${endTime}:00Z`);

  while (current <= end) {
    times.push(current.toISOString().substring(11, 16));
    current = new Date(current.getTime() + 15 * 60000);
  }
  return times;
};

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

// Debug Component
const DebugPanel = ({ data, show = false }) => {
  if (!show) return null;

  return (
    <Card sx={{ mb: 2, backgroundColor: "#f5f5f5" }}>
      <CardContent>
        <Typography variant="h6">Debug Information</Typography>
        <pre style={{ fontSize: "12px", overflow: "auto", maxHeight: "200px" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
};

// Custom hooks
const useApiData = () => {
  const [availabilityData, setAvailabilityData] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [centerData, setCenterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("🔄 Starting API data fetch...");
      setLoading(true);
      setError(null);

      try {
        const [availabilityResponse, programResponse] = await Promise.all([
          getCoachAvailabilityData(),
          getAllProgrameData(),
        ]);

        console.log("📡 Raw API Responses:");
        console.log("Availability Response:", availabilityResponse);
        console.log("Program Response:", programResponse);

        // Process availability data
        if (availabilityResponse?.data?.success) {
          const rawAvailability = availabilityResponse.data.availableDays || [];
          console.log("✅ Availability Data (raw):", rawAvailability);

          if (rawAvailability.length === 0) {
            console.warn("⚠️ No availability data found!");
          }

          setAvailabilityData(rawAvailability);

          // Extract unique centers
          const uniqueCentersMap = new Map();
          rawAvailability.forEach((item) => {
            console.log("Processing availability item:", item);

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

          const centers = Array.from(uniqueCentersMap.values());
          console.log("🏢 Processed Centers:", centers);
          setCenterData(centers);
        } else {
          console.error(
            "❌ Invalid availability response structure:",
            availabilityResponse
          );
          setError("Failed to fetch coach availability data");
        }

        // Process program data
        if (programResponse?.data?.success) {
          const programs = programResponse.data.programs || [];
          console.log("📚 Program Data:", programs);
          setProgramData(programs);
        } else {
          console.error(
            "❌ Invalid program response structure:",
            programResponse
          );
          setError("Failed to fetch program data");
        }
      } catch (err) {
        console.error("💥 API Fetch Error:", err);
        setError(`API Error: ${err.message}`);
        toast.error("Failed to fetch required data. Please try again.");
      } finally {
        setLoading(false);
        console.log("✅ API data fetch completed");
      }
    };

    fetchData();
  }, []);

  return { availabilityData, programData, centerData, loading, error };
};

const useFilteredOptions = (availabilityData, schedule) => {
  console.log("🔍 Computing filtered options for schedule:", schedule);
  console.log("📊 Available data length:", availabilityData.length);

  const filteredCoaches = useMemo(() => {
    if (!availabilityData?.length) {
      console.log("❌ No availability data for coaches filter");
      return [];
    }

    let filtered = availabilityData;
    console.log("🎯 Starting with", filtered.length, "availability records");

    // Filter by mode (primary filter)
    if (schedule.mode) {
      filtered = filtered.filter((item) => {
        const hasMode = item.coachInfo?.modes?.includes(schedule.mode);
        if (!hasMode) {
          console.log(
            "Filtering out coach",
            item.coachName,
            "- doesn't support mode:",
            schedule.mode
          );
        }
        return hasMode;
      });
      console.log("After mode filter:", filtered.length, "records");
    }

    // Only apply other filters if we're not in edit mode with existing data
    // This prevents over-filtering when editing an existing schedule
    const isEditingWithExistingData =
      schedule.coachId && schedule.program && schedule.day;

    if (!isEditingWithExistingData) {
      // Filter by center only if not editing existing data
      if (schedule.centerId) {
        const beforeFilter = filtered.length;
        filtered = filtered.filter(
          (item) => item.centerInfo?.centerId === schedule.centerId
        );
        console.log(
          `After center filter (${schedule.centerId}):`,
          filtered.length,
          "records (was",
          beforeFilter,
          ")"
        );

        // If no matches, try alternative center matching
        if (filtered.length === 0 && beforeFilter > 0) {
          console.log(
            "⚠️ No center matches found, trying alternative matching..."
          );
          filtered = availabilityData.filter((item) =>
            item.coachInfo?.modes?.includes(schedule.mode)
          );
        }
      }

      // Filter by program
      if (schedule.program && filtered.length > 0) {
        filtered = filtered.filter((item) => item.program === schedule.program);
        console.log("After program filter:", filtered.length, "records");
      }

      // Filter by day
      if (schedule.day && filtered.length > 0) {
        filtered = filtered.filter((item) => item.day === schedule.day);
        console.log("After day filter:", filtered.length, "records");
      }
    }

    // Extract unique coaches
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

    const coaches = Array.from(coachesMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    console.log("👨‍🏫 Final filtered coaches:", coaches);
    return coaches;
  }, [
    availabilityData,
    schedule.mode,
    schedule.centerId,
    schedule.program,
    schedule.day,
    schedule.coachId,
  ]);

  const filteredPrograms = useMemo(() => {
    if (!availabilityData?.length) {
      console.log("❌ No availability data for programs filter");
      return [];
    }

    let filtered = availabilityData;

    // Always filter by mode first
    if (schedule.mode) {
      filtered = filtered.filter((item) =>
        item.coachInfo?.modes?.includes(schedule.mode)
      );
      console.log("Programs after mode filter:", filtered.length, "records");
    }

    // Be more lenient with other filters for programs
    if (schedule.coachId) {
      const coachFiltered = filtered.filter(
        (item) => item.coachId === schedule.coachId
      );
      if (coachFiltered.length > 0) {
        filtered = coachFiltered;
        console.log("Programs after coach filter:", filtered.length, "records");
      }
    }

    const programSet = new Set(
      filtered.map((item) => item.program).filter(Boolean)
    );
    const programs = Array.from(programSet).sort();
    console.log("📚 Final filtered programs:", programs);
    return programs;
  }, [availabilityData, schedule.mode, schedule.coachId]);

  const filteredDays = useMemo(() => {
    if (!availabilityData?.length) {
      console.log("❌ No availability data for days filter");
      return [];
    }

    let filtered = availabilityData;

    // Always filter by mode first
    if (schedule.mode) {
      filtered = filtered.filter((item) =>
        item.coachInfo?.modes?.includes(schedule.mode)
      );
    }

    // Be more lenient with other filters for days
    if (schedule.coachId) {
      const coachFiltered = filtered.filter(
        (item) => item.coachId === schedule.coachId
      );
      if (coachFiltered.length > 0) {
        filtered = coachFiltered;
      }
    }

    if (schedule.program) {
      const programFiltered = filtered.filter(
        (item) => item.program === schedule.program
      );
      if (programFiltered.length > 0) {
        filtered = programFiltered;
      }
    }

    const daysSet = new Set(filtered.map((item) => item.day).filter(Boolean));
    const days = Array.from(daysSet).sort(
      (a, b) => dayToIndex[a] - dayToIndex[b]
    );
    console.log("📅 Final filtered days:", days);
    return days;
  }, [availabilityData, schedule.mode, schedule.coachId, schedule.program]);

  return { filteredCoaches, filteredPrograms, filteredDays };
};

// Main Component
const EditClassSchedule = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const department = localStorage.getItem("department");

  // Custom hooks
  const { availabilityData, programData, centerData, loading, error } =
    useApiData();

  // Local state
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

  const [classDataLoading, setClassDataLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false); // Toggle for debug panel

  // Get current schedule (assuming single schedule for now)
  const currentSchedule = schedules[0];

  // Use filtered options
  const { filteredCoaches, filteredPrograms, filteredDays } =
    useFilteredOptions(availabilityData, currentSchedule);

  // Load class data if editing
  useEffect(() => {
    const fetchClassData = async () => {
      if (!classId || loading) return;

      console.log("📝 Loading class data for ID:", classId);
      setClassDataLoading(true);

      try {
        const response = await editSheduledClassData(classId);
        console.log("📝 Class data response:", response);

        if (response.status === 200) {
          const classData = response.data.classData;
          console.log("📝 Processing class data:", classData);

          // Parse time format
          let fromTime = "";
          let toTime = "";
          if (classData.classTime) {
            const [start, end] = classData.classTime.split(" - ");
            const convertTo24Hour = (time12h) => {
              const [time, modifier] = time12h.split(" ");
              let [hours, minutes] = time.split(":").map(Number);
              if (modifier === "PM" && hours !== 12) hours += 12;
              if (modifier === "AM" && hours === 12) hours = 0;
              return `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}`;
            };
            fromTime = convertTo24Hour(start.trim());
            toTime = convertTo24Hour(end.trim());
          }

          const mappedSchedule = {
            mode: classData.type || "",
            day: classData.day || "",
            date: classData.classDate
              ? new Date(classData.classDate).toLocaleDateString("en-GB")
              : "",
            centerId: classData.centerId || "",
            centerName: classData.centerName || "",
            coachId: classData.coachId || "",
            coachName: classData.coachName || "",
            program: classData.program || "",
            level: classData.level || "",
            fromTime: fromTime,
            toTime: toTime,
            isDemo: classData.isDemoAdded || false,
            maxKids: classData.maximumKidCount || 0,
          };

          console.log("📝 Mapped schedule:", mappedSchedule);
          setSchedules([mappedSchedule]);
        }
      } catch (error) {
        console.error("💥 Error loading class data:", error);
        toast.error("Failed to load class data");
      } finally {
        setClassDataLoading(false);
      }
    };

    fetchClassData();
  }, [classId, loading]);

  // Handle form field changes
  const handleScheduleChange = useCallback(
    (index, field, value) => {
      console.log(`🔄 Changing ${field} to:`, value);

      setSchedules((prev) => {
        const newSchedules = [...prev];
        const schedule = { ...newSchedules[index] };

        switch (field) {
          case "mode":
            schedule.mode = value;
            // Reset dependent fields
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
            const selectedCoach = filteredCoaches.find((c) => c.name === value);
            if (selectedCoach) {
              schedule.coachName = selectedCoach.name;
              schedule.coachId = selectedCoach.id;
            }
            break;

          case "program":
            schedule.program = value;
            schedule.level = "";
            break;

          case "day":
            schedule.day = value;
            if (value) {
              schedule.date = getNextDayDate(value);
              schedule.fromTime = "";
              schedule.toTime = "";
            } else {
              schedule.date = "";
            }
            break;

          default:
            schedule[field] = value;
        }

        newSchedules[index] = schedule;
        console.log("📝 Updated schedule:", schedule);
        return newSchedules;
      });
    },
    [filteredCoaches]
  );

  // Get levels for selected program
  const getLevelsForProgram = useCallback(
    (programName) => {
      const program = programData.find((p) => p.programName === programName);
      return program ? program.programLevel : [];
    },
    [programData]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Submitting schedules:", schedules);

    try {
      const response = await editSheduleTimeTable(classId, schedules);
      if (response.status === 200) {
        toast.success("Schedule updated successfully");
        setTimeout(() => {
          navigate(`/${department}/department/class-timetable-list`);
        }, 1500);
      }
    } catch (error) {
      console.error("💥 Submit error:", error);
      toast.error("Failed to update schedule");
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
        maxKids: 0,
      },
    ]);
  };

  // Debug data
  const debugData = {
    loading,
    error,
    availabilityDataLength: availabilityData.length,
    programDataLength: programData.length,
    centerDataLength: centerData.length,
    currentSchedule,
    filteredCoaches: filteredCoaches.length,
    filteredPrograms: filteredPrograms.length,
    filteredDays: filteredDays.length,
    sampleAvailabilityData: availabilityData.slice(0, 2),
    sampleProgramData: programData.slice(0, 2),
  };

  if (loading || classDataLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>
          {loading ? "Loading data..." : "Loading class details..."}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white border shadow-lg rounded-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-4 rounded-t-lg text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Class Schedule Form</h2>
            <p className="text-sm opacity-90">
              {classId ? "Edit class schedule" : "Create class schedules"}
            </p>
          </div>
          <div>
            {/* <Button
              onClick={() => setShowDebug(!showDebug)}
              variant="outlined"
              size="small"
              sx={{ mr: 2, color: "white", borderColor: "white" }}
            >
              {showDebug ? "Hide" : "Show"} Debug
            </Button> */}
            <Button
              onClick={() =>
                navigate(`/${department}/department/class-timetable-list`)
              }
              variant="contained"
              size="small"
              sx={{ backgroundColor: "white", color: "#642b8f" }}
            >
              View Schedule
            </Button>
          </div>
        </div>

        {/* Debug Panel */}
        <DebugPanel data={debugData} show={showDebug} />

        {/* Form */}
        <form onSubmit={handleSubmit} onReset={handleReset} className="p-4">
          <Card variant="outlined" sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={2}>
                {/* Class Mode */}
                <Grid item xs={12} sm={3}>
                  <FormControl size="small" fullWidth required>
                    <InputLabel>Class Mode</InputLabel>
                    <Select
                      value={currentSchedule.mode}
                      label="Class Mode*"
                      onChange={(e) =>
                        handleScheduleChange(0, "mode", e.target.value)
                      }
                      startAdornment={
                        currentSchedule.mode === "online" ? (
                          <VideocamIcon
                            fontSize="small"
                            sx={{ ml: 0.5, mr: 0.5, color: "#1976d2" }}
                          />
                        ) : currentSchedule.mode === "offline" ? (
                          <LocationOnIcon
                            fontSize="small"
                            sx={{ ml: 0.5, mr: 0.5, color: "#2e7d32" }}
                          />
                        ) : null
                      }
                    >
                      <MenuItem value="online">Online</MenuItem>
                      <MenuItem value="offline">Offline (In-Person)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Demo Class Toggle */}
                <Grid item xs={12} sm={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={currentSchedule.isDemo}
                        onChange={(e) =>
                          handleScheduleChange(0, "isDemo", e.target.checked)
                        }
                        color="secondary"
                      />
                    }
                    label="Demo Class"
                  />
                </Grid>

                {/* Coach */}
                <Grid item xs={12} sm={3}>
                  <FormControl
                    size="small"
                    fullWidth
                    required
                    disabled={!currentSchedule.mode}
                  >
                    <InputLabel>Coach</InputLabel>
                    <Select
                      value={currentSchedule.coachName}
                      label="Coach*"
                      onChange={(e) =>
                        handleScheduleChange(0, "coachName", e.target.value)
                      }
                    >
                      {filteredCoaches.length ? (
                        filteredCoaches.map((coach) => (
                          <MenuItem key={coach.id} value={coach.name}>
                            {coach.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>
                          {currentSchedule.mode
                            ? "No coaches available for selected mode"
                            : "Select mode first"}
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Center */}
                <Grid item xs={12} sm={4}>
                  <FormControl
                    size="small"
                    fullWidth
                    required
                    disabled={!currentSchedule.mode}
                  >
                    <InputLabel>Center</InputLabel>
                    <Select
                      value={currentSchedule.centerName}
                      label="Center*"
                      onChange={(e) =>
                        handleScheduleChange(0, "centerName", e.target.value)
                      }
                    >
                      {centerData.length ? (
                        centerData
                          .filter((center) => {
                            // Filter centers that support the selected mode
                            if (!currentSchedule.mode) return true;
                            return (
                              center.centerType === currentSchedule.mode ||
                              (typeof center.centerType === "string" &&
                                center.centerType.includes(
                                  currentSchedule.mode
                                ))
                            );
                          })
                          .map((center) => (
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

                {/* Program */}
                <Grid item xs={12} sm={3}>
                  <FormControl
                    size="small"
                    fullWidth
                    required
                    disabled={!currentSchedule.mode}
                  >
                    <InputLabel>Program</InputLabel>
                    <Select
                      value={currentSchedule.program}
                      label="Program*"
                      onChange={(e) =>
                        handleScheduleChange(0, "program", e.target.value)
                      }
                    >
                      {filteredPrograms.length ? (
                        filteredPrograms.map((program) => (
                          <MenuItem key={program} value={program}>
                            {program}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>
                          {currentSchedule.mode
                            ? "No programs available"
                            : "Select mode first"}
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Level */}
                <Grid item xs={12} sm={3}>
                  <FormControl
                    size="small"
                    fullWidth
                    required
                    disabled={!currentSchedule.program}
                  >
                    <InputLabel>Level</InputLabel>
                    <Select
                      value={currentSchedule.level}
                      label="Level*"
                      onChange={(e) =>
                        handleScheduleChange(0, "level", e.target.value)
                      }
                    >
                      {currentSchedule.program &&
                      getLevelsForProgram(currentSchedule.program).length ? (
                        getLevelsForProgram(currentSchedule.program).map(
                          (level) => (
                            <MenuItem key={level} value={level}>
                              {level}
                            </MenuItem>
                          )
                        )
                      ) : (
                        <MenuItem disabled>
                          {currentSchedule.program
                            ? "No levels available"
                            : "Select program first"}
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Day */}
                <Grid item xs={12} sm={2}>
                  <FormControl
                    size="small"
                    fullWidth
                    required
                    disabled={!currentSchedule.mode}
                  >
                    <InputLabel>Day</InputLabel>
                    <Select
                      value={currentSchedule.day}
                      label="Day*"
                      onChange={(e) =>
                        handleScheduleChange(0, "day", e.target.value)
                      }
                    >
                      {filteredDays.length ? (
                        filteredDays.map((day) => (
                          <MenuItem key={day} value={day}>
                            {day}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>
                          {currentSchedule.mode
                            ? "No days available"
                            : "Select mode first"}
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Date */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Date"
                    value={currentSchedule.date || ""}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                </Grid>

                {/* Max Kids */}
                <Grid item xs={12} sm={3}>
                  <TextField
                    type="number"
                    label="Maximum Number of Kids"
                    value={currentSchedule.maxKids || ""}
                    onChange={(e) =>
                      handleScheduleChange(0, "maxKids", e.target.value)
                    }
                    inputProps={{ min: 1 }}
                    size="small"
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#642b8f",
                "&:hover": { backgroundColor: "#53197a" },
              }}
            >
              Submit Schedule
            </Button>
            <Button type="reset" variant="outlined" color="error">
              Reset
            </Button>
          </Box>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditClassSchedule;
