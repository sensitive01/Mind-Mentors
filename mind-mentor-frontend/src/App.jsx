import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { StepperProvider } from "./component/completion-status-bar/StepperContext";
import { Provider } from "react-redux";
import { store } from "./store/reducer";

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

import LoginPage from "./department-components/operation-new/dashboard/LoginPage";

import OperationDashboardPage from "./pages/employee/operation-employee/OperationDashboardPage";
import SEnquiryFormPage from "./pages/employee/operation-employee/SEnquiryFormPage";

import ListingEnquiries from "./pages/employee/operation-employee/ListingEnquiries";
import ProspectPage from "./pages/employee/operation-employee/ProspectPage";
import ReferalPage from "./pages/employee/operation-employee/ReferalPage";

import SupportPages from "./pages/employee/operation-employee/SupportPage";
import MessageStusTrackPage from "./pages/employee/operation-employee/MessageStusTrackPage";
import SupportRequest from "./pages/employee/operation-employee/SupportRequest";
import ScheduleClass from "./pages/employee/operation-employee/ScheduleClass";
import LeavesPage from "./pages/employee/operation-employee/LeavesPage";
import EmpAttendance from "./pages/employee/operation-employee/EmpAttendance";

import Profile from "./pages/employee/operation-employee/Profile";
import InvoicePage from "./pages/employee/operation-employee/InvoicePage";
import StudentReport from "./pages/employee/operation-employee/StudentReport";
import CoachFeedback from "./pages/employee/operation-employee/CoachFeedback";
import LeaveFormPage from "./pages/employee/operation-employee/LeaveFormPage";

import TasksLogs from "./pages/employee/operation-employee/Logs";
import MyTaskPage from "./pages/employee/operation-employee/MyTaskPage";
import TaskAssignByMePage from "./pages/employee/operation-employee/TaskAssignByMePage";
import TasksPage from "./pages/employee/operation-employee/TasksPage";
import AssigneTaskPage from "./pages/employee/operation-employee/AssigneTasksPage";
import ShowAllEnquiryLogs from "./pages/employee/operation-employee/ShowAllEnquiryLogs";
import DemoClassShedulePage from "./pages/employee/operation-employee/DemoClassShedulePage";
import AssignDemoClassPage from "./pages/employee/operation-employee/AssignDemoClassPage";

// import CenterOperationDashboardPage from "./pages/centeradmin/CenterOperationDashboardPage;";
// import CenterSEnquiryFormPage from "./pages/centeradmin/CenterSEnquiryFormPage";
// import CenterListingEnquiries from "./pages/centeradmin/CenterListingEnquiries";
// import CenterMyTaskPage from "./pages/centeradmin/CenterMyTaskPage";
// import CenterProspectPage from "./pages/centeradmin/CenterProspectPage";
// import CenterReferalPage from "./pages/centeradmin/CenterReferalPage";
// import CenterTaskAssignByMePage from "./pages/centeradmin/CenterTaskAssignByMePage";
// import CenterAssigneTasksPage from "./pages/centeradmin/CenterAssigneTasksPage";
// import CenterTasksPage from "./pages/centeradmin/CenterTasksPage";
// import CenterSupportPage from "./pages/centeradmin/CenterSupportPage";
// import CenterMessageStusTrackPage from "./pages/centeradmin/CenterMessageStusTrackPage";
// import CenterSupportRequest from "./pages/centeradmin/CenterSupportRequest";
// import CenterScheduleClass from "./pages/centeradmin/CenterScheduleClass";
// import CenterLeavesPage from "./pages/centeradmin/CenterLeavesPage";
// import CenterLeaveFormPage from "./pages/centeradmin/CenterLeaveFormPage";
// import CenterAdminAttendance from "./pages/centeradmin/CenterAdminAttendance";
// import CenterProfile from "./pages/centeradmin/CenterProfile";
// import CenterInvoicePage from "./pages/centeradmin/CenterInvoicePage";
// import CenterStudentReport from "./pages/centeradmin/CenterStudentReport";
// import CenterCoachFeedback from "./pages/centeradmin/CenterCoachFeedback";
// import CenterLoginPage from "./centeradmin-components/CenterLoginPage";
// import CenterAdminKidsPage from "./pages/centeradmin/CenterAdminKidsPage";

// ...................................................................................................
import ServiceAttendance from "./pages/employee/servicedelivery/ServiceAttendance";

import ServiceAttendanceReport from "./pages/employee/servicedelivery/ServiceAttendanceReport";
import ServiceDashboard from "./pages/employee/servicedelivery/ServiceDashboard";
import ServiceFeedback from "./pages/employee/servicedelivery/ServiceFeedback";
import ServiceInvoice from "./pages/employee/servicedelivery/ServiceInvoice";
import ServiceKids from "./pages/employee/servicedelivery/ServiceKids";
import ServiceLeaves from "./pages/employee/servicedelivery/ServiceLeaves";
import ServiceLeavesAdd from "./pages/employee/servicedelivery/ServiceLeavesAdd";
import ServiceMessageStusTrackPage from "./pages/employee/servicedelivery/ServiceMessageStusTrackPage";
import ServiceMyAssignTasks from "./pages/employee/servicedelivery/ServiceMyAssignTasks";
import ServiceMyAssignTasksTable from "./pages/employee/servicedelivery/ServiceMyAssignTasksTable";
import ServiceMyTasks from "./pages/employee/servicedelivery/ServiceMyTasks";
import ServiceProfile from "./pages/employee/servicedelivery/ServiceProfile";
import ServicePrograms from "./pages/employee/servicedelivery/ServicePrograms";
import ServiceScheduleClass from "./pages/employee/servicedelivery/ServiceScheduleClass";
import ServiceSupport from "./pages/employee/servicedelivery/ServiceSupport";
import ServiceSupportRequest from "./pages/employee/servicedelivery/ServiceSupportRequest";
// import ServiceLogin from "./servicedelivery/components/LoginPage";
import ServiceTaskLogs from "./pages/employee/servicedelivery/Logs";
import ServiceDelivaryClassShedulePage from "./pages/employee/servicedelivery/ServiceDelivaryClassShedulePage";
import CoachAvailabilityFormPage from "./pages/employee/servicedelivery/CoachAvailabilityFormPage";
import CoachAvailabilityTablePage from "./pages/employee/servicedelivery/CoachAvailabilityTablePage";
import AssignClassToKid from "./pages/employee/servicedelivery/AssignClassToKid";

// ...........................................................................................................

// import RenewalAttendance from './pages/renewalassociate/RenewalAttendance';
// import RenewalAttendanceReport from "./pages/renewalassociate/RenewalAttendanceReport";
// import RenewalDashboard from "./pages/renewalassociate/RenewalDashboard";
// import RenewalFeedback from "./pages/renewalassociate/RenewalFeedback";
// import RenewalInvoice from "./pages/renewalassociate/RenewalInvoice";
// import RenewalKids from "./pages/renewalassociate/RenewalKids";
// import RenewalLeaves from "./pages/renewalassociate/RenewalLeaves";
// import RenewalLeavesAdd from "./pages/renewalassociate/RenewalLeavesAdd";
// import RenewalMessageStusTrackPage from "./pages/renewalassociate/RenewalMessageStusTrackPage";
// import RenewalMyAssignTasks from "./pages/renewalassociate/RenewalMyAssignTasks";
// import RenewalMyAssignTasksTable from "./pages/renewalassociate/RenewalMyAssignTasksTable";
// import RenewalMyTasks from "./pages/renewalassociate/RenewalMyTasks";
// import RenewalParents from './pages/renewalassociate/RenewalParents';
// import RenewalProfile from "./pages/renewalassociate/RenewalProfile";
// import RenewalPrograms from "./pages/renewalassociate/RenewalPrograms";
// import RenewalReferal from "./pages/renewalassociate/RenewalReferal";
// import RenewalRenewal from './pages/renewalassociate/RenewalRenewal';
// import RenewalScheduleClass from "./pages/renewalassociate/RenewalScheduleClass";
// import RenewalSupport from "./pages/renewalassociate/RenewalSupport";
// import RenewalSupportRequest from "./pages/renewalassociate/RenewalSupportRequest";
// import RenewalLogin from "./renewalassociate/components/LoginPage";

