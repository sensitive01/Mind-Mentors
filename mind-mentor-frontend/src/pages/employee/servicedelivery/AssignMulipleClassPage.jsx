import AssignClassToKid from "../../../department-components/common-components/assign-class/AssignClassToKid";
import Sidebar from "../../../department-components/servicedelivery/Layout/Sidebar";
import Topbar from "./../../../component/parent-component/parent-dashboard/layout/Topbar";

const AssignMulipleClassPage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="ml-64 flex-1">
        {" "}
        {/* Adjusted margin-left to match sidebar width */}
        <Topbar />
        <AssignClassToKid />
      </div>
    </div>
  );
};

export default AssignMulipleClassPage;
