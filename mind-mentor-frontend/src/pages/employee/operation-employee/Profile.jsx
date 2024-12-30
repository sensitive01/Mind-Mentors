import { Divider } from "@mui/material";
import Profiles from "../../../department-components/operation-new/dashboard/Profile";
import Sidebar from "../../../department-components/operation-new/layout/Sidebar";
import Topbar from './../../../component/parent-component/parent-dashboard/layout/Topbar';

const Profile = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar />
      </div>
      <div className="ml-64 flex-1"> {/* Adjusted margin-left to match sidebar width */}
        <Topbar/>
\        <Profiles />
      </div>
    </div>
  );
};

export default Profile;