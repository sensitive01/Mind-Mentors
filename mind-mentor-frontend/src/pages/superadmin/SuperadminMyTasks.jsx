import Topbar from '../../component/parent-component/parent-dashboard/layout/Topbar';
import TaskTable from "../../superadmin/components/TaskTable";
import Sidebar from "../../superadmin/Layout/Sidebar";

const ListingEnquiries = () => {
  return (
     <div className="flex min-h-screen bg-white">
         <Sidebar />
      <div className="flex-1">
        <Topbar/>
        <TaskTable />
      </div>
    </div>
  );
};

export default ListingEnquiries;