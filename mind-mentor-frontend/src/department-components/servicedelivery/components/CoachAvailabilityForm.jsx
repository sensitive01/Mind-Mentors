import { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  IconButton,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchCoachData,
  saveAvailabletime,
} from "../../../api/service/employee/serviceDeliveryService";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAllProgrameData } from "../../../api/service/employee/EmployeeService";

const customColors = {
  primary: "#642B8F",
  secondary: "#F8A213",
  accent: "#AA88BE",
  highlight: "#F0BA6F",
  background: "#EFE8F0",
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 15, 30, 45]) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      slots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return slots;
};

// Function to convert 24-hour time to 12-hour format
const convertTo12Hour = (time24) => {
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12.toString().padStart(2, "0")}:${minutes} ${ampm}`;
};

// Function to convert time to minutes for comparison
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Function to check if two time ranges overlap
const timeRangesOverlap = (start1, end1, start2, end2) => {
  const start1Minutes = timeToMinutes(start1);
  const end1Minutes = timeToMinutes(end1);
  const start2Minutes = timeToMinutes(start2);
  const end2Minutes = timeToMinutes(end2);

  return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
};

const timeSlots = generateTimeSlots();

const CoachAvailabilityForm = () => {
  const navigate = useNavigate();
  const department = localStorage.getItem("department");
  const empId = localStorage.getItem("empId");
  const [coaches, setCoaches] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [availabilities, setAvailabilities] = useState([
    {
      coachName: "",
      days: [],
      program: "",
      level: "",
      fromTime: "",
      toTime: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await getAllProgrameData();
        if (response.data && response.data.success) {
          setProgramData(response.data.programs);
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
        toast.error("Could not load program data. Please try again later.");
      }
    };
    fetchProgramData();
  }, []);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await fetchCoachData();
        if (response.status !== 200) {
          throw new Error("Failed to fetch coaches");
        }

        const formattedCoaches = response.data.coachData.map((coach) => ({
          id: coach._id,
          name: coach.firstName,
        }));

        setCoaches(formattedCoaches);
      } catch (error) {
        console.error("Error fetching coaches:", error);
        toast.error("Could not load coaches. Please try again later.");
      }
    };

    fetchCoaches();
  }, []);

  const checkForDuplicates = (updatedAvailabilities) => {
    const duplicates = [];

    for (let i = 0; i < updatedAvailabilities.length; i++) {
      const current = updatedAvailabilities[i];

      if (
        !current.coachName ||
        !current.program ||
        !current.level ||
        current.days.length === 0 ||
        !current.fromTime ||
        !current.toTime
      ) {
        continue;
      }

      for (let j = i + 1; j < updatedAvailabilities.length; j++) {
        const other = updatedAvailabilities[j];

        if (
          !other.coachName ||
          !other.program ||
          !other.level ||
          other.days.length === 0 ||
          !other.fromTime ||
          !other.toTime
        ) {
          continue;
        }

        const hasCommonDay = current.days.some((day) =>
          other.days.includes(day)
        );

        // Check if same coach on same day with overlapping time
        if (current.coachName === other.coachName && hasCommonDay) {
          // Check for time overlap
          const hasTimeOverlap = timeRangesOverlap(
            current.fromTime,
            current.toTime,
            other.fromTime,
            other.toTime
          );

          if (hasTimeOverlap) {
            const coachName =
              coaches.find((c) => c.id === current.coachName)?.name ||
              current.coachName;
            const commonDays = current.days.filter((day) =>
              other.days.includes(day)
            );

            // Different error messages based on whether it's same program/level or different
            const isSameProgramLevel =
              current.program === other.program &&
              current.level === other.level;

            let errorType, errorMessage;

            if (isSameProgramLevel) {
              errorType = "duplicate_schedule";
              errorMessage = `Duplicate schedule detected: ${coachName} is already scheduled for ${
                current.program
              } (${current.level}) on ${commonDays.join(
                ", "
              )} from ${convertTo12Hour(current.fromTime)} - ${convertTo12Hour(
                current.toTime
              )}. Please choose different days or times.`;
            } else {
              errorType = "time_conflict";
              errorMessage = `Time conflict detected: ${coachName} cannot teach multiple programs at the same time. On ${commonDays.join(
                ", "
              )}, there's a conflict between:
              • ${current.program} (${current.level}): ${convertTo12Hour(
                current.fromTime
              )} - ${convertTo12Hour(current.toTime)}
              • ${other.program} (${other.level}): ${convertTo12Hour(
                other.fromTime
              )} - ${convertTo12Hour(other.toTime)}
              A coach can only teach one program/level at a particular time on a particular day.`;
            }

            duplicates.push({
              coach: coachName,
              program1: current.program,
              level1: current.level,
              program2: other.program,
              level2: other.level,
              days: commonDays,
              time1: `${convertTo12Hour(current.fromTime)} - ${convertTo12Hour(
                current.toTime
              )}`,
              time2: `${convertTo12Hour(other.fromTime)} - ${convertTo12Hour(
                other.toTime
              )}`,
              indices: [i + 1, j + 1],
              errorType: errorType,
              message: errorMessage,
            });
          }
        }
      }
    }

    return duplicates;
  };

  const handleChange = (index, field, value) => {
    const newAvailabilities = [...availabilities];

    if (field === "coachName" && index > 0) {
      const firstCoach = availabilities[0].coachName;
      if (firstCoach && value !== firstCoach) {
        toast.error(
          `All availability entries must be for the same coach. Please select ${
            coaches.find((c) => c.id === firstCoach)?.name || "the same coach"
          }.`
        );
        return;
      }
    }

    if (field === "coachName" && index === 0) {
      newAvailabilities.forEach((availability, i) => {
        newAvailabilities[i].coachName = value;
      });
    } else {
      newAvailabilities[index] = {
        ...newAvailabilities[index],
        [field]: value,
      };
    }

    if (field === "program") {
      newAvailabilities[index].level = "";
    }

    setAvailabilities(newAvailabilities);

    setTimeout(() => {
      const duplicates = checkForDuplicates(newAvailabilities);
      if (duplicates.length > 0) {
        const duplicate = duplicates[0];

        setDuplicateAlert({
          show: true,
          message: duplicate.message,
        });
        toast.error(duplicate.message);
      } else {
        setDuplicateAlert({ show: false, message: "" });
      }
    }, 100);
  };

  const addAvailability = () => {
    const selectedCoach =
      availabilities.length > 0 && availabilities[0].coachName
        ? availabilities[0].coachName
        : "";

    setAvailabilities([
      ...availabilities,
      {
        coachName: selectedCoach,
        days: [],
        program: "",
        level: "",
        fromTime: "",
        toTime: "",
      },
    ]);
  };

  const removeAvailability = (indexToRemove) => {
    const newAvailabilities = availabilities.filter(
      (_, index) => index !== indexToRemove
    );
    setAvailabilities(newAvailabilities);

    setTimeout(() => {
      const duplicates = checkForDuplicates(newAvailabilities);
      if (duplicates.length === 0) {
        setDuplicateAlert({ show: false, message: "" });
      }
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const duplicates = checkForDuplicates(availabilities);
    if (duplicates.length > 0) {
      toast.error("Please resolve all time conflicts before submitting.");
      return;
    }

    setLoading(true);

    try {
      const formattedAvailabilities = availabilities.flatMap((availability) =>
        availability.days.map((day) => ({
          coachName: availability.coachName,
          day: day,
          program: availability.program,
          level: availability.level,
          fromTime: availability.fromTime,
          toTime: availability.toTime,
        }))
      );

      console.log("Submitted Availabilities:", formattedAvailabilities);
      const response = await saveAvailabletime(formattedAvailabilities);

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate(`/${department}/department/coachAvailabilityTable`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Could not submit availability");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAvailabilities([
      {
        coachName: "",
        days: [],
        program: "",
        level: "",
        fromTime: "",
        toTime: "",
      },
    ]);
    setDuplicateAlert({ show: false, message: "" });
  };

  const getLevelsForProgram = (programName) => {
    const program = programData.find((p) => p.programName === programName);
    return program ? program.programLevel : [];
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Coach Availability Form
              </h2>
              <p className="text-sm opacity-90">
                Please select your available days, programs, and time slots
              </p>
            </div>

            <div>
              <button
                className="px-6 py-2 bg-white text-[#642b8f] font-semibold rounded hover:bg-[#f3e8fc] transition duration-300"
                onClick={() =>
                  navigate("/super-admin/department/coachAvailabilityTable")
                }
              >
                See Available Slots
              </button>
            </div>
          </div>
        </div>

        <form className="p-8" onSubmit={handleSubmit} onReset={handleReset}>
          {availabilities.map((availability, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              sx={{ mb: 2, alignItems: "center" }}
            >
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Coach</InputLabel>
                  <Select
                    value={availability.coachName}
                    onChange={(e) =>
                      handleChange(index, "coachName", e.target.value)
                    }
                    label="Coach"
                    disabled={index > 0}
                  >
                    {coaches.map((coach) => (
                      <MenuItem key={coach.id} value={coach.id}>
                        {coach.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={2}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Program</InputLabel>
                  <Select
                    value={availability.program}
                    onChange={(e) =>
                      handleChange(index, "program", e.target.value)
                    }
                    label="Program"
                  >
                    {programData.map((prog) => (
                      <MenuItem key={prog._id} value={prog.programName}>
                        {prog.programName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={2}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={availability.level}
                    onChange={(e) =>
                      handleChange(index, "level", e.target.value)
                    }
                    label="Level"
                    disabled={!availability.program}
                  >
                    {getLevelsForProgram(availability.program).map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Days</InputLabel>
                  <Select
                    multiple
                    value={availability.days}
                    onChange={(e) =>
                      handleChange(index, "days", e.target.value)
                    }
                    input={<OutlinedInput label="Days" />}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {days.map((day) => (
                      <MenuItem key={day} value={day}>
                        <Checkbox
                          checked={availability.days.indexOf(day) > -1}
                        />
                        <ListItemText primary={day} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={1.5}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>From Time</InputLabel>
                  <Select
                    value={availability.fromTime}
                    onChange={(e) =>
                      handleChange(index, "fromTime", e.target.value)
                    }
                    label="From Time"
                  >
                    {timeSlots.map((time) => (
                      <MenuItem
                        key={time}
                        value={time}
                        disabled={
                          availability.toTime && time >= availability.toTime
                        }
                      >
                        {convertTo12Hour(time)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={1.5}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>To Time</InputLabel>
                  <Select
                    value={availability.toTime}
                    onChange={(e) =>
                      handleChange(index, "toTime", e.target.value)
                    }
                    label="To Time"
                  >
                    {timeSlots.map((time) => (
                      <MenuItem
                        key={time}
                        value={time}
                        disabled={
                          availability.fromTime && time <= availability.fromTime
                        }
                      >
                        {convertTo12Hour(time)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {availabilities.length > 1 && (
                <Grid item xs={12} sm={1}>
                  <IconButton
                    onClick={() => removeAvailability(index)}
                    sx={{ color: customColors.secondary }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          ))}

          <Button
            onClick={addAvailability}
            color="secondary"
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Add Availability
          </Button>

          <div className="flex justify-center gap-6 mt-12">
            <button
              type="submit"
              disabled={loading || duplicateAlert.show}
              style={{
                opacity: duplicateAlert.show ? 0.6 : 1,
                cursor: duplicateAlert.show ? "not-allowed" : "pointer",
              }}
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? "Submitting..." : "Submit Available Slot"}
            </button>
            <button
              type="reset"
              className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        style={{ marginTop: "60px" }}
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

export default CoachAvailabilityForm;
