import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ChessLoader from "../../landingPage/loader/ChessLoader";
import Sidebar from "../../component/parent-component/parent-dashboard/layout/SideBar";
import Topbar from "../../component/parent-component/parent-dashboard/layout/Topbar";
import ReferralPage from "../../component/parent-component/parent-dashboard/dashboard-components/ReferalPage";

const ParentReferalPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const handleBack = () => navigate(-1);

  return (
    <div className="flex h-screen">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <ChessLoader />
        </div>
      ) : (
        <div className="flex w-full h-full">
          <Sidebar className="h-full" />
          <div className="flex-1 flex flex-col h-full">
            <Topbar className="h-16 shadow-2xl" />

            <div className="flex-1 p-8 overflow-hidden bg-gray-100">
              {/* 🔙 Back Button */}
              <button
                onClick={handleBack}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>

              <div className="flex flex-col lg:flex-row gap-8 h-full">
                <div className="lg:w-full h-full">
                  <ReferralPage />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentReferalPage;
