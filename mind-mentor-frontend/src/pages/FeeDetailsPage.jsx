import { useState, useEffect } from 'react';
import Sidebar from "../component/parent-component/parent-dashboard/layout/SideBar";
import Topbar from "../component/parent-component/parent-dashboard/layout/Topbar";
import Fee from "../components/fee/Fee";
import ChessLoader from '../landingPage/loader/ChessLoader';  

const FeeDetailsPage = () => {
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
          <Topbar />

          <div className="flex">
            <Sidebar />

            <div className="flex-1 p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-full">
                  <Fee />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeDetailsPage;
