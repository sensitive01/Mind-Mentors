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
  Business as CenterIcon,
  Subscriptions as SubscriptionsIcon,
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
import { styled, alpha } from "@mui/material/styles";
import { Menu as MenuIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getEmployeeData } from "../../../api/service/employee/EmployeeService";

const ModernSidebar = () => {
  const location = useLocation();
  const [openEnquiries, setOpenEnquiries] = useState(false);
  const [openEmployees, setOpenEmployees] = useState(false);
  const [openClasses, setOpenClasses] = useState(false);
  const [openCenters, setOpenCenters] = useState(false);
  const [openSubscriptions, setOpenSubscriptions] = useState(false);
  const [openTournaments, setOpenTournaments] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [empData, setEmpData] = useState({});

  const themeColor = "#642b8f";
  const themeColorLight = alpha(themeColor, 0.1);

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
    setActiveItem(location.pathname);
    const currentPath = location.pathname;

    // Close all submenus first
    closeAllSubmenus();

    // Then open the appropriate submenu based on the current path
    if (
      currentPath.includes("/super-admin/department/enrollment-data") ||
      currentPath.includes("/super-admin/department/parents-data") ||
      currentPath.includes("/super-admin/department/kids-data") ||
      currentPath.includes("/super-admin/department/active-kid-data")
    ) {
      setOpenEnquiries(true);
    } else if (
      currentPath.includes("/super-admin/department/employees") ||
      currentPath.includes(
        "/super-admin/department/employee-mark-attandance"
      ) ||
      currentPath.includes(
        "/super-admin/department/employee-attandance-list"
      ) ||
      currentPath.includes("/super-admin/department/leaves") ||
      currentPath.includes("/super-admin/department/show-all-leaves") ||
      currentPath.includes("/super-admin/department/coachAvailabilityTable")
    ) {
      setOpenEmployees(true);
    } else if (
      currentPath.includes("/super-admin/department/class-timetable-list") ||
      currentPath.includes("/super-admin/department/discount-table") ||
      currentPath.includes("/super-admin/department/package-table") ||
      currentPath.includes("/super-admin/department/list-all-programme") ||
      currentPath.includes("/superadminFeedback") ||
      currentPath.includes("/super-admin/department/student-attandace-report") ||
      currentPath.includes("/super-admin/department/all-class-details")
    ) {
      setOpenClasses(true);
    } else if (
      currentPath.includes("/super-admin/department/physical-centerlist")
    ) {
      setOpenCenters(true);
    } else if (
      currentPath.includes("/superadminRenewals") ||
      currentPath.includes("/super-admin/department/invoice-table")
    ) {
      setOpenSubscriptions(true);
    } else if (
      currentPath.includes("/tournaments") ||
      currentPath.includes("/participents")
    ) {
      setOpenTournaments(true);
    }
  }, [location.pathname]);

  const MenuGroupIndicator = styled(Box)(({ theme, isOpen }) => ({
    position: "absolute",
    right: 12,
    top: "50%",
    transform: isOpen
      ? "translateY(-50%) rotate(0deg)"
      : "translateY(-50%) rotate(-90deg)",
    transition: "transform 0.3s ease-in-out",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: isCollapsed ? 80 : 280,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: isCollapsed ? 80 : 280,
      boxSizing: "border-box",
      backgroundColor: "white",
      borderRight: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
      transition: "width 0.3s ease",
      overflow: "hidden",
    },
  }));

  const StyledListItem = styled(ListItem)(
    ({ theme, isActive, isSubItem = false }) => ({
      borderRadius: isSubItem ? "0 20px 20px 0" : 12,
      margin: "4px 8px",
      padding: isSubItem ? "6px 8px 6px 16px" : "8px 16px",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.2s ease",
      backgroundColor: isActive ? themeColorLight : "transparent",
      "&:hover": {
        backgroundColor: isActive ? themeColorLight : alpha(themeColor, 0.05),
        "& .MuiListItemIcon-root svg": {
          transform: "scale(1.1)",
        },
      },
      ...(isActive && {
        "&::before": {
          content: '""',
          position: "absolute",
          top: isSubItem ? 0 : "50%",
          left: 0,
          height: isSubItem ? "100%" : "60%",
          width: 4,
          backgroundColor: themeColor,
          transform: isSubItem ? "none" : "translateY(-50%)",
          borderRadius: "0 4px 4px 0",
        },
      }),
      "& .MuiListItemIcon-root": {
        minWidth: isSubItem ? 36 : 40,
        "& svg": {
          transition: "transform 0.2s ease",
          color: isActive ? themeColor : alpha(theme.palette.text.primary, 0.7),
        },
      },
      "& .MuiListItemText-primary": {
        fontSize: isSubItem ? "0.85rem" : "0.9rem",
        fontWeight: isActive ? 600 : 400,
        color: isActive ? themeColor : theme.palette.text.primary,
        transition: "color 0.2s ease",
      },
    })
  );

  const ProfileBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3, 2),
    backgroundColor: alpha(themeColor, 0.02),
    borderRadius: 16,
    marginBottom: theme.spacing(2),
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: alpha(themeColor, 0.05),
      transform: "translateY(-2px)",
    },
  }));

  const AvatarStyled = styled(Avatar)(({ theme }) => ({
    width: 64,
    height: 64,
    backgroundColor: alpha(themeColor, 0.9),
    boxShadow: `0 4px 12px ${alpha(themeColor, 0.3)}`,
    fontSize: 24,
    fontWeight: "bold",
    border: `2px solid ${alpha(theme.palette.background.paper, 0.8)}`,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: `0 6px 16px ${alpha(themeColor, 0.4)}`,
    },
  }));

  const Badge = styled(Typography)(({ theme }) => ({
    backgroundColor: alpha(themeColor, 0.1),
    color: themeColor,
    padding: theme.spacing(0.3, 1),
    borderRadius: 12,
    fontSize: "0.7rem",
    fontWeight: 600,
    display: "inline-block",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  }));

  const ToggleButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: alpha(themeColor, 0.05),
    borderRadius: 8,
    padding: 8,
    "&:hover": {
      backgroundColor: alpha(themeColor, 0.1),
    },
    "& svg": {
      color: themeColor,
    },
  }));

  // Function to close all open submenus
  const closeAllSubmenus = () => {
    setOpenEnquiries(false);
    setOpenEmployees(false);
    setOpenClasses(false);
    setOpenCenters(false);
    setOpenSubscriptions(false);
    setOpenTournaments(false);
  };

  // Event handlers for toggling submenus
  const handleEnquiriesClick = (e) => {
    if (e) e.preventDefault();
    closeAllSubmenus();
    setOpenEnquiries(true);
  };

  const handleEmployeesClick = (e) => {
    if (e) e.preventDefault();
    closeAllSubmenus();
    setOpenEmployees(true);
  };

  const handleClassesClick = (e) => {
    if (e) e.preventDefault();
    closeAllSubmenus();
    setOpenClasses(true);
  };

  const handleCentersClick = (e) => {
    if (e) e.preventDefault();
    closeAllSubmenus();
    setOpenCenters(true);
  };

  const handleSubscriptionsClick = (e) => {
    if (e) e.preventDefault();
    closeAllSubmenus();
    setOpenSubscriptions(true);
  };

  const handleTournamentsClick = (e) => {
    if (e) e.preventDefault();
    closeAllSubmenus();
    setOpenTournaments(true);
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // Check if a menu item is currently active
  const isItemActive = (link, subItems, isOpen) => {
    // If this is a main menu with open submenu, highlight it
    if (isOpen && subItems && subItems.length > 0) {
      return true;
    }

    // If this exact link is active
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
      link: "/super-admin/department/dashboard",
    },
    {
      icon: <EnquiriesIcon />,
      text: "Enquiries",
      subItems: [
        {
          icon: <EnquiriesIcon />,
          text: "Leads",
          link: "/super-admin/department/enrollment-data",
        },
        {
          icon: <ParentsIcon />,
          text: "Parents",
          link: "/super-admin/department/parents-data",
        },
        // {
        //   icon: <KidsIcon />,
        //   text: "Kids (All / Active / Paused)",
        //   link: "/super-admin/department/kids-data",
        // },
        {
          icon: <ActiveIcon />,
          text: "Active Kids",
          link: "/super-admin/department/active-kid-data",
        },
      ],
      open: openEnquiries,
      onClick: handleEnquiriesClick,
    },
    {
      icon: <EmployeesIcon />,
      text: "Employees",
      subItems: [
        {
          icon: <EmployeesIcon />,
          text: "Employees",
          link: "/super-admin/department/employees",
        },
        {
          icon: <AttendanceIcon />,
          text: "My Attendance",
          link: "/super-admin/department/employee-mark-attandance",
        },
        {
          icon: <AttendanceIcon />,
          text: "Employee Attendance",
          link: "/super-admin/department/employee-attandance-list",
        },
        {
          icon: <LeavesIcon />,
          text: "Leaves",
          link: "/super-admin/department/leaves",
        },
        {
          icon: <LeavesIcon />,
          text: "All Leaves",
          link: "/super-admin/department/show-all-leaves",
        },
        {
          icon: <ProfileIcon />,
          text: "Coach Availability",
          link: "/super-admin/department/coachAvailabilityTable",
        },
      ],
      open: openEmployees,
      onClick: handleEmployeesClick,
    },
    {
      icon: <ClassScheduleIcon />,
      text: "Classes",
      subItems: [
        {
          icon: <ClassScheduleIcon />,
          text: "Schedules",
          link: "/super-admin/department/class-timetable-list",
        },
        {
          icon: <ReportsIcon />,
          text: "Vouchers / Discounts",
          link: "/super-admin/department/discount-table",
        },
        {
          icon: <ReportsIcon />,
          text: "Packages",
          link: "/super-admin/department/package-table",
        },
        {
          icon: <ProgramsIcon />,
          text: "Programs & Levels",
          link: "/super-admin/department/list-all-programme",
        },
        {
          icon: <ReportsIcon />,
          text: "Coach Feedback",
          link: "/superadminFeedback",
        },
        {
          icon: <ReportsIcon />,
          text: "Student Class Attendance Report",
          link: "/super-admin/department/student-attandace-report",
        },
        {
          icon: <ReportsIcon />,
          text: "All Class Data",
          link: "/super-admin/department/all-class-details",
        },
      ],
      open: openClasses,
      onClick: handleClassesClick,
    },
    {
      icon: <CenterIcon />,
      text: "Centers",
      subItems: [
        {
          icon: <CenterIcon />,
          text: "Centers",
          link: "/super-admin/department/physical-centerlist",
        },
      ],
      open: openCenters,
      onClick: handleCentersClick,
    },
    {
      icon: <SubscriptionsIcon />,
      text: "Subscriptions",
      subItems: [
        {
          icon: <RenewalsIcon />,
          text: "Renewals",
          link: "/superadminRenewals",
        },
        {
          icon: <InvoicesIcon />,
          text: "Pending Invoices",
          link: "/super-admin/department/invoice-table",
        },
      ],
      open: openSubscriptions,
      onClick: handleSubscriptionsClick,
    },
    {
      icon: <ChessKidIcon />,
      text: "Chesskid",
      link: "/chessKids",
    },
    {
      icon: <TasksIcon />,
      text: "Tasks",
      link: "/super-admin/department/show-all-task",
    },
    {
      icon: <NotificationsIcon />,
      text: "Notifications",
      link: "/notifications",
    },
    {
      icon: <SupportIcon />,
      text: "Support",
      link: "/superadminSupport",
    },
    {
      icon: <DocumentsIcon />,
      text: "Documents",
      link: "/documents",
    },
    {
      icon: <TournamentsIcon />,
      text: "Tournaments",
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
      text: "Holidays",
      link: "/holiday",
    },
    {
      icon: <MarketingIcon />,
      text: "Marketing",
      link: "#",
    },
    {
      icon: <ExpensesIcon />,
      text: "Expenses",
      subItems: [
        {
          icon: <ExpensesIcon />,
          text: "Expenses",
          link: "/expenses",
        },
        {
          icon: <ExpensesIcon />,
          text: "Allowances / Deductions",
          link: "/super-admin/department/allowdeduct",
        },
      ],
    },
    {
      icon: <TransactionsIcon />,
      text: "Transactions",
      link: "/transactions",
    },
    {
      icon: <PayrollIcon />,
      text: "Payroll",
      link: "/payroll",
    },
    {
      icon: <LogoutIcon />,
      text: "Logout",
      link: "/logout",
    },
  ];

  return (
    <StyledDrawer variant="permanent">
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 2,
          position: "relative",
        }}
      >
        <ToggleButton onClick={toggleSidebar} size="small">
          {isCollapsed ? <ChevronRight /> : <MenuIcon size={20} />}
        </ToggleButton>
      </Box>

      {!isCollapsed && (
        <Box
          px={4}
          py={3}
          mb={3}
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
          }}
        >
          <Link to="/superadminProfile" style={{ textDecoration: "none" }}>
            <Box>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: themeColor,
                    width: 48,
                    height: 48,
                    fontWeight: "bold",
                  }}
                >
                  {getInitials(empData.firstName)}
                </Avatar>
                <Box ml={2}>
                  <Typography
                    variant="h6"
                    color={themeColor}
                    fontWeight="600"
                    sx={{ fontSize: "1.1rem", lineHeight: 1.2 }}
                  >
                    {empData?.firstName || "Loading..."}
                  </Typography>
                </Box>
              </Box>

              <Box
                display="flex"
                gap={1.5}
                flexWrap="wrap"
                alignItems="center"
                mt={1}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.75rem",
                  }}
                >
                  <EmailIcon
                    sx={{ fontSize: 14, mr: 0.5, color: themeColor }}
                  />
                  {empData?.email || "loading@example.com"}
                </Typography>
                <Box display="flex" gap={1}>
                  <Badge
                    sx={{
                      backgroundColor: `${themeColor}20`,
                      color: themeColor,
                      borderRadius: "4px",
                      px: 1,
                      py: 0.5,
                      fontSize: "0.7rem",
                      fontWeight: 500,
                    }}
                  >
                    {empData?.department || "Dept"}
                  </Badge>
                  <Badge
                    sx={{
                      backgroundColor: `${themeColor}20`,
                      color: themeColor,
                      borderRadius: "4px",
                      px: 1,
                      py: 0.5,
                      fontSize: "0.7rem",
                      fontWeight: 500,
                    }}
                  >
                    {empData?.role || "Role"}
                  </Badge>
                </Box>
              </Box>
            </Box>
          </Link>
          <Divider sx={{ mt: 2, mb: 1 }} />
        </Box>
      )}

      <Box
        sx={{
          height: "calc(100vh - 200px)",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: alpha(themeColor, 0.2),
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: alpha(themeColor, 0.4),
          },
          scrollBehavior: "smooth",
        }}
      >
        <List disablePadding>
          {menuItems.map((item, index) => {
            const isActive = isItemActive(item.link, item.subItems, item.open);

            return (
              <React.Fragment key={index}>
                <Tooltip
                  title={isCollapsed ? item.text : ""}
                  placement="right"
                  disableHoverListener={!isCollapsed}
                >
                  {item.link && !item.subItems ? (
                    <Link to={item.link} style={{ textDecoration: "none" }}>
                      <StyledListItem
                        button
                        isActive={isActive}
                        sx={{
                          justifyContent: isCollapsed ? "center" : "flex-start",
                          px: isCollapsed ? 2 : undefined,
                        }}
                      >
                        <ListItemIcon>
                          {React.cloneElement(item.icon, {
                            fontSize: isCollapsed ? "medium" : "small",
                          })}
                        </ListItemIcon>
                        {!isCollapsed && <ListItemText primary={item.text} />}
                      </StyledListItem>
                    </Link>
                  ) : (
                    <StyledListItem
                      button
                      onClick={item.onClick}
                      isActive={isActive}
                      sx={{
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        px: isCollapsed ? 2 : undefined,
                      }}
                    >
                      <ListItemIcon>
                        {React.cloneElement(item.icon, {
                          fontSize: isCollapsed ? "medium" : "small",
                        })}
                      </ListItemIcon>
                      {!isCollapsed && (
                        <>
                          <ListItemText primary={item.text} />
                          {item.subItems && (
                            <MenuGroupIndicator isOpen={item.open}>
                              {item.open ? (
                                <ExpandLess fontSize="small" />
                              ) : (
                                <ExpandMore fontSize="small" />
                              )}
                            </MenuGroupIndicator>
                          )}
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
                            style={{ textDecoration: "none" }}
                          >
                            <StyledListItem
                              button
                              isActive={isSubItemActive}
                              isSubItem={true}
                              sx={{
                                pl: 4,
                                ml: 2,
                                borderLeft: `1px dashed ${alpha(
                                  themeColor,
                                  isSubItemActive ? 0.5 : 0.1
                                )}`,
                              }}
                            >
                              <ListItemIcon>
                                {React.cloneElement(subItem.icon, {
                                  fontSize: "small",
                                })}
                              </ListItemIcon>
                              <ListItemText primary={subItem.text} />
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

      {!isCollapsed && (
        <Box
          sx={{
            mt: "auto",
            p: 2,
            textAlign: "center",
            color: alpha(themeColor, 0.7),
            fontSize: "0.75rem",
          }}
        >
          <Typography variant="caption">
            © {new Date().getFullYear()} Chess Academy
          </Typography>
        </Box>
      )}
    </StyledDrawer>
  );
};

export default ModernSidebar;
