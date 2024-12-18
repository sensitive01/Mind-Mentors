import { useState, useEffect } from "react";
import ChessLoader from "../../landingPage/loader/ChessLoader";
import Sidebar from "../../component/parent-component/parent-dashboard/layout/SideBar";
import Topbar from "../../component/parent-component/parent-dashboard/layout/Topbar";
import KidsDetails from "../../component/parent-component/parent-dashboard/dashboard-components/KidsDetails";
import { gettingKidsData } from "../../api/service/parent/ParentService";

const ParentKidsDetailsPage = () => {
  const [loading, setLoading] = useState(true);
  const [kids, setKids] = useState([]);

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
              <KidsDetails kids={kids} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ParentKidsDetailsPage;
