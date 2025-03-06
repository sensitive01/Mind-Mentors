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

const transactionColumns = [
  { field: "transactionId", headerName: "Transaction ID", width: 150 },
  { field: "employeeName", headerName: "Employee Name", width: 200 },
  { field: "transactionType", headerName: "Transaction Type", width: 150 },
  { field: "amount", headerName: "Amount", width: 150 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "date", headerName: "Date", flex: 1 },
];

const transactionData = [
  {
    id: 1,
    transactionId: "T001",
    employeeName: "John Doe",
    transactionType: "Credit",
    amount: "₹10,000",
    status: "Completed",
    date: "2024-12-01",
  },
  {
    id: 2,
    transactionId: "T002",
    employeeName: "Jane Smith",
    transactionType: "Debit",
    amount: "₹5,000",
    status: "Pending",
    date: "2024-11-30",
  },
  // Add more rows as needed
];

const TransactionDetailsTable = () => {
  const [rows, setRows] = useState(transactionData);

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
            Transaction Details
          </Typography>
          <DataGrid
            rows={rows}
            columns={transactionColumns}
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

export default TransactionDetailsTable;
