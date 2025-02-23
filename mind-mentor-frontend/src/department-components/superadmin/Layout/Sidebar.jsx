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
    profile: "#FF6B6B",
    dashboard: "#4ECDC4",
    kids: "#45B7D1",
    parents: "#2980B9",
    attendance: "#FDCB6E",
    enquiries: "#E67E22",
    invoices: "#FF8A5B",
    reports: "#9B59B6",
    tasks: "#3498DB",
    classSchedules: "#E67E22",
    programs: "#1ABC9C",
    support: "#C73C45",
    users: "#E74C3C",
    employees: "#27AE60",
    documents: "#8E44AD",
    chessKid: "#16A085",
    participants: "#2C3E50",
    holidayManagement: "#D35400",
    marketing: "#2ECC71",
    expenses: "#F39C12",
    transactions: "#34495E",
    logout: "#95A5A6",
    notifications: "#2980B9",
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

    // {
    //   icon: <EnquiriesIcon />,
    //   text: "Enquiries",
    //   color: iconColors.enquiries,
    //   link: "/superadminEnquiries",
    // },
    {
      icon: <EnquiriesIcon />,
      text: "Voucher_Discounts",
      color: iconColors.enquiries,
      link: "/superadmin/department/discount-table",
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
      text: "Tasks",
      color: iconColors.tasks,
      subItems: [
        { icon: <TasksIcon />, text: "My Tasks", link: "/super-admin/department/list-mytask" },
        {
          icon: <TasksIcon />,
          text: "Tasks Assigned By Me",
          link: "/super-admin/department/list-task-assigned-me",
        },
      ],
      open: openTasks,
      onClick: handleTasksClick,
    },
    {
      icon: <LeavesIcon />,
      text: "Leaves",
      color: iconColors.leaves,
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
      icon: <ClassScheduleIcon />,
      text: "Class Schedules",
      color: iconColors.classSchedules,
      link: "/superadminScheduleClass",
    },
    {
      icon: <ParticipantsIcon />,
      text: "Participants",
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

// import {
// AssignmentOutlined as AttendanceIcon,
// ChevronLeft,
// ChevronRight,
// Schedule as ClassScheduleIcon,
// Dashboard as DashboardIcon,
// ExpandLess,
// ExpandMore,
// Receipt as InvoicesIcon,
// Group as KidsIcon,
// EventNote as LeavesIcon,
// Logout as LogoutIcon,
// Person as ProfileIcon,
// Assessment as ReportsIcon,
// Help as SupportIcon,
// Assignment as TaskIcon
// } from '@mui/icons-material';
// import {
//   Box,
//   Collapse,
//   Divider,
//   Drawer,
//   IconButton,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Tooltip,
//   Typography
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import { User } from "lucide-react";

// const ModernSidebar = () => {
//   const [openReports, setOpenReports] = useState(false);
//   const [openTasks, setOpenTasks] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [openCRM, setOpenCRMS] = useState(false);

//   // Vibrant color palette for icons
//   const iconColors = {
//     profile: '#FF6B6B',
//     dashboard: '#4ECDC4',
//     kids: '#45B7D1',
//     attendance: '#FDCB6E',
//     leaves: '#6C5CE7',
//     invoices: '#FF8A5B',
//     nearbyCenter: '#2ECC71',
//     reports: '#9B59B6',
//     tasks: '#3498DB',
//     classSchedules: '#E67E22',
//     programs: '#1ABC9C',
//     support: '#E74C3C',
//     logout: '#95A5A6'
//   };
//   // Function to lighten colors
//   const lightenColor = (color, amount = 0.5) => {
//     const hex = color.replace('#', '');
//     const num = parseInt(hex, 16);
//     const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * amount));
//     const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * amount));
//     const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * amount));
//     return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
//   };
//   // Styled components for enhanced interactivity
//   const StyledListItem = styled(ListItem)(({ theme }) => ({
//     borderRadius: 8,
//     margin: '2px 0',
//     padding: '8px 16px',
//     display: 'flex',
//     alignItems: 'center',
//     transition: 'all 0.3s ease',
//     position: 'relative',
//     overflow: 'hidden',
//     gap: 8,
//     '&::before': {
//       content: '""',
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       width: 0,
//       height: '100%',
//       backgroundColor: '#642b8f',
//       transition: 'width 0.3s ease',
//       zIndex: 0
//     },
//     '&:hover': {
//       '&::before': {
//         width: '100%'
//       },
//       '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
//         color: 'white',
//         zIndex: 1
//       },
//       '& .MuiListItemIcon-root svg': {
//         filter: 'brightness(200%)' // Alternative way to lighten icons
//       },
//       boxShadow: theme.shadows[2]
//     },
//     '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
//       position: 'relative',
//       zIndex: 1,
//       transition: 'color 0.3s ease'
//     },
//     '& .MuiListItemIcon-root': {
//       marginRight: 8,
//       minWidth: 'auto'
//     }
//   }));
//   const StyledDrawer = styled(Drawer)(() => ({
//     width: isCollapsed ? 80 : 280,
//     flexShrink: 0,
//     '& .MuiDrawer-paper': {
//       width: isCollapsed ? 80 : 280,
//       boxSizing: 'border-box',
//       backgroundColor: 'white',
//       borderRight: 'none',
//       transition: 'width 0.3s ease',
//       overflow: 'hidden'
//     }
//   }));
//   const handleReportsClick = () => setOpenReports(!openReports);
//   const handleTasksClick = () => setOpenTasks(!openTasks);
//   const toggleSidebar = () => setIsCollapsed(!isCollapsed);
//   const handleCRMClick = () => setOpenCRMS(!openCRM);

//   const menuItems = [
//     {
//       icon: <ProfileIcon />,
//       text: 'Profile',
//       color: iconColors.profile,
//       subItems: [
//         { icon: <ProfileIcon />, text: 'View Profile', link: '/viewProfile' },
//       ],
//     },
//     {
//       icon: <DashboardIcon />,
//       text: 'Dashboard',
//       color: iconColors.dashboard,
//       link: '/renewalDashboard',
//     },
//     {
//       icon: <ReportsIcon />,
//       text: 'CRM',
//       color: iconColors.crm,
//       subItems: [
//         { icon: <ReportsIcon />, text: 'Referrals', link: '/renewalReferrals' },
//         { icon: <ReportsIcon />, text: 'Others', link: '/renewalOthers' },
//       ],
//       open: openCRM,
//       onClick: handleCRMClick,
//     },
//     {
//       icon: <KidsIcon />,
//       text: 'Kids',
//       color: iconColors.kids,
//       link: '/renewalKids',
//     },
//     {
//       icon: <ProfileIcon />,
//       text: 'Parents',
//       color: iconColors.parents,
//       link: '/renewalParents',
//     },
//     {
//       icon: <AttendanceIcon />,
//       text: 'Attendance',
//       color: iconColors.attendance,
//       link: '/renewalAttendance',
//     },
//     {
//       icon: <LeavesIcon />,
//       text: 'Leaves',
//       color: iconColors.leaves,
//       link: '/renewalLeaves',
//     },
//     {
//       icon: <InvoicesIcon />,
//       text: 'Invoices',
//       color: iconColors.invoices,
//       link: '/renewalInvoices',
//     },
//     {
//       icon: <ReportsIcon />,
//       text: 'Renewals',
//       color: iconColors.renewals,
//       link: '/renewalRenewals',
//     },
//     {
//       icon: <ReportsIcon />,
//       text: 'Reports',
//       color: iconColors.reports,
//       subItems: [
//         { icon: <ReportsIcon />, text: 'Students Feedback', link: '/renewalFeedback' },
//         { icon: <ReportsIcon />, text: 'Student Attendance Report', link: '/renewalAttendanceReport' },
//       ],
//       open: openReports,
//       onClick: handleReportsClick,
//     },

//     {
//       icon: <TaskIcon />,
//       text: 'Tasks',
//       color: iconColors.tasks,
//       subItems: [
//         { icon: <TaskIcon />, text: 'My Tasks', link: '/renewalMyTasks' },
//         { icon: <TaskIcon />, text: 'Tasks Assigned By Me', link: '/renewalAssignedTasks' },
//       ],
//       open: openTasks,
//       onClick: handleTasksClick,
//     },
//     {
//       icon: <ClassScheduleIcon />,
//       text: 'Class Schedules',
//       color: iconColors.classSchedules,
//       link: '/renewalScheduleClass',
//     },
//     {
//       icon: <SupportIcon />,
//       text: 'Support',
//       color: iconColors.support,
//       link: '/renewalSupport',
//     },
//     {
//       icon: <LogoutIcon />,
//       text: 'Logout',
//       color: iconColors.logout,
//       link: '/',
//     },
//   ];

//   return (
//     <StyledDrawer variant="permanent">
//       <Box sx={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         py: 2,
//         px: 2
//       }}>
//         {!isCollapsed && (
//           <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
//             {/* Profile Icon */}
//             <Box
//               sx={{
//                 width: 60,
//                 height: 60,
//                 backgroundColor: iconColors.profile || 'primary.main',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 mb: 1,
//               }}
//             >
//               <ProfileIcon sx={{ color: 'white', fontSize: 30 }} />
//             </Box>
//             {/* Name and Role */}
//             <Typography variant="body2" color="#642b8f" fontWeight="bold">
//               Renewal Associate  Manager
//             </Typography>
//             <Divider/>
//             {/* <Typography variant="body2" color="text.secondary">
//               mindmentorz
//             </Typography> */}
//           </Box>
//         )}
//         <IconButton onClick={toggleSidebar}>
//           {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
//         </IconButton>
//       </Box>
//       <Box sx={{ overflow: 'auto' }}>
//         <List disablePadding>
//           {menuItems.map((item, index) => (
//             <React.Fragment key={index}>
//               <Tooltip title={item.text} placement="right">
//                 {item.link ? (
//                   <Link
//                     to={item.link}
//                     style={{ textDecoration: 'none', color: 'inherit' }}
//                   >
//                     <StyledListItem
//                       button
//                       onClick={item.onClick || undefined}
//                       sx={{
//                         justifyContent: isCollapsed ? 'center' : 'flex-start',
//                         paddingLeft: isCollapsed ? 0 : undefined,
//                       }}
//                     >
//                       <ListItemIcon>
//                         {React.cloneElement(item.icon, {
//                           style: { color: item.color },
//                           fontSize: 'medium'
//                         })}
//                       </ListItemIcon>
//                       {!isCollapsed && (
//                         <>
//                           <ListItemText
//                             primary={item.text}
//                             primaryTypographyProps={{
//                               sx: {
//                                 fontSize: '0.95rem',
//                                 fontWeight: 500
//                               }
//                             }}
//                           />
//                           {item.subItems && (
//                             item.open ? <ExpandLess /> : <ExpandMore />
//                           )}
//                         </>
//                       )}
//                     </StyledListItem>
//                   </Link>
//                 ) : (
//                   <StyledListItem
//                     button
//                     onClick={item.onClick || undefined}
//                     sx={{
//                       justifyContent: isCollapsed ? 'center' : 'flex-start',
//                       paddingLeft: isCollapsed ? 0 : undefined,
//                     }}
//                   >
//                     <ListItemIcon>
//                       {React.cloneElement(item.icon, {
//                         style: { color: item.color },
//                         fontSize: 'medium'
//                       })}
//                     </ListItemIcon>
//                     {!isCollapsed && (
//                       <>
//                         <ListItemText
//                           primary={item.text}
//                           primaryTypographyProps={{
//                             sx: {
//                               fontSize: '0.95rem',
//                               fontWeight: 500
//                             }
//                           }}
//                         />
//                         {item.subItems && (
//                           item.open ? <ExpandLess /> : <ExpandMore />
//                         )}
//                       </>
//                     )}
//                   </StyledListItem>
//                 )}
//               </Tooltip>
//               {!isCollapsed && item.subItems && (
//                 <Collapse in={item.open} timeout="auto" unmountOnExit>
//                   <List component="div" disablePadding>
//                     {item.subItems.map((subItem, subIndex) => (
//                       <Link
//                         key={subIndex}
//                         to={subItem.link}
//                         style={{ textDecoration: 'none', color: 'inherit' }}
//                       >
//                         <StyledListItem
//                           button
//                           sx={{
//                             pl: 4,
//                           }}
//                         >
//                           <ListItemIcon>
//                             {React.cloneElement(subItem.icon, {
//                               style: { color: item.color },
//                               fontSize: 'small'
//                             })}
//                           </ListItemIcon>
//                           <ListItemText
//                             primary={subItem.text}
//                             primaryTypographyProps={{
//                               sx: {
//                                 fontSize: '0.9rem'
//                               }
//                             }}
//                           />
//                         </StyledListItem>
//                       </Link>
//                     ))}
//                   </List>
//                 </Collapse>
//               )}
//             </React.Fragment>
//           ))}
//         </List>
//       </Box>
//     </StyledDrawer>
//   );
// };
// export default ModernSidebar;
