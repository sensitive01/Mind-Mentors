import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Box,
    createTheme,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    ThemeProvider,
    Typography
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Trash } from 'lucide-react';
import React, { useState } from 'react';

const documentCategories = [
  { 
    label: 'Personal Documents', 
    value: 'personal', 
    types: ['Passport', 'Aadhar Card', 'PAN Card', 'Driving License']
  },
  { 
    label: 'Professional Documents', 
    value: 'professional', 
    types: ['Offer Letter', 'Experience Certificate', 'Salary Slip', 'Employment Contract']
  },
  { 
    label: 'Educational Documents', 
    value: 'educational', 
    types: ['Degree Certificate', 'Mark Sheets', 'Diploma', 'Academic Transcripts']
  },
  { 
    label: 'Other Documents', 
    value: 'other', 
    types: ['Medical Certificate', 'Insurance Documents', 'Miscellaneous']
  }
];

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

const EmployeeDocuments = () => {
  const [rows, setRows] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'John Doe',
      documentCategory: 'professional',
      uploadDate: '2024-01-15',
      status: 'Verified'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Jane Smith',
      documentCategory: 'personal',
      uploadDate: '2024-02-20',
      status: 'Pending'
    },
    // Add more employee document entries
  ]);

  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [selectedEmployeeDocuments, setSelectedEmployeeDocuments] = useState([]);

  const handleViewDocuments = (employeeId) => {
    // Simulate fetching documents for the employee
    const employeeDocuments = [
      { 
        id: 1, 
        type: 'Offer Letter', 
        category: 'professional', 
        uploadDate: '2024-01-15',
        fileName: 'offer_letter.pdf'
      },
      { 
        id: 2, 
        type: 'PAN Card', 
        category: 'personal', 
        uploadDate: '2024-01-16',
        fileName: 'pan_card.pdf'
      }
    ];

    setSelectedEmployeeDocuments(employeeDocuments);
    setOpenDocumentDialog(true);
  };

  const columns = [
    { 
      field: 'employeeId', 
      headerName: 'Employee ID', 
      width: 120 
    },
    { 
      field: 'name', 
      headerName: 'Employee Name', 
      width: 200 
    },
    { 
      field: 'documentCategory', 
      headerName: 'Document Category', 
      width: 200,
      valueFormatter: (params) => {
        const category = documentCategories.find(
          cat => cat.value === params.value
        );
        return category ? category.label : params.value;
      }
    },
    { 
      field: 'uploadDate', 
      headerName: 'Upload Date', 
      width: 150 
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            color="primary" 
            onClick={() => handleViewDocuments(params.row.employeeId)}
          >
            <VisibilityIcon />
          </IconButton>
          
          <IconButton 
            color="error"
            onClick={() => {
              const confirmDelete = window.confirm(
                `Are you sure you want to delete documents for ${params.row.employeeId}?`
              );
              if (confirmDelete) {
                console.log(`Deleted documents for ${params.row.employeeId}`);
                setRows((prevRows) => 
                  prevRows.filter((row) => row.employeeId !== params.row.employeeId)
                );
              }
            }}
          >
            <Trash />
          </IconButton>
        </Box>
      )
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
            Employee Documents
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
            }}
          />
        </Paper>

        {/* Document View Dialog */}
        <Dialog 
          open={openDocumentDialog} 
          onClose={() => setOpenDocumentDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Employee Documents
          </DialogTitle>
          <DialogContent>
            <List>
              {selectedEmployeeDocuments.map((doc) => (
                <ListItem
                  key={doc.id}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      color="primary"
                      onClick={() => {
                        // Implement download logic
                        console.log(`Downloading ${doc.fileName}`);
                      }}
                    >
                      <Trash />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={doc.type}
                    secondary={`Uploaded on: ${doc.uploadDate}`}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeDocuments;