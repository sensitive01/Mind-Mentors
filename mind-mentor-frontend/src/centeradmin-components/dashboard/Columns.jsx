// columns.js
import { alpha } from "@mui/material/styles";
import {  Fade, Grow, Box, Chip, Switch, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

const columns = (theme, handleStatusToggle, setViewDialog, setNoteDialog) => [
  {
    field: "parentFirstName",
    headerName: "Parent Name",
    width: 180,
    editable: true,
  },
  // {
  //   field: "parentLastName",
  //   headerName: "Parent Last Name",
  //   width: 180,
  //   editable: true,
  // },
  {
    field: "kidFirstName",
    headerName: "Kid Name",
    width: 180,
    editable: true,
  },
  // {
  //   field: "kidLastName",
  //   headerName: "Kid Last Name",
  //   width: 180,
  //   editable: true,
  // },
  {
    field: "kidsAge",
    headerName: "Age",
    type: "number",
    width: 80,
    editable: true,
  },
  {
    field: "kidsGender",
    headerName: "Gender",
    width: 80,
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
    field: 'enquiryStatus',
    headerName: 'Status',
    width: 150,
    renderCell: (params) => (
      <Fade in={true}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
                       color: params.value === 'warm'
              ? '#F59E0B'
              : '#642b8f',
            padding: '4px 12px',
            borderRadius: '20px',
            transition: 'all 0.3s ease',
          }}
        >
          {params.value}
          <Switch
            size="small"
            checked={params.value === 'warm'}
            onChange={() => handleStatusToggle(params.row._id)}
            onClick={(e) => e.stopPropagation()}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#642b8f',
                '&:hover': {
                  // backgroundColor: alpha(theme.palette.warm.main, 0.1),
                },
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                // backgroundColor: theme.palette.warm.main,
              },
            }}
          />
        </Box>
      </Fade>
    ),
  },
  // {
  //   field: "createdAt",
  //   headerName: "Created At",
  //   width: 200,
  //   valueFormatter: (params) => new Date(params.value).toLocaleString(),
  // },

  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
      <Box
        sx={{ display: "flex", gap: 1 }}
        onClick={(e) => e.stopPropagation()} // Prevent row-wide click
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
        <Grow in={true} style={{ transformOrigin: "0 0 0" }}>
          <IconButton
            size="small"
            onClick={() => {
              setViewDialog({ open: false, rowData: null });
              setNoteDialog({
                open: true,
                rowData: params.row,
                noteText: params.row.notes || "",
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
      </Box>
    ),
  },
];
export default columns;


