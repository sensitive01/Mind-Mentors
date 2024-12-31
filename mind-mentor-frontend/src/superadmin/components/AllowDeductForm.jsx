import { Button, Divider, MenuItem, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AllowanceDeductionForm = () => {
  const [entries, setEntries] = useState([
    { id: 1, name: "", allowance: "", deduction: "", amount: "" },
  ]);
  const allowanceTypes = ["HRA", "Travel", "Medical", "Other"];
  const deductionTypes = ["Tax", "Loan", "Other"];
  const [loading, setLoading] = useState(false);

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        id: entries.length + 1,
        name: "",
        allowance: "",
        deduction: "",
        amount: "",
      },
    ]);
  };

  const removeEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleEntryChange = (id, field, value) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    setEntries(updatedEntries);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (let entry of entries) {
        // Process non-empty entries
        if (entry.name && entry.amount) {
          const entryData = {
            name: entry.name,
            allowance: entry.allowance,
            deduction: entry.deduction,
            amount: entry.amount,
          };

          // Placeholder for save logic
          // await saveEntry(entryData);
        }
      }

      setEntries([
        { id: 1, name: "", allowance: "", deduction: "", amount: "" },
      ]);
      alert("Entries submitted successfully!");
    } catch (error) {
      alert("Error while submitting entries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Employee Name", width: 200 },
    { field: "allowance", headerName: "Allowance Type", width: 150 },
    { field: "deduction", headerName: "Deduction Type", width: 150 },
    { field: "amount", headerName: "Amount", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <button
          type="button"
          onClick={() => removeEntry(params.row.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash className="h-5 w-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Allowance and Deduction Form
            </h2>
            <p className="text-sm opacity-90">
              Fill in the details for employee allowances and deductions
            </p>
          </div>
          <Button
            variant="contained"
            color="#642b8f"
            component={Link}
            to="/entries"
          >
            View Entries
          </Button>
        </div>

        <form className="p-8" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
              Entry Details
            </h3>
            {entries.map((entry, index) => (
              <div key={entry.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#642b8f]">
                    Entry {index + 1}
                  </label>
                  {entries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEntry(entry.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    label="Employee Name"
                    variant="outlined"
                    value={entry.name}
                    onChange={(e) =>
                      handleEntryChange(entry.id, "name", e.target.value)
                    }
                    fullWidth
                  />
                  <TextField
                    select
                    label="Allowance Type"
                    value={entry.allowance}
                    onChange={(e) =>
                      handleEntryChange(entry.id, "allowance", e.target.value)
                    }
                    fullWidth
                  >
                    {allowanceTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Deduction Type"
                    value={entry.deduction}
                    onChange={(e) =>
                      handleEntryChange(entry.id, "deduction", e.target.value)
                    }
                    fullWidth
                  >
                    {deductionTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Amount"
                    variant="outlined"
                    value={entry.amount}
                    onChange={(e) =>
                      handleEntryChange(entry.id, "amount", e.target.value)
                    }
                    fullWidth
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addEntry}
              className="text-[#642b8f] hover:text-[#aa88be] font-medium text-sm transition-colors"
            >
              + Add Entry
            </button>
          </div>

          <Divider className="my-6" />

          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={entries}
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
              {loading ? "Submitting..." : "Submit Entries"}
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

export default AllowanceDeductionForm;
