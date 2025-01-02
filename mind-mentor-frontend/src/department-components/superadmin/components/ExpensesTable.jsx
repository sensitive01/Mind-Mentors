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

const expenseColumns = [
  { field: "expenseId", headerName: "Expense ID", width: 150 },
  { field: "category", headerName: "Category", width: 200 },
  { field: "description", headerName: "Description", width: 300 },
  { field: "amount", headerName: "Amount", width: 150 },
  { field: "date", headerName: "Date", width: 180 },
];

const expenseData = [
  {
    id: 1,
    expenseId: "E001",
    category: "Office Supplies",
    description: "Purchased stationery for office use.",
    amount: "₹2,000",
    date: "2024-12-01",
  },
  {
    id: 2,
    expenseId: "E002",
    category: "Travel",
    description: "Flight tickets for client meeting.",
    amount: "₹15,000",
    date: "2024-11-28",
  },
  // Add more rows as needed
];

const ExpensesDetailsTable = () => {
  const [rows, setRows] = useState(expenseData);

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
            Expenses Details
          </Typography>
          <DataGrid
            rows={rows}
            columns={expenseColumns}
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

export default ExpensesDetailsTable;
