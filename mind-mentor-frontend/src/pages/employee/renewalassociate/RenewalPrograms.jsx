import Sidebar from "../../../department-components/renewalassociate/Layout/Sidebar";
import Topbar from '../../../component/parent-component/parent-dashboard/layout/Topbar';


const renewalPrograms = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white">
      <Sidebar />
      </div>

      {/* Add a flex-grow class to make the enquiry form take the full width */}
      <div className="flex-1 ml-64 mr-4 p-4 overflow-x-hidden">
        <Topbar/>
        <renewalTable/>
      </div>
    </div>
  );
};

export default renewalPrograms;
