import { Box, Paper, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActivityLogsByTaskId } from "../../../api/service/employee/EmployeeService"; // Ensure this is correctly imported

const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f",
    },
    background: {
      default: "#F1F5F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
    },
  },
  components: {
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

const columns = [
  { field: "sno", headerName: "S.No", flex: 0.5, minWidth: 50 }, // Smallest column
  { field: "action", headerName: "Action", flex: 1, minWidth: 150 },
  { field: "details", headerName: "Details", flex: 2, minWidth: 200 }, // Larger column for longer text
  {
    field: "performedByName",
    headerName: "Performed By",
    flex: 1.5,
    minWidth: 180,
  },
  { field: "timestamp", headerName: "Timestamp", flex: 1, minWidth: 150 },
];

const Prospects = () => {
  const { id } = useParams();
  console.log(id);

  const [rows, setRows] = useState([]);

  // Fetch activity logs based on selected task ID
  const fetchActivityLogs = async (id) => {
    console.log("Fetching activity logs for task ID:", id); // Debug log

    try {
      const response = await getActivityLogsByTaskId(id); // Assuming getActivityLogsByTaskId makes the API call
      console.log("Fetched Data:", response); // Log the response data

      if (response.success) {
        const formattedRows = response.data.map((log, index) => ({
          id: log._id,
          sno: index + 1,
          taskId: log.taskId,
          action: log.action,
          details: log.details,
          performedByName: log.performedByName,
          timestamp: new Date(log.timestamp).toLocaleString(), // Format the timestamp
        }));

        setRows(formattedRows);
      } else {
        console.error("Error fetching activity logs:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
    }
  };

  // Trigger data fetch when selectedTaskId changes
  useEffect(() => {
    fetchActivityLogs(id);
  }, []); // Effect will run whenever selectedTaskId changes

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "100%" }, // Responsive widths
          height: "100%",
          p: 3,
          ml: "auto", // Pushes the Box to the right
        }}
      >
        {" "}
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
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: "text.primary",
              fontWeight: 600,
              mb: 3,
            }}
          >
            Activity Logs
          </Typography>

          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              height: 500,
              "& .MuiDataGrid-cell:focus": { outline: "none" },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#642b8f",
                color: "white",
                fontWeight: 600,
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
    </ThemeProvider>
  );
};

export default Prospects;
