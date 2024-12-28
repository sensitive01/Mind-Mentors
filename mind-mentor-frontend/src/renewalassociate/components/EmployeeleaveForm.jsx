import React, { useState } from "react";
import axios from "axios";
import { Button, Grid, MenuItem, TextField } from "@mui/material";
import { Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { createLeave, updateLeave } from "../../api/service/employee/EmployeeService";
import FileUpload from "../../components/uploader/FileUpload";

const EmployeeLeaveForm = () => {
  const empId = localStorage.getItem("empId"); // Retrieve empId from local storage
  const [leaveData, setLeaveData] = useState({
    leaveStartDate: "",
    leaveEndDate: "",
    leaveType: "",
    notes: "",
    proof: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData({ ...leaveData, [name]: value });
  };
  const leaveTypes = [
    "Sick Leave",
    "Casual Leave",
    "Paid Leave",
    "Unpaid Leave",
  ];
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const leavePayload = {
        ...leaveData,
        empId, // Include empId from local storage
      };

      if (leaveData.id) {
        // If the leaveData includes an `id`, assume it's an update
        const updateResponse = await updateLeave(leavePayload);
        console.log("Leave updated successfully:", updateResponse.data);
      } else {
        // Otherwise, create a new leave entry
        const createResponse = await createLeave(leavePayload);
        console.log("Leave created successfully:", createResponse.data);
      }
    } catch (error) {
      console.error("Error processing leave request:", error);
    }
  };


  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Employee Leave Form</h2>
            <p className="text-sm opacity-90">
              Please fill in the details for your leave request
            </p>
          </div>
          <Button
            variant="contained"
            color="#642b8f"
            component={Link}
            to="/marketingLeaves"
          >
            View Leaves
          </Button>
        </div>
        <form className="p-8" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                select
                label="Leave Type"
                name="leaveType" // Add this line
                value={leaveData.leaveType}
                onChange={handleChange}
                fullWidth
              >
                {leaveTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                type="date"
                name="leaveStartDate"
                label="Leave Start Date"
                value={leaveData.leaveStartDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                type="date"
                label="Leave End Date"
                name="leaveEndDate"
                value={leaveData.leaveEndDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />

              <TextField
                type="textarea"
                name="notes"
                value={leaveData.notes}
                onChange={handleChange}
                fullWidth
              />
              <Grid item xs={12} sm={4}>
                <FileUpload
                  fieldName="Proof of Leave"
                  name="proof"
                  onFileUpload={(url) => {
                    setLeaveData({ ...leaveData, proof: url }); // Update the proof in state
                    console.log("File uploaded:", url); // Debug: check file URL
                  }}
                />

              </Grid>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-12">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? "Submitting..." : "Submit Leave Request"}
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
  );
};

export default EmployeeLeaveForm;

