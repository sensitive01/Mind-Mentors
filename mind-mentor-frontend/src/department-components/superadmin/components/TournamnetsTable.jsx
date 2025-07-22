import { Delete, Edit } from "@mui/icons-material";
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
  TextField,
  Grid,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  Chip,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllTournaments,
  deleteTournament,
  updateTournament,
} from "../../../api/service/employee/EmployeeService";
import { getAllPhysicalcenters } from "../../../api/service/employee/hrService";

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
          "& .MuiDataGrid-row": {
            cursor: "pointer",
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
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [physicalCenters, setPhysicalCenters] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const data = await fetchAllTournaments();

        // Map API response to the format expected by the DataGrid
        const mappedData = data.map((tournament, index) => ({
          id: tournament._id,
          slNo: index + 1, // Serial number
          tournamentName: tournament.tournamentName,
          mode: tournament.mode,
          tournamentCentre: tournament.tournamentCentre,
          centerId: tournament.centerId,
          tournamentDate: new Date(
            tournament.tournamentDate
          ).toLocaleDateString(),
          time: tournament.time,
          hasRegistrationFee: tournament.hasRegistrationFee ? "Yes" : "No",
          registrationFee: tournament.hasRegistrationFee
            ? `₹${tournament.registrationFee}`
            : "Free",
          numberOfParticipants: tournament.numberOfParticipants,
          registeredKids: tournament.registeredKids.length,
          instructions: tournament.instructions,
          prizePool: tournament.prizePool || [],
          createdAt: tournament.createdAt,
          updatedAt: tournament.updatedAt,
          // Keep original data for preview and editing
          originalData: tournament,
        }));

        setRows(mappedData);
      } catch (error) {
        console.error("Error fetching tournament data:", error);
      }
    };

    fetchTournamentData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPhysicalcenters();
        if (response.status === 200) {
          setPhysicalCenters(response.data.physicalCenter);
        }
      } catch (error) {
        console.error("Error fetching physical centers:", error);
      }
    };
    fetchData();
  }, []);

  const handleRowClick = (params) => {
    setSelectedTournament(params.row);
    setOpenViewDialog(true);
  };

  const handleEdit = (id) => {
    const tournament = rows.find((row) => row.id === id);
    if (tournament) {
      // Set form data with original tournament data
      setEditFormData({
        id: tournament.id,
        tournamentName: tournament.originalData.tournamentName,
        mode: tournament.originalData.mode,
        tournamentCentre: tournament.originalData.tournamentCentre,
        centerId: tournament.originalData.centerId || "",
        tournamentDate: tournament.originalData.tournamentDate.split("T")[0], // Format for date input
        time: tournament.originalData.time,
        hasRegistrationFee: tournament.originalData.hasRegistrationFee,
        registrationFee: tournament.originalData.registrationFee || 0,
        numberOfParticipants: tournament.originalData.numberOfParticipants,
        instructions: tournament.originalData.instructions || "",
        prizePool: tournament.originalData.prizePool || [],
      });
      setOpenEditDialog(true);
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrizePoolChange = (index, field, value) => {
    setEditFormData((prev) => {
      const updatedPrizePool = [...prev.prizePool];
      updatedPrizePool[index] = {
        ...updatedPrizePool[index],
        [field]: value,
      };
      return {
        ...prev,
        prizePool: updatedPrizePool,
      };
    });
  };

  const addPrizeEntry = () => {
    setEditFormData((prev) => ({
      ...prev,
      prizePool: [...prev.prizePool, { position: "", amount: "" }],
    }));
  };

  const removePrizeEntry = (index) => {
    setEditFormData((prev) => ({
      ...prev,
      prizePool: prev.prizePool.filter((_, i) => i !== index),
    }));
  };

  const handleCenterChange = (centerId) => {
    const selectedCenter = physicalCenters.find(
      (center) => center._id === centerId
    );
    setEditFormData((prev) => ({
      ...prev,
      centerId: centerId,
      tournamentCentre: selectedCenter ? selectedCenter.centerName : "",
    }));
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);

      // Prepare data for API call
      const updateData = {
        tournamentName: editFormData.tournamentName,
        mode: editFormData.mode,
        tournamentCentre: editFormData.tournamentCentre,
        centerId: editFormData.centerId,
        tournamentDate: editFormData.tournamentDate,
        time: editFormData.time,
        hasRegistrationFee: editFormData.hasRegistrationFee,
        registrationFee: editFormData.hasRegistrationFee
          ? editFormData.registrationFee
          : 0,
        numberOfParticipants: editFormData.numberOfParticipants,
        instructions: editFormData.instructions,
        prizePool: editFormData.prizePool.filter(
          (prize) => prize.position && prize.amount
        ),
      };

      // Call API to update tournament
      await updateTournament(editFormData.id, updateData);

      // Update local state
      setRows((prevRows) =>
        prevRows.map((row) => {
          if (row.id === editFormData.id) {
            return {
              ...row,
              tournamentName: editFormData.tournamentName,
              mode: editFormData.mode,
              tournamentCentre: editFormData.tournamentCentre,
              centerId: editFormData.centerId,
              tournamentDate: new Date(
                editFormData.tournamentDate
              ).toLocaleDateString(),
              time: editFormData.time,
              hasRegistrationFee: editFormData.hasRegistrationFee
                ? "Yes"
                : "No",
              registrationFee: editFormData.hasRegistrationFee
                ? `₹${editFormData.registrationFee}`
                : "Free",
              numberOfParticipants: editFormData.numberOfParticipants,
              instructions: editFormData.instructions,
              prizePool: updateData.prizePool,
              originalData: {
                ...row.originalData,
                ...updateData,
              },
            };
          }
          return row;
        })
      );

      setOpenEditDialog(false);
      console.log(
        `Tournament with ID ${editFormData.id} updated successfully.`
      );
    } catch (error) {
      console.error("Error updating tournament:", error);
      alert("Failed to update tournament. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Tournament?"
    );

    if (!isConfirmed) {
      console.log("Deletion canceled.");
      return;
    }

    try {
      const response = await deleteTournament(id);
      setRows(rows.filter((row) => row.id !== id));
      console.log(`Tournament with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting tournament:", error);
    }
  };

  const columns = [
    {
      field: "slNo",
      headerName: "Sl No",
      flex: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tournamentName",
      headerName: "Tournament Name",
      flex: 200,
    },
    {
      field: "mode",
      headerName: "Mode",
      flex: 100,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: params.value === "online" ? "#e3f2fd" : "#f3e5f5",
            color: params.value === "online" ? "#1976d2" : "#7b1fa2",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            textTransform: "capitalize",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "tournamentCentre",
      headerName: "Centre",
      flex: 150,
    },
    {
      field: "tournamentDate",
      headerName: "Date",
      flex: 120,
    },
    {
      field: "time",
      headerName: "Time",
      flex: 100,
    },
    {
      field: "registrationFee",
      headerName: "Registration Fee",
      flex: 130,
    },
    {
      field: "numberOfParticipants",
      headerName: "Max Participants",
      flex: 130,
    },
    {
      field: "registeredKids",
      headerName: "Registered",
      flex: 100,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={(event) => {
            event.stopPropagation(); // Prevent row click
            handleEdit(params.id);
          }}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={(event) => {
            event.stopPropagation(); // Prevent row click
            handleDelete(params.id);
          }}
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
              to="/super-admin/department/tournaments/add"
            >
              + Add Tournament
            </Button>
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            pageSize={5}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
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

        {/* Tournament Preview Dialog */}
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{
              backgroundColor: "#642b8f",
              color: "white",
              textAlign: "center",
            }}
          >
            Tournament Details Preview
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedTournament && (
              <Box sx={{ p: 2 }}>
                {/* Tournament Header */}
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#642b8f" }}
                  >
                    {selectedTournament.tournamentName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tournament ID: {selectedTournament.id}
                  </Typography>
                </Box>

                {/* Tournament Info Grid */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Mode
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {selectedTournament.mode}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tournament Centre
                    </Typography>
                    <Typography variant="body1">
                      {selectedTournament.tournamentCentre}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1">
                      {selectedTournament.tournamentDate}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Time
                    </Typography>
                    <Typography variant="body1">
                      {selectedTournament.time}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Registration Fee
                    </Typography>
                    <Typography variant="body1">
                      {selectedTournament.registrationFee}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Max Participants
                    </Typography>
                    <Typography variant="body1">
                      {selectedTournament.numberOfParticipants}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Currently Registered
                    </Typography>
                    <Typography variant="body1">
                      {selectedTournament.registeredKids} participants
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography variant="body1">
                      {new Date(
                        selectedTournament.createdAt
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                {/* Prize Pool Section */}
                {selectedTournament.prizePool &&
                  selectedTournament.prizePool.length > 0 && (
                    <Box
                      sx={{
                        mb: 3,
                        p: 2,
                        backgroundColor: "#fff3e0",
                        borderRadius: 2,
                        border: "1px solid #ffcc02",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        Prize Pool
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selectedTournament.prizePool.map((prize, index) => (
                          <Chip
                            key={index}
                            label={`${prize.position}: ₹${prize.amount}`}
                            sx={{
                              backgroundColor: "#642b8f",
                              color: "white",
                              fontWeight: 500,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                {/* Instructions Section */}
                {selectedTournament.instructions && (
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#f8f9fa",
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Tournament Instructions
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "pre-line",
                        lineHeight: 1.6,
                      }}
                    >
                      {selectedTournament.instructions}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenViewDialog(false)}
              color="primary"
              variant="contained"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Tournament Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle
            sx={{
              backgroundColor: "#642b8f",
              color: "white",
              textAlign: "center",
            }}
          >
            Edit Tournament
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tournament Name"
                    variant="outlined"
                    value={editFormData.tournamentName || ""}
                    onChange={(e) =>
                      handleEditFormChange("tournamentName", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mode"
                    variant="outlined"
                    select
                    value={editFormData.mode || ""}
                    onChange={(e) =>
                      handleEditFormChange("mode", e.target.value)
                    }
                  >
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="offline">Offline</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  {editFormData.mode === "offline" ? (
                    <TextField
                      fullWidth
                      label="Tournament Centre"
                      variant="outlined"
                      select
                      value={editFormData.centerId || ""}
                      onChange={(e) => handleCenterChange(e.target.value)}
                    >
                      {physicalCenters
                        .filter((center) => center.centerType === "offline")
                        .map((center) => (
                          <MenuItem key={center._id} value={center._id}>
                            {center.centerName}
                          </MenuItem>
                        ))}
                    </TextField>
                  ) : (
                    <TextField
                      fullWidth
                      label="Tournament Centre"
                      variant="outlined"
                      value={editFormData.tournamentCentre || ""}
                      onChange={(e) =>
                        handleEditFormChange("tournamentCentre", e.target.value)
                      }
                    />
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tournament Date"
                    type="date"
                    variant="outlined"
                    value={editFormData.tournamentDate || ""}
                    onChange={(e) =>
                      handleEditFormChange("tournamentDate", e.target.value)
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Time"
                    type="time"
                    variant="outlined"
                    value={editFormData.time || ""}
                    onChange={(e) =>
                      handleEditFormChange("time", e.target.value)
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editFormData.hasRegistrationFee || false}
                        onChange={(e) =>
                          handleEditFormChange(
                            "hasRegistrationFee",
                            e.target.checked
                          )
                        }
                        color="primary"
                      />
                    }
                    label="Has Registration Fee"
                  />
                </Grid>

                {editFormData.hasRegistrationFee && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Registration Fee (₹)"
                      type="number"
                      variant="outlined"
                      value={editFormData.registrationFee || ""}
                      onChange={(e) =>
                        handleEditFormChange(
                          "registrationFee",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Maximum Participants"
                    type="number"
                    variant="outlined"
                    value={editFormData.numberOfParticipants || ""}
                    onChange={(e) =>
                      handleEditFormChange(
                        "numberOfParticipants",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </Grid>

                {/* Prize Pool Section */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Prize Pool
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={addPrizeEntry}
                      sx={{ mb: 2 }}
                    >
                      Add Prize
                    </Button>
                  </Box>

                  {editFormData.prizePool &&
                    editFormData.prizePool.map((prize, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          gap: 2,
                          mb: 2,
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          label="Position"
                          variant="outlined"
                          value={prize.position || ""}
                          onChange={(e) =>
                            handlePrizePoolChange(
                              index,
                              "position",
                              e.target.value
                            )
                          }
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          label="Amount (₹)"
                          type="number"
                          variant="outlined"
                          value={prize.amount || ""}
                          onChange={(e) =>
                            handlePrizePoolChange(
                              index,
                              "amount",
                              e.target.value
                            )
                          }
                          sx={{ flex: 1 }}
                        />
                        <IconButton
                          color="error"
                          onClick={() => removePrizeEntry(index)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    ))}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Instructions"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={editFormData.instructions || ""}
                    onChange={(e) =>
                      handleEditFormChange("instructions", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenEditDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              color="primary"
              variant="contained"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default TournamentMasterList;
