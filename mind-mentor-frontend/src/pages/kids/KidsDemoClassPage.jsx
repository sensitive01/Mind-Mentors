import { useState, useEffect } from "react";


import KidSidebar from "../../component/kids-component/kids-dashboard/kid-layout/KidSidebar";
import KidTopbar from "../../component/kids-component/kids-dashboard/kid-layout/KidTopbar";
import KidsDemoClass from "../../component/kids-component/kids-dashboard/KidsDemoClass";

const KidsDemoClassPage = () => {

  useEffect(() => {
    setTimeout(() => {
    }, 1500);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <>
        <KidTopbar />

        <div className="flex flex-1 overflow-hidden">
          <div className="h-full">
            <KidSidebar />
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="bg-white rounded-lg shadow-sm lg:col-span-2 p-4">
                <KidsDemoClass />
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default KidsDemoClassPage;
