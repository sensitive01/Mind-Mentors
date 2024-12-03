import LeavesTable from "../../../employee-component/operation-new/dashboard/LeavesTable";
import Sidebar from "../../../employee-component/operation-new/layout/Sidebar";
import Topbar from './../../../component/parent-component/parent-dashboard/layout/Topbar';

const LeavesPage = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 mr-4 p-4 overflow-x-hidden">
        <Topbar/>
        <LeavesTable />
      </div>
    </div>
  );
};

export default LeavesPage;
