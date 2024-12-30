import {
  Button,
  Select,
  Divider,
  MenuItem,
  TextField,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchTournamentById,
  createTournament,
  updateTournament,
} from "../../../api/service/employee/EmployeeService";

const ChessTournamentForm = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [tournaments, setTournaments] = useState([
    {
      id: 1,
      tournamentDate: "",
      tournamentCentre: "",
      time: "",
      tournamentType: "",
      registrationFee: "",
      registeredKids: [],
      numberOfParticipants: "",
    },
  ]);

  const tournamentTypes = ["Blitz", "Rapid", "Classical"];
  const statusOptions = ["Ongoing", "Completed", "Cancelled"];
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (id) {
      // Fetch tournament data for the given ID
      handleFetchTournament(id);
    }
  }, [id]);

  const handleFetchTournament = async (id) => {
    try {
      const data = await fetchTournamentById(id);
      setTournaments([data]); // Populate the form with the fetched tournament data
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Create a Tournament
  const handleCreateTournament = async (data) => {
    try {
      await createTournament(data);
      alert("Tournament created successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Update a Tournament
  const handleUpdateTournament = async (id, data) => {
    try {
      await updateTournament(id, data);
      alert("Tournament updated successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const addTournament = () => {
    setTournaments([
      ...tournaments,
      {
        id: tournaments.length + 1,
        tournamentDate: "",
        tournamentCentre: "",
        time: "",
        tournamentType: "",
        registrationFee: "",
        registeredKids: [],
        numberOfParticipants: "",
      },
    ]);
  };

  const removeTournament = (id) => {
    setTournaments(tournaments.filter((tournament) => tournament.id !== id));
  };
  const handleTournamentChange = (id, field, value) => {
    const updatedTournaments = tournaments.map((tournament) =>
      tournament.id === id ? { ...tournament, [field]: value } : tournament
    );
    setTournaments(updatedTournaments);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      for (let tournament of tournaments) {
        if (Object.values(tournament).every((value) => value !== "")) {
          if (id) {
            await handleUpdateTournament(tournament.id, tournament);
          } else {
            await handleCreateTournament(tournament);
          }
        }
      }
      setTournaments([
        {
          id: 1,
          tournamentDate: "",
          tournamentCentre: "",
          time: "",
          tournamentType: "",
          registrationFee: "",
          registeredKids: [],
          numberOfParticipants: "",
        },
      ]);
      alert("Tournaments submitted successfully!");
    } catch (error) {
      alert("Error while submitting tournaments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "tournamentDate", headerName: "Date of Tournament", width: 180 },
    { field: "tournamentCentre", headerName: "Tournament Centre", width: 200 },
    { field: "time", headerName: "Time", width: 150 },
    { field: "tournamentType", headerName: "Type of Tournament", width: 200 },
    { field: "registrationFee", headerName: "Registration Fee", width: 150 },
    { field: "registeredKids", headerName: "Registered Kids", width: 150 },
    {
      field: "numberOfParticipants",
      headerName: "Number of Participants",
      width: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <button
          type="button"
          onClick={() => removeTournament(params.row.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash className="h-5 w-5" />
        </button>
      ),
    },
  ];
  const registeredKids = ["kid1", "kid2", "kid3", "kid4", "kid5"]; // Example options for kids

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Chess Tournament Form</h2>
            <p className="text-sm opacity-90">
              Please fill in the tournament details
            </p>
          </div>
          <Button
            variant="contained"
            color="#642b8f"
            component={Link}
            to="/tournaments"
          >
            View Tournaments
          </Button>
        </div>
        <form className="p-8" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#642b8f]">
              Tournament Details
            </h3>
            {tournaments.map((tournament, index) => (
              <div key={tournament.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#642b8f]">
                    Tournament {index + 1}
                  </label>
                  {tournaments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTournament(tournament.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date of Tournament - Text input */}
                  <TextField
                    type="date"
                    label="Date of Tournament"
                    value={tournament.tournamentDate}
                    onChange={(e) =>
                      handleTournamentChange(
                        tournament.id,
                        "tournamentDate",
                        e.target.value
                      )
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />

                  {/* Time - Text input */}
                  <TextField
                    type="time"
                    label="Time"
                    value={tournament.time}
                    onChange={(e) =>
                      handleTournamentChange(
                        tournament.id,
                        "time",
                        e.target.value
                      )
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  {/* Tournament Centre - Select input */}
                  <TextField
                    select
                    label="Tournament Centre"
                    value={tournament.tournamentCentre}
                    onChange={(e) =>
                      handleTournamentChange(
                        tournament.id,
                        "tournamentCentre",
                        e.target.value
                      )
                    }
                    fullWidth
                  >
                    {/* Example options */}
                    {["Centre A", "Centre B", "Centre C"].map((centre) => (
                      <MenuItem key={centre} value={centre}>
                        {centre}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Type of Tournament - Select input */}
                  <TextField
                    select
                    label="Type of Tournament"
                    value={tournament.tournamentType}
                    onChange={(e) =>
                      handleTournamentChange(
                        tournament.id,
                        "tournamentType",
                        e.target.value
                      )
                    }
                    fullWidth
                  >
                    {tournamentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Registration Fee - Text input */}
                  <TextField
                    label="Registration Fee"
                    value={tournament.registrationFee}
                    onChange={(e) =>
                      handleTournamentChange(
                        tournament.id,
                        "registrationFee",
                        e.target.value
                      )
                    }
                    fullWidth
                  />

                  {/* Registered Kids - Select input */}
                  <Select
                    labelId="registered-kids-label"
                    id="registered-kids"
                    multiple
                    value={tournament.registeredKids}
                    onChange={(e) =>
                      handleTournamentChange(
                        tournament.id,
                        "registeredKids",
                        e.target.value
                      )
                    }
                    input={<OutlinedInput label="Registered Kids" />}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 250,
                          width: "100%",
                          maxWidth: 300,
                        },
                      },
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                    }}
                    fullWidth
                    sx={{
                      width: "100%",
                      maxWidth: 400,
                      "& .MuiSelect-select": {
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        padding: "8px 14px",
                      },
                    }}
                    renderValue={(selected) => (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "4px",
                        }}
                      >
                        {selected.map((value) => (
                          <div
                            key={value}
                            style={{
                              backgroundColor: "#e0e0e0",
                              borderRadius: "4px",
                              padding: "2px 6px",
                              margin: "2px",
                              fontSize: "0.8rem",
                            }}
                          >
                            {value}
                          </div>
                        ))}
                      </div>
                    )}
                  >
                    {registeredKids.map((kid) => (
                      <MenuItem key={kid} value={kid}>
                        <Checkbox
                          checked={tournament.registeredKids.indexOf(kid) > -1}
                        />
                        <ListItemText primary={kid} />
                      </MenuItem>
                    ))}
                  </Select>

                  {/* Number of Participants - Text input */}
                  <TextField
                    label="Number of Participants"
                    value={tournament.numberOfParticipants}
                    onChange={(e) =>
                      handleTournamentChange(
                        tournament.id,
                        "numberOfParticipants",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addTournament}
              className="text-[#642b8f] hover:text-[#642b8f] font-medium text-sm transition-colors"
            >
              + Add Tournament
            </button>
          </div>
          <Divider className="my-6" />
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={tournaments.map((tournament) => ({
                ...tournament,
                id: tournament._id || tournament.id,
              }))}
              columns={columns}
              pageSize={5}
              disableSelectionOnClick
              checkboxSelection
              getRowId={(row) => row.id}
            />
          </div>
          <div className="flex justify-center gap-6 mt-12">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#642b8f] transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? "Submitting..." : "Submit Tournaments"}
            </button>
            <button
              type="reset"
              className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
              onClick={() =>
                setTournaments([
                  {
                    id: 1,
                    tournamentDate: "",
                    tournamentCentre: "",
                    time: "",
                    tournamentType: "",
                    registrationFee: "",
                    registeredKids: "",
                    numberOfParticipants: "",
                  },
                ])
              }
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ChessTournamentForm;
