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
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ModernSidebar = () => {
  const [openReports, setOpenReports] = useState(false);
  const [openTasks, setOpenTasks] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openCRM, setOpenCRMS] = useState(false);

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
  };
  // Function to lighten colors
  const lightenColor = (color, amount = 0.5) => {
    const hex = color.replace("#", "");
    const num = parseInt(hex, 16);
    const r = Math.min(
      255,
      Math.floor((num >> 16) + (255 - (num >> 16)) * amount)
    );
    const g = Math.min(
      255,
      Math.floor(((num >> 8) & 0x00ff) + (255 - ((num >> 8) & 0x00ff)) * amount)
    );
    const b = Math.min(
      255,
      Math.floor((num & 0x0000ff) + (255 - (num & 0x0000ff)) * amount)
    );
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };
  // Styled components for enhanced interactivity
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
        filter: "brightness(200%)", // Alternative way to lighten icons
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
  const handleCRMClick = () => setOpenCRMS(!openCRM);

  const menuItems = [
    {
      icon: <DashboardIcon />,
      text: "Dashboard",
      color: iconColors.dashboard,
      link: "/marketing/department/dashboard",
    },
    {
      icon: <InvoicesIcon />,
      text: "Enquiries",
      color: iconColors.invoices,
      link: "/marketingEnquiries",
    },
    {
      icon: <ClassScheduleIcon />,
      text: "Marketing Tools",
      color: iconColors.classSchedules,
      link: "#",
    },
    {
      icon: <AttendanceIcon />,
      text: "Attendance",
      color: iconColors.attendance,
      link: "/marketing/department/attendance",
    },
    // {
    //   icon: <ReportsIcon />,
    //   text: "Tasks",
    //   color: iconColors.reports,
    //   subItems: [
    //     {
    //       icon: <ReportsIcon />,
    //       text: "My Task",
    //       link: "/marketing/department/list-mytask",
    //     },
    //     {
    //       icon: <ReportsIcon />,
    //       text: "Task Assigned By me",
    //       link: "/marketing/department/list-task-assigned-me",
    //     },
    //   ],
    //   open: openReports,
    //   onClick: handleReportsClick,
    // },
    {
      icon: <TaskIcon />,
      text: "Tasks",
      color: iconColors.tasks,
      link: "/marketing/department/task-table",
    },
    {
      icon: <LeavesIcon />,
      text: "Leaves",
      color: iconColors.leaves,
      link: "/marketing/department/leaves",
    },
    {
      icon: <TentTree />,
      text: "Holidays",
      color: iconColors.attendance,
      link: "/marketing-associate/holidays",
    },

    {
      icon: <SupportIcon />,
      text: "Support",
      color: iconColors.support,
      link: "/marketingSupport",
    },
    {
      icon: <ReportsIcon />,
      text: "Reports",
      color: iconColors.reports,
      subItems: [
        {
          icon: <ReportsIcon />,
          text: "Students Feedback",
          link: "/marketingFeedback",
        },
        {
          icon: <ReportsIcon />,
          text: "Student Attendance Report",
          link: "/marketingAttendanceReport",
        },
      ],
      open: openReports,
      onClick: handleReportsClick,
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
        }}
      >
        {!isCollapsed && (
          <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
            {/* Profile Icon */}
            <Box
              sx={{
                width: 60,
                height: 60,
                backgroundColor: iconColors.profile || "primary.main",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <ProfileIcon sx={{ color: "white", fontSize: 30 }} />
            </Box>
            {/* Name and Role */}
            <Typography variant="body2" color="#642b8f" fontWeight="bold">
              marketing Delivery Manager
            </Typography>
            <Divider />
            {/* <Typography variant="body2" color="text.secondary">
              mindmentorz
            </Typography> */}
          </Box>
        )}
        <IconButton onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>
      <Box sx={{ overflow: "auto" }}>
        <List disablePadding>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <Tooltip title={item.text} placement="right">
                {item.link ? (
                  <Link
                    to={item.link}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <StyledListItem
                      button
                      onClick={item.onClick || undefined}
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
                  </Link>
                ) : (
                  <StyledListItem
                    button
                    onClick={item.onClick || undefined}
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
          ))}
        </List>
      </Box>
    </StyledDrawer>
  );
};
export default ModernSidebar;
