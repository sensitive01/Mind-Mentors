// columns.js
import { alpha } from "@mui/material/styles";
import {
 
  Fade,
 
  Box,
  Chip,
  Switch,
  IconButton,
  Tooltip,
  Typography,
 
} from "@mui/material";

import { HistoryIcon } from "lucide-react";

const columns = (
  theme,
  handleStatusToggle,
  setViewDialog,
  setNoteDialog,
  handleMoveProspects,
  handleShowLogs,
  handleShowStatus
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
    field: "contact",
    headerName: "Contact",
    width: 120,
    renderCell: (params) => (
      <Box sx={{ display: "flex", gap: 2 }}>
        {params.row.whatsappNumber && (
          <Tooltip title={params.row.whatsappNumber} arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                console.log("WhatsApp:", params.row.whatsappNumber);
              }}
              sx={{
                color: "#25D366", // WhatsApp green
                "&:hover": {
                  bgcolor: alpha("#25D366", 0.1),
                },
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </IconButton>
          </Tooltip>
        )}
        {params.row.email && (
          <Tooltip title={params.row.email} arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Email:", params.row.email);
              }}
              sx={{
                color: "#EA4335", // Gmail red
                "&:hover": {
                  bgcolor: alpha("#EA4335", 0.1),
                },
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </IconButton>
          </Tooltip>
        )}
      </Box>
    ),
  },
  {
    field: "lastNoteAction",
    headerName: "Status",
    width: 210,
    renderCell: (params) => {
      // Get the latest status or default value
      const lastStatus = params.row.lastNoteAction || "No Status";
      return (
        <Tooltip title={lastStatus} arrow>
          <Box
            onClick={() => handleShowStatus(params.row._id)}
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
              marginTop: "2px",

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
    field: "moveToProspect",
    headerName: "Move to Enquiry",
    width: 150,
    renderCell: (params) => (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleMoveProspects(params.row._id);
        }}
        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md 
                   transition-all duration-300 ease-in-out
                   border-2 border-transparent
                   hover:border-primary hover:border-2 hover:bg-white hover:text-primary"
      >
        {"Move to Enquiry"}
      </button>
    ),
  },

  {
    field: "disposition",
    headerName: "Last Log",
    width: 210,
    renderCell: (params) => {
      // Get the latest status or default value
      return (
        <Tooltip title={"Logs"} arrow>
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
              marginTop: "2px",

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
                {"Logs"}
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
];
export default columns;
