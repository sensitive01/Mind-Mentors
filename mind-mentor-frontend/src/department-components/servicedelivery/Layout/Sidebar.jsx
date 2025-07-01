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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { TentTree } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const ModernSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openReports, setOpenReports] = useState(false);
  const [openTasks, setOpenTasks] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePath, setActivePath] = useState("");

  // Set the active path whenever location changes
  useEffect(() => {
    setActivePath(location.pathname);

    // Open Reports submenu if current path is in the reports section
    if (
      location.pathname.includes("Feedback") ||
      location.pathname.includes("AttendanceReport")
    ) {
      setOpenReports(true);
    }
  }, [location]);

  // Vibrant color palette for icons
  const iconColors = {
    profile: "#642b8f",
    dashboard: "#642b8f",
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
    coach: "#642b8f",
  };

  const StyledListItem = styled(ListItem)(({ theme, active }) => ({
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
      width: active ? "100%" : 0,
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
      color: active ? "white" : "inherit",
    },
    "& .MuiListItemIcon-root": {
      marginRight: 8,
      minWidth: "auto",
    },
    "& .MuiListItemIcon-root svg": {
      filter: active ? "brightness(200%)" : "none",
    },
    boxShadow: active ? theme.shadows[2] : "none",
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

  const ScrollableBox = styled(Box)({
    overflow: "auto",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    height: "calc(100vh - 120px)",
  });

  const handleReportsClick = () => setOpenReports(!openReports);
  const handleTasksClick = () => setOpenTasks(!openTasks);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const menuItems = [
    {
      icon: <DashboardIcon />,
      text: "Dashboard",
      color: iconColors.dashboard,
      link: "/service-delivery/department/dashboard",
    },
    {
      icon: <DashboardIcon />,
      text: "Active Kids",
      color: iconColors.dashboard,
      link: "/service-delivery/department/active-kid-data",
    },
    {
      icon: <CoachTime />,
      text: "Coach Availability",
      color: iconColors.coach,
      link: "/service-delivery/department/coachAvailabilityTable",
    },
    {
      icon: <ClassScheduleIcon />,
      text: "Class Schedules",
      color: iconColors.classSchedules,
      link: "/service-delivery/department/class-shedules",
    },

    {
      icon: <TaskIcon />,
      text: "Tasks",
      color: iconColors.tasks,
      link: "/service-delivery/department/task-table",
    },
    {
      icon: <AttendanceIcon />,
      text: "Attendance",
      color: iconColors.attendance,
      link: "/service-delivery/department/attendance",
    },
    {
      icon: <LeavesIcon />,
      text: "Leaves",
      color: iconColors.leaves,
      link: "/service-delivery/department/leaves",
    },

    {
      icon: <TentTree />,
      text: "Holidays",
      color: iconColors.tasks,
      link: "/service-delivary/holidays",
    },
    {
      icon: <InvoicesIcon />,
      text: "Invoices",
      color: iconColors.invoices,
      link: "/serviceInvoice",
    },
    {
      icon: <NearbyIcon />,
      text: "Nearby Center",
      color: iconColors.nearbyCenter,
      // link: '/nearby-center',
    },
    {
      icon: <ReportsIcon />,
      text: "Reports",
      color: iconColors.reports,
      subItems: [
        {
          icon: <ReportsIcon />,
          text: "Students Feedback",
          link: "/serviceFeedback",
        },
        {
          icon: <ReportsIcon />,
          text: "Student Attendance Report",
          link: "/serviceAttendanceReport",
        },
      ],
      open: openReports,
      onClick: handleReportsClick,
    },
    {
      icon: <ProgramsIcon />,
      text: "Programs",
      color: iconColors.programs,
      link: "/servicePrograms",
    },
    {
      icon: <SupportIcon />,
      text: "Support",
      color: iconColors.support,
      link: "/serviceSupport",
    },
    {
      icon: <LogoutIcon />,
      text: "Logout",
      color: iconColors.logout,
      link: "/",
    },
  ];

  return (
    <StyledDrawer variant="permanent">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
          px: 2,
          marginTop:8
        }}
      >

        <IconButton
          onClick={toggleSidebar}
          sx={{
            bgcolor: "#642b8f",
            color: "white",
            "&:hover": { bgcolor: "#4a1d6e" },
            position: isCollapsed ? "static" : "absolute",
            right: 10,
          }}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>
      <ScrollableBox>
        <List disablePadding>
          {menuItems.map((item, index) => {
            // Check if this menu item is active
            const isActive =
              item.link === activePath ||
              (item.subItems &&
                item.subItems.some((subItem) => subItem.link === activePath));

            return (
              <React.Fragment key={index}>
                <Tooltip title={item.text} placement="right">
                  {item.link ? (
                    <Link
                      to={item.link}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <StyledListItem
                        button
                        active={item.link === activePath ? 1 : 0}
                        onClick={item.onClick || undefined}
                        sx={{
                          justifyContent: isCollapsed ? "center" : "flex-start",
                          paddingLeft: isCollapsed ? 0 : undefined,
                        }}
                      >
                        <ListItemIcon>
                          {React.cloneElement(item.icon, {
                            style: {
                              color:
                                item.link === activePath ? "white" : item.color,
                            },
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
                    </Link>
                  ) : (
                    <StyledListItem
                      button
                      active={isActive ? 1 : 0}
                      onClick={item.onClick || undefined}
                      sx={{
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        paddingLeft: isCollapsed ? 0 : undefined,
                      }}
                    >
                      <ListItemIcon>
                        {React.cloneElement(item.icon, {
                          style: { color: isActive ? "white" : item.color },
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
                  )}
                </Tooltip>
                {!isCollapsed && item.subItems && (
                  <Collapse in={item.open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.link}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <StyledListItem
                            button
                            active={subItem.link === activePath ? 1 : 0}
                            sx={{
                              pl: 4,
                            }}
                          >
                            <ListItemIcon>
                              {React.cloneElement(subItem.icon, {
                                style: {
                                  color:
                                    subItem.link === activePath
                                      ? "white"
                                      : item.color,
                                },
                                fontSize: "small",
                              })}
                            </ListItemIcon>
                            <ListItemText
                              primary={subItem.text}
                              primaryTypographyProps={{
                                sx: {
                                  fontSize: "0.9rem",
                                },
                              }}
                            />
                          </StyledListItem>
                        </Link>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </ScrollableBox>
    </StyledDrawer>
  );
};

export default ModernSidebar;
