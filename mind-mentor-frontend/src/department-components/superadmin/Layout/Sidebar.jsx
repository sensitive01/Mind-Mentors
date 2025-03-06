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
import { MenuIcon } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ModernSidebar = () => {
  const [openReports, setOpenReports] = useState(false);
  const [openTasks, setOpenTasks] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openCRM, setOpenCRM] = useState(false);
  const [openEmployees, setOpenEmployees] = useState(false);
  const [openParticipants, setOpenParticipants] = useState(false);

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
  // Event handlers for toggling submenus
  const handleReportsClick = () => setOpenReports(!openReports);
  const handleTasksClick = () => setOpenTasks(!openTasks);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const handleCRMClick = () => setOpenCRM(!openCRM);
  const handleEmployeesClick = () => setOpenEmployees(!openEmployees);
  const handleParticipantsClick = () => setOpenParticipants(!openParticipants);

  const menuItems = [
    {
      icon: <DashboardIcon />,
      text: "Dashboard",
      color: iconColors.dashboard,
      link: "/super-admin/department/dashboard",
    },
    {
      icon: <DashboardIcon />,
      text: "Physical Centers",
      color: iconColors.dashboard,
      link: "/super-admin/department/physical-centerlist",
    },
    {
      icon: <EmployeesIcon />,
      text: "Employees",
      color: iconColors.employees,
      subItems: [
        { icon: <EmployeesIcon />, text: "Master Data", link: "/employees" },
        {
          icon: <RenewalsIcon />,
          text: "Attendance",
          link: "/superadminAttendance",
        },
        {
          icon: <ExpensesIcon />,
          text: "Allowances / Deductions",
          link: "/allowdeduct",
        },
        { icon: <TransactionsIcon />, text: "Payroll", link: "/payroll" },
      ],
      open: openEmployees,
      onClick: handleEmployeesClick,
    },

    {
      icon: <EnquiriesIcon />,
      text: "Voucher_Discounts",
      color: iconColors.enquiries,
      link: "/superadmin/department/discount-table",
    },
    {
      icon: <EnquiriesIcon />,
      text: "Class / Kit Package",
      color: iconColors.enquiries,
      link: "/superadmin/department/package-table",
    },
    {
      icon: <ClassScheduleIcon />,
      text: "Class Schedules",
      color: iconColors.classSchedules,
      link: "/superadminScheduleClass",
    },
    {
      icon: <KidsIcon />,
      text: "Kids",
      color: iconColors.kids,
      link: "/superadminKids",
    },

    {
      icon: <ParentsIcon />,
      text: "Parents",
      color: iconColors.parents,
      link: "/superadminParents",
    },

    {
      icon: <TasksIcon />,
      text: "Task",
      color: iconColors.tasks,
      link: "/super-admin/department/task-table",
    },
    {
      icon: <LeavesIcon />,
      text: "Leaves",
      color: iconColors.users,
      link: "/super-admin/department/leaves",
    },
    {
      icon: <RenewalsIcon />,
      text: "Renewals",
      color: iconColors.attendance,
      link: "/superadminRenewals",
    },
    {
      icon: <InvoicesIcon />,
      text: "Invoices",
      color: iconColors.invoices,
      link: "/superadminInvoices",
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
      link: "/superadminPrograms",
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
      icon: <UsersIcon />,
      text: "Users",
      color: iconColors.users,
      link: "/users",
    },
    {
      icon: <TournamentsIcon />,
      text: "Tournaments",
      color: iconColors.users,
      link: "/tournaments",
    },

    {
      icon: <ParticipantsIcon />,
      text: " Tournaments Participants",
      color: iconColors.participants,
      link: "/participents",
      open: openParticipants,
      onClick: handleParticipantsClick,
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
            {/* Profile Icon with Link */}
            <Link to="/superadminProfile" style={{ textDecoration: "none" }}>
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
              <Typography
                variant="body2"
                color="#642b8f"
                fontWeight="bold"
                textAlign="center"
              >
                Super Admin
              </Typography>
            </Link>
            <Divider />
          </Box>
        )}
        {/* <IconButton onClick={toggleSidebar}>
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </IconButton> */}
        <IconButton onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
      </Box>
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
