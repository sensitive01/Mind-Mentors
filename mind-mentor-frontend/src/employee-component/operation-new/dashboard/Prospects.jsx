/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  Grid,
  Paper,
  Slide,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { alpha } from "@mui/material/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import columns from "./Columns";

import {
  
  
  updateEnquiryStatus,
  addNotes,
  fetchProspectsEnquiries
} from "../../../api/service/employee/EmployeeService";

const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f",

=======
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import columns from "./Columns"; // Import columns from the separate file
import data from "./Enquiry";
import {
  fetchAllEnquiries,
  fetchProspectsEnquiries,
  updateEnquiryStatus,
} from "../../../api/service/employee/EmployeeService"; // Adjust the import path as necessary

// Updated modern color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f", // Indigo
      // main: '#f8a213', // Indigo
>>>>>>> Aadis_code
      light: "#818CF8",
      dark: "#4F46E5",
    },
    secondary: {
<<<<<<< HEAD
      main: "#EC4899",
=======
      main: "#EC4899", // Pink
>>>>>>> Aadis_code
      light: "#F472B6",
      dark: "#DB2777",
    },
    warm: {
<<<<<<< HEAD
      main: "#F59E0B",
=======
      main: "#F59E0B", // Amber
>>>>>>> Aadis_code
      light: "#FCD34D",
      dark: "#D97706",
    },
    cold: {
<<<<<<< HEAD
      main: "#3B82F6",
=======
      main: "#3B82F6", // Blue
>>>>>>> Aadis_code
      light: "#60A5FA",
      dark: "#2563EB",
    },
    background: {
      default: "#F1F5F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "none",
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
        },
      },
    },
  },
});
const DetailView = ({ data }) => (
  <Grid container spacing={3} sx={{ p: 2 }}>
    {Object.entries(data).map(([key, value]) => {
<<<<<<< HEAD
      if (key !== "id") {
        const formattedKey = key.replace(/([A-Z])/g, " $1").toUpperCase();

=======
      // Avoid displaying 'id' key in the view
      if (key !== "id") {
        // Format the key to be more readable (e.g., 'firstName' -> 'First Name')
        const formattedKey = key.replace(/([A-Z])/g, " $1").toUpperCase();

        // Handling 'scheduleDemo' separately to show its 'status'
>>>>>>> Aadis_code
        if (key === "scheduleDemo") {
          return (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  height: "100%",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block" }}
                >
                  SCHEDULED DEMO
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {value?.status || "N/A"}{" "}
<<<<<<< HEAD
=======
                  {/* Display status or "N/A" if missing */}
>>>>>>> Aadis_code
                </Typography>
              </Box>
            </Grid>
          );
        }

<<<<<<< HEAD
=======
        // Handling 'logs' separately to display individual log actions with index
>>>>>>> Aadis_code
        if (key === "logs" && Array.isArray(value)) {
          return (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  height: "100%",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, display: "block" }}
                >
                  LOGS
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {value.length > 0
                    ? value.map((log, index) => (
                        <div key={log._id}>
                          <strong>
                            {index + 1}. {log.action}
                          </strong>{" "}
<<<<<<< HEAD
=======
                          {/* Display index starting from 1 */}
>>>>>>> Aadis_code
                          <Typography variant="caption" color="text.secondary">
                            {new Date(log.createdAt).toLocaleString()}
                          </Typography>
                        </div>
                      ))
                    : "No logs available"}
                </Typography>
              </Box>
            </Grid>
          );
        }

<<<<<<< HEAD
=======
        // Format and display other fields
>>>>>>> Aadis_code
        return (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                height: "100%",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: "block" }}
              >
                {formattedKey}
              </Typography>
              <Typography variant="body1" color="text.primary">
                {Array.isArray(value)
                  ? value
                      .map((prog) => `${prog.program} (${prog.level})`)
                      .join(", ")
                  : value && typeof value === "object" && value !== null
<<<<<<< HEAD
                  ? "N/A"
                  : value || "N/A"}{" "}
=======
                  ? "N/A" // Handle objects or complex structures if required
                  : value || "N/A"}{" "}
                {/* Display N/A for null, undefined, or empty values */}
>>>>>>> Aadis_code
              </Typography>
            </Box>
          </Grid>
        );
      }
      return null;
    })}
  </Grid>
);
<<<<<<< HEAD

const Enquiries = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        const data = await  fetchProspectsEnquiries();
        console.log(data);
        setRows(data);
      } catch (err) {
        console.log("Failed to fetch Enquiries. Please try again later.", err);
=======
const Enquiries = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        const data = await fetchProspectsEnquiries();
        console.log(data);
        setRows(data);
      } catch (err) {
        setError("Failed to fetch Enquiries. Please try again later.");
>>>>>>> Aadis_code
      } finally {
        setLoading(false);
      }
    };

    loadLeaves();
  }, []);
<<<<<<< HEAD
  const [noteDialog, enquiryStatus] = useState({
    open: false,
    rowData: null,
    noteText: "",
    disposition: "",
    enquiryStatus: "",
=======
  const [noteDialog, setNoteDialog] = useState({
    open: false,
    rowData: null,
    noteText: "",
>>>>>>> Aadis_code
  });
  const [viewDialog, setViewDialog] = useState({
    open: false,
    rowData: null,
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
<<<<<<< HEAD
=======
  const [editRowsModel, setEditRowsModel] = useState({});
>>>>>>> Aadis_code

  const handleStatusToggle = async (id) => {
    const rowToUpdate = rows.find((row) => row._id === id);
    const newStatus = rowToUpdate.enquiryType === "warm" ? "cold" : "warm";

    try {
<<<<<<< HEAD
      const response = await updateEnquiryStatus(id, newStatus, empId);

      if (response.success) {
=======
      // Call the API to update the status
      const response = await updateEnquiryStatus(id, newStatus);

      // Check if the response indicates success
      if (response.success) {
        // Update the state only if the API call was successful
>>>>>>> Aadis_code
        setRows(
          rows.map((row) => {
            if (row._id === id) {
              return {
                ...row,
                enquiryType: newStatus,
                stageTag: newStatus,
              };
            }
            return row;
          })
        );
      } else {
        console.error("Failed to update status:", response.message);
      }
    } catch (error) {
      console.error("Error updating enquiry status:", error);
    }
  };
<<<<<<< HEAD
  const handleNoteSave = async () => {
    if (noteDialog.rowData) {
      const updatedNotes = noteDialog.noteText;
      const id = noteDialog.rowData._id;
      let updatedEnquiryStatus = noteDialog.enquiryStatus;
      let updatedDisposition = noteDialog.disposition;

      console.log("Updated Notes:", updatedNotes);
      console.log("Updated Enquiry Status:", updatedEnquiryStatus);
      console.log("Updated Disposition:", updatedDisposition);

      const validEnquiryStatus = [
        "Pending",
        "Qualified Lead",
        "Unqualified Lead",
      ];
      const validDisposition = ["RnR", "Call Back", "None"];

      if (!validEnquiryStatus.includes(updatedEnquiryStatus)) {
        updatedEnquiryStatus = "Pending";
      }
      if (!validDisposition.includes(updatedDisposition)) {
        updatedDisposition = "None";
      }

      setRows((prevRows) =>
        prevRows.map((row) =>
          row._id === id
            ? {
                ...row,
                notes: updatedNotes,
                enquiryStatus: updatedEnquiryStatus,
                disposition: updatedDisposition,
              }
            : row
        )
      );

      try {
        await addNotes(id, empId, {
          notes: updatedNotes,
          enquiryStatus: updatedEnquiryStatus,
          disposition: updatedDisposition,
        });
        console.log("Notes saved successfully");
      } catch (error) {
        console.error("Error saving notes:", error);
      }

      console.log("setting rows", rows);
    }
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };
  const handleProcessRowUpdate = (newRow) => {
=======

  const handleNoteSave = () => {
    if (noteDialog.rowData) {
      setRows(
        rows.map((row) =>
          row._id === noteDialog.rowData._id
            ? { ...row, notes: noteDialog.noteText }
            : row
        )
      );
      setNoteDialog({ open: false, rowData: null, noteText: "" });
    }
  };
  const handleRowEditStop = (params, event) => {
    // Prevent default row edit stop behavior
    event.defaultMuiPrevented = true;
  };
  const handleProcessRowUpdate = (newRow, oldRow) => {
    // Update the rows state with the edited row
>>>>>>> Aadis_code
    const updatedRows = rows.map((row) =>
      row.id === newRow.id ? newRow : row
    );
    setRows(updatedRows);
    return newRow;
  };
  const handleProcessRowUpdateError = (error) => {
    console.error("Row update error:", error);
  };
<<<<<<< HEAD

  const handleMoveProspects = async (id) => {
    console.log(id);
    const respose = await moveToProspects(id, empId);
    console.log(respose);
  };

  const handleShowLogs = (id) => {
    console.log("Handle logs ", id);
    navigate(`/showCompleteLogs/${id}`);
  };

=======
>>>>>>> Aadis_code
  return (
    <ThemeProvider theme={theme}>
      <Fade in={true}>
        <Box sx={{ width: "100%", height: "100%", p: 3, ml: "auto" }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: "background.paper",
              borderRadius: 3,
              height: 650,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box
              mb={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "text.primary", fontWeight: 600, mb: 3 }}
              >
                Enquiries
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/employee-operation-enquiry-form"
              >
                + Enquire Details
              </Button>
            </Box>
            <DataGrid
              rows={rows}
              columns={columns(
                theme,
                handleStatusToggle,
                setViewDialog,
<<<<<<< HEAD
                enquiryStatus,
                handleMoveProspects,
                handleShowLogs
=======
                setNoteDialog
>>>>>>> Aadis_code
              )}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
              disableRowSelectionOnClick
              editMode="row"
<<<<<<< HEAD
              getRowId={(row) => row._id}
              onRowDoubleClick={(params) => {
                setViewDialog({ open: true, rowData: params.row });

=======
              getRowId={(row) => row._id} // Specify the unique id property
              onRowDoubleClick={(params) => {
                setViewDialog({ open: true, rowData: params.row });
                // Enable editing on double click
>>>>>>> Aadis_code
                params.row.isEditable = true;
              }}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={handleProcessRowUpdate}
              onProcessRowUpdateError={handleProcessRowUpdateError}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                height: 500,
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#642b8f",
                  color: "white",
                  fontWeight: 600,
                },
                "& .MuiDataGrid-footerContainer": {
                  display: "flex",
                  justifyContent: "flex-end",
                },
                "& .MuiDataGrid-root": {
                  overflow: "hidden",
                },
                "& .MuiCheckbox-root.Mui-checked": {
                  color: "#FFFFFF",
                },
                "& .MuiDataGrid-columnHeader .MuiCheckbox-root": {
                  color: "#FFFFFF",
                },
              }}
            />
<<<<<<< HEAD

=======
            {/* View Dialog */}
>>>>>>> Aadis_code
            <Dialog
              open={viewDialog.open}
              onClose={() => setViewDialog({ open: false, rowData: null })}
              maxWidth="md"
              fullWidth
              TransitionComponent={Slide}
              TransitionProps={{ direction: "up" }}
            >
              <DialogTitle
                sx={{
                  background: "linear-gradient(#642b8f, #aa88be)",
                  color: "#ffffff",
                  fontWeight: 600,
                }}
              >
                Student Details
              </DialogTitle>
              <Divider />
              <DialogContent>
                <DetailView data={viewDialog.rowData || {}} />
              </DialogContent>
              <Divider sx={{ borderColor: "#aa88be" }} />
              <DialogActions sx={{ p: 2.5 }}>
                <Button
                  class="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
                  onClick={() => setViewDialog({ open: false, rowData: null })}
                  variant="outlined"
                  sx={{
                    color: "#f8a213",
                    borderColor: "#f8a213",
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            {/* Notes Dialog */}
            <Dialog
              open={noteDialog.open}
              onClose={() =>
<<<<<<< HEAD
                enquiryStatus({
                  open: false,
                  rowData: null,
                  noteText: "",
                  enquiryStatus: "",
                  disposition: "",
=======
                setNoteDialog({
                  open: false,
                  rowData: null,
                  noteText: "",
                  enquiryStage: "",
                  notesTo: "",
                  parents: "",
>>>>>>> Aadis_code
                })
              }
              maxWidth="sm"
              fullWidth
              TransitionComponent={Slide}
              TransitionProps={{ direction: "up" }}
              BackdropProps={{
                sx: {
<<<<<<< HEAD
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(4px)",
=======
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Adds a semi-transparent black color
                  backdropFilter: "blur(4px)", // Applies a blur effect to the backdrop
>>>>>>> Aadis_code
                },
              }}
            >
              <DialogTitle
                sx={{
                  color: "#ffffff",
                  fontWeight: 600,
<<<<<<< HEAD
                  background: "linear-gradient(to right, #642b8f, #aa88be)",
=======
                  background: "linear-gradient(to right, #642b8f, #aa88be)", // Apply the gradient background
>>>>>>> Aadis_code
                }}
              >
                Add Note
              </DialogTitle>
              <Divider />
              <DialogContent>
                {/* Enquiry Stage Select Box */}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Enquiry Stage</InputLabel>
                  <Select
<<<<<<< HEAD
                    value={noteDialog.enquiryStatus}
                    onChange={(e) =>
                      enquiryStatus((prev) => ({
                        ...prev,
                        enquiryStatus: e.target.value,
=======
                    value={noteDialog.enquiryStage}
                    onChange={(e) =>
                      setNoteDialog((prev) => ({
                        ...prev,
                        enquiryStage: e.target.value,
>>>>>>> Aadis_code
                      }))
                    }
                    label="Enquiry Stage"
                  >
<<<<<<< HEAD
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Qualified Lead">Qualified Lead</MenuItem>
                    <MenuItem value="Unqualified Lead">
                      Unqualified Lead
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Disposition</InputLabel>
                  <Select
                    value={noteDialog.disposition}
                    onChange={(e) =>
                      enquiryStatus((prev) => ({
                        ...prev,
                        disposition: e.target.value,
                      }))
                    }
                    label="Disposition"
                  >
                    <MenuItem value="RnR">RnR</MenuItem>
                    <MenuItem value="Call Back">Call Back</MenuItem>
                    <MenuItem value="None">None</MenuItem>
                  </Select>
                </FormControl>

=======
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="Follow-Up">Follow-Up</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                    <MenuItem value="Converted">Converted</MenuItem>
                  </Select>
                </FormControl>
                {/* Notes To Field */}
                <TextField
                  label="Notes To"
                  value={noteDialog.notesTo}
                  onChange={(e) =>
                    setNoteDialog((prev) => ({
                      ...prev,
                      notesTo: e.target.value,
                    }))
                  }
                  fullWidth
                  sx={{ mt: 2 }}
                />
>>>>>>> Aadis_code
                <TextField
                  label="Note"
                  value={noteDialog.noteText}
                  onChange={(e) =>
<<<<<<< HEAD
                    enquiryStatus((prev) => ({
=======
                    setNoteDialog((prev) => ({
>>>>>>> Aadis_code
                      ...prev,
                      noteText: e.target.value,
                    }))
                  }
                  multiline
                  rows={4}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </DialogContent>
              <Divider sx={{ borderColor: "#aa88be" }} />
              <DialogActions sx={{ p: 2.5 }}>
                <Button
                  onClick={handleNoteSave}
                  variant="contained"
<<<<<<< HEAD
                  className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
=======
                  class="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
>>>>>>> Aadis_code
                  sx={{
                    bgcolor: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  Save Note
                </Button>
                <Button
<<<<<<< HEAD
                  className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
                  onClick={() =>
                    enquiryStatus({
                      open: false,
                      rowData: null,
                      noteText: "",
                      enquiryStatus: "",
                      disposition: "",
=======
                  class="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
                  onClick={() =>
                    setNoteDialog({
                      open: false,
                      rowData: null,
                      noteText: "",
                      enquiryStage: "",
                      notesTo: "",
                      parents: "",
>>>>>>> Aadis_code
                    })
                  }
                  variant="outlined"
                  sx={{
                    color: "text.primary",
                    borderColor: "divider",
                  }}
                  type="reset"
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Box>
      </Fade>
    </ThemeProvider>
  );
};
export default Enquiries;
