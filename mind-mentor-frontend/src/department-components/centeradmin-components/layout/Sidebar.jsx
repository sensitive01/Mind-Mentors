import React, { useEffect, useState } from "react";
import {
  AssignmentOutlined as AttendanceIcon,
  ChevronLeft,
  ChevronRight,
  Schedule as ClassScheduleIcon,
  Dashboard as DashboardIcon,
  ExpandLess,
  ExpandMore,
  Receipt as InvoicesIcon,
  Group as KidsIcon,
  EventNote as LeavesIcon,
  Logout as LogoutIcon,
  LocationOn as NearbyIcon,
  Person as ProfileIcon,
  School as ProgramsIcon,
  Assessment as ReportsIcon,
  Help as SupportIcon,
  Assignment as TaskIcon,
  EventAvailable as CoachTime,
  Email as EmailIcon,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { TentTree } from "lucide-react";
import { getEmployeeData } from "../../../api/service/employee/EmployeeService";

const ModernSidebar = () => {
  const empId = localStorage.getItem("empId");

  const [openReports, setOpenReports] = useState(false);
  const [openTasks, setOpenTasks] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [empData, setEmpData] = useState({
    firstName: "",
    department: "",
    role: "",
    email: "",
  });
  const navigate = useNavigate();

  const iconColors = {
    profile: "#642b8f",
    dashboard: "#642b8f",
    enquiries: "#642b8f",
    kids: "#642b8f",
    attendance: "#642b8f",
    leaves: "#642b8f",
    invoices: "#642b8f",
    nearbyCenter: "#642b8f",
    reports: "#642b8f",
    tasks: "#642b8f",
    classSchedules: "#642b8f",
    programs: "#642b8f",
    support: "#642b8f",
    logout: "#642b8f",
  };

  const StyledListItem = styled(ListItem)(({ theme }) => ({
    borderRadius: 8,
    margin: "2px 0",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    gap: 8,
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: 0,
      height: "100%",
      backgroundColor: "#642b8f",
      transition: "width 0.3s ease",
      zIndex: 0,
    },
    "&:hover": {
      "&::before": {
        width: "100%",
      },
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
        zIndex: 1,
      },
      "& .MuiListItemIcon-root svg": {
        filter: "brightness(200%)",
      },
      boxShadow: theme.shadows[2],
    },
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      position: "relative",
      zIndex: 1,
      transition: "color 0.3s ease",
    },
    "& .MuiListItemIcon-root": {
      marginRight: 8,
      minWidth: "auto",
    },
  }));

  const StyledDrawer = styled(Drawer)(() => ({
    width: isCollapsed ? 80 : 280,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: isCollapsed ? 80 : 280,
      boxSizing: "border-box",
      backgroundColor: "white",
      borderRight: "none",
      transition: "width 0.3s ease",
      overflow: "hidden",
    },
  }));

  const handleReportsClick = () => setOpenReports(!openReports);
  const handleTasksClick = () => setOpenTasks(!openTasks);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    const fetchEmployee = async () => {
      const response = await getEmployeeData(empId);
      console.log("Response", response.data);
      if (response.status == 200) {
        setEmpData(response.data);
      }
    };
    fetchEmployee();
  }, []);

  const menuItems = [
    {
      icon: <DashboardIcon />,
      text: "Dashboard",
      color: iconColors.dashboard,
      path: "/centeradmin/department/dashboard",
    },
    {
      icon: <ClassScheduleIcon />,
      text: "Class Schedules",
      color: iconColors.classSchedules,
      path: "/centeradmin/department/class-schedule-list",
    },
    {
      icon: <DashboardIcon />,
      text: "Enquiries",
      color: iconColors.enquiries,
      path: "/centeradmin/department/enrollment-data",
    },
        {
      icon: <KidsIcon />,
      text: "Active Kids",
      color: iconColors.kids,
      path: "/centeradmin/department/active-kid-data",
    },
    {
      icon: <KidsIcon />,
      text: "Kids",
      color: iconColors.kids,
      path: "/centeradmin-kids",
    },
    {
      icon: <CoachTime />,
      text: "Coach Availability",
      color: iconColors.attendance,
      path: "/centeradmin/department/coachAvailabilityTable",
    },
    {
      icon: <AttendanceIcon />,
      text: "Attendance",
      color: iconColors.attendance,
      path: "/centeradmin/department/attendance",
    },
    {
      icon: <LeavesIcon />,
      text: "Leaves",
      color: iconColors.leaves,
      path: "/centeradmin/department/leaves",
    },
    {
      icon: <InvoicesIcon />,
      text: "Invoices",
      color: iconColors.invoices,
      path: "/centeradmin/invoice",
    },
    {
      icon: <NearbyIcon />,
      text: "Nearby Center",
      color: iconColors.nearbyCenter,
      path: "#",
    },
    {
      icon: <ReportsIcon />,
      text: "Reports",
      color: iconColors.reports,
      subItems: [
        {
          icon: <ReportsIcon />,
          text: "Students Feedback",
          path: "/centeradmin/coachfeedback",
        },
        {
          icon: <ReportsIcon />,
          text: "Student Attendance Report",
          path: "/centeradmin/studentreport",
        },
      ],
      open: openReports,
      onClick: handleReportsClick,
    },
    {
      icon: <TaskIcon />,
      text: "Task",
      color: iconColors.tasks,
      path: "/centeradmin/department/task-table",
    },
    {
      icon: <TentTree />,
      text: "Holiday",
      color: iconColors.classSchedules,
      path: "/centreAdminHoliday",
    },
    {
      icon: <ProgramsIcon />,
      text: "Programs",
      color: iconColors.programs,
      path: "#",
    },
    {
      icon: <SupportIcon />,
      text: "Support",
      color: iconColors.support,
      path: "/centeradmin-tasks/supports",
    },
    {
      icon: <LogoutIcon />,
      text: "Logout",
      color: iconColors.logout,
      path: "/",
    },
  ];

  // Get first letter of name for avatar
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <StyledDrawer variant="permanent">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
          px: 2,
        }}
      >
        {!isCollapsed && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            mt={2}
          >
            {/* Profile Icon with Link */}
            <Link
              to="/centeradmin/profile"
              style={{ textDecoration: "none", width: "100%" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: iconColors.profile,
                    fontSize: 24,
                    fontWeight: "bold",
                    mb: 1,
                  }}
                >
                  {getInitials(empData.firstName)}
                </Avatar>

                <Typography
                  variant="body1"
                  color="#642b8f"
                  fontWeight="bold"
                  textAlign="center"
                  noWrap
                  sx={{ maxWidth: "100%" }}
                >
                  {empData?.firstName || "Loading..."}
                </Typography>

                <Box sx={{ mt: 1, width: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <EmailIcon
                      sx={{ color: "#642b8f", fontSize: 16, mr: 0.5 }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      sx={{ maxWidth: "190px" }}
                    >
                      {empData?.email || "Loading..."}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        bgcolor: "#f0e6f7",
                        color: "#642b8f",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        display: "inline-block",
                      }}
                    >
                      {empData?.department || "Loading..."}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        bgcolor: "#f0e6f7",
                        color: "#642b8f",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        display: "inline-block",
                      }}
                    >
                      {empData.role || "Loading..."}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Link>
            <Divider sx={{ width: "100%", my: 2 }} />
          </Box>
        )}
        <IconButton
          onClick={toggleSidebar}
          sx={{ mr: isCollapsed ? "auto" : 0 }}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {isCollapsed && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Tooltip title={empData.firstName || "Profile"} placement="right">
            <Avatar
              component={Link}
              to="/centeradmin/profile"
              sx={{
                width: 40,
                height: 40,
                bgcolor: iconColors.profile,
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              {getInitials(empData.firstName)}
            </Avatar>
          </Tooltip>
        </Box>
      )}

      <Box sx={{ overflow: "auto" }}>
        <List disablePadding>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <Tooltip title={item.text} placement="right">
                <StyledListItem
                  button
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    else if (item.path) navigate(item.path);
                  }}
                  sx={{
                    justifyContent: isCollapsed ? "center" : "flex-start",
                    paddingLeft: isCollapsed ? 0 : undefined,
                  }}
                >
                  <ListItemIcon>
                    {React.cloneElement(item.icon, {
                      style: { color: item.color },
                      fontSize: "medium",
                    })}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          sx: {
                            fontSize: "0.95rem",
                            fontWeight: 500,
                          },
                        }}
                      />
                      {item.subItems &&
                        (item.open ? <ExpandLess /> : <ExpandMore />)}
                    </>
                  )}
                </StyledListItem>
              </Tooltip>
              {!isCollapsed && item.subItems && (
                <Collapse in={item.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem, subIndex) => (
                      <StyledListItem
                        key={subIndex}
                        button
                        onClick={() => navigate(subItem.path)}
                        sx={{
                          pl: 4,
                        }}
                      >
                        <ListItemIcon>
                          {React.cloneElement(subItem.icon, {
                            style: { color: item.color },
                            fontSize: "small",
                          })}
                        </ListItemIcon>
                        <ListItemText
                          primary={subItem.text}
                          primaryTypographyProps={{
                            sx: {
                              fontSize: "0.85rem",
                              fontWeight: 400,
                            },
                          }}
                        />
                      </StyledListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </StyledDrawer>
  );
};

export default ModernSidebar;
