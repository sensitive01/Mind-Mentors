import { alpha } from '@mui/material/styles';
import { Zoom, Fade, Box, Switch, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const columns = (theme, handleStatusToggle, setViewDialog, setNoteDialog) => [
  {
    field: 'requestNumber',
    headerName: 'Request Number',
    width: 300,
    editable: true,
  },
  {
    field: 'requestTime',
    headerName: 'Request Time',
    width: 300,
    editable: true,
  },
  {
    field: 'closeTime',
    headerName: 'Close Time',
    width: 300,
    editable: true,
  },
  {
    field: 'tat',
    headerName: 'TAT',
    width: 300,
    editable: true,
  },

];

export default columns;
