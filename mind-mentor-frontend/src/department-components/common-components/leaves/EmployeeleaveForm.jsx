import { useState, useEffect } from "react";
import { Button, MenuItem, TextField } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createLeave,
  updateLeave,
  fetchLeaveById,
} from "../../../api/service/employee/EmployeeService";
import FileUpload from "../../../department-components/common-components/fileuploader/FileUploader";

const EmployeeLeaveForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("id",id)
  const empId = localStorage.getItem("empId");
  const department = localStorage.getItem("department");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const [leaveData, setLeaveData] = useState({
    leaveStartDate: "",
    leaveEndDate: "",
    leaveType: "",
    notes: "",
    proof: "",
  });


  useEffect(() => {
    const getLeaveData = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await fetchLeaveById(id);
          console.log( response.data.leavesData)
          if (response.status===200) {
            const { leaveStartDate, leaveEndDate, leaveType, notes, proof } =
              response.data.leavesData;
            setLeaveData({
              leaveStartDate: leaveStartDate.split("T")[0],
              leaveEndDate: leaveEndDate.split("T")[0],
              leaveType,
              notes: notes || "",
              proof: proof || "",
            });
          }
        } catch (error) {
          console.error("Error fetching leave data:", error);
        } finally {
          setLoading(false);
          setInitialLoad(false);
        }
      } else {
        setInitialLoad(false);
      }
    };

    getLeaveData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData((prev) => ({ ...prev, [name]: value }));
  };

  const leaveTypes = [
    "Sick Leave",
    "Casual Leave",
    "Paid Leave",
    "Unpaid Leave",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const leavePayload = {
        ...leaveData,
        empId,
      };

      if (id) {
        const updateResponse = await updateLeave(leavePayload, id );
        if (updateResponse.success) {
          navigate(`/${department}/department/leaves`);
        }
      } else {
        const createResponse = await createLeave(leavePayload);
        if (createResponse.success) {
          navigate(`/${department}/department/leaves`);
        }
      }
    } catch (error) {
      console.error("Error processing leave request:", error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-9xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {id ? "Edit Leave Request" : "Employee Leave Form"}
            </h2>
            <p className="text-sm opacity-90">
              {id
                ? "Update your leave request details"
                : "Please fill in the details for your leave request"}
            </p>
          </div>
          <Button
            variant="contained"
            style={{ backgroundColor: "#ffffff", color: "#642b8f" }}
            component={Link}
            to={`/${department}/department/leaves`}
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
                name="leaveType"
                value={leaveData.leaveType}
                onChange={handleChange}
                fullWidth
                required
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
                label="Notes"
                type="textarea"
                name="notes"
                value={leaveData.notes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
              />

              <FileUpload
                fieldName="Proof of Leave"
                name="proof"
                onFileUpload={(url) => {
                  setLeaveData((prev) => ({ ...prev, proof: url }));
                }}
                fullWidth
                existingFile={leaveData.proof}
              />
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-12">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : id
                ? "Update Leave Request"
                : "Submit Leave Request"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/${department}-department/leaves`)}
              className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLeaveForm;