// import CoachLogin from "./coach/components/LoginPage";
import CoachAttendance from './pages/employee/coach/CoachAttendance';
import CoachAttendanceReport from "./pages/employee/coach/CoachAttendanceReport";
import CoachDashboard from "./pages/employee/coach/CoachDashboard";
// import CoachFeedback from "./pages/coach/CoachFeedback";
import CoachFeedbackAdd from "./pages/employee/coach/CoachFeedbackAdd";
import CoachInvoice from "./pages/employee/coach/CoachInvoice";
import CoachLeaves from "./pages/employee/coach/CoachLeaves";
import CoachLeavesAdd from "./pages/employee/coach/CoachLeavesAdd";
import CoachMyAssignTasks from "./pages/employee/coach/CoachMyAssignTasks";
import CoachMyAssignTasksTable from "./pages/employee/coach/CoachMyAssignTasksTable";
import CoachMyTasks from "./pages/employee/coach/CoachMyTasks";
import CoachProfile from "./pages/employee/coach/CoachProfile";
import CoachScheduleClass from "./pages/employee/coach/CoachScheduleClass";
import CoachSupport from "./pages/employee/coach/CoachSupport";
import CoachSupportRequest from "./pages/employee/coach/CoachSupportRequest";
import CoachAvailabilityPage from "./pages/employee/coach/CoachAvailabilityPage";
import CoachAddAttandaceFeedBack from "./pages/employee/coach/CoachAddAttandaceFeedBack";
import CoachTaskLogs from "./pages/employee/coach/CoachTaskLogs";





// import MarketingAttendance from './pages/marketing/MarketingAttendance';
// import MarketingAttendanceReport from "./pages/marketing/MarketingAttendanceReport";
// import MarketingDashboard from "./pages/marketing/MarketingDashboard";
// import MarketingFeedback from "./pages/marketing/MarketingFeedback";
// // import MarketingInvoice from "./pages/marketing/MarketingInvoice";
// import MarketingLeaves from "./pages/marketing/MarketingLeaves";
// import MarketingLeavesAdd from "./pages/marketing/MarketingLeavesAdd";
// import MarketingProfile from "./pages/marketing/MarketingProfile";
// import MarketingSupport from "./pages/marketing/MarketingSupport";
// import MarketingSupportRequest from "./pages/marketing/MarketingSupportRequest";

// import MarketingLogin from "./marketing/components/LoginPage";
// import MarketingEnquiry from "./pages/marketing/MarketingEnquiry";

