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
  fetchAllUsers,
  deleteUser,
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
        const response = await fetchAllUsers();

        // Check if the data is an array
        if (Array.isArray(response)) {
          setRows(
            response.map((employee) => ({
              id: employee._id, // Use _id as the unique identifier
              firstName: employee.firstName || "N/A", // Fallback if firstName is missing
              lastName: employee.lastName || "N/A", // Fallback if lastName is missing
              email: employee.email || "N/A", // Fallback if email is missing
              department: employee.department || "N/A", // You can modify as per actual field
              employmentType: employee.employmentType || "N/A", // Adjust as needed
              phoneNumber: employee.phoneNumber || "N/A",
              address: employee.address || "N/A",
              bio: employee.bio || "N/A",
              skills: employee.skills?.join(", ") || "N/A",
              createdAt: employee.createdAt,
              updatedAt: employee.updatedAt,
            }))
          );
        } else {
          console.error("Response data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setOpenViewDialog(true);
  };

  const handleEdit = (id) => {
    console.log(`Editing employee with ID: ${id}`);
  };

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
      const response = await deleteUser(id); // Call the service function to delete the user

      // Update the UI only if the delete operation was successful
      setRows(rows.filter((row) => row.id !== id));
      console.log(`User with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
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
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 200,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 250,
    },
    {
      field: "bio",
      headerName: "Bio",
      flex: 200,
    },
    {
      field: "skills",
      headerName: "Skills",
      flex: 200,
      renderCell: (params) => (
        <Typography variant="body2">{params.value || "N/A"}</Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 200,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString() || "N/A"}
        </Typography>
      ),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 200,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString() || "N/A"}
        </Typography>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 200,
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
              User Data
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/users/add"
            >
              + Add User
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
                  <strong>Phone:</strong> {selectedEmployee.phoneNumber}
                </Typography>
                <Typography>
                  <strong>Address:</strong> {selectedEmployee.address}
                </Typography>
                <Typography>
                  <strong>Bio:</strong> {selectedEmployee.bio}
                </Typography>
                <Typography>
                  <strong>Skills:</strong> {selectedEmployee.skills}
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
