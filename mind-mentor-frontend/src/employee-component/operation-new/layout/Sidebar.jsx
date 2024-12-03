// import { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
// import account from '../../../images/accountInage.webp';
// import refer from '../../../images/Refer.png';
// import Logout from '../../../employee-component/operation-new/dashboard/Logout';

// const Sidebar = () => {
//   const location = useLocation();
//   const [expandedMenus, setExpandedMenus] = useState({});
//   const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

//   const isActive = (path) => location.pathname === path;

//   const toggleSubmenu = (path) => {
//     setExpandedMenus((prev) => ({
//       ...prev,
//       [path]: !prev[path],
//     }));
//   };

//   const handleSidebarToggle = () => {
//     setIsSidebarExpanded((prev) => !prev);
//   };

//   const navLinks = [
//     {
//       title: 'Dashboard',
//       icon: '📊',
//       path: '/employee-operation-dashboard',
//     },
//     {
//       title: 'Lead Management',
//       icon: '💼',
//       // path: '/crm',
//       submenu: [
//         { title: 'New Enquiry', icon: '📝', path: '/employee-operation-enquiry-form' },
//         { title: 'Enquiries', icon: '📋', path: '/employee-operation-enquiry-list' },
//         { title: 'Prospects', icon: '👥', path: '/employee-operation/prospects' },
//         { title: 'Conversion', icon: '📄', path: '/employee-operation/invoice' },

//         { title: 'Refer Friend', icon: '📢', path: '/employee-operation/referal' },
//       ],
//     },
//     {
//       title: 'Attendance',
//       icon: '📅',
//       path: '/employee-operation/attendance',
//     },
//     {
//       title: 'Leaves',
//       icon: '🗓️',
//       path: '/employee-operation/leaves',
//       submenu: [
//         { title: 'Create', icon: '📋', path: '/employee-operation/leaves/add' },
//         { title: 'Leaves', icon: '👥', path: '/employee-operation/leaves' },
//       ],
//     },
//     {
//       title: 'Tasks',
//       icon: '✓',
//       path: '/tasks',
//       submenu: [
//         { title: 'My Tasks', icon: '📋', path: '/tasks/my-tasks' },
//         { title: 'Team Tasks', icon: '👥', path: '/tasks/team-assign' },
//       ],
//     },
//     { title: 'Invoices', icon: '📄', path: '/employee-operation/invoice' },
//     {
//       title: 'Schedule',
//       icon: '📅',
//       path: '/employee-operation/schedule',
//       submenu: [
//         { title: 'All Classes', icon: '👁️', path: '/employee-operation/schedule' },
//         { title: 'Available Slots', icon: '📅', path: '/available-slot' },
//       ],
//     },
//     {
//       title: 'Support',
//       icon: '🔧',
//       path: '/support',
//       submenu: [
//         { title: 'System Admin', icon: '🔧', path: '/support/system-admin' },
//         { title: 'MyKart Status', icon: '📊', path: '/support/my-kart' },
//       ],
//     },
//   ];

//   return (
//     <div
//       className={`transition-all duration-300 h-screen bg-white shadow-lg fixed flex flex-col ${
//         isSidebarExpanded ? 'w-64' : 'w-20'
//       }`}
//     >
//       {/* Sidebar Toggle Button */}
//       <div className="flex items-center justify-end p-2">
//         <button
//           className="bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 transition-all"
//           onClick={handleSidebarToggle}
//         >
//           {isSidebarExpanded ? <X size={18} /> : <Menu size={18} />}
//         </button>
//       </div>

//       {/* Profile Section */}
//       <div
//         className={`flex flex-col items-center py-6 border-b transition-opacity duration-300 ${
//           isSidebarExpanded ? 'opacity-100' : 'opacity-0'
//         }`}
//       >
//         <Link to={'/employee-operation/profile'}>
//         <img
//           src={account}
//           alt="Profile"
//           className={`w-16 h-16 rounded-full shadow-lg transition-transform duration-200 ${
//             isSidebarExpanded ? 'scale-100' : 'scale-0'
//           }`}
//         />
//         </Link>
//         {isSidebarExpanded && (
//           <>
//             <h2 className="text-gray-800 text-lg font-semibold mt-2">John Doe</h2>
//             <span className="text-sm text-gray-500">Service Desk Technical Lead</span>
//           </>
//         )}
//       </div>

