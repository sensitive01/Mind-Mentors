import StatusTrack from "../../superadmin/components/StatusTrack";
import Sidebar from "../../superadmin/Layout/Sidebar";
import Topbar from './../../component/parent-component/parent-dashboard/layout/Topbar';

const SEnquiryFormPage = () => {
  return (
     <div className="flex min-h-screen bg-white">
         <Sidebar />


      {/* Add a flex-grow class to make the enquiry form take the full width */}
      <div className="flex-1">
        <Topbar/>
        <StatusTrack/>
      </div>
    </div>
  );
};

export default SEnquiryFormPage;
