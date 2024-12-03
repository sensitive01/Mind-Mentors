import AchievementTarget from "../../../../components/dashboard/AchievementTarget";
import ClassActivity from "../../../../components/dashboard/ClassActivity";
import Classes from "../../../../components/dashboard/Classes";
import MetricsCards from "../../../../components/dashboard/MetricsCards";

const Dashboard = () => {
  return (
    <div className="flex flex-col p-4 md:p-6 lg:p-8  min-h-screen space-y-8">
     
      <div className="">
        <MetricsCards />
      </div>

  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full flex-1">
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <ClassActivity />
        </div>

        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <Classes />
        </div>

        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <AchievementTarget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
