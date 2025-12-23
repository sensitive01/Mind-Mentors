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

import { Bold, HistoryIcon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { makeCallToParent } from "../../../api/service/employee/EmployeeService";

const columns = (
  theme,
  handleStatusToggle,
  handleMoveProspects,
  handleShowLogs,
  handleShowStatus,
  handleMessage,
  handleDelete
) => [
  {
    field: "slNo",
    headerName: "Sno",

    width: 50,
    align: "center",
    headerAlign: "center",
    sortable: false, // Disable sorting for serial numbers
    filterable: false, // Disable filtering for serial numbers
    renderHeader: () => <strong>Sno</strong>,
  },
  {
    field: "parentFirstName",
    headerName: "Parent Name",
    width: 180,
    editable: true,
    renderHeader: () => <strong>Parent Name</strong>,
    renderCell: (params) => (
      <Box sx={{ display: "flex", flexDirection: "column", marginTop: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontSize: "0.65rem",
            opacity: 0.9,
            lineHeight: 1.5,
          }}
        >
          {params.row.createdAt}
        </Typography>
      </Box>
    ),
  },

  {
    field: "kidFirstName",
    headerName: "Kid Name",
    width: 180,
    editable: true,
    renderHeader: () => <strong>Kid Name</strong>,
  },
  {
    field: "contact",
    headerName: "Contact",

    renderHeader: () => <strong>Contact</strong>,

    width: 100,
    renderCell: (params) => (
      <Box sx={{ display: "flex", gap: 2, marginTop: "7px" }}>
        {params.row.whatsappNumber && (
          <IconButton
            size="small"
            onClick={async (e) => {
              e.stopPropagation();
              handleMessage(params.row.whatsappNumber);
            }}
            sx={{
              color: "#00FF00",
              padding: "8px",
              "&:hover": {
                backgroundColor: "#FFFFFF ",
              },
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </IconButton>
        )}

        {params.row.contactNumber && (
          <IconButton
            size="small"
            onClick={async (e) => {
              e.stopPropagation();
              const contactNumber = params.row.contactNumber;
              try {
                // Using the existing makeCall function from your imported utils/secretApi
                const response = await makeCallToParent(contactNumber);

                console.log("calling response", response);

                if (response.success) {
                  toast.success("Call initiated successfully!");
                } else {
                  toast.error("Failed to initiate call");
                }
              } catch (error) {
                console.error("Error calling contact:", error);
                toast.error("Failed to initiate call");
              }
            }}
            sx={{
              color: "#00FF00",
              padding: "8px",
              "&:hover": {
                backgroundColor: "#FFFFFF",
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
              <path d="M22 16.92V21a2 2 0 01-2.18 2A19.88 19.88 0 013 4.18 2 2 0 015 2h4.09a2 2 0 012 1.72c.1.81.4 2.38.57 3.05a2 2 0 01-.45 1.95L9.91 10.09a16 16 0 006.09 6.09l1.37-1.37a2 2 0 011.95-.45c.67.17 2.24.47 3.05.57a2 2 0 011.72 2.09z" />
            </svg>
          </IconButton>
        )}
      </Box>
    ),
  },

  {
    field: "programs",
    renderHeader: () => <strong>Programs</strong>,
    width: 150,
    renderCell: (params) => {
      const programs = params.row.programs || [];

      return (
        <Box>
          {programs.map((prog, index) => (
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
      );
    },
  },

  {
    field: "lastNoteAction",
    headerName: "Status",
    renderHeader: () => <strong>Status</strong>,

    width: 210,
    renderCell: (params) => {
      // Get the latest status or default value
      const lastStatus = params.row.lastNoteAction || "No Status";
      const date = params.row.createdOn || "N/A";
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
                {date}
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
    renderHeader: () => <strong>Type</strong>,

    width: 120,
    renderCell: (params) => (
      <Fade in={true}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: params.value === "cold" ? "#3B82F6" : "#F59E0B",
            padding: "4px 12px",
            borderRadius: "20px",
            transition: "all 0.3s ease",
          }}
        >
          {params.value}
          <Switch
            size="small"
            checked={params.value === "cold"}
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
    headerName: "Move to Prospects",
    renderHeader: () => <strong>Move to Prospects</strong>,
    width: 170,
    renderCell: (params) => {
      const isDisabled = false;

      return (
        <Tooltip
          title={
            isDisabled
              ? "Set enquiry type to 'cold' first"
              : "Move to prospects"
          }
          arrow
        >
          <span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMoveProspects(params.row._id);
              }}
              className={`px-4 py-1 text-sm font-medium rounded-md 
              transition-all duration-300 ease-in-out
              border-2 ${
                isDisabled
                  ? "bg-gray-200 text-gray-600 border-gray-300 cursor-not-allowed opacity-50"
                  : "text-white bg-primary border-2 border-primary hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg"
              }`}
              disabled={isDisabled}
            >
              Move to Prospects
            </button>
          </span>
        </Tooltip>
      );
    },
  },

  {
    field: "disposition",
    renderHeader: () => <strong>Last Log</strong>,

    width: 150,
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
    field: "actions",
    headerName: "Actions",
    width: 100,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Tooltip title="Delete Enquiry" arrow>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row._id);
            }}
            sx={{
              color: "#ff4444",
              "&:hover": {
                backgroundColor: alpha("#ff4444", 0.1),
              },
            }}
            size="small"
          >
            <Trash2 size={18} />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
];
export default columns;
