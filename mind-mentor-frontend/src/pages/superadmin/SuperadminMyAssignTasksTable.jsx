import Topbar from '../../component/parent-component/parent-dashboard/layout/Topbar';
import TaskTable2 from "../../superadmin/components/TaskTable2";
import Sidebar from "../../superadmin/Layout/Sidebar";

const ListingEnquiries = () => {
  return (
     <div className="flex min-h-screen bg-white">
         <Sidebar />
      <div className="flex-1">
        <Topbar/>
        <TaskTable2 />
      </div>
    </div>
  );
};

export default ListingEnquiries;