// columns.js
import { alpha } from '@mui/material/styles';
import { Zoom, Fade, Grow, Box,Select,MenuItem, Chip, Switch, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const columns = (theme,  setViewDialog, setNoteDialog) => [
  {
    field: 'rollNo',
    headerName: 'Roll No',
    width: 100,
    editable: true,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 180,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 100,
    editable: true,
  },
  {
    field: 'registeredDate',
    headerName: 'Registered Date',
    width: 150,
    editable: true,
  },
  {
    field: 'lastInteractionTime',
    headerName: 'Last Interaction Time',
    width: 180,
    editable: true,
  },
  {
    field: 'lastInteractedWith',
    headerName: 'Last Interacted With',
    width: 180,
    editable: true,
  },
  {
    field: 'leadSource',
    headerName: 'Lead Source',
    width: 150,
    editable: true,
  },
  {
    field: 'programs',
    headerName: 'Programs',
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
    field: 'stageTag',
    headerName: 'Stage Tag',
    width: 120,
    editable: true,
  },
  {
    field: 'parentEmail',
    headerName: 'Parent Email',
    width: 200,
    editable: true,
  },
  {
    field: 'enrolledCenter',
    headerName: 'Enrolled Center',
    width: 150,
    editable: true,
  },
  {
    field: 'allotedCenter',
    headerName: 'Alloted Center',
    width: 150,
    editable: true,
  },
  {
    field: 'country',
    headerName: 'Country',
    width: 150,
    editable: true,
  },
  // {
  //   field: 'Status',
  //   headerName: 'Prospect Status',
  //   width: 200,
  //   renderCell: (params) => (
  //     <Fade in={true}>
  //       <Box
  //         sx={{
  //           display: 'flex',
  //           alignItems: 'center',
  //           gap: 1,
  //           padding: '4px 12px',
  //           borderRadius: '20px',
  //           transition: 'all 0.3s ease',
  //           color: params.value === 'Warm'
  //             ? '#F59E0B'
  //             : params.value === 'Cold'
  //             ? '#642b8f'
  //             : '#0B84F5',
  //         }}
  //       >
  //         <Select
  //           value={params.value}
  //           onChange={(event) => handleStatusChange(params.row.id, event.target.value)}
  //           sx={{
  //             backgroundColor: '#f4f4f4',
  //             borderRadius: '8px',
  //             fontSize: '0.875rem',
  //             '& .MuiSelect-select': {
  //               padding: '4px 8px',
  //             },
  //           }}
  //         >
  //           <MenuItem value="Cold">Cold</MenuItem>
  //           <MenuItem value="Warm">Warm</MenuItem>
  //           <MenuItem value="Schedule Demo">Schedule Demo</MenuItem>
  //         </Select>
  //       </Box>
  //     </Fade>
  //   ),
  // },
  
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1 }}  onClick={(e) => e.stopPropagation()}>
        
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
            {/* <VisibilityIcon fontSize="small" /> */}
          </IconButton>
        </Grow>
        <Grow in={true} style={{ transformOrigin: '0 0 0' }}>
          <IconButton
            size="small"
            onClick={() => {
              // Close view dialog if open before opening note dialog
              setViewDialog({ open: false, rowData: null });
              setNoteDialog({
                open: true,
                rowData: params.row,
                noteText: params.row.notes || '',
              });
            }}
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
