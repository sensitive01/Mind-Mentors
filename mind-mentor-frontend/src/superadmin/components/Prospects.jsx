import {
  Box,
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  Grid,
  Paper,
  Slide,
  TextField,
  ThemeProvider,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import columns from './Columns2';
import data from './Enquiry';
import { Link } from 'react-router-dom'; // Import Link for navigation
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
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

const DetailView = ({ data }) => (
<Grid container spacing={3} sx={{ p: 2 }}>
  {Object.entries(data).map(([key, value]) => (
    key !== 'id' && (
      <Grid item xs={12} sm={6} md={4} key={key}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            height: '100%',
          }}
        >
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

const Prospects = () => {
const [rows, setRows] = useState([]);
const [viewDialog, setViewDialog] = useState({
  open: false,
  rowData: null
});
const [paginationModel, setPaginationModel] = useState({
  page: 0,
  pageSize: 5,
});

useEffect(() => {
  setRows(data); // Set the imported data into the state
}, []);

const [noteDialog, setNoteDialog] = useState({
  open: false,
  rowData: null,
  noteText: ''
});


const handleRowClick = (params) => {
  setViewDialog({
    open: true,
    rowData: params.row
  });
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
// const handleRowEditStop = (params, event) => {
//   // Prevent default row edit stop behavior
//   event.defaultMuiPrevented = true;
// };

// const handleProcessRowUpdate = (newRow, oldRow) => {
//   // Update the rows state with the edited row
//   const updatedRows = rows.map((row) => 
//     row.id === newRow.id ? newRow : row
//   );
//   setRows(updatedRows);
//   return newRow;
// };

// const handleProcessRowUpdateError = (error) => {
//   console.error('Row update error:', error);
// };
return (
  <ThemeProvider theme={theme}>
    <Fade in={true}>
      <Box sx={{ width: '100%', height: '100%', p: 3 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            backgroundColor: 'background.paper',
            borderRadius: 3,
            height: 650,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              color: 'text.primary',
              fontWeight: 600,
              mb: 3
            }}
          >
            Prospects
          </Typography>
          
          <DataGrid
            rows={rows}
            columns={columns(theme,  setViewDialog, setNoteDialog)}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
            editMode="row"
            onRowDoubleClick={(params) => {
              setViewDialog({ open: true, rowData: params.row });
              // Enable editing on double click
              params.row.isEditable = true;
            }}
            // onRowEditStop={handleRowEditStop}
            // processRowUpdate={handleProcessRowUpdate}
            // onProcessRowUpdateError={handleProcessRowUpdateError}
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
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#642b8f',
                color: 'white',
                fontWeight: 600,
              },
              '& .MuiDataGrid-footerContainer': {
                display: 'flex',
                justifyContent: 'flex-end',
              },
              '& .MuiDataGrid-root': {
                overflow: 'hidden',
              },
              '& .MuiCheckbox-root.Mui-checked': {
                color: '#FFFFFF',
              },
              '& .MuiDataGrid-columnHeader .MuiCheckbox-root': {
                color: '#FFFFFF',
              },
            }}
          />

          {/* View Dialog */}
          <Dialog
            open={viewDialog.open}
            onClose={() => setViewDialog({ open: false, rowData: null })}
            maxWidth="md"
            fullWidth
            TransitionComponent={Slide}
            TransitionProps={{ direction: "up" }}
          >
            <DialogTitle sx={{ 
              background: 'linear-gradient(#642b8f, #aa88be)',
              color: '#ffffff',
              fontWeight: 600
            }}>
              Student Details
            </DialogTitle>
            <Divider />
            <DialogContent>
              <DetailView data={viewDialog.rowData || {}} />
            </DialogContent>
            <Divider sx={{ borderColor: '#aa88be' }} />
            <DialogActions sx={{ p: 2.5 }}>
              <Button 
                className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
                onClick={() => setViewDialog({ open: false, rowData: null })}
                variant="outlined"
                sx={{ 
                  color: '#f8a213',
                  borderColor: '#f8a213'
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
  open={noteDialog.open}
  onClose={() => setNoteDialog({ open: false, rowData: null, noteText: '', enquiryStage: '', notesTo: '', parents: '' })}
  maxWidth="sm"
  fullWidth
  TransitionComponent={Slide}
  TransitionProps={{ direction: "up" }}
  BackdropProps={{
    sx: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a semi-transparent black color
      backdropFilter: 'blur(4px)',          // Applies a blur effect to the backdrop
    },
  }}
>
  <DialogTitle
  sx={{ 
    color: '#ffffff',
    fontWeight: 600,
    background: 'linear-gradient(to right, #642b8f, #aa88be)', // Apply the gradient background


  }}>
    Add Note
  </DialogTitle>
  <Divider />
  <DialogContent>

    {/* Enquiry Stage Select Box */}
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel>Enquiry Stage</InputLabel>
      <Select
        value={noteDialog.enquiryStage}
        onChange={(e) => setNoteDialog(prev => ({ ...prev, enquiryStage: e.target.value }))}
        label="Enquiry Stage"
      >
        <MenuItem value="New">New</MenuItem>
        <MenuItem value="Follow-Up">Follow-Up</MenuItem>
        <MenuItem value="Closed">Closed</MenuItem>
        <MenuItem value="Converted">Converted</MenuItem>
      </Select>
    </FormControl>

    {/* Notes To Field */}
    <TextField
      label="Notes To"
      value={noteDialog.notesTo}
      onChange={(e) => setNoteDialog(prev => ({ ...prev, notesTo: e.target.value }))}
      fullWidth
      sx={{ mt: 2 }}
    />
    
    <TextField
      label="Note"
      value={noteDialog.noteText}
      onChange={(e) => setNoteDialog(prev => ({ ...prev, noteText: e.target.value }))}
      multiline
      rows={4}
      fullWidth
      sx={{ mt: 1 }}
    />
  </DialogContent>
  <Divider sx={{ borderColor: '#aa88be' }} />
  <DialogActions sx={{ p: 2.5 }}>

    <Button 
      onClick={handleNoteSave}
      variant="contained"
      class="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
      sx={{ 
        bgcolor: 'primary.main',
        '&:hover': {
          bgcolor: 'primary.dark',
        }
      }}
    >
      Save Note
    </Button>

    <Button 
    class="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
      onClick={() => setNoteDialog({ open: false, rowData: null, noteText: '', enquiryStage: '', notesTo: '', parents: '' })}
      variant="outlined"
      sx={{ 
        color: 'text.primary',
        borderColor: 'divider'
      }}
      type='reset'
    >
      Cancel
    </Button>
  </DialogActions>
</Dialog>
        </Paper>
      </Box>
    </Fade>
  </ThemeProvider>
);
};

export default Prospects;