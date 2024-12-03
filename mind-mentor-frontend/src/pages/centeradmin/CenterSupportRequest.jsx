import SupportTable from "../../centeradmin-components/dashboard/SupportTable";
import Sidebar from "../../centeradmin-components/layout/Sidebar";
import Topbar from "../../component/parent-component/parent-dashboard/layout/Topbar";


const CenterSupportRequest = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0">
      <Sidebar />
      </div>
      <div className="flex-1  p-4 overflow-x-hidden">
        <Topbar/>
        <SupportTable />
      </div>
    </div>
  );
};

export default CenterSupportRequest;