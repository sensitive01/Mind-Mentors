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
  { field: "rollNo", headerName: "Roll No.", width: 100 },
  { field: "name", headerName: "Name", width: 180 },
  { field: "chessKidID", headerName: "ChessKid ID", width: 150 },
  { field: "parents", headerName: "Parents", width: 200 },
  { field: "whatsappNumber", headerName: "WhatsApp Number", width: 160 },
  { field: "parentsEmail", headerName: "Parents Email", width: 200 },
  {
    field: "goldEnabledTime",
    headerName: "ChessKid Gold Enabled Time",
    width: 230,
  },
  {
    field: "goldExpirationDate",
    headerName: "ChessKid Gold Expiration Date",
    width: 230,
  },
];

const tasks = [
  {
    id: 1,
    rollNo: "001",
    name: "John Doe",
    chessKidID: "CK001",
    parents: "Mr. and Mrs. Doe",
    whatsappNumber: "+1234567890",
    parentsEmail: "doe@example.com",
    goldEnabledTime: "2023-12-01",
    goldExpirationDate: "2024-12-01",
  },
  {
    id: 2,
    rollNo: "002",
    name: "Jane Smith",
    chessKidID: "CK002",
    parents: "Mr. and Mrs. Smith",
    whatsappNumber: "+0987654321",
    parentsEmail: "smith@example.com",
    goldEnabledTime: "2024-01-15",
    goldExpirationDate: "2025-01-15",
  },
  // Add more rows as needed
];

const KidsTable = () => {
  const [rows, setRows] = useState(tasks);

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
            Enrollment Data
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
              height: 500,
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

export default KidsTable;
