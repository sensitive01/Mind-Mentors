import Topbar from '../../component/parent-component/parent-dashboard/layout/Topbar';
import KidsTable from "../../renewalassociate/components/KidsTable.jsx";
import Sidebar from "../../renewalassociate/Layout/Sidebar";


const ReferalPage = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white">
      <Sidebar />
      </div>

      {/* Add a flex-grow class to make the enquiry form take the full width */}
      <div className="flex-1 ml-64 mr-4 p-4 overflow-x-hidden">
        <Topbar/>
        <KidsTable/>
      </div>
    </div>
  );
};

export default ReferalPage;
