import {
  Dashboard as DashboardIcon,
  Receipt as EnquiriesIcon,
  ChildCare as KidsIcon,
  People as ParentsIcon,
  TaskAlt as TasksIcon,
  EventAvailable as RenewalsIcon,
  CreditCard as InvoicesIcon,
  AssessmentOutlined as ReportsIcon,
  School as ChessKidIcon,
  Class as ProgramsIcon,
  SupportAgent as SupportIcon,
  Notifications as NotificationsIcon,
  Group as EmployeesIcon,
  Description as DocumentsIcon,
  AccountCircle as UsersIcon,
  EmojiEvents as TournamentsIcon,
  Schedule as ClassScheduleIcon,
  Groups as ParticipantsIcon,
  CalendarMonth as HolidayIcon,
  CampaignOutlined as MarketingIcon,
  AttachMoney as ExpensesIcon,
  AccountBalanceWallet as TransactionsIcon,
  Logout as LogoutIcon,
  CheckCircle as ActiveIcon,
  EventAvailable as AttendanceIcon,
  ChevronLeft,
  ChevronRight,
  CalendarToday as HolidayAlternateIcon,
  BeachAccess as LeavesIcon,
  ExitToApp as LogoutAlternateIcon,
  ExpandLess,
  ExpandMore,
  LocalAtm as ExpensesAlternateIcon,
  PauseCircle as PausedIcon,
  MonetizationOn as PayrollIcon,
  Person as ProfileIcon,
  BarChart as ReportsAlternateIcon,
  Task as TasksAlternateIcon,
  HourglassEmpty as TemporaryIcon,
  AccountBalance as TransactionsAlternateIcon,
  Boy as BoyIcon,
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
import { Menu as MenuIcon } from "lucide-react"; // Updated import to use Menu instead of MenuIcon
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getEmployeeData } from "../../../api/service/employee/EmployeeService";

