import {
    Box,
    createTheme,
    Paper,
    ThemeProvider,
    Typography,
    Switch,
    FormControlLabel,
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
    { field: 'rollNo', headerName: 'Roll No.', width: 100 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'age', headerName: 'Age', width: 100 },
    { field: 'enrolledCentre', headerName: 'Enrolled Centre', width: 200 },
    { field: 'allottedCentre', headerName: 'Allotted Centre', width: 200 },
    { field: 'country', headerName: 'Country', width: 150 },
    { field: 'classesRemaining', headerName: 'Classes Remaining', width: 160 },
    {
      field: 'rubiks',
      headerName: "Rubik's?",
      width: 120,
      renderCell: (params) => (params.value ? 'Yes' : 'No'),
    },
    {
      field: 'activeProfile',
      headerName: 'Active Profile?',
      width: 180,
      renderCell: (params) => (
        <FormControlLabel
          control={
            <Switch
              checked={params.value.active}
              onChange={() => params.value.toggleStatus(params.id)}
              color="primary"
            />
          }
          label={params.value.active ? 'Active' : 'Inactive'}
        />
      ),
    },
  ];
  
  const initialRows = [
    {
      id: 1,
      rollNo: '001',
      name: 'John Doe',
      age: 12,
      enrolledCentre: 'Centre A',
      allottedCentre: 'Centre B',
      country: 'USA',
      classesRemaining: 5,
      rubiks: true,
      activeProfile: { active: true, toggleStatus: null },
    },
    {
      id: 2,
      rollNo: '002',
      name: 'Jane Smith',
      age: 14,
      enrolledCentre: 'Centre B',
      allottedCentre: 'Centre C',
      country: 'India',
      classesRemaining: 8,
      rubiks: false,
      activeProfile: { active: false, toggleStatus: null },
    },
  ];
  
  const Prospects = () => {
    const [rows, setRows] = useState(
      initialRows.map((row) => ({
        ...row,
        activeProfile: {
          ...row.activeProfile,
          toggleStatus: (id) => toggleStatus(id),
        },
      }))
    );
  
    const toggleStatus = (id) => {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id
            ? {
                ...row,
                activeProfile: {
                  ...row.activeProfile,
                  active: !row.activeProfile.active,
                },
              }
            : row
        )
      );
    };
  
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
              Program Enrollment Data
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
  
  export default Prospects;
  