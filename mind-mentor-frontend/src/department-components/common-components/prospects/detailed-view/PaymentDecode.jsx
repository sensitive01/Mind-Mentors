import React, { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import { useParams } from "react-router-dom";
import { formatWhatsAppNumber } from "../../../../utils/formatContacts";

const PaymentDecode = () => {
  const { encodedData } = useParams();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  const classSchedules = [
    {
      id: 1,
      name: "Online night class (7pm to 8pm)",
      coach: "Awinraj",
      day: "Monday",
      plans: [
        {
          duration: "1 month",
          classes: 8,
          baseAmount: 3250,
          gst: 585,
          total: 3835,
        },
        {
          duration: "2 months",
          classes: 16,
          baseAmount: 6000,
          gst: 1080,
          total: 7080,
        },
      ],
    },
    {
      id: 2,
      name: "Online morning class (10am to 11am)",
      coach: "Rajesh",
      day: "Wednesday",
      plans: [
        {
          duration: "1 month",
          classes: 8,
          baseAmount: 3250,
          gst: 585,
          total: 3835,
        },
        {
          duration: "2 months",
          classes: 16,
          baseAmount: 6000,
          gst: 1080,
          total: 7080,
        },
      ],
    },
  ];

  const decodePaymentData = (encodedData) => {
    try {
      const decodedString = atob(encodedData);
      const paymentData = JSON.parse(decodedString);
      return paymentData;
    } catch (error) {
      console.error("Error decoding payment data:", error);
      return null;
    }
  };

  const paymentData = decodePaymentData(encodedData);

  useEffect(() => {
    if (paymentData && paymentData.amount) {
      // Find the matching plan based on the decoded amount
      for (const schedule of classSchedules) {
        const matchingPlan = schedule.plans.find(
          (plan) => plan.baseAmount === paymentData.amount
        );
        if (matchingPlan) {
          setSelectedClass(schedule.id.toString());
          setSelectedPlan(matchingPlan);
          setCalculatedAmount(matchingPlan.total);
          break;
        }
      }
    }
  }, [paymentData]);

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Invalid Payment Link
          </h2>
          <p className="text-gray-600">
            The payment link appears to be invalid or expired.
          </p>
        </div>
      </div>
    );
  }

  const { kidName, whatsappNumber, paymentMode } = paymentData;
  const selectedSchedule = classSchedules.find(
    (c) => c.id === parseInt(selectedClass)
  );

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
    setCalculatedAmount(plan.total);
  };

  const handleMakePayment = () => {
    console.log("Processing payment:", {
      ...paymentData,
      selectedClass: selectedSchedule,
      selectedPlan,
      finalAmount: calculatedAmount,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] px-6 py-4">
            <div className="text-white">
              <h1 className="text-xl font-semibold mb-1">Course </h1>
              <p className="text-sm opacity-90">{kidName}</p>
              <p className="text-sm opacity-90">
                {formatWhatsAppNumber(whatsappNumber)}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please choose the type of Plan
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select a class schedule</option>
                {classSchedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.name} by {schedule.coach} on {schedule.day}
                  </option>
                ))}
              </select>
            </div>

            {selectedSchedule && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Plans
                </label>
                <div className="space-y-3">
                  {selectedSchedule.plans.map((plan, index) => (
                    <div
                      key={index}
                      className="flex items-start cursor-pointer"
                      onClick={() => handlePlanSelection(plan)}
                    >
                      <input
                        type="radio"
                        name="plan"
                        id={`plan-${index}`}
                        className="mt-1"
                        checked={
                          selectedPlan && selectedPlan.total === plan.total
                        }
                        onChange={() => handlePlanSelection(plan)}
                      />
                      <label htmlFor={`plan-${index}`} className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {plan.duration} of {plan.classes} classes
                            </p>
                            <p className="text-sm text-gray-500">
                              Base amount: ₹{plan.baseAmount}
                            </p>
                            <p className="text-sm text-gray-500">
                              GST (18%): ₹{plan.gst}
                            </p>
                          </div>
                          <p className="text-lg font-semibold text-purple-600">
                            ₹{plan.total}
                          </p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Mode</span>
                <span className="font-medium capitalize">{paymentMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold text-purple-600">
                  ₹{calculatedAmount}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={handleMakePayment}
              disabled={!selectedPlan}
              className="w-full bg-gradient-to-r from-[#642b8f] to-[#aa88be] text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-5 h-5" />
              <span>Make Payment</span>
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Secure payment powered by your institution</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentDecode;
