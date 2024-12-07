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
    { field: 'notificationId', headerName: 'Notification ID', width: 120 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'message', headerName: 'Message', width: 300 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'date', headerName: 'Date', width: 180 },
    { field: 'status', headerName: 'Status', width: 120 },
  ];
  
  const notifications = [
    {
      id: 1,
      notificationId: 'N001',
      title: 'Payment Reminder',
      message: 'Your payment is due on 2024-12-10.',
      type: 'Reminder',
      date: '2024-12-01',
      status: 'Unread',
    },
    {
      id: 2,
      notificationId: 'N002',
      title: 'New Feature Update',
      message: 'Check out the latest features in our app.',
      type: 'Update',
      date: '2024-11-30',
      status: 'Read',
    },
    // Add more notifications as needed
  ];
  
  const Notifications = () => {
    const [rows, setRows] = useState(notifications);
  
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
              Notifications Data
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
  
  export default Notifications;
