import { useState } from "react";
import TaskModule2 from "../../../department-components/operation-new/dashboard/TaskModule2";
import Sidebar from "../../../department-components/operation-new/layout/Sidebar";
import Topbar from "./../../../component/parent-component/parent-dashboard/layout/Topbar";

const scrollbarHideStyles = `
  .hide-scrollbar {
    -ms-overflow-style: none;  /* For Internet Explorer and Edge */
    scrollbar-width: none;     /* For Firefox */
  }
  
  .hide-scrollbar::-webkit-scrollbar {
    display: none;  /* For Chrome, Safari, and Opera */
  }
`;

const TaskAssignByMePage = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleSidebarToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <>
      <style>{scrollbarHideStyles}</style>

      <div className="min-h-screen bg-gray-50">
        <div
          className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300 ease-in-out
            ${isSidebarExpanded ? "w-64" : "w-20"}`}
        >
          <Sidebar
            isExpanded={isSidebarExpanded}
            onToggle={handleSidebarToggle}
          />
        </div>

        <div
          className={` bg-[#f5f5f5] transition-all duration-300 ease-in-out
            ${isSidebarExpanded ? "ml-64" : "ml-20"}`}
        >
          <div
            className="fixed top-0 right-0 z-30 transition-all duration-300 ease-in-out"
            style={{
              width: `calc(100% - ${isSidebarExpanded ? "256px" : "80px"})`,
            }}
          >
            <Topbar />
          </div>

          <div className="pt-16">
            <div className="mx-3 mt-4">
              <div className=" rounded-lg shadow-sm">
                <div className="hide-scrollbar overflow-y-auto overflow-x-hidden h-[calc(100vh-120px)]">
                  <div className="p-6">
                    <TaskModule2 />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskAssignByMePage;
