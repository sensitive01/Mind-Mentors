// columns.js
import { alpha } from "@mui/material/styles";
import {
  Zoom,
  Fade,
  Grow,
  Box,
  Chip,
  Switch,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { DownloadIcon, HistoryIcon } from "lucide-react";
import { formatDateOnly } from "../../../utils/formatDateOnly";

const columns = (
  theme,
  handleStatusToggle,
  setViewDialog,
  setNoteDialog,
  handleMoveProspects,
  handleShowLogs
) => [
  {
    field: "parentFirstName",
    headerName: "Parent First Names",
    width: 180,
    editable: true,
  },
  {
    field: "parentLastName",
    headerName: "Parent Last Name",
    width: 180,
    editable: true,
  },
  {
    field: "kidFirstName",
    headerName: "Kid First Name",
    width: 180,
    editable: true,
  },
  {
    field: "kidLastName",
    headerName: "Kid Last Name",
    width: 180,
    editable: true,
  },
  {
    field: "kidsAge",
    headerName: "Kid Age",
    type: "number",
    width: 100,
    editable: true,
  },
  {
    field: "kidsGender",
    headerName: "Kid Gender",
    width: 120,
    editable: true,
  },
  {
    field: "whatsappNumber",
    headerName: "WhatsApp Number",
    width: 180,
    editable: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
    editable: true,
  },
  {
    field: "message",
    headerName: "Message",
    width: 250,
    editable: true,
  },
  {
    field: "source",
    headerName: "Source",
    width: 150,
    editable: true,
  },
  {
    field: "programs",
    headerName: "Programs",
    width: 250,
    renderCell: (params) => (
      <Box in={true}>
        {params.value.map((prog, index) => (
          <Chip
            key={index}
            label={`${prog.program} (${prog.level})`}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              marginRight: 1,
            }}
          />
        ))}
      </Box>
    ),
  },
  {
    field: "schoolName",
    headerName: "School Name",
    width: 200,
    editable: true,
  },
  {
    field: "address",
    headerName: "Address",
    width: 250,
    editable: true,
  },
  {
    field: "schoolPincode",
    headerName: "School Pincode",
    width: 150,
    editable: true,
  },

  {
    field: "enquiryType",
    headerName: "Type",
    width: 150,
    renderCell: (params) => (
      <Fade in={true}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: params.value === "warm" ? "#F59E0B" : "#642b8f",
            padding: "4px 12px",
            borderRadius: "20px",
            transition: "all 0.3s ease",
          }}
        >
          {params.value}
          <Switch
            size="small"
            checked={params.value === "warm"}
            onChange={() => handleStatusToggle(params.row._id)}
            onClick={(e) => e.stopPropagation()}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#642b8f",
                "&:hover": {
                  // backgroundColor: alpha(theme.palette.warm.main, 0.1),
                },
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                // backgroundColor: theme.palette.warm.main,
              },
            }}
          />
        </Box>
      </Fade>
    ),
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    valueFormatter: (params) => formatDateOnly(params.value),
  },
 
  {
    field: "actions",
    headerName: "Actions",
    width: 250,
    renderCell: (params) => (
      <Box
        sx={{ display: "flex", gap: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
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

        {/* Add Note Button */}
        <Grow in={true} style={{ transformOrigin: "0 0 0" }}>
          <IconButton
            size="small"
            onClick={() => {
              setViewDialog({ open: false, rowData: null });
              setNoteDialog({
                open: true,
                rowData: params.row,
                noteText: params.row.notes || "",
                disposition: params.row.disposition || "None", // Use current disposition
                enquiryStatus: params.row.enquiryStatus || "Pending" 
              });
            }}
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

        {/* Move to Prospects Button */}
        <Grow in={true}>
          <Tooltip title="Move to Prospects" arrow>
            <IconButton
              size="small"
              onClick={() => handleMoveProspects(params.row._id)}
              sx={{
                color: "#1D4ED8",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                },
              }}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grow>

        {/* Logs Button */}
        <Grow in={true}>
          <Tooltip title="Logs" arrow>
            <IconButton
              size="small"
              onClick={() => handleShowLogs(params.row._id)} // Add your logs handler function here
              sx={{
                color: "#0F172A",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.text.primary, 0.1),
                },
              }}
            >
              <HistoryIcon fontSize="small" />{" "}
              {/* Use any relevant icon for logs */}
            </IconButton>
          </Tooltip>
        </Grow>
      </Box>
    ),
  },
];
export default columns;
