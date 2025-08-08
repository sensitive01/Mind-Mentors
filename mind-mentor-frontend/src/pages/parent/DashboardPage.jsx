import { useState, useEffect } from "react";
import ChessLoader from "../../landingPage/loader/ChessLoader";
import Sidebar from "../../component/parent-component/parent-dashboard/layout/SideBar";
import Topbar from "../../component/parent-component/parent-dashboard/layout/ParentTopBar";
import Dashboard from "../../component/parent-component/parent-dashboard/dashboard-components/Dashboard";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <ChessLoader />
        </div>
      ) : (
        <>
          {/* Sidebar - Responsive */}
          <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-gray-100 min-w-0">
            {/* Top Bar - Responsive */}
            <div className="h-16 bg-white shadow-md flex-shrink-0">
              <Topbar onMenuClick={handleMenuClick} />
            </div>

            {/* Dashboard Content - Responsive */}
            <div 
              className="flex-1 overflow-auto"
              style={{
                scrollbarWidth: "none", 
                msOverflowStyle: "none",
              }}
            >
              <style>
                {`
                  /* WebKit Browsers */
                  .flex-1::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              <Dashboard />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;