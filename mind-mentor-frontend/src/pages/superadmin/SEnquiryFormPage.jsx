import NewEnquiryForm from "../../superadmin/components/NewEnquiryForm";
import Sidebar from "../../superadmin/Layout/Sidebar";
import Topbar from '../../component/parent-component/parent-dashboard/layout/Topbar';


const SEnquiryFormPage = () => {
  return (
    <div className="flex  bg-white">
         <Sidebar />
      </div>

      {/* Add a flex-grow class to make the enquiry form take the full width */}
      <div className="flex-1">
        <Topbar/>
        <NewEnquiryForm/>
      </div>
    </div>
  );
};

export default SEnquiryFormPage;
