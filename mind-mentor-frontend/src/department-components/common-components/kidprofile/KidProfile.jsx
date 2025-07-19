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
} from "lucide-react";

const KidProfile = () => {
  const enqId = "687a37d26a5a601d712fd24c";
  const [profileData, setProfileData] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await getKidProfileData(enqId);
      console.log(response);
      if (response.status===200) {
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

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    // Here you would call your API to save the edited data
    console.log("Saving data:", editData);
    setEditMode(false);
    // Update profileData with editData if needed
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  const { operationData, kid, parent, classPayments, selectedClasses } =
    profileData;

  const InfoCard = ({ title, icon: Icon, onClick, children }) => (
    <div
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-gray-200"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <Edit3 className="h-4 w-4 text-gray-400" />
      </div>
      {children}
    </div>
  );

  const Modal = ({ title, children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center space-x-2">
            {!editMode ? (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            )}
            <button
              onClick={closeModal}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  const renderField = (label, value, field) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {editMode ? (
        <input
          type="text"
          value={editData[field] || value || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
          {value || "N/A"}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Kid Profile Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Operation Data Card */}
          <InfoCard
            title="Enquiry Information"
            icon={User}
            onClick={() => openModal("operation", operationData)}
          >
            <div className="space-y-2">
              <p>
                <span className="font-medium">Parent:</span>{" "}
                {operationData.parentFirstName}
              </p>
              <p>
                <span className="font-medium">Status:</span>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {operationData.enquiryStatus}
                </span>
              </p>
              <p>
                <span className="font-medium">Type:</span>{" "}
                {operationData.enquiryType}
              </p>
            </div>
          </InfoCard>

          {/* Kid Information Card */}
          <InfoCard
            title="Kid Information"
            icon={User}
            onClick={() => openModal("kid", kid)}
          >
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {kid.kidsName}
              </p>
              <p>
                <span className="font-medium">Age:</span> {kid.age}
              </p>
              <p>
                <span className="font-medium">Chess ID:</span> {kid.chessId}
              </p>
              <p>
                <span className="font-medium">Gender:</span> {kid.gender}
              </p>
            </div>
          </InfoCard>

          {/* Parent Information Card */}
          <InfoCard
            title="Parent Information"
            icon={Phone}
            onClick={() => openModal("parent", parent)}
          >
            <div className="space-y-2">
              <p>
                <span className="font-medium">Mobile:</span>{" "}
                {parent.parentMobile}
              </p>
              <p>
                <span className="font-medium">Status:</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {parent.status}
                </span>
              </p>
              <p>
                <span className="font-medium">Kids Count:</span>{" "}
                {parent.kids?.length || 0}
              </p>
            </div>
          </InfoCard>

          {/* Payment Information Card */}
          <InfoCard
            title="Payment Information"
            icon={CreditCard}
            onClick={() => openModal("payment", classPayments[0])}
          >
            <div className="space-y-2">
              <p>
                <span className="font-medium">Amount:</span> ₹
                {classPayments[0]?.totalAmount}
              </p>
              <p>
                <span className="font-medium">Status:</span>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {classPayments[0]?.paymentStatus}
                </span>
              </p>
              <p>
                <span className="font-medium">Package:</span>{" "}
                {classPayments[0]?.selectedPackage}
              </p>
            </div>
          </InfoCard>

          {/* Classes Information Card */}
          <InfoCard
            title="Class Schedule"
            icon={Calendar}
            onClick={() => openModal("classes", selectedClasses[0])}
          >
            <div className="space-y-2">
              <p>
                <span className="font-medium">Total Classes:</span>{" "}
                {selectedClasses[0]?.generatedSchedule?.length || 0}
              </p>
              <p>
                <span className="font-medium">Next Class:</span>{" "}
                {selectedClasses[0]?.generatedSchedule?.[0]?.formattedDate ||
                  "N/A"}
              </p>
              <p>
                <span className="font-medium">Status:</span>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {selectedClasses[0]?.status}
                </span>
              </p>
            </div>
          </InfoCard>

          {/* Programs Card */}
          <InfoCard
            title="Programs"
            icon={BookOpen}
            onClick={() => openModal("programs", operationData.programs)}
          >
            <div className="space-y-2">
              {operationData.programs?.map((program, index) => (
                <div key={index}>
                  <p>
                    <span className="font-medium">Program:</span>{" "}
                    {program.program}
                  </p>
                  <p>
                    <span className="font-medium">Level:</span> {program.level}
                  </p>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>

        {/* Modals */}
        {activeModal === "operation" && (
          <Modal title="Enquiry Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField(
                "Parent First Name",
                operationData.parentFirstName,
                "parentFirstName"
              )}
              {renderField(
                "WhatsApp Number",
                operationData.whatsappNumber,
                "whatsappNumber"
              )}
              {renderField(
                "Enquiry Type",
                operationData.enquiryType,
                "enquiryType"
              )}
              {renderField(
                "Enquiry Status",
                operationData.enquiryStatus,
                "enquiryStatus"
              )}
              {renderField(
                "Disposition",
                operationData.disposition,
                "disposition"
              )}
              {renderField("Notes", operationData.notes, "notes")}
              {renderField(
                "Kid First Name",
                operationData.kidFirstName,
                "kidFirstName"
              )}
              {renderField(
                "Kid Last Name",
                operationData.kidLastName,
                "kidLastName"
              )}
              {renderField("Kids Age", operationData.kidsAge, "kidsAge")}
              {renderField(
                "Kids Gender",
                operationData.kidsGender,
                "kidsGender"
              )}
            </div>
          </Modal>
        )}

        {activeModal === "kid" && (
          <Modal title="Kid Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Name", kid.kidsName, "kidsName")}
              {renderField("Chess ID", kid.chessId, "chessId")}
              {renderField("Age", kid.age, "age")}
              {renderField("Gender", kid.gender, "gender")}
              {renderField("Status", kid.status, "status")}
              {renderField(
                "Total Classes Attended",
                kid.totalClassesAttended,
                "totalClassesAttended"
              )}
              {renderField(
                "Classes Remaining",
                kid.classesRemaining,
                "classesRemaining"
              )}
              {renderField(
                "Last Paid Amount",
                kid.lastPaidAmount,
                "lastPaidAmount"
              )}
              {renderField(
                "Total Paid Amount",
                kid.totalPaidAmount,
                "totalPaidAmount"
              )}
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Selected Programs</h4>
              {kid.selectedProgram?.map((program, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md mb-2">
                  <p>
                    <strong>Program:</strong> {program.program}
                  </p>
                  <p>
                    <strong>Level:</strong> {program.level}
                  </p>
                  <p>
                    <strong>Status:</strong> {program.pgmStatus}
                  </p>
                </div>
              ))}
            </div>
          </Modal>
        )}

        {activeModal === "parent" && (
          <Modal title="Parent Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField(
                "Mobile Number",
                parent.parentMobile,
                "parentMobile"
              )}
              {renderField("Role", parent.role, "role")}
              {renderField("Status", parent.status, "status")}
              {renderField("Type", parent.type, "type")}
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Associated Kids</h4>
              {parent.kids?.map((kidItem, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md mb-2">
                  <p>
                    <strong>Kid ID:</strong> {kidItem.kidId}
                  </p>
                </div>
              ))}
            </div>
          </Modal>
        )}

        {activeModal === "payment" && classPayments[0] && (
          <Modal title="Payment Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Kid Name", classPayments[0].kidName, "kidName")}
              {renderField(
                "WhatsApp Number",
                classPayments[0].whatsappNumber,
                "whatsappNumber"
              )}
              {renderField(
                "Class Mode",
                classPayments[0].classMode,
                "classMode"
              )}
              {renderField(
                "Base Amount",
                classPayments[0].baseAmount,
                "baseAmount"
              )}
              {renderField(
                "Total Amount",
                classPayments[0].totalAmount,
                "totalAmount"
              )}
              {renderField("Discount", classPayments[0].discount, "discount")}
              {renderField(
                "Package ID",
                classPayments[0].packageId,
                "packageId"
              )}
              {renderField(
                "Selected Package",
                classPayments[0].selectedPackage,
                "selectedPackage"
              )}
              {renderField(
                "Online Classes",
                classPayments[0].onlineClasses,
                "onlineClasses"
              )}
              {renderField(
                "Offline Classes",
                classPayments[0].offlineClasses,
                "offlineClasses"
              )}
              {renderField(
                "Payment ID",
                classPayments[0].paymentId,
                "paymentId"
              )}
              {renderField(
                "Transaction ID",
                classPayments[0].transactionId,
                "transactionId"
              )}
              {renderField(
                "Payment Status",
                classPayments[0].paymentStatus,
                "paymentStatus"
              )}
            </div>
          </Modal>
        )}

        {activeModal === "classes" && selectedClasses[0] && (
          <Modal title="Class Schedule">
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Student Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField(
                  "Student Name",
                  selectedClasses[0].studentName,
                  "studentName"
                )}
                {renderField("Status", selectedClasses[0].status, "status")}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-3">Selected Classes</h4>
              {selectedClasses[0].selectedClasses?.map((cls, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md mb-2">
                  <p>
                    <strong>Day:</strong> {cls.day}
                  </p>
                  <p>
                    <strong>Time:</strong> {cls.classTime}
                  </p>
                  <p>
                    <strong>Coach:</strong> {cls.coachName}
                  </p>
                  <p>
                    <strong>Type:</strong> {cls.type}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-semibold mb-3">Generated Schedule</h4>
              <div className="max-h-60 overflow-y-auto">
                {selectedClasses[0].generatedSchedule?.map(
                  (schedule, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md mb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p>
                            <strong>Session {schedule.sessionNumber}:</strong>{" "}
                            {schedule.day}
                          </p>
                          <p>
                            <strong>Date:</strong> {schedule.formattedDate}
                          </p>
                          <p>
                            <strong>Type:</strong> {schedule.type}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {schedule.status}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </Modal>
        )}

        {activeModal === "programs" && (
          <Modal title="Programs Information">
            {operationData.programs?.map((program, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField("Program", program.program, `program_${index}`)}
                  {renderField("Level", program.level, `level_${index}`)}
                  {renderField("Status", program.status, `status_${index}`)}
                  {renderField(
                    "Total Classes",
                    program.totalClass,
                    `totalClass_${index}`
                  )}
                  {renderField(
                    "Attended Classes",
                    program.attendedClass,
                    `attendedClass_${index}`
                  )}
                  {renderField(
                    "Remaining Classes",
                    program.remainingClass,
                    `remainingClass_${index}`
                  )}
                </div>
              </div>
            ))}
          </Modal>
        )}
      </div>
    </div>
  );
};

export default KidProfile;
