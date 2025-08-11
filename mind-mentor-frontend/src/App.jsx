import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
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

import KidsDemoClassPage from "./pages/kids/KidsDemoClassPage";
import KidsClassShedulePage from "./pages/kids/KidsClassShedulePage";
import KidsGamesListPage from "./pages/kids/KidsGamesListPage";
import KidsAchievementsPage from "./pages/kids/KidsAchievementsPage";
import KidsJourneyPage from "./pages/kids/KidsJourneyPage";
import AddKidAvailabilityPage from "./pages/parent/AddKidAvailabilityPage";
import LoginPage from "./department-components/operation-new/dashboard/LoginPage";

import OperationDashboardPage from "./pages/employee/operation-employee/OperationDashboardPage";
import SEnquiryFormPage from "./pages/employee/operation-employee/SEnquiryFormPage";

import ListingEnquiries from "./pages/employee/operation-employee/ListingEnquiries";
import ProspectPage from "./pages/employee/operation-employee/ProspectPage";
// import ReferalPage from "./pages/employee/operation-employee/ReferalPage";

import SupportPages from "./pages/employee/operation-employee/SupportPage";
// import MessageStusTrackPage from "./pages/employee/operation-employee/MessageStusTrackPage";
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
// import MyTaskPage from "./pages/employee/operation-employee/MyTaskPage";
import TaskAssignByMePage from "./pages/employee/operation-employee/TaskAssignByMePage";
import TasksPage from "./pages/employee/operation-employee/TasksPage";
import AssigneTaskPage from "./pages/employee/operation-employee/AssigneTasksPage";
import ShowAllEnquiryLogs from "./pages/employee/operation-employee/ShowAllEnquiryLogs";
// import DemoClassShedulePage from "./pages/employee/operation-employee/DemoClassShedulePage";
import AssignDemoClassPage from "./pages/employee/operation-employee/AssignDemoClassPage";

import HolidayPage from "./pages/employee/operation-employee/HolidayPage";

import CenterOperationDashboardPage from "./pages/employee/centeradmin/CenterOperationDashboardPage;";
import CenterSEnquiryFormPage from "./pages/employee/centeradmin/CenterSEnquiryFormPage";
import CenterListingEnquiries from "./pages/employee/centeradmin/CenterListingEnquiries";
import CenterMyTaskPage from "./pages/employee/centeradmin/CenterMyTaskPage";
import CenterProspectPage from "./pages/employee/centeradmin/CenterProspectPage";
import CenterReferalPage from "./pages/employee/centeradmin/CenterReferalPage";
import CenterTaskAssignByMePage from "./pages/employee/centeradmin/CenterTaskAssignByMePage";
import CenterAssigneTasksPage from "./pages/employee/centeradmin/CenterAssigneTasksPage";
import CenterTasksPage from "./pages/employee/centeradmin/CenterTasksPage";
import CenterSupportPage from "./pages/employee/centeradmin/CenterSupportPage";
import CenterMessageStusTrackPage from "./pages/employee/centeradmin/CenterMessageStusTrackPage";
import CenterSupportRequest from "./pages/employee/centeradmin/CenterSupportRequest";
import CenterScheduleClass from "./pages/employee/centeradmin/CenterScheduleClass";
import CenterLeavesPage from "./pages/employee/centeradmin/CenterLeavesPage";
import CenterLeaveFormPage from "./pages/employee/centeradmin/CenterLeaveFormPage";
import CenterAdminAttendance from "./pages/employee/centeradmin/CenterAdminAttendance";
import CenterProfile from "./pages/employee/centeradmin/CenterProfile";
import CenterInvoicePage from "./pages/employee/centeradmin/CenterInvoicePage";
import CenterStudentReport from "./pages/employee/centeradmin/CenterStudentReport";
import CenterCoachFeedback from "./pages/employee/centeradmin/CenterCoachFeedback";
// import CenterLoginPage from "./centeradmin-components/CenterLoginPage";
import CenterAdminKidsPage from "./pages/employee/centeradmin/CenterAdminKidsPage";
import CenterAdminEnquiryLogs from "./pages/employee/centeradmin/CenterAdminEnquiryLogs";
import CenterAdminTaskLogs from "./pages/employee/centeradmin/CenterAdminTaskLogs";

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

import RenewalAttendance from "./pages/employee/renewalassociate/RenewalAttendance";
import RenewalAttendanceReport from "./pages/employee/renewalassociate/RenewalAttendanceReport";
import RenewalDashboard from "./pages/employee/renewalassociate/RenewalDashboard";
import RenewalFeedback from "./pages/employee/renewalassociate/RenewalFeedback";
import RenewalInvoice from "./pages/employee/renewalassociate/RenewalInvoice";
import RenewalKids from "./pages/employee/renewalassociate/RenewalKids";
import RenewalLeaves from "./pages/employee/renewalassociate/RenewalLeaves";
import RenewalLeavesAdd from "./pages/employee/renewalassociate/RenewalLeavesAdd";
import RenewalMessageStusTrackPage from "./pages/employee/renewalassociate/RenewalMessageStusTrackPage";
import RenewalMyAssignTasks from "./pages/employee/renewalassociate/RenewalMyAssignTasks";
import RenewalMyAssignTasksTable from "./pages/employee/renewalassociate/RenewalMyAssignTasksTable";
import RenewalMyTasks from "./pages/employee/renewalassociate/RenewalMyTasks";
import RenewalParents from "./pages/employee/renewalassociate/RenewalParents";
import RenewalProfile from "./pages/employee/renewalassociate/RenewalProfile";
import RenewalPrograms from "./pages/employee/renewalassociate/RenewalPrograms";
import RenewalReferal from "./pages/employee/renewalassociate/RenewalReferal";
import RenewalRenewal from "./pages/employee/renewalassociate/RenewalRenewal";
import RenewalScheduleClass from "./pages/employee/renewalassociate/RenewalScheduleClass";
import RenewalSupport from "./pages/employee/renewalassociate/RenewalSupport";
import RenewalSupportRequest from "./pages/employee/renewalassociate/RenewalSupportRequest";
import RenewalTaskLogs from "./pages/employee/renewalassociate/RenewalTaskLogs";

// import RenewalLogin from "./renewalassociate/components/LoginPage";
// import CoachFeedback from "./pages/coach/CoachFeedback";
// import CoachLogin from "./coach/components/LoginPage";

import CoachAttendance from "./pages/employee/coach/CoachAttendance";
import CoachAttendanceReport from "./pages/employee/coach/CoachAttendanceReport";
import CoachDashboard from "./pages/employee/coach/CoachDashboard";
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

import MarketingAttendance from "./pages/employee/marketing/MarketingAttendance";
import MarketingAttendanceReport from "./pages/employee/marketing/MarketingAttendanceReport";
import MarketingDashboard from "./pages/employee/marketing/MarketingDashboard";
import MarketingFeedback from "./pages/employee/marketing/MarketingFeedback";
// import MarketingInvoice from "./pages/marketing/MarketingInvoice";
import MarketingLeaves from "./pages/employee/marketing/MarketingLeaves";
import MarketingLeavesAdd from "./pages/employee/marketing/MarketingLeavesAdd";
import MarketingProfile from "./pages/employee/marketing/MarketingProfile";
import MarketingSupport from "./pages/employee/marketing/MarketingSupport";
import MarketingSupportRequest from "./pages/employee/marketing/MarketingSupportRequest";
import MarketingCompleteLogs from "./pages/employee/marketing/MarketingCompleteLogs";

