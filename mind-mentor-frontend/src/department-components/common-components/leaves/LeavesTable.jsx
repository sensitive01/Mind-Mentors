import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
  Box,
  Button,
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

const columns = (theme, handleStatusToggle, setViewDialog, setNoteDialog) => [
  {
    field: "slNo",
    headerName: "Sl No",
    width: 100,
    renderCell: (params) => params.value,
  },
  { field: "employeeName", headerName: "Employee", width: 150 },
  { field: "leaveType", headerName: "Leave Type", width: 150 },
  { field: "leaveStartDate", headerName: "Leave Start Date", width: 180 },
  { field: "leaveEndDate", headerName: "Leave End Date", width: 180 },
  { field: "status", headerName: "Status", width: 120 },
  {
    field: "notes",
    headerName: "Notes",
    width: 120,
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
      >
        View
      </Button>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
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
          label="Approve"
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
    width: 200,
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
  { field: "createdAt", headerName: "Created At", width: 180 },
];

const DetailView = ({ data }) => {
  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Specific fields to display
  const fieldsToShow = [
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'leaveType', label: 'Leave Type' },
    { key: 'leaveStartDate', label: 'Leave Start Date' },
    { key: 'leaveEndDate', label: 'Leave End Date' },
    { key: 'notes', label: 'Notes' },
    { key: 'proof', label: 'Proof' },
    { key: 'createdAt', label: 'Created At' }
  ];

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      {fieldsToShow.map((field) => (
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
              {field.key === 'createdAt' 
                ? formatDate(data[field.key])
                : (data[field.key] || 'N/A')}
            </Typography>
          </Box>
        </Grid>
      ))}
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

        // Add serial numbers to the formatted leaves
        const leavesWithSerialNumbers = response.formattedLeaves.map(
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
              Employee Leave Management
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
    Leave Request Details
    <Button
      onClick={() => setViewDialog({ open: false, rowData: null })}
      variant="outlined"
      sx={{ 
        color: "#f8a213", 
        borderColor: "#f8a213",
        marginLeft: 2
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
                background: "linear-gradient(#6366F1, #818CF8)",
                color: "#ffffff",
                fontWeight: 600,
              }}
            >
              Add Note
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
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleNoteSave}
                variant="contained"
                sx={{ backgroundColor: "#EC4899" }}
              >
                Save
              </Button>
              <Button
                onClick={() =>
                  setNoteDialog({ open: false, rowData: null, noteText: "" })
                }
                variant="outlined"
                sx={{ color: "#6366F1", borderColor: "#6366F1" }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeLeaveManagement;
