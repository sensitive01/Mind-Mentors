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
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import * as XLSX from "xlsx";

import {
  fetchAllLogs,
  addNotes,
} from "../../../api/service/employee/EmployeeService";

const CompleteEnquiryLogs = () => {
  const empId = localStorage.getItem("empId");
  const navigate = useNavigate();

  const { id } = useParams();
  const [logs, setLogs] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteDialog, setNoteDialog] = useState({
    open: false,
    rowData: null,
    noteText: "",
    enquiryStatus: "",
    disposition: "",
  });

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await fetchAllLogs(id);
        if (response.status === 200 && Array.isArray(response.data)) {
          const sortedLogs = response.data.sort((a, b) => {
            const dateA = new Date(a.createdAt.split("-").reverse().join("-"));
            const dateB = new Date(b.createdAt.split("-").reverse().join("-"));
            return dateB - dateA;
          });

          const logData = sortedLogs.map((log, index) => ({
            id: index + 1,
            createdAt: formatDate(log.createdAt),
            action: log.action.trim(),
          }));

          setLogs(logData);
          setRows(logData);
        } else {
          console.error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [id]);

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${day}/${month}/20${year}`;
  };



  const handleCloseNoteDialog = () => {
    setNoteDialog({
      open: false,
      rowData: null,
      noteText: "",
      enquiryStatus: "",
      disposition: "",
    });
  };

  const handleNoteSave = async () => {
    try {
      console.log("Note Data:", {
        noteText: noteDialog.noteText,
        enquiryStatus: noteDialog.enquiryStatus,
        disposition: noteDialog.disposition,
      });

      const response = await addNotes(id, empId, {
        notes: noteDialog.noteText,
        enquiryStatus: noteDialog.enquiryStatus,
        disposition: noteDialog.disposition,
      });
      if (response.status) {
        navigate("/operation/department/enrollment-data");
      }

      console.log("Response", response);

      handleCloseNoteDialog();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // New method to handle log download
  const handleDownloadLogs = () => {
    // Prepare data for download
    const dataToExport = rows.map((row) => ({
      "Sl. No": row.id,
      Date: row.createdAt,
      Action: row.action,
    }));

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiry Logs");

    // Generate the file name
    const fileName = `Enquiry_Logs_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    // Export the file
    XLSX.writeFile(workbook, fileName);
  };

  const columns = [
    {
      field: "id",
      headerName: "Sl. No",
      width: 80,
      minWidth: 80,
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 150,
      minWidth: 150,
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 1,
      minWidth: 400,
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
              p: 3,
              backgroundColor: "background.paper",
              borderRadius: 3,
              height: 650,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
            }}
          >
            <Box
              mb={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={handleGoBack}
                  sx={{
                    mr: 2,
                    color: "text.secondary",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography
                  variant="h5"
                  sx={{ color: "text.primary", fontWeight: 600 }}
                >
                  Enquiry Logs ({rows.length} entries)
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadLogs}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  px: 3,
                  py: 1,
                }}
                disabled={rows.length === 0}
              >
                Download Logs
              </Button>
            </Box>
            <Box sx={{ height: 500, width: "100%" }}>
              <DataGrid
                rows={rows}
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
                getRowId={(row) => row.id}
                slots={{ toolbar: GridToolbar }}
                getRowHeight={() => "auto"}
                loading={loading}
                rowCount={rows.length}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                sx={{
                  "& .MuiDataGrid-main": {
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                      height: 8,
                      width: 8,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f1f1f1",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#888",
                      borderRadius: 4,
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "#555",
                    },
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
                }}
              />
            </Box>
          </Paper>

   
        </Box>
      </Fade>
    </ThemeProvider>
  );
};

export default CompleteEnquiryLogs;
