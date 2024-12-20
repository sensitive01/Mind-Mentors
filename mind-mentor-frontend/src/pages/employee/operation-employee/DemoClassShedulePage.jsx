import DemoClassForm from "../../../employee-component/operation-new/dashboard/DemoClassForm";
import Sidebar from "../../../employee-component/operation-new/layout/Sidebar";
import Topbar from "./../../../component/parent-component/parent-dashboard/layout/Topbar";

const DemoClassShedulePage = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0">
        <Sidebar />
      </div>

      <div className="flex-1 mr-4 p-4 overflow-x-hidden">
        <Topbar />
        <DemoClassForm />
      </div>
    </div>
  );
};

export default DemoClassShedulePage;
