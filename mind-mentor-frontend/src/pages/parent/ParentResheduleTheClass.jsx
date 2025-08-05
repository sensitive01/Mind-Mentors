import { useState, useEffect } from "react";
import ChessLoader from "../../landingPage/loader/ChessLoader";
import Sidebar from "../../component/parent-component/parent-dashboard/layout/SideBar";
import Topbar from "../../component/parent-component/parent-dashboard/layout/ParentTopBar";
import ResheduleClasses from "../../component/parent-component/parent-dashboard/dashboard-components/ResheduleClasses";

const ParentResheduleTheClass = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <ChessLoader />
        </div>
      ) : (
        <div className="flex w-full h-full">
          {/* Sidebar - Fixed */}
          <div className="flex-shrink-0">
            <Sidebar className="h-full" />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full min-w-0">
            {/* Topbar - Fixed */}
            <div className="flex-shrink-0">
              <Topbar className="h-16" />
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Remove the outer padding and overflow-hidden that was preventing scroll */}
              <div className="min-h-full">
                <ResheduleClasses />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentResheduleTheClass;
