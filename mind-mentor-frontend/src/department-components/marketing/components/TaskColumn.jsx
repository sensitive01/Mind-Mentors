// columns.js
import { alpha } from '@mui/material/styles';
import { Zoom, Fade, Grow, Box, Select, MenuItem, Chip, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const columns = (theme, handleStatusToggle, setViewDialog, setNoteDialog) => [
  {
    field: 'taskId',
    headerName: 'Task ID',
    width: 100,
    editable: true,
  },
  {
    field: 'taskTime',
    headerName: 'Task Time',
    width: 180,
    editable: true,
  },
  {
    field: 'task',
    headerName: 'Task',
    width: 250,
    editable: true,
  },
  {
    field: 'assignedBy',
    headerName: 'Assigned By',
    width: 180,
    editable: true,
  },
  {
    field: 'assignedRole',
    headerName: 'Assigned Role',
    width: 150,
    editable: true,
    renderCell: (params) => (
      <Zoom in={true}>
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          }}
        />
      </Zoom>
    ),
  },
  {
    field: 'status',
    headerName: 'Task Status',
    width: 180,
    renderCell: (params) => (
      <Fade in={true}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            padding: '4px 12px',
            borderRadius: '20px',
            transition: 'all 0.3s ease',
            color: params.value === 'In Progress'
              ? '#F59E0B'
              : params.value === 'Completed'
              ? '#28a745'
              : '#dc3545',
          }}
        >
          <Select
            value={params.value}
            onChange={(event) => handleStatusToggle(params.row.taskId, event.target.value)}
            sx={{
              backgroundColor: '#f4f4f4',
              borderRadius: '8px',
              fontSize: '0.875rem',
              '& .MuiSelect-select': {
                padding: '4px 8px',
              },
            }}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </Box>
      </Fade>
    ),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Grow in={true}>
          <IconButton
            size="small"
            onClick={() => setViewDialog({ open: true, rowData: params.row })}
            sx={{
              color: '#F59E0B',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Grow>
        <Grow in={true} style={{ transformOrigin: '0 0 0' }}>
          <IconButton
            size="small"
            onClick={() => setNoteDialog({
              open: true,
              rowData: params.row,
              noteText: params.row.notes || '',
            })}
            sx={{
              color: '#642b8f',
              '&:hover': {
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
              },
            }}
          >
            <NoteAddIcon fontSize="small" />
          </IconButton>
        </Grow>
      </Box>
    ),
  },
];

export default columns;
