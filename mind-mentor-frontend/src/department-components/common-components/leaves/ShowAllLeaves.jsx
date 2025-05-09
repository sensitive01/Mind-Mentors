import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentIcon from "@mui/icons-material/Assignment";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  fetchAllLeavesSuperAdmin,
  updateLeaveStatus,
} from "../../../api/service/employee/EmployeeService";

const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f",
    },
    secondary: {
      main: "#EC4899",
    },
    background: {
      default: "#F1F5F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
    },
  },
});

// Status color mapping
const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "success";
    case "Rejected":
      return "error";
    case "On Hold":
      return "warning";
    case "Pending":
    default:
      return "info";
  }
};

// Category badge
const CategoryBadge = ({ category }) => {
  const getColor = (category) => {
    switch (category?.toLowerCase()) {
      case "leave":
        return "#6366f1"; // Indigo
      case "permission":
        return "#f59e0b"; // Amber
      default:
        return "#64748b"; // Slate
    }
  };

  return (
    <Chip
      label={category || "Unknown"}
      size="small"
      sx={{
        backgroundColor: getColor(category),
        color: "white",
        fontWeight: 500,
        fontSize: "0.75rem",
      }}
    />
  );
};

const columns = (theme) => [
  {
    field: "slNo",
    headerName: "Sl No",
    width: 70,
    renderCell: (params) => params.value,
  },
  { field: "employeeName", headerName: "Employee", width: 130 },
  {
    field: "category",
    headerName: "Category",
    width: 120,
    renderCell: (params) => <CategoryBadge category={params.value} />,
  },
  { field: "leaveType", headerName: "Type", width: 140 },
  { field: "leaveStartDate", headerName: "Start Date", width: 120 },
  { field: "leaveEndDate", headerName: "End Date", width: 120 },
  {
    field: "timePeriod",
    headerName: "Time",
    width: 130,
    renderCell: (params) => {
      if (
        params.row.category === "permission" &&
        params.row.startTime &&
        params.row.endTime
      ) {
        return `${params.row.startTime} - ${params.row.endTime}`;
      }
      return "N/A";
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color={getStatusColor(params.value)}
        variant="outlined"
      />
    ),
  },
  {
    field: "proof",
    headerName: "Proof",
    width: 80,
    renderCell: (params) =>
      params.row.proof ? (
        <a href={params.row.proof} target="_blank" rel="noopener noreferrer">
          <HistoryIcon
            sx={{
              color: "#000",
              "&:hover": {
                backgroundColor: alpha(theme.palette.info.main, 0.1),
              },
            }}
          />
        </a>
      ) : (
        "No Proof"
      ),
  },
  { field: "createdAt", headerName: "Created At", width: 120 },
  {
    field: "actions",
    headerName: "Actions",
    width: 80,
    renderCell: (params) => (
      <VisibilityIcon
        sx={{
          color: theme.palette.primary.main,
          cursor: "pointer",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          },
        }}
      />
    ),
  },
];

const DetailView = ({ data, onStatusChange }) => {
  const [leaveStatus, setLeaveStatus] = useState(data.status || "Pending");

  const handleStatusChange = (event) => {
    setLeaveStatus(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await updateLeaveStatus(data._id, leaveStatus);
      console.log("response", response);
      onStatusChange(data._id, leaveStatus);
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Specific fields to display
  const fieldsToShow = [
    { key: "employeeName", label: "Employee Name" },
    { key: "category", label: "Request Category" },
    { key: "leaveType", label: "Leave Type" },
    { key: "leaveStartDate", label: "Start Date" },
    { key: "leaveEndDate", label: "End Date" },
    {
      key: "startTime",
      label: "Start Time",
      condition: data.category === "permission",
    },
    {
      key: "endTime",
      label: "End Time",
      condition: data.category === "permission",
    },
    { key: "notes", label: "Notes" },
    { key: "createdAt", label: "Created At" },
  ];

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      {fieldsToShow
        .filter((field) => field.condition === undefined || field.condition)
        .map((field) => (
          <Grid item xs={12} sm={6} md={6} key={field.key}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                height: "100%",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1, display: "block" }}
              >
                {field.label}
              </Typography>
              <Typography variant="body1" color="text.primary">
                {field.key === "createdAt" ? (
                  formatDate(data[field.key])
                ) : field.key === "category" ? (
                  <CategoryBadge category={data[field.key]} />
                ) : (
                  data[field.key] || "N/A"
                )}
              </Typography>
            </Box>
          </Grid>
        ))}

      {/* Proof Section */}
      <Grid item xs={12} sm={12} md={12}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1, display: "block" }}
          >
            Proof Document
          </Typography>
          {data.proof ? (
            <Box sx={{ mt: 1 }}>
              <a
                href={data.proof}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  size="small"
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                  }}
                >
                  View Document
                </Button>
              </a>
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No proof document attached
            </Typography>
          )}
        </Box>
      </Grid>

      {/* Status Update Section */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.secondary.main, 0.04),
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Update {data.category === "permission" ? "Permission" : "Leave"}{" "}
            Status
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="leave-status-label">Status</InputLabel>
              <Select
                labelId="leave-status-label"
                id="leave-status"
                value={leaveStatus}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="Approved">Approve</MenuItem>
                <MenuItem value="Rejected">Reject</MenuItem>
                <MenuItem value="On Hold">Hold</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ height: 40 }}
            >
              Update Status
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