const ModernSidebar = () => {
  const location = useLocation();
  const [openReports, setOpenReports] = useState(false);
  const [openAttandance, setOpenAttandance] = useState(false);

  const [openClass, setOpenClass] = useState(false);
  const [openTasks, setOpenTasks] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openCRM, setOpenCRM] = useState(false);
  const [openEmployees, setOpenEmployees] = useState(false);
  const [openEnquiries, setOpenEnquiries] = useState(false);
  const [openParticipants, setOpenParticipants] = useState(false);
  const [openTournaments, setOpenTournaments] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [empData, setEmpData] = useState({});

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const empId = localStorage.getItem("empId");
        if (!empId) {
          console.error("Employee ID not found in localStorage");
          return;
        }

        const response = await getEmployeeData(empId);

        if (response && response.status === 200) {
          setEmpData(response.data);
        } else {
          console.error("Failed to fetch employee data:", response);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployee();
  }, []);

  useEffect(() => {
    // Set active item based on current path
    setActiveItem(location.pathname);

    // Open appropriate submenu when navigating directly to a subpage
    const currentPath = location.pathname;

    // Check and set the appropriate menu to open
    if (
      currentPath.includes("/super-admin/department/parents-data") ||
      currentPath.includes("/super-admin/department/kids-data") ||
      currentPath.includes("/super-admin/department/enrollment-data") ||
      currentPath.includes("/super-admin/department/active-kid-data") ||
      currentPath.includes("/superadminRenewals")
    ) {
      setOpenEnquiries(true);
    }

    if (
      currentPath.includes("/super-admin/department/employees") ||
      currentPath.includes("/super-admin/department/task-table") ||
      currentPath.includes("/super-admin/department/leaves") ||
      currentPath.includes("/super-admin/department/physical-centerlist") ||
      currentPath.includes("/superadminAttendance") ||
      currentPath.includes("/super-admin/department/allowdeduct") ||
      currentPath.includes("/payroll")
    ) {
      setOpenEmployees(true);
    }

    if (
      currentPath.includes("/superadminFeedback") ||
      currentPath.includes("/superadminAttendanceReport")
    ) {
      setOpenReports(true);
    }

    if (
      currentPath.includes("/tournaments") ||
      currentPath.includes("/participents")
    ) {
      setOpenTournaments(true);
    }

    if (
      currentPath.includes("/super-admin/department/class-timetable-list") ||
      currentPath.includes("/super-admin/department/discount-table") ||
      currentPath.includes("/super-admin/department/package-table")
    ) {
      setOpenClass(true);
    }
  }, [location.pathname]); // Add dependency on location.pathname

  // Enhanced color palette with more distinct colors
  const iconColors = {
    profile: "#642b8f",
    dashboard: "#642b8f",
    kids: "#642b8f",
    parents: "#642b8f",
    attendance: "#642b8f",
    enquiries: "#642b8f",
    invoices: "#642b8f",
    reports: "#642b8f",
    tasks: "#642b8f",
    classSchedules: "#642b8f",
    programs: "#642b8f",
    support: "#642b8f",
    users: "#642b8f",
    employees: "#642b8f",
    documents: "#642b8f",
    chessKid: "#642b8f",
    participants: "#642b8f",
    holidayManagement: "#642b8f",
    marketing: "#642b8f",
    expenses: "#642b8f",
    transactions: "#642b8f",
    logout: "#642b8f",
    notifications: "#642b8f",
  };

  // Styled components for enhanced interactivity
  const StyledListItem = styled(ListItem)(({ theme, isActive }) => ({
    borderRadius: 8,
    margin: "2px 0",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    gap: 8,
    backgroundColor: isActive ? "rgba(100, 43, 143, 0.1)" : "transparent",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: isActive ? "100%" : 0,
      height: "100%",
      backgroundColor: isActive ? "rgba(100, 43, 143, 0.2)" : "#642b8f",
      transition: "width 0.3s ease",
      zIndex: 0,
    },
    "&:hover": {
      "&::before": {
        width: "100%",
      },
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: isActive ? "#642b8f" : "white",
        zIndex: 1,
      },
      "& .MuiListItemIcon-root svg": {
        filter: isActive ? "none" : "brightness(200%)",
      },
      boxShadow: theme.shadows[2],
    },
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      position: "relative",
      zIndex: 1,
      transition: "color 0.3s ease",
      color: isActive ? "#642b8f" : "inherit",
    },
    "& .MuiListItemIcon-root": {
      marginRight: 8,
      minWidth: "auto",
    },
    "& .MuiListItemIcon-root svg": {
      color: isActive ? "#642b8f" : "inherit",
    },
    ...(isActive && {
      fontWeight: "bold",
      "& .MuiListItemText-primary": {
        fontWeight: "bold",
      },
    }),
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

  // Event handlers for toggling submenus - prevent default to avoid navigation
  const handleReportsClick = (e) => {
    if (e) e.preventDefault();
    setOpenReports(!openReports);
  };

  const handleAttandanceClick = (e) => {
    if (e) e.preventDefault();
    setOpenAttandance(!openAttandance);
  };

  const handleClassClick = (e) => {
    if (e) e.preventDefault();
    setOpenClass(!openClass);
  };

  const handleTasksClick = (e) => {
    if (e) e.preventDefault();
    setOpenTasks(!openTasks);
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleCRMClick = (e) => {
    if (e) e.preventDefault();
    setOpenCRM(!openCRM);
  };

  const handleEmployeesClick = (e) => {
    if (e) e.preventDefault();
    setOpenEmployees(!openEmployees);
  };

  const handleEnquiriesClick = (e) => {
    if (e) e.preventDefault();
    setOpenEnquiries(!openEnquiries);
  };

  const handleTournamentsClick = (e) => {
    if (e) e.preventDefault();
    setOpenTournaments(!openTournaments);
  };

  // Check if a menu item is currently active
  const isItemActive = (link, subItems) => {
    if (link && activeItem === link) {
      return true;
    }

    // If this item has subitems, check if any of them are active
    if (subItems) {
      return subItems.some((subItem) => activeItem === subItem.link);
    }

    return false;
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const menuItems = [
    {
      icon: <DashboardIcon />,
      text: "Dashboard",
      color: iconColors.dashboard,
      link: "/super-admin/department/dashboard",
    },
    {
      icon: <EnquiriesIcon />,
      text: "Enquiries",
      color: iconColors.enquiries,
      subItems: [
        {
          icon: <EnquiriesIcon />,
          text: "Leads",
          link: "/super-admin/department/enrollment-data",
        },
        {
          icon: <EnquiriesIcon />,
          text: "Active Kids",
          link: "/super-admin/department/active-kid-data",
        },
        {
          icon: <ParentsIcon />,
          text: "Parents",
          link: "/super-admin/department/parents-data",
        },
        {
          icon: <KidsIcon />,
          text: "Kids",
          link: "/super-admin/department/kids-data",
        },
        {
          icon: <RenewalsIcon />,
          text: "Renewals",
          link: "/superadminRenewals",
        },
      ],
      open: openEnquiries,
      onClick: handleEnquiriesClick,
    },
    {
      icon: <EmployeesIcon />,
      text: "Employees",
      color: iconColors.employees,
      subItems: [
        {
          icon: <EmployeesIcon />,
          text: "Employee List",
          link: "/super-admin/department/employees",
        },
        {
          icon: <DashboardIcon />,
          text: "Centers",
          link: "/super-admin/department/physical-centerlist",
        },

        {
          icon: <ExpensesIcon />,
          text: "Allowances / Deductions",
          link: "/super-admin/department/allowdeduct",
        },
        {
          icon: <TasksIcon />,
          text: "Task",
          link: "/super-admin/department/task-table",
        },
        {
          icon: <LeavesIcon />,
          text: "Leaves",
          link: "/super-admin/department/leaves",
        },
        {
          icon: <LeavesIcon />,
          text: "Coach Availability Table",
          link: "/super-admin/department/coachAvailabilityTable",
        },
      ],
      open: openEmployees,
      onClick: handleEmployeesClick,
    },
    {
      icon: <ClassScheduleIcon />,
      text: "Class",
      color: iconColors.reports,
      subItems: [
        {
          icon: <ClassScheduleIcon />,
          text: "Class Schedules",
          link: "/super-admin/department/class-timetable-list",
        },
        {
          icon: <ReportsIcon />,
          text: "Voucher_Discounts",
          link: "/super-admin/department/discount-table",
        },
        {
          icon: <ReportsIcon />,
          text: "Class / Kit Package",
          link: "/super-admin/department/package-table",
        },
      ],
      open: openClass,
      onClick: handleClassClick,
    },
    {
      icon: <InvoicesIcon />,
      text: "Invoices",
      color: iconColors.invoices,
      link: "/superadminInvoices",
    },
    {
      icon: <ReportsIcon />,
      text: "Attandance",
      color: iconColors.reports,
      subItems: [
        {
          icon: <ReportsIcon />,
          text: "My Attandance",
          link: "/super-admin/department/employee-mark-attandance",
        },
        {
          icon: <ReportsIcon />,
          text: "Employee Attandance",
          link: "/super-admin/department/employee-attandance-list",
        },
      ],
      open: openAttandance,
      onClick: handleAttandanceClick,
    },
    {
      icon: <ReportsIcon />,
      text: "Reports",
      color: iconColors.reports,
      subItems: [
        {
          icon: <ReportsIcon />,
          text: "Students Feedback",
          link: "/superadminFeedback",
        },
        {
          icon: <ReportsIcon />,
          text: "Student Attendance Report",
          link: "/superadminAttendanceReport",
        },
      ],
      open: openReports,
      onClick: handleReportsClick,
    },
    {
      icon: <ChessKidIcon />,
      text: "ChessKid",
      color: iconColors.chessKid,
      link: "/chessKids",
    },
    {
      icon: <ProgramsIcon />,
      text: "Programs",
      color: iconColors.classSchedules,
      link: "/super-admin/department/list-all-programme",
    },
    {
      icon: <SupportIcon />,
      text: "Support",
      color: iconColors.support,
      link: "/superadminSupport",
    },
    {
      icon: <NotificationsIcon />,
      text: "Notifications",
      color: iconColors.notifications,
      link: "/notifications",
    },
    {
      icon: <DocumentsIcon />,
      text: "Documents",
      color: iconColors.documents,
      link: "/documents",
    },
    {
      icon: <TournamentsIcon />,
      text: "Tournaments",
      color: iconColors.reports,
      subItems: [
        {
          icon: <TournamentsIcon />,
          text: "Tournaments",
          link: "/tournaments",
        },
        {
          icon: <ParticipantsIcon />,
          text: "Tournament Participants",
          link: "/participents",
        },
      ],
      open: openTournaments,
      onClick: handleTournamentsClick,
    },
    {
      icon: <HolidayIcon />,
      text: "Holiday Management",
      color: iconColors.holidayManagement,
      link: "/holiday",
    },
    {
      icon: <MarketingIcon />,
      text: "Marketing Management",
      color: iconColors.marketing,
      link: "#", // Added placeholder link
    },
    {
      icon: <ExpensesIcon />,
      text: "Expenses",
      color: iconColors.expenses,
      link: "/expenses",
    },
    {
      icon: <TransactionsIcon />,
      text: "Transactions",
      color: iconColors.transactions,
      link: "/transactions",
    },
  ];

  return (
    <StyledDrawer variant="permanent">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end", // Changed to flex-end to move button to the right
          py: 1,
          px: 2,
        }}
      >
        <IconButton onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
      </Box>

      {!isCollapsed && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={1}
          px={2}
        >
          {/* Profile Icon with Link */}
          <Link to="/superadminProfile" style={{ textDecoration: "none" }}>
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
                  <EmailIcon sx={{ color: "#642b8f", fontSize: 16, mr: 0.5 }} />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    sx={{ maxWidth: "190px" }}
                  >
                    {empData?.email || "Loading..."}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
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
                    {empData?.role || "Loading..."}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Link>
          <Divider sx={{ width: "100%", my: 2 }} />
        </Box>
      )}

      <Box
        sx={{
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none" /* Firefox */,
          msOverflowStyle: "none" /* IE and Edge */,
        }}
      >
        <List disablePadding>
          {menuItems.map((item, index) => {
            const isActive = isItemActive(item.link, item.subItems);

            return (
              <React.Fragment key={index}>
                <Tooltip title={item.text} placement="right">
                  {item.link && !item.subItems ? (
                    <Link
                      to={item.link}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <StyledListItem
                        button
                        isActive={isActive}
                        sx={{
                          justifyContent: isCollapsed ? "center" : "flex-start",
                          paddingLeft: isCollapsed ? 0 : undefined,
                        }}
                      >
                        <ListItemIcon>
                          {React.cloneElement(item.icon, {
                            style: { color: isActive ? "#642b8f" : item.color },
                            fontSize: "medium",
                          })}
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                              sx: {
                                fontSize: "0.95rem",
                                fontWeight: isActive ? 700 : 500,
                              },
                            }}
                          />
                        )}
                      </StyledListItem>
                    </Link>
                  ) : (
                    <StyledListItem
                      button
                      onClick={item.onClick}
                      isActive={isActive}
                      sx={{
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        paddingLeft: isCollapsed ? 0 : undefined,
                      }}
                    >
                      <ListItemIcon>
                        {React.cloneElement(item.icon, {
                          style: { color: isActive ? "#642b8f" : item.color },
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
                                fontWeight: isActive ? 700 : 500,
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
                      {item.subItems.map((subItem, subIndex) => {
                        const isSubItemActive = activeItem === subItem.link;

                        return (
                          <Link
                            key={subIndex}
                            to={subItem.link}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            <StyledListItem
                              button
                              isActive={isSubItemActive}
                              sx={{
                                pl: 4,
                              }}
                            >
                              <ListItemIcon>
                                {React.cloneElement(subItem.icon, {
                                  style: {
                                    color: isSubItemActive
                                      ? "#642b8f"
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
                                    fontWeight: isSubItemActive ? 700 : 400,
                                  },
                                }}
                              />
                            </StyledListItem>
                          </Link>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    </StyledDrawer>
  );
};

export default ModernSidebar;
