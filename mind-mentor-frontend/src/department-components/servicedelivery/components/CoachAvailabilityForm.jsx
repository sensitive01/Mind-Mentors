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

// Generate time slots with 15-minute intervals
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
      days: [], // Changed from day to days for multiple selection
      program: "",
      level: "", // Added level field
      fromTime: "",
      toTime: "",
    },
  ]);

  const [loading, setLoading] = useState(false);

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

  const handleChange = (index, field, value) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[index] = {
      ...newAvailabilities[index],
      [field]: value,
    };

    // Reset level when program changes
    if (field === "program") {
      newAvailabilities[index].level = "";
    }

    setAvailabilities(newAvailabilities);
  };

  const addAvailability = () => {
    setAvailabilities([
      ...availabilities,
      {
        coachName: "",
        days: [], // Initialize with empty array for multiple days
        program: "",
        level: "",
        fromTime: "",
        toTime: "",
      },
    ]);
  };

  const removeAvailability = (indexToRemove) => {
    setAvailabilities(
      availabilities.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Transform the data to match your API requirements
      const formattedAvailabilities = availabilities.flatMap((availability) =>
        availability.days.map((day) => ({
          coachName: availability.coachName,
          day: day,
          program: availability.program,
          level: availability.level, // Include level in the submitted data
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
  };

  // Find the selected program's levels
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
              <button className="px-6 py-2 bg-white text-[#642b8f] font-semibold rounded hover:bg-[#f3e8fc] transition duration-300" onClick={()=>navigate("/super-admin/department/coachAvailabilityTable")}>
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
                        {time}
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
                        {time}
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
              disabled={loading}
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
