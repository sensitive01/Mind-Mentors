import { Typography } from "@mui/material";
import { Box, Fade, MenuItem, Select, Zoom } from "@mui/material";

const columns = (theme, handleStatusToggle) => [
  {
    field: "slNo",
    headerName: "Sno",
    width: 100,
    renderCell: (params) => params.value,
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
    renderCell: (params) => (
      <Zoom in={true}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 0.5,
            width: "100%",
            height: "100%",
          }}
        >
          <Typography variant="body2" sx={{ color: "black", textTransform: "none" }}>
            {params.row.assignedBy.name}
          </Typography>
          {params.row.assignedBy && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 200,
                color: "black",
                textTransform: "none",
                margin: 0,
              }}
            >
              department: {params.row.assignedBy.department}
            </Typography>
          )}
        </Box>
      </Zoom>
    ),
  },
  {
    field: "assignedToName",
    headerName: "Assigned To",
    width: 250,
    renderCell: (params) => (
      <Zoom in={true}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 0.5,
            width: "100%",
            height: "100%",
          }}
        >
          <Typography variant="body2" sx={{ color: "black", textTransform: "none" }}>
            {params.row.assignedToName}
          </Typography>
          {params.row.assignedTodepartment && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 200,
                color: "black",
                textTransform: "none",
                margin: 0,
              }}
            >
              department: {params.row.assignedTodepartment}
            </Typography>
          )}
        </Box>
      </Zoom>
    ),
  },
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
    field: "status",
    headerName: "Task Status",
    width: 150,
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
            color: "black",
            "& .MuiSelect-select": {
              padding: "8px 12px",
              textTransform: "none",
            },
          }}
        >
          <MenuItem value="Pending" sx={{ color: "black" }}>
            Pending
          </MenuItem>
          <MenuItem value="In Progress" sx={{ color: "black" }}>
            In Progress
          </MenuItem>
          <MenuItem value="Completed" sx={{ color: "black" }}>
            Completed
          </MenuItem>
          <MenuItem value="InCompleted" sx={{ color: "black" }}>
            InCompleted
          </MenuItem>
          <MenuItem value="Reassigned" sx={{ color: "black" }}>
            Reassigned
          </MenuItem>
        </Select>
      </Fade>
    ),
  },
];

export default columns;