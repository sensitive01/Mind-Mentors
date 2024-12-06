import {
    Box,
    createTheme,
    Paper,
    ThemeProvider,
    Typography
  } from '@mui/material';
  import { DataGrid, GridToolbar } from '@mui/x-data-grid';
  import React, { useEffect, useState } from 'react';
import { getParentData } from '../../api/service/employee/EmployeeService';
  
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
    { field: 'sno', headerName: 'S.No', width: 80 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'whatsAppNumber', headerName: 'WhatsApp Number', width: 180 },
    { field: 'parentsEmail', headerName: "Parent's Email", width: 180 },
    { field: 'alternateWhatsAppNumber', headerName: 'Alternate WhatsApp Number', width: 180 },
    { field: 'alternateEmail', headerName: 'Alternate Email', width: 180 },
    { field: 'googleReviewSubmitted', headerName: 'Google Review Submitted', width: 200 },
    { field: 'addedTime', headerName: 'Added Time', width: 180 },
  ];
  
  const tasks = [
    {
      id: 1,
      sno: 1,
      name: 'John Doe',
      whatsAppNumber: '1234567890',
      parentsEmail: 'johndoe@email.com',
      alternateWhatsAppNumber: '0987654321',
      alternateEmail: 'johndoe@alternate.com',
      googleReviewSubmitted: 'Yes',
      addedTime: '2024-01-15',
    },
    {
      id: 2,
      sno: 2,
      name: 'Jane Smith',
      whatsAppNumber: '0987654321',
      parentsEmail: 'janesmith@email.com',
      alternateWhatsAppNumber: '1234567890',
      alternateEmail: 'janesmith@alternate.com',
      googleReviewSubmitted: 'No',
      addedTime: '2024-02-10',
    },
    // Add more rows as needed
  ];
  
  const Prospects = () => {
    const [rows, setRows] = useState(tasks); // Set the rows data

    useEffect(()=>{
      const fetchKidsData = async()=>{
        const response = await getParentData()
        console.log("parents",response)

      }
      fetchKidsData()

    },[])
  
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
              Parents Data
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
  