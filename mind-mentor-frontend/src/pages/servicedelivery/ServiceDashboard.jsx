import Dashboard from "../../servicedelivery/components/Dashboard";
import Sidebar from "../../servicedelivery/Layout/Sidebar";
import Topbar from '../../component/parent-component/parent-dashboard/layout/Topbar';


const DashboardPage = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <Dashboard />
      </div>
    </div>
  )
}

export default DashboardPage