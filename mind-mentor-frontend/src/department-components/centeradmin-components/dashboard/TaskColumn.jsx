// columns.js
import HistoryIcon from "@mui/icons-material/History";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Chip,
  Fade,
  Grow,
  IconButton,
  MenuItem,
  Select,
  Zoom,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

const columns = (
  theme,
  handleStatusToggle,
  setViewDialog,
  setNoteDialog,
  setLogDialog,
  navigate
) => [
  {
    field: "createdAt",
    headerName: "Created At",
    width: 150,
    editable: true,
  },
  {
    field: "taskTime",
    headerName: "Task Due Date & Time",
    width: 180,
    editable: true,
  },
  {
    field: "task",
    headerName: "Task",
    width: 250,
    editable: true,
  },
  {
    field: "assignedBy",
    headerName: "Assigned By",
    width: 250,
    editable: false,
    valueGetter: (params) => {
      const assignedBy = `${params.name} - ${params.email}`;

      return `${assignedBy}`;
    },
  },
  {
    field: "assignedTo",
    headerName: "Assigned Role",
    width: 200,
    renderCell: (params) => (
      <Zoom in={true}>
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          }}
        />
      </Zoom>
    ),
  },
  {
    field: "status",
    headerName: "Task Status",
    width: 180,
    renderCell: (params) => (
      <Fade in={true}>
        <Select
          value={params.value}
          onChange={(event) =>
            handleStatusToggle(params.row._id, event.target.value)
          }
          sx={{
            backgroundColor: "#f4f4f4",
            borderRadius: "8px",
            fontSize: "0.875rem",
            "& .MuiSelect-select": { padding: "4px 8px" },
          }}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="InCompleted">InCompleted</MenuItem>
          <MenuItem value="Reassigned">Reassigned</MenuItem>
        </Select>
      </Fade>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 200, // Increased width to accommodate the new button
    renderCell: (params) => (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Grow in={true}>
          <IconButton
            size="small"
            onClick={() => setViewDialog({ open: true, rowData: params.row })}
            sx={{
              color: "#F59E0B",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Grow>
        <Grow in={true}>
          <IconButton
            size="small"
            onClick={() => setNoteDialog({ open: true, rowData: params.row })}
            sx={{
              color: "#642b8f",
              "&:hover": {
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
              },
            }}
          >
            <NoteAddIcon fontSize="small" />
          </IconButton>
        </Grow>
        <Grow in={true}>
          <IconButton
            size="small"
            onClick={() => {
              setLogDialog({ open: true, rowData: params.row });
              navigate(`/centeradmin/taskslogs/${params.row._id}`); // Pass the ID dynamically
            }}
            sx={{
              color: "#000",
              "&:hover": {
                backgroundColor: alpha(theme.palette.info.main, 0.1),
              },
            }}
          >
            <HistoryIcon fontSize="small" />
          </IconButton>
        </Grow>
      </Box>
    ),
  },
];

export default columns;
