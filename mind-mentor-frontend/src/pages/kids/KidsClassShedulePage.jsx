import { useEffect, useState } from "react";

import KidSidebar from "../../component/kids-component/kids-dashboard/kid-layout/KidSidebar";
import KidTopbar from "../../component/kids-component/kids-dashboard/kid-layout/KidTopbar";
import ClassShedule from "../../component/kids-component/kids-dashboard/ClassShedule";
import ChessLoader from "../../landingPage/loader/ChessLoader";

const KidsClassShedulePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <ChessLoader />
      </div>
    );
  }

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
