import {
  DashboardOutlined,
  BusinessCenter,
  AssignmentOutlined,
  CalendarToday,
  EventNote,
  Assessment,
  Receipt,
  HelpOutline,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
  Person as ProfileIcon,
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
import { Link, useLocation, useNavigate } from "react-router-dom";

const ModernSidebar = () => {
  const [openReports, setOpenReports] = useState(false);
  const [openTasks, setOpenTasks] = useState(false);
  const [openLeadManagement, setOpenLeadManagement] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-expand parent menu when child is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.subItems) {
        const isSubItemActive = item.subItems.some(
          (subItem) => location.pathname === subItem.link
        );
        if (isSubItemActive) {
          if (item.text === "Reports") setOpenReports(true);
          if (item.text === "Tasks") setOpenTasks(true);
          if (item.text === "Lead Management") setOpenLeadManagement(true);
        }
      }
    });
  }, [location.pathname]);

  const iconColors = {
    profile: "#FF6B6B",
    dashboard: "#4ECDC4",
    leads: "#45B7D1",
    attendance: "#FDCB6E",
    tasks: "#6C5CE7",
    schedule: "#FF8A5B",
    leaves: "#2ECC71",
    reports: "#9B59B6",
    invoices: "#3498DB",
    support: "#E74C3C",
  };

  const StyledListItem = styled(ListItem)(({ theme, active }) => ({
    borderRadius: 8,
    margin: "2px 8px",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    gap: 8,

    ...(active && {
      backgroundColor: "#642b8f",
      "& .MuiListItemIcon-root": {
        color: "#ffffff",
      },
      "& .MuiListItemText-primary": {
        color: "#ffffff",
      },
      "& .MuiSvgIcon-root": {
        color: "white",
      },
      "&:hover": {
        backgroundColor: "#642b8f", // Fixed the typo here (was "white")
      },
    }),

    "&:hover": {
      backgroundColor: "#642b8f",
      "& .MuiListItemIcon-root": {
        color: "white",
      },
      "& .MuiListItemText-primary": {
        color: "white",
      },
      "& .MuiSvgIcon-root": {
        color: "white",
      },
      boxShadow: theme.shadows[2],
    },

    "& .MuiListItemText-primary": {
      color: active ? "#ffffff" : theme.palette.text.primary, // Added active state color check
      fontWeight: active ? 600 : 400,
      transition: "all 0.3s ease",
    },

    "& .MuiListItemIcon-root": {
      minWidth: 40,
      transition: "all 0.3s ease",
    },
  }));

  const StyledDrawer = styled(Drawer)(() => ({
    width: isCollapsed ? 80 : 280,
    flexShrink: 0,
    whiteSpace: "nowrap",
    "& .MuiDrawer-paper": {
      width: isCollapsed ? 80 : 280,
      backgroundColor: "white",
      borderRight: "1px solid rgba(0, 0, 0, 0.12)",
      transition: "width 0.3s ease",
      overflowX: "hidden",
    },
  }));

  const menuItems = [
    {
      icon: <DashboardOutlined />,
      text: "Dashboard",
      color: iconColors.dashboard,
      link: "/operation/department/dashboard",
    },
    {
      icon: <BusinessCenter />,
      text: "Lead Management",
      color: iconColors.leads,
      link: "/operation/department/enrollment-data",
    },
    {
      icon: <AssignmentOutlined />,
      text: "Attendance",
      color: iconColors.attendance,
      link: "/operation/department/attendance",
    },
    {
      icon: <AssignmentOutlined />,
      text: "Tasks",
      color: iconColors.tasks,
      link: "/operation/department/task-table",
    },
    {
      icon: <CalendarToday />,
      text: "Demo Class Schedule",
      color: iconColors.schedule,
      link: "/operation/department/schedule-demo-class-list",
    },
    {
      icon: <EventNote />,
      text: "Leaves",
      color: iconColors.leaves,
      link: "/operation/department/leaves",
    },
    {
      icon: <Assessment />,
      text: "Reports",
      color: iconColors.reports,
      subItems: [
        {
          text: "Student Attendance",
          link: "/operation/department/student-report",
        },
        {
          text: "Coach Feedback",
          link: "/operation/department/coach-feedback",
        },
      ],
      open: openReports,
      onClick: () => setOpenReports(!openReports),
    },
    {
      icon: <Receipt />,
      text: "Invoices",
      color: iconColors.invoices,
      link: "/operation/department/invoice",
    },
    {
      icon: <TentTree />,

      text: "Holidays",
      color: iconColors.invoices,
      link: "/operation/department/holidays",
    },
    {
      icon: <HelpOutline />,
      text: "Walk Through",
      color: iconColors.support,
      link: "/operation/department/walk-through",
    },
    {
      icon: <HelpOutline />,
      text: "Support",
      color: iconColors.support,
      link: "/operation/department/supports",
    },
  ];

  const isItemActive = (link) => {
    if (!link) return false;
    return location.pathname === link;
  };

  const isParentActive = (item) => {
    if (item.link) return isItemActive(item.link);
    if (item.subItems) {
      return item.subItems.some((subItem) => isItemActive(subItem.link));
    }
    return false;
  };

  const renderMenuItem = (item, isSubItem = false) => {
    const isActive = isParentActive(item);
    const menuItemContent = (
      <StyledListItem
        button
        active={isActive ? 1 : 0}
        onClick={item.onClick}
        sx={isSubItem ? { pl: 4 } : {}}
      >
        <ListItemIcon
          sx={{
            color: isActive ? "white" : item.color,
          }}
        >
          {isSubItem
            ? React.cloneElement(item.icon, { fontSize: "small" })
            : item.icon}
        </ListItemIcon>
        {!isCollapsed && (
          <>
            <ListItemText primary={item.text} />
            {item.subItems && (item.open ? <ExpandLess /> : <ExpandMore />)}
          </>
        )}
      </StyledListItem>
    );

    return item.link ? (
      <Link
        to={item.link}
        style={{ textDecoration: "none", color: "inherit" }}
        key={item.text}
      >
        {menuItemContent}
      </Link>
    ) : (
      menuItemContent
    );
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
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              gap: 1,
            }}
          >
            <Box
              onClick={() =>
                navigate("/operation/department/enrollment-profile")
              }
              sx={{
                width: 60,
                height: 60,
                backgroundColor: iconColors.profile,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 2,
                cursor: "pointer", // Added cursor pointer
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              <ProfileIcon sx={{ color: "white", fontSize: 30 }} />
            </Box>
            <Typography
              variant="body2"
              color="#642b8f"
              fontWeight="bold"
              textAlign="center"
            >
              Operations Manager
            </Typography>
            <Divider sx={{ width: "100%", my: 1 }} />
          </Box>
        )}
        <IconButton
          onClick={() => setIsCollapsed(!isCollapsed)}
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

      <List sx={{ px: 1 }}>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <Tooltip title={isCollapsed ? item.text : ""} placement="right">
              {renderMenuItem(item)}
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
                        sx={{ pl: 4 }}
                        active={isItemActive(subItem.link) ? 1 : 0}
                      >
                        <ListItemIcon
                          sx={{
                            color: isItemActive(subItem.link)
                              ? "white"
                              : item.color,
                          }}
                        >
                          {React.cloneElement(item.icon, { fontSize: "small" })}
                        </ListItemIcon>
                        <ListItemText primary={subItem.text} />
                      </StyledListItem>
                    </Link>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default ModernSidebar;
