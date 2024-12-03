import Topbar from '../../component/parent-component/parent-dashboard/layout/Topbar';
import Dashboard from "../../renewalassociate/components/Dashboard";
import Sidebar from "../../renewalassociate/Layout/Sidebar";


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