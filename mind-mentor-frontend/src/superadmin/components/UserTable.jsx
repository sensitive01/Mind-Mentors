import {
    Box,
    createTheme,
    Paper,
    ThemeProvider,
    Typography,
    Button
  } from '@mui/material';
  import { DataGrid, GridToolbar } from '@mui/x-data-grid';
  import React, { useState } from 'react';
  import { Link } from 'react-router-dom';

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
  
  // Updated columns to reflect user data
  const columns = [
    { field: 'userId', headerName: 'User  ID', width: 120 },
    { field: 'userName', headerName: 'User  Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
    { field: 'dateOfBirth', headerName: 'Date of Birth', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(params.row.id)}
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];
  
  // Sample user data
  const data = [
    {
      id: 1,
      userId: 'U001',
      userName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '+91-1234567890',
      dateOfBirth: '1990-01-01',
    },
    {
      id: 2,
      userId: 'U002',
      userName: 'Jane Smith',
      email: 'jane@example.com',
      phoneNumber: '+91-0987654321',
      dateOfBirth: '1992-02-02',
    },
    // Add more rows as needed
  ];
  
  const AllowancesAndDeductionsTable = () => {
    const [rows, setRows] = useState(data);
  
    const handleEdit = (row) => {
      // Implement edit functionality
      console.log('Edit user:', row);
      // You can redirect to an edit form or open a modal here
    };
  
    const handleDelete = (id) => {
      // Implement delete functionality
      const updatedRows = rows.filter((row) => row.id !== id);
      setRows(updatedRows);
      console.log('Deleted user with ID:', id);
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
            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" gutterBottom sx={{ color: '#000', fontWeight: 600, mb: 3 }}>
            Users Data
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/users/add"
            >
              + Add Users
            </Button>
          </Box>

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
                '& .Mui DataGrid-cell:focus': {
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
  
  export default AllowancesAndDeductionsTable;