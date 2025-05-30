import { Delete, Edit, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { default as React, useEffect, useState } from "react";
import {
  deleteHoliday,
  fetchAllHoliday,
} from "../../../api/service/employee/EmployeeService";
import { Link } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f", // Indigo
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

const HolidayManagement = () => {
  const [rows, setRows] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const columns = [
    // { field: 'holidayId', headerName: 'Holiday ID', width: 150 },
    { field: "holidayName", headerName: "Holiday Name", flex: 200 },
    { field: "startDate", headerName: "Start Date", flex: 180 },
    { field: "endDate", headerName: "End Date", flex: 180 },
    // { field: 'description', headerName: 'Description', width: 300 },
    { field: "status", headerName: "Status", flex: 80 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 450,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View"
          onClick={() => handleView(params.row)}
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEdit(params.id)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />,
      ],
    },
  ];
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetchAllHoliday();

        // Check if the data is an array
        if (Array.isArray(response)) {
          // Adjust if response is directly the array
          setRows(
            response.map((employee, index) => ({
              id: employee._id, // Use _id as the unique identifier
              ...employee, // Spread the other properties
            }))
          );
        } else {
          console.error("Response data is not an array:", response);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    // Ask for confirmation before proceeding with the deletion
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!isConfirmed) {
      console.log("Deletion canceled.");
      return; // Exit the function if the user cancels
    }

    try {
      const response = await deleteHoliday(id); // Call the service function to delete the user

      // Update the UI only if the delete operation was successful
      setRows(rows.filter((row) => row.id !== id));
      console.log(`User with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setOpenViewDialog(true);
  };

  const handleEdit = (id) => {
    console.log(`Editing employee with ID: ${id}`);
  };
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
          <Box
            mb={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "#642b8f", fontWeight: 600, mb: 3 }}
            >
              Holiday Management
            </Typography>
            <Button
              variant="contained"
              style={{ backgroundColor: "#642b8f", color: "white" }}
              component={Link}
              to="/holiday/add"
            >
              + Add Holiday
            </Button>
          </Box>
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
              height: 500, // Fixed height for the table
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
      </Box>
    </ThemeProvider>
  );
};

export default HolidayManagement;
