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
  Avatar
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { RouteIcon, TentTree } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getEmployeeData } from "../../../api/service/employee/EmployeeService";

const ModernSidebar = () => {
  const [openReports, setOpenReports] = useState(false);
  const empId = localStorage.getItem("empId");
  const [openTasks, setOpenTasks] = useState(false);
  const [openLeadManagement, setOpenLeadManagement] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [empData, setEmpData] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
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
    profile: "#642b8f",
    dashboard: "#642b8f",
    leads: "#642b8f",
    attendance: "#642b8f",
    tasks: "#642b8f",
    schedule: "#642b8f",
    invoices: "#642b8f",
    support: "#642b8f",
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
        backgroundColor: "#642b8f",
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
      color: active ? "#ffffff" : theme.palette.text.primary,
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
      overflowY: "auto", // Ensures vertical scrolling
      // Hide scrollbar for Chrome, Safari and Opera
      "&::-webkit-scrollbar": {
        display: "none",
      },
      // Hide scrollbar for IE, Edge and Firefox
      "-ms-overflow-style": "none", // IE and Edge
      "scrollbar-width": "none", // Firefox
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
      color: iconColors.schedule,
      link: "/operation/department/leaves",
    },
    {
      icon: <Assessment />,
      text: "Reports",
      color: iconColors.schedule,
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
      icon: <RouteIcon />,
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
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

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
