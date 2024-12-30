import { ChevronDown, ChevronUp, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logout from '../../../department-components/operation-new/dashboard/Logout';
import account from '../../../images/accountInage.webp';
import { Divider } from '@mui/material';

const Sidebar = ({ isExpanded = true, onToggle }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const isActive = (path) => location.pathname === path;

  const toggleSubmenu = (path) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const navLinks = [
    {
      title: 'Dashboard',
      icon: '📊',
      path: '/employee-operation-dashboard',
    },
    {
      title: 'Lead Management',
      icon: '💼',
      submenu: [
        { title: 'Enquiries', icon: '📋', path: '/employee-operation-enquiry-list' },
        { title: 'Prospects', icon: '👥', path: '/employee-operation/prospects' },
      ],
    },
    {
      title: 'Attendance',
      icon: '📅',
      path: '/employee-operation/attendance',
    },
    {
      title: 'Tasks',
      icon: '✓',
      path: '/employee-operation-tasks/tasks',
      submenu: [
        { title: 'My Tasks', icon: '📋', path: '/employee-operation-tasks/tasks' },
        { title: 'Assigned Tasks ', icon: '👥', path: '/employee-operation-tasks/assignedtasks' },
      ],
    },
    {
      title: 'Schedule',
      icon: '📅',
      path: '/employee-operation/schedule',
    },
    {
      title: 'Leaves',
      icon: '🗓️',
      path: '/employee-operation/leaves',
    },
    {
      title: 'Reports',
      icon: '📋',
      path: '/employee-operation/studentreport',
      submenu: [
        { title: 'Student Attendance', icon: '📋', path: '/employee-operation/studentreport' },
        { title: 'Coach Feedback', icon: '👥', path: '/employee-operation/coachfeedback' },
      ],
    },
    { title: 'Invoices', icon: '📄', path: '/employee-operation/invoice' },
    {
      title: 'Support',
      icon: '🔧',
      path: '/employee-operation-tasks/supports',
      submenu: [
        { title: 'System Admin', icon: '🔧', path: '/employee-operation-tasks/supports' },
        { title: 'MyKart Status', icon: '📊', path: '/employee-operation-tasks/supportTrack' },
      ],
    },
  ];

  return (
    <div
      className="transition-all duration-300 h-screen bg-white shadow-lg fixed flex flex-col"
      style={{ 
        width: isExpanded ? '256px' : '80px',
        height: "-webkit-fill-available" 
      }}
    >
      {/* Sidebar Toggle Button */}
      <div className="flex items-center justify-end p-2" style={{ background: '#642b8f' }}>
        <button
          className="bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 transition-all"
          onClick={onToggle}
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Profile Section */}
      <div 
        style={{ background: '#642b8f' }}
        className="flex flex-col items-center py-6 border-b"
      >
        <Link to="/employee-operation/profile">
          <img
            src={account}
            alt="Profile"
            className={`rounded-full shadow-lg transition-all duration-200 ${
              isExpanded ? 'w-16 h-16' : 'w-10 h-10'
            }`}
          />
        </Link>
        {isExpanded && (
          <>
            <h2 className="text-white text-lg font-semibold mt-2">Operations Mindmentoz</h2>
            <span className="text-sm text-white">Operational Manager at MindMentoz</span>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col mt-4 overflow-y-auto">
        {navLinks.map((link, index) => (
          <div key={index} className="relative">
            <Link
              to={link.path}
              onClick={() => link.submenu && isExpanded && toggleSubmenu(link.path)}
              className={`w-full flex items-center px-4 py-3 relative transition-all duration-300 rounded-lg ${
                isActive(link.path)
                  ? 'bg-purple-100 text-purple-700'
                  : 'hover:bg-[#642b8f] hover:text-white'
              }`}
            >
              <div className={`flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'}`}>
                <div
                  className={`flex items-center justify-center rounded-lg transition-transform duration-200 ${
                    isActive(link.path)
                      ? 'bg-purple-200 text-purple-700'
                      : 'bg-white hover:bg-[#642b8f] hover:text-white'
                  }`}
                  style={{
                    width: isExpanded ? '40px' : '32px',
                    height: isExpanded ? '40px' : '32px'
                  }}
                >
                  <span className="text-lg">{link.icon}</span>
                </div>
                
                {isExpanded && (
                  <span className={`text-base font-medium ${
                    isActive(link.path) ? 'text-purple-700' : 'text-gray-700 hover:text-white'
                  }`}>
                    {link.title}
                  </span>
                )}
              </div>

              {/* Chevron for Submenu - Only show when expanded */}
              {link.submenu && isExpanded && (
                <div className="ml-auto">
                  {expandedMenus[link.path] ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              )}
            </Link>

            {/* Submenu - Only show when expanded */}
            {link.submenu && expandedMenus[link.path] && isExpanded && (
              <div className="ml-14 bg-gray-50 rounded-md mt-1 shadow-md">
                {link.submenu.map((subLink) => (
                  <Link
                    key={subLink.path}
                    to={subLink.path}
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive(subLink.path)
                        ? 'bg-purple-50 text-purple-700'
                        : 'hover:bg-[#642b8f] hover:text-white'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center rounded-md ${
                        isActive(subLink.path)
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-white hover:bg-[#642b8f] hover:text-white'
                      }`}
                      style={{ width: '32px', height: '32px' }}
                    >
                      <span className="text-base">{subLink.icon}</span>
                    </div>
                    <span className="ml-3 text-sm font-medium">{subLink.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <Divider />

      
    </div>
  );
};

export default Sidebar;