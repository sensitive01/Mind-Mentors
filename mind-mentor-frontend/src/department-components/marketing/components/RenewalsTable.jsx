import {
  Box,
  createTheme,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useState } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f", // Indigo
      light: "#818CF8",
      dark: "#4F46E5",
    },
    background: {
      default: "#F1F5F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "none",
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
        },
      },
    },
  },
});

const columns = [
  { field: "sno", headerName: "S.No", width: 80 },
  { field: "rollNo", headerName: "Roll No", width: 120 },
  { field: "name", headerName: "Name", width: 180 },
  { field: "parentName", headerName: "Parent Name", width: 180 },
  { field: "allottedCentre", headerName: "Allotted Centre", width: 180 },
  {
    field: "physicalCentreAccess",
    headerName: "Physical Centre Access",
    width: 180,
  },
  { field: "coach", headerName: "Coach", width: 180 },
  { field: "classesRemaining", headerName: "Classes Remaining", width: 180 },
  {
    field: "classesExpirationDate",
    headerName: "Classes Expiration Date",
    width: 180,
  },
  {
    field: "lastClassAttendedDate",
    headerName: "Last Class Attended Date",
    width: 180,
  },
  { field: "renewalSent", headerName: "Renewal Sent", width: 180 },
  { field: "lastRenewedAmount", headerName: "Last Renewed Amount", width: 180 },
  {
    field: "classesAttendedAfterLastRenewal",
    headerName: "Classes Attended After Last Renewal",
    width: 250,
  },
  { field: "country", headerName: "Country", width: 150 },
  {
    field: "lastInteractionTime",
    headerName: "Last Interaction Time",
    width: 180,
  },
];



const Prospects = () => {
  const [rows, setRows] = useState(); // Set the rows data

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
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: "text.primary",
              fontWeight: 600,
              mb: 3,
            }}
          >
            Renewals Data
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              height: 500, // Fixed height for the table
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.action.hover,
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
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Prospects;
