import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchCoachData,
  saveAvailabletime,
} from "../../api/service/employee/serviceDeliveryService";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const customColors = {
  primary: "#642B8F",
  secondary: "#F8A213",
  accent: "#AA88BE",
  highlight: "#F0BA6F",
  background: "#EFE8F0",
};

const programs = [
  { name: "Chess", levels: ["Beginner", "Intermediate", "Advanced"] },
  { name: "Rubiks Cube", levels: ["Beginner", "Intermediate", "Advanced"] },
  { name: "Math", levels: ["Beginner", "Intermediate", "Advanced"] },
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CoachAvailabilityForm = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const [coaches, setCoaches] = useState([]);
  const [availabilities, setAvailabilities] = useState([
    {
      coachName: "",
      day: "",
      program: "",

      fromTime: "",
      toTime: "",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // Fetch coaches when component mounts
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await fetchCoachData();
        if (response.status !== 200) {
          throw new Error("Failed to fetch coaches");
        }

        // Map data correctly
        const formattedCoaches = response.data.coachData.map((coach) => ({
          id: coach._id,
          name: coach.firstName,
        }));

        setCoaches(formattedCoaches);
      } catch (error) {
        console.error("Error fetching coaches:", error);
        alert("Could not load coaches. Please try again later.");
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
    setAvailabilities(newAvailabilities);
  };

  const addAvailability = () => {
    setAvailabilities([
      ...availabilities,
      {
        coachName: "",
        day: "",
        program: "",

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
      // Console log the entire availabilities array
      console.log("Submitted Availabilities:", availabilities);
      const response = await saveAvailabletime(availabilities);
      console.log(response);
      if (response.status === 200) {
        toast.success(response.data.message);

        navigate("/coachAvailabilityTable");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Could not submit availability");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAvailabilities([
      {
        coachName: "",
        day: "",
        program: "",

        fromTime: "",
        toTime: "",
      },
    ]);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Coach Availability Form</h2>
          <p className="text-sm opacity-90">
            Please select your available days, programs, and time slots
          </p>
        </div>

        <form className="p-8" onSubmit={handleSubmit} onReset={handleReset}>
          {availabilities.map((availability, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              sx={{ mb: 2, alignItems: "center" }}
            >
              <Grid item xs={12} sm={5}>
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

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Day</InputLabel>
                  <Select
                    value={availability.day}
                    onChange={(e) => handleChange(index, "day", e.target.value)}
                    label="Day"
                  >
                    {days.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Program</InputLabel>
                  <Select
                    value={availability.program}
                    onChange={(e) =>
                      handleChange(index, "program", e.target.value)
                    }
                    label="Program"
                  >
                    {programs.map((prog) => (
                      <MenuItem key={prog.name} value={prog.name}>
                        {prog.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="From Time"
                  type="time"
                  value={availability.fromTime}
                  onChange={(e) =>
                    handleChange(index, "fromTime", e.target.value)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="To Time"
                  type="time"
                  value={availability.toTime}
                  onChange={(e) =>
                    handleChange(index, "toTime", e.target.value)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                />
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
