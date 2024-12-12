import { Button, Divider, MenuItem, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const ChessTournamentForm = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [tournaments, setTournaments] = useState([
    {
      id: 1,
      name: '',
      organizer: '',
      type: '',
      entryFee: '',
      status: '',
      startDate: '',
      endDate: '',
      location: ''
    }
  ]);
  const tournamentTypes = ['Blitz', 'Rapid', 'Classical'];
  const statusOptions = ['Ongoing', 'Completed', 'Cancelled'];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      // Fetch tournament data for the given ID
      fetchTournamentById(id);
    }
  }, [id]);

  const fetchTournamentById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/superadmin/tournaments/${id}`);
      setTournaments([response.data]); // Populate the form with the fetched tournament data
    } catch (error) {
      console.error('Error fetching tournament:', error);
      alert('Failed to fetch tournament details.');
    }
  };

  const createTournament = async (tournamentData) => {
    console.log('Creating tournament:', tournamentData);
    try {
      await axios.post('http://localhost:3000/superadmin/tournaments', tournamentData);
      alert('Tournament created successfully!');
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Failed to create tournament.');
    }
  };

  const updateTournament = async (id, tournamentData) => {
    try {
      await axios.put(`http://localhost:3000/superadmin/tournaments/${id}`, tournamentData);
      alert('Tournament updated successfully!');
    } catch (error) {
      console.error('Error updating tournament:', error);
      alert('Failed to update tournament.');
    }
  };

  const addTournament = () => {
    setTournaments([
      ...tournaments,
      {
        id: tournaments.length + 1,
        name: '',
        organizer: '',
        type: '',
        entryFee: '',
        status: '',
        startDate: '',
        endDate: '',
        location: ''
      }
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
        if (Object.values(tournament).every((value) => value !== '')) {
          if (id) {
            await updateTournament(tournament.id, tournament);
          } else {
            await createTournament(tournament);
          }
        }
      }
      setTournaments([
        {
          id: 1,
          name: '',
          organizer: '',
          type: '',
          entryFee: '',
          status: '',
          startDate: '',
          endDate: '',
          location: ''
        }
      ]);
      alert('Tournaments submitted successfully!');
    } catch (error) {
      alert('Error while submitting tournaments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Tournament Name', width: 200 },
    { field: 'organizer', headerName: 'Organizer Name', width: 200 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'entryFee', headerName: 'Entry Fee', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'startDate', headerName: 'Start Date', width: 180 },
    { field: 'endDate', headerName: 'End Date', width: 180 },
    { field: 'location', headerName: 'Location', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <button
          type="button"
          onClick={() => removeTournament(params.row.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash className="h-5 w-5" />
        </button>
      )
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Chess Tournament Form</h2>
            <p className="text-sm opacity-90">Please fill in the tournament details</p>
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
                  <label className="text-sm font-medium text-[#642b8f]">Tournament {index + 1}</label>
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
                  <TextField
                    label="Tournament Name"
                    value={tournament.name}
                    onChange={(e) => handleTournamentChange(tournament.id, 'name', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Organizer Name"
                    value={tournament.organizer}
                    onChange={(e) => handleTournamentChange(tournament.id, 'organizer', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    select
                    label="Type"
                    value={tournament.type}
                    onChange={(e) => handleTournamentChange(tournament.id, 'type', e.target.value)}
                    fullWidth
                  >
                    {tournamentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Entry Fee"
                    value={tournament.entryFee}
                    onChange={(e) => handleTournamentChange(tournament.id, 'entryFee', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    select
                    label="Status"
                    value={tournament.status}
                    onChange={(e) => handleTournamentChange(tournament.id, 'status', e.target.value)}
                    fullWidth
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    type="date"
                    label="Start Date"
                    value={tournament.startDate}
                    onChange={(e) => handleTournamentChange(tournament.id, 'startDate', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    type="date"
                    label="End Date"
                    value={tournament.endDate}
                    onChange={(e) => handleTournamentChange(tournament.id, 'endDate', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Location"
                    value={tournament.location}
                    onChange={(e) => handleTournamentChange(tournament.id, 'location', e.target.value)}
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
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={tournaments.map(tournament => ({ ...tournament, id: tournament._id || tournament.id }))}
              columns={columns}
              pageSize={5}
              disableSelectionOnClick
              checkboxSelection
              getRowId={(row) => row.id} // Ensure the 'id' is the unique identifier
            />


          </div>
          <div className="flex justify-center gap-6 mt-12">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#642b8f] transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? 'Submitting...' : 'Submit Tournaments'}
            </button>
            <button
              type="reset"
              className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
              onClick={() =>
                setTournaments([{ id: 1, name: '', organizer: '', type: '', entryFee: '', status: '', startDate: '', endDate: '', location: '' }])
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
