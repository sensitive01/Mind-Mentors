import React, { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { StepperProvider } from "./component/completion-status-bar/StepperContext";
import "./index.css";
import { store } from "./store/reducer";
import SuperAdminLayout from "./superadmin/Layout/Layout";
// Parent login part (lazy-loaded)
const KidsRegistration = React.lazy(() => import("./component/parent-component/KidsRegistration"));
const ParentKidsRegistration = React.lazy(() => import("./component/parent-component/ParentKidsRegistarion"));
const ParentLogin = React.lazy(() => import("./component/parent-component/ParentLogin"));
const ParentOtpPage = React.lazy(() => import("./component/parent-component/ParentOtpPage"));
const ParentRegistration = React.lazy(() => import("./component/parent-component/ParentRegistartion"));

// Parent dashboard part (lazy-loaded)
const CenterLoginPage = React.lazy(() => import("./centeradmin-components/CenterLoginPage"));
const KidsLoginPage = React.lazy(() => import("./component/kids-component/kids-login/KidsLoginPage"));
const KidsPinPage = React.lazy(() => import("./component/kids-component/kids-login/KidsPinPage"));
const AddKid = React.lazy(() => import("./components/parent/AddKid"));
const LoginPage = React.lazy(() => import("./employee-component/operation-new/dashboard/LoginPage"));
const HomePage = React.lazy(() => import("./landingPage/HomePage"));
const AttendancePage = React.lazy(() => import("./pages/AttandancePage"));
const CenterAdminAttendance = React.lazy(() => import("./pages/centeradmin/CenterAdminAttendance"));
const CenterAdminKidsPage = React.lazy(() => import("./pages/centeradmin/CenterAdminKidsPage"));
const CenterAssigneTasksPage = React.lazy(() => import("./pages/centeradmin/CenterAssigneTasksPage"));
const CenterCoachFeedback = React.lazy(() => import("./pages/centeradmin/CenterCoachFeedback"));
const CenterInvoicePage = React.lazy(() => import("./pages/centeradmin/CenterInvoicePage"));
const CenterLeaveFormPage = React.lazy(() => import("./pages/centeradmin/CenterLeaveFormPage"));
const CenterLeavesPage = React.lazy(() => import("./pages/centeradmin/CenterLeavesPage"));
const CenterListingEnquiries = React.lazy(() => import("./pages/centeradmin/CenterListingEnquiries"));
const CenterMessageStusTrackPage = React.lazy(() => import("./pages/centeradmin/CenterMessageStusTrackPage"));
const CenterMyTaskPage = React.lazy(() => import("./pages/centeradmin/CenterMyTaskPage"));
const CenterOperationDashboardPage = React.lazy(() => import("./pages/centeradmin/CenterOperationDashboardPage;"));
const CenterProfile = React.lazy(() => import("./pages/centeradmin/CenterProfile"));
const CenterProspectPage = React.lazy(() => import("./pages/centeradmin/CenterProspectPage"));
const CenterReferalPage = React.lazy(() => import("./pages/centeradmin/CenterReferalPage"));
const CenterScheduleClass = React.lazy(() => import("./pages/centeradmin/CenterScheduleClass"));
const CenterSEnquiryFormPage = React.lazy(() => import("./pages/centeradmin/CenterSEnquiryFormPage"));
const CenterStudentReport = React.lazy(() => import("./pages/centeradmin/CenterStudentReport"));
const CenterSupportPage = React.lazy(() => import("./pages/centeradmin/CenterSupportPage"));
const CenterSupportRequest = React.lazy(() => import("./pages/centeradmin/CenterSupportRequest"));
const CenterTaskAssignByMePage = React.lazy(() => import("./pages/centeradmin/CenterTaskAssignByMePage"));
const CenterTasksPage = React.lazy(() => import("./pages/centeradmin/CenterTasksPage"));
const ClassShedulePage = React.lazy(() => import("./pages/ClassShedulePage"));
const AssigneTaskPage = React.lazy(() => import("./pages/employee/operation-employee/AssigneTasksPage"));
const CoachFeedback = React.lazy(() => import("./pages/employee/operation-employee/CoachFeedback"));
const EmpAttendance = React.lazy(() => import("./pages/employee/operation-employee/EmpAttendance"));
const InvoicePage = React.lazy(() => import("./pages/employee/operation-employee/InvoicePage"));
const LeaveFormPage = React.lazy(() => import("./pages/employee/operation-employee/LeaveFormPage"));
const LeavesPage = React.lazy(() => import("./pages/employee/operation-employee/LeavesPage"));
const ListingEnquiries = React.lazy(() => import("./pages/employee/operation-employee/ListingEnquiries"));
const MessageStusTrackPage = React.lazy(() => import("./pages/employee/operation-employee/MessageStusTrackPage"));
const MyTaskPage = React.lazy(() => import("./pages/employee/operation-employee/MyTaskPage"));
const OperationDashboardPage = React.lazy(() => import("./pages/employee/operation-employee/OperationDashboardPage"));
const Profile = React.lazy(() => import("./pages/employee/operation-employee/Profile"));
const ProspectPage = React.lazy(() => import("./pages/employee/operation-employee/ProspectPage"));
const ReferalPage = React.lazy(() => import("./pages/employee/operation-employee/ReferalPage"));
const ScheduleClass = React.lazy(() => import("./pages/employee/operation-employee/ScheduleClass"));
const SEnquiryFormPage = React.lazy(() => import("./pages/employee/operation-employee/SEnquiryFormPage"));
const StudentReport = React.lazy(() => import("./pages/employee/operation-employee/StudentReport"));
const SupportPages = React.lazy(() => import("./pages/employee/operation-employee/SupportPage"));
const SupportRequest = React.lazy(() => import("./pages/employee/operation-employee/SupportRequest"));
const TaskAssignByMePage = React.lazy(() => import("./pages/employee/operation-employee/TaskAssignByMePage"));
const TasksPage = React.lazy(() => import("./pages/employee/operation-employee/TasksPage"));
const FeeDetailsPage = React.lazy(() => import("./pages/FeeDetailsPage"));
const KidsDashboard = React.lazy(() => import("./pages/kids/KidsDashboard"));
const CertificatePage = React.lazy(() => import("./pages/parent/CertificatePage"));
const DashboardPage = React.lazy(() => import("./pages/parent/DashboardPage"));
const KidsPage = React.lazy(() => import("./pages/parent/KidsPage"));
const ParentDemoClassPage = React.lazy(() => import("./pages/parent/ParentDemoClassPage"));
const ParentKidsDetailsPage = React.lazy(() => import("./pages/parent/ParentKidsListPage"));
const ParentProfilePage = React.lazy(() => import("./pages/parent/ParentProfilePage"));
const ParentReferalPage = React.lazy(() => import("./pages/parent/ParentReferalPage"));
const ParentReqNewDemoClass = React.lazy(() => import("./pages/parent/ParentReqNewDemoClass"));
const SupportPage = React.lazy(() => import("./pages/parent/SupportPage"));
const WalkThroughPage = React.lazy(() => import("./pages/parent/WalkThroughPage"));
const ParentManageChildLoginPage = React.lazy(() => import("./pages/ParentManageChildLoginPage"));

// Service Delivery part (lazy-loaded)
const ServiceAttendance = React.lazy(() => import('./pages/servicedelivery/ServiceAttendance'));
const ServiceAttendanceReport = React.lazy(() => import("./pages/servicedelivery/ServiceAttendanceReport"));
const ServiceDashboard = React.lazy(() => import("./pages/servicedelivery/ServiceDashboard"));
const ServiceFeedback = React.lazy(() => import("./pages/servicedelivery/ServiceFeedback"));
const ServiceInvoice = React.lazy(() => import("./pages/servicedelivery/ServiceInvoice"));
const ServiceKids = React.lazy(() => import("./pages/servicedelivery/ServiceKids"));
const ServiceLeaves = React.lazy(() => import("./pages/servicedelivery/ServiceLeaves"));
const ServiceLeavesAdd = React.lazy(() => import("./pages/servicedelivery/ServiceLeavesAdd"));
const ServiceMessageStusTrackPage = React.lazy(() => import("./pages/servicedelivery/ServiceMessageStusTrackPage"));
const ServiceMyAssignTasks = React.lazy(() => import("./pages/servicedelivery/ServiceMyAssignTasks"));
const ServiceMyAssignTasksTable = React.lazy(() => import("./pages/servicedelivery/ServiceMyAssignTasksTable"));
const ServiceMyTasks = React.lazy(() => import("./pages/servicedelivery/ServiceMyTasks"));
const ServiceProfile = React.lazy(() => import("./pages/servicedelivery/ServiceProfile"));
const ServicePrograms = React.lazy(() => import("./pages/servicedelivery/ServicePrograms"));
const ServiceScheduleClass = React.lazy(() => import("./pages/servicedelivery/ServiceScheduleClass"));
const ServiceSupport = React.lazy(() => import("./pages/servicedelivery/ServiceSupport"));
const ServiceSupportRequest = React.lazy(() => import("./pages/servicedelivery/ServiceSupportRequest"));
const ServiceLogin = React.lazy(() => import("./servicedelivery/components/LoginPage"));
// ...........................................................................................................

const CoachLogin = React.lazy(() => import("./coach/components/LoginPage"));
const CoachAttendance = React.lazy(() => import('./pages/coach/CoachAttendance'));
const CoachAttendanceReport = React.lazy(() => import("./pages/coach/CoachAttendanceReport"));
const CoachDashboard = React.lazy(() => import("./pages/coach/CoachDashboard"));
const RenewalAttendance = React.lazy(() => import('./pages/renewalassociate/RenewalAttendance'));
const RenewalAttendanceReport = React.lazy(() => import("./pages/renewalassociate/RenewalAttendanceReport"));
const RenewalDashboard = React.lazy(() => import("./pages/renewalassociate/RenewalDashboard"));
const RenewalFeedback = React.lazy(() => import("./pages/renewalassociate/RenewalFeedback"));
const RenewalInvoice = React.lazy(() => import("./pages/renewalassociate/RenewalInvoice"));
const RenewalKids = React.lazy(() => import("./pages/renewalassociate/RenewalKids"));
const RenewalLeaves = React.lazy(() => import("./pages/renewalassociate/RenewalLeaves"));
const RenewalLeavesAdd = React.lazy(() => import("./pages/renewalassociate/RenewalLeavesAdd"));
const RenewalMessageStusTrackPage = React.lazy(() => import("./pages/renewalassociate/RenewalMessageStusTrackPage"));
const RenewalMyAssignTasks = React.lazy(() => import("./pages/renewalassociate/RenewalMyAssignTasks"));
const RenewalMyAssignTasksTable = React.lazy(() => import("./pages/renewalassociate/RenewalMyAssignTasksTable"));
const RenewalMyTasks = React.lazy(() => import("./pages/renewalassociate/RenewalMyTasks"));
const RenewalParents = React.lazy(() => import('./pages/renewalassociate/RenewalParents'));
const RenewalProfile = React.lazy(() => import("./pages/renewalassociate/RenewalProfile"));
const RenewalPrograms = React.lazy(() => import("./pages/renewalassociate/RenewalPrograms"));
const RenewalRenewal = React.lazy(() => import('./pages/renewalassociate/RenewalRenewal'));
const RenewalScheduleClass = React.lazy(() => import("./pages/renewalassociate/RenewalScheduleClass"));
const RenewalSupport = React.lazy(() => import("./pages/renewalassociate/RenewalSupport"));
const RenewalSupportRequest = React.lazy(() => import("./pages/renewalassociate/RenewalSupportRequest"));
const RenewalLogin = React.lazy(() => import("./renewalassociate/components/LoginPage"));

const CoachFeedbackAdd = React.lazy(() => import("./pages/coach/CoachFeedbackAdd"));
const CoachInvoice = React.lazy(() => import("./pages/coach/CoachInvoice"));
const CoachLeaves = React.lazy(() => import("./pages/coach/CoachLeaves"));
const CoachLeavesAdd = React.lazy(() => import("./pages/coach/CoachLeavesAdd"));
const CoachMyAssignTasks = React.lazy(() => import("./pages/coach/CoachMyAssignTasks"));
const CoachMyAssignTasksTable = React.lazy(() => import("./pages/coach/CoachMyAssignTasksTable"));
const CoachMyTasks = React.lazy(() => import("./pages/coach/CoachMyTasks"));
const CoachProfile = React.lazy(() => import("./pages/coach/CoachProfile"));
const CoachScheduleClass = React.lazy(() => import("./pages/coach/CoachScheduleClass"));
const CoachSupport = React.lazy(() => import("./pages/coach/CoachSupport"));
const CoachSupportRequest = React.lazy(() => import("./pages/coach/CoachSupportRequest"));
const ZohoMeeting = React.lazy(() => import("./pages/coach/ZohoMeeting"));

const MarketingAttendance = React.lazy(() => import('./pages/marketing/MarketingAttendance'));
const MarketingAttendanceReport = React.lazy(() => import("./pages/marketing/MarketingAttendanceReport"));
const MarketingDashboard = React.lazy(() => import("./pages/marketing/MarketingDashboard"));
const MarketingFeedback = React.lazy(() => import("./pages/marketing/MarketingFeedback"));
const MarketingLogin = React.lazy(() => import("./marketing/components/LoginPage"));
const DemoClassShedulePage = React.lazy(() => import("./pages/employee/operation-employee/DemoClassShedulePage"));
const MarketingEnquiry = React.lazy(() => import("./pages/marketing/MarketingEnquiry"));
const MarketingLeaves = React.lazy(() => import("./pages/marketing/MarketingLeaves"));
const MarketingLeavesAdd = React.lazy(() => import("./pages/marketing/MarketingLeavesAdd"));
const MarketingProfile = React.lazy(() => import("./pages/marketing/MarketingProfile"));
const MarketingSupport = React.lazy(() => import("./pages/marketing/MarketingSupport"));
const MarketingSupportRequest = React.lazy(() => import("./pages/marketing/MarketingSupportRequest"));

{/*----------------------------------Super Admin Sections Pages---------------------------------------------------------------------- */ }
const AllowDeductForm = React.lazy(() => import("./pages/superadmin/AllowDeductForm"));
const AllowDeductTable = React.lazy(() => import("./pages/superadmin/AllowDeductTable"));
const ChessKid = React.lazy(() => import("./pages/superadmin/ChessKid"));
const DocumentsForm = React.lazy(() => import("./pages/superadmin/DocumentsForm"));
const DocumentsTable = React.lazy(() => import("./pages/superadmin/DocumentsTable"));
const EmployeeForm = React.lazy(() => import("./pages/superadmin/EmployeeForm"));
const EmployeeTable = React.lazy(() => import("./pages/superadmin/EmployeeTable"));
const ExpenseForm = React.lazy(() => import("./pages/superadmin/ExpenseForm"));
const ExpensesTable = React.lazy(() => import("./pages/superadmin/Expenses"));
const HolidayTable = React.lazy(() => import("./pages/superadmin/Holiday"));
const HolidayForm = React.lazy(() => import("./pages/superadmin/HolidayForm"));
const SuperadminEnquiries = React.lazy(() => import("./pages/superadmin/ListingEnquiries"));
const NotificationForm = React.lazy(() => import("./pages/superadmin/NotificationForm"));
const NotificationTable = React.lazy(() => import("./pages/superadmin/NotificationTable"));
const Participents = React.lazy(() => import("./pages/superadmin/Participents"));
const Payroll = React.lazy(() => import("./pages/superadmin/Payroll"));
const SuperadminAttendance = React.lazy(() => import("./pages/superadmin/SuperadminAttendance"));
const SuperadminAttendanceReport = React.lazy(() => import("./pages/superadmin/SuperadminAttendanceReport"));
const SuperadminDashboard = React.lazy(() => import("./pages/superadmin/SuperadminDashboard"));
const SuperadminFeedback = React.lazy(() => import("./pages/superadmin/SuperadminFeedback"));
const SuperadminInvoice = React.lazy(() => import("./pages/superadmin/SuperadminInvoice"));
const SuperadminKids = React.lazy(() => import("./pages/superadmin/SuperadminKids"));
const SuperadminLeaves = React.lazy(() => import("./pages/superadmin/SuperadminLeaves"));
const SuperadminLeavesAdd = React.lazy(() => import("./pages/superadmin/SuperadminLeavesAdd"));
const SuperadminMessageStusTrackPage = React.lazy(() => import("./pages/superadmin/SuperadminMessageStusTrackPage"));
const SuperadminMyAssignTasks = React.lazy(() => import("./pages/superadmin/SuperadminMyAssignTasks"));
const SuperadminMyAssignTasksTable = React.lazy(() => import("./pages/superadmin/SuperadminMyAssignTasksTable"));
const SuperadminMyTasks = React.lazy(() => import("./pages/superadmin/SuperadminMyTasks"));
const SuperadminParents = React.lazy(() => import("./pages/superadmin/SuperadminParents"));
const SuperadminProfile = React.lazy(() => import("./pages/superadmin/SuperadminProfile"));
const SuperadminPrograms = React.lazy(() => import("./pages/superadmin/SuperadminPrograms"));
const SuperadminRenewal = React.lazy(() => import('./pages/superadmin/SuperadminRenewal'));
const SuperadminScheduleClass = React.lazy(() => import("./pages/superadmin/SuperadminScheduleClass"));
const SuperadminSupport = React.lazy(() => import("./pages/superadmin/SuperadminSupport"));
const SuperadminSupportRequest = React.lazy(() => import("./pages/superadmin/SuperadminSupportRequest"));
const TournamentsForm = React.lazy(() => import("./pages/superadmin/Tournaments"));
const TournamnetsTable = React.lazy(() => import("./pages/superadmin/TournamnetsTable"));
const TransactionForm = React.lazy(() => import("./pages/superadmin/TransactionForm"));
const TransactionTable = React.lazy(() => import("./pages/superadmin/TransactionTable"));
const UserForm = React.lazy(() => import("./pages/superadmin/UserForm"));
const UsersTable = React.lazy(() => import("./pages/superadmin/UsersTable"));
const SuperadminLogin = React.lazy(() => import("./superadmin/components/LoginPage"));

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>

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
            <Route path="/parent/kid/attendance/:id" element={<AttendancePage />} />
            <Route path="/parent/kid/demo-class/:id" element={<ParentDemoClassPage />} />
            <Route path="/parent/kid/demo-class-shedule/:id" element={<ParentReqNewDemoClass />} />
            <Route path="/parent/kid/manage-login/:id" element={<ParentManageChildLoginPage />} />
            <Route path="/parent/profile/manage" element={<ParentProfilePage />} />
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
            <Route path="/employee-operation-enquiry-list" element={<ListingEnquiries />} />
            <Route path="/employee-operation-tasks/add" element={<MyTaskPage />} />
            <Route path="/employee-operation/prospects" element={<ProspectPage />} />
            <Route path="/employee-operation/referal" element={<ReferalPage />} />
            <Route path="/employee-operation-tasks/assigntask" element={<TaskAssignByMePage />} />
            <Route path="/employee-operation-tasks/assignedtasks" element={<AssigneTaskPage />} />
            <Route path="/employee-operation-tasks/tasks" element={<TasksPage />} />
            <Route path="/employee-operation-tasks/support/add" element={<SupportPages />} />
            <Route path="/employee-operation-tasks/supportTrack" element={<MessageStusTrackPage />} />
            <Route path="/employee-operation-tasks/supports" element={<SupportRequest />} />
            <Route path="/employee-operation/schedule" element={<ScheduleClass />} />
            <Route path="/employee-operation/leaves" element={<LeavesPage />} />
            <Route path="/employee-operation/leaves/add" element={<LeaveFormPage />} />
            <Route path="/employee-operation/attendance" element={<EmpAttendance />} />
            <Route path="/employee-operation/profile" element={<Profile />} />
            <Route path="/employee-operation/invoice" element={<InvoicePage />} />
            <Route path="/employee-operation/studentreport" element={<StudentReport />} />
            <Route path="/employee-operation/coachfeedback" element={<CoachFeedback />} />
            <Route path="/employee-operation/demoSheduleForm" element={<DemoClassShedulePage />} />
            <Route path="/serviceProfile" element={<ServiceProfile />} />
            <Route path="/serviceAttendance" element={<ServiceAttendance />} />
            <Route path="/serviceLeaves" element={<ServiceLeaves />} />
            <Route path="/serviceLeaves/add" element={<ServiceLeavesAdd />} />
            <Route path="/serviceInvoice" element={<ServiceInvoice />} />
            <Route path="/serviceFeedback" element={<ServiceFeedback />} />
            <Route path="/serviceAttendanceReport" element={<ServiceAttendanceReport />} />
            <Route path="/serviceMyTasks/assigntask" element={<ServiceMyAssignTasks />} />
            <Route path="/serviceMyTasks" element={<ServiceMyTasks />} />
            <Route path="/serviceAssignedTasks/" element={<ServiceMyAssignTasksTable />} />
            <Route path="/serviceScheduleClass/" element={<ServiceScheduleClass />} />
            <Route path="/serviceSupport/add" element={<ServiceSupport />} />
            <Route path="/serviceSupport/" element={<ServiceSupportRequest />} />
            <Route path="/serviceMessageStatus/" element={<ServiceMessageStusTrackPage />} />
            <Route path="/servicekids" element={<ServiceKids />} />
            <Route path="/servicePrograms" element={<ServicePrograms />} />
            <Route path="/serviceDashboard" element={<ServiceDashboard />} />
            <Route path="/serviceLogin" element={<ServiceLogin />} />
            <Route path="/renewalDashboard" element={<RenewalDashboard />} />
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
            {/* <Route path="/renewalReferrals" element={<RenewalReferal />} /> */}
            <Route path="/renewalParents" element={<RenewalParents />} />
            <Route path="/renewalRenewals" element={<RenewalRenewal />} />
            <Route path="/renewalLogin" element={<RenewalLogin />} />
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
            <Route path="/coachLogin" element={<CoachLogin />} />
            <Route path="/marketingDashboard" element={<MarketingDashboard />} />
            <Route path="/marketingProfile" element={<MarketingProfile />} />
            <Route path="/marketingAttendance" element={<MarketingAttendance />} />
            <Route path="/marketingLeaves" element={<MarketingLeaves />} />
            <Route path="/marketingLeaves/add" element={<MarketingLeavesAdd />} />
            <Route path="/marketingEnquiries" element={<MarketingEnquiry />} />
            <Route path="/marketingFeedback" element={<MarketingFeedback />} />
            <Route path="/marketingAttendanceReport" element={<MarketingAttendanceReport />} />
            {/* <Route path="/marketingScheduleClass/" element={<MarketingScheduleClass />} /> */}
            <Route path="/marketingSupport/add" element={<MarketingSupport />} />
            <Route path="/marketingSupport/" element={<MarketingSupportRequest />} />
            <Route path="/marketingLogin" element={<MarketingLogin />} />
            <Route path="/centeradmin-login" element={<CenterLoginPage />} />
            <Route path="/centeradmin-dashboard" element={<CenterOperationDashboardPage />} />
            <Route path="/centeradmin-enquiry-form" element={<CenterSEnquiryFormPage />} />
            <Route path="/centeradmin-enquiry-list" element={<CenterListingEnquiries />} />
            <Route path="/centeradmin-tasks/add" element={<CenterMyTaskPage />} />
            <Route path="/centeradmin/prospects" element={<CenterProspectPage />} />
            <Route path="/centeradmin/referal" element={<CenterReferalPage />} />
            <Route path="/centeradmin-tasks/assigntask" element={<CenterTaskAssignByMePage />} />
            <Route path="/centeradmin-tasks/assignedtasks" element={<CenterAssigneTasksPage />} />
            <Route path="/centeradmin-kids" element={<CenterAdminKidsPage />} />
            <Route path="/centeradmin-tasks/tasks" element={<CenterTasksPage />} />
            <Route path="/centeradmin-tasks/support/add" element={<CenterSupportPage />} />
            <Route path="/centeradmin-tasks/supportTrack" element={<CenterMessageStusTrackPage />} />
            <Route path="/centeradmin-tasks/supports" element={<CenterSupportRequest />} />
            <Route path="/centeradmin/schedule" element={<CenterScheduleClass />} />
            <Route path="/centeradmin/leaves" element={<CenterLeavesPage />} />
            <Route path="/centeradmin/leaves/add" element={<CenterLeaveFormPage />} />
            <Route path="/centeradmin/attendance" element={<CenterAdminAttendance />} />
            <Route path="/centeradmin/profile" element={<CenterProfile />} />
            <Route path="/centeradmin/invoice" element={<CenterInvoicePage />} />
            <Route path="/centeradmin/studentreport" element={<CenterStudentReport />} />
            <Route path="/centeradmin/coachfeedback" element={<CenterCoachFeedback />} />

            {/*----------------------------------Super Admin Sections Routing---------------------------------------------------------------------- */}
            {/* <SuperAdminLayout> */}
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
            {/* <Route path="/superadminReferrals" element={<SuperadminReferral />} /> */}
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
            <Route path="/tournaments/:id" element={<TournamentsForm />} /> {/* For updating */}
            <Route path="/users/add" element={< UserForm />} />
            <Route path="/users/:id" element={<UserForm />} />

            <Route path="/users/" element={< UsersTable />} />
            <Route path="/participents/" element={< Participents />} />
            <Route path="/chessKids/" element={< ChessKid />} />
            {/* </SuperAdminLayout> */}
            <Route path="/meeting/" element={< ZohoMeeting />} />

          </Routes>
        </Router>
      </Suspense>

    </>
  );
}
export default App;
