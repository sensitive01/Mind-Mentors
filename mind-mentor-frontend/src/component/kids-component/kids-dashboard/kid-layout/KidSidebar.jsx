import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, FileText, Grid, 
  Map, Trophy, Gamepad, UserCircle, 
} from "lucide-react";

const KidSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/kids/dashboard", icon: Home, label: "Home", color: "text-secondary" },
    { path: "/kids/demo-class", icon: FileText, label: "Class", color: "text-tertiary" },
    { path: "/kids/class-schedule", icon: Grid, label: "Schedule", color: "text-quaternary" },
    { path: "/kids/game-list", icon: Gamepad, label: "Games", color: "text-quinary" },
    { path: "/kids/achievements-list", icon: Trophy, label: "Achievements", color: "text-secondary" },
    { path: "/kids/travel-journey", icon: Map, label: "Journey", color: "text-tertiary" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div 
      className="fixed top-0 left-0 bottom-0 w-[250px] bg-gradient-to-b from-primary/90 to-primary/70 flex flex-col shadow-2xl overflow-y-auto z-50"
      style={{
        height: '100vh',
        maxHeight: '100vh',
        minHeight: '100vh'
      }}
    >
      {/* Profile Section */}
      <div className="pt-6 pb-4 flex justify-center relative">
        <button 
          onClick={() => navigate("/kids/profile/manage")}
          className="relative group"
        >
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-secondary/80 to-tertiary/80 flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110`}>
            <UserCircle 
              size={48} 
              className="text-white w-full h-full transform group-hover:rotate-6 transition-transform"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col space-y-2 px-3 py-4 overflow-y-auto">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`group relative flex items-center py-3 px-3 rounded-xl transition-all duration-300 ease-in-out ${isActive(link.path) ? 'bg-white/20 shadow-md scale-105' : 'hover:bg-white/10 hover:shadow-sm'}`}
          >
            {/* Icon Container */}
            <div className={`relative mr-3 transition-all duration-300 transform group-hover:scale-110 ${link.color} ${isActive(link.path) ? 'scale-125 rotate-6' : ''}`}>
              <link.icon 
                size={28} 
                strokeWidth={2} 
                className="group-hover:animate-bounce text-white"
              />
            </div>

            {/* Label */}
            <span className={`text-sm font-bold transition-all duration-300 ${isActive(link.path) ? 'text-white scale-105' : 'text-white/70 group-hover:text-white'}`}>
              {link.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Refer Section */}
      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-r from-secondary/80 to-tertiary/80 rounded-2xl p-4 text-center relative overflow-hidden shadow-lg hover:scale-105 transition-all duration-300 group">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 group-hover:skew-x-0 transition-transform duration-300"></div>
          
          <h3 className="text-white font-bold text-lg mb-2">
            Refer a Friend
          </h3>
          <p className="text-white/80 text-xs mb-3">
            Earn cool rewards!
          </p>
          <button className="bg-white text-primary px-4 py-2 rounded-full font-bold text-sm hover:bg-primary hover:text-white transition-all duration-300">
            Invite Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default KidSidebar;