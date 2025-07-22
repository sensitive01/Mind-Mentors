import {
  Assessment,
  CalendarToday,
  Chat,
  Group,
  MoreVert,
  Speed,
  TimelineOutlined,
  TrendingUp,
  School,
  EventAvailable,
  EventBusy,
  Person,
  Star,
  BookmarkBorder,
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
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getMyDashboardData } from "../../../api/service/employee/coachService";

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
    success: {
      main: "#4caf50",
      light: "#81c784",
    },
    info: {
      main: "#2196f3",
      light: "#64b5f6",
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

const IconWrapper = styled(Box)(({ theme, bgcolor }) => ({
  background:
    bgcolor ||
    `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  borderRadius: "50%",
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  width: 48,
  height: 48,
}));

const Dashboard = () => {
  const empId = localStorage.getItem("empId");
  const [timeRange, setTimeRange] = useState("week");
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    upcomingClasses: 0,
    taughtClasses: 0,
    totalStudents: 0,
    averageRating: 0,
    completionRate: 0,
    monthlyEarnings: 0,
    loading: true,
  });

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

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getMyDashboardData(empId);
        if (response.status===200) {
          setDashboardData({
            upcomingClasses: response.data.upcomingClasses || 0,
            taughtClasses: response.data.taughtClasses || 0,
            // Mock additional data - replace with actual API response fields
            totalStudents: response.data.totalStudents || 45,
            averageRating: response.data.averageRating || 4.7,
            completionRate: response.data.completionRate || 85,
            monthlyEarnings: response.data.monthlyEarnings || 5200,
            activeStudents: response.data.activeStudents || 32,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchDashboard();
  }, [empId]);

  // Sample data for charts (replace with actual data from API)
  const classesData = [
    { month: "Jan", conducted: 12, upcoming: 8 },
    { month: "Feb", conducted: 15, upcoming: 10 },
    { month: "Mar", conducted: 18, upcoming: 12 },
    { month: "Apr", conducted: 14, upcoming: 9 },
    { month: "May", conducted: 20, upcoming: 15 },
    {
      month: "Jun",
      conducted: dashboardData.taughtClasses,
      upcoming: dashboardData.upcomingClasses,
    },
  ];

  const studentEngagementData = [
    { day: "Mon", attendance: 92, participation: 85 },
    { day: "Tue", attendance: 88, participation: 90 },
    { day: "Wed", attendance: 95, participation: 82 },
    { day: "Thu", attendance: 90, participation: 88 },
    { day: "Fri", attendance: 87, participation: 85 },
  ];

  const ratingDistribution = [
    { rating: "5 Star", count: 28, color: "#4caf50" },
    { rating: "4 Star", count: 12, color: "#8bc34a" },
    { rating: "3 Star", count: 4, color: "#ffc107" },
    { rating: "2 Star", count: 1, color: "#ff9800" },
    { rating: "1 Star", count: 0, color: "#f44336" },
  ];

  const stats = [
    {
      title: "Upcoming Classes",
      value: dashboardData.upcomingClasses,
      subtitle: "Classes scheduled",
      icon: <EventAvailable />,
      description: "Classes scheduled for this week",
      bgcolor: "linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)",
      trend: "+3 from last week",
    },
    {
      title: "Classes Taught",
      value: dashboardData.taughtClasses,
      subtitle: "This month",
      icon: <School />,
      description: "Total classes conducted this month",
      bgcolor: "linear-gradient(45deg, #4caf50 30%, #81c784 90%)",
      trend: "+5 from last month",
    },
    {
      title: "Total Students",
      value: dashboardData.totalStudents,
      subtitle: "Active learners",
      icon: <Group />,
      description: "Students currently enrolled",
      bgcolor: "linear-gradient(45deg, #642b8f 30%, #aa88be 90%)",
      trend: "+8 new this month",
    },
    {
      title: "Average Rating",
      value: dashboardData.averageRating,
      subtitle: "⭐ Student feedback",
      icon: <Star />,
      description: "Based on student reviews",
      bgcolor: "linear-gradient(45deg, #f8a213 30%, #f0ba6f 90%)",
      trend: "↑ 0.3 from last month",
    },
    {
      title: "Completion Rate",
      value: dashboardData.completionRate,
      maxValue: 100,
      type: "progress",
      icon: <TrendingUp />,
      description: "Course completion percentage",
      bgcolor: "linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)",
    },
    {
      title: "Monthly Earnings",
      value: `₹${dashboardData.monthlyEarnings?.toLocaleString()}`,
      subtitle: "This month",
      icon: <Assessment />,
      description: "Total earnings this month",
      bgcolor: "linear-gradient(45deg, #ff5722 30%, #ff8a65 90%)",
      trend: "+12% from last month",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      activity: "Completed 'Advanced React Concepts' class",
      time: "2 hours ago",
      type: "class",
      avatar: "RC",
    },
    {
      id: 2,
      activity: "New student enrolled: John Doe",
      time: "4 hours ago",
      type: "student",
      avatar: "JD",
    },
    {
      id: 3,
      activity: "Received 5-star rating from Sarah",
      time: "1 day ago",
      type: "rating",
      avatar: "S",
    },
    {
      id: 4,
      activity: "Upcoming class: 'JavaScript Fundamentals'",
      time: "Tomorrow 10:00 AM",
      type: "upcoming",
      avatar: "JS",
    },
  ];

  if (dashboardData.loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            p: 3,
            backgroundColor: "#f5f5f5",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Loading dashboard...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

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
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, color: "primary.main" }}
            >
              Coach Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome back! Here's your teaching overview
            </Typography>
          </Box>
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
                Today
              </MenuItem>
              <MenuItem onClick={() => handleTimeRangeChange("week")}>
                This Week
              </MenuItem>
              <MenuItem onClick={() => handleTimeRangeChange("month")}>
                This Month
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                      <IconWrapper bgcolor={stat.bgcolor}>
                        {stat.icon}
                      </IconWrapper>
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </Box>

                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontSize: "1rem" }}
                    >
                      {stat.title}
                    </Typography>

                    {stat.type === "progress" ? (
                      <Box>
                        <LinearProgress
                          variant="determinate"
                          value={stat.value}
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
                            {stat.value}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.description}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <StatValue sx={{ fontSize: "2rem" }}>
                          {stat.value}
                        </StatValue>
                        {stat.subtitle && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            {stat.subtitle}
                          </Typography>
                        )}
                        {stat.trend && (
                          <Chip
                            label={stat.trend}
                            size="small"
                            color={
                              stat.trend.includes("+") ||
                              stat.trend.includes("↑")
                                ? "success"
                                : "default"
                            }
                            variant="outlined"
                          />
                        )}
                      </Box>
                    )}
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Classes Overview */}
          <Grid item xs={12} md={8}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Classes Overview
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={classesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar
                      dataKey="conducted"
                      fill="#642b8f"
                      name="Classes Conducted"
                    />
                    <Bar
                      dataKey="upcoming"
                      fill="#f8a213"
                      name="Upcoming Classes"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Rating Distribution */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Student Ratings
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ratingDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ rating, count }) => `${rating}: ${count}`}
                    >
                      {ratingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Student Engagement */}
          <Grid item xs={12} md={8}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Student Engagement This Week
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={studentEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 100]} />
                    <RechartsTooltip formatter={(value) => `${value}%`} />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#642b8f"
                      strokeWidth={3}
                      dot={{ fill: "#642b8f", strokeWidth: 2, r: 4 }}
                      name="Attendance"
                    />
                    <Line
                      type="monotone"
                      dataKey="participation"
                      stroke="#f8a213"
                      strokeWidth={3}
                      dot={{ fill: "#f8a213", strokeWidth: 2, r: 4 }}
                      name="Participation"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                <List sx={{ maxHeight: 250, overflow: "auto" }}>
                  {recentActivities.map((activity) => (
                    <ListItem key={activity.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 32,
                            height: 32,
                            fontSize: "0.8rem",
                          }}
                        >
                          {activity.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.activity}
                        secondary={activity.time}
                        primaryTypographyProps={{ fontSize: "0.9rem" }}
                        secondaryTypographyProps={{ fontSize: "0.8rem" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Enhanced Analytics Section */}
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
                    <Tab icon={<Assessment />} label="Performance Analytics" />
                    <Tab
                      icon={<TimelineOutlined />}
                      label="Teaching Timeline"
                    />
                    <Tab icon={<Group />} label="Student Progress" />
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
                        <AreaChart data={classesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <RechartsTooltip />
                          <Area
                            type="monotone"
                            dataKey="conducted"
                            stackId="1"
                            stroke="#642b8f"
                            fill="#aa88be"
                            name="Classes Conducted"
                          />
                          <Area
                            type="monotone"
                            dataKey="upcoming"
                            stackId="1"
                            stroke="#f8a213"
                            fill="#f0ba6f"
                            name="Upcoming Classes"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                    {activeTab === 1 && (
                      <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Teaching Timeline
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Your teaching schedule and milestones will be
                          displayed here.
                        </Typography>
                      </Box>
                    )}
                    {activeTab === 2 && (
                      <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Student Progress Overview
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Detailed student progress tracking and analytics will
                          be shown here.
                        </Typography>
                      </Box>
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
