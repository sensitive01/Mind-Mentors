import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  ThemeProvider,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const theme = createTheme({
  palette: {
    primary: {
      main: '#642b8f', // Indigo
    },
    secondary: {
      main: '#EC4899', // Pink
    },
    background: {
      default: '#F1F5F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
    },
  },
});
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'yourName', headerName: 'Your Name', width: 150 },
  { field: 'rollNo', headerName: 'Roll No.', width: 120 },
  { field: 'referralKidName', headerName: 'Referral Kid Name', width: 180 },
  { field: 'referralParentName', headerName: 'Referral Parent Name', width: 200 },
  {
    field: 'referralMobileNo',
    headerName: 'Referral Mobile No.',
    width: 160,
    type: 'number',
    align: 'left',
    headerAlign: 'left',
  },
  { field: 'enrolledCentre', headerName: 'Enrolled Centre', width: 150 },
  { field: 'referredBy', headerName: 'Referred by', width: 150 },
  { field: 'status', headerName: 'Status', width: 120 },
  {
    field: 'referredTime',
    headerName: 'Referred Time',
    width: 100,
    type: 'dateTime',
    valueGetter: (params) => {
      if (params?.value) {
        const date = new Date(params.value);
        return !isNaN(date.getTime()) ? date : null;
      }
      return null;
    },
    valueFormatter: (params) => {
      const dateValue = params?.value;
      if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
        return dateValue.toLocaleString(); // Formats as 'MM/DD/YYYY, HH:MM:SS AM/PM'
      }
      return ''; // Return an empty string for null or invalid values
    },
  },
];

const rows = [
  {
    id: 1,
    yourName: 'Jon Snow',
    rollNo: '1001',
    referralKidName: 'Arya Snow',
    referralParentName: 'Ned Stark',
    referralMobileNo: '1234567890',
    enrolledCentre: 'Winterfell',
    referredBy: 'Catelyn Stark',
    status: 'Approved',
    referredTime: '2024-11-01T10:30:00',
  },
  {
    id: 2,
    yourName: 'Cersei Lannister',
    rollNo: '1002',
    referralKidName: 'Joffrey Baratheon',
    referralParentName: 'Robert Baratheon',
    referralMobileNo: '9876543210',
    enrolledCentre: 'Casterly Rock',
    referredBy: 'Tywin Lannister',
    status: 'Pending',
    referredTime: '2024-11-02T14:45:00',
  },
  {
    id: 3,
    yourName: 'Jaime Lannister',
    rollNo: '1003',
    referralKidName: 'Tommen Baratheon',
    referralParentName: 'Cersei Lannister',
    referralMobileNo: '1122334455',
    enrolledCentre: "King's Landing",
    referredBy: 'Cersei Lannister',
    status: 'Rejected',
    referredTime: '2024-11-03T09:00:00',
  },
  {
    id: 4,
    yourName: 'Arya Stark',
    rollNo: '1004',
    referralKidName: 'Nymeria',
    referralParentName: 'Ned Stark',
    referralMobileNo: '5566778899',
    enrolledCentre: 'Braavos',
    referredBy: "Jaqen H'ghar",
    status: 'Approved',
    referredTime: '2024-11-04T16:20:00',
  },
  {
    id: 5,
    yourName: 'Tyrion Lannister',
    rollNo: '1005',
    referralKidName: 'Shae',
    referralParentName: 'Tywin Lannister',
    referralMobileNo: '6677889900',
    enrolledCentre: 'The Eyrie',
    referredBy: 'Bronn',
    status: 'Pending',
    referredTime: null, // Testing null value
  },
];

export default function ReferralReportTable() {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ height: 650, width: '100%', p: 3, ml: 'auto' }}>
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h2">
            Referral Report
          </Typography>
          {/* <Button
            variant="contained"
            color="primary"
            component={Link}
            to="" // Replace with the actual path
            // startIcon={<SaveIcon />}
          >
            + Add Referral
          </Button> */}
        </Box>

        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
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
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
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
    </ThemeProvider>
  );
}
