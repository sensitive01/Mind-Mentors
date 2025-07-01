import { useState, useEffect } from "react";
import ChessLoader from "../../landingPage/loader/ChessLoader";
import Sidebar from "../../component/parent-component/parent-dashboard/layout/SideBar";
import Topbar from "../../component/parent-component/parent-dashboard/layout/ParentTopBar";
import ParentPayment from "../../component/parent-component/parent-dashboard/dashboard-components/ParentPayment";


const ParentPaymentPage = () => {
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
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1">
            <Topbar />
            <ParentPayment />
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentPaymentPage;
