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
import logoImage from "../../../assets/mindmentorz.png";

const ModernSidebar = () => {
  const location = useLocation();
  const [openEnquiries, setOpenEnquiries] = useState(false);
  const [openEmployees, setOpenEmployees] = useState(false);
  const [openClasses, setOpenClasses] = useState(false);
  const [openCenters, setOpenCenters] = useState(false);
  const [openSubscriptions, setOpenSubscriptions] = useState(false);
  const [openTournaments, setOpenTournaments] = useState(false);
  const [openSupports, setOpenSupports] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  const themeColor = "#642b8f";
  const themeColorLight = alpha(themeColor, 0.1);

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
      currentPath.includes(
        "/super-admin/department/student-attandace-report"
      ) ||
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
    } else if (
      currentPath.includes("/super-admin/department/parent-tickets") ||
      currentPath.includes("/superadmin Support")
    ) {
      setOpenSupports(true);
    }
  }, [location.pathname]);

  const MenuGroupIndicator = styled(Box)(({ theme, isOpen }) => ({
    position: "absolute",
    right: 8,
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
    width: isCollapsed ? 64 : 260,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: isCollapsed ? 64 : 260,
      boxSizing: "border-box",
      backgroundColor: "white",
      borderRight: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      boxShadow: "0 0 15px rgba(0, 0, 0, 0.04)",
      transition: "width 0.3s ease",
      overflow: "hidden",
    },
  }));

  const StyledListItem = styled(ListItem)(
    ({ theme, isActive, isSubItem = false }) => ({
      borderRadius: isSubItem ? "0 16px 16px 0" : 8,
      margin: isSubItem ? "1px 4px 1px 8px" : "2px 8px",
      padding: isSubItem ? "4px 8px 4px 12px" : "6px 12px",
      minHeight: isSubItem ? 32 : 40,
      position: "relative",
      overflow: "hidden",
      transition: "all 0.2s ease",
      backgroundColor: isActive ? themeColorLight : "transparent",
      "&:hover": {
        backgroundColor: isActive ? themeColorLight : alpha(themeColor, 0.05),
        "& .MuiListItemIcon-root svg": {
          transform: "scale(1.05)",
        },
      },
      ...(isActive && {
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: 3,
          backgroundColor: themeColor,
          borderRadius: "0 2px 2px 0",
        },
      }),
      "& .MuiListItemIcon-root": {
        minWidth: isSubItem ? 32 : 36,
        "& svg": {
          fontSize: isSubItem ? "1.1rem" : "1.25rem",
          transition: "transform 0.2s ease",
          color: isActive
            ? themeColor
            : alpha(theme.palette.text.primary, 0.75),
        },
      },
      "& .MuiListItemText-primary": {
        fontSize: isSubItem ? "0.8rem" : "0.85rem",
        fontWeight: isActive ? 600 : 500,
        color: isActive ? themeColor : theme.palette.text.primary,
        transition: "color 0.2s ease",
      },
    })
  );

  const ToggleButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: alpha(themeColor, 0.05),
    borderRadius: 6,
    padding: 6,
    "&:hover": {
      backgroundColor: alpha(themeColor, 0.1),
    },
    "& svg": {
      color: themeColor,
      fontSize: "1.2rem",
    },
  }));

  // Updated header container that combines logo and toggle button
  const HeaderContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    minHeight: 64,
    "& .logo-container": {
      display: "flex",
      alignItems: "center",
      flex: 1,
    },
    "& .toggle-container": {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
    },
    // When collapsed, center the toggle button
    ...(isCollapsed && {
      justifyContent: "center",
      "& .logo-container": {
        display: "none",
      },
    }),
  }));

  const LogoImage = styled("img")(({ theme }) => ({
    height: 40,
    width: "auto",
    maxWidth: 140,
    objectFit: "contain",
    transition: "all 0.3s ease",
  }));

  // Function to close all open submenus
  const closeAllSubmenus = () => {
    setOpenEnquiries(false);
    setOpenEmployees(false);
    setOpenClasses(false);
    setOpenCenters(false);
    setOpenSubscriptions(false);
    setOpenTournaments(false);
    setOpenSupports(false);
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
  const handleSupportsClick = (e) => {
    if (e) e.preventDefault();
    closeAllSubmenus();
    setOpenSupports(true);
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const isItemActive = (link, subItems, isOpen) => {
    if (isOpen && subItems && subItems.length > 0) {
      return true;
    }

    if (link && activeItem === link) {
      return true;
    }

    if (subItems) {
      return subItems.some((subItem) => activeItem === subItem.link);
    }

    return false;
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
      text: "Supports",
      subItems: [
        {
          icon: <SupportIcon />,
          text: "Parent Tickets",
          link: "/super-admin/department/parent-tickets",
        },
        {
          icon: <SupportIcon />,
          text: "Internal Supports",
          link: "/superadminSupport",
        },
      ],
      open: openSupports,
      onClick: handleSupportsClick,
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
      ikon: <HolidayIcon />,
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
      {/* Combined header with logo and toggle button */}
      <HeaderContainer>
        <div className="logo-container">
          <LogoImage src={logoImage} alt="Chess Academy Logo" />
        </div>
        <div className="toggle-container">
          <ToggleButton onClick={toggleSidebar} size="small">
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </ToggleButton>
        </div>
      </HeaderContainer>

      <Divider sx={{ mx: 1.5 }} />

      <Box
        sx={{
          height: "calc(100vh - 64px)", // Adjusted to account for the header height
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: alpha(themeColor, 0.2),
            borderRadius: "2px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: alpha(themeColor, 0.4),
          },
          scrollBehavior: "smooth",
        }}
      >
        <List disablePadding sx={{ py: 0.5 }}>
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
                          px: isCollapsed ? 1.5 : undefined,
                        }}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
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
                        px: isCollapsed ? 1.5 : undefined,
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
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
                                pl: 3,
                                ml: 1.5,
                                borderLeft: `2px solid ${alpha(
                                  themeColor,
                                  isSubItemActive ? 0.3 : 0.1
                                )}`,
                              }}
                            >
                              <ListItemIcon>{subItem.icon}</ListItemIcon>
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
            p: 1.5,
            textAlign: "center",
            color: alpha(themeColor, 0.6),
            fontSize: "0.7rem",
          }}
        >
          <Typography variant="small">
            © {new Date().getFullYear()} Chess Academy
          </Typography>
        </Box>
      )}
    </StyledDrawer>
  );
};

export default ModernSidebar;
