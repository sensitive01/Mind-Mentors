import React, { useState } from 'react';
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
  Assignment as TaskIcon
} from '@mui/icons-material';
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const ModernSidebar = () => {
  const [openReports, setOpenReports] = useState(false);
  const [openTasks, setOpenTasks] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const iconColors = {
    profile: '#FF6B6B',
    dashboard: '#4ECDC4',
    enquiries: '#4ECDC4',
    kids: '#45B7D1',
    attendance: '#FDCB6E',
    leaves: '#6C5CE7',
    invoices: '#FF8A5B',
    nearbyCenter: '#2ECC71',
    reports: '#9B59B6',
    tasks: '#3498DB',
    classSchedules: '#E67E22',
    programs: '#1ABC9C',
    support: '#E74C3C',
    logout: '#95A5A6'
  };

  const StyledListItem = styled(ListItem)(({ theme }) => ({
    borderRadius: 8,
    margin: '2px 0',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    gap: 8,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 0,
      height: '100%',
      backgroundColor: '#642b8f',
      transition: 'width 0.3s ease',
      zIndex: 0
    },
    '&:hover': {
      '&::before': {
        width: '100%'
      },
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: 'white',
        zIndex: 1
      },
      '& .MuiListItemIcon-root svg': {
        filter: 'brightness(200%)'
      },
      boxShadow: theme.shadows[2]
    },
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      position: 'relative',
      zIndex: 1,
      transition: 'color 0.3s ease'
    },
    '& .MuiListItemIcon-root': {
      marginRight: 8,
      minWidth: 'auto'
    }
  }));

  const StyledDrawer = styled(Drawer)(() => ({
    width: isCollapsed ? 80 : 280,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: isCollapsed ? 80 : 280,
      boxSizing: 'border-box',
      backgroundColor: 'white',
      borderRight: 'none',
      transition: 'width 0.3s ease',
      overflow: 'hidden'
    }
  }));

  const handleReportsClick = () => setOpenReports(!openReports);
  const handleTasksClick = () => setOpenTasks(!openTasks);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const menuItems = [
    { 
      icon: <ProfileIcon />, 
      text: 'Profile', 
      color: iconColors.profile, 
      path: '/centeradmin/profile'
    },
    { 
      icon: <DashboardIcon />, 
      text: 'Dashboard', 
      color: iconColors.dashboard, 
      path: '/centeradmin-dashboard'
    },
    { 
      icon: <DashboardIcon />, 
      text: 'Enquiries', 
      color: iconColors.enquiries, 
      path: '/centeradmin-enquiry-list'
    },
    { 
      icon: <KidsIcon />, 
      text: 'Kids', 
      color: iconColors.kids, 
      path: '#'
    },
    { 
      icon: <AttendanceIcon />, 
      text: 'Attendance', 
      color: iconColors.attendance, 
      path: '/centeradmin/attendance'
    },
    { 
      icon: <LeavesIcon />, 
      text: 'Leaves', 
      color: iconColors.leaves, 
      path: '/centeradmin/leaves'
    },
    { 
      icon: <InvoicesIcon />, 
      text: 'Invoices', 
      color: iconColors.invoices, 
      path: '/centeradmin/invoice'
    },
    { 
      icon: <NearbyIcon />, 
      text: 'Nearby Center', 
      color: iconColors.nearbyCenter, 
      path: '#'
    },
    {
      icon: <ReportsIcon />,
      text: 'Reports',
      color: iconColors.reports,
      
      subItems: [
        { 
          icon: <ReportsIcon />, 
          text: 'Students Feedback', 
          path: '/centeradmin/coachfeedback'
        },
        { 
          icon: <ReportsIcon />, 
          text: 'Student Attendance Report', 
          path: '/centeradmin/studentreport'
        }
      ],
      open: openReports,
      onClick: handleReportsClick
    },
    {
      icon: <TaskIcon />,
      text: 'Tasks',
      color: iconColors.tasks,
      
      subItems: [
        { 
          icon: <TaskIcon />, 
          text: 'My Tasks', 
          path: '/centeradmin-tasks/tasks'
        },
        { 
          icon: <TaskIcon />, 
          text: 'Tasks Assigned By Me', 
          path: '/centeradmin-tasks/assigntask'
        }
      ],
      open: openTasks,
      onClick: handleTasksClick
    },
    { 
      icon: <ClassScheduleIcon />, 
      text: 'Class Schedules', 
      color: iconColors.classSchedules, 
      path: '#'
    },
    { 
      icon: <ProgramsIcon />, 
      text: 'Programs', 
      color: iconColors.programs, 
      path: '#'
    },
    { 
      icon: <SupportIcon />, 
      text: 'Support', 
      color: iconColors.support, 
      path: '#'
    },
    { 
      icon: <LogoutIcon />, 
      text: 'Logout', 
      color: iconColors.logout, 
      path: '/'
    }
  ];

  return (
    <StyledDrawer variant="permanent">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2, px: 2 }}>
        {!isCollapsed && (
          <Typography variant="h6" color="primary" fontWeight="bold">
            School App
          </Typography>
        )}
        <IconButton onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>
      <Box sx={{ overflow: 'auto' }}>
        <List disablePadding>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <Tooltip title={item.text} placement="right">
                <StyledListItem
                  button
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    navigate(item.path);
                  }}
                  sx={{
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    paddingLeft: isCollapsed ? 0 : undefined
                  }}
                >
                  <ListItemIcon>
                    {React.cloneElement(item.icon, {
                      style: { color: item.color },
                      fontSize: 'medium'
                    })}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          sx: {
                            fontSize: '0.95rem',
                            fontWeight: 500
                          }
                        }}
                      />
                      {item.subItems && (item.open ? <ExpandLess /> : <ExpandMore />)}
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
                          pl: 4
                        }}
                      >
                        <ListItemIcon>
                          {React.cloneElement(subItem.icon, {
                            style: { color: item.color },
                            fontSize: 'small'
                          })}
                        </ListItemIcon>
                        <ListItemText
                          primary={subItem.text}
                          primaryTypographyProps={{
                            sx: {
                              fontSize: '0.85rem',
                              fontWeight: 400
                            }
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