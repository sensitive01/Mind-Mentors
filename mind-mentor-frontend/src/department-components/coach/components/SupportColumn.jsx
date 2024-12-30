

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
