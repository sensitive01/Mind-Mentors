import { Button, MenuItem, Divider, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const EmployeeHolidayForm = () => {
  const [holidayDetails, setHolidayDetails] = useState([
    {
      id: 1,
      holidayName: "",
      startDate: "",
      endDate: "",
      description: "",
      status: "",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const addHolidayDetail = () => {
    setHolidayDetails([
      ...holidayDetails,
      {
        id: holidayDetails.length + 1,
        holidayName: "",
        startDate: "",
        endDate: "",
        description: "",
        status: "",
      },
    ]);
  };

  const removeHolidayDetail = (id) => {
    setHolidayDetails(holidayDetails.filter((holiday) => holiday.id !== id));
  };

  const handleHolidayChange = (id, field, value) => {
    const updatedHolidayDetails = holidayDetails.map((holiday) =>
      holiday.id === id ? { ...holiday, [field]: value } : holiday
    );
    setHolidayDetails(updatedHolidayDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (let holiday of holidayDetails) {
        // Only process non-empty holiday details
        if (
          holiday.holidayName &&
          holiday.startDate &&
          holiday.endDate &&
          holiday.description &&
          holiday.status
        ) {
          const holidayData = {
            holidayName: holiday.holidayName,
            startDate: holiday.startDate,
            endDate: holiday.endDate,
            description: holiday.description,
            status: holiday.status,
          };

          // Submit holiday data (mock logic)
          console.log(holidayData);
        }
      }

      // Reset holiday details after submission
      setHolidayDetails([
        {
          id: 1,
          holidayName: "",
          startDate: "",
          endDate: "",
          description: "",
          status: "",
        },
      ]);
      alert("Holiday details submitted successfully!");
    } catch (error) {
      alert("Error while submitting holiday details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "holidayName", headerName: "Holiday Name", width: 200 },
    { field: "startDate", headerName: "Start Date", width: 180 },
    { field: "endDate", headerName: "End Date", width: 180 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <button
          type="button"
          onClick={() => removeHolidayDetail(params.row.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash className="h-5 w-5" />
        </button>
      ),
    },
  ];
  const holidayStatuses = ["Active", "Inactive", "Pending"]; // Options for the status field

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Holiday Form</h2>
            <p className="text-sm opacity-90">
              Please fill in the details for holidays
            </p>
          </div>
          <Button
            variant="contained"
            color="#642b8f"
            component={Link}
            to="/holiday"
          >
            View Holidays
          </Button>
        </div>

        <form className="p-8" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
              Holiday Details
            </h3>
            {holidayDetails.map((holiday, index) => (
              <div key={holiday.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#642b8f]">
                    Holiday {index + 1}
                  </label>
                  {holidayDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHolidayDetail(holiday.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    label="Holiday Name"
                    variant="outlined"
                    value={holiday.holidayName}
                    onChange={(e) =>
                      handleHolidayChange(
                        holiday.id,
                        "holidayName",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                  <TextField
                    type="date"
                    label="Start Date"
                    variant="outlined"
                    value={holiday.startDate}
                    onChange={(e) =>
                      handleHolidayChange(
                        holiday.id,
                        "startDate",
                        e.target.value
                      )
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    type="date"
                    label="End Date"
                    variant="outlined"
                    value={holiday.endDate}
                    onChange={(e) =>
                      handleHolidayChange(holiday.id, "endDate", e.target.value)
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    select
                    label="Status"
                    value={holiday.status}
                    onChange={(e) =>
                      handleHolidayChange(holiday.id, "status", e.target.value)
                    }
                    fullWidth
                  >
                    {holidayStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <TextField
                    label="Description"
                    variant="outlined"
                    value={holiday.description}
                    onChange={(e) =>
                      handleHolidayChange(
                        holiday.id,
                        "description",
                        e.target.value
                      )
                    }
                    multiline
                    rows={4}
                    fullWidth
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addHolidayDetail}
              className="text-[#642b8f] hover:text-[#aa88be] font-medium text-sm transition-colors"
            >
              + Add Holiday
            </button>
          </div>

          <Divider className="my-6" />

          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={holidayDetails}
              columns={columns}
              pageSize={5}
              disableSelectionOnClick
            />
          </div>

          <div className="flex justify-center gap-6 mt-12">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? "Submitting..." : "Submit Holiday Request"}
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

export default EmployeeHolidayForm;
