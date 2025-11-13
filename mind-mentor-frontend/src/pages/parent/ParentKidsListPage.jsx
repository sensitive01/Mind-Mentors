import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ChessLoader from "../../landingPage/loader/ChessLoader";
import Sidebar from "../../component/parent-component/parent-dashboard/layout/SideBar";
import Topbar from "../../component/parent-component/parent-dashboard/layout/ParentTopBar";
import KidsDetails from "../../component/parent-component/parent-dashboard/dashboard-components/KidsDetails";
import { gettingKidsData } from "../../api/service/parent/ParentService";

const ParentKidsDetailsPage = () => {
  const [loading, setLoading] = useState(true);
  const [kids, setKids] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const parentId = localStorage.getItem("parentId");
  console.log("Parent ID:", parentId);

  useEffect(() => {
    const fetchKidsData = async () => {
      try {
        const response = await gettingKidsData(parentId);
        console.log("Response in fetch kids data:", response?.data?.kidsData);
        if (response.status === 200) {
          setKids(response?.data?.kidsData);
        }
      } catch (error) {
        console.error("Error fetching kids data:", error);
      }
    };

    if (parentId) fetchKidsData();
  }, [parentId]);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBack = () => navigate(-1);

  return (
    <div className="flex h-screen bg-gray-50">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <ChessLoader />
        </div>
      ) : (
        <>
          {/* Sidebar - Responsive */}
          <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

          {/* Main Content Area - FIXED */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Bar */}
            <div className="h-12 sm:h-16 bg-white shadow-md flex-shrink-0 z-10">
              <Topbar onMenuClick={handleMenuClick} />
            </div>

            {/* Main Content - REMOVED overflow-hidden */}
            <div className="flex-1 bg-gray-100">
              <div className="w-full h-full">
                {/* Back Button */}
                <div className="p-3 sm:p-4 bg-white border-b">
                  <button
                    onClick={handleBack}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-2 -ml-2"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    <span className="text-sm sm:text-base font-medium">Back</span>
                  </button>
                </div>

                {/* Kids Details - FULL WIDTH */}
                <div className="p-3 sm:p-4">
                  <KidsDetails kids={kids} />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={handleSidebarClose}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ParentKidsDetailsPage;