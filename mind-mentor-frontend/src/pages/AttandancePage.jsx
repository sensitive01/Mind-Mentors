import { useState, useEffect } from "react";
import Sidebar from "../component/parent-component/parent-dashboard/layout/SideBar";
import Topbar from "../component/parent-component/parent-dashboard/layout/Topbar";
import AttendanceList from "../components/attandance/AttandanceList";
import MenuGrid from "../components/attandance/MenuGrid";
import ChessLoader from "../landingPage/loader/ChessLoader";

const AttendancePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="flex h-screen">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <ChessLoader />
        </div>
      ) : (
        <>
        
          <div className="h-screen bg-white shadow-md">
            <Sidebar />
          </div>

        
          <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
         
            <div className="h-16 bg-white shadow-md">
              <Topbar />
            </div>

         
            <div className="flex-1 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* <div className="bg-white rounded-lg shadow-sm p-4">
                  <AttendanceList />
                </div> */}

                <div className="bg-white rounded-lg shadow-sm p-4 lg:col-span-2">
                  <MenuGrid />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendancePage;