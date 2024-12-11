import {  useEffect } from "react";


import KidSidebar from "../../component/kids-component/kids-dashboard/kid-layout/KidSidebar";
import KidTopbar from "../../component/kids-component/kids-dashboard/kid-layout/KidTopbar";
import ClassShedule from "../../component/kids-component/kids-dashboard/ClassShedule";

const KidsClassShedulePage = () => {

  useEffect(() => {
    setTimeout(() => {
    }, 1500);
  }, []);

  return (
    <div className="flex h-screen">
    {/* Sidebar */}
    <div className="flex-none w-[250px]">
      <KidSidebar />
    </div>

    {/* Main content area */}
    <div className="flex-1 flex flex-col">
      {/* Topbar */}
      <div className="flex-none">
        <KidTopbar />
      </div>

      {/* Dashboard */}
      <div className="flex-1 overflow-auto">
        <ClassShedule />
      </div>
    </div>
  </div>
  );
};

export default KidsClassShedulePage;
