import { useEffect, useState } from "react";
import TopBarNew from "../../component/parent-newComponents/layout/TopBarNew";
import ChessLoader from "../../landingPage/loader/ChessLoader";
import ParentDashboard from "./ParentDashboard";

const NewDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <ChessLoader />
        </div>
      ) : (
        <div>
          <TopBarNew />

          <div className="flex">
            <div className="flex-1 p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-full">
                  <ParentDashboard />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDashboard;
