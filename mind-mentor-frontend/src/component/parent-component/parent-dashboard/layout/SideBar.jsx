import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Clock,
  PlayCircle,
  HelpCircle,
  Award,
  Users,
  Package,
  X,
} from "lucide-react";
import account from "../../../../images/boy.png";
import refer from "../../../../images/Refer.png";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/parent/dashboard", icon: Home, label: "Home", iconSize: 19 },
    { path: "/parent/kid", icon: Users, label: "Kids", iconSize: 19 },
    {
      path: "/parent-kid-package-selection",
      icon: Package,
      label: "Package Selection",
      iconSize: 19,
    },
    {
      path: "/parent/walkthrough-video",
      icon: PlayCircle,
      label: "Walkthrough",
      iconSize: 19,
    },
    {
      path: "/parent/support",
      icon: HelpCircle,
      label: "Support",
      iconSize: 19,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolled = scrollPosition > 100;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[280px] sm:w-[300px] lg:w-[130px]
        bg-white flex flex-col h-screen
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        lg:sticky lg:top-0
      `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="h-[80px] flex items-center justify-center mb-4 lg:mb-4">
          <button
            onClick={() => {
              navigate("/parent/profile/manage");
              onClose?.();
            }}
            className="relative group"
          >
            <div className="w-12 h-12 lg:w-12 lg:h-12 rounded-full overflow-hidden transform transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:shadow-lg group-hover:ring-4 group-hover:ring-[#642b8f] mt-6 lg:mt-6">
              <img
                src={account}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white"></div>
          </button>
        </div>

        {/* Navigation Links */}
        <nav
          className={`flex-1 py-4 ${
            isScrolled && window.innerWidth >= 1024 ? "hidden" : ""
          }`}
        >
          <div className="space-y-4 px-1 lg:px-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`group relative flex items-center lg:flex-col lg:justify-center py-4 px-4 lg:px-2 rounded-lg transition-all duration-300 ease-in-out ${
                  isActive(link.path) ? "bg-[#642b8f]" : "hover:bg-[#F3E5F5]"
                }`}
              >
                {/* Active indicator - left side for mobile, full height for desktop */}
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 lg:h-full bg-[#642b8f] rounded-r-full transition-all duration-300 ease-in-out ${
                    isActive(link.path)
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-50"
                  }`}
                />

                {/* Icon */}
                <div className="transition-transform duration-300 ease-in-out group-hover:scale-110 lg:mb-3">
                  <link.icon
                    size={link.iconSize}
                    className={`transition-colors duration-300 ${
                      isActive(link.path)
                        ? "text-white"
                        : "text-gray-600 group-hover:text-[#642b8f]"
                    }`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`ml-4 lg:ml-0 text-sm lg:text-xs font-medium lg:text-center lg:leading-tight transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-white font-semibold"
                      : "text-gray-600 group-hover:text-[#642b8f]"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Refer Section */}
        <div
          className={`p-3 lg:p-3 mt-auto ${
            isScrolled && window.innerWidth >= 1024 ? "hidden" : ""
          }`}
        >
          <div
            onClick={() => {
              navigate("/parent/new-referal");
              onClose?.();
            }}
            className="w-full relative group cursor-pointer transform transition-all duration-500 ease-in-out hover:scale-105"
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#642b8f]/0 to-[#642b8f]/0 transition-opacity duration-300 group-hover:from-[#642b8f]/10 group-hover:to-[#642b8f]/10" />
            <img
              src={refer}
              alt="refer"
              className="w-full h-auto object-contain relative z-10 rounded-lg max-w-[120px] lg:max-w-none mx-auto lg:mx-0"
            />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
