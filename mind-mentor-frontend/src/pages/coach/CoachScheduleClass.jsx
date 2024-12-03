import ScheduleList from "../../coach/components/ScheduleList";
import Sidebar from "../../coach/Layout/Sidebar";
import Topbar from './../../component/parent-component/parent-dashboard/layout/Topbar';

const ListingEnquiries = () => {
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

export default ListingEnquiries;