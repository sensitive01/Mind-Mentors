import NewEnquiryForm from "../../../department-components/superadmin/components/NewEnquiryForm";
import Topbar from '../../../component/parent-component/parent-dashboard/layout/Topbar';
import Sidebar from "../../../department-components/superadmin/Layout/Sidebar";


const SEnquiryFormPage = () => {
  return (
    <div className="flex  bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0">
        <Sidebar />
      </div>

      {/* Add a flex-grow class to make the enquiry form take the full width */}
      <div className="flex-grow p-6">
        <Topbar/>
        <NewEnquiryForm/>
      </div>
    </div>
  );
};

export default SEnquiryFormPage;
