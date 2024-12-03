
import Dashboard from "../../centeradmin-components/dashboard/Dashboard";
import Sidebar from "../../centeradmin-components/layout/Sidebar";
import Topbar from "../../component/parent-component/parent-dashboard/layout/Topbar";



const CenterOperationDashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0">
        <Sidebar />
      </div>

      {/* <div className="flex-1 ml-0 md:ml-64"> */}
        <div className="md:hidden bg-white shadow-sm p-4">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>

        <div className="flex-1 overflow-x-hidden">
          <Topbar/>
        <Dashboard />
        </div>
      </div>
    // </div>
  );
};

export default CenterOperationDashboardPage;
