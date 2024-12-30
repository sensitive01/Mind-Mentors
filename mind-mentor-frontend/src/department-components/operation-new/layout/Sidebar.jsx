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
  Person as ProfileIcon
} from '@mui/icons-material';
import { Box, Collapse, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ModernSidebar = () => {
  const [openReports, setOpenReports] = useState(false);
  const [openTasks, setOpenTasks] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [openLeadManagement, setOpenLeadManagement] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const iconColors = {
    profile: '#FF6B6B',
    dashboard: '#4ECDC4',
    leads: '#45B7D1',
    attendance: '#FDCB6E',
    tasks: '#6C5CE7',
    schedule: '#FF8A5B',
    leaves: '#2ECC71',
    reports: '#9B59B6',
    invoices: '#3498DB',
    support: '#E74C3C'
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
      '&::before': { width: '100%' },
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: 'white',
        zIndex: 1
      },
      '& .MuiListItemIcon-root svg': {
        filter: 'brightness(200%)'
      },
      boxShadow: theme.shadows[2]
    }
  }));

  const StyledDrawer = styled(Drawer)(() => ({
    width: isCollapsed ? 80 : 280,
    '& .MuiDrawer-paper': {
      width: isCollapsed ? 80 : 280,
      backgroundColor: 'white',
      borderRight: 'none',
      transition: 'width 0.3s ease'
    }
  }));

  const menuItems = [
    {
      icon: <DashboardOutlined />,
      text: 'Dashboard',
      color: iconColors.dashboard,
      link: '/employee-operation-dashboard'
    },
    {
      icon: <BusinessCenter />,
      text: 'Lead Management',
      color: iconColors.leads,
      subItems: [
        { text: 'Enquiries', link: '/employee-operation-enquiry-list' },
        { text: 'Prospects', link: '/employee-operation/prospects' }
      ],
      open: openLeadManagement,
      onClick: () => setOpenLeadManagement(!openLeadManagement)
    },
    {
      icon: <AssignmentOutlined />,
      text: 'Attendance',
      color: iconColors.attendance,
      link: '/employee-operation/attendance'
    },
    {
      icon: <AssignmentOutlined />,
      text: 'Tasks',
      color: iconColors.tasks,
      subItems: [
        { text: 'My Tasks', link: '/employee-operation-tasks/tasks' },
        { text: 'Assigned Tasks', link: '/employee-operation-tasks/assignedtasks' }
      ],
      open: openTasks,
      onClick: () => setOpenTasks(!openTasks)
    },
    {
      icon: <CalendarToday />,
      text: 'Schedule',
      color: iconColors.schedule,
      link: '/employee-operation/schedule'
    },
    {
      icon: <EventNote />,
      text: 'Leaves',
      color: iconColors.leaves,
      link: '/employee-operation/leaves'
    },
    {
      icon: <Assessment />,
      text: 'Reports',
      color: iconColors.reports,
      subItems: [
        { text: 'Student Attendance', link: '/employee-operation/studentreport' },
        { text: 'Coach Feedback', link: '/employee-operation/coachfeedback' }
      ],
      open: openReports,
      onClick: () => setOpenReports(!openReports)
    },
    {
      icon: <Receipt />,
      text: 'Invoices',
      color: iconColors.invoices,
      link: '/employee-operation/invoice'
    },
    {
      icon: <HelpOutline />,
      text: 'Support',
      color: iconColors.support,
      subItems: [
        { text: 'System Admin', link: '/employee-operation-tasks/supports' },
        { text: 'MyKart Status', link: '/employee-operation-tasks/supportTrack' }
      ],
      open: openSupport,
      onClick: () => setOpenSupport(!openSupport)
    }
  ];

  return (
    <StyledDrawer variant="permanent">
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2,
        px: 2
      }}>
        {!isCollapsed && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%',
            gap: 1
          }}>
            <Box sx={{
              width: 60,
              height: 60,
              backgroundColor: iconColors.profile,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 2
            }}>
              <ProfileIcon sx={{ color: 'white', fontSize: 30 }} />
            </Box>
            <Typography 
              variant="body2" 
              color="#642b8f" 
              fontWeight="bold"
              textAlign="center"
            >
              Operations Manager
            </Typography>
            <Divider sx={{ width: '100%' }} />
          </Box>
        )}
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      <Box sx={{ overflow: 'auto' }}>
        <List disablePadding>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <Tooltip title={item.text} placement="right">
                {item.link ? (
                  <Link to={item.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <StyledListItem button>
                      <ListItemIcon sx={{ color: item.color }}>
                        {item.icon}
                      </ListItemIcon>
                      {!isCollapsed && (
                        <>
                          <ListItemText primary={item.text} />
                          {item.subItems && (
                            item.open ? <ExpandLess /> : <ExpandMore />
                          )}
                        </>
                      )}
                    </StyledListItem>
                  </Link>
                ) : (
                  <StyledListItem button onClick={item.onClick}>
                    <ListItemIcon sx={{ color: item.color }}>
                      {item.icon}
                    </ListItemIcon>
                    {!isCollapsed && (
                      <>
                        <ListItemText primary={item.text} />
                        {item.subItems && (
                          item.open ? <ExpandLess /> : <ExpandMore />
                        )}
                      </>
                    )}
                  </StyledListItem>
                )}
              </Tooltip>
              {!isCollapsed && item.subItems && (
                <Collapse in={item.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem, subIndex) => (
                      <Link key={subIndex} to={subItem.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <StyledListItem button sx={{ pl: 4 }}>
                          <ListItemIcon sx={{ color: item.color }}>
                            {React.cloneElement(item.icon, { fontSize: 'small' })}
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
      </Box>
    </StyledDrawer>
  );
};

export default ModernSidebar;