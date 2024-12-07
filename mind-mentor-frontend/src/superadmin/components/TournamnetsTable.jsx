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
  
  const tournamentColumns = [
    { field: 'tournamentId', headerName: 'Tournament ID', width: 150 },
    { field: 'tournamentName', headerName: 'Tournament Name', width: 200 },
    { field: 'organizerName', headerName: 'Organizer Name', width: 200 },
    { field: 'tournamentType', headerName: 'Tournament Type', width: 150 },
    { field: 'entryFee', headerName: 'Entry Fee', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'startDate', headerName: 'Start Date', width: 150 },
    { field: 'endDate', headerName: 'End Date', width: 150 },
    { field: 'location', headerName: 'Location', width: 200 },
  ];
  
  const tournamentData = [
    {
      id: 1,
      tournamentId: 'C001',
      tournamentName: 'Rapid Chess Open',
      organizerName: 'John Doe',
      tournamentType: 'Rapid',
      entryFee: '₹500',
      status: 'Ongoing',
      startDate: '2024-12-01',
      endDate: '2024-12-02',
      location: 'New Delhi',
    },
    {
      id: 2,
      tournamentId: 'C002',
      tournamentName: 'Blitz Challenge',
      organizerName: 'Jane Smith',
      tournamentType: 'Blitz',
      entryFee: '₹300',
      status: 'Completed',
      startDate: '2024-11-30',
      endDate: '2024-12-01',
      location: 'Mumbai',
    },
    // Add more rows as needed
  ];
  
  const TournamentDetailsTable = () => {
    const [rows, setRows] = useState(tournamentData);
  
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
              Tournament Details
            </Typography>
            <DataGrid
              rows={rows}
              columns={tournamentColumns}
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
                height: 500,
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
  
  export default TournamentDetailsTable;
  