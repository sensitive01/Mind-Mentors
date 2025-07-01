import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Sidebar from "../component/parent-component/parent-dashboard/layout/SideBar";
import Topbar from "../component/parent-component/parent-dashboard/layout/ParentTopBar";
import MenuGrid from "../components/attandance/MenuGrid";
import ChessLoader from "../landingPage/loader/ChessLoader";

const AttendancePage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const handleBack = () => navigate(-1);

  return (
    <div className="h-screen w-screen overflow-hidden flex">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <ChessLoader />
        </div>
      ) : (
        <>
          {/* Sidebar */}
          <div className="h-full">
            <Sidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col h-full bg-gray-100">
            {/* Topbar */}
            <div className="h-16">
              <Topbar />
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-auto p-6 mt-5">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
     

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
