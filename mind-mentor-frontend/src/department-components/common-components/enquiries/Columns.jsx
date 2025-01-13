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
  Typography,
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
    field: "slNo",
    headerName: "Sl No.",
    width: 100,
    align: "center",
    headerAlign: "center",
    sortable: false, // Disable sorting for serial numbers
    filterable: false, // Disable filtering for serial numbers
  },

  {
    field: "parentFirstName",
    headerName: "Parent  Name",
    width: 180,
    editable: true,
  },

  {
    field: "kidFirstName",
    headerName: "Kid Name",
    width: 180,
    editable: true,
  },

  {
    field: "whatsappNumber",
    headerName: "WhatsApp Number",
    width: 180,
    editable: true,
  },
  {
    field: "disposition",
    headerName: "Status",
    width: 210,
    renderCell: (params) => {
      // Get the latest status or default value
      const lastStatus = params.row.latestAction || "No Status";
      return (
        <Tooltip title={lastStatus} arrow >
          <Box
            onClick={() => handleShowLogs(params.row._id)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              color: theme.palette.primary.main,
              padding: "6px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              width: "95%",
              border: "2px solid",
              borderColor: alpha(theme.palette.primary.main, 0.5),
              transition: "all 0.2s ease-in-out",
              position: "relative",
              overflow: "hidden",
              marginTop:"2px",

              // Hover effects
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                borderColor: alpha(theme.palette.primary.main, 0.3),
                transform: "translateY(-1px)",
                boxShadow: `0 4px 8px ${alpha(
                  theme.palette.primary.main,
                  0.15
                )}`,

                // Icon rotation on hover
                "& .history-icon": {
                  transform: "rotate(-20deg)",
                },

                // Badge glow effect
                "& .status-badge": {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                },
              },

              // Active state
              "&:active": {
                transform: "translateY(0)",
                boxShadow: "none",
              },
            }}
          >
            {/* Status Icon */}
            <Box
              className="status-badge"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: "6px",
                padding: "4px",
                transition: "all 0.2s ease",
              }}
            >
              <HistoryIcon
                size={16}
                className="history-icon"
                style={{
                  transition: "transform 0.2s ease",
                }}
              />
            </Box>

            {/* Status Text */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  color: "primary",
                  textTransform: "capitalize",
                  display: "block",
                  lineHeight: 1.2,
                }}
              >
                {lastStatus}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.65rem",
                  color: theme.palette.text.secondary,
                  display: "block",
                  lineHeight: 1.2,
                }}
              >
                Click to view history
              </Typography>
            </Box>

            {/* Subtle Arrow Indicator */}
            <Box
              sx={{
                opacity: 0.5,
                transition: "transform 0.2s ease",
                transform: "translateX(-4px)",
                ".MuiBox-root:hover &": {
                  transform: "translateX(0)",
                  opacity: 0.8,
                },
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Box>
          </Box>
        </Tooltip>
      );
    },
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
            className="status-update-btn"
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
    valueFormatter: (params) => params.value,
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
    field: "moveToProspect",
    headerName: "Move to Prospects",
    width: 150,
    renderCell: (params) => (
      <Fade in={true}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: params.row.isProspect ? "#1D4ED8" : "#64748B",
            padding: "4px 12px",
            borderRadius: "20px",
            transition: "all 0.3s ease",
          }}
        >
          {params.row.isProspect ? "Prospect" : "Enquiry"}
          <Switch
            size="small"
            checked={params.row.isProspect}
            onChange={() => handleMoveProspects(params.row._id)}
            onClick={(e) => e.stopPropagation()}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#1D4ED8",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#1D4ED8",
              },
            }}
          />
        </Box>
      </Fade>
    ),
  },
];
export default columns;
