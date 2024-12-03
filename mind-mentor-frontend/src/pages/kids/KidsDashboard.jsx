import { useState, useEffect } from "react";

import KidsDahbaordPage from "../../component/kids-component/kids-dashboard/KidsDashboard";
import ChessLoader from "../../landingPage/loader/ChessLoader";
import KidSidebar from "../../component/kids-component/kids-dashboard/kid-layout/KidSidebar";
import KidTopbar from "../../component/kids-component/kids-dashboard/kid-layout/KidTopbar";

const KidsDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <ChessLoader />
        </div>
      ) : (
        <>
          <KidTopbar />

          <div className="flex flex-1 overflow-hidden">
            <div className="h-full">
              <KidSidebar />
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <div className="bg-white rounded-lg shadow-sm lg:col-span-2 p-4">
                  <KidsDahbaordPage />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KidsDashboard;
