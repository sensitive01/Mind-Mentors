
// // import React, { useState } from 'react';
// // import axios from 'axios';

// // function App() {
// //   const [authUrl, setAuthUrl] = useState('');
// //   const [courses, setCourses] = useState([]);

// //   const getAuthUrl = async () => {
// //     const response = await axios.get('http://localhost:3000/meetings/auth-url');
// //     setAuthUrl(response.data.url);
// //   };

// //   const getCourses = async () => {
// //     const params = new URLSearchParams(window.location.search);
// //     const accessToken = params.get('access_token');
// //     if (accessToken) {
// //       const response = await axios.get('http://localhost:3000/meetings/courses', {
// //         headers: { Authorization: `Bearer ${accessToken}` },
// //       });
// //       setCourses(response.data);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h1>Google Classroom Integration</h1>
// //       {!authUrl && <button onClick={getAuthUrl}>Get Authentication URL</button>}
// //       {authUrl && (
// //         <a href={authUrl}>
// //           <button>Authenticate with Google</button>
// //         </a>
// //       )}
// //       <button onClick={getCourses}>Fetch Courses</button>
// //       {courses.length > 0 && (
// //         <ul>
// //           {courses.map((course) => (
// //             <li key={course.id}>{course.name}</li>
// //           ))}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // }

// // export default App;



// import React, { useState } from 'react';
// import axios from 'axios';

// const GoogleMeet = () => {
//   const [meetLink, setMeetLink] = useState(null);

//   const handleAuth = () => {
//     window.location.href = 'http://localhost:3000/auth'; // Redirect to OAuth
//   };

//   const createMeet = async () => {
//     try {
//       const response = await axios.post('http://localhost:3000/create-meet');
//       setMeetLink(response.data.meetLink);
//     } catch (error) {
//       console.error('Error creating Google Meet:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Create Google Meet via React and Node.js</h1>
//       <button onClick={handleAuth}>Sign in with Google</button>
//       <button onClick={createMeet}>Create Google Meet</button>
//       {meetLink && (
//         <div>
//           <h2>Google Meet Link:</h2>
//           <a href={meetLink} target="_blank" rel="noopener noreferrer">
//             {meetLink}
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GoogleMeet;

// import React, { useState, useEffect } from 'react';
// import { Box, CssBaseline, ThemeProvider, createTheme, Grid, Typography, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, Paper, TextField, IconButton } from '@mui/material';
// import { Call, VideoCall, Send, Add } from '@mui/icons-material';
// import Webex from 'webex';

// // Initialize Webex SDK (replace with OAuth token or personal access token)

// // Example access token (replace with your actual token)
// const access_token = 'YjgyYjNhOGQtZDQ2OC00YjE5LWFkZGItMzg5ODNlZTBhMWE4YzZkYTY5Y2ItZjhm_P0A1_2f0172eb-45f8-4063-ab1b-45f9b4cdf45a';
// console.log('Access Token:', access_token);

// // Initialize Webex SDK with the access token
// const webex = Webex.init({
//   access_token: access_token,
// });
// console.log('Webex SDK Initialized:', webex);

// // Main App Component
// const WebexApp = () => {
//   const [contacts, setContacts] = useState([]);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   console.log('Webex SDK Initialized:', webex);


//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         console.log('Fetching contacts...');
//         const rooms = await webex.rooms.list();
//         console.log('Rooms fetched:', rooms);
        
//         const contacts = rooms.items.map(room => ({
//           id: room.id,
//           title: room.title,
//         }));
//         console.log('Contacts:', contacts);
//         setContacts(contacts);
//       } catch (error) {
//         console.error('Error fetching rooms:', error);
//       }
//     };

//     fetchContacts();
//   }, []);

//   const handleContactSelect = async (contact) => {
//     console.log('Selected Contact:', contact);
//     setSelectedContact(contact);
    
//     if (contact) {
//       const contactMessages = await fetchMessagesForContact(contact.id);
//       console.log('Messages for selected contact:', contactMessages);
//       setMessages(contactMessages);
//     }
//   };

//   const fetchMessagesForContact = async (contactId) => {
//     try {
//       console.log('Fetching messages for contact ID:', contactId);
//       const response = await webex.messages.list({ toPersonId: contactId });
//       console.log('Fetched messages:', response.items);
//       return response.items;
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       return [];
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!selectedContact || !newMessage.trim()) {
//       console.log('No selected contact or message is empty');
//       return;
//     }

//     console.log('Sending message to:', selectedContact.id);
//     try {
//       const message = await webex.messages.create({
//         text: newMessage,
//         toPersonId: selectedContact.id,
//       });
//       console.log('Message sent:', message);
//       setMessages([...messages, message]);
//       setNewMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   const theme = createTheme({
//     palette: {
//       mode: 'dark',
//       primary: {
//         main: '#1976d2'
//       }
//     }
//   });
//   console.log('Webex SDK Initialized:', webex);

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Box sx={{ height: '100vh', display: 'flex' }}>
//         <Grid container>
//           {/* Sidebar */}
//           <Grid item xs={4} sx={{ borderRight: '1px solid rgba(255,255,255,0.12)', height: '100vh', overflowY: 'auto' }}>
//             <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
//               <Typography variant="h5">Webex</Typography>
//               <IconButton color="primary">
//                 <Add />
//               </IconButton>
//             </Box>

//             <List>
//               {contacts.map(contact => (
//                 <ListItem key={contact.id} onClick={() => handleContactSelect(contact)} selected={selectedContact?.id === contact.id}>
//                   <ListItemAvatar>
//                     <Avatar src={contact.avatar && contact.avatar.url} />
//                   </ListItemAvatar>
//                   <ListItemText primary={contact.displayName} secondary="Last Message" />
//                 </ListItem>
//               ))}
//             </List>
//           </Grid>

//           {/* Chat Area */}
//           <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//             {selectedContact ? (
//               <>
//                 {/* Chat Header */}
//                 <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
//                   <Avatar src={selectedContact.avatar && selectedContact.avatar.url} sx={{ mr: 2 }} />
//                   <Typography variant="h6">{selectedContact.displayName}</Typography>
//                   <Box sx={{ ml: 'auto' }}>
//                     <IconButton color="primary"><Call /></IconButton>
//                     <IconButton color="primary"><VideoCall /></IconButton>
//                   </Box>
//                 </Box>

//                 {/* Messages Area */}
//                 <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
//                   {messages.map(message => (
//                     <Paper key={message.id} sx={{ p: 1, mb: 1, maxWidth: '70%', alignSelf: 'flex-start' }}>
//                       <Typography>{message.text}</Typography>
//                     </Paper>
//                   ))}
//                 </Box>

//                 {/* Message Input */}
//                 <Box sx={{ display: 'flex', p: 2, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     placeholder="Type a message"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     sx={{ mr: 2 }}
//                   />
//                   <Button variant="contained" color="primary" onClick={handleSendMessage}>
//                     <Send />
//                   </Button>
//                 </Box>
//               </>
//             ) : (
//               <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
//                 <Typography variant="h6" color="textSecondary">
//                   Select a contact to start chatting
//                 </Typography>
//               </Box>
//             )}
//           </Grid>
//         </Grid>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default WebexApp;



import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  Grid, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Paper, 
  TextField, 
  IconButton 
} from '@mui/material';
import { 
  Call, 
  VideoCall, 
  Chat, 
  Person, 
  Send, 
  Add 
} from '@mui/icons-material';

// Mock API Service
class WebexService {
  constructor() {
    this.contacts = [
      { 
        id: '1', 
        name: 'John Doe', 
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        lastMessage: 'Hey, are we meeting today?',
        unreadCount: 2
      },
      { 
        id: '2', 
        name: 'Jane Smith', 
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        lastMessage: 'Project update looks good',
        unreadCount: 1
      }
    ];

    this.messages = [
      {
        id: 'm1',
        senderId: '1',
        text: 'Hey, are we meeting today?',
        timestamp: new Date()
      }
    ];
  }

  async getContacts() {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.contacts), 500);
    });
  }

  async getMessagesForContact(contactId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const contactMessages = this.messages.filter(
          msg => msg.senderId === contactId
        );
        resolve(contactMessages);
      }, 500);
    });
  }

  async sendMessage(contactId, text) {
    const newMessage = {
      id: `m${this.messages.length + 1}`,
      senderId: contactId,
      text,
      timestamp: new Date()
    };
    this.messages.push(newMessage);
    return newMessage;
  }
}

// Main App Component
const WebexApp = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const webexService = new WebexService();

  useEffect(() => {
    const fetchContacts = async () => {
      const fetchedContacts = await webexService.getContacts();
      setContacts(fetchedContacts);
    };
    fetchContacts();
  }, []);

  const handleContactSelect = async (contact) => {
    setSelectedContact(contact);
    const contactMessages = await webexService.getMessagesForContact(contact.id);
    setMessages(contactMessages);
  };

  const handleSendMessage = async () => {
    if (!selectedContact || !newMessage.trim()) return;

    const sentMessage = await webexService.sendMessage(
      selectedContact.id, 
      newMessage
    );
    
    setMessages([...messages, sentMessage]);
    setNewMessage('');
  };

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2'
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex' }}>
        <Grid container>
          {/* Sidebar */}
          <Grid 
            item 
            xs={4} 
            sx={{ 
              borderRight: '1px solid rgba(255,255,255,0.12)', 
              height: '100vh', 
              overflowY: 'auto' 
            }}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h5">Webex</Typography>
              <IconButton color="primary">
                <Add />
              </IconButton>
            </Box>
            
            <List>
              {contacts.map(contact => (
                <ListItem 
                  key={contact.id}
                  onClick={() => handleContactSelect(contact)}
                  selected={selectedContact?.id === contact.id}
                >
                  <ListItemAvatar>
                    <Avatar src={contact.avatar} />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={contact.name}
                    secondary={contact.lastMessage}
                  />
                  {contact.unreadCount && (
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        width: 24, 
                        height: 24, 
                        fontSize: 12 
                      }}
                    >
                      {contact.unreadCount}
                    </Avatar>
                  )}
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Chat Area */}
          <Grid 
            item 
            xs={8} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100vh' 
            }}
          >
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    borderBottom: '1px solid rgba(255,255,255,0.12)' 
                  }}
                >
                  <Avatar src={selectedContact.avatar} sx={{ mr: 2 }} />
                  <Typography variant="h6">
                    {selectedContact.name}
                  </Typography>
                  <Box sx={{ ml: 'auto' }}>
                    <IconButton color="primary">
                      <Call />
                    </IconButton>
                    <IconButton color="primary">
                      <VideoCall />
                    </IconButton>
                  </Box>
                </Box>

                {/* Messages Area */}
                <Box 
                  sx={{ 
                    flexGrow: 1, 
                    overflowY: 'auto', 
                    p: 2 
                  }}
                >
                  {messages.map(message => (
                    <Paper 
                      key={message.id} 
                      sx={{ 
                        p: 1, 
                        mb: 1, 
                        maxWidth: '70%', 
                        alignSelf: 'flex-start' 
                      }}
                    >
                      <Typography>{message.text}</Typography>
                    </Paper>
                  ))}
                </Box>

                {/* Message Input */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    p: 2, 
                    borderTop: '1px solid rgba(255,255,255,0.12)' 
                  }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                  >
                    <Send />
                  </Button>
                </Box>
              </>
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%' 
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  Select a contact to start chatting
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default WebexApp;