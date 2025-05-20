import React, { useState, useEffect } from 'react';
import { Dialog, Box, Typography, Button, IconButton, Avatar } from '@mui/material';
import { Phone, PhoneOff, X } from 'lucide-react';

const CallNotification = ({ isActive, contactName, contactNumber, onEnd }) => {
  const [callDuration, setCallDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  // Start timer when call becomes active
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      setTimerInterval(interval);
      
      // Clean up interval when component unmounts or call ends
      return () => {
        clearInterval(interval);
        setCallDuration(0);
      };
    } else if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
      setCallDuration(0);
    }
  }, [isActive]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive) return null;

  return (
    <Dialog
      open={isActive}
      onClose={onEnd}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'visible',
          maxWidth: '380px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {/* Header with accent color */}
        <Box sx={{ 
          bgcolor: '#642b8f', 
          color: 'white',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          pt: 2, pb: 8,
          px: 2,
          textAlign: 'center'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton 
              size="small" 
              onClick={onEnd}
              sx={{ color: 'white', opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              <X size={18} />
            </IconButton>
          </Box>
        </Box>
        
        {/* Avatar */}
        <Avatar 
          sx={{ 
            width: 84, 
            height: 84, 
            bgcolor: '#642b8f',
            color: 'white',
            border: '4px solid white',
            fontSize: '2rem',
            position: 'absolute',
            top: '5%',
            left: '50%',
            transform: 'translate(-50%, 0%)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          {contactName ? contactName.charAt(0).toUpperCase() : 'U'}
        </Avatar>
        
        {/* Call details */}
        <Box sx={{ pt: 1, pb: 3, px: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
            {contactName || 'Unknown'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {contactNumber || ''}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 1,
            my: 2
          }}>
            <Phone size={16} color="#00c853" />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600, 
                color: '#00c853',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Call in progress • {formatTime(callDuration)}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            color="error"
            startIcon={<PhoneOff size={16} />}
            onClick={onEnd}
            sx={{
              borderRadius: 28,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              mt: 1
            }}
          >
            End Call
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default CallNotification;