import Sidebar from "../../component/parent-component/parent-dashboard/layout/SideBar";
import Topbar from "../../component/parent-component/parent-dashboard/layout/Topbar";
import EnrolementKid from "./EnrolementKid";

const AddKid = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-full">
        <Topbar />
        
        <div className="flex-1 flex justify-center items-center p-4">
          <div className="w-full max-w-4xl">
            <EnrolementKid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddKid;
