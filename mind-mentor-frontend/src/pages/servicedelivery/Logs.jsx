import Logs from "../../servicedelivery/components/logs";

import Sidebar from "../../servicedelivery/Layout/Sidebar";
import Topbar from './../../component/parent-component/parent-dashboard/layout/Topbar';

const ReferalPage = () => {
  return (
  <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden">
        {/* Content inside the main area */}
        <Topbar/>
        <Logs />
      </div>
    </div>
  );
};

export default ReferalPage;
