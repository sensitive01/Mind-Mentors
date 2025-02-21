import { useState } from "react";
import {
  ChevronDown,
  Home,
  BookOpen,
  Footprints,
  Settings,
  LogOut,
  Users,
  Bell,
  MessageCircle,
} from "lucide-react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import SupportChat from "./support-chat/SupportChat";
import logo from "../../../assets/mindmentorz.png"

const TopBarNew = () => {
  const [isKidDropdownOpen, setIsKidDropdownOpen] = useState(false);
  const [selectedKid, setSelectedKid] = useState("Aswinraj");
  const [showSupport, setShowSupport] = useState(false);
  const [showKidNav, setShowKidNav] = useState(false);
  const navigate = useNavigate();

  const kids = [
    { id: 1, name: "Kid 1", grade: "5th Grade" },
    { id: 2, name: "Kid 2", grade: "3rd Grade" },
  ];

  const handleKidSelect = (kidName) => {
    setSelectedKid(kidName);
    setIsKidDropdownOpen(false);
    setShowKidNav(true);
    navigate(`/parent/new-dashboard/${kidName.toLowerCase().replace(' ', '-')}`);
  };

  const handleLogout = () => {
    // Add your logout logic here
    navigate('/login');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <>
      <div className="w-full">
        <nav className="bg-white border-b border-gray-200 px-4 py-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-56 h-12 object-contain"
                />
                
              </Link>

              {/* Kid Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsKidDropdownOpen(!isKidDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-700">
                    {selectedKid}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {isKidDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {kids.map((kid) => (
                      <button
                        key={kid.id}
                        onClick={() => handleKidSelect(kid.name)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <Users className="w-4 h-4 text-orange-500" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">
                            {kid.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {kid.grade}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-6">
              <NavItem
                to="/dashboard"
                icon={<Home className="w-4 h-4" />}
                label="Dashboard"
              />
              {showKidNav && (
                <>
                  <NavItem
                    to="/curriculum"
                    icon={<BookOpen className="w-4 h-4" />}
                    label="Curriculum"
                  />
                  <NavItem
                    to="/walkthrough"
                    icon={<Footprints className="w-4 h-4" />}
                    label="Walkthrough"
                  />
                </>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/notifications')}
                className="relative p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-50"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => setShowSupport(true)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-50"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleSettings}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-50"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-50"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Support Chat Component */}
      {showSupport && <SupportChat onClose={() => setShowSupport(false)} />}
    </>
  );
};

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        isActive ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50"
      }`
    }
  >
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default TopBarNew;