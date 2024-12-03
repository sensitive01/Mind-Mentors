// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
// import {
//   Box,
//   Button,
//   createTheme,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Grid,
//   Paper,
//   TextField,
//   ThemeProvider,
//   Typography
// } from '@mui/material';
// import { alpha } from '@mui/material/styles';
// import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom'; // Import Link for navigation

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#642b8f', // Indigo
//     },
//     secondary: {
//       main: '#EC4899', // Pink
//     },
//     background: {
//       default: '#F1F5F9',
//       paper: '#FFFFFF',
//     },
//     text: {
//       primary: '#1E293B',
//     },
//   },
// });

// const leaveData = [
//   {
//     id: 1,
//     employeeName: 'John Doe',
//     leaveType: 'Sick Leave',
//     leaveStartDate: '2024-11-01',
//     leaveEndDate: '2024-11-05',
//     status: 'Approved',
//     notes: 'Sick due to fever',
//   },
//   {
//     id: 2,
//     employeeName: 'Jane Smith',
//     leaveType: 'Vacation',
//     leaveStartDate: '2024-12-10',
//     leaveEndDate: '2024-12-15',
//     status: 'Pending',
//     notes: 'Vacation in Bali',
//   },
//   // More leave data can go here
// ];

// const columns = (theme, handleStatusToggle, setViewDialog, setNoteDialog) => [
//   { field: 'id', headerName: 'ID', width: 70 },
//   { field: 'employeeName', headerName: 'Employee Name', width: 200 },
//   { field: 'leaveType', headerName: 'Leave Type', width: 150 },
//   { field: 'leaveStartDate', headerName: 'Leave Start Date', width: 150 },
//   { field: 'leaveEndDate', headerName: 'Leave End Date', width: 150 },
//   { field: 'status', headerName: 'Status', width: 130 },
//   {
//     field: 'notes',
//     headerName: 'Notes',
//     width: 200,
//     renderCell: (params) => (
//       <Button
//         onClick={() => setNoteDialog({ open: true, rowData: params.row, noteText: params.row.notes })}
//         variant="text"
//         color="secondary"
//       >
//         View Note
//       </Button>
//     ),
//   },
//   {
//     field: 'actions',
//     headerName: 'Actions',
//     width: 150,
//     renderCell: (params) => (
//       <>
//         <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => setViewDialog({ open: true, rowData: params.row })} />
//         <GridActionsCellItem icon={<SaveIcon />} label="Approve" onClick={() => handleStatusToggle(params.row.id)} />
//       </>
//     ),
//   },
// ];

// const DetailView = ({ data }) => (
//   <Grid container spacing={3} sx={{ p: 2 }}>
//     {Object.entries(data).map(([key, value]) => (
//       key !== 'id' && (
//         <Grid item xs={12} sm={6} md={4} key={key}>
//           <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), height: '100%' }}>
//             <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
//               {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
//             </Typography>
//             <Typography variant="body1" color="text.primary">
//               {value || 'N/A'}
//             </Typography>
//           </Box>
//         </Grid>
//       )
//     ))}
//   </Grid>
// );

// const EmployeeLeaveManagement = () => {
//   const [rows, setRows] = useState([]);
//   const [noteDialog, setNoteDialog] = useState({ open: false, rowData: null, noteText: '' });
//   const [viewDialog, setViewDialog] = useState({ open: false, rowData: null });
//   const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
//   const [editRowsModel, setEditRowsModel] = useState({});

//   useEffect(() => {
//     setRows(leaveData); // Set the imported leave data into the state
//   }, []);

  // const handleStatusToggle = (id) => {
  //   setRows(rows.map(row => {
  //     if (row.id === id) {
  //       const newStatus = row.status === 'Approved' ? 'Pending' : 'Approved';
  //       return {
  //         ...row,
  //         status: newStatus,
  //       };
  //     }
  //     return row;
  //   }));
  // };

  // const handleNoteSave = () => {
  //   if (noteDialog.rowData) {
  //     setRows(rows.map(row =>
  //       row.id === noteDialog.rowData.id
  //         ? { ...row, notes: noteDialog.noteText }
  //         : row
  //     ));
  //     setNoteDialog({ open: false, rowData: null, noteText: '' });
  //   }
  // };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ width: '100%', height: '100%', p: 3 }}>
