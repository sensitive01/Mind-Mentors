import Logs from "../../../department-components/common-components/task/TaskLogs";
import Sidebar from "../../../department-components/operation-new/layout/Sidebar";
import Topbar from './../../../component/parent-component/parent-dashboard/layout/Topbar';

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
          <div className="h-full w-full overflow-auto scrollbar-hide">
            <div className="min-w-full p-4 bg-gray-50">
              <Logs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferalPage;