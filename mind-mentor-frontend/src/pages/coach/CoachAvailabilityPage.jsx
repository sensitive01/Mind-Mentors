import CoachAvailabilityForm from "../../coach/components/CoachAvailabilityForm";
import Sidebar from "../../coach/Layout/Sidebar";
import Topbar from './../../component/parent-component/parent-dashboard/layout/Topbar';

const CoachAvailabilityPage = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0">
        <Sidebar />
      </div>

    
      <div className="flex-grow p-6">
        <Topbar/>
        <CoachAvailabilityForm/>
      </div>
    </div>
  );
};

export default CoachAvailabilityPage;
