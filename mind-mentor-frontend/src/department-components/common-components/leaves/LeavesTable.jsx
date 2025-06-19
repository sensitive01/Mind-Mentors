import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

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
  Grid,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchMyLeaves } from "../../../api/service/employee/EmployeeService";
import AssignmentIcon from "@mui/icons-material/Assignment";

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

// Function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "#10B981"; // Green
    case "Rejected":
      return "#EF4444"; // Red
    case "Pending":
      return "#F59E0B"; // Amber
    default:
      return "#6B7280"; // Gray
  }
};

// Function to format date for display
const formatDisplayDate = (dateString) => {
  if (!dateString) return "N/A";
  // Parse date from MM/DD/YYYY format
  const parts = dateString.split("/");
  if (parts.length !== 3) return dateString;

  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // Format as "Month Day, Year"
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const columns = (theme, handleStatusToggle, setViewDialog, setNoteDialog) => [
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
    width: 110,
    renderCell: (params) => (
      <Chip
        label={params.value === "leave" ? "Leave" : "Permission"}
        size="small"
        sx={{
          backgroundColor:
            params.value === "leave"
              ? alpha(theme.palette.primary.main, 0.1)
              : alpha(theme.palette.secondary.main, 0.1),
          color:
            params.value === "leave"
              ? theme.palette.primary.main
              : theme.palette.secondary.main,
        }}
      />
    ),
  },
  { field: "leaveType", headerName: "Type", width: 130 },
  {
    field: "leaveStartDate",
    headerName: "Start Date",
    width: 110,
    renderCell: (params) => formatDisplayDate(params.row.leaveStartDate),
  },
  {
    field: "leaveEndDate",
    headerName: "End Date",
    width: 110,
    renderCell: (params) => formatDisplayDate(params.row.leaveEndDate),
  },
  {
    field: "time",
    headerName: "Time",
    width: 130,
    renderCell: (params) =>
      params.row.category === "permission" && params.row.startTime ? (
        <Box display="flex" alignItems="center">
          <AccessTimeIcon
            sx={{
              fontSize: 16,
              mr: 0.5,
              mt: 2,
              color: theme.palette.primary.main,
            }}
          />
          <Typography variant="body2" sx={{ fontSize: 16, mr: 0.5, mt: 2 }}>
            {params.row.startTime} - {params.row.endTime}
          </Typography>
        </Box>
      ) : (
        "N/A"
      ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 110,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        sx={{
          backgroundColor: alpha(getStatusColor(params.value), 0.1),
          color: getStatusColor(params.value),
          fontWeight: 600,
        }}
      />
    ),
  },
  {
    field: "notes",
    headerName: "Notes",
    width: 100,
    renderCell: (params) => (
      <Button
        onClick={() =>
          setNoteDialog({
            open: true,
            rowData: params.row,
            noteText: params.row.notes,
          })
        }
        variant="text"
        color="secondary"
        size="small"
      >
        View
      </Button>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 120,
    renderCell: (params) => (
      <>
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="View"
          onClick={() =>
            setViewDialog({
              open: true,
              rowData: params.row,
            })
          }
          sx={{
            color: "#F59E0B",
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        />
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleStatusToggle(params.row._id)}
          sx={{
            color: "#642b8f",
            "&:hover": {
              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
            },
          }}
        />
      </>
    ),
  },
  {
    field: "proof",
    headerName: "Proof",
    width: 100,
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
  {
    field: "createdAt",
    headerName: "Created",
    width: 110,
    renderCell: (params) => formatDisplayDate(params.row.createdAt),
  },
];

const DetailView = ({ data }) => {
  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    // Parse date from MM/DD/YYYY format
    const parts = dateString.split("/");
    if (parts.length !== 3) return dateString;

    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Format as "Month Day, Year"
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Function to display proof
  const ProofDisplay = ({ url }) => {
    if (!url) return <Typography>No proof provided</Typography>;

    // Check if it's an image (simple check)
    const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i);

    return (
      <Box>
        {isImage ? (
          <Box sx={{ mt: 1 }}>
            <img
              src={url}
              alt="Proof"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                borderRadius: "8px",
              }}
            />
          </Box>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mt: 1 }}
          >
            View Document
          </Button>
        )}
      </Box>
    );
  };

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            color={theme.palette.primary.main}
            gutterBottom
          >
            {data.employeeName || "N/A"} -{" "}
            {data.category === "leave" ? "Leave" : "Permission"} Request
          </Typography>
          <Chip
            label={data.status || "N/A"}
            size="small"
            sx={{
              backgroundColor: alpha(getStatusColor(data.status), 0.1),
              color: getStatusColor(data.status),
              fontWeight: 600,
            }}
          />
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
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
            Category
          </Typography>
          <Typography variant="body1" color="text.primary">
            {data.category === "leave" ? "Leave" : "Permission"}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
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
            Type
          </Typography>
          <Typography variant="body1" color="text.primary">
            {data.leaveType || "N/A"}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
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
            Employee Name
          </Typography>
          <Typography variant="body1" color="text.primary">
            {data.employeeName || "N/A"}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
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
            Start Date
          </Typography>
          <Typography variant="body1" color="text.primary">
            {data.leaveStartDate || "N/A"}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
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
            End Date
          </Typography>
          <Typography variant="body1" color="text.primary">
            {data.leaveEndDate || "N/A"}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
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
            Time (For Permission)
          </Typography>
          <Typography variant="body1" color="text.primary">
            {data.startTime && data.endTime
              ? `${data.startTime} - ${data.endTime}`
              : "N/A"}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={6}>
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
            Notes
          </Typography>
          <Typography variant="body1" color="text.primary">
            {data.notes || "No notes provided"}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={6}>
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
            Created At
          </Typography>
          <Typography variant="body1" color="text.primary">
            {formatDate(data.createdAt)}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12}>
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
            Proof
          </Typography>
          <ProofDisplay url={data.proof} />
        </Box>
      </Grid>
    </Grid>
  );
};

