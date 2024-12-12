import TaskModule2 from "../../superadmin/components/TaskModule2";
import Sidebar from "../../superadmin/Layout/Sidebar";
import Topbar from './../../component/parent-component/parent-dashboard/layout/Topbar';


const MyTaskPage = () => {
  return (
     <div className="flex min-h-screen bg-white">
         <Sidebar />


      {/* Add a flex-grow class to make the enquiry form take the full width */}
      <div className="flex-1">
        <Topbar />
        <TaskModule2 />
      </div>
    </div>
  );
};

export default MyTaskPage;
