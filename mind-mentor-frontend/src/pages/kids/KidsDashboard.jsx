import { useState, useEffect } from "react";
import KidsLoadingAnimation from "./KidsLoadingAnimation"; // Import the new loading component
import KidsDahbaordPage from "../../component/kids-component/kids-dashboard/KidsDashboard";
import KidSidebar from "../../component/kids-component/kids-dashboard/kid-layout/KidSidebar";
import KidTopbar from "../../component/kids-component/kids-dashboard/kid-layout/KidTopbar";

const KidsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for mobile sidebar

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Extended to 3 seconds to enjoy the animation

    return () => clearTimeout(timer);
  }, []);

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  if (loading) {
    return <KidsLoadingAnimation />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Responsive */}
      <KidSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Topbar */}
        <div className="flex-none z-10">
          <KidTopbar onMenuClick={toggleSidebar} />
        </div>

        {/* Dashboard */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <KidsDahbaordPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidsDashboard;
