import SupportTable from "../../superadmin/components/SupportTable";
import Sidebar from "../../superadmin/Layout/Sidebar";
import Topbar from './../../component/parent-component/parent-dashboard/layout/Topbar';


const ListingEnquiries = () => {
  return (
     <div className="flex min-h-screen bg-white">
         <Sidebar />
      <div className="flex-1">
        <Topbar/>
        <SupportTable />
      </div>
    </div>
  );
};

export default ListingEnquiries;