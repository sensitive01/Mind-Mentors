import {
    Box,
    createTheme,
    Paper,
    ThemeProvider,
    Typography
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useState } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#642b8f', // Indigo
    // main: '#f8a213', // Indigo
      light: '#818CF8',
      dark: '#4F46E5',
    },
    background: {
      default: '#F1F5F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: 'none',
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
        },
      },
    },
  },
});

const columns = [
  { field: 'sno', headerName: 'S.No', width: 80 },
  { field: 'cheddKidID', headerName: 'CheddKid ID', width: 120 },
  { field: 'parentName', headerName: 'Parent Name', width: 180 },
  { field: 'contactNumber', headerName: 'Contact Number', width: 180 },
  { field: 'subscriptionDate', headerName: 'Subscription Date', width: 180 },
  { field: 'amount', headerName: 'Amount', width: 180 },
  { field: 'invoice', headerName: 'Invoice', width: 180 },
];

const tasks = [
  {
    id: 1,
    sno: 1,
    cheddKidID: 'CK001',
    parentName: 'John Doe',
    contactNumber: '1234567890',
    subscriptionDate: '2024-01-15',
    amount: '1000',
    invoice: 'INV123',
  },
  {
    id: 2,
    sno: 2,
    cheddKidID: 'CK002',
    parentName: 'Jane Smith',
    contactNumber: '0987654321',
    subscriptionDate: '2024-02-10',
    amount: '1200',
    invoice: 'INV124',
  },
  // Add more rows as needed
];

const Prospects = () => {
  const [rows, setRows] = useState([]);

//   useEffect(() => {
//     setRows(tasks); // Load tasks into state
//   }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%', height: '100%', p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: 'background.paper',
            borderRadius: 3,
            height: 650,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 3,
            }}
          >
            Invoices Data
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
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

              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#642b8f',
                color: 'white',
                fontWeight: 600,
              },
              '& .MuiCheckbox-root.Mui-checked': {
                color: '#FFFFFF',
              },
              '& .MuiDataGrid-columnHeader .MuiCheckbox-root': {
                color: '#FFFFFF',
              },
            }}
          />
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Prospects;
