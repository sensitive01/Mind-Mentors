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
    { field: 'holidayId', headerName: 'Holiday ID', width: 150 },
    { field: 'holidayName', headerName: 'Holiday Name', width: 200 },
    { field: 'startDate', headerName: 'Start Date', width: 180 },
    { field: 'endDate', headerName: 'End Date', width: 180 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'status', headerName: 'Status', width: 120 },
  ];
  
  const holidays = [
    {
      id: 1,
      holidayId: 'H001',
      holidayName: 'Christmas',
      startDate: '2024-12-25',
      endDate: '2024-12-25',
      description: 'Celebration of Christmas holiday.',
      status: 'Approved',
    },
    {
      id: 2,
      holidayId: 'H002',
      holidayName: 'New Year',
      startDate: '2025-01-01',
      endDate: '2025-01-01',
      description: 'New Year celebration.',
      status: 'Pending',
    },
    // Add more holidays as needed
  ];
  
  const HolidayManagement = () => {
    const [rows, setRows] = useState(holidays);
  
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
              Holiday Management
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
  
  export default HolidayManagement;
  