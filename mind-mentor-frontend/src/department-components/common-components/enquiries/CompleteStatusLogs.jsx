import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
  Typography,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import {
  fetchAllStatusLogs,
  addNotes,
} from "../../../api/service/employee/EmployeeService";

const CompleteStatusLogs = () => {
  const empId = localStorage.getItem("empId");
  const navigate = useNavigate();

  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteDialog, setNoteDialog] = useState({
    open: false,
    noteText: "",
    enquiryStatus: "",
    disposition: "",
  });

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await fetchAllStatusLogs(id);
        console.log("Res", response);
        if (response.status && response.data?.data?.notes) {
          const notes = response.data.data.notes;
          const totalCount = notes.length;
          const notesData = notes.map((note, index) => ({
            id: totalCount - index,
            createdAt: note.createdOn,
            enquiryStatus: note.enquiryStatus || "N/A",
            disposition: note.disposition || "N/A",
            note: note.note || "N/A",
            updatedBy: note.updatedBy || "N/A",
          }));
          setNotes(notesData.reverse());
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [id]);

  const handleOpenNoteDialog = () => {
    setNoteDialog({
      open: true,
      noteText: "",
      enquiryStatus: "",
      disposition: "",
    });
  };

  const handleCloseNoteDialog = () => {
    setNoteDialog({
      open: false,
      noteText: "",
      enquiryStatus: "",
      disposition: "",
    });
  };

  const handleNoteSave = async () => {
    try {
      const response = await addNotes(id, empId, {
        notes: noteDialog.noteText,
        enquiryStatus: noteDialog.enquiryStatus,
        disposition: noteDialog.disposition,
      });
      if (response.status) {
        navigate("/operation/department/enrollment-data");
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Sno",
      width: 80,
      minWidth: 80,
    },

    {
      field: "enquiryStatus",
      headerName: "Enquiry Status",
      width: 200,
      minWidth: 200,
    },
    {
      field: "disposition",
      headerName: "Disposition",
      width: 200,
      minWidth: 200,
    },
    {
      field: "note",
      headerName: "Note",
      flex: 1,
      width: 300,
      minWidth: 300,
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            padding: "8px 0",
            whiteSpace: "normal",
            lineHeight: "1.5",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "updatedBy",
      headerName: "Added By",
      width: 300,
      minWidth: 300,
      renderCell: (params) => (
        <Box>
          <div>{params.value}</div> {/* Display "updatedBy" value */}
          <div style={{ fontSize: "12px", color: "gray" }}>{params.row.createdAt}</div> {/* Display "createdAt" */}
        </Box>
      ),
    },
  ];
  

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

  return (
    <ThemeProvider theme={theme}>
      <Fade in={true}>
        <Box sx={{ width: "100%", height: "100%", p: 3, ml: "auto" }}>
          <Paper
            elevation={0}
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 3,
              height: 650,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
              p:3
            }}
          >
            <Box
              display="flex"
              justifyContent="flex-end" // Aligns content to the right
              alignItems="center" // Ensures vertical alignment
            >
              <Button
                variant="contained"
                onClick={handleOpenNoteDialog}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  px: 3,
                  py: 1,
                }}
              >
                Update call status log
              </Button>
            </Box>

            {notes.length === 0 && !loading ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No notes available for this enquiry.
              </Alert>
            ) : (
              <Box
                sx={{
                  height: 500,
                  width: "100%",
                  "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                    display: "none",
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                  },
                }}
              >
                <DataGrid
                  rows={notes}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                      },
                    },
                  }}
                  pageSizeOptions={[10, 25, 50]}
                  disableRowSelectionOnClick
                  slots={{ toolbar: GridToolbar }}
                  getRowHeight={() => "auto"}
                  loading={loading}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                    },
                  }}
                  sx={{
                    "& .MuiDataGrid-virtualScroller": {
                      overflow: "auto",
                      "&::-webkit-scrollbar": {
                        display: "none",
                      },
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    },
                    "& .MuiDataGrid-cell": {
                      whiteSpace: "normal !important",
                      lineHeight: "1.5 !important",
                      padding: "8px !important",
                    },
                    "& .MuiDataGrid-row": {
                      maxHeight: "none !important",
                    },
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
                    "& .MuiDataGrid-main": {
                      overflow: "auto",
                      "&::-webkit-scrollbar": {
                        display: "none",
                      },
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    },
                  }}
                />
              </Box>
            )}
          </Paper>

          {/* Add Note Dialog */}
          <Dialog
            open={noteDialog.open}
            onClose={handleCloseNoteDialog}
            maxWidth="sm"
            fullWidth
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
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Enquiry Stage</InputLabel>
                <Select
                  value={noteDialog.enquiryStatus}
                  onChange={(e) =>
                    setNoteDialog((prev) => ({
                      ...prev,
                      enquiryStatus: e.target.value,
                    }))
                  }
                  label="Enquiry Stage"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Qualified Lead">Qualified Lead</MenuItem>
                  <MenuItem value="Unqualified Lead">Unqualified Lead</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Disposition</InputLabel>
                <Select
                  value={noteDialog.disposition}
                  onChange={(e) =>
                    setNoteDialog((prev) => ({
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
                  setNoteDialog((prev) => ({
                    ...prev,
                    noteText: e.target.value,
                  }))
                }
                multiline
                rows={4}
                fullWidth
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <Divider sx={{ borderColor: "#aa88be" }} />
            <DialogActions sx={{ p: 2.5 }}>
              <Button
                onClick={handleNoteSave}
                variant="contained"
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Save Note
              </Button>
              <Button
                onClick={handleCloseNoteDialog}
                variant="outlined"
                sx={{
                  color: "text.primary",
                  borderColor: "divider",
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    </ThemeProvider>
  );
};

export default CompleteStatusLogs;
