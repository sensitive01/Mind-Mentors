import {
  AssignmentOutlined as AttendanceIcon,
  ChevronLeft,
  ChevronRight,
  Schedule as ClassScheduleIcon,
  Dashboard as DashboardIcon,
  ExpandLess,
  ExpandMore,
  Receipt as InvoicesIcon,
  EventNote as LeavesIcon,
  Logout as LogoutIcon,
  Person as ProfileIcon,
  Assessment as ReportsIcon,
  Help as SupportIcon,
  Assignment as TaskIcon
} from '@mui/icons-material';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Video } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import mindmentors from "../../../images/mindmentorz.png";
import { getEmployeeData } from '../../../api/service/employee/EmployeeService';

const ModernSidebar = () => {
  const navigate = useNavigate();
  const [openReports, setOpenReports] = useState(false);
  const [openTasks, setOpenTasks] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openCRM, setOpenCRMS] = useState(false);
  const [empData, setEmpData] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const department = localStorage.getItem("department");

  // Fetch employee data
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Vibrant color palette for icons
  const iconColors = {
    profile: '#642b8f',
    dashboard: '#642b8f',
    kids: '#642b8f',
    attendance: '#642b8f',
    leaves: '#642b8f',
    invoices: '#642b8f',
    nearbyCenter: '#642b8f',
    reports: '#642b8f',
    tasks: '#642b8f',
    classSchedules: '#642b8f',
    programs: '#642b8f',
    support: '#642b8f',
    logout: '#642b8f'
  };

  // Styled components for enhanced interactivity
  const StyledListItem = styled(ListItem)(({ theme }) => ({
    borderRadius: 12,
    margin: '4px 8px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 0,
      height: '100%',
      background: 'linear-gradient(135deg, #642b8f 0%, #8e44ad 100%)',
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 0,
      borderRadius: 12
    },
    '&:hover': {
      '&::before': {
        width: '100%'
      },
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: 'white',
        zIndex: 1
      },
      transform: 'translateX(4px)',
      boxShadow: '0 4px 20px rgba(100, 43, 143, 0.3)'
    },
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      position: 'relative',
      zIndex: 1,
      transition: 'color 0.3s ease'
    },
    '& .MuiListItemIcon-root': {
      marginRight: 12,
      minWidth: 'auto'
    }
  }));

  const StyledDrawer = styled(Drawer)(() => ({
    width: isCollapsed ? 80 : 280,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: isCollapsed ? 80 : 280,
      boxSizing: 'border-box',
      backgroundColor: '#fafafa',
      borderRight: '1px solid #e0e0e0',
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
    }
  }));

  const LogoContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCollapsed ? 'center' : 'space-between',
    padding: theme.spacing(2),
    backgroundColor: 'white',
    borderBottom: '1px solid #e0e0e0',
    minHeight: 70,
    position: 'relative'
  }));

  const ProfileSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: 'white',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f5f5f5'
    }
  }));

  const handleReportsClick = () => setOpenReports(!openReports);
  const handleTasksClick = () => setOpenTasks(!openTasks);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const handleCRMClick = () => setOpenCRMS(!openCRM);

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate(`/${department}/department/profile`);
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    {
      icon: <DashboardIcon />,
      text: "Dashboard",
      color: iconColors.dashboard,
      link: "/coach/department/dashboard",
    },
    {
      icon: <ClassScheduleIcon />,
      text: "Class Schedules",
      color: iconColors.classSchedules,
      link: "/coachScheduleClass",
    },
    {
      icon: <ClassScheduleIcon />,
      text: "Past Class",
      color: iconColors.classSchedules,
      link: "/coach/department/past-class",
    },
    {
      icon: <TaskIcon />,
      text: "Tasks",
      color: iconColors.tasks,
      link: "/coach/department/task-table",
    },
    {
      icon: <AttendanceIcon />,
      text: "Attendance",
      color: iconColors.attendance,
      link: "/coach/department/attendance",
    },
    {
      icon: <LeavesIcon />,
      text: "Leaves",
      color: iconColors.leaves,
      link: "/coach/department/leaves",
    },
    // {
    //   icon: <ReportsIcon />,
    //   text: "Reports",
    //   color: iconColors.reports,
    //   subItems: [
    //     {
    //       icon: <ReportsIcon />,
    //       text: "Student Attendance Report",
    //       link: "/coach/department/student-attendance-report",
    //     },
    //   ],
    //   open: openReports,
    //   onClick: handleReportsClick,
    // },
    {
      icon: <SupportIcon />,
      text: "Support",
      color: iconColors.support,
      link: "/coachSupport",
    },
  ];

  return (
    <StyledDrawer variant="permanent">
      {/* Logo Section */}
      <LogoContainer>
        {!isCollapsed ? (
          <>
            <img
              src={mindmentors}
              alt="MindMentorz Logo"
              style={{
                width: '180px',
                height: '45px',
                objectFit: 'contain'
              }}
            />
            <IconButton 
              onClick={toggleSidebar}
              sx={{
                backgroundColor: '#642b8f',
                color: 'white',
                width: 32,
                height: 32,
                '&:hover': {
                  backgroundColor: '#8e44ad'
                }
              }}
            >
              <ChevronLeft fontSize="small" />
            </IconButton>
          </>
        ) : (
          <IconButton 
            onClick={toggleSidebar}
            sx={{
              backgroundColor: '#642b8f',
              color: 'white',
              width: 40,
              height: 40,
              '&:hover': {
                backgroundColor: '#8e44ad'
              }
            }}
          >
            <ChevronRight />
          </IconButton>
        )}
      </LogoContainer>

 

      {/* Navigation Menu */}
      <Box sx={{ overflow: 'auto', flex: 1, pt: 1 }}>
        <List disablePadding>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <Tooltip 
                title={isCollapsed ? item.text : ""} 
                placement="right"
                arrow
              >
                {item.link ? (
                  <Link 
                    to={item.link} 
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <StyledListItem
                      button
                      sx={{
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        px: isCollapsed ? 1 : 2,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: isCollapsed ? 'auto' : 40 }}>
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
                                fontWeight: 500,
                                color: '#333'
                              }
                            }}
                          />
                          {item.subItems && (
                            item.open ? <ExpandLess /> : <ExpandMore />
                          )}
                        </>
                      )}
                    </StyledListItem>
                  </Link>
                ) : (
                  <StyledListItem
                    button
                    onClick={item.onClick}
                    sx={{
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      px: isCollapsed ? 1 : 2,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: isCollapsed ? 'auto' : 40 }}>
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
                              fontWeight: 500,
                              color: '#333'
                            }
                          }}
                        />
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
                      <Link 
                        key={subIndex} 
                        to={subItem.link} 
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <StyledListItem
                          button
                          sx={{
                            pl: 4,
                            py: 1,
                            mx: 2,
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 30 }}>
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
                                color: '#555'
                              }
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