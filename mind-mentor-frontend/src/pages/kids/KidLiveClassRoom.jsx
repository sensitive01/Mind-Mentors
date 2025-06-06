import {  useEffect } from "react";


import KidSidebar from "../../component/kids-component/kids-dashboard/kid-layout/KidSidebar";
import KidTopbar from "../../component/kids-component/kids-dashboard/kid-layout/KidTopbar";
import BlueButtonKidLiveClass from "../../component/kids-component/kids-dashboard/BlueButtonKidLiveClass";

const KidLiveClassRoom = () => {

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
        <BlueButtonKidLiveClass />
      </div>
    </div>
  </div>
  );
};

export default KidLiveClassRoom;
