import React, { useState, useMemo, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Stack, 
  Chip, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Fade,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  People as PeopleIcon, 
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const ParticipantsManagement = () => {
  const [participants, setParticipants] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      status: 'Active', 
      type: 'Regular',
      extended: false,
      details: 'Top performer, excellent engagement',
      joinDate: '2023-01-15'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      status: 'Temporary', 
      type: 'Demo',
      extended: true,
      details: 'Potential long-term participant',
      joinDate: '2023-03-22'
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      status: 'Paused', 
      type: 'Regular',
      extended: false,
      details: 'Needs follow-up',
      joinDate: '2022-11-10'
    }
  ]);

  const [selectedView, setSelectedView] = useState('All');
  const [dialogMode, setDialogMode] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParticipants = useMemo(() => {
    let result = participants.filter(participant => {
      const matchesView = 
        selectedView === 'All' || 
        (selectedView === 'Active' && participant.status === 'Active') ||
        (selectedView === 'Temporary' && participant.type === 'Demo') ||
        (selectedView === 'Paused' && participant.status === 'Paused') ||
        (selectedView === 'Extended' && participant.extended);

      const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesView && matchesSearch;
    });

    return result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) 
        return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) 
        return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [participants, selectedView, searchTerm, sortConfig]);

  const handleOpenDialog = useCallback((mode, participant = null) => {
    setDialogMode(mode);
    setSelectedParticipant(participant);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogMode(null);
    setSelectedParticipant(null);
  }, []);

  const handleSave = useCallback(() => {
    if (dialogMode === 'edit' && selectedParticipant) {
      setParticipants(prev => 
        prev.map(p => p.id === selectedParticipant.id ? selectedParticipant : p)
      );
      setSnackbarMessage('Participant updated successfully');
    } else if (dialogMode === 'add') {
      setParticipants(prev => [...prev, { 
        ...selectedParticipant, 
        id: Date.now(),
        joinDate: new Date().toISOString().split('T')[0]
      }]);
      setSnackbarMessage('New participant added successfully');
    }
    setSnackbarOpen(true);
    handleCloseDialog();
  }, [dialogMode, selectedParticipant, handleCloseDialog]);

  const handleDelete = useCallback((participantId) => {
    setParticipants(prev => prev.filter(p => p.id !== participantId));
    setSnackbarMessage('Participant deleted successfully');
    setSnackbarOpen(true);
  }, []);

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const renderDialog = () => {
    if (!dialogMode) return null;

    return (
      <Dialog 
        open={!!dialogMode} 
        onClose={handleCloseDialog}
        TransitionComponent={Fade}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'view' ? 'Participant Details' : 
           dialogMode === 'edit' ? 'Edit Participant' : 'Add New Participant'}
        </DialogTitle>
        <DialogContent>
          {dialogMode === 'view' ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography><strong>Name:</strong> {selectedParticipant.name}</Typography>
              <Typography><strong>Status:</strong> {selectedParticipant.status}</Typography>
              <Typography><strong>Type:</strong> {selectedParticipant.type}</Typography>
              <Typography><strong>Join Date:</strong> {selectedParticipant.joinDate}</Typography>
              <Typography><strong>Details:</strong> {selectedParticipant.details}</Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Name"
                value={selectedParticipant?.name || ''}
                onChange={(e) => setSelectedParticipant(prev => ({ 
                  ...prev, 
                  name: e.target.value 
                }))}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedParticipant?.status || ''}
                  label="Status"
                  onChange={(e) => setSelectedParticipant(prev => ({ 
                    ...prev, 
                    status: e.target.value 
                  }))}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Paused">Paused</MenuItem>
                  <MenuItem value="Temporary">Temporary</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Details"
                multiline
                rows={3}
                value={selectedParticipant?.details || ''}
                onChange={(e) => setSelectedParticipant(prev => ({ 
                  ...prev, 
                  details: e.target.value 
                }))}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {dialogMode !== 'view' && (
            <Button onClick={handleSave} variant="contained">Save</Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 4 }}
      >
        <Typography 
          variant="h4" 
          sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
        >
          <PeopleIcon /> Participants Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextField 
            size="small"
            placeholder="Search participants"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 250 }}
          />
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add', { 
              name: '', 
              status: '', 
              type: '',
              details: ''
            })}
          >
            Add Participant
          </Button>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        {['All', 'Active', 'Temporary', 'Paused', 'Extended'].map(view => (
          <Chip 
            key={view}
            label={view}
            color={selectedView === view ? 'primary' : 'default'}
            onClick={() => setSelectedView(view)}
          />
        ))}
      </Stack>

      <Grid container spacing={3}>
        <AnimatePresence>
          {filteredParticipants.map((participant) => (
            <Grid item xs={12} sm={6} md={4} key={participant.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Box 
                  sx={{ 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 2, 
                    p: 2, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Typography variant="h6">{participant.name}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip 
                        label={participant.status} 
                        color={
                          participant.status === 'Active' ? 'success' : 
                          participant.status === 'Paused' ? 'warning' : 'default'
                        } 
                        size="small" 
                      />
                      {participant.extended && (
                        <Chip label="Extended" color="info" size="small" />
                      )}
                    </Stack>
                  </Box>
                  
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    sx={{ mt: 2, justifyContent: 'flex-end' }}
                  >
                    <Tooltip title="View Details">
                      <Button 
                        startIcon={<ViewIcon />}
                        size="small"
                        onClick={() => handleOpenDialog('view', participant)}
                      >
                        View
                      </Button>
                    </Tooltip>
                    <Tooltip title="Edit Participant">
                      <Button 
                        startIcon={<EditIcon />}
                        size="small"
                        onClick={() => handleOpenDialog('edit', participant)}
                      >
                        Edit
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete Participant">
                      <Button 
                        startIcon={<DeleteIcon />}
                        size="small"
                        color="error"
                        onClick={() => handleDelete(participant.id)}
                      >
                        Delete
                      </Button>
                    </Tooltip>
                  </Stack>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      {renderDialog()}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ParticipantsManagement;