import React, { useEffect, useState } from "react";
import { X, Check, Upload, AlertTriangle } from "lucide-react";
import { formatWhatsAppNumber } from "../../../../utils/formatContacts";
import {sendPaymentUpdations} from "../../../../api/service/employee/EmployeeService"

const PaymentVerification = ({ open, onCancel, data, physicalCenter }) => {
  const [paymentMode, setPaymentMode] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedCenterName, setSelectedCenterName] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [showCenterChangeModal, setShowCenterChangeModal] = useState(false);
  const [originalCenter, setOriginalCenter] = useState(null);
  const [newCenter, setNewCenter] = useState(null);
  

  console.log("physicalCenter", physicalCenter);

  // Safely decode and parse the data with error handling
  const getPaymentData = () => {
    try {
      const cleanUrl = data?.replace("/payment-details/", "") || "";
      if (!cleanUrl) return null;

      const decodedString = atob(cleanUrl);
      return JSON.parse(decodedString);
    } catch (error) {
      console.error("Error parsing payment data:", error);
      return null;
    }
  };

  const paymentData = getPaymentData() || {
    kidName: "",
    whatsappNumber: "",
    programs: [{ program: "", level: "" }],
    totalAmount: 0,
    selectedCenter: "",
    selectedPackage: "",
  };
  console.log("Payment data", paymentData);

  // Find center name by ID
  const getCenterNameById = (centerId) => {
    const center = physicalCenter?.find((c) => c._id === centerId);
    return center ? center.centerName : "Unknown Center";
  };

  // Handle center selection
  const handleCenterChange = (e) => {
    const newCenterId = e.target.value;
    console.log("newCenterId", newCenterId);

    // Find center name
    const centerName = getCenterNameById(newCenterId);

    // If payment data has a center and it's different from selected one
    if (
      paymentData.centerId &&
      newCenterId &&
      paymentData.centerId !== newCenterId
    ) {
      setOriginalCenter({
        id: paymentData.centerId,
        name: paymentData.centerName || getCenterNameById(paymentData.centerId),
      });

      setNewCenter({
        id: newCenterId,
        name: centerName,
      });

      setShowCenterChangeModal(true);
    } else {
      setSelectedCenter(newCenterId);
      setSelectedCenterName(centerName);
    }
  };

  // Confirm center change
  const confirmCenterChange = () => {
    setSelectedCenter(newCenter.id);
    setSelectedCenterName(newCenter.name);
    setShowCenterChangeModal(false);
  };

  // Cancel center change
  const cancelCenterChange = () => {
    setShowCenterChangeModal(false);
    // Reset to original center if any
    if (paymentData.centerId) {
      setSelectedCenter(paymentData.centerId);
      setSelectedCenterName(
        paymentData.centerName || getCenterNameById(paymentData.centerId)
      );
    } else {
      setSelectedCenter("");
      setSelectedCenterName("");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "application/pdf"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert("Please upload only JPG, PNG or PDF files");
        return;
      }

      if (file.size > maxSize) {
        alert("File size should be less than 5MB");
        return;
      }

      setProofFile(file);
    }
  };

  const handleSubmit = async() => {
    const paymentDetails = {
      paymentMode,
      center: paymentMode === "cash" ? selectedCenter : null,
      centerName: paymentMode === "cash" ? selectedCenterName : null,
      transactionId: paymentMode === "online" ? transactionId : null,
      proofFile: paymentMode === "online" ? proofFile : null,
      originalData: paymentData,
    };

    // Validate required fields before submission
    if (paymentMode === "cash" && !selectedCenter) {
      alert("Please select a center for cash payment");
      return;
    }

    if (paymentMode === "online" && (!transactionId || !proofFile)) {
      alert(
        "Please provide both transaction ID and payment proof for online payment"
      );
      return;
    }

    console.log(paymentDetails);
    const response = await sendPaymentUpdations (paymentDetails)
    console.log("Response",response)
    // Add your API call here
  };

  const isSubmitDisabled =
    !paymentMode ||
    (paymentMode === "cash" && !selectedCenter) ||
    (paymentMode === "online" && (!transactionId || !proofFile));

  // Determine button text based on payment mode
  const getButtonText = () => {
    if (paymentMode === "cash") {
      return "Confirm";
    }
    return "Verify Payment";
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-sm transform ${
          open ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out bg-white shadow-lg z-20`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-none bg-gradient-to-r from-[#642b8f] to-[#aa88be] px-6 py-4 flex justify-between items-center">
            <h2 className="text-white text-xl font-semibold">
              Payment Verification
            </h2>
            <button
              onClick={onCancel}
              className="text-white hover:opacity-80"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#f8f9fa] p-6 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Kid Name:</span>
                <span className="font-medium">
                  {paymentData.kidName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">WhatsApp Number:</span>
                <span className="font-medium">
                  {formatWhatsAppNumber(paymentData.whatsappNumber) || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Program:</span>
                <span className="font-medium">
                  {paymentData.programs?.[0]?.program || "N/A"} -{" "}
                  {paymentData.programs?.[0]?.level || ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-purple-600">
                  ₹{paymentData.totalAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Selected Center:</span>
                <span className="font-medium">
                  {paymentData.centerName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Selected Package:</span>
                <span className="font-medium">
                  {paymentData.selectedPackage || "N/A"}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
              <fieldset>
                <legend className="text-sm font-medium text-gray-700 mb-2">
                  Payment Mode
                </legend>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="cash"
                      checked={paymentMode === "cash"}
                      onChange={() => setPaymentMode("cash")}
                      className="mr-2"
                    />
                    Cash
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="online"
                      checked={paymentMode === "online"}
                      onChange={() => setPaymentMode("online")}
                      className="mr-2"
                    />
                    Online
                  </label>
                </div>
              </fieldset>

              {paymentMode === "cash" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Physical Center
                  </label>
                  <select
                    value={selectedCenter}
                    onChange={handleCenterChange}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2"
                  >
                    <option value="">Select center</option>
                    {physicalCenter && physicalCenter.length > 0 ? (
                      physicalCenter.map((center) => (
                        <option key={center._id} value={center._id}>
                          {center.centerName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No centers available</option>
                    )}
                  </select>
                </div>
              )}

              {paymentMode === "online" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 px-4 py-2"
                      placeholder="Enter transaction ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Proof
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        id="proofUpload"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="proofUpload"
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload File
                      </label>
                      {proofFile && (
                        <span className="text-sm text-gray-600">
                          {proofFile.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-none border-t border-gray-200 p-4 bg-white">
            <div className="flex justify-end space-x-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Check className="w-4 h-4 mr-2" />
                {getButtonText()}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Center Change Confirmation Modal */}
      {showCenterChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4 text-amber-600">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">
                Center Change Confirmation
              </h3>
            </div>

            <div className="mb-6">
              <p className="mb-4">You are changing the payment center from:</p>
              <div className="mb-2 p-2 bg-gray-50 rounded-md">
                <p className="font-semibold">{originalCenter?.name}</p>
              </div>

              <p className="mb-2">to:</p>
              <div className="p-2 bg-purple-50 rounded-md">
                <p className="font-semibold text-purple-700">
                  {newCenter?.name}
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              Are you sure you want to change the payment center?
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelCenterChange}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmCenterChange}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentVerification;
