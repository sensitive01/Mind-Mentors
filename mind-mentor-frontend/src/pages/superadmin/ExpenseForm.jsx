import Topbar from '../../component/parent-component/parent-dashboard/layout/Topbar';
import ExpenseForm from "../../superadmin/components/ExpenseForm";
import Sidebar from "../../superadmin/Layout/Sidebar";

const ReferalPage = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0">
        <Sidebar />
      </div>

      {/* Add a flex-grow class to make the enquiry form take the full width */}
      <div className="flex-grow p-6">
        <Topbar/>
        <ExpenseForm/>
      </div>
    </div>
  );
};

export default ReferalPage;