import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  createTheme,
  Paper,
  ThemeProvider,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  getConductedDemo,
  updateDemoStatus,
} from "../../../api/service/employee/EmployeeService";
import { toast, ToastContainer } from "react-toastify";

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

const Prospects = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const columns = [
    { field: "sno", headerName: "S.No", width: 70 },
    { field: "day", headerName: "Day", width: 100 },
    { field: "classTime", headerName: "Class Time", width: 150 },
    { field: "coachName", headerName: "Coach", width: 120 },
    { field: "program", headerName: "Program", width: 120 },
    { field: "level", headerName: "Level", width: 120 },
    { field: "studentName", headerName: "Student Name", width: 150 },
    { field: "attendance", headerName: "Attendance", width: 120 },
    { field: "feedback", headerName: "Feedback", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleButtonClick(params.row)}
          disabled={
            loading || params.row.attendance?.toLowerCase() === "absent"
          }
        >
          Change Status
        </Button>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getConductedDemo();
      console.log(response);
      const formattedRows = response.data.flatMap((demoClass, classIndex) =>
        demoClass.students.map((student, studentIndex) => ({
          id: student.studentID,
          sno: studentIndex + 1,
          day: demoClass.day,
          classTime: demoClass.classTime,
          coachName: demoClass.coachName,
          program: demoClass.program,
          level: demoClass.level,
          studentName: student.name,
          studentID: student.studentID,
          attendance: student.attendance,
          feedback: student.feedback,
          classData: demoClass,
          studentData: student,
        }))
      );
      setRows(formattedRows);
    } catch (error) {
      console.error("Error fetching demo data:", error);
      showSnackbar("Error fetching data. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleButtonClick = async (row) => {
    try {
      setLoading(true);
      console.log(row.id);
      const response = await updateDemoStatus(row.id);
      console.log("response", response);

      if (response.status === 200) {
        showSnackbar("Status updated successfully", "success");
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error updating demo status:", error);
      toast.error("Error updating status. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", height: "100%", p: 2 }}>
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
            Conducted Demo Classes
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
       
            disableRowSelectionOnClick
            loading={loading}
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

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </ThemeProvider>
  );
};

export default Prospects;
