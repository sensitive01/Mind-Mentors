import {
  Assessment,
  CalendarToday,
  Chat,
  Group,
  MoreVert,
  Speed,
  TimelineOutlined,
  TrendingUp,
  Person,
  PersonOff,
  QuestionAnswer,
  SportsKabaddi,
} from "@mui/icons-material";
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
  Typography,
} from "@mui/material";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
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
  YAxis,
} from "recharts";

// Custom theme with your color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f",
      light: "#aa88be",
    },
    secondary: {
      main: "#f8a213",
      light: "#f0ba6f",
    },
  },
});

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: "white",
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(100, 43, 143, 0.1)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px rgba(100, 43, 143, 0.15)",
  },
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 700,
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  borderRadius: "50%",
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  width: 48,
  height: 48,
}));

// Sample data for charts
const performanceData = [
  { month: "Jan", active: 65, inactive: 20, enquiries: 45 },
  { month: "Feb", active: 75, inactive: 25, enquiries: 55 },
  { month: "Mar", active: 85, inactive: 22, enquiries: 65 },
  { month: "Apr", active: 80, inactive: 18, enquiries: 70 },
  { month: "May", active: 90, inactive: 15, enquiries: 75 },
  { month: "Jun", active: 95, inactive: 10, enquiries: 80 },
];

const coachingData = [
  { day: "Mon", activeCoaches: 12, inactiveCoaches: 5 },
  { day: "Tue", activeCoaches: 15, inactiveCoaches: 3 },
  { day: "Wed", activeCoaches: 18, inactiveCoaches: 4 },
  { day: "Thu", activeCoaches: 14, inactiveCoaches: 6 },
  { day: "Fri", activeCoaches: 16, inactiveCoaches: 4 },
];

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("week");
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
      title: "Total Enquiries",
      value: 247,
      type: "value",
      icon: <QuestionAnswer />,
      description: "Total number of enquiries received",
    },
    {
      title: "Active Kids",
      value: 185,
      type: "value",
      icon: <Person />,
      description: "Total number of active kids",
    },
    {
      title: "Inactive Kids",
      value: 62,
      type: "value",
      icon: <PersonOff />,
      description: "Total number of inactive kids",
    },
    {
      title: "Total Coaches",
      value: 24,
      type: "value",
      icon: <SportsKabaddi />,
      description: "Total number of coaches",
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          p: 3,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
          width: "100%",
        }}
        style={{ marginLeft: "0" }}
      >
        {/* Header Section */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: "primary.main" }}
          >
           
          </Typography>
          <Box>
            <Button
              variant="contained"
              endIcon={<CalendarToday />}
              onClick={handleMenuClick}
              sx={{ backgroundColor: "secondary.main" }}
            >
              {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handleTimeRangeChange("day")}>
                Day
              </MenuItem>
              <MenuItem onClick={() => handleTimeRangeChange("week")}>
                Week
              </MenuItem>
              <MenuItem onClick={() => handleTimeRangeChange("month")}>
                Month
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <StyledCard>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <IconWrapper>{stat.icon}</IconWrapper>
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
                            backgroundColor: "secondary.light",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "secondary.main",
                            },
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.value}/{stat.maxValue}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <StatValue>{stat.value}</StatValue>
                        <Typography variant="body2" color="text.secondary">
                          {stat.description}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Members Trends */}
          <Grid item xs={12} md={8}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Member & Enquiry Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line
                      type="monotone"
                      dataKey="active"
                      name="Active Kids"
                      stroke="#642b8f"
                      strokeWidth={2}
                      dot={{ fill: "#642b8f" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="inactive"
                      name="Inactive Kids"
                      stroke="#f8a213"
                      strokeWidth={2}
                      dot={{ fill: "#f8a213" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="enquiries"
                      name="Enquiries"
                      stroke="#4caf50"
                      strokeWidth={2}
                      dot={{ fill: "#4caf50" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Coaching Breakdown */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Coaching Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={coachingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar
                      dataKey="activeCoaches"
                      name="Active Coaches"
                      fill="#642b8f"
                    />
                    <Bar
                      dataKey="inactiveCoaches"
                      name="Inactive Coaches"
                      fill="#f8a213"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Activity Analysis */}
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                  <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    textColor="primary"
                    indicatorColor="primary"
                  >
                    <Tab icon={<Assessment />} label="Member Analytics" />
                    <Tab icon={<Group />} label="Coach Analytics" />
                    <Tab icon={<QuestionAnswer />} label="Enquiry Analytics" />
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
                            dataKey="active"
                            name="Active Kids"
                            stackId="1"
                            stroke="#642b8f"
                            fill="#aa88be"
                          />
                          <Area
                            type="monotone"
                            dataKey="inactive"
                            name="Inactive Kids"
                            stackId="1"
                            stroke="#f8a213"
                            fill="#f0ba6f"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                    {activeTab === 1 && (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={coachingData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <RechartsTooltip />
                          <Bar
                            dataKey="activeCoaches"
                            name="Active Coaches"
                            fill="#642b8f"
                          />
                          <Bar
                            dataKey="inactiveCoaches"
                            name="Inactive Coaches"
                            fill="#f8a213"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                    {activeTab === 2 && (
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <RechartsTooltip />
                          <Line
                            type="monotone"
                            dataKey="enquiries"
                            name="Enquiries"
                            stroke="#4caf50"
                            strokeWidth={2}
                            dot={{ fill: "#4caf50" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
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
