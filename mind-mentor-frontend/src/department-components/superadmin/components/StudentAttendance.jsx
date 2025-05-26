import {
  Box,
  Paper,
  ThemeProvider,
  Typography,
  createTheme,
  Button,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { getAttandanceReport } from "../../../api/service/employee/EmployeeService";
import { Visibility, PlayArrow } from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f",
      light: "#818CF8",
      dark: "#4F46E5",
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

const StudentAttendance = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to handle view statistics
  const handleViewStatistics = (internalMeetingID) => {
    const url = `https://class.mindmentorz.in/learning-analytics-dashboard/?meeting=${internalMeetingID}&lang=en`;
    window.open(url, "_blank");
  };

  // Function to handle view recording
  const handleViewRecording = (internalMeetingID) => {
    const url = `https://class.mindmentorz.in/playback/presentation/2.3/${internalMeetingID}`;
    window.open(url, "_blank");
  };

  // Define columns for the DataGrid
  const columns = [
    {
      field: "sno",
      headerName: "S.No",
      width: 80,
      sortable: false,
    },
    {
      field: "classAndCoach",
      headerName: "Class & Coach",
      width: 250,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              lineHeight: 1.2,
            }}
          >
            {params.row.className}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              lineHeight: 1.2,
              mt: 0.5,
            }}
          >
            {params.row.coachName}
          </Typography>
        </Box>
      ),
    },
    {
      field: "startTime",
      headerName: "Date & Time",
      width: 180,
    },
    {
      field: "meetingID",
      headerName: "Meeting ID",
      width: 180,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<Visibility />}
            onClick={() => handleViewStatistics(params.row.internalMeetingID)}
            sx={{
              backgroundColor: "#642b8f",
              "&:hover": {
                backgroundColor: "#4F46E5",
              },
              textTransform: "none",
              fontSize: "0.75rem",
            }}
          >
            Stats
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<PlayArrow />}
            onClick={() => handleViewRecording(params.row.internalMeetingID)}
            sx={{
              backgroundColor: "#28a745",
              "&:hover": {
                backgroundColor: "#218838",
              },
              textTransform: "none",
              fontSize: "0.75rem",
            }}
          >
            Recording
          </Button>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAttandanceReport();
        console.log(response);

        if (response.status === 200) {
          // Transform the data to match DataGrid requirements
          const transformedData = response.data.data.map((item, index) => ({
            id: item._id,
            sno: index + 1,
            className: item.className,
            coachName: item.coachName,
            startTime: item.formattedStartTime,
            meetingID: item.meetingID,
            internalMeetingID: item.internalMeetingID,
            classId: item.classId,
          }));

          setRows(transformedData);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", height: "100%", p: 3 }}>
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
            Class Sessions Report
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 25 },
              },
            }}
            pageSizeOptions={[25, 50, 100]}
            sx={{
              height: 500,
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
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
              "& .MuiDataGrid-row": {
                minHeight: "60px !important",
              },
            }}
          />
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default StudentAttendance;
