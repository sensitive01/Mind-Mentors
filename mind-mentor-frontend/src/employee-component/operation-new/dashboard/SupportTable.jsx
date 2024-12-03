// import {
//     Box,
//     Button,
//     createTheme,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     Divider,
//     Fade,
//     Grid,
//     Paper,
//     Slide,
//     TextField,
//     ThemeProvider,
//     Typography
// } from '@mui/material';
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
// import React, { useEffect, useState } from 'react';
// import columns from './SupportColumn'; // Import columns from the separate file
// import tasks from './Tasks';

// import { alpha } from '@mui/material/styles';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// // Updated modern color scheme
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#642b8f', // Indigo
//     // main: '#f8a213', // Indigo
//       light: '#818CF8',
//       dark: '#4F46E5',
//     },
//     secondary: {
//       main: '#EC4899', // Pink
//       light: '#F472B6',
//       dark: '#DB2777',
//     },
//     warm: {
//       main: '#F59E0B', // Amber
//       light: '#FCD34D',
//       dark: '#D97706',
//     },
//     cold: {
//       main: '#3B82F6', // Blue
//       light: '#60A5FA',
//       dark: '#2563EB',
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
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           backgroundImage: 'none',
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none',
//           borderRadius: 8,
//         },
//       },
//     },
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

// const DetailView = ({ data }) => (
//   <Grid container spacing={3} sx={{ p: 2 }}>
//     {Object.entries(data).map(([key, value]) => (
//       key !== 'id' && (
//         <Grid item xs={12} sm={6} md={4} key={key}>
//           <Box
//             sx={{
//               p: 2,
//               borderRadius: 2,
//               bgcolor: alpha(theme.palette.primary.main, 0.04),
//               height: '100%',
//             }}
//           >
//             <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
//               {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
//             </Typography>
//             <Typography variant="body1" color="text.primary">
//               {value || 'N/A'}
//             </Typography>
//           </Box>
//         </Grid>
//       )
//     ))}
//   </Grid>
// );

// const Supports  = () => {

//   const [rows, setRows] = useState([]);

//   useEffect(() => {
//     setRows(tasks); // Set the imported data into the state
//   }, []);
//   const [noteDialog, setNoteDialog] = useState({
//     open: false,
//     rowData: null,
//     noteText: ''
//   });

//   const [viewDialog, setViewDialog] = useState({
//     open: false,
//     rowData: null
//   });

//   const [paginationModel, setPaginationModel] = useState({
//     page: 0,
//     pageSize: 5,
//   });

//   const [editRowsModel, setEditRowsModel] = useState({});

//   const handleStatusToggle = (id) => {
//     setRows(rows.map(row => {
//       if (row.id === id) {
//         const newStatus = row.status === 'Warm' ? 'Cold' : 'Warm';
//         return {
//           ...row,
//           status: newStatus,
//           stageTag: newStatus
//         };
//       }
//       return row;
//     }));
//   };

//   const handleNoteSave = () => {
//     if (noteDialog.rowData) {
//       setRows(rows.map(row =>
//         row.id === noteDialog.rowData.id
//           ? { ...row, notes: noteDialog.noteText }
//           : row
//       ));
//       setNoteDialog({ open: false, rowData: null, noteText: '' });
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Fade in={true}>
//         <Box sx={{ width: '100%', height: '100%', p: 3 }}>
//           <Paper
//             elevation={0}
//             sx={{
//               p: 3,
//               backgroundColor: 'background.paper',
//               borderRadius: 3,
//               height: 650,
//               boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
//             }}
//           >
//            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//   <Typography
//     variant="h5"
//     gutterBottom
//     sx={{
//       color: 'text.primary',
//       fontWeight: 600,
//       mb: 3
//     }}
//   >
//     Supports Requests
//   </Typography>
//   <Button
//     onClick={handleNoteSave}
//     variant="contained"
//     href="/employee-operation-tasks/support/add"  // Add the desired URL here
//     className=" bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
//     sx={{
//       bgcolor: 'primary.main',
//       '&:hover': {
//         bgcolor: 'primary.dark',
//       }
//     }}
//   >
//     Add Support
//   </Button>
// </Box>
//             <DataGrid

//               rows={rows}
//               columns={columns(theme, handleStatusToggle, setViewDialog, setNoteDialog)} // Pass necessary functions as parameters
//               paginationModel={paginationModel}
//               onPaginationModelChange={setPaginationModel}
//               pageSizeOptions={[5, 10, 25]}
//               checkboxSelection
//               disableRowSelectionOnClick
//               slots={{ toolbar: GridToolbar }}
//               slotProps={{
//                 toolbar: {
//                   showQuickFilter: true,
//                   quickFilterProps: { debounceMs: 500 },
//                 },
//               }}
//               sx={{
//                 height: 500, // Fixed height for the table

//                 '& .MuiDataGrid-cell:focus': {
//                   outline: 'none',
//                 },
//                 '& .MuiDataGrid-row:hover': {
//                   backgroundColor: alpha(theme.palette.primary.main, 0.04),
//                 },
//                 '& .MuiDataGrid-columnHeader': {
//                 backgroundColor: '#642b8f',
//                 color: 'white',
//                 fontWeight: 600,
//               },
//               }}
//             />

//             {/* View Dialog */}
//             <Dialog
//               open={viewDialog.open}
//               onClose={() => setViewDialog({ open: false, rowData: null })}
//               maxWidth="md"
//               fullWidth
//               TransitionComponent={Slide}
//               TransitionProps={{ direction: "up" }}
//             >
//               <DialogTitle sx={{
//                 background: 'linear-gradient(#642b8f, #aa88be)',
//                 color: '#ffffff',
//                 fontWeight: 600
//               }}>
//                 Student Details
//               </DialogTitle>
//               <Divider />
//               <DialogContent>
//                 <DetailView data={viewDialog.rowData || {}} />
//               </DialogContent>
//               <Divider sx={{ borderColor: '#aa88be' }} />

//               <DialogActions sx={{ p: 2.5 }}>
//                 <Button
//                 class="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
//                   onClick={() => setViewDialog({ open: false, rowData: null })}
//                   variant="outlined"
//                   sx={{
//                     color: '#f8a213',
//                     borderColor: '#f8a213'
//                   }}
//                 >
//                   Close
//                 </Button>
//               </DialogActions>
//             </Dialog>

// {/* Notes Dialog */}
// <Dialog
//   open={noteDialog.open}
//   onClose={() => setNoteDialog({ open: false, rowData: null, noteText: '', enquiryStage: '', notesTo: '', parents: '' })}
//   maxWidth="sm"
//   fullWidth
//   TransitionComponent={Slide}
//   TransitionProps={{ direction: "up" }}
//   BackdropProps={{
//     sx: {
//       backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a semi-transparent black color
//       backdropFilter: 'blur(4px)',          // Applies a blur effect to the backdrop
//     },
//   }}
// >
//   <DialogTitle
//   sx={{
//     color: '#ffffff',
//     fontWeight: 600,
//     background: 'linear-gradient(to right, #642b8f, #aa88be)', // Apply the gradient background

//   }}>
//     Add Note
//   </DialogTitle>
//   <Divider />
//   <DialogContent>

//     {/* Enquiry Stage Select Box */}
//     <FormControl fullWidth sx={{ mt: 2 }}>
//       <InputLabel>Enquiry Stage</InputLabel>
//       <Select
//         value={noteDialog.enquiryStage}
//         onChange={(e) => setNoteDialog(prev => ({ ...prev, enquiryStage: e.target.value }))}
//         label="Enquiry Stage"
//       >
//         <MenuItem value="New">New</MenuItem>
//         <MenuItem value="Follow-Up">Follow-Up</MenuItem>
//         <MenuItem value="Closed">Closed</MenuItem>
//         <MenuItem value="Converted">Converted</MenuItem>
//       </Select>
//     </FormControl>

//     {/* Notes To Field */}
//     <TextField
//       label="Notes To"
//       value={noteDialog.notesTo}
//       onChange={(e) => setNoteDialog(prev => ({ ...prev, notesTo: e.target.value }))}
//       fullWidth
//       sx={{ mt: 2 }}
//     />

//     <TextField
//       label="Note"
//       value={noteDialog.noteText}
//       onChange={(e) => setNoteDialog(prev => ({ ...prev, noteText: e.target.value }))}
//       multiline
//       rows={4}
//       fullWidth
//       sx={{ mt: 1 }}
//     />
//   </DialogContent>
//   <Divider sx={{ borderColor: '#aa88be' }} />
//   <DialogActions sx={{ p: 2.5 }}>

//     <Button
//       onClick={handleNoteSave}
//       variant="contained"
//       class="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
//       sx={{
//         bgcolor: 'primary.main',
//         '&:hover': {
//           bgcolor: 'primary.dark',
//         }
//       }}
//     >
//       Save Note
//     </Button>

//     <Button
//     class="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
//       onClick={() => setNoteDialog({ open: false, rowData: null, noteText: '', enquiryStage: '', notesTo: '', parents: '' })}
//       variant="outlined"
//       sx={{
//         color: 'text.primary',
//         borderColor: 'divider'
//       }}
//       type='reset'
//     >
//       Cancel
//     </Button>
//   </DialogActions>
// </Dialog>

//           </Paper>
//         </Box>
//       </Fade>
//     </ThemeProvider>
//   );
// };

// export default Supports ;
import { useState } from "react";
import { Search, Send, Filter, Plus, Clock, X } from "lucide-react";
import avatar from "../../../images/accountInage.webp";
import { Link } from 'react-router-dom'; // Import Link for navigation

const DemoTickets = [
  {
    id: "T-1001",
    topic: "Login Issue",
    description: "Unable to access account",
    status: "open",
    lastUpdate: "2024-11-15",
    priority: "high",
  },
  {
    id: "T-1002",
    topic: "Payment Failed",
    description: "Transaction error on checkout",
    status: "in-progress",
    lastUpdate: "2024-11-14",
    priority: "medium",
  },
  {
    id: "T-1003",
    topic: "Feature Request",
    description: "Dark mode suggestion",
    status: "resolved",
    lastUpdate: "2024-11-13",
    priority: "low",
  },
  {
    id: "T-1004",
    topic: "Mobile App Crash",
    description: "App crashes on startup",
    status: "open",
    lastUpdate: "2024-11-15",
    priority: "high",
  },
];

const DemoMessages = {
  "T-1001": [
    {
      sender: "user",
      message: "I can't log into my account since yesterday",
      time: "09:00",
      avatar: avatar,
    },
    {
      sender: "agent",
      message:
        "I'm sorry to hear that. Can you tell me what error message you're seeing?",
      time: "09:05",
      avatar: avatar,
    },
    {
      sender: "user",
      message:
        "It says 'Invalid credentials' but I'm sure my password is correct",
      time: "09:07",
      avatar: avatar,
    },
  ],
  "T-1002": [
    {
      sender: "user",
      message: "Payment keeps failing on checkout",
      time: "14:20",
      avatar: avatar,
    },
    {
      sender: "agent",
      message:
        "Let me check the transaction logs. Could you provide the order number?",
      time: "14:25",
      avatar: avatar,
    },
  ],
};

const Support = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [newTicketTopic, setNewTicketTopic] = useState("");
  const [newTicketDescription, setNewTicketDescription] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "in-progress":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "resolved":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const filteredTickets = DemoTickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    return matchesSearch && ticket.status === activeFilter;
  });

  const handleNewTicketSubmit = () => {
    if (!newTicketTopic.trim() || !newTicketDescription.trim()) {
      return;
    }

    const newTicket = {
      id: `T-${(DemoTickets.length + 1).toString().padStart(4, "0")}`,
      topic: newTicketTopic,
      description: newTicketDescription,
      status: "open",
      lastUpdate: new Date().toLocaleDateString(),
      priority: "medium",
    };
    DemoTickets.push(newTicket);
    setNewTicketTopic("");
    setNewTicketDescription("");
    setIsNewTicketModalOpen(false);
  };

  return (
    <div className="relative flex h-[600px] bg-gray-50 rounded-xl shadow-xl overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Support Tickets</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setShowFilterOptions(!showFilterOptions)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <Filter size={16} className="text-gray-600" />
                </button>
                {showFilterOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border">
                    <button
                      onClick={() => {
                        setActiveFilter("open");
                        setShowFilterOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilter("in-progress");
                        setShowFilterOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      In-progress
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilter("resolved");
                        setShowFilterOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Resolved
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`p-4 border-b cursor-pointer transition-all duration-200 hover:bg-purple-50
                ${
                  selectedTicket?.id === ticket.id
                    ? "bg-purple-50 border-l-4 border-l-purple-600"
                    : ""
                }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-gray-900">{ticket.id}</div>
                  <div className="text-sm font-medium text-gray-800">
                    {ticket.topic}
                  </div>
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </div>
              </div>
              <div className="text-sm text-gray-500 line-clamp-2">
                {ticket.description}
              </div>
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                {ticket.lastUpdate}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <button
          onClick={() => setIsNewTicketModalOpen(true)}
          className="absolute top-4 right-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus size={16} />
          <Link to="/employee-operation-tasks/support/add">
            <span>New Ticket</span>
          </Link>
        </button>

        {selectedTicket ? (
          <div className="flex-1 flex flex-col h-full">
            <div className="p-6 border-b bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTicket.topic}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Ticket ID: {selectedTicket.id}{" "}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                {DemoMessages[selectedTicket.id]?.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start max-w-md ${
                        message.sender === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <img
                        src={message.avatar}
                        alt={message.sender}
                        className="w-8 h-8 rounded-full"
                      />
                      <div
                        className={`mx-2 p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input Area */}
            <div className="p-4 bg-white border-t">
              {selectedTicket.status === "resolved" ? (
                <div className="text-center py-3 bg-gray-50 rounded-lg text-gray-500">
                  This ticket has been resolved and is closed for new messages
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-3 h-20 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={() => console.log("Message sent:", newMessage)}
                    className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a ticket to view the conversation
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Create New Ticket
              </h3>
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={newTicketTopic}
                  onChange={(e) => setNewTicketTopic(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter ticket topic"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTicketDescription}
                  onChange={(e) => setNewTicketDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe your issue"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t">
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleNewTicketSubmit}
                disabled={
                  !newTicketTopic.trim() || !newTicketDescription.trim()
                }
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
