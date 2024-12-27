import Logs from "../../../employee-component/operation-new/dashboard/logs";
import Sidebar from "../../../employee-component/operation-new/layout/Sidebar";
import Topbar from './../../../component/parent-component/parent-dashboard/layout/Topbar';

const ReferalPage = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />


      {/* Add a flex-grow class to make the enquiry form take the full width */}
      <div className="flex-1">
        <Topbar />
        <Logs />
      </div>
    </div>
  );
};

export default ReferalPage;