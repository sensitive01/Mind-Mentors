import ScheduleList from "../../../employee-component/operation-new/dashboard/ScheduleList";
import Sidebar from "../../../employee-component/operation-new/layout/Sidebar";
import Topbar from './../../../component/parent-component/parent-dashboard/layout/Topbar';

const ScheduleClass = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar />
      </div>
      <div className="flex-1 ml-80 mr-4 p-4 overflow-x-hidden">
        <Topbar/>
        <ScheduleList />
      </div>
    </div>
  );
};

export default ScheduleClass;