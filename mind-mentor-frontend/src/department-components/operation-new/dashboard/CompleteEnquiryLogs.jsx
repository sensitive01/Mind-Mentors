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

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetchAllLogs(id);
        console.log(response.data); // Check the structure of the data
        if (response.status === 200 && Array.isArray(response.data)) {
          // Sort logs by createdAt in descending order (newest first)
          const sortedLogs = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          const logData = sortedLogs.map((log, index) => ({
            id: index + 1, // Assign a unique id for each log
            createdAt: log.createdAt,
            action: log.action,
          }));

          setLogs(logData); // Store the fetched logs
          setRows(logData); // Set rows for DataGrid
        } else {
          console.error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, [id]);

  const columns = [
    {
      field: "id",
      headerName: "Sl. No",
      flex: 2,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 5,
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 15,
      renderCell: (params) => <Box>{params.value}</Box>, // Display the action text
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
                Enquiry Logs
              </Typography>
            </Box>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                    page: 0,
                  },
                },
              }}
              pageSizeOptions={[10, 25, 50]}
             
              disableRowSelectionOnClick
              getRowId={(row) => row.id}
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
          </Paper>
        </Box>
      </Fade>
    </ThemeProvider>
  );
};

export default CompleteEnquiryLogs;
