import {
    Box,
    Paper,
    ThemeProvider,
    Typography,
    createTheme,
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

const feedbackColumns = [
  { field: 'sno', headerName: 'S.No', width: 80 },
  { field: 'studentID', headerName: 'Student ID', width: 120 },
  { field: 'studentName', headerName: 'Student Name', width: 180 },
  { field: 'coachName', headerName: 'Coach Name', width: 180 },
  { field: 'sessionDate', headerName: 'Session Date', width: 150 },
  { field: 'feedback', headerName: 'Feedback', width: 250 },
  { field: 'remarks', headerName: 'Remarks', width: 200 },
];

const feedbackData = [
  {
    id: 1,
    sno: 1,
    studentID: 'ST001',
    studentName: 'Alice Johnson',
    coachName: 'Coach Smith',
    sessionDate: '2024-04-10',
    feedback: 'Excellent performance in team activities.',
    remarks: 'Keep up the good work!',
  },
  {
    id: 2,
    sno: 2,
    studentID: 'ST002',
    studentName: 'Bob Williams',
    coachName: 'Coach Davis',
    sessionDate: '2024-04-12',
    feedback: 'Needs to improve focus during practice sessions.',
    remarks: 'Encourage participation in drills.',
  },
  // Add more rows as needed
];

const CoachFeedback = () => {
  const [rows, setRows] = useState(feedbackData);

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
            Coach Feedback Report
          </Typography>
          <DataGrid
          
            rows={rows}
            columns={feedbackColumns}
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
                color: '#ffffff',
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

export default CoachFeedback;
