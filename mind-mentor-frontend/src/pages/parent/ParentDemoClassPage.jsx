import { useState, useEffect } from "react";
import ChessLoader from "../../landingPage/loader/ChessLoader";
import Sidebar from "../../component/parent-component/parent-dashboard/layout/SideBar";
import Topbar from "../../component/parent-component/parent-dashboard/layout/Topbar";
import DashboardDemoClass from "../../component/parent-component/parent-dashboard/dashboard-components/DashboardDemoClass";


const ParentDemoClassPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
    {loading ? (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <ChessLoader />
      </div>
    ) : (
      <>
        <Sidebar />

        <div className="flex-1 flex flex-col h-full">
          <Topbar />

          <div className="flex-1 p-8">
            <DashboardDemoClass />
          </div>
        </div>
      </>
    )}
  </div>
  );
};

export default ParentDemoClassPage;