// import AllowDeductForm from "./pages/superadmin/AllowDeductForm";
// import AllowDeductTable from "./pages/superadmin/AllowDeductTable";
// import ChessKid from "./pages/superadmin/ChessKid";
// import SuperadminDashboard from "./pages/superadmin/SuperadminDashboard";
// import DocumentsForm from "./pages/superadmin/DocumentsForm";
// import DocumentsTable from "./pages/superadmin/DocumentsTable";
// import EmployeeForm from "./pages/superadmin/EmployeeForm";
// import EmployeeTable from "./pages/superadmin/EmployeeTable";
// import ExpenseForm from "./pages/superadmin/ExpenseForm";
// import ExpensesTable from "./pages/superadmin/Expenses";
// import HolidayTable from "./pages/superadmin/Holiday";
// import HolidayForm from "./pages/superadmin/HolidayForm";
// import NotificationForm from "./pages/superadmin/NotificationForm";
// import NotificationTable from "./pages/superadmin/NotificationTable";
// import SuperadminParents from "./pages/superadmin/SuperadminParents";
// import Participents from "./pages/superadmin/Participents";
// import Payroll from "./pages/superadmin/Payroll";
// import SuperadminAttendanceReport from "./pages/superadmin/SuperadminAttendanceReport";
// import SuperadminFeedback from "./pages/superadmin/SuperadminFeedback";
// import SuperadminInvoice from "./pages/superadmin/SuperadminInvoice";
// import SuperadminKids from "./pages/superadmin/SuperadminKids";
// import SuperadminLeaves from "./pages/superadmin/SuperadminLeaves";
// import SuperadminLeavesAdd from "./pages/superadmin/SuperadminLeavesAdd";
// import SuperadminLogin from "./superadmin/components/LoginPage";
// import SuperadminMessageStusTrackPage from "./pages/superadmin/SuperadminMessageStusTrackPage";
// import SuperadminMyAssignTasks from "./pages/superadmin/SuperadminMyAssignTasks";
// import SuperadminMyAssignTasksTable from "./pages/superadmin/SuperadminMyAssignTasksTable";
// import SuperadminMyTasks from "./pages/superadmin/SuperadminMyTasks";
// import SuperadminProfile from "./pages/superadmin/SuperadminProfile";
// import SuperadminPrograms from "./pages/superadmin/SuperadminPrograms";
// import SuperadminReferral from "./pages/superadmin/SuperadminReferal";
// import SuperadminRenewal from "./pages/superadmin/SuperadminRenewal";
// import SuperadminScheduleClass from "./pages/superadmin/SuperadminScheduleClass";
// import SuperadminSupport from "./pages/superadmin/SuperadminSupport";
// import SuperadminSupportRequest from "./pages/superadmin/SuperadminSupportRequest";
// import TournamentsForm from "./pages/superadmin/Tournaments";
// import TournamnetsTable from "./pages/superadmin/TournamnetsTable";
// import TransactionForm from "./pages/superadmin/TransactionForm";
// import TransactionTable from "./pages/superadmin/TransactionTable";
// import UserForm from "./pages/superadmin/UserForm";
// import UsersTable from "./pages/superadmin/UsersTable";
// import SuperadminAttendance from "./pages/superadmin/SuperadminAttendance";
// import SuperadminEnquiries from "./pages/superadmin/ListingEnquiries";
// import MarketingCompleteLogs from "./pages/marketing/MarketingCompleteLogs";
// import CenterAdminEnquiryLogs from "./pages/centeradmin/CenterAdminEnquiryLogs";
// import SuperAdminEnquiryLogs from "./pages/superadmin/SuperAdminEnquiryLogs";
// import KidsDemoClassPage from "./pages/kids/KidsDemoClassPage";
// import KidsClassShedulePage from "./pages/kids/KidsClassShedulePage";
// import KidsGamesListPage from "./pages/kids/KidsGamesListPage";
// import KidsAchievementsPage from "./pages/kids/KidsAchievementsPage";
// import KidsJourneyPage from "./pages/kids/KidsJourneyPage";
// import AddKidAvailabilityPage from "./pages/parent/AddKidAvailabilityPage";
// import RenewalTaskLogs from "./pages/renewalassociate/RenewalTaskLogs";
// import CenterAdminTaskLogs from "./pages/centeradmin/CenterAdminTaskLogs";
// import SuperAdminTaskAllLogs from "./pages/superadmin/SuperAdminTaskAllLogs";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Parent Routes */}
          <Route path="/parent/login" element={<ParentLogin />} />
          <Route path="/parent/enter-otp" element={<ParentOtpPage />} />

          <Route path="/parent/registration"
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
          <Route path="/parent/kid/attendance/:id" element={<AttendancePage />} />
          <Route path="/parent/kid/demo-class/:id" element={<ParentDemoClassPage />}/>
          <Route path="/parent/kid/demo-class-shedule/:id" element={<ParentReqNewDemoClass />} />
          <Route path="/parent/kid/manage-login/:id" element={<ParentManageChildLoginPage />}/>
          <Route path="/parent/profile/manage" element={<ParentProfilePage />} />
          <Route path="/parent/certificate" element={<CertificatePage />} />
          <Route path="/parent/kid/classShedule/:id" element={<KidsPage />} />
          <Route path="/parent/new-referal" element={<ParentReferalPage />} />
          <Route path="/parent/support" element={<SupportPage />} />
          <Route path="/parent/walkthrough-video"  element={<WalkThroughPage />} />
          {/* <Route path="/parent/add-kid-availability/:kidId" element={<AddKidAvailabilityPage />} /> */}

          <Route path="/kids/login" element={<KidsLoginPage />} />
          <Route path="/kid/otp" element={<KidsPinPage />} />
          <Route path="/kids/dashboard" element={<KidsDashboard />} />
          {/* <Route path="/kids/demo-class" element={<KidsDemoClassPage />} />
          <Route path="/kids/class-schedule" element={<KidsClassShedulePage />} />
          <Route path="/kids/game-list" element={<KidsGamesListPage />} />
          <Route path="/kids/achievements-list" element={<KidsAchievementsPage />} />
          <Route path="/kids/travel-journey" element={<KidsJourneyPage />} /> */}

          <Route path="/fee-details" element={<FeeDetailsPage />} />
          <Route path="/class-schedule" element={<ClassShedulePage />} />


          <Route path="/employee-login" element={<LoginPage />} />
          <Route path="/employee-operation-dashboard"  element={<OperationDashboardPage />} />
          <Route path="/employee-operation-enquiry-form" element={<SEnquiryFormPage />}/>
          <Route path="/employee-operation-enquiry-list" element={<ListingEnquiries />} />
          <Route path="/employee-operation/prospects"  element={<ProspectPage />} />
          <Route path="/employee-operation/attendance" element={<EmpAttendance />}/>
          <Route path="/employee-operation/leaves" element={<LeavesPage />} />
          <Route path="/employee-operation/leaves/add" element={<LeaveFormPage />} />
          <Route path="/employee-operation-tasks/tasks"  element={<TasksPage />} />
          <Route path="/employee-operation-tasks/assignedtasks" element={<AssigneTaskPage />} />
          <Route path="/employee-operation/taskslogs/:id" element={<TasksLogs />}/>
          <Route path="/employee-operation-tasks/assigntask" element={<TaskAssignByMePage />} />
          <Route path="/showCompleteLogs/:id"  element={<ShowAllEnquiryLogs />}/>
          <Route path="/employee-operation/schedule"  element={<ScheduleClass />}/>
          <Route path="/employee-operation/studentreport"  element={<StudentReport />}  />
          <Route path="/employee-operation/invoice" element={<InvoicePage />} />
          <Route path="/employee-operation/coachfeedback"  element={<CoachFeedback />} />
          <Route path="/employeeAssignDemoClass/:id"  element={<AssignDemoClassPage />} />
          <Route path="/employee-operation-tasks/supports" element={<SupportRequest />} />
          <Route path="/employee-operation-tasks/support/add" element={<SupportPages />}  />
          <Route path="/employee-operation-tasks/supportTrack"  element={<MessageStusTrackPage />}  />
          <Route path="/employee-operation-tasks/add" element={<MyTaskPage />}  />
          <Route path="/employee-operation/referal" element={<ReferalPage />} />
          <Route path="/employee-operation/taskslogs/:id"  element={<TasksLogs />}/>
          <Route path="/employee-operation/profile" element={<Profile />} />
          <Route path="/employee-operation/demoSheduleForm"   element={<DemoClassShedulePage />}  />


          <Route path="/serviceProfile" element={<ServiceProfile />} />
          <Route path="/serviceAttendance" element={<ServiceAttendance />} />
          <Route path="/serviceLeaves" element={<ServiceLeaves />} />
          <Route path="/serviceLeaves/add" element={<ServiceLeavesAdd />} />
          <Route path="/serviceInvoice" element={<ServiceInvoice />} />
          <Route path="/serviceFeedback" element={<ServiceFeedback />} />
          <Route path="/serviceAttendanceReport" element={<ServiceAttendanceReport />} />
          <Route path="/serviceMyTasks/assigntask" element={<ServiceMyAssignTasks />}  />
          <Route path="/serviceMyTasks" element={<ServiceMyTasks />} />
          <Route path="/serviceAssignedTasks/"  element={<ServiceMyAssignTasksTable />} />
          <Route path="/serviceScheduleClass/"  element={<ServiceScheduleClass />}/>
          <Route path="/serviceSupport/add" element={<ServiceSupport />} />
          <Route path="/serviceSupport/" element={<ServiceSupportRequest />} />
          <Route path="/serviceMessageStatus/"  element={<ServiceMessageStusTrackPage />}/>
          <Route path="/servicekids" element={<ServiceKids />} />
          <Route path="/servicePrograms" element={<ServicePrograms />} />
          <Route path="/serviceDashboard" element={<ServiceDashboard />} />
          <Route path="/serviceClassShedule"  element={<ServiceDelivaryClassShedulePage />} />
          <Route path="/coachAvailabilityForm"  element={<CoachAvailabilityFormPage />} />
          <Route path="/coachAvailabilityTable"  element={<CoachAvailabilityTablePage />}  />
          <Route path="/serviceAssignClassToKid/:id" element={<AssignClassToKid />}/>
          <Route path="/service-delivary/taskslogs/:id"  element={<ServiceTaskLogs />}/>

          {/* <Route path="/serviceLogin" element={<ServiceLogin />} /> */}

          {/* <Route path="/renewalDashboard" element={<RenewalDashboard />} />
        <Route path="/renewalProfile" element={<RenewalProfile />} />
        <Route path="/renewalAttendance" element={<RenewalAttendance />} />
        <Route path="/renewalLeaves" element={<RenewalLeaves />} />
        <Route path="/renewalLeaves/add" element={<RenewalLeavesAdd />} />
        <Route path="/renewalInvoices" element={<RenewalInvoice />} />
        <Route path="/renewalFeedback" element={<RenewalFeedback />} />
        <Route path="/renewalAttendanceReport" element={<RenewalAttendanceReport />} />
        <Route path="/renewalMyTasks/assigntask" element={<RenewalMyAssignTasks />} />
        <Route path="/renewalMyTasks" element={<RenewalMyTasks />} />
        <Route path="/renewalAssignedTasks/" element={<RenewalMyAssignTasksTable />} />
        <Route path="/renewalScheduleClass/" element={<RenewalScheduleClass />} />
        <Route path="/renewalSupport/add" element={<RenewalSupport />} />
        <Route path="/renewalSupport/" element={<RenewalSupportRequest />} />
        <Route path="/renewalMessageStatus/" element={<RenewalMessageStusTrackPage />} />
        <Route path="/renewalKids" element={<RenewalKids />} />
        <Route path="/renewalPrograms" element={<RenewalPrograms />} />
        <Route path="/renewalParents" element={<RenewalParents />} />
        <Route path="/renewalRenewals" element={<RenewalRenewal />} />
        <Route path="/renewalLogin" element={<RenewalLogin />} />
        <Route path="/renewal-associate/taskslogs/:id" element={<RenewalTaskLogs />} /> */}
          {/* <Route path="/renewalReferrals" element={<RenewalReferal />} /> */}

        

        <Route path="/coachDashboard" element={<CoachDashboard />} />
        <Route path="/coachProfile" element={<CoachProfile />} />
        <Route path="/coachAttendance" element={<CoachAttendance />} />
        <Route path="/coachLeaves" element={<CoachLeaves />} />
        <Route path="/coachLeaves/add" element={<CoachLeavesAdd />} />
        <Route path="/coachInvoices" element={<CoachInvoice />} />
        <Route path="/coachFeedback" element={<CoachFeedback />} />
        <Route path="/coachAttendanceReport" element={<CoachAttendanceReport />} />
        <Route path="/coachMyTasks/assigntask" element={<CoachMyAssignTasks />} />
        <Route path="/coachMyTasks" element={<CoachMyTasks />} />
        <Route path="/coachAssignedTasks/" element={<CoachMyAssignTasksTable />} />
        <Route path="/coachScheduleClass/" element={<CoachScheduleClass />} />
        <Route path="/coachSupport/add" element={<CoachSupport />} />
        <Route path="/coachSupport/" element={<CoachSupportRequest />} />
        <Route path="/coachFeedaback/add" element={<CoachFeedbackAdd />} />
        {/* <Route path="/coachLogin" element={<CoachLogin />} /> */}
        <Route path="/coachAvailability" element={<CoachAvailabilityPage />} />
        {/* <Route path="/coachAvailability" element={<CoachAvailabilityPage />} /> */}
        <Route path="/coachAttandanceFeedback/:classId" element={<CoachAddAttandaceFeedBack />} />
        <Route path="/coach/taskslogs/:id" element={<CoachTaskLogs />} /> 

          {/* 
        <Route path="/marketingDashboard" element={<MarketingDashboard />} />
        <Route path="/marketingProfile" element={<MarketingProfile />} />
        <Route path="/marketingAttendance" element={<MarketingAttendance />} />
        <Route path="/marketingLeaves" element={<MarketingLeaves />} />
        <Route path="/marketingLeaves/add" element={<MarketingLeavesAdd />} />
        <Route path="/marketingEnquiries" element={<MarketingEnquiry />} />
        <Route path="/marketingFeedback" element={<MarketingFeedback />} />
        <Route path="/marketingAttendanceReport" element={<MarketingAttendanceReport />} />
        <Route path="/marketingSupport/add" element={<MarketingSupport />} />
        <Route path="/marketingSupport/" element={<MarketingSupportRequest />} />
        <Route path="/marketingLogin" element={<MarketingLogin />} />
        <Route path="/showCompleteLogsMarketing/:id" element={< MarketingCompleteLogs/>} /> */}
          {/* <Route path="/marketingScheduleClass/" element={<MarketingScheduleClass />} /> */}

          {/*         
        <Route path="/centeradmin-login" element={<CenterLoginPage />} />
        <Route path="/centeradmin-dashboard" element={<CenterOperationDashboardPage />} />
        <Route path="/centeradmin-enquiry-form" element={<CenterSEnquiryFormPage />} /> 
        <Route path="/centeradmin-enquiry-list" element={<CenterListingEnquiries/>} />
        <Route path="/centeradmin-tasks/add" element={<CenterMyTaskPage/>} />
        <Route path="/centeradmin/prospects" element={<CenterProspectPage/>} />
        <Route path="/centeradmin/referal" element={<CenterReferalPage/>} />
        <Route path="/centeradmin-tasks/assigntask" element={<CenterTaskAssignByMePage/>} />
        <Route path="/centeradmin-tasks/assignedtasks" element={<CenterAssigneTasksPage/>} />
        <Route path="/centeradmin-kids" element={<CenterAdminKidsPage/>} />
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
        <Route path="/showCompleteLogsCenterAdmin/:id" element={<CenterAdminEnquiryLogs/>} />
        <Route path="/centeradmin/taskslogs/:id" element={<CenterAdminTaskLogs />} /> */}

          {/* 
        <Route path="/superadminDashboard" element={<SuperadminDashboard />} />
        <Route path="/superadminProfile" element={<SuperadminProfile />} />
        <Route path="/superadminAttendance" element={<SuperadminAttendance />} />
        <Route path="/superadminLeaves" element={<SuperadminLeaves />} />
        <Route path="/superadminLeaves/add" element={<SuperadminLeavesAdd />} />
        <Route path="/superadminInvoices" element={<SuperadminInvoice />} />
        <Route path="/superadminFeedback" element={<SuperadminFeedback />} />
        <Route path="/superadminAttendanceReport" element={<SuperadminAttendanceReport />} />
        <Route path="/superadminMyTasks/assigntask" element={<SuperadminMyAssignTasks />} />
        <Route path="/superadminMyTasks" element={<SuperadminMyTasks />} />
        <Route path="/superadminAssignedTasks/" element={<SuperadminMyAssignTasksTable />} />
        <Route path="/superadminScheduleClass/" element={<SuperadminScheduleClass />} />
        <Route path="/superadminSupport/add" element={<SuperadminSupport />} />
        <Route path="/superadminSupport/" element={<SuperadminSupportRequest />} />
        <Route path="/superadminMessageStatus/" element={<SuperadminMessageStusTrackPage />} />
        <Route path="/superadminKids" element={<SuperadminKids />} />
        <Route path="/superadminEnquiries" element={<SuperadminEnquiries />} />

        <Route path="/superadminPrograms" element={<SuperadminPrograms />} />
        <Route path="/superadminParents" element={<SuperadminParents />} />
        <Route path="/superadminRenewals" element={<SuperadminRenewal />} />
        <Route path="/superadminLogin" element={<SuperadminLogin />} />
        <Route path="/notifications/add" element={<NotificationForm />} />
        <Route path="/notifications" element={<NotificationTable />} />
        <Route path="/employee/add" element={<EmployeeForm />} />
        <Route path="/employees/" element={<EmployeeTable />} />
        <Route path="/allowdeduct/add" element={<AllowDeductForm />} />
        <Route path="/allowdeduct/" element={< AllowDeductTable />} />
        <Route path="/payroll/" element={< Payroll />} />
        <Route path="/transactions/" element={<TransactionTable />} />
        <Route path="/expenses/" element={< ExpensesTable />} />
        <Route path="/holiday/" element={< HolidayTable />} />
        <Route path="/holiday/add" element={<HolidayForm />} />
        <Route path="/expenses/add" element={< ExpenseForm />} />
        <Route path="/transactions/add" element={< TransactionForm />} />
        <Route path="/tournaments/" element={< TournamnetsTable />} />
        <Route path="/documents/add" element={< DocumentsForm />} />
        <Route path="/documents/" element={< DocumentsTable />} />
        <Route path="/tournaments/add" element={< TournamentsForm />} />
        <Route path="/users/add" element={< UserForm />} />
        <Route path="/users/" element={< UsersTable />} />
        <Route path="/participents/" element={< Participents />} />
        <Route path="/chessKids/" element={< ChessKid />} />
        <Route path="/showCompleteLogsAdmin/:id" element={<SuperAdminEnquiryLogs/>} />
        <Route path="/superadmin/taskslogs/:id" element={<SuperAdminTaskAllLogs />} /> */}
          {/* <Route path="/superadminReferrals" element={<SuperadminReferral />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
