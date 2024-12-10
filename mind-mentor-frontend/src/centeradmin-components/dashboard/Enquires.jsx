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
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import columns from "./Columns";
import { addNotes, fetchAllEnquiries, moveToProspects, updateEnquiryStatus } from "../../api/service/employee/EmployeeService";



const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f",

      light: "#818CF8",
      dark: "#4F46E5",
    },
    secondary: {
      main: "#EC4899",
      light: "#F472B6",
      dark: "#DB2777",
    },
    warm: {
      main: "#F59E0B",
      light: "#FCD34D",
      dark: "#D97706",
    },
    cold: {
      main: "#3B82F6",
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
      if (key !== "id") {
        const formattedKey = key.replace(/([A-Z])/g, " $1").toUpperCase();

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
                </Typography>
              </Box>
            </Grid>
          );
        }

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
                  ? "N/A"
                  : value || "N/A"}{" "}
              </Typography>
            </Box>
          </Grid>
        );
      }
      return null;
    })}
  </Grid>
);

const Enquiries = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        const data = await fetchAllEnquiries();
        console.log(data);
        setRows(data);
      } catch (err) {
        console.log("Failed to fetch Enquiries. Please try again later.", err);
      } finally {
        setLoading(false);
      }
    };

    loadLeaves();
  }, []);
  const [noteDialog, enquiryStatus] = useState({
    open: false,
    rowData: null,
    noteText: "",
    disposition: "",
    enquiryStatus: "",
  });
  const [viewDialog, setViewDialog] = useState({
    open: false,
    rowData: null,
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const handleStatusToggle = async (id) => {
    const rowToUpdate = rows.find((row) => row._id === id);
    const newStatus = rowToUpdate.enquiryType === "warm" ? "cold" : "warm";

    try {
      const response = await updateEnquiryStatus(id, newStatus, empId);

      if (response.success) {
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
    const updatedRows = rows.map((row) =>
      row.id === newRow.id ? newRow : row
    );
    setRows(updatedRows);
    return newRow;
  };
  const handleProcessRowUpdateError = (error) => {
    console.error("Row update error:", error);
  };

  const handleMoveProspects = async (id) => {
    console.log(id);
    const respose = await moveToProspects(id, empId);
    console.log(respose);
  };

  const handleShowLogs = (id) => {
    console.log("Handle logs ", id);
    navigate(`/showCompleteLogsCenterAdmin/${id}`);
  };

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
                to="/centeradmin-enquiry-form"
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
                enquiryStatus,
                handleMoveProspects,
                handleShowLogs
              )}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
              disableRowSelectionOnClick
              editMode="row"
              getRowId={(row) => row._id}
              onRowDoubleClick={(params) => {
                setViewDialog({ open: true, rowData: params.row });

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
                enquiryStatus({
                  open: false,
                  rowData: null,
                  noteText: "",
                  enquiryStatus: "",
                  disposition: "",
                })
              }
              maxWidth="sm"
              fullWidth
              TransitionComponent={Slide}
              TransitionProps={{ direction: "up" }}
              BackdropProps={{
                sx: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(4px)",
                },
              }}
            >
              <DialogTitle
                sx={{
                  color: "#ffffff",
                  fontWeight: 600,
                  background: "linear-gradient(to right, #642b8f, #aa88be)",
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
                    value={noteDialog.enquiryStatus}
                    onChange={(e) =>
                      enquiryStatus((prev) => ({
                        ...prev,
                        enquiryStatus: e.target.value,
                      }))
                    }
                    label="Enquiry Stage"
                  >
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

                <TextField
                  label="Note"
                  value={noteDialog.noteText}
                  onChange={(e) =>
                    enquiryStatus((prev) => ({
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
                  className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
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
                  className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
                  onClick={() =>
                    enquiryStatus({
                      open: false,
                      rowData: null,
                      noteText: "",
                      enquiryStatus: "",
                      disposition: "",
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
