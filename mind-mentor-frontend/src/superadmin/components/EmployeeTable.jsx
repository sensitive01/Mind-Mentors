import React, { useState } from 'react';
import { 
  Box, 
  createTheme, 
  Paper, 
  ThemeProvider, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from '@mui/material';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit, Visibility, Delete } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50', // Dark Blue
      light: '#3498db',
      dark: '#34495e',
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

const EmployeeMasterList = () => {
  const [rows, setRows] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phoneNumber: '+911234567890',
      dateOfBirth: '1990-05-15',
      dateOfJoining: '2020-01-10',
      department: 'IT',
      designation: 'Senior Developer',
      employmentType: 'Full-Time',
      salary: 75000,
      bankAccountNumber: '1234567890',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0001234',
      panNumber: 'ABCDE1234F',
      skills: ['React', 'Node.js', 'JavaScript']
    },
    {
      id: 2,
      employeeId: 'EMP002',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phoneNumber: '+911987654321',
      dateOfBirth: '1988-08-22',
      dateOfJoining: '2018-06-15',
      department: 'HR',
      designation: 'Manager',
      employmentType: 'Full-Time',
      salary: 90000,
      bankAccountNumber: '0987654321',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0009876',
      panNumber: 'FGHIJ5678G',
      skills: ['Recruitment', 'Training', 'Communication']
    }
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setOpenViewDialog(true);
  };

  const handleEdit = (id) => {
    // Navigate to edit page or open edit modal
    console.log(`Editing employee with ID: ${id}`);
  };

  const handleDelete = (id) => {
    // Implement delete functionality
    setRows(rows.filter(row => row.id !== id));
  };

  const columns = [
    { 
      field: 'employeeId', 
      headerName: 'Employee ID', 
      width: 120 
    },
    { 
      field: 'firstName', 
      headerName: 'First Name', 
      width: 150 
    },
    { 
      field: 'lastName', 
      headerName: 'Last Name', 
      width: 150 
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 250 
    },
    { 
      field: 'department', 
      headerName: 'Department', 
      width: 150 
    },
    { 
      field: 'designation', 
      headerName: 'Designation', 
      width: 150 
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View"
          onClick={() => handleView(params.row)}
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEdit(params.id)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />
      ]
    }
  ];

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
            Employee Master Data
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
                backgroundColor: '#2c3e50',
                color: 'white',
                fontWeight: 600,
              },
            }}
          />
        </Paper>

        {/* View Employee Dialog */}
        <Dialog 
          open={openViewDialog} 
          onClose={() => setOpenViewDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Employee Details</DialogTitle>
          <DialogContent>
            {selectedEmployee && (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Typography><strong>Employee ID:</strong> {selectedEmployee.employeeId}</Typography>
                <Typography><strong>Name:</strong> {`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</Typography>
                <Typography><strong>Email:</strong> {selectedEmployee.email}</Typography>
                <Typography><strong>Phone:</strong> {selectedEmployee.phoneNumber}</Typography>
                <Typography><strong>Date of Birth:</strong> {selectedEmployee.dateOfBirth}</Typography>
                <Typography><strong>Date of Joining:</strong> {selectedEmployee.dateOfJoining}</Typography>
                <Typography><strong>Department:</strong> {selectedEmployee.department}</Typography>
                <Typography><strong>Designation:</strong> {selectedEmployee.designation}</Typography>
                <Typography><strong>Employment Type:</strong> {selectedEmployee.employmentType}</Typography>
                <Typography><strong>Salary:</strong> {selectedEmployee.salary}</Typography>
                <Typography><strong>Bank Account:</strong> {selectedEmployee.bankAccountNumber}</Typography>
                <Typography><strong>Bank Name:</strong> {selectedEmployee.bankName}</Typography>
                <Typography><strong>IFSC Code:</strong> {selectedEmployee.ifscCode}</Typography>
                <Typography><strong>PAN Number:</strong> {selectedEmployee.panNumber}</Typography>
                <Typography>
                  <strong>Skills:</strong> {selectedEmployee.skills.join(', ')}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenViewDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeMasterList;