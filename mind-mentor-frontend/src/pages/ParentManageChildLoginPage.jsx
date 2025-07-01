import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Sidebar from "../component/parent-component/parent-dashboard/layout/SideBar";
import Topbar from "../component/parent-component/parent-dashboard/layout/ParentTopBar";
import ManageKidLogin from "../component/parent-component/parent-dashboard/dashboard-components/ManageKidLogin";
import ChessLoader from "../landingPage/loader/ChessLoader";

const ParentManageChildLoginPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const handleBack = () => navigate(-1);

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <ChessLoader />
        </div>
      ) : (
        <div className="flex h-full">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 flex flex-col h-full">
            <Topbar />

            {/* Content Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>

              {/* Main Component */}
              <ManageKidLogin />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentManageChildLoginPage;
