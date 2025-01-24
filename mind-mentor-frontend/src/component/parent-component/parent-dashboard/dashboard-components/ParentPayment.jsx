import React, { useState, useEffect } from "react";
import { Check, CreditCard } from "lucide-react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { savepaymentInfo } from "../../../../api/service/parent/ParentService";
import { useNavigate } from "react-router-dom";

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;
import logo from "../../../../assets/mindmentorz.png";

const ParentPayment = () => {
  const navigate = useNavigate();
  const { encodedData } = useParams();
  const [paymentData, setPaymentData] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMode: "",
  });
  const parentId = localStorage.getItem("parentId");

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
      console.log(decoded);
      if (decoded) {
        setPaymentData(decoded);
      }
    }
  }, [encodedData]);

  const handleUpdatePayment = async () => {
    try {
      const options = {
        key: RAZORPAY_KEY,
        amount: paymentData.amount * 100, // Amount in the smallest unit (paise)
        currency: "INR",
        name: "MindMentorz",
        description: "Class Payment",
        image: logo,
        handler: async (response) => {
          try {
            const { razorpay_payment_id } = response;

            const savepayment = await savepaymentInfo(
              paymentData,
              paymentDetails,
              razorpay_payment_id,
              parentId
            );
            console.log(savepayment);

            if (savepayment.status === 201) {
              Swal.fire({
                title: "Payment Done Successfully",

                icon: "success",
                confirmButtonText: "OK",
              }).then(() => {
             
                navigate(`/parent/kid/attendance/${paymentData.kidId}`);
              });
            } else {
              Swal.fire({
                title: "Payment Success, but failed to record!",
                text: "Please contact support.",
                icon: "warning",
                confirmButtonText: "OK",
              });
            }
          } catch (err) {
            console.error(
              "Error in verifying payment or updating status:",
              err
            );
            Swal.fire({
              title: "Payment Success, but an error occurred!",
              text: "Please contact support.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);

      // Handle payment failure
      razorpay.on("payment.failed", (response) => {
        Swal.fire({
          title: "Payment Failed",
          text: `Reason: ${response.error.description}`,
          icon: "error",
          confirmButtonText: "Retry",
        });
      });

      razorpay.open();
    } catch (error) {
      console.error("Error in fetching order URL:", error);
      Swal.fire({
        title: "Error",
        text: "Unable to initiate payment. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleInputChange = (field, value) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-purple-600 mb-2">
            Invalid Payment Link
          </h2>
          <p className="text-gray-600">
            Please check the payment link and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-400 px-6 py-5 text-white">
            <h1 className="text-2xl font-bold mb-1">Payment Details</h1>
            <p className="text-sm opacity-90">{paymentData.kidName}</p>
          </div>

          {/* Payment Content */}
          <div className="p-6 space-y-6">
            {/* Class Details */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-purple-800">
                    {paymentData.classDetails?.name || "No Class Selected"}
                  </p>
                  <p className="text-sm text-purple-600">
                    {paymentData.classDetails?.coach} |{" "}
                    {paymentData.classDetails?.day}
                  </p>
                </div>
                <span className="text-xl font-bold text-purple-700">
                  ₹{Math.round(paymentData.amount)}
                </span>
              </div>
            </div>

            {/* Payment Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Mode
              </label>
              <select
                value={paymentDetails.paymentMode}
                onChange={(e) =>
                  handleInputChange("paymentMode", e.target.value)
                }
                className="w-full rounded-lg border-purple-300 focus:ring-purple-500 focus:border-purple-500 py-2 px-3"
              >
                <option value="">Select Payment Mode</option>
                {paymentModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Button */}
            <button
              onClick={handleUpdatePayment}
              disabled={!paymentDetails.paymentMode}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold 
                         hover:bg-purple-700 transition-colors duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed 
                         flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Confirm Payment
            </button>

            {/* Total Amount */}
            <div className="border-t border-purple-200 pt-4 text-center">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-purple-700">
                ₹{Math.round(paymentData.amount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentPayment;
