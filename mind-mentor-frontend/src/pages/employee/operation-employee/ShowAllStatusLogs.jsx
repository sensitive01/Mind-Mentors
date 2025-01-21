import Sidebar from "../../../department-components/operation-new/layout/Sidebar";
import Topbar from '../../../component/parent-component/parent-dashboard/layout/Topbar';
import CompleteStatusLogs from "../../../department-components/common-components/enquiries/CompleteStatusLogs";

const ShowAllStatusLogs = () => {
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
          <div 
            className="h-full w-full overflow-auto scrollbar-hide"
            style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            <div className="min-w-full p-4">
              <CompleteStatusLogs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowAllStatusLogs;