import Dashboard from "../../coach/components/Dashboard";
import Sidebar from "../../coach/Layout/Sidebar";
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