import React, { useState, useEffect } from "react";
import { CreditCard, Check } from "lucide-react";
import { useParams } from "react-router-dom";
import logo from "../../../../assets/mindmentorz.png";
import Swal from "sweetalert2";

const PaymentDecode = () => {
  const { encodedData } = useParams();
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMode: "",
    transactionId: "",
    paymentDate: null,
  });

  const paymentModes = [
    { value: "upi", label: "UPI" },
    { value: "netBanking", label: "Net Banking" },
    { value: "card", label: "Card" },
    { value: "cash", label: "Cash" },
  ];

  const decodePaymentData = (encodedData) => {
    try {
      const decodedString = atob(encodedData);
      return JSON.parse(decodedString);
    } catch (error) {
      console.error("Error decoding payment data:", error);
      return null;
    }
  };

  useEffect(() => {
    if (encodedData) {
      const decoded = decodePaymentData(encodedData);
      if (decoded) {
        setPaymentData(decoded);
      }
    }
  }, [encodedData]);

  const handleUpdatePayment = () => {
    // Implement your update logic here
    const updatedPaymentData = {
      ...paymentData,
      ...paymentDetails,
      status: "success",
    };

    try {
      // Replace with actual API call to update payment
      // updatePaymentDetails(updatedPaymentData)
      setPaymentStatus("success");
      Swal.fire({
        title: "Payment Details Updated",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Update Failed",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleInputChange = (field, value) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [field]: value,
      paymentDate: new Date(),
    }));
  };

  const formatWhatsAppNumber = (number) => {
    if (!number) return "N/A";
    return number.length === 10
      ? `+91 ${number.slice(0, 5)} ${number.slice(5)}`
      : number;
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Invalid Payment Link
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] px-6 py-4">
            <div className="text-white">
              <h1 className="text-xl font-semibold mb-1">Payment Details</h1>
              <p className="text-sm opacity-90">{paymentData.kidName}</p>
              <p className="text-sm opacity-90">
                {formatWhatsAppNumber(paymentData.whatsappNumber)}
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-6 space-y-4">
            {/* Existing payment data display */}
            <div className="bg-gray-100 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">
                    {paymentData.classDetails?.name || "No Class Selected"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {paymentData.classDetails?.coach} |{" "}
                    {paymentData.classDetails?.day}
                  </p>
                </div>
                <span className="text-sm font-semibold">
                  ₹{Math.round(paymentData.amount)}
                </span>
              </div>
            </div>

            {/* Payment Status Section */}
            {paymentStatus === "pending" && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-center">
                <span className="text-yellow-800">
                  Pending Payment Confirmation
                </span>
              </div>
            )}
{/* 
            {paymentStatus === "success" && ( */}
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center">
                  <Check className="w-6 h-6 text-green-600 mr-2" />
                  <span className="text-green-800">Payment Confirmed</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={paymentDetails.paymentMode}
                    onChange={(e) =>
                      handleInputChange("paymentMode", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="">Select Payment Mode</option>
                    {paymentModes.map((mode) => (
                      <option key={mode.value} value={mode.value}>
                        {mode.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.transactionId}
                    onChange={(e) =>
                      handleInputChange("transactionId", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Enter Transaction ID"
                  />
                </div>

                <button
                  onClick={handleUpdatePayment}
                  disabled={
                    !paymentDetails.paymentMode || !paymentDetails.transactionId
                  }
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
                >
                  Update Payment Details
                </button>
              </div>
            {/* )} */}

            {/* Total Amount */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold text-purple-600">
                  ₹{Math.round(paymentData.amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDecode;