//         <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 3, height: 650, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
//           <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h5" gutterBottom sx={{ color: '#000', fontWeight: 600, mb: 3 }}>
//               Employee Leave Management
//             </Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               component={Link}
//               to="/employee-operation/leaves/add"
//             >
//               + Apply Leave
//             </Button>
//           </Box>
//           <DataGrid
//             rows={rows}
//             columns={columns(theme, handleStatusToggle, setViewDialog, setNoteDialog)}
//             paginationModel={paginationModel}
//             onPaginationModelChange={setPaginationModel}
//             pageSizeOptions={[5, 10, 25]}
//             checkboxSelection
//             disableRowSelectionOnClick
//             slots={{ toolbar: GridToolbar }}
//             slotProps={{
//               toolbar: {
//                 showQuickFilter: true,
//                 quickFilterProps: { debounceMs: 500 },
//               },
//             }}
//             sx={{
//               height: 500, // Fixed height for the table

//               '& .MuiDataGrid-cell:focus': { outline: 'none' },
//               '& .MuiDataGrid-row:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) },
//               '& .MuiDataGrid-columnHeader': {
//                 backgroundColor: '#642b8f',
//                 color: 'white',
//                 fontWeight: 600,
//               },
//               '& .MuiCheckbox-root.Mui-checked': {
//                 color: '#FFFFFF',
//               },
//               '& .MuiDataGrid-columnHeader .MuiCheckbox-root': {
//                 color: '#FFFFFF',
//               },

//             }}
//           />

//           {/* View Dialog */}
//           <Dialog open={viewDialog.open} onClose={() => setViewDialog({ open: false, rowData: null })} maxWidth="md" fullWidth>
//             <DialogTitle sx={{ background: 'linear-gradient(#6366F1, #818CF8)', color: '#ffffff', fontWeight: 600 }}>
//               Leave Request Details
//             </DialogTitle>
//             <DialogContent>
//               <DetailView data={viewDialog.rowData || {}} />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setViewDialog({ open: false, rowData: null })} variant="outlined" sx={{ color: '#f8a213', borderColor: '#f8a213' }}>
//                 Close
//               </Button>
//             </DialogActions>
//           </Dialog>

//           {/* Notes Dialog */}
//           <Dialog open={noteDialog.open} onClose={() => setNoteDialog({ open: false, rowData: null, noteText: '' })} maxWidth="sm" fullWidth>
//             <DialogTitle sx={{ background: 'linear-gradient(#6366F1, #818CF8)', color: '#ffffff', fontWeight: 600 }}>
//               Add Note
//             </DialogTitle>
//             <DialogContent>
//               <TextField label="Note" value={noteDialog.noteText} onChange={(e) => setNoteDialog(prev => ({ ...prev, noteText: e.target.value }))} multiline rows={4} fullWidth sx={{ mt: 1 }} />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleNoteSave} variant="contained" sx={{ backgroundColor: '#EC4899' }}>Save</Button>
//               <Button onClick={() => setNoteDialog({ open: false, rowData: null, noteText: '' })} variant="outlined" sx={{ color: '#6366F1', borderColor: '#6366F1' }}>Cancel</Button>
//             </DialogActions>
//           </Dialog>
//         </Paper>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default EmployeeLeaveManagement;



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
  Typography,
  CircularProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllLeaves } from '../../api/service/employee/EmployeeService'; // Adjust the import path as necessary

