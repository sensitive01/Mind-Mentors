import { ArrowBack, Delete, Edit, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteEmployeeData,
  fetchAllEmployees,
  // updateEmployeeStatus,
} from "../../../../api/service/employee/EmployeeService";

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
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetchAllEmployees();

        // Check if the data is an array
        if (Array.isArray(response)) {
          // Adjust if response is directly the array
          setRows(
            response.map((employee, index) => ({
              sno: index + 1,
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

  const handleDeleteConfirmation = (id, employeeData) => {
    setEmployeeToDelete({ id, employeeData });
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      // Call the service function to update the status to 'Inactive' instead of deleting
      await deleteEmployeeData(employeeToDelete.id, "Inactive");

      // Update the UI to reflect the status change
      setRows(
        rows.map((row) =>
          row.id === employeeToDelete.id ? { ...row, status: "Inactive" } : row
        )
      );
      console.log(
        `User with ID ${employeeToDelete.id} status changed to Inactive.`
      );
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setOpenViewDialog(true);
  };

  const handleEdit = (id) => {
    navigate(`/super-admin/department/employee/edit/${id}`);
  };

  const handleRowClick = (params) => {
    handleView(params.row);
  };

  const columns = [
    {
      field: "sno",
      headerName: "S.No",
      flex: 0.5,
      minWidth: 50,
    },
    {
      field: "firstName",
      headerName: "Name",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor:
              params.value === "Active"
                ? "rgba(46, 204, 113, 0.15)"
                : "rgba(231, 76, 60, 0.15)",
            color: params.value === "Active" ? "#2ecc71" : "#e74c3c",
            borderRadius: "16px",
            py: 0.5,
            px: 2,
            marginTop:"13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 0.8,
      minWidth: 120,
      getActions: (params) => [
  
        <GridActionsCellItem
          icon={<Edit color="secondary" />}
          label="Edit"
          onClick={() => handleEdit(params.id)}
        />,
        <GridActionsCellItem
          icon={<Delete color="error" />}
          label="Delete"
          onClick={() => handleDeleteConfirmation(params.id, params.row)}
        />,
      ],
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 100px)", // Dynamic height calculation
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
                sx={{ mr: 1 }}
                onClick={() => navigate(-1)}
                color="primary"
              >
                <ArrowBack />
              </IconButton>
              <Typography
                variant="h5"
                sx={{ color: "#642b8f", fontWeight: 600, mb: 0 }}
              >
                Employee Master Data
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/super-admin/department/employee/add"
            >
              + Add Employee
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1, width: "100%", overflow: "hidden" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              onRowClick={handleRowClick}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                border: "none",
                cursor: "pointer",
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
              pagination
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
            />
          </Box>
        </Paper>

        {/* View Employee Dialog */}
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <IconButton
                edge="start"
                color="primary"
                onClick={() => setOpenViewDialog(false)}
                sx={{ mr: 2 }}
              >
                <ArrowBack />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, fontWeight: 600 }}
              >
                Employee Details
              </Typography>
            </Box>
          </DialogTitle>
          <Divider />
          <DialogContent>
            {selectedEmployee && (
              <Box sx={{ py: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        backgroundColor: "#f8f9fa",
                        p: 2,
                        borderRadius: 2,
                        mb: 3,
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="primary"
                      >
                        {`${selectedEmployee.firstName}`}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {selectedEmployee.role} | {selectedEmployee.department}
                      </Typography>
                      <Box
                        sx={{
                          display: "inline-block",
                          mt: 1,
                          backgroundColor:
                            selectedEmployee.status === "Active"
                              ? "rgba(46, 204, 113, 0.15)"
                              : "rgba(231, 76, 60, 0.15)",
                          color:
                            selectedEmployee.status === "Active"
                              ? "#2ecc71"
                              : "#e74c3c",
                          borderRadius: "16px",
                          py: 0.5,
                          px: 2,
                        }}
                      >
                        {selectedEmployee.status}
                      </Box>
                    </Box>
                  </Grid>

                  {/* Personal Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Personal Information
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Email Address
                          </Typography>
                          <Typography variant="body1">
                            {selectedEmployee.email}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Phone Number
                          </Typography>
                          <Typography variant="body1">
                            {selectedEmployee.phoneNumber}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Gender
                          </Typography>
                          <Typography variant="body1">
                            {selectedEmployee.gender}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Address
                          </Typography>
                          <Typography
                            variant="body1"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {selectedEmployee.address}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* Work Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Work Information
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Center Name
                          </Typography>
                          <Typography variant="body1">
                            {selectedEmployee.centerName || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Mode
                          </Typography>
                          <Typography variant="body1">
                            {selectedEmployee.modes &&
                            selectedEmployee.modes.length > 0
                              ? selectedEmployee.modes.join(", ")
                              : selectedEmployee.mode || "N/A"}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Created At
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(selectedEmployee.createdAt)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenViewDialog(false)}
              color="primary"
            >
              Close
            </Button>
            {selectedEmployee && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setOpenViewDialog(false);
                  handleEdit(selectedEmployee.id);
                }}
              >
                Edit
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Confirm Status Change</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to change the status of this employee to
              "Inactive"?
              {employeeToDelete && (
                <Box
                  component="span"
                  sx={{ display: "block", fontWeight: "bold", mt: 1 }}
                >
                  {employeeToDelete.employeeData.firstName} (
                  {employeeToDelete.employeeData.email})
                </Box>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeMasterList;
