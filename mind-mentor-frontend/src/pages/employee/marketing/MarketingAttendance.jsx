import AttendanceCalendar from "../../../department-components/common-components/attandance/AttendanceDashboard";

import Topbar from '../../../component/parent-component/parent-dashboard/layout/Topbar';
import Sidebar from "../../../department-components/marketing/Layout/Sidebar";

const MarketingAttendance = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="z-30">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col relative">
        <div className="sticky top-0 z-20">
          <Topbar />
        </div>
        <div className="flex-1 overflow-hidden relative z-10">
          <div className="h-full overflow-y-auto scrollbar-hide">
            <AttendanceCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};
export default MarketingAttendance;
