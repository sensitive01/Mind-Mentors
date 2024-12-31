import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FileUpload from "../../../components/uploader/FileUpload";
import {
  createChat,
  getAllEmployeesByName,
} from "../../../api/service/employee/EmployeeService";

const TaskModule = () => {
  const [users, setUsers] = useState([]); // Store user data for the dropdown
  const [formData, setFormData] = useState({
    selectedUser: "", // Selected user ID
    requestDetails: "", // Request text
    proof: "", // Uploaded file URL
  });
  const [loading, setLoading] = useState(false);

  const empId = localStorage.getItem("empId"); // Retrieve empId from local storage

  // Fetch users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getAllEmployeesByName(); // Pass a search term if needed
        setUsers(response || []); // Assuming response contains data
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    loadUsers();
  }, []);

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle file upload
  const handleFileUpload = (url) => {
    setFormData({ ...formData, proof: url });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      senderId: empId, // Sender's empId
      receiverId: formData.selectedUser, // Selected user ID
      message: formData.requestDetails, // Request details
      attachment: formData.proof, // Uploaded file URL
      category: "System Admin Support", // Static category for now
      status: "Pending", // Default status
    };
    console.log("Selected User ID:", formData.selectedUser);

    try {
      const response = await createChat(payload); // Send the payload to the backend
      alert("Query submitted successfully!");
      setFormData({
        selectedUser: "",
        requestDetails: "",
        proof: "",
      }); // Reset the form
    } catch (error) {
      console.error("Error submitting query:", error);
      alert("Failed to submit query. Please try again.");
    } finally {
      setLoading(false);
    }
    console.log("Selected User ID:", formData.selectedUser);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">System Admin Support</h2>
            <p className="text-sm opacity-90">
              Please fill in the required information below
            </p>
          </div>
          <Button variant="contained" color="#642b8f" component={Link} to="#">
            View Support
          </Button>
        </div>

        <form className="p-8" onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Assigned To */}
            <div className="flex gap-4 mb-4">
              <select
                className="w-1/2 p-3 rounded-lg border-2 border-gray-300 focus:border-[#642b8f] focus:outline-none bg-white"
                value={formData.selectedUser || ""}
                onChange={(e) =>
                  handleInputChange("selectedUser", e.target.value)
                }
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Request Textarea */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#642b8f]">
                Request Details
              </label>
              <textarea
                rows={4}
                value={formData.requestDetails}
                onChange={(e) =>
                  handleInputChange("requestDetails", e.target.value)
                }
                className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors resize-none"
                placeholder="Enter your request details here..."
              />
            </div>

            {/* Attachment Upload */}
            <Grid item xs={12} sm={4}>
              <FileUpload
                fieldName="Attachments As Proof"
                name="attachment"
                onFileUpload={handleFileUpload}
              />
            </Grid>
          </div>

          {/* Form Buttons */}
          <div className="flex justify-center gap-6 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? "Submitting..." : "Submit Query"}
            </button>
            <button
              type="reset"
              className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
              onClick={() =>
                setFormData({ selectedUser: "", requestDetails: "", proof: "" })
              }
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModule;
