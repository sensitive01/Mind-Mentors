import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ChessLoader from "../../landingPage/loader/ChessLoader";
import Sidebar from "../../component/parent-component/parent-dashboard/layout/SideBar";
import Topbar from "../../component/parent-component/parent-dashboard/layout/Topbar";
import KidsDetails from "../../component/parent-component/parent-dashboard/dashboard-components/KidsDetails";
import { gettingKidsData } from "../../api/service/parent/ParentService";

const ParentKidsDetailsPage = () => {
  const [loading, setLoading] = useState(true);
  const [kids, setKids] = useState([]);
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

  const handleBack = () => navigate(-1);

  return (
    <div className="flex h-screen bg-gray-50">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <ChessLoader />
        </div>
      ) : (
        <>
          <Sidebar />
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <Topbar />
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Back Button */}
                <button
                  onClick={handleBack}
                  className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>

                {/* Kids Data */}
                <KidsDetails kids={kids} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ParentKidsDetailsPage;