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
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllEmployees,
  deleteEmployee,
} from "../../../api/service/employee/EmployeeService";

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

const EmployeeMasterList = () => {
  const [rows, setRows] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetchAllEmployees();

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
      const response = await deleteEmployee(id); // Call the service function to delete the user

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

  const columns = [
    {
      field: "firstName",
      headerName: "First Name",
      flex: 150,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 150,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 250,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 150,
    },
    {
      field: "employmentType",
      headerName: "Employment Type",
      flex: 150,
    },
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
              Employee Master Data
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/employee/add"
            >
              + Add Employee
            </Button>
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            checkboxSelection
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
              "& .Mui DataGrid-cell:focus": {
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

        {/* View Employee Dialog */}
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Employee Details</DialogTitle>
          <DialogContent>
            {selectedEmployee && (
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <Typography>
                  <strong>Name:</strong>{" "}
                  {`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {selectedEmployee.email}
                </Typography>
                <Typography>
                  <strong>Department:</strong> {selectedEmployee.department}
                </Typography>
                <Typography>
                  <strong>Employment Type:</strong>{" "}
                  {selectedEmployee.employmentType}
                </Typography>
                <Typography>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedEmployee.createdAt).toLocaleDateString()}
                </Typography>
                <Typography>
                  <strong>Updated At:</strong>{" "}
                  {new Date(selectedEmployee.updatedAt).toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenViewDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeMasterList;
