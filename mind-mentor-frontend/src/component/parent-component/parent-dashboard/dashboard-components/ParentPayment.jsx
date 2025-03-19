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
  const [error, setError] = useState(null);
  const parentId = localStorage.getItem("parentId");

  const decodePaymentData = (encodedData) => {
    try {
  
      const sanitizedData = encodedData
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(encodedData.length + ((4 - (encodedData.length % 4)) % 4), "=");

      const decodedString = atob(sanitizedData);
      const parsedData = JSON.parse(decodedString);
      console.log("parsedData", parsedData);

      return {
        enqId: parsedData.enqId || null, 
        kidId: parsedData.kidId,
        kidName: parsedData.kidName,
        amount: parsedData.totalAmount,
        classDetails: {
          name:
            parsedData.selectionType === "class"
              ? `${parsedData.selectedCenter} - ${parsedData.selectedClass}`
              : parsedData.kitItem,
          coach: "Not Specified", 
          day: parsedData.selectedClass || "Not Specified",
          classType: parsedData.selectedPackage,
          numberOfClasses: parsedData.offlineClasses + parsedData.onlineClasses,
          centerId:parsedData.centerId,
          centerName:parsedData.centerName
        },
        whatsappNumber: parsedData.whatsappNumber,
        selectionType: parsedData.selectionType,
        kitItem: parsedData.kitItem,
        baseAmount: parsedData.baseAmount,
        gstAmount: parsedData.gstAmount,
        programs: parsedData.programs,
        offlineClasses: parsedData.offlineClasses,
        onlineClasses: parsedData.onlineClasses,
        selectedCenter: parsedData.selectedCenter,
        selectedClass: parsedData.selectedClass,
        selectedPackage: parsedData.selectedPackage,
      };
    } catch (error) {
      console.error("Error decoding payment data:", error);
      return null;
    }
  };

  useEffect(() => {
    if (encodedData) {
      const decoded = decodePaymentData(encodedData);
      console.log("Decoded payment data:", decoded);
      if (decoded) {
        setPaymentData(decoded);
      } else {
        setError("Invalid payment data");
      }
    } else {
      setError("No payment data provided");
    }
  }, [encodedData]);
  console.log("paymentData", paymentData);

  const handleUpdatePayment = async () => {
    try {
      const amountInPaise = Math.round(paymentData.amount * 100);
      console.log(amountInPaise)

      const options = {
        key: RAZORPAY_KEY,
        amount: amountInPaise, 
        currency: "INR",
        name: "MindMentorz",
        description:
          paymentData.selectionType === "class"
            ? "Class Payment"
            : `Kit Payment - ${paymentData.kitItem}`,
        image: logo,
        handler: async (response) => {
          try {
            console.log("Response", response);
            const { razorpay_payment_id } = response;

            const savepayment = await savepaymentInfo(
              {
                ...paymentData,
                razorpay_payment_id: razorpay_payment_id,
              },
              razorpay_payment_id,
              parentId
            );
            console.log("Payment save response:", savepayment);

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

  if (error) {
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

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4 flex items-center justify-center">
        <div className="text-gray-600">Loading payment details...</div>
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
            {/* Class/Kit Details */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-purple-800">
                    {paymentData.selectedCenter} - {paymentData.selectedClass}
                  </p>
                  <p className="text-sm text-purple-600">
                    {paymentData.selectedPackage}
                  </p>
                  {paymentData.programs && paymentData.programs.length > 0 && (
                    <p className="text-sm text-purple-600">
                      Program: {paymentData.programs[0].program} (
                      {paymentData.programs[0].level})
                    </p>
                  )}
                </div>
                <span className="text-xl font-bold text-purple-700">
                  ₹{Math.round(paymentData.amount)}
                </span>
              </div>

              {/* Class Breakdown */}
              <div className="mt-4 text-sm text-purple-600 flex justify-between">
                <span>Offline Classes: {paymentData.offlineClasses}</span>
                <span>Online Classes: {paymentData.onlineClasses}</span>
              </div>

              {/* Enquiry ID */}
              {paymentData.enqId && (
                <div className="mt-2 text-xs text-gray-500">
                  Enquiry ID: {paymentData.enqId}
                </div>
              )}
            </div>

            {/* Payment Button */}
            <button
              onClick={handleUpdatePayment}
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
              <p className="text-sm text-gray-600">
                Base Amount: ₹{paymentData.baseAmount} | GST: ₹
                {paymentData.gstAmount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentPayment;
