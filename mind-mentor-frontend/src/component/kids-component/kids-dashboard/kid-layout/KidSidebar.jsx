import { Link, useLocation, useNavigate } from "react-router-dom";
import { Camera, FileText, Grid, Home, Leaf, Map, Video, UserCircle } from "lucide-react";

const KidSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/kids/home", icon: Home, label: "Home" },
    { path: "/kids/demo-class", icon: FileText, label: "Demo Class" },
    { path: "/kids/class-schedule", icon: Grid, label: "Class Schedule" },
    { path: "/kids/chess-kid", icon: Leaf, label: "Chess Kid" },
    { path: "/kids/reports", icon: FileText, label: "Reports" },
    { path: "https://www.youtube.com/watch?v=zhkDRVRu6Rc", icon: Video, label: "Walkthrough" },
    { path: "/kids/certificates", icon: FileText, label: "Certificates" },
    { path: "/kids/playground", icon: Map, label: "Playground" },
  ];

  return (
    <div className="w-[130px] bg-white flex flex-col shadow-lg h-screen">
      {/* Profile Section */}
      <div className="pt-6 pb-4 flex justify-center relative">
        <button 
          onClick={() => navigate("/kids/profile/manage")}
          className="relative group"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden transform transition-all duration-500 ease-in-out 
                          group-hover:scale-110 group-hover:shadow-lg group-hover:ring-4 group-hover:ring-purple-200">
            <UserCircle size={48} color="#a555f7" className="w-full h-full" />
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white 
                          transform transition-transform duration-500 ease-in-out group-hover:scale-125"></div>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col space-y-1 px-2 py-2">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`
              group relative flex flex-col items-center justify-center
              py-3 px-2 rounded-lg
              transition-all duration-300 ease-in-out
              hover:shadow-md hover:bg-purple-50
              ${isActive(link.path) ? 'bg-purple-100 shadow-md' : ''}
            `}
          >
            {/* Active Indicator */}
            <div className={`
              absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8
              bg-[rgb(177,21,177)] rounded-r-full
              transform transition-all duration-300 ease-in-out
              ${isActive(link.path) ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-75'}
            `}></div>
            
            {/* Icon Container */}
            <div className={`
              relative mb-2 
              transition-all duration-300 ease-in-out
              transform 
              ${isActive(link.path) ? 'scale-110 rotate-3' : 'group-hover:scale-110 group-hover:rotate-3'}
            `}>
              <link.icon
                size={24}
                className={`
                  transition-colors duration-300 ease-in-out
                  ${
                    isActive(link.path)
                      ? 'text-[rgb(177,21,177)]'
                      : 'text-gray-400 group-hover:text-[rgb(177,21,177)]'
                  }
                `}
              />
            </div>

            {/* Label */}
            <span className={`
              text-xs font-medium text-center leading-tight
              transition-all duration-300 ease-in-out
              transform
              ${isActive(link.path) ? 'text-[rgb(177,21,177)] scale-105 font-semibold' : 'text-gray-600 group-hover:text-[rgb(177,21,177)] group-hover:scale-105'}
            `}>
              {link.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Refer Section */}
      <div className="mt-auto p-4 flex justify-center">
        <div className="w-full relative group transform transition-all duration-500 ease-in-out 
                        hover:scale-110 hover:rotate-2 cursor-pointer">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[rgb(177,21,177)]/0 to-[rgb(177,21,177)]/0 
                        transition-opacity duration-300 group-hover:from-[rgb(177,21,177)]/10 group-hover:to-[rgb(177,21,177)]/10"></div>
          <img 
            src="/api/placeholder/320/160" 
            alt="refer" 
            className="w-full h-auto object-contain relative z-10 
                     transition-all duration-500 ease-in-out 
                     group-hover:opacity-90 group-hover:shadow-lg 
                     rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default KidSidebar;
