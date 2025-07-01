import { useState, useEffect } from "react";
import ChessLoader from "../../landingPage/loader/ChessLoader";
import Sidebar from "../../component/parent-component/parent-dashboard/layout/SideBar";
import Topbar from "../../component/parent-component/parent-dashboard/layout/ParentTopBar";
import Dashboard from "../../component/parent-component/parent-dashboard/dashboard-components/Dashboard";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <ChessLoader />
        </div>
      ) : (
        <>
  
          <div className="flex-shrink-0 bg-white text-white h-screen">
            <Sidebar />
          </div>

   
          <div className="flex-1 flex flex-col bg-gray-100">
     
            <div className="h-16 bg-white shadow-md">
              <Topbar />
            </div>

            <div
              className="flex-1 p-8 mt-5"
              style={{
                overflow: "auto",
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