//       {/* Navigation Links */}
// {/* Navigation Links */}
// <nav className="flex flex-col mt-4">
//   {navLinks.map((link) => (
//     <div key={link.path} className="relative">
//       {/* Main Navigation Button */}
//       <Link
//         to={link.path}
//         onClick={() => link.submenu && toggleSubmenu(link.path)}
//         className={`w-full flex items-center justify-between px-4 py-3 relative transition-all duration-300 rounded-lg ${
//           isActive(link.path)
//             ? 'bg-purple-100 text-purple-700'
//             : 'hover:bg-[#642b8f] hover:text-white'
//         }`}
//       >
//         <div className="flex items-center space-x-3">
//           <div
//             className={`w-10 h-10 flex items-center justify-center rounded-lg transition-transform duration-200 ${
//               isActive(link.path)
//                 ? 'bg-purple-200 text-purple-700'
//                 : 'bg-white hover:bg-[#642b8f] hover:text-white'
//             }`}
//           >
//             <span className="text-lg">{link.icon}</span>
//           </div>
//           {isSidebarExpanded && (
//             <span
//               className={`text-base font-medium ${
//                 isActive(link.path) ? 'text-purple-700' : 'text-gray-700 hover:text-white'
//               }`}
//             >
//               {link.title}
//             </span>
//           )}
//         </div>

//         {/* Chevron for Submenu */}
//         {link.submenu && isSidebarExpanded && (
//           <div className="ml-auto">
//             {expandedMenus[link.path] ? (
//               <ChevronUp className="w-5 h-5 text-gray-500" />
//             ) : (
//               <ChevronDown className="w-5 h-5 text-gray-500" />
//             )}
//           </div>
//         )}
//       </Link>

//       {/* Submenu */}
//       {link.submenu && expandedMenus[link.path] && isSidebarExpanded && (
//         <div className="ml-14 bg-gray-50 rounded-md mt-1 shadow-md">
//           {link.submenu.map((subLink) => (
//             <Link
//               key={subLink.path}
//               to={subLink.path}
//               className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
//                 isActive(subLink.path)
//                   ? 'bg-purple-50 text-purple-700'
//                   : 'hover:bg-[#642b8f] hover:text-white'
//               }`}
//             >
//               <div
//                 className={`w-8 h-8 flex items-center justify-center rounded-md ${
//                   isActive(subLink.path)
//                     ? 'bg-purple-100 text-purple-700'
//                     : 'bg-white hover:bg-[#642b8f] hover:text-white'
//                 }`}
//               >
//                 <span className="text-base">{subLink.icon}</span>
//               </div>
//               <span className="ml-3 text-sm font-medium">{subLink.title}</span>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   ))}
// </nav>


//       {/* Refer Section */}
//       <div className={`mt-auto flex flex-col items-center pb-6 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
//         {isSidebarExpanded && <Logout />}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;



import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logout from '../../../employee-component/operation-new/dashboard/Logout';
import account from '../../../images/accountInage.webp';
import {
  Box,
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  Grid,
  Paper,
  Slide,
  TextField,
  ThemeProvider,
  Typography
} from '@mui/material';
const Sidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const isActive = (path) => location.pathname === path;

  const toggleSubmenu = (path) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleSidebarToggle = () => {
    setIsSidebarExpanded((prev) => !prev);
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
        { title: 'New Enquiry', icon: '📝', path: '/employee-operation-enquiry-form' },
        { title: 'Enquiries', icon: '📋', path: '/employee-operation-enquiry-list' },
        { title: 'Prospects', icon: '👥', path: '/employee-operation/prospects' },
        { title: 'Conversion', icon: '📄', path: '/employee-operation/invoice' },
        { title: 'Refer Friend', icon: '📢', path: '/employee-operation/referal' },
      ],
    },
    {
      title: 'Attendance',
      icon: '📅',
      path: '/employee-operation/attendance',
    },
    {
      title: 'Leaves',
      icon: '🗓️',
      path: '/employee-operation/leaves',
      submenu: [
        { title: 'Create', icon: '📋', path: '/employee-operation/leaves/add' },
        { title: 'Leaves', icon: '👥', path: '/employee-operation/leaves' },
      ],
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
    {
      title: 'Tasks',
      icon: '✓',
      path: '/employee-operation-tasks/tasks',
      submenu: [
        { title: 'My Tasks', icon: '📋', path: '/employee-operation-tasks/tasks' },
        { title: 'Assigned Tasks ', icon: '👥', path: '/employee-operation-tasks/assignedtasks' },
      ],
    },
    { title: 'Invoices', icon: '📄', path: '/employee-operation/invoice' },
    {
      title: 'Schedule',
      icon: '📅',
      path: '/employee-operation/schedule',
    },
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
    <>
      <div
        className={`transition-all duration-300 h-screen bg-white shadow-lg fixed flex flex-col ${isSidebarExpanded ? 'w-64' : 'w-20'
          }`}
        style={{ height: "-webkit-fill-available" }}
      >
        {/* Sidebar Toggle Button */}
        <div className="flex items-center justify-end p-2" style={{ background: '#642b8f ' }}>
          <button
            className="bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 transition-all"
            onClick={handleSidebarToggle}
          >
            {isSidebarExpanded ? <Menu size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Profile Section */}
        <div style={{ background: '#642b8f ' }}
          className={`flex flex-col items-center py-6 border-b transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <Link to={'/employee-operation/profile'}>
            <img
              src={account}
              alt="Profile"
              className={`w-16 h-16 rounded-full shadow-lg transition-transform duration-200 ${isSidebarExpanded ? 'scale-100' : 'scale-0'
                }`}
            />
          </Link>
          {isSidebarExpanded && (
            <>
              <h2 className="text-white text-lg font-semibold mt-2">Operations Mindmentoz</h2>
              <span className="text-sm text-white">Operational Manager at MindMentoz</span>
            </>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col mt-4 overflow-y-auto "> {/* Adjust the height  accordingly  max-h-[calc(100vh-200px)]*/}
          {navLinks.map((link) => (
            <div key={link.path} className="relative">
              {/* Main Navigation Button */}
              <Link
                to={link.path}
                onClick={() => link.submenu && toggleSubmenu(link.path)}
                className={`w-full flex items-center justify-between px-4 py-3 relative transition-all duration-300 rounded-lg ${isActive(link.path)
                    ? 'bg-purple-100 text-purple-700'
                    : 'hover:bg-[#642b8f] hover:text-white'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-transform duration-200 ${isActive(link.path)
                        ? 'bg-purple-200 text-purple-700'
                        : 'bg-white hover:bg-[#642b8f] hover:text-white'
                      }`}
                  >
                    <span className="text-lg">{link.icon}</span>
                  </div>
                  {isSidebarExpanded && (
                    <span
                      className={`text-base font-medium ${isActive(link.path) ? 'text-purple-700' : 'text-gray-700 hover:text-white'
                        }`}
                    >
                      {link.title}
                    </span>
                  )}
                </div>

                {/* Chevron for Submenu */}
                {link.submenu && isSidebarExpanded && (
                  <div className="ml-auto">
                    {expandedMenus[link.path] ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                )}
              </Link>

              {/* Submenu */}
              {link.submenu && expandedMenus[link.path] && isSidebarExpanded && (
                <>
                  <div className="ml-14 bg-gray-50 rounded-md mt-1 shadow-md">
                    {link.submenu.map((subLink) => (
                      <Link
                        key={subLink.path}
                        to={subLink.path}
                        className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${isActive(subLink.path)
                            ? 'bg-purple-50 text-purple-700'
                            : 'hover:bg-[#642b8f] hover:text-white'
                          }`}
                      >
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${isActive(subLink.path)
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-white hover:bg-[#642b8f] hover:text-white'
                            }`}
                        >
                          <span className="text-base">{subLink.icon}</span>
                        </div>
                        <span className="ml-3 text-sm font-medium">{subLink.title}</span>
                      </Link>
                    ))}
                  </div>
                </>

              )}

            </div>

          ))}
          {/* <div className={`mt-auto flex flex-col items-center pb-6 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
            {isSidebarExpanded && <Logout />}
          </div> */}
        </nav>
        <Divider />

        {/* Refer Section */}
        <div className={`mt-auto flex flex-col items-center pb-6 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0'}`}>
          {isSidebarExpanded && <Logout />}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
