import React, { useEffect, useState } from "react";
import { getKidProfileData } from "../../../api/service/employee/EmployeeService";
import {
  User,
  Phone,
  Calendar,
  CreditCard,
  BookOpen,
  Edit3,
  X,
  Save,
  MessageSquare,
  Eye,
  Plus,
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  DollarSign,
  Settings,
  PhoneCall,
  MessageCircle,
} from "lucide-react";

const KidProfile = () => {
  const enqId = "688e1369b824755f364ad0cb";
  const [profileData, setProfileData] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await getKidProfileData(enqId);
      console.log(response);
      if (response.status === 200) {
        setProfileData(response.data.data);
      }
    };
    fetchData();
  }, []);

  const openModal = (modalType, data = {}) => {
    setActiveModal(modalType);
    setEditData(data);
    setEditMode(false);
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditMode(false);
    setEditData({});
  };

  const handleAction = (action, data) => {
    console.log(`Action: ${action}`, data);
    // Implement actual API calls here
  };

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const {
    operationData,
    kid,
    parent,
    classPayments,
    selectedClasses,
    logData,
  } = profileData;

  const ActionButton = ({
    icon: Icon,
    text,
    onClick,
    variant = "primary",
    size = "sm",
  }) => {
    const baseClasses =
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 hover:shadow-md";
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      success: "bg-green-600 text-white hover:bg-green-700",
      warning: "bg-orange-600 text-white hover:bg-orange-700",
      danger: "bg-red-600 text-white hover:bg-red-700",
    };
    const sizes = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      >
        <Icon className="h-4 w-4" />
        {text}
      </button>
    );
  };

  const StatusBadge = ({ status, type = "default" }) => {
    const types = {
      default: "bg-gray-100 text-gray-800",
      success: "bg-green-100 text-green-800",
      warning: "bg-orange-100 text-orange-800",
      danger: "bg-red-100 text-red-800",
      info: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${types[type]}`}
      >
        {status}
      </span>
    );
  };

  const InfoSection = ({ title, icon: Icon, children, actions = [] }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {actions.length > 0 && (
            <div className="flex items-center gap-2">
              {actions.map((action, index) => (
                <ActionButton key={index} {...action} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Kid Profile Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Managing profile for{" "}
                <span className="font-medium">{kid.kidsName}</span> (ID:{" "}
                {kid.chessId})
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={kid.status} type="success" />
              <StatusBadge status={operationData.enquiryStatus} type="info" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Classes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {kid.totalClassesAttended}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{kid.totalPaidAmount}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-gray-900">
                  {kid.classesRemaining}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classPayments.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Basic Information */}
            <InfoSection title="Basic Information" icon={User}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Kid Name
                    </label>
                    <p className="text-gray-900 font-medium">{kid.kidsName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Chess ID
                    </label>
                    <p className="text-gray-900 font-medium">{kid.chessId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Age
                    </label>
                    <p className="text-gray-900 font-medium">{kid.age} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Gender
                    </label>
                    <p className="text-gray-900 font-medium capitalize">
                      {kid.gender}
                    </p>
                  </div>
                </div>
              </div>
            </InfoSection>

            {/* Enquiry Details */}
            <InfoSection
              title="Enquiry Details"
              icon={FileText}
              actions={[
                {
                  icon:
                    operationData.enquiryField === "prospects"
                      ? ArrowRight
                      : ArrowLeft,
                  text:
                    operationData.enquiryField === "prospects"
                      ? "Move to Enquiry"
                      : "Move to Prospects",
                  onClick: () =>
                    handleAction(
                      "toggleEnquiryField",
                      operationData.enquiryField
                    ),
                  variant: "secondary",
                },
                {
                  icon:
                    operationData.scheduleDemo?.status === "Pending"
                      ? Calendar
                      : Eye,
                  text:
                    operationData.scheduleDemo?.status === "Pending"
                      ? "Schedule Demo"
                      : "View Demo",
                  onClick: () =>
                    handleAction("demo", operationData.scheduleDemo),
                  variant:
                    operationData.scheduleDemo?.status === "Pending"
                      ? "primary"
                      : "secondary",
                },
                {
                  icon:
                    operationData.enquiryType === "warm"
                      ? AlertCircle
                      : CheckCircle,
                  text:
                    operationData.enquiryType === "warm"
                      ? "Mark as Cold"
                      : "Mark as Warm",
                  onClick: () =>
                    handleAction(
                      "toggleTemperature",
                      operationData.enquiryType
                    ),
                  variant:
                    operationData.enquiryType === "warm"
                      ? "warning"
                      : "success",
                },
              ]}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Parent Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {operationData.parentFirstName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Enquiry Type
                    </label>
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        status={operationData.enquiryType}
                        type={
                          operationData.enquiryType === "warm"
                            ? "success"
                            : "info"
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Status
                    </label>
                    <StatusBadge
                      status={operationData.enquiryStatus}
                      type="info"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Demo Status
                    </label>
                    <StatusBadge
                      status={
                        operationData.scheduleDemo?.status || "Not Scheduled"
                      }
                      type={
                        operationData.scheduleDemo?.status === "Conducted"
                          ? "success"
                          : "warning"
                      }
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-600">
                      Notes
                    </label>
                    <ActionButton
                      icon={Plus}
                      text="Add Note"
                      onClick={() => openModal("addNote")}
                      variant="secondary"
                      size="sm"
                    />
                  </div>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {operationData.notes || "No notes available"}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-600">
                      Disposition
                    </label>
                    <ActionButton
                      icon={Plus}
                      text="Add Disposition"
                      onClick={() => openModal("addDisposition")}
                      variant="secondary"
                      size="sm"
                    />
                  </div>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {operationData.disposition || "No disposition set"}
                  </p>
                </div>
              </div>
            </InfoSection>

            {/* Parent Information */}
            <InfoSection
              title="Parent Information"
              icon={Phone}
              actions={[
                ...(parent.parentMobile
                  ? [
                      {
                        icon: PhoneCall,
                        text: "Call",
                        onClick: () =>
                          window.open(`tel:${parent.parentMobile}`),
                        variant: "success",
                      },
                    ]
                  : []),
                ...(operationData.whatsappNumber
                  ? [
                      {
                        icon: MessageCircle,
                        text: "WhatsApp",
                        onClick: () =>
                          window.open(
                            `https://wa.me/${operationData.whatsappNumber}`
                          ),
                        variant: "success",
                      },
                    ]
                  : []),
              ]}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {parent.parentName || operationData.parentFirstName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Mobile
                    </label>
                    <p className="text-gray-900 font-medium">
                      {parent.parentMobile}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      WhatsApp
                    </label>
                    <p className="text-gray-900 font-medium">
                      {operationData.whatsappNumber}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-900 font-medium">
                      {parent.parentEmail || operationData.email}
                    </p>
                  </div>
                </div>
              </div>
            </InfoSection>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Programs */}
            <InfoSection
              title="Programs"
              icon={BookOpen}
              actions={[
                {
                  icon: operationData.programs?.length > 0 ? Edit3 : Plus,
                  text:
                    operationData.programs?.length > 0
                      ? "Update Program"
                      : "Add Program",
                  onClick: () => openModal("programs"),
                  variant: "primary",
                },
              ]}
            >
              {operationData.programs?.length > 0 ? (
                <div className="space-y-3">
                  {operationData.programs.map((program, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {program.program}
                          </p>
                          <p className="text-sm text-gray-600">
                            {program.level}
                          </p>
                        </div>
                        <StatusBadge status={program.status} type="info" />
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <span className="ml-1 font-medium">
                            {program.totalClass}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Attended:</span>
                          <span className="ml-1 font-medium">
                            {program.attendedClass}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Remaining:</span>
                          <span className="ml-1 font-medium">
                            {program.remainingClass}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No programs assigned
                </p>
              )}
            </InfoSection>

            {/* Payments */}
            <InfoSection
              title="Payment History"
              icon={CreditCard}
              actions={[
                {
                  icon: Plus,
                  text: "Add Payment",
                  onClick: () => openModal("addPayment"),
                  variant: "primary",
                },
                {
                  icon: Eye,
                  text: "View All",
                  onClick: () => openModal("viewPayments"),
                  variant: "secondary",
                },
              ]}
            >
              {classPayments.length > 0 ? (
                <div className="space-y-3">
                  {classPayments.slice(0, 2).map((payment, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">
                          ₹{payment.totalAmount}
                        </p>
                        <StatusBadge
                          status={payment.paymentStatus}
                          type={
                            payment.paymentStatus === "Success"
                              ? "success"
                              : "warning"
                          }
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        {payment.selectedPackage}
                      </p>
                      <div className="mt-2 flex gap-4 text-xs text-gray-500">
                        <span>Online: {payment.onlineClasses}</span>
                        <span>Offline: {payment.offlineClasses}</span>
                      </div>
                    </div>
                  ))}
                  {classPayments.length > 2 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{classPayments.length - 2} more payments
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No payments found
                </p>
              )}
            </InfoSection>

            {/* Class Schedule */}
            <InfoSection
              title="Class Schedule"
              icon={Calendar}
              actions={[
                {
                  icon: Eye,
                  text: "View Details",
                  onClick: () => openModal("classDetails"),
                  variant: "primary",
                },
                {
                  icon: Settings,
                  text: "Update Classes",
                  onClick: () => openModal("updateClasses"),
                  variant: "secondary",
                },
              ]}
            >
              {selectedClasses.length > 0 &&
              selectedClasses[0].generatedSchedule ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Sessions:</span>
                      <span className="ml-1 font-medium">
                        {selectedClasses[0].generatedSchedule.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Next Class:</span>
                      <span className="ml-1 font-medium">
                        {selectedClasses[0].generatedSchedule.find(
                          (s) => s.status === "scheduled"
                        )?.formattedDate || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Upcoming Classes
                    </p>
                    {selectedClasses[0].generatedSchedule
                      .filter((s) => s.status === "scheduled")
                      .slice(0, 3)
                      .map((schedule, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-1"
                        >
                          <span className="text-sm text-gray-600">
                            Session {schedule.sessionNumber}
                          </span>
                          <span className="text-sm font-medium">
                            {schedule.formattedDate}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No class schedule available
                </p>
              )}
            </InfoSection>

            {/* Activity Logs */}
            <InfoSection
              title="Activity Logs"
              icon={MessageSquare}
              actions={[
                {
                  icon: Eye,
                  text: "View All Logs",
                  onClick: () => openModal("viewLogs"),
                  variant: "secondary",
                },
              ]}
            >
              {logData?.logs?.length > 0 ? (
                <div className="space-y-3">
                  {logData.logs.slice(0, 3).map((log, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {log.employeeName}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {log.comment || log.action}
                      </p>
                    </div>
                  ))}
                  {logData.logs.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{logData.logs.length - 3} more entries
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No activity logs
                </p>
              )}
            </InfoSection>
          </div>
        </div>
      </div>

      {/* Modals would go here - simplified for brevity */}
      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {activeModal === "addNote" && "Add Note"}
                {activeModal === "addDisposition" && "Add Disposition"}
                {activeModal === "programs" && "Manage Programs"}
                {activeModal === "addPayment" && "Add Payment"}
                {activeModal === "viewPayments" && "Payment History"}
                {activeModal === "classDetails" && "Class Details"}
                {activeModal === "updateClasses" && "Update Classes"}
                {activeModal === "viewLogs" && "Activity Logs"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Modal content for {activeModal} goes here...
              </p>
              {/* Add specific modal content based on activeModal type */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KidProfile;
