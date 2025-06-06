import { useState, useEffect } from "react";
import KidsLoadingAnimation from "./KidsLoadingAnimation"; // Import the new loading component
import KidsDahbaordPage from "../../component/kids-component/kids-dashboard/KidsDashboard";
import KidSidebar from "../../component/kids-component/kids-dashboard/kid-layout/KidSidebar";
import KidTopbar from "../../component/kids-component/kids-dashboard/kid-layout/KidTopbar";

const KidsDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Extended to 3 seconds to enjoy the animation

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <KidsLoadingAnimation />;
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
          <KidsDahbaordPage />
        </div>
      </div>
    </div>
  );
};

export default KidsDashboard;