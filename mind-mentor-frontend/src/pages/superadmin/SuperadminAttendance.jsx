import Sidebar from "../../superadmin/Layout/Sidebar";
import AttendanceCalendar from "../../superadmin/components/Attendance";
import Topbar from './../../component/parent-component/parent-dashboard/layout/Topbar';

const DashboardPage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
        <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1">
        <Topbar />
        <AttendanceCalendar />
      </div>
    </div>
  );
};

export default DashboardPage;