const EmployeeLeaveManagement = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const department = localStorage.getItem("department");

  const [rows, setRows] = useState([]);
  const [noteDialog, setNoteDialog] = useState({
    open: false,
    rowData: null,
    noteText: "",
  });
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
        const response = await fetchMyLeaves(empId);
        console.log("Response received: ", response);

        const leavesWithSerialNumbers = (response.formattedLeaves || []).map(
          (leave, index) => ({
            ...leave,
            slNo: index + 1,
          })
        );

        setRows(leavesWithSerialNumbers);

        if (leavesWithSerialNumbers.length === 0) {
          setError(response.message || "No leave data found.");
        } else {
          setError(""); // clear any previous error
        }

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

  const handleStatusToggle = (id) => {
    navigate(`/${department}/department/edit-leaves/${id}`);
  };

  const handleNoteSave = () => {
    if (noteDialog.rowData) {
      setRows(
        rows.map((row) =>
          row.id === noteDialog.rowData.id
            ? { ...row, notes: noteDialog.noteText }
            : row
        )
      );
      setNoteDialog({ open: false, rowData: null, noteText: "" });
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
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mb: 3 }}
      >
        You haven't applied for any leaves yet. Click the button below to submit
        a leave request.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={`/${department}/department/leaves/add`}
        startIcon={<EditIcon />}
      >
        Apply for Leave
      </Button>
    </Box>
  );

  // Error message component
  const ErrorMessage = () => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="400px"
      sx={{
        backgroundColor: alpha("#EF4444", 0.04),
        borderRadius: 2,
      }}
    >
 
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mb: 3 }}
      >
        {error}
      </Typography>
      {/* <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.reload()}
      >
        Retry
      </Button> */}
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
              My Leaves & Permissions
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/${department}/department/leaves/add`}
            >
              + Apply Leave
            </Button>
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
            <ErrorMessage />
          ) : rows.length === 0 ? (
            <NoLeavesMessage />
          ) : (
            <DataGrid
              rows={rows}
              columns={columns(
                theme,
                handleStatusToggle,
                setViewDialog,
                setNoteDialog
              )}
              getRowId={(row) => row._id}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25]}
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
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
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

          {/* View Dialog */}
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
              <DetailView data={viewDialog.rowData || {}} />
            </DialogContent>
          </Dialog>

          {/* Notes Dialog */}
          <Dialog
            open={noteDialog.open}
            onClose={() =>
              setNoteDialog({ open: false, rowData: null, noteText: "" })
            }
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              sx={{
                background: "linear-gradient(#642b8f, #642b8f)",
                color: "#ffffff",
                fontWeight: 600,
              }}
            >
              View Notes
            </DialogTitle>
            <DialogContent>
              <TextField
                label="Note"
                value={noteDialog.noteText}
                onChange={(e) =>
                  setNoteDialog((prev) => ({
                    ...prev,
                    noteText: e.target.value,
                  }))
                }
                multiline
                rows={4}
                fullWidth
                sx={{ mt: 1 }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() =>
                  setNoteDialog({ open: false, rowData: null, noteText: "" })
                }
                variant="outlined"
                sx={{ color: "#642b8f", borderColor: "#642b8f" }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeLeaveManagement;
