import CompleteEnquiryLogs from '../../../department-components/superadmin/components/CompleteEnquiryLogs';
import Topbar from '../../../component/parent-component/parent-dashboard/layout/Topbar';
import Sidebar from "../../../department-components/superadmin/Layout/Sidebar";
const SuperAdminEnquiryLogs = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 mr-4 p-4 overflow-x-hidden">
        {/* Content inside the main area */}
        <Topbar/>
        <CompleteEnquiryLogs/>
      </div>
    </div>
  );
};

export default SuperAdminEnquiryLogs;
