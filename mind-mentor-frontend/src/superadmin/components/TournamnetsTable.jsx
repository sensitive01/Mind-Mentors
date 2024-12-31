// import {
//   Box,
//   createTheme,
//   Paper,
//   ThemeProvider,
//   Typography
// } from '@mui/material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import React, { useEffect, useState } from 'react';

// // Theme customization
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#642b8f', // Indigo
//       light: '#818CF8',
//       dark: '#4F46E5',
//     },
//     background: {
//       default: '#F1F5F9',
//       paper: '#FFFFFF',
//     },
//     text: {
//       primary: '#1E293B',
//       secondary: '#64748B',
//     },
//   },
//   components: {
//     MuiDataGrid: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           border: 'none',
//           '& .MuiDataGrid-cell:focus': {
//             outline: 'none',
//           },
//         },
//       },
//     },
//   },
// });

// // Columns for DataGrid
// const tournamentColumns = [
// // { field: 'tournamentId', headerName: 'Tournament ID', width: 150 },
// { field: 'tournamentType', headerName: 'Type', flex: 50 },
// { field: 'registrationFee', headerName: 'Registration Fee', width: 150 },
// { field: 'numberOfParticipants', headerName: 'Number of Participants', width: 200 },
// { field: 'tournamentDate', headerName: 'Tournament Date', width: 150 },
// { field: 'time', headerName: 'Time', width: 150 },
// { field: 'tournamentCentre', headerName: 'Tournament Centre', width: 150 },
// { field: 'registeredKids', headerName: 'Registered Kids', width: 200 },
// ];

// // Component for Tournament Details Table
// const TournamentDetailsTable = () => {
//   const [rows, setRows] = useState([]);

// // Fetch data from API
// useEffect(() => {
//   const fetchTournamentData = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/superadmin/tournaments/'); // Replace with actual API endpoint
//       const data = await response.json();

//       // Map API response to the format expected by the DataGrid
//       const mappedData = data.map(tournament => ({
//         id: tournament._id,
//         // tournamentId: tournament._id,
//         tournamentType: tournament.tournamentType,
//         registrationFee: `₹${tournament.registrationFee}`,
//         numberOfParticipants: tournament.numberOfParticipants,
//         tournamentDate: new Date(tournament.tournamentDate).toLocaleDateString(),
//         time: tournament.time,
//         tournamentCentre: tournament.tournamentCentre,
//         registeredKids: tournament.registeredKids.join(', '),
//       }));

//       setRows(mappedData);
//     } catch (error) {
//       console.error('Error fetching tournament data:', error);
//     }
//   };

//   fetchTournamentData();
// }, []);

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ width: '100%', height: '100%', p: 3 }}>
//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             backgroundColor: 'background.paper',
//             borderRadius: 3,
//             height: 650,
//             boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
//           }}
//         >
//           <Typography
//             variant="h5"
//             gutterBottom
//             sx={{
//               color: 'text.primary',
//               fontWeight: 600,
//               mb: 3,
//             }}
//           >
//             Tournament Details
//           </Typography>
//           <DataGrid
//             rows={rows}
//             columns={tournamentColumns}
//
//             disableRowSelectionOnClick
//             slots={{ toolbar: GridToolbar }}
//             slotProps={{
//               toolbar: {
//                 showQuickFilter: true,
//                 quickFilterProps: { debounceMs: 500 },
//               },
//             }}
//             sx={{
//               height: 500,
//               '& .MuiDataGrid-cell:focus': {
//                 outline: 'none',
//               },
//               '& .MuiDataGrid-row:hover': {
//                 backgroundColor: theme.palette.action.hover,
//               },
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
//         </Paper>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default TournamentDetailsTable;

import { Delete, Edit, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllTournaments,
  deleteTournament,
} from "../../../api/service/employee/EmployeeService";
const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f", // Indigo
      light: "#818CF8",
      dark: "#4F46E5",
    },
    background: {
      default: "#F1F5F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "none",
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
        },
      },
    },
  },
});

const TournamentMasterList = () => {
  const [rows, setRows] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const data = await fetchAllTournaments(); // No need to call .json() here

        // Map API response to the format expected by the DataGrid
        const mappedData = data.map((tournament) => ({
          id: tournament._id,
          tournamentType: tournament.tournamentType,
          registrationFee: `₹${tournament.registrationFee}`,
          numberOfParticipants: tournament.numberOfParticipants,
          tournamentDate: new Date(
            tournament.tournamentDate
          ).toLocaleDateString(),
          time: tournament.time,
          tournamentCentre: tournament.tournamentCentre,
          registeredKids: tournament.registeredKids.join(", "),
        }));

        setRows(mappedData);
      } catch (error) {
        console.error("Error fetching tournament data:", error);
      }
    };

    fetchTournamentData();
  }, []);

  const handleView = (tournament) => {
    setSelectedTournament(tournament);
    setOpenViewDialog(true);
  };

  const handleEdit = (id) => {
    console.log(`Editing tournament with ID: ${id}`);
  };

  const handleDelete = async (id) => {
    // Ask for confirmation before proceeding with the deletion
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Tournaments?"
    );

    if (!isConfirmed) {
      console.log("Deletion canceled.");
      return; // Exit the function if the user cancels
    }

    try {
      const response = await deleteTournament(id); // Call the service function to delete the user

      // Update the UI only if the delete operation was successful
      setRows(rows.filter((row) => row.id !== id));
      console.log(`User with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const columns = [
    // { field: 'tournamentId', headerName: 'Tournament ID', width: 150 },
    { field: "tournamentType", headerName: "Type", flex: 150 },
    { field: "registrationFee", headerName: "Fees", flex: 150 },
    {
      field: "numberOfParticipants",
      headerName: "No of Participants",
      flex: 200,
    },
    { field: "tournamentDate", headerName: "Tournament Date", width: 150 },
    { field: "time", headerName: "Time", flex: 150 },
    { field: "tournamentCentre", headerName: "Tournament Centre", width: 150 },
    { field: "registeredKids", headerName: "Registered Kids", width: 200 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 200,
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
        />,
      ],
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", height: "100%", p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: "background.paper",
            borderRadius: 3,
            height: 650,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box
            mb={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: "#642b8f", fontWeight: 600, mb: 3 }}
            >
              Tournament Data
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/tournaments/add"
            >
              + Add Tournament
            </Button>
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            pageSize={5} // This is the default number of rows per page
            pageSizeOptions={[5, 10, 20]} // Option to change the page size
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
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#642b8f",
                color: "white",
                fontWeight: 600,
              },
              "& .MuiCheckbox-root.Mui-checked": {
                color: "#FFFFFF",
              },
              "& .MuiDataGrid-columnHeader .MuiCheckbox-root": {
                color: "#FFFFFF",
              },
            }}
          />
        </Paper>

        {/* View Tournament Dialog */}
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Tournament Details</DialogTitle>
          <DialogContent>
            {selectedTournament && (
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <Typography>
                  <strong>Tournament Date:</strong>{" "}
                  {new Date(
                    selectedTournament.tournamentDate
                  ).toLocaleDateString()}
                </Typography>
                <Typography>
                  <strong>Tournament Time:</strong> {selectedTournament.time}
                </Typography>

                <Typography>
                  <strong>Tournament Center :</strong>{" "}
                  {selectedTournament.tournamentCentre}
                </Typography>
                <Typography>
                  <strong>Type:</strong> {selectedTournament.tournamentType}
                </Typography>
                <Typography>
                  <strong>Registration Fees:</strong>{" "}
                  {selectedTournament.registrationFee}
                </Typography>

                <Typography>
                  <strong>Registered Kids:</strong>{" "}
                  {selectedTournament.registeredKids}
                </Typography>
                <Typography>
                  <strong>Number of Participants:</strong>{" "}
                  {selectedTournament.numberOfParticipants}
                </Typography>
                <Typography>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedTournament.createdAt).toLocaleDateString()}
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

export default TournamentMasterList;
