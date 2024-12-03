import Topbar from '../../component/parent-component/parent-dashboard/layout/Topbar';
import Dashboard from "../../marketing/components/Dashboard";
import Sidebar from "../../marketing/Layout/Sidebar";


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