import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { StepperProvider } from "./component/completion-status-bar/StepperContext";
import { Provider } from 'react-redux';
import {store} from "./store/reducer"


// parent login part
import ParentLogin from "./component/parent-component/ParentLogin";
import ParentOtpPage from "./component/parent-component/ParentOtpPage";
import ParentRegistration from "./component/parent-component/ParentRegistartion";
import ParentKidsRegistration from "./component/parent-component/ParentKidsRegistarion";
import KidsRegistration from "./component/parent-component/KidsRegistration";

// parent dashboard part
import DashboardPage from "./pages/parent/DashboardPage";
import KidsPage from "./pages/parent/KidsPage";
import ParentKidsDetailsPage from "./pages/parent/ParentKidsListPage";
import AttendancePage from "./pages/AttandancePage";
import FeeDetailsPage from "./pages/FeeDetailsPage";
import ClassShedulePage from "./pages/ClassShedulePage";
import HomePage from "./landingPage/HomePage";
import AddKid from "./components/parent/AddKid";
import ParentDemoClassPage from "./pages/parent/ParentDemoClassPage";
import ParentManageChildLoginPage from "./pages/ParentManageChildLoginPage";
import ParentReqNewDemoClass from "./pages/parent/ParentReqNewDemoClass";
import ParentProfilePage from "./pages/parent/ParentProfilePage";
import CertificatePage from "./pages/parent/CertificatePage";
import KidsLoginPage from "./component/kids-component/kids-login/KidsLoginPage";
import KidsPinPage from "./component/kids-component/kids-login/KidsPinPage";
import KidsDashboard from "./pages/kids/KidsDashboard";
import ParentReferalPage from "./pages/parent/ParentReferalPage";
import SupportPage from "./pages/parent/SupportPage";
import WalkThroughPage from "./pages/parent/WalkThroughPage";



import LoginPage from "./employee-component/operation-new/dashboard/LoginPage";



import OperationDashboardPage from "./pages/employee/operation-employee/OperationDashboardPage";
import SEnquiryFormPage from "./pages/employee/operation-employee/SEnquiryFormPage";

import ListingEnquiries from "./pages/employee/operation-employee/ListingEnquiries";
import MyTaskPage from "./pages/employee/operation-employee/MyTaskPage";
import ProspectPage from "./pages/employee/operation-employee/ProspectPage";
import ReferalPage from "./pages/employee/operation-employee/ReferalPage";
import TaskAssignByMePage from "./pages/employee/operation-employee/TaskAssignByMePage";
import TasksPage from "./pages/employee/operation-employee/TasksPage";

import SupportPages from "./pages/employee/operation-employee/SupportPage";
import MessageStusTrackPage from "./pages/employee/operation-employee/MessageStusTrackPage";
import SupportRequest from "./pages/employee/operation-employee/SupportRequest";
import ScheduleClass from "./pages/employee/operation-employee/ScheduleClass";
import LeavesPage from "./pages/employee/operation-employee/LeavesPage";
import EmpAttendance from "./pages/employee/operation-employee/EmpAttendance"

import Profile from "./pages/employee/operation-employee/Profile"
import InvoicePage from "./pages/employee/operation-employee/InvoicePage"
import StudentReport from "./pages/employee/operation-employee/StudentReport"
import CoachFeedback from "./pages/employee/operation-employee/CoachFeedback"
import AssigneTaskPage from "./pages/employee/operation-employee/AssigneTasksPage"
import LeaveFormPage from "./pages/employee/operation-employee/LeaveFormPage";



import CenterOperationDashboardPage from "./pages/centeradmin/CenterOperationDashboardPage;";
import CenterSEnquiryFormPage from "./pages/centeradmin/CenterSEnquiryFormPage";
import CenterListingEnquiries from "./pages/centeradmin/CenterListingEnquiries";
import CenterMyTaskPage from "./pages/centeradmin/CenterMyTaskPage";
import CenterProspectPage from "./pages/centeradmin/CenterProspectPage";
import CenterReferalPage from "./pages/centeradmin/CenterReferalPage";
import CenterTaskAssignByMePage from "./pages/centeradmin/CenterTaskAssignByMePage";
import CenterAssigneTasksPage from "./pages/centeradmin/CenterAssigneTasksPage";
import CenterTasksPage from "./pages/centeradmin/CenterTasksPage";
import CenterSupportPage from "./pages/centeradmin/CenterSupportPage";
import CenterMessageStusTrackPage from "./pages/centeradmin/CenterMessageStusTrackPage";
import CenterSupportRequest from "./pages/centeradmin/CenterSupportRequest";
import CenterScheduleClass from "./pages/centeradmin/CenterScheduleClass";
import CenterLeavesPage from "./pages/centeradmin/CenterLeavesPage";
import CenterLeaveFormPage from "./pages/centeradmin/CenterLeaveFormPage";
import CenterAdminAttendance from "./pages/centeradmin/CenterAdminAttendance";
import CenterProfile from "./pages/centeradmin/CenterProfile";
import CenterInvoicePage from "./pages/centeradmin/CenterInvoicePage";
import CenterStudentReport from "./pages/centeradmin/CenterStudentReport";
import CenterCoachFeedback from "./pages/centeradmin/CenterCoachFeedback";
import CenterLoginPage from "./centeradmin-components/CenterLoginPage";







function App() {
  return (
    


  
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Parent Routes */}
          <Route path="/parent/login" element={<ParentLogin />} />
          <Route path="/parent/enter-otp" element={<ParentOtpPage />} />

          <Route 
          path="/parent/registration" 
          element={
            <Provider store={store}>
              <StepperProvider>
                <ParentRegistration />
              </StepperProvider>
            </Provider>
          } 
        />
        
        <Route 
          path="/parent/parent-kids-registration" 
          element={
            <Provider store={store}>
              <StepperProvider>
                <ParentKidsRegistration />
              </StepperProvider>
            </Provider>
          } 
        />
        
        <Route 
          path="/parent/kids/demo" 
          element={
            <Provider store={store}>
              <StepperProvider>
                <KidsRegistration />
              </StepperProvider>
            </Provider>
          } 
        />

          <Route path="/parent/dashboard" element={<DashboardPage />} />
          <Route path="/parent/kid" element={<ParentKidsDetailsPage />} />
          <Route path="/parent/add-kid" element={<AddKid />} />
          <Route path="/parent/kid/attendance/:id" element={<AttendancePage />}/>
          <Route path="/parent/kid/demo-class/:id" element={<ParentDemoClassPage />}/>
          <Route path="/parent/kid/demo-class-shedule/:id" element={<ParentReqNewDemoClass />}/>
          <Route path="/parent/kid/manage-login/:id" element={<ParentManageChildLoginPage />}/>
          <Route path="/parent/profile/manage" element={<ParentProfilePage />}/>
          <Route path="/parent/certificate" element={<CertificatePage />} />
          <Route path="/parent/kid/attendance" element={<KidsPage />} />
          <Route path="/parent/new-referal" element={<ParentReferalPage />} />
          <Route path="/parent/support" element={<SupportPage />} />
          <Route path="/parent/walkthrough-video" element={<WalkThroughPage />} />


         
          <Route path="/kids/login" element={<KidsLoginPage />} />
          <Route path="/kid/otp" element={<KidsPinPage />} />
          <Route path="/kids/dashboard" element={<KidsDashboard />} />
          <Route path="/fee-details" element={<FeeDetailsPage />} />
          <Route path="/class-schedule" element={<ClassShedulePage />} />



       
    
        <Route path="/employee-login" element={<LoginPage />} />
        <Route path="/employee-operation-dashboard" element={<OperationDashboardPage />} />
        <Route path="/employee-operation-enquiry-form" element={<SEnquiryFormPage />} /> 
        <Route path="/employee-operation-enquiry-list" element={<ListingEnquiries/>} />
        <Route path="/employee-operation-tasks/add" element={<MyTaskPage/>} />
        <Route path="/employee-operation/prospects" element={<ProspectPage/>} />
        <Route path="/employee-operation/referal" element={<ReferalPage/>} />
        <Route path="/employee-operation-tasks/assigntask" element={<TaskAssignByMePage/>} />
        <Route path="/employee-operation-tasks/assignedtasks" element={<AssigneTaskPage/>} />
        <Route path="/employee-operation-tasks/tasks" element={<TasksPage/>} />
        <Route path="/employee-operation-tasks/support/add" element={<SupportPages/>} />
        <Route path="/employee-operation-tasks/supportTrack" element={<MessageStusTrackPage/>} />
        <Route path="/employee-operation-tasks/supports" element={<SupportRequest/>} />
        <Route path="/employee-operation/schedule" element={<ScheduleClass/>} />
        <Route path="/employee-operation/leaves" element={<LeavesPage/>} />
        <Route path="/employee-operation/leaves/add" element={<LeaveFormPage/>} />
        <Route path="/employee-operation/attendance" element={<EmpAttendance/>} />
        <Route path="/employee-operation/profile" element={<Profile/>} />
        <Route path="/employee-operation/invoice" element={<InvoicePage/>} />
        <Route path="/employee-operation/studentreport" element={<StudentReport/>} />
        <Route path="/employee-operation/coachfeedback" element={<CoachFeedback/>} />


        
        <Route path="/centeradmin-login" element={<CenterLoginPage />} />
        <Route path="/centeradmin-dashboard" element={<CenterOperationDashboardPage />} />
        <Route path="/centeradmin-enquiry-form" element={<CenterSEnquiryFormPage />} /> 
        <Route path="/centeradmin-enquiry-list" element={<CenterListingEnquiries/>} />
        <Route path="/centeradmin-tasks/add" element={<CenterMyTaskPage/>} />
        <Route path="/centeradmin/prospects" element={<CenterProspectPage/>} />
        <Route path="/centeradmin/referal" element={<CenterReferalPage/>} />
        <Route path="/centeradmin-tasks/assigntask" element={<CenterTaskAssignByMePage/>} />
        <Route path="/centeradmin-tasks/assignedtasks" element={<CenterAssigneTasksPage/>} />

        <Route path="/centeradmin-tasks/tasks" element={<CenterTasksPage/>} />
        <Route path="/centeradmin-tasks/support/add" element={<CenterSupportPage/>} />
        <Route path="/centeradmin-tasks/supportTrack" element={<CenterMessageStusTrackPage/>} />
        <Route path="/centeradmin-tasks/supports" element={<CenterSupportRequest/>} />
        <Route path="/centeradmin/schedule" element={<CenterScheduleClass/>} />
        <Route path="/centeradmin/leaves" element={<CenterLeavesPage/>} />
        <Route path="/centeradmin/leaves/add" element={<CenterLeaveFormPage/>} />
       
        <Route path="/centeradmin/attendance" element={<CenterAdminAttendance/>} />
        <Route path="/centeradmin/profile" element={<CenterProfile/>} />
        <Route path="/centeradmin/invoice" element={<CenterInvoicePage/>} />
        <Route path="/centeradmin/studentreport" element={<CenterStudentReport/>} />
        <Route path="/centeradmin/coachfeedback" element={<CenterCoachFeedback/>} />



        </Routes>
      </Router>
    </>
  );
}

export default App;
