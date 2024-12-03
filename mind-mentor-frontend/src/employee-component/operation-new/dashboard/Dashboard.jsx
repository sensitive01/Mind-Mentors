// const Dashboard = () => {
//   const stats = [
//     {
//       title: "Monthly Team's Performance",
//       value: 120,
//       maxValue: 200,
//       type: "progress",
//     },
//     {
//       title: "Monthly Individual Performance",
//       value: 0,
//       subtitle: "My Enrolments",
//     },
//     {
//       title: "My Today's Interaction",
//       value: 0,
//       subtitle: "My Interactions",
//     },
//   ];

//   return (
//     <div className="w-full space-y-6 p-4">
//       {stats.map((stat, index) => (
//         <div key={index} className="w-full bg-white rounded-lg shadow-lg p-6">
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-gray-800">
//               {stat.title}
//             </h2>

//             {stat.type === "progress" ? (
//               <div className="space-y-2">
//                 <div className="h-4 w-full bg-white rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-blue-500 rounded-full transition-all duration-300"
//                     style={{
//                       width: `${(stat.value / stat.maxValue) * 100}%`,
//                     }}
//                   />
//                 </div>
//                 <div className="flex justify-center">
//                   <span className="text-3xl font-bold text-gray-700">
//                     {stat.value}
//                   </span>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center space-y-2">
//                 <div className="text-4xl font-bold text-blue-500">
//                   {stat.value}
//                 </div>
//                 <div className="text-sm text-gray-600">{stat.subtitle}</div>
//               </div>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Dashboard;



import {
    Assessment,
    CalendarToday,
    Chat,
    Group,
    MoreVert,
    Speed,
    TimelineOutlined,
    TrendingUp
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    LinearProgress,
    Menu,
    MenuItem,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    XAxis,
    YAxis
} from 'recharts';

// Custom theme with your color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: '#642b8f',
      light: '#aa88be',
    },
    secondary: {
      main: '#f8a213',
      light: '#f0ba6f',
    },
  },
});

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: 'white',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(100, 43, 143, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(100, 43, 143, 0.15)',
  },
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  borderRadius: '50%',
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  width: 48,
  height: 48,
}));

// Sample data for charts
const performanceData = [
  { month: 'Jan', team: 65, individual: 45 },
  { month: 'Feb', team: 75, individual: 55 },
  { month: 'Mar', team: 85, individual: 65 },
  { month: 'Apr', team: 80, individual: 70 },
  { month: 'May', team: 90, individual: 75 },
  { month: 'Jun', team: 95, individual: 80 },
];

const interactionData = [
  { day: 'Mon', calls: 12, meetings: 5, emails: 25 },
  { day: 'Tue', calls: 15, meetings: 7, emails: 30 },
  { day: 'Wed', calls: 18, meetings: 4, emails: 28 },
  { day: 'Thu', calls: 14, meetings: 6, emails: 32 },
  { day: 'Fri', calls: 16, meetings: 8, emails: 27 },
];

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    handleMenuClose();
  };

  const stats = [
    {
      title: "Monthly Team's Performance",
      value: 120,
      maxValue: 200,
      type: "progress",
      icon: <TrendingUp />,
      description: "Team performance based on monthly targets"
    },
    {
      title: "Monthly Individual Performance",
      value: 85,
      maxValue: 100,
      type: "progress",
      icon: <Speed />,
      description: "Your individual performance metrics"
    },
    {
      title: "Today's Interactions",
      value: 24,
      subtitle: "Interactions",
      icon: <Chat />,
      description: "Total interactions made today"
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh',width:'100' }}style={{marginLeft:'0'}}>
        {/* Header Section */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Performance Dashboard
          </Typography>
          <Box>
            <Button
              variant="contained"
              endIcon={<CalendarToday />}
              onClick={handleMenuClick}
              sx={{ backgroundColor: 'secondary.main' }}
            >
              {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleTimeRangeChange('day')}>Day</MenuItem>
              <MenuItem onClick={() => handleTimeRangeChange('week')}>Week</MenuItem>
              <MenuItem onClick={() => handleTimeRangeChange('month')}>Month</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <StyledCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <IconWrapper>
                        {stat.icon}
                      </IconWrapper>
                      <IconButton>
                        <MoreVert />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="h6" gutterBottom>
                      {stat.title}
                    </Typography>
                    
                    {stat.type === "progress" ? (
                      <Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(stat.value / stat.maxValue) * 100}
                          sx={{ 
                            height: 10, 
                            borderRadius: 5,
                            backgroundColor: 'secondary.light',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: 'secondary.main'
                            }
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.value}/{stat.maxValue}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <StatValue>{stat.value}</StatValue>
                    )}
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Performance Trends */}
          <Grid item xs={12} md={8}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="team" 
                      stroke="#642b8f" 
                      strokeWidth={2}
                      dot={{ fill: '#642b8f' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="individual" 
                      stroke="#f8a213" 
                      strokeWidth={2}
                      dot={{ fill: '#f8a213' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Interaction Breakdown */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Interaction Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={interactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="calls" stackId="a" fill="#642b8f" />
                    <Bar dataKey="meetings" stackId="a" fill="#f8a213" />
                    <Bar dataKey="emails" stackId="a" fill="#aa88be" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Activity Timeline */}
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs 
                    value={activeTab} 
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    textColor="primary"
                    indicatorColor="primary"
                  >
                    <Tab icon={<Assessment />} label="Analytics" />
                    <Tab icon={<TimelineOutlined />} label="Timeline" />
                    <Tab icon={<Group />} label="Team" />
                  </Tabs>
                </Box>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 0 && (
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <RechartsTooltip />
                          <Area 
                            type="monotone" 
                            dataKey="team" 
                            stackId="1"
                            stroke="#642b8f"
                            fill="#aa88be"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="individual" 
                            stackId="1"
                            stroke="#f8a213"
                            fill="#f0ba6f"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                    {activeTab === 1 && (
                      <Typography variant="body1">Timeline content</Typography>
                    )}
                    {activeTab === 2 && (
                      <Typography variant="body1">Team content</Typography>
                    )}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;