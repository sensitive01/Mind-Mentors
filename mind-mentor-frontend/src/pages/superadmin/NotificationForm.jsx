import Topbar from '../../component/parent-component/parent-dashboard/layout/Topbar';
import Notification from "../../superadmin/components/Notification";
import Sidebar from "../../superadmin/Layout/Sidebar";

const ReferalPage = () => {
  return (
     <div className="flex min-h-screen bg-white">
         <Sidebar />


      {/* Add a flex-grow class to make the enquiry form take the full width */}
      <div className="flex-1">
        <Topbar/>
        <Notification/>
      </div>
    </div>
  );
};

export default ReferalPage;