// import MarketingLogin from "./marketing/components/LoginPage";
import MarketingEnquiry from "./pages/employee/marketing/MarketingEnquiry";

import AllowDeductForm from "./pages/employee/superadmin/AllowDeductForm";
import AllowDeductTable from "./pages/employee/superadmin/AllowDeductTable";
import ChessKid from "./pages/employee/superadmin/ChessKid";
import SuperadminDashboard from "./pages/employee/superadmin/SuperadminDashboard";
import DocumentsForm from "./pages/employee/superadmin/DocumentsForm";
import DocumentsTable from "./pages/employee/superadmin/DocumentsTable";
import EmployeeForm from "./pages/employee/superadmin/EmployeeForm";
import EmployeeTable from "./pages/employee/superadmin/EmployeeTable";
import ExpenseForm from "./pages/employee/superadmin/ExpenseForm";
import ExpensesTable from "./pages/employee/superadmin/Expenses";
import HolidayTable from "./pages/employee/superadmin/Holiday";
import HolidayForm from "./pages/employee/superadmin/HolidayForm";
import NotificationForm from "./pages/employee/superadmin/NotificationForm";
import NotificationTable from "./pages/employee/superadmin/NotificationTable";
import SuperadminParents from "./pages/employee/superadmin/SuperadminParents";
import Participents from "./pages/employee/superadmin/Participents";
import Payroll from "./pages/employee/superadmin/Payroll";
import SuperadminAttendanceReport from "./pages/employee/superadmin/SuperadminAttendanceReport";
import SuperadminFeedback from "./pages/employee/superadmin/SuperadminFeedback";
import SuperadminInvoice from "./pages/employee/superadmin/SuperadminInvoice";
import SuperadminKids from "./pages/employee/superadmin/SuperadminKids";
import SuperadminLeaves from "./pages/employee/superadmin/SuperadminLeaves";
import SuperadminLeavesAdd from "./pages/employee/superadmin/SuperadminLeavesAdd";
// import SuperadminLogin from "./superadmin/components/LoginPage";
import SuperadminMessageStusTrackPage from "./pages/employee/superadmin/SuperadminMessageStusTrackPage";
import SuperadminMyAssignTasks from "./pages/employee/superadmin/SuperadminMyAssignTasks";
import SuperadminMyAssignTasksTable from "./pages/employee/superadmin/SuperadminMyAssignTasksTable";
import SuperadminMyTasks from "./pages/employee/superadmin/SuperadminMyTasks";
import SuperadminProfile from "./pages/employee/superadmin/SuperadminProfile";
import SuperadminPrograms from "./pages/employee/superadmin/SuperadminPrograms";
import SuperadminReferral from "./pages/employee/superadmin/SuperadminReferal";
import SuperadminRenewal from "./pages/employee/superadmin/SuperadminRenewal";
import SuperadminScheduleClass from "./pages/employee/superadmin/SuperadminScheduleClass";
import SuperadminSupport from "./pages/employee/superadmin/SuperadminSupport";
import SuperadminSupportRequest from "./pages/employee/superadmin/SuperadminSupportRequest";
import TournamentsForm from "./pages/employee/superadmin/Tournaments";
import TournamnetsTable from "./pages/employee/superadmin/TournamnetsTable";
import TransactionForm from "./pages/employee/superadmin/TransactionForm";
import TransactionTable from "./pages/employee/superadmin/TransactionTable";
import UserForm from "./pages/employee/superadmin/UserForm";
import UsersTable from "./pages/employee/superadmin/UsersTable";
import SuperadminAttendance from "./pages/employee/superadmin/SuperadminAttendance";
import SuperadminEnquiries from "./pages/employee/superadmin/ListingEnquiries";
import SuperAdminEnquiryLogs from "./pages/employee/superadmin/SuperAdminEnquiryLogs";
import SuperAdminTaskAllLogs from "./pages/employee/superadmin/SuperAdminTaskAllLogs";
import CenterAdminHolidayPage from "./pages/employee/centeradmin/CenterAdminHolidayPage";
import RenewalHolidayPage from "./pages/employee/renewalassociate/RenewalHolidayPage";
import MarketingHolidayPage from "./pages/employee/marketing/MarketingHolidayPage";
import ServiceDelivaryHolidayPage from "./pages/employee/servicedelivery/ServiceDelivaryHolidayPage";
import ServiceCompleteEnquiryLogs from "./pages/employee/servicedelivery/ShowAllEnquiryLogs";
import MarketingMyTaskPage from "./pages/employee/marketing/MarketingMyTaskPage";
import MarketingAssignedTaskTable from "./pages/employee/marketing/MarketingAssignedTaskTable";
import MarketingNewTaskForm from "./pages/employee/marketing/MarketingNewTaskForm";
import MarketingTaskLogs from "./pages/employee/marketing/MarketingTaskLogs";
import EnrollmentWalkThrougPage from "./pages/employee/operation-employee/EnrollmentWalkThrougPage";
import ShowAllStatusLogs from "./pages/employee/operation-employee/ShowAllStatusLogs";
import DemoClassListIndividualPage from "./pages/employee/operation-employee/DemoClassListIndividualPage";
// import AssignDemoClassIndividualPage from "./pages/employee/operation-employee/AssignDemoClassIndividualPage";
// import PaymentDecode from "./department-components/common-components/prospects/detailed-view/PaymentDecode";
import EnquiryRelatedTaskPage from "./pages/employee/operation-employee/EnquiryRelatedTaskPage";
import EnrollmentPaymentPage from "./pages/employee/operation-employee/EnrollmentPaymentPage";
import EnquiryProspectsTabPage from "./pages/employee/operation-employee/EnquiryProspectsTabPage";
import ParentPaymentPage from "./pages/parent/ParentPaymentPage";
import ServiceActiveKidData from "./pages/employee/servicedelivery/ServiceActiveKidData";
import MyTaskAssinedTaskTable from "./pages/employee/operation-employee/MyTaskAssinedTaskTable";
import AssignMulipleClassPage from "./pages/employee/servicedelivery/AssignMulipleClassPage";
import AssignWholeClassToKidPage from "./pages/employee/servicedelivery/AssignWholeClassToKidPage";
import PaymentConfigAdmin from "./mislanous/PaymentConfigAdmin";
import DisplayAssignedClass from "./pages/employee/servicedelivery/DisplayAssignedClass";
import DiscountFormPage from "./pages/employee/superadmin/DiscountFormPage";
import VoucherTablePage from "./pages/employee/superadmin/voucher/VoucherTablePage";
import ParentPackageSelectionPage from "./pages/parent/ParentPackageSelectionPage";
import ParentRegistrationStepper from "./component/parent-component/parent-registration/ParentRegistrationStepper";
import NewDashboard from "./pages/parent-new/NewDashboard";
import PhysicalCenterListPage from "./pages/employee/superadmin/PhysicalCenterListPage";
import AddPhysicalCenterFormPage from "./pages/employee/superadmin/AddPhysicalCenterFormPage";
import EditPhysicalCenterData from "./pages/employee/superadmin/EditPhysicalCenterData";
import CenterAdminCoachAvailabilityTable from "./pages/employee/centeradmin/CenterAdminCoachAvailabilityTable";
import CenterAdminCoachAvailabilityForm from "./pages/employee/centeradmin/CenterAdminCoachAvailabilityForm";
import CenterScheduleClassForm from "./pages/employee/centeradmin/CenterAdminClassSheduleForm";
import EmployeeList from "./pages/employee/hr/EmployeeListPage";
import AddEmployeeFormPage from "./pages/employee/hr/AddEmployeeFormPage";
import SuperAdminPackageTableList from "./pages/employee/superadmin/package/SuperAdminPackageTableList";
import SuperAdminAddPackageForm from "./pages/employee/superadmin/package/SuperAdminAddPackageForm";
import LiveClassPage from "./pages/parent/LiveClassPage";
import SuperAdminEnquiryProspectsTab from "./pages/employee/superadmin/enquiries/SuperAdminEnquiryProspectsTab";
import SuperAdminAddNewEnquiryForm from "./pages/employee/superadmin/enquiries/SuperAdminAddNewEnquiryForm";
import SuperAdminAllEnquiryLogs from "./pages/employee/superadmin/enquiries/SuperAdminAllEnquiryLogs";
import SuperAdminAllStatusLogs from "./pages/employee/superadmin/enquiries/SuperAdminAllStatusLogs";
import SuperAdminAssignNewClass from "./pages/employee/superadmin/classShedules/SuperAdminAssignNewClass";
import SuperAdminActiveKidData from "./pages/employee/superadmin/SuperAdminActiveKidData";
import SuperAdminAssignWholeClassToKid from "./pages/employee/superadmin/SuperAdminAssignWholeClassToKid";
import SuperAdminDisplayWholeClassKid from "./pages/employee/superadmin/SuperAdminDisplayWholeClassKid";

import BlueButtonKid from "./department-components/bluebutton/BlueButtonKid";
import BlueButton from "./department-components/bluebutton/BlueButton";
import CoachCreateMeetings from "./pages/employee/coach/CoachCreateMeetings";
import CoachClassMeeting from "./department-components/coach/components/shedule-components/CoachClassMeeting";
import KidLiveClassRoom from "./pages/kids/KidLiveClassRoom";
import BlueButtonKidLiveClass from "./component/kids-component/kids-dashboard/BlueButtonKidLiveClass";
import AdminCreateClass from "./department-components/bbbclasscomponent/BbbAdminCreateClassLinks";
import KidJoinTheClass from "./department-components/bbbclasscomponent/KidJoinTheClass";
import NewMMClassUI from "./department-components/bbbclasscomponent/NewMMClassUI";
import MmKidJoinClass from "./department-components/bbbclasscomponent/MmKidJoinClass";
import BbAdminCreateLinkHostinger from "./department-components/hotinger/BbAdminCreateLinkHostinger";
import BbKidJoinClassHostinger from "./department-components/hotinger/BbKidJoinClassHostinger";
import SuperAdminCoachAvailabilityTable from "./pages/employee/superadmin/SuperAdminCoachAvailabilityTable";
import SuperAdminCoachAvailabilityForm from "./pages/employee/superadmin/SuperAdminCoachAvailabilityForm";
import SuperAdminAddTimeTable from "./pages/employee/superadmin/SuperAdminAddTimeTable";
import EditEmployee from "./pages/employee/superadmin/EditEmployee";
import SuperAdminEditClassShedule from "./pages/employee/superadmin/SuperAdminEditClassShedule";
import SuperAdminEmployeeAttandancePage from "./pages/employee/superadmin/SuperAdminEmployeeAttandancePage";
import EmployeeAttendance from "./department-components/common-components/attandance/EmployeeAttandance";
import SuperAdminMarkAttandance from "./pages/employee/superadmin/SuperAdminMarkAttandance";
import SuperAdminShowAllTask from "./pages/employee/superadmin/SuperAdminShowAllTask";
import SuperAdminShowAllLeaves from "./pages/employee/superadmin/SuperAdminShowAllLeaves";
import SuperAdminLeaveForm from "./pages/employee/superadmin/SuperAdminLeaveForm";
import SuperAdminIndividualAttandaceData from "./pages/employee/superadmin/SuperAdminIndividualAttandaceData";
import EditDiscountPage from "./pages/employee/superadmin/EditDiscountPage";
import PaymentVerificationPage from "./pages/employee/superadmin/package/PaymentVerificationPage";
import SuperAdminInvoicePage from "./pages/employee/superadmin/SuperAdminInvoicePage";
import SuperAdminGetAllRecodingsPage from "./pages/employee/superadmin/SuperAdminGetAllRecodingsPage";
import SuperAdminLearingStaticsDashboard from "./pages/employee/superadmin/SuperAdminLearingStaticsDashboard";
import SuperAdminAllClassData from "./pages/employee/superadmin/SuperAdminAllClassData";
import CenterAdminAddAttandanceToKid from "./pages/employee/centeradmin/CenterAdminAddAttandanceToKid";
import CenterAdminAllEnquiryLogs from "./pages/employee/centeradmin/CenterAdminAllEnquiryLogs";
import CenterAdminAllStatusLogs from "./pages/employee/centeradmin/CenterAdminAllStatusLogs";
import CenterAdminAssignDemo from "./pages/employee/centeradmin/CenterAdminAssignDemo";
import CenterAminPaymentVerification from "./pages/employee/centeradmin/CenterAminPaymentVerification";
import CenterAdminActiveKidData from "./pages/employee/centeradmin/CenterAdminActiveKidData";
import CenterAdminAssignWholeClass from "./pages/employee/centeradmin/CenterAdminAssignWholeClass";
import CenterAdminDisplayAssignClass from "./pages/employee/centeradmin/CenterAdminDisplayAssignClass";
import EnrollmentVerifyPayment from "./pages/employee/operation-employee/EnrollmentVerifyPayment";
import SuperAdminParentSupports from "./pages/employee/superadmin/SuperAdminParentSupports";
import MySelectedPackagePage from "./pages/parent/MySelectedPackagePage";
import ClassRatingComponent from "./department-components/classRatings/ClassRatingComponent";
import ThankYouPage from "./department-components/classRatings/ThankYouPage";
import ParentAuthGuard from "./ParentAuthGuard";
import HomePackageSelection from "./pages/parent/HomePackageSelection";
import SuperAdminKidEnquiryProfile from "./pages/employee/superadmin/SuperAdminKidEnquiryProfile";
import SuperAdminAddExtraClass from "./pages/employee/superadmin/SuperAdminAddExtraClass";
import ParentKidAttandacePage from "./pages/parent/ParentKidAttandacePage";
import KidCompletedClassPage from "./pages/kids/KidCompletedClassPage";
import KidTournamnetPage from "./pages/parent/KidTournamnetPage";
import CoachCompletedClass from "./pages/employee/coach/CoachCompletedClass";
import SuperAdminConductedClass from "./pages/employee/superadmin/SuperAdminConductedClass";
import ServiceAddTimeTable from "./pages/employee/servicedelivery/ServiceAddTimeTable";
import ServiceDelivaryEditClass from "./pages/employee/servicedelivery/ServiceDelivaryEditClass";
import GetDetailedAttandance from "./pages/employee/superadmin/GetDetailedAttandance";
import OperationDetailedAttandance from "./pages/employee/operation-employee/OperationDetailedAttandance";
import ServiceDetailedAttandance from "./pages/employee/servicedelivery/ServiceDetailedAttandance";
import RenewalDetailedAttandance from "./pages/employee/renewalassociate/RenewalDetailedAttandance";
import CenterDetailedAttandance from "./pages/employee/centeradmin/CenterDetailedAttandance";
import CoachDetailedAttandance from "./pages/employee/coach/CoachDetailedAttandance";
import ParentSheduleLiveClassPage from "./pages/parent/ParentSheduleLiveClassPage";
import ParentResheduleTheClass from "./pages/parent/ParentResheduleTheClass";
import InvoiceTemplate from "./department-components/invoicetemplate/InvoiceTemplate";
import FinanceAccounting from "./department-components/financeexel/FinanceAccounting";
import ChessKidPracticePage from "./pages/parent/ChessKidPracticePage";
import ParentAllStepLoginPage from "./component/parent-component/ParentAllStepLoginPage";
import SuperAdminSeeParentPackageTable from "./pages/employee/superadmin/SuperAdminSeeParentPackageTable";
import SuperAdminGenerateInvoice from "./pages/employee/superadmin/SuperAdminGenerateInvoice";
import ChessKidPerfomancePage from "./pages/employee/superadmin/ChessKidPerfomancePage";

// import CoachZoomMeeting from "./pages/employee/coach/CoachZoomMeeting";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/invoice-template" element={<InvoiceTemplate />} />
          <Route path="/expense-tracker" element={<FinanceAccounting />} />

          <Route path="/class-feed-back" element={<ClassRatingComponent />} />
          <Route path="/thank-you-page" element={<ThankYouPage />} />

          <Route path="/sample-coach" element={<CoachClassMeeting />} />
          <Route
            path="/kid/join-kid-class"
            element={<BlueButtonKidLiveClass />}
          />
          <Route path="/join-the-meeting-blue" element={<BlueButton />} />
          <Route
            path="/join-the-meeting-blue-kid"
            element={<BlueButtonKid />}
          />

          <Route
            path="/super-admin/department/create-class-links"
            element={<AdminCreateClass />}
          />
          <Route
            path="/super-admin/department/create-class-links-new-class"
            element={<NewMMClassUI />}
          />

          <Route
            path="/kid/join-class-room/:classId"
            element={<KidJoinTheClass />}
          />
          <Route
            path="/kid/join-class-room-new/:classId"
            element={<MmKidJoinClass />}
          />

          <Route
            path="/super-admin/department/create-new-class-link"
            element={<BbAdminCreateLinkHostinger />}
          />

          <Route
            path="/kid/join-the-class-room/:classId"
            element={<BbKidJoinClassHostinger />}
          />

          <Route path="/" element={<HomePage />} />

          <Route
            path="/parent/login-page"
            element={<ParentAllStepLoginPage />}
          />

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

          <Route
            path="/parent"
            element={
              <ParentAuthGuard>
                <Outlet />
              </ParentAuthGuard>
            }
          >
            <Route path="new-dashboard" element={<NewDashboard />} />
            <Route path="new-dashboard/kid-1" element={<NewDashboard />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="kid" element={<ParentKidsDetailsPage />} />
            <Route path="add-kid/:isFromPackage" element={<AddKid />} />
            <Route path="kid/attendance/:id" element={<AttendancePage />} />
            <Route
              path="kid/reshedule-sheduled-class/:kidId"
              element={<ParentResheduleTheClass />}
            />
            <Route path="chess-kid/:kidId" element={<ChessKidPracticePage />} />

            <Route
              path="kid/shedule-new-live-class/:kidId"
              element={<ParentSheduleLiveClassPage />}
            />

            <Route
              path="kid/show-kid-attandance/:kidId"
              element={<ParentKidAttandacePage />}
            />
            <Route
              path="kid/demo-class/:id"
              element={<ParentDemoClassPage />}
            />
            <Route
              path="kid/demo-class-shedule/:id"
              element={<ParentReqNewDemoClass />}
            />
            <Route
              path="kid/manage-login/:id"
              element={<ParentManageChildLoginPage />}
            />
            <Route path="profile/manage" element={<ParentProfilePage />} />
            <Route path="certificate" element={<CertificatePage />} />
            <Route path="kid/classShedule/:id" element={<KidsPage />} />
            <Route path="new-referal" element={<ParentReferalPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="walkthrough-video" element={<WalkThroughPage />} />
            <Route
              path="list-all-tournament/:id"
              element={<KidTournamnetPage />}
            />

            <Route
              path="add-kid-availability/:kidId"
              element={<AddKidAvailabilityPage />}
            />
            <Route
              path="payment-page/payment-details/:encodedData"
              element={<ParentPaymentPage />}
            />
            <Route path="kid/live-class/:kidId" element={<LiveClassPage />} />
          </Route>

          <Route path="/kids/login" element={<KidsLoginPage />} />
          <Route path="/kid/otp" element={<KidsPinPage />} />
          <Route path="/kids/dashboard" element={<KidsDashboard />} />
          <Route path="/kids/today-class" element={<KidsDemoClassPage />} />
          <Route
            path="/kids/my-completed-class"
            element={<KidCompletedClassPage />}
          />

          <Route
            path="/kids/class-schedule"
            element={<KidsClassShedulePage />}
          />
          <Route path="/kids/game-list" element={<KidsGamesListPage />} />
          <Route
            path="/kids/achievements-list"
            element={<KidsAchievementsPage />}
          />
          <Route path="/kids/travel-journey" element={<KidsJourneyPage />} />
          <Route path="/fee-details/:kidId" element={<FeeDetailsPage />} />
          <Route path="/class-schedule" element={<ClassShedulePage />} />
          <Route
            path="/parent-package-selection/:kidId"
            element={<ParentPackageSelectionPage />}
          />
          <Route
            path="/parent-kid-package-selection"
            element={<HomePackageSelection />}
          />

          <Route
            path="/parent-my-package-data/:kidId"
            element={<MySelectedPackagePage />}
          />
          <Route
            path="/paranet-registraton"
            element={<ParentRegistrationStepper />}
          />
          <Route path="/kids/class-rooms-live" element={<KidLiveClassRoom />} />

          <Route path="/employee-login" element={<LoginPage />} />

          {/* <Route path="/operation/department/schedule-demo-class-individual-kid/:enqId"  element={< AssignDemoClassIndividualPage />}/>
          <Route path="/operation/department/assign-demo-class-individually/:classId"  element={<AssignDemoClassIndividualPage />} /> */}

          <Route
            path="/payment-details/:encodedData"
            element={<EnrollmentPaymentPage />}
          />
          <Route path="/operation/department/profile" element={<Profile />} />
          <Route
            path="/operation/department/dashboard"
            element={<OperationDashboardPage />}
          />
          <Route
            path="/operation/department/enrollment-data"
            element={<EnquiryProspectsTabPage />}
          />
          <Route
            path="/operation/department/task-table"
            element={<MyTaskAssinedTaskTable />}
          />
          <Route
            path="/operation/department/enquiry-list"
            element={<ListingEnquiries />}
          />
          <Route
            path="/operation/department/show-complete-enquiry-logs/:id"
            element={<ShowAllEnquiryLogs />}
          />
          <Route
            path="/operation/department/show-complete-status-logs/:id"
            element={<ShowAllStatusLogs />}
          />
          <Route
            path="/operation/department/enquiry-form"
            element={<SEnquiryFormPage />}
          />
          <Route
            path="/operation/department/prospects"
            element={<ProspectPage />}
          />
          <Route
            path="/operation/department/get-detailed-attandance"
            element={<OperationDetailedAttandance />}
          />
          <Route
            path="/operation/department/assign-demo-class/:id"
            element={<AssignDemoClassPage />}
          />
          <Route
            path="/operation/department/schedule-demo-class-list-individually/:enqId/:isSheduled"
            element={<DemoClassListIndividualPage />}
          />
          <Route
            path="/operation/department/attendance"
            element={<EmpAttendance />}
          />
          <Route
            path="/operation/department/assign-kid-task-individually/:id"
            element={<EnquiryRelatedTaskPage />}
          />
          <Route
            path="/operation/department/list-mytask"
            element={<TasksPage />}
          />
          <Route
            path="/operation/department/assign-new-task"
            element={<TaskAssignByMePage />}
          />
          <Route
            path="/operation/department/taskslogs/:id"
            element={<TasksLogs />}
          />
          <Route path="/operation/department/leaves" element={<LeavesPage />} />
          <Route
            path="/operation/department/leaves/add"
            element={<LeaveFormPage />}
          />
          <Route
            path="/operation/department/edit-leaves/:id"
            element={<LeaveFormPage />}
          />
          <Route
            path="/operation/department/supports"
            element={<SupportRequest />}
          />
          <Route
            path="/operation/department/class-reports"
            element={<StudentReport />}
          />
          <Route
            path="/operation/department/coach-feedback"
            element={<CoachFeedback />}
          />
          <Route
            path="/operation/department/invoice"
            element={<InvoicePage />}
          />
          <Route
            path="/operation/department/walk-through"
            element={<EnrollmentWalkThrougPage />}
          />
          <Route
            path="/operation/department/support/add"
            element={<SupportPages />}
          />
          <Route
            path="/operation/department/schedule-demo-class-list"
            element={<ScheduleClass />}
          />
          <Route
            path="/operation/department/holidays"
            element={<HolidayPage />}
          />
          <Route
            path="/operation/department/list-task-assigned-me"
            element={<AssigneTaskPage />}
          />
          <Route
            path="/operation/department/payment-details/:encodedData"
            element={<EnrollmentVerifyPayment />}
          />

          <Route path="/sample" element={<PaymentConfigAdmin />} />
          {/* <Route path="/employee-operation/demoSheduleForm"   element={<DemoClassShedulePage />}  /> */}
          {/* <Route path="/employee-operation-tasks/supportTrack"  element={<MessageStusTrackPage />}  /> */}
          {/* <Route path="/operation/department/add-admin-support" element={<MyTaskPage />}  /> */}
          {/* <Route path="/employee-operation/referal" element={<ReferalPage />} /> */}

          <Route
            path="/service-delivery/department/profile"
            element={<ServiceProfile />}
          />

          <Route
            path="/service-delivery/department/dashboard"
            element={<ServiceDashboard />}
          />
          <Route
            path="/service-delivery/department/active-kid-data"
            element={<ServiceActiveKidData />}
          />
          <Route
            path="/service-delivery/department/coachAvailabilityTable"
            element={<CoachAvailabilityTablePage />}
          />
          <Route
            path="/service-delivery/department/coachAvailabilityForm"
            element={<CoachAvailabilityFormPage />}
          />
          <Route
            path="/service-delivery/department/class-timetable-list"
            element={<ServiceScheduleClass />}
          />
          <Route
            path="/service-delivery/department/get-detailed-attandance"
            element={<ServiceDetailedAttandance />}
          />
          <Route
            path="/service-delivery/department/assign-class-students"
            element={<ServiceDelivaryClassShedulePage />}
          />
          <Route
            path="/service-delivery/department/task-table"
            element={<ServiceMyTasks />}
          />
          <Route
            path="/service-delivery/department/attendance"
            element={<ServiceAttendance />}
          />
          <Route
            path="/service-delivery/department/leaves"
            element={<ServiceLeaves />}
          />
          <Route
            path="/service-delivery/department/leaves/add"
            element={<ServiceLeavesAdd />}
          />
          <Route
            path="/service-delivery/department/edit-leaves/:id"
            element={<ServiceLeavesAdd />}
          />
          <Route
            path="/service-delivery/department/list-task-assigned-me"
            element={<ServiceMyAssignTasksTable />}
          />
          <Route
            path="/service-delivery/department/assign-new-task"
            element={<ServiceMyAssignTasks />}
          />
          <Route
            path="/service-delivery/department/taskslogs/:id"
            element={<ServiceTaskLogs />}
          />
          <Route
            path="/service-delivery/department/serviceAssignClassToKid/:id"
            element={<AssignClassToKid />}
          />
          <Route
            path="/service-delivery/department/assign-multiple-class"
            element={<AssignMulipleClassPage />}
          />

          <Route
            path="/service-delivery/department/assign-whole-plan-class/:enqId"
            element={<AssignWholeClassToKidPage />}
          />
          <Route path="/serviceInvoice" element={<ServiceInvoice />} />
          <Route path="/serviceFeedback" element={<ServiceFeedback />} />
          <Route
            path="/service-delivary/department/class-reports"
            element={<ServiceAttendanceReport />}
          />
          <Route path="/serviceSupport/add" element={<ServiceSupport />} />
          <Route path="/serviceSupport/" element={<ServiceSupportRequest />} />
          <Route path="/servicekids" element={<ServiceKids />} />
          <Route
            path="/service-delivary/department/list-all-programs"
            element={<ServicePrograms />}
          />
          <Route
            path="/service-delivary/holidays"
            element={<ServiceDelivaryHolidayPage />}
          />
          <Route
            path="/service-delivary/completeEnquiryLogs/:id"
            element={<ServiceCompleteEnquiryLogs />}
          />
          <Route
            path="/serviceMessageStatus/"
            element={<ServiceMessageStusTrackPage />}
          />
          <Route
            path="/service-delivery/department/display-whole-selectedClass/:enqId"
            element={<DisplayAssignedClass />}
          />
          <Route
            path="/service-delivery/department/add-new-class"
            element={<ServiceAddTimeTable />}
          />
          <Route
            path="/service-delivery/department/edit-class-shedules/:classId"
            element={<ServiceDelivaryEditClass />}
          />

          {/* <Route path="/serviceLogin" element={<ServiceLogin />} /> */}

          <Route
            path="/renewal/department/dashboard"
            element={<RenewalDashboard />}
          />
          <Route
            path="/renewal/department/profile"
            element={<RenewalProfile />}
          />
          <Route
            path="/renewal/department/leaves"
            element={<RenewalLeaves />}
          />
          <Route
            path="/renewal/department/leaves/add"
            element={<RenewalLeavesAdd />}
          />
          <Route
            path="/renewal/department/edit-leaves/:id"
            element={<RenewalLeavesAdd />}
          />
          <Route
            path="/renewal/department/get-detailed-attandance"
            element={<RenewalDetailedAttandance />}
          />
          <Route
            path="/renewal/department/task-table"
            element={<RenewalMyTasks />}
          />
          <Route
            path="/renewal/department/list-task-assigned-me"
            element={<RenewalMyAssignTasksTable />}
          />
          <Route
            path="/renewal/department/assign-new-task"
            element={<RenewalMyAssignTasks />}
          />
          <Route
            path="/renewal/department/taskslogs/:id"
            element={<RenewalTaskLogs />}
          />
          <Route
            path="/renewal/department/attendance"
            element={<RenewalAttendance />}
          />
          <Route
            path="/renewal/department/schedule-class-list/"
            element={<RenewalScheduleClass />}
          />
          <Route path="/renewalInvoices" element={<RenewalInvoice />} />
          <Route path="/renewalFeedback" element={<RenewalFeedback />} />
          <Route
            path="/renewalAttendanceReport"
            element={<RenewalAttendanceReport />}
          />
          <Route path="/renewalSupport/add" element={<RenewalSupport />} />
          <Route path="/renewalSupport/" element={<RenewalSupportRequest />} />
          <Route path="/renewalKids" element={<RenewalKids />} />
          <Route path="/renewalPrograms" element={<RenewalPrograms />} />
          <Route path="/renewalParents" element={<RenewalParents />} />
          <Route path="/renewalRenewals" element={<RenewalRenewal />} />
          <Route
            path="/renewal-associate/holidays"
            element={<RenewalHolidayPage />}
          />
          <Route
            path="/renewalMessageStatus/"
            element={<RenewalMessageStusTrackPage />}
          />

          {/* <Route path="/renewalLogin" element={<RenewalLogin />} /> */}
          <Route path="/renewalReferrals" element={<RenewalReferal />} />

          <Route
            path="/coach/start-class-room"
            element={<CoachCreateMeetings />}
          />
          <Route path="/coach/department/profile" element={<CoachProfile />} />
          <Route
            path="/coach/department/dashboard"
            element={<CoachDashboard />}
          />
          <Route path="/coach/department/leaves" element={<CoachLeaves />} />
          <Route
            path="/coach/department/get-detailed-attandance"
            element={<CoachDetailedAttandance />}
          />

          <Route
            path="/coach/department/leaves/add"
            element={<CoachLeavesAdd />}
          />
          <Route
            path="/coach/department/edit-leaves/:id"
            element={<CoachLeavesAdd />}
          />
          <Route
            path="/coach/department/task-table"
            element={<CoachMyTasks />}
          />
          <Route
            path="/coach/department/list-task-assigned-me"
            element={<CoachMyAssignTasksTable />}
          />
          <Route
            path="/coach/department/assign-new-task"
            element={<CoachMyAssignTasks />}
          />
          <Route
            path="/coach/department/taskslogs/:id"
            element={<CoachTaskLogs />}
          />
          <Route
            path="/coach/department/attendance"
            element={<CoachAttendance />}
          />
          <Route path="/coachInvoices" element={<CoachInvoice />} />
          <Route path="/coachFeedback" element={<CoachFeedback />} />
          <Route
            path="/coach/department/student-attendance-report"
            element={<CoachAttendanceReport />}
          />
          <Route path="/coachScheduleClass/" element={<CoachScheduleClass />} />
          <Route path="/coachSupport/add" element={<CoachSupport />} />
          <Route path="/coachSupport/" element={<CoachSupportRequest />} />
          <Route path="/coachFeedaback/add" element={<CoachFeedbackAdd />} />
          <Route
            path="/coach/department/past-class"
            element={<CoachCompletedClass />}
          />

          <Route
            path="/coachAvailability"
            element={<CoachAvailabilityPage />}
          />
          <Route
            path="/coachAttandanceFeedback/:classId"
            element={<CoachAddAttandaceFeedBack />}
          />

          {/* <Route path="/zoom/:meetingNumber/:passcode" element={<CoachZoomMeeting />} /> */}
          {/* <Route path="/coachAvailability" element={<CoachAvailabilityPage />} /> */}
          {/* <Route path="/coachLogin" element={<CoachLogin />} /> */}

          <Route path="/marketingProfile" element={<MarketingProfile />} />
          <Route
            path="/marketing/department/dashboard"
            element={<MarketingDashboard />}
          />
          <Route
            path="/marketing/department/leaves"
            element={<MarketingLeaves />}
          />
          <Route
            path="/marketing/department/leaves/add"
            element={<MarketingLeavesAdd />}
          />
          <Route
            path="/marketing/department/edit-leaves/:id"
            element={<MarketingLeavesAdd />}
          />
          <Route
            path="/marketing/department/task-table"
            element={<MarketingMyTaskPage />}
          />
          <Route
            path="/marketing/department/list-task-assigned-me"
            element={<MarketingAssignedTaskTable />}
          />
          <Route
            path="/marketing/department/assign-new-task"
            element={<MarketingNewTaskForm />}
          />
          <Route
            path="/marketing/department/taskslogs/:id"
            element={<MarketingTaskLogs />}
          />
          <Route
            path="/marketing/department/attendance"
            element={<MarketingAttendance />}
          />
          <Route path="/marketingEnquiries" element={<MarketingEnquiry />} />
          <Route path="/marketingFeedback" element={<MarketingFeedback />} />
          <Route
            path="/marketingAttendanceReport"
            element={<MarketingAttendanceReport />}
          />
          <Route path="/marketingSupport/add" element={<MarketingSupport />} />
          <Route
            path="/marketingSupport/"
            element={<MarketingSupportRequest />}
          />
          <Route
            path="/showCompleteLogsMarketing/:id"
            element={<MarketingCompleteLogs />}
          />
          <Route
            path="/marketing-associate/holidays"
            element={<MarketingHolidayPage />}
          />

          {/* <Route path="/marketingScheduleClass/" element={<MarketingScheduleClass />} /> */}
          {/* <Route path="/marketingLogin" element={<MarketingLogin />} /> */}
          {/* <Route path="/centeradmin-login" element={<CenterLoginPage />} /> */}

          <Route
            path="/centeradmin/department/profile"
            element={<CenterProfile />}
          />
          <Route
            path="/centeradmin/department/enrollment-data"
            element={<CenterListingEnquiries />}
          />
          <Route
            path="/centeradmin/department/enquiry-form"
            element={<CenterSEnquiryFormPage />}
          />
          <Route path="/centeradmin-kids" element={<CenterAdminKidsPage />} />

          <Route
            path="/centeradmin/department/dashboard"
            element={<CenterOperationDashboardPage />}
          />
          <Route
            path="/centeradmin/department/leaves"
            element={<CenterLeavesPage />}
          />
          <Route
            path="/centeradmin/department/leaves/add"
            element={<CenterLeaveFormPage />}
          />
          <Route
            path="/centeradmin/department/coachAvailabilityTable"
            element={<CenterAdminCoachAvailabilityTable />}
          />
          <Route
            path="/centeradmin/department/coachAvailabilityform"
            element={<CenterAdminCoachAvailabilityForm />}
          />
          <Route
            path="/centeradmin/department/get-detailed-attandance"
            element={<CenterDetailedAttandance />}
          />
          <Route
            path="/centeradmin/department/edit-leaves/:id"
            element={<CenterLeaveFormPage />}
          />
          <Route
            path="/centeradmin/department/task-table"
            element={<CenterTasksPage />}
          />
          <Route
            path="/centeradmin/department/list-task-assigned-me"
            element={<CenterAssigneTasksPage />}
          />
          <Route
            path="/centeradmin/department/assign-new-task"
            element={<CenterTaskAssignByMePage />}
          />
          <Route
            path="/centeradmin/department/taskslogs/:id"
            element={<CenterAdminTaskLogs />}
          />
          <Route
            path="/centeradmin/department/attendance"
            element={<CenterAdminAttendance />}
          />
          <Route
            path="/centeradmin/department/class-schedule-list"
            element={<CenterScheduleClass />}
          />
          <Route
            path="/centeradmin/department/create-time-table"
            element={<CenterScheduleClassForm />}
          />
          <Route
            path="/centeradmin/department/add-attandance-to-kid/:classId"
            element={<CenterAdminAddAttandanceToKid />}
          />
          <Route
            path="/centeradmin/department/show-complete-enquiry-logs/:id"
            element={<CenterAdminAllEnquiryLogs />}
          />
          <Route
            path="/centeradmin/department/show-complete-status-logs/:id"
            element={<CenterAdminAllStatusLogs />}
          />
          <Route
            path="/centeradmin/department/schedule-demo-class-list-individually/:enqId/:isSheduled"
            element={<CenterAdminAssignDemo />}
          />
          <Route
            path="/centeradmin/department/payment-details/:encodedData"
            element={<CenterAminPaymentVerification />}
          />
          <Route
            path="/centeradmin/department/active-kid-data"
            element={<CenterAdminActiveKidData />}
          />
          <Route
            path="/centeradmin/department/assign-whole-plan-class/:enqId"
            element={<CenterAdminAssignWholeClass />}
          />
          <Route
            path="/centeradmin/department/display-whole-selectedClass/:enqId"
            element={<CenterAdminDisplayAssignClass />}
          />

          <Route
            path="/centeradmin/coachfeedback"
            element={<CenterCoachFeedback />}
          />
          <Route
            path="/showCompleteLogsCenterAdmin/:id"
            element={<CenterAdminEnquiryLogs />}
          />
          <Route
            path="/centeradmin-tasks/supports"
            element={<CenterSupportRequest />}
          />
          <Route
            path="/centeradmin/studentreport"
            element={<CenterStudentReport />}
          />
          <Route path="/centeradmin/invoice" element={<CenterInvoicePage />} />
          <Route path="/centeradmin-tasks/add" element={<CenterMyTaskPage />} />
          <Route
            path="/centeradmin/prospects"
            element={<CenterProspectPage />}
          />
          <Route path="/centeradmin/referal" element={<CenterReferalPage />} />
          <Route
            path="/centeradmin-tasks/support/add"
            element={<CenterSupportPage />}
          />
          <Route
            path="/centeradmin-tasks/supportTrack"
            element={<CenterMessageStusTrackPage />}
          />
          <Route
            path="/centreAdminHoliday"
            element={<CenterAdminHolidayPage />}
          />

          <Route
            path="/hr/department/add-employee-form"
            element={<AddEmployeeFormPage />}
          />
          <Route
            path="/hr/department/employee-list"
            element={<EmployeeList />}
          />
          <Route path="/hr/department/attendance" element={<EmployeeList />} />

          {/* SUPER  ADMIN DEPARTMENT */}
          <Route
            path="/super-admin/department/list-all-programme"
            element={<SuperadminPrograms />}
          />
          <Route
            path="/super-admin/department/physical-centerlist"
            element={<PhysicalCenterListPage />}
          />
          <Route
            path="/super-admin/department/add-physical-center"
            element={<AddPhysicalCenterFormPage />}
          />
          <Route
            path="/super-admin/department/edit-physical-center/:id"
            element={<EditPhysicalCenterData />}
          />
          <Route
            path="/super-admin/department/employees"
            element={<EmployeeTable />}
          />
          <Route
            path="/super-admin/department/employee/edit/:empId"
            element={<EditEmployee />}
          />
          <Route
            path="/super-admin/department/coachAvailabilityForm"
            element={<SuperAdminCoachAvailabilityForm />}
          />
          <Route
            path="/super-admin/department/coachAvailabilityTable"
            element={<SuperAdminCoachAvailabilityTable />}
          />
          <Route
            path="/super-admin/department/employee/add"
            element={<EmployeeForm />}
          />
          <Route
            path="/super-admin/department/class-timetable-list"
            element={<SuperadminScheduleClass />}
          />
          <Route
            path="/super-admin/department/all-class-details"
            element={<SuperAdminAllClassData />}
          />

          <Route
            path="/super-admin/department/add-new-class"
            element={<SuperAdminAddTimeTable />}
          />
          <Route
            path="/super-admin/department/edit-class-shedules/:classId"
            element={<SuperAdminEditClassShedule />}
          />
          <Route
            path="/super-admin/department/employee-mark-attandance"
            element={<SuperAdminMarkAttandance />}
          />
          <Route
            path="/super-admin/department/employee-attandance-list"
            element={<SuperAdminEmployeeAttandancePage />}
          />
          <Route
            path="/super-admin/department/individual-employee-attandance-data/:employeeId"
            element={<SuperAdminIndividualAttandaceData />}
          />
          <Route
            path="/super-admin/department/assign-new-task"
            element={<SuperadminMyAssignTasks />}
          />
          <Route
            path="/super-admin/department/task-table"
            element={<SuperadminMyTasks />}
          />
          <Route
            path="/super-admin/department/taskslogs/:id"
            element={<SuperAdminTaskAllLogs />}
          />
          <Route
            path="/super-admin/department/show-all-task"
            element={<SuperAdminShowAllTask />}
          />
          <Route
            path="/super-admin/department/leaves/add"
            element={<SuperadminLeavesAdd />}
          />
          <Route
            path="/super-admin/department/leaves"
            element={<SuperadminLeaves />}
          />
          <Route
            path="/super-admin/department/view-parent-package-details/:enqId"
            element={<SuperAdminSeeParentPackageTable />}
          />
          <Route
            path="/super-admin/department/show-all-leaves"
            element={<SuperAdminShowAllLeaves />}
          />
          <Route
            path="/super-admin/department/edit-leaves/:id"
            element={<SuperadminLeavesAdd />}
          />
          <Route
            path="/super-admin/department/new-leave-form"
            element={<SuperAdminLeaveForm />}
          />
          <Route
            path="/super-admin/department/package-table"
            element={<SuperAdminPackageTableList />}
          />
          <Route
            path="/super-admin/department/payment-details/:encodedData"
            element={<PaymentVerificationPage />}
          />
          <Route
            path="/super-admin/department/invoice-table"
            element={<SuperAdminInvoicePage />}
          />
          <Route
            path="/super-admin/department/generate-invoice"
            element={<SuperAdminGenerateInvoice />}
          />
          <Route
            path="/super-admin/department/get-class-recordings"
            element={<SuperAdminGetAllRecodingsPage />}
          />
          <Route
            path="/super-admin/department/student-attandace-report"
            element={<SuperadminAttendanceReport />}
          />
          <Route
            path="/super-admin/department/get-class-statistic-dashboard"
            element={<SuperAdminLearingStaticsDashboard />}
          />
          <Route
            path="/super-admin/department/dashboard"
            element={<SuperadminDashboard />}
          />
          <Route
            path="/super-admin/department/all-counducted-class-Data"
            element={<SuperAdminConductedClass />}
          />
          <Route
            path="/super-admin/department/enquiry-form"
            element={<SuperAdminAddNewEnquiryForm />}
          />
          <Route
            path="/super-admin/department/enrollment-data"
            element={<SuperAdminEnquiryProspectsTab />}
          />
          <Route
            path="/super-admin/department/show-complete-enquiry-logs/:id"
            element={<SuperAdminAllEnquiryLogs />}
          />
          <Route
            path="/super-admin/department/show-complete-status-logs/:id"
            element={<SuperAdminAllStatusLogs />}
          />
          <Route
            path="/super-admin/department/parents-data"
            element={<SuperadminParents />}
          />
          <Route
            path="/super-admin/department/kids-data"
            element={<SuperadminKids />}
          />
          <Route
            path="/super-admin/department/active-kid-data"
            element={<SuperAdminActiveKidData />}
          />
          <Route
            path="/super-admin/department/discount-table"
            element={<VoucherTablePage />}
          />
          <Route
            path="/super-admin/department/get-detailed-attandance"
            element={<GetDetailedAttandance />}
          />
          <Route
            path="/super-admin/department/discount-form"
            element={<DiscountFormPage />}
          />
          <Route
            path="/super-admin/department/edit-discount-form/:voucherId"
            element={<EditDiscountPage />}
          />
          <Route
            path="/super-admin/department/add-package-form"
            element={<SuperAdminAddPackageForm />}
          />
          <Route
            path="/super-admin/department/schedule-demo-class-list-individually/:enqId/:isSheduled"
            element={<SuperAdminAssignNewClass />}
          />
          <Route
            path="/super-admin/department/assign-whole-plan-class/:enqId"
            element={<SuperAdminAssignWholeClassToKid />}
          />
          <Route
            path="/super-admin/department/display-whole-selectedClass/:enqId"
            element={<SuperAdminDisplayWholeClassKid />}
          />
          <Route
            path="/super-admin/department/add-extra-class/:enqId/:classId"
            element={<SuperAdminAddExtraClass />}
          />

          <Route
            path="/super-admin/department/allowdeduct"
            element={<AllowDeductTable />}
          />
          <Route
            path="/super-admin/department/parent-tickets"
            element={<SuperAdminParentSupports />}
          />
          <Route
            path="/super-admin/department/profile"
            element={<SuperadminProfile />}
          />
          <Route
            path="/super-admin/department/kid-enquiry-profile"
            element={<SuperAdminKidEnquiryProfile />}
          />
          <Route
            path="/super-admin/department/tournaments"
            element={<TournamnetsTable />}
          />
          <Route
            path="/super-admin/department/tournaments/add"
            element={<TournamentsForm />}
          />

          {/* <Route path="/super-admin/department/show-complete-enquiry-logs/:id" element={<ShowAllEnquiryLogs />} /> */}
          {/* <Route path="/super-admin/department/list-task-assigned-me" element={<SuperadminMyAssignTasksTable />}/>         */}
          {/* <Route path="/super-admin/department/attendance" element={<SuperadminAttendance />}/> */}
          {/* <Route path="/superadminEnquiries" element={<SuperadminEnquiries />} /> */}

          <Route path="/superadminRenewals" element={<SuperadminRenewal />} />
          <Route path="/superadminInvoices" element={<SuperadminInvoice />} />
          <Route
            path="/super-admin/department/chessKids"
            element={<ChessKid />}
          />
          <Route
            path="super-admin/department/chess-kid-performance/:chessKidId"
            element={<ChessKidPerfomancePage />}
          />

          <Route path="/superadminFeedback" element={<SuperadminFeedback />} />
          <Route
            path="/superadminSupport/"
            element={<SuperadminSupportRequest />}
          />
          <Route path="/notifications" element={<NotificationTable />} />
          <Route
            path="/superadminAttendance"
            element={<SuperadminAttendance />}
          />
          <Route path="/payroll/" element={<Payroll />} />
          <Route path="/documents/" element={<DocumentsTable />} />
          <Route path="/users/" element={<UsersTable />} />
          <Route path="/users/add" element={<UserForm />} />
          <Route path="/participents/" element={<Participents />} />
          <Route path="/holiday/" element={<HolidayTable />} />
          <Route path="/holiday/add" element={<HolidayForm />} />
          <Route path="/expenses/" element={<ExpensesTable />} />
          <Route path="/transactions/" element={<TransactionTable />} />
          <Route path="/transactions/add" element={<TransactionForm />} />
          <Route
            path="/superadminSupport/add"
            element={<SuperadminSupport />}
          />
          <Route
            path="/superadminMessageStatus/"
            element={<SuperadminMessageStusTrackPage />}
          />
          <Route path="/notifications/add" element={<NotificationForm />} />
          <Route path="/allowdeduct/add" element={<AllowDeductForm />} />
          <Route path="/expenses/add" element={<ExpenseForm />} />
          <Route path="/documents/add" element={<DocumentsForm />} />
          <Route
            path="/showCompleteLogsAdmin/:id"
            element={<SuperAdminEnquiryLogs />}
          />
          <Route path="/superadminReferrals" element={<SuperadminReferral />} />

          {/* SUPER  ADMIN DEPARTMENT */}

          {/* <Route path="/superadminLogin" element={<SuperadminLogin />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
