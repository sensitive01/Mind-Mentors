import { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { saveAvailableDays } from "../../api/service/employee/coachService";

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

const timeSlots = [
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
];

const CoachAvailabilityForm = () => {
  const empId = localStorage.getItem("empId");
  const [availabilities, setAvailabilities] = useState([
    {
      program: "",
      levels: [],
      days: [],
      times: [],
    },
  ]);

  const [openSubmissionDialog, setOpenSubmissionDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleProgramChange = (index, programName) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[index] = {
      ...newAvailabilities[index],
      program: programName,
      levels: [], // Reset levels when program changes
    };
    setAvailabilities(newAvailabilities);
  };

  const handleMultiSelectChange = (index, field, event) => {
    const {
      target: { value },
    } = event;
    const newAvailabilities = [...availabilities];
    newAvailabilities[index] = {
      ...newAvailabilities[index],
      [field]: typeof value === "string" ? value.split(",") : value,
    };
    setAvailabilities(newAvailabilities);
  };

  const addAvailability = () => {
    setAvailabilities([
      ...availabilities,
      {
        program: "",
        levels: [],
        days: [],
        times: [],
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

    const isValid = availabilities.every(
      (avail) =>
        avail.program &&
        avail.levels.length > 0 &&
        avail.days.length > 0 &&
        avail.times.length > 0
    );

    if (!isValid) {
      alert("Please fill in all fields for each availability");
      setLoading(false);
      return;
    }
    console.log(availabilities);
    const response = await saveAvailableDays(empId, availabilities);
    console.log(response);

    // setTimeout(() => {
    //   setOpenSubmissionDialog(true);
    //   setLoading(false);
    // }, 1000);
  };

  const handleReset = () => {
    setAvailabilities([
      {
        program: "",
        levels: [],
        days: [],
        times: [],
      },
    ]);
  };

  return (
    <>
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Coach Availability Form</h2>
            <p className="text-sm opacity-90">
              Please select your available programs, levels, days and times
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
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Program</InputLabel>
                    <Select
                      value={availability.program}
                      onChange={(e) =>
                        handleProgramChange(index, e.target.value)
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

                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Levels</InputLabel>
                    <Select
                      multiple
                      value={availability.levels}
                      onChange={(e) =>
                        handleMultiSelectChange(index, "levels", e)
                      }
                      label="Levels"
                      renderValue={(selected) => selected.join(", ")}
                      disabled={!availability.program}
                    >
                      {availability.program &&
                        programs
                          .find((p) => p.name === availability.program)
                          ?.levels.map((level) => (
                            <MenuItem key={level} value={level}>
                              <Checkbox
                                checked={
                                  availability.levels.indexOf(level) > -1
                                }
                              />
                              <ListItemText primary={level} />
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Days</InputLabel>
                    <Select
                      multiple
                      value={availability.days}
                      onChange={(e) =>
                        handleMultiSelectChange(index, "days", e)
                      }
                      label="Days"
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

                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Times</InputLabel>
                    <Select
                      multiple
                      value={availability.times}
                      onChange={(e) =>
                        handleMultiSelectChange(index, "times", e)
                      }
                      label="Times"
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {timeSlots.map((time) => (
                        <MenuItem key={time} value={time}>
                          <Checkbox
                            checked={availability.times.indexOf(time) > -1}
                          />
                          <ListItemText primary={time} />
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
      </div>

      <Dialog
        open={openSubmissionDialog}
        onClose={() => setOpenSubmissionDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ backgroundColor: customColors.primary, color: "white" }}
        >
          Submitted Availability Details
        </DialogTitle>
        <DialogContent>
          {availabilities.map((availability, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <p>
                <strong>Availability {index + 1}:</strong>
              </p>
              <p>
                <strong>Program:</strong> {availability.program}
              </p>
              <p>
                <strong>Levels:</strong> {availability.levels.join(", ")}
              </p>
              <p>
                <strong>Days:</strong> {availability.days.join(", ")}
              </p>
              <p>
                <strong>Times:</strong> {availability.times.join(", ")}
              </p>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenSubmissionDialog(false)}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CoachAvailabilityForm;