const ShowAllLeaves = () => {
  const empId = localStorage.getItem("empId");
  const department = localStorage.getItem("department");

  const [rows, setRows] = useState([]);
  const [viewDialog, setViewDialog] = useState({ open: false, rowData: null });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeavesData = async () => {
      try {
        console.log("Fetching leaves data for empId:", empId);
        const response = await fetchAllLeavesSuperAdmin();
        console.log("Response received: ", response);

        // Add serial numbers to the formatted leaves
        const leavesWithSerialNumbers = response.data.formattedLeaves.map(
          (leave, index) => ({
            ...leave,
            slNo: index + 1,
          })
        );

        setRows(leavesWithSerialNumbers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leaves data:", err.message);
        setError("Failed to fetch leaves data.");
        setLoading(false);
      }
    };

    if (empId) {
      fetchLeavesData();
    } else {
      console.log("empId is missing or invalid");
    }
  }, [empId]);

  const handleRowClick = (params) => {
    setViewDialog({
      open: true,
      rowData: params.row,
    });
  };

  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      // Update the local state
      const updatedRows = rows.map((row) =>
        row._id === leaveId ? { ...row, status: newStatus } : row
      );

      setRows(updatedRows);
      setViewDialog({ open: false, rowData: null });

      // Show success message or notification here
      console.log(`Leave ${leaveId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating leave status:", error);
      // Handle error - show error message
    }
  };

  const NoLeavesMessage = () => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="400px"
      sx={{
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
        borderRadius: 2,
      }}
    >
      <AssignmentIcon
        sx={{
          fontSize: 60,
          color: theme.palette.primary.main,
          mb: 2,
          opacity: 0.7,
        }}
      />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No Leave Records Found
      </Typography>
    </Box>
  );

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
              sx={{ color: "#000", fontWeight: 600, mb: 3 }}
            >
              Employee Leave & Permission Management
            </Typography>
          </Box>

          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="500px"
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="500px"
            >
              <Typography color="error">{error}</Typography>
            </Box>
          ) : rows.length === 0 ? (
            <NoLeavesMessage />
          ) : (
            <DataGrid
              rows={rows}
              columns={columns(theme)}
              getRowId={(row) => row._id}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              onRowClick={handleRowClick}
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
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  cursor: "pointer",
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
          )}

          {/* View Dialog with Status Update */}
          <Dialog
            open={viewDialog.open}
            onClose={() => setViewDialog({ open: false, rowData: null })}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle
              sx={{
                background: "linear-gradient(#642b8f, #642b8f)",
                color: "#ffffff",
                fontWeight: 600,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: "24px !important",
              }}
            >
              {viewDialog.rowData?.category === "permission"
                ? "Permission"
                : "Leave"}{" "}
              Request Details
              <Button
                onClick={() => setViewDialog({ open: false, rowData: null })}
                variant="outlined"
                sx={{
                  color: "#f8a213",
                  borderColor: "#f8a213",
                  marginLeft: 2,
                }}
              >
                Close
              </Button>
            </DialogTitle>
            <DialogContent>
              {viewDialog.rowData && (
                <DetailView
                  data={viewDialog.rowData}
                  onStatusChange={handleStatusChange}
                />
              )}
            </DialogContent>
          </Dialog>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ShowAllLeaves;