const theme = createTheme({
  palette: {
    primary: {
      main: '#642b8f',
    },
    secondary: {
      main: '#EC4899',
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

// Columns definition remains the same...
const columns = (theme, handleStatusToggle, setViewDialog, setNoteDialog) => [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'employeeName', headerName: 'Employee Name', width: 200 },
  { field: 'leaveType', headerName: 'Leave Type', width: 150 },
  { field: 'leaveStartDate', headerName: 'Leave Start Date', width: 150 },
  { field: 'leaveEndDate', headerName: 'Leave End Date', width: 150 },
  { field: 'status', headerName: 'Status', width: 130 },
  {
    field: 'notes',
    headerName: 'Notes',
    width: 200,
    renderCell: (params) => (
      <Button
        onClick={() => setNoteDialog({ open: true, rowData: params.row, noteText: params.row.notes })}
        variant="text"
        color="secondary"
      >
        View Note
      </Button>
    ),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <>
        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => setViewDialog({ open: true, rowData: params.row })} />
        <GridActionsCellItem icon={<SaveIcon />} label="Approve" onClick={() => handleStatusToggle(params.row.id)} />
      </>
    ),
  },
];
const DetailView = ({ data }) => (
  <Grid container spacing={3} sx={{ p: 2 }}>
    {Object.entries(data).map(([key, value]) => (
      key !== 'id' && (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), height: '100%' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
            </Typography>
            <Typography variant="body1" color="text.primary">
              {value || 'N/A'}
            </Typography>
          </Box>
        </Grid>
      )
    ))}
  </Grid>
);
const EmployeeLeaveManagement = () => {
  const [rows, setRows] = useState([]);
  const [noteDialog, setNoteDialog] = useState({ open: false, rowData: null, noteText: '' });
  const [viewDialog, setViewDialog] = useState({ open: false, rowData: null });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        const data = await fetchAllLeaves();
        setRows(data);
      } catch (err) {
        setError('Failed to fetch leaves. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadLeaves();
  }, []);

  // handleStatusToggle and handleNoteSave remain the same...
  const handleStatusToggle = (id) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const newStatus = row.status === 'Approved' ? 'Pending' : 'Approved';
        return {
          ...row,
          status: newStatus,
        };
      }
      return row;
    }));
  };

  const handleNoteSave = () => {
    if (noteDialog.rowData) {
      setRows(rows.map(row =>
        row.id === noteDialog.rowData.id
          ? { ...row, notes: noteDialog.noteText }
          : row
      ));
      setNoteDialog({ open: false, rowData: null, noteText: '' });
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%', height: '100%', p: 3 }}>
        <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 3, height: 650, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' }}>
          <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" gutterBottom sx={{ color: '#000', fontWeight: 600, mb: 3 }}>
              Employee Leave Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/employee-operation/leaves/add"
            >
              + Apply Leave
            </Button>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="500px">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : (
            <DataGrid
            rows={rows}
            columns={columns(theme, handleStatusToggle, setViewDialog, setNoteDialog)}
            getRowId={(row) => row._id} // Specify _id as the unique identifier
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
              '& .MuiDataGrid-row:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) },
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
          )}

          {/* View Dialog */}
          <Dialog open={viewDialog.open} onClose={() => setViewDialog({ open: false, rowData: null })} maxWidth="md" fullWidth>
            <DialogTitle sx={{ background: 'linear-gradient(#6366F1, #818CF8)', color: '#ffffff', fontWeight: 600 }}>
              Leave Request Details
            </DialogTitle>
            <DialogContent>
              <DetailView data={viewDialog.rowData || {}} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialog({ open: false, rowData: null })} variant="outlined" sx={{ color: '#f8a213', borderColor: '#f8a213' }}>
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Notes Dialog */}
          <Dialog open={noteDialog.open} onClose={() => setNoteDialog({ open: false, rowData: null, noteText: '' })} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ background: 'linear-gradient(#6366F1, #818CF8)', color: '#ffffff', fontWeight: 600 }}>
              Add Note
            </DialogTitle>
            <DialogContent>
              <TextField label="Note" value={noteDialog.noteText} onChange={(e) => setNoteDialog(prev => ({ ...prev, noteText: e.target.value }))} multiline rows={4} fullWidth sx={{ mt: 1 }} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleNoteSave} variant="contained" sx={{ backgroundColor: '#EC4899' }}>Save</Button>
              <Button onClick={() => setNoteDialog({ open: false, rowData: null, noteText: '' })} variant="outlined" sx={{ color: '#6366F1', borderColor: '#6366F1' }}>Cancel</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeLeaveManagement;