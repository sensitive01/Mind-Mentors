import Topbar from '../../component/parent-component/parent-dashboard/layout/Topbar';
import Participents from "../../superadmin/components/Participents";
import Sidebar from "../../superadmin/Layout/Sidebar";
const ListingEnquiries = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 mr-4 p-4 overflow-x-hidden">
        <Topbar/>
        <Participents />
      </div>
    </div>
  );
};

export default ListingEnquiries;