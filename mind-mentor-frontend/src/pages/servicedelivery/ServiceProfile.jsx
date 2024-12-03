import Profile from "../../servicedelivery/components/Profile";
import Sidebar from "../../servicedelivery/Layout/Sidebar";
import Topbar from './../../component/parent-component/parent-dashboard/layout/Topbar';

const ListingEnquiries = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar />
      </div>
      <div className="ml-64 flex-1"> {/* Adjusted margin-left to match sidebar width */}
        <Topbar/>
\        <Profile />
      </div>
    </div>
  );
};
export default ListingEnquiries;
