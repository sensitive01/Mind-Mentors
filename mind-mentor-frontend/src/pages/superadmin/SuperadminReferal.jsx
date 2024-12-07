import ReferralReportTable from "../../superadmin/components/Referal";
import Sidebar from "../../superadmin/Layout/Sidebar";
import Topbar from '../../component/parent-component/parent-dashboard/layout/Topbar';


const ReferalPage = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0">
        <Sidebar />
      </div>

      {/* Add a flex-grow class to make the enquiry form take the full width */}
      <div className="flex-1 mr-4 p-4 overflow-x-hidden">
        <Topbar/>
        <ReferralReportTable/>
      </div>
    </div>
  );
};

export default ReferalPage;
