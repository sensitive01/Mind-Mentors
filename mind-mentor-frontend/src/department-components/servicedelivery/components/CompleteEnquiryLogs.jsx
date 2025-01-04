import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  createTheme,
  Fade,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import { fetchAllLogs } from "../../../api/service/employee/EmployeeService";


const CompleteEnquiryLogs = () => {
  const { id } = useParams();
  const [logs, setLogs] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await fetchAllLogs(id);
        if (response.status === 200 && Array.isArray(response.data)) {
          // Sort logs by createdAt in descending order
          const sortedLogs = response.data.sort((a, b) => {
            const dateA = new Date(a.createdAt.split('-').reverse().join('-'));
            const dateB = new Date(b.createdAt.split('-').reverse().join('-'));
            return dateB - dateA;
          });

          // Create rows with properly formatted data
          const logData = sortedLogs.map((log, index) => ({
            id: index + 1,
            createdAt: formatDate(log.createdAt), // Format the date
            action: log.action.trim(), // Trim any extra spaces
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

  // Function to format date from "DD-MM-YY" to a more readable format
  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    return `${day}/${month}/20${year}`;
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
      width: 120,
      minWidth: 120,
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
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "text.primary", fontWeight: 600, mb: 3 }}
              >
                Enquiry Logs ({rows.length} entries)
              </Typography>
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
                  "& .MuiDataGrid-footerContainer": {
                    display: "flex",
                    justifyContent: "flex-end",
                  },
                  "& .MuiCheckbox-root.Mui-checked": {
                    color: "#FFFFFF",
                  },
                  "& .MuiDataGrid-columnHeader .MuiCheckbox-root": {
                    color: "#FFFFFF",
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