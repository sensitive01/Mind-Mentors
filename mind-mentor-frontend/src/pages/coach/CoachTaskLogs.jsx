import Logs from "../../coach/components/logs";
import Sidebar from "../../coach/Layout/Sidebar";
import Topbar from "../../component/parent-component/parent-dashboard/layout/Topbar";
const CoachTaskLogs = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden">
        <Topbar/>
        <Logs />
      </div>
    </div>
  );
};

export default CoachTaskLogs;
