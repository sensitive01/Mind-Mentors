import EnqRelatedTask from "../../../department-components/common-components/prospects/detailed-view/PaymentDecode";


import Sidebar from "../../../department-components/operation-new/layout/Sidebar";
import Topbar from './../../../component/parent-component/parent-dashboard/layout/Topbar';
const EnrollmentVerifyPayment = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="z-30">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col relative">
        <div className="sticky top-0 z-20">
          <Topbar />
        </div>
        <div className="flex-1 overflow-hidden relative z-10">
          <div className="h-full overflow-y-auto scrollbar-hide">
            <EnqRelatedTask />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentVerifyPayment;
