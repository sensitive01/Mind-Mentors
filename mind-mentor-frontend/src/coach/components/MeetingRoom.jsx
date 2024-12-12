// import React from "react";
// const MeetingRoom = ({ joinUrl }) => {
//   return (
//     <div>
//       <h1>Join Meeting</h1>
//       {joinUrl ? (
//         <iframe
//           src={joinUrl}
//           title="Zoho Meeting Room"
//           width="100%"
//           height="600"
//           allow="camera; microphone; fullscreen"
//         ></iframe>
//       ) : (
//         <p>No meeting URL provided. Please schedule a meeting first.</p>
//       )}
//     </div>
//   );
// };
// export default MeetingRoom;

import {
  Add,
  Call,
  Send,
  VideoCall
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  createTheme,
  CssBaseline,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  ThemeProvider,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
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