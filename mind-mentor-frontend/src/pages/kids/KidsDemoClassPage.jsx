import { useState, useEffect } from "react";

import KidSidebar from "../../component/kids-component/kids-dashboard/kid-layout/KidSidebar";
import KidTopbar from "../../component/kids-component/kids-dashboard/kid-layout/KidTopbar";
import KidsDemoClass from "../../component/kids-component/kids-dashboard/KidsDemoClass";

const KidsDemoClassPage = () => {
  useEffect(() => {
    // Initial setup or loading logic
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
        <KidsDemoClass />
      </div>
    </div>
  </div>
  );
};

export default KidsDemoClassPage;