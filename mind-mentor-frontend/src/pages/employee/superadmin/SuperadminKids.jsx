import KidsTable from "../../../department-components/superadmin/components/KidsTable.jsx";
import Topbar from '../../../component/parent-component/parent-dashboard/layout/EmployeeTopBar';
import Sidebar from "../../../department-components/superadmin/Layout/Sidebar";


const ReferalPage = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="z-30 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col relative min-w-0">
        <div className="sticky top-0 z-20">
          <Topbar />
        </div>
        <div className="flex-1 overflow-hidden relative z-10">
          <div className="h-full w-full overflow-auto scrollbar-hide bg-gray-50">
            <div className="min-w-full p-4">
              <KidsTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ReferalPage;
