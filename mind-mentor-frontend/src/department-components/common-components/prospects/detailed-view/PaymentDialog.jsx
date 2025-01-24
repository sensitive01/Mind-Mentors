import { useState } from "react";
import { Send, X } from "lucide-react";
import { formatWhatsAppNumber } from "../../../../utils/formatContacts";
import { sendPaymentDetailsLink } from "../../../../api/service/employee/EmployeeService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const PaymentDialog = ({ open, onClose, data }) => {
  const navigate = useNavigate();

  // State variables
  const [selectionType, setSelectionType] = useState("class");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [numberOfClasses, setNumberOfClasses] = useState(0);
  const [isGoldMember, setIsGoldMember] = useState(false);
  const [kitItem, setKitItem] = useState("");
  const [customAmount, setCustomAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  // const [paymentDetails, setPaymentDetails] = useState({
  //   paymentMode: "",
  // });

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
        },
        {
          duration: "2 months",
          classes: 16,
          baseAmount: 6000,
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
        },
        {
          duration: "2 months",
          classes: 16,
          baseAmount: 6000,
        },
      ],
    },
  ];

  const calculateTotalAmount = () => {
    const baseAmount = customAmount;
    const discountAmount = baseAmount * (discount / 100);
    const taxAmount = baseAmount * (tax / 100);
    const totalAmount = baseAmount - discountAmount + taxAmount;
    return {
      baseAmount,
      discountAmount,
      taxAmount,
      totalAmount,
    };
  };

  const handlePlanSelection = (plan) => {
    if (selectionType === "class") {
      setSelectedPlan(plan);
      setNumberOfClasses(plan.classes);
      setCustomAmount(plan.baseAmount);
    }
  };

  const handleContinuePayment = async () => {
    try {
      const link = generatePaymentLink();
      console.log("Generated payment link:", link);

      console.log("Sending payment link for ID:", data?._id);

      const response = await sendPaymentDetailsLink(link, data?._id);
      console.log("Response from backend:", response);

      if (response.status === 200) {
        toast.success(response.data.message);
        onClose();
      } else {
        toast.error("Something went wrong, please try again later.");
      }
    } catch (error) {
      console.error("Error in continuing payment:", error);
      toast.error("An error occurred, please try again.");
    }
  };

  // const showRazorpay = async (amount) => {
  //   try {
  //     const options = {
  //       key: RAZORPAY_KEY,
  //       amount: amount * 100,
  //       currency: "INR",
  //       name: "MindMentorz",
  //       description: "Class Payment",
  //       image: logo,
  //       handler: async () => {
  //         try {
  //           Swal.fire({
  //             title: "Payment Done Successfully",
  //             icon: "success",
  //             confirmButtonText: "OK",
  //           });
  //         } catch (err) {
  //           console.log("Error in verify order", err);
  //         }
  //       },
  //       theme: {
  //         color: "#3399cc",
  //       },
  //     };

  //     const razorpay = new window.Razorpay(options);
  //     console.log("Razorpay open", razorpay);
  //     razorpay.open();
  //   } catch (error) {
  //     console.error("Error in fetching order URL:", error);
  //   }
  // };

  // const handleInputChange = (field, value) => {
  //   setPaymentDetails((prev) => ({ ...prev, [field]: value }));
  // };

  const generatePaymentLink = () => {
    if (selectedPlan) {
      const { totalAmount } = calculateTotalAmount();
      const linkData = {
        enqId:data._id,
        kidId:data?.kidId,
        kidName: data?.kidName,
        whatsappNumber: data?.whatsappNumber,
        selectionType,
        classDetails:
          selectionType === "class"
            ? {
                name: selectedSchedule?.name,
                coach: selectedSchedule?.coach,
                day: selectedSchedule?.day,
                numberOfClasses,
                isGoldMember,
              }
            : null,
        kitItem: selectionType === "kit" ? kitItem : null,
        amount: totalAmount,
        timestamp: new Date().toISOString(),
      };

      const encodedData = btoa(JSON.stringify(linkData));
      // return `${window.location.origin}/payment/${encodedData}`;
      return `/payment/${encodedData}`;
    }
    return "";
  };

  const selectedSchedule = classSchedules.find(
    (c) => c.id === parseInt(selectedClass)
  );

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full max-w-sm transform ${
        open ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out bg-white shadow-lg`}
    >
      <div className="flex flex-col h-full">
        {/* Fixed Header */}
        <div className="flex-none bg-gradient-to-r from-[#642b8f] to-[#aa88be] px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Pay</h2>
          <button onClick={onClose} className="text-white hover:opacity-80">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-[#f8f9fa]">
          <div className="p-6 space-y-4">
            {/* Kid Details Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 block mb-1">
                    Kid Name
                  </label>
                  <p className="font-medium text-gray-900">
                    {data?.kidName || "N/A"}
                  </p>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600 block mb-1">
                    Program
                  </label>
                  <p className="font-medium text-gray-900">
                    {data?.program || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex gap-6 mt-2">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 block mb-1">
                    Level
                  </label>
                  <p className="font-medium text-gray-900">
                    {data?.level || "N/A"}
                  </p>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600 block mb-1">
                    Mobile
                  </label>
                  <p className="font-medium text-gray-900">
                    {formatWhatsAppNumber(data?.whatsappNumber) || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            {/* Selection Type Radio Buttons */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="classSelection"
                    name="selectionType"
                    checked={selectionType === "class"}
                    onChange={() => setSelectionType("class")}
                    className="mr-2"
                  />
                  <label htmlFor="classSelection">Class</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="kitSelection"
                    name="selectionType"
                    checked={selectionType === "kit"}
                    onChange={() => setSelectionType("kit")}
                    className="mr-2"
                  />
                  <label htmlFor="kitSelection">Kit/Items</label>
                </div>
              </div>

              {/* Class Selection */}
              {selectionType === "class" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Class Schedule
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 px-4 py-2"
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
                                selectedPlan &&
                                selectedPlan.baseAmount === plan.baseAmount
                              }
                              onChange={() => handlePlanSelection(plan)}
                            />
                            <label
                              htmlFor={`plan-${index}`}
                              className="ml-3 flex-1"
                            >
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {plan.duration} of {plan.classes} classes
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Base amount: ₹{plan.baseAmount}
                                  </p>
                                </div>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPlan && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Classes
                        </label>
                        <input
                          type="number"
                          value={numberOfClasses}
                          onChange={(e) =>
                            setNumberOfClasses(parseInt(e.target.value))
                          }
                          className="block w-full rounded-md border border-gray-300 px-4 py-2"
                        />
                      </div>

                      {data?.level === "Advanced" && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="goldMembership"
                            checked={isGoldMember}
                            onChange={() => setIsGoldMember(!isGoldMember)}
                            className="mr-2"
                          />
                          <label htmlFor="goldMembership" className="text-sm">
                            Gold Membership
                          </label>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Kit/Items Selection */}
              {selectionType === "kit" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Kit/Item Details
                  </label>
                  <input
                    type="text"
                    value={kitItem}
                    onChange={(e) => setKitItem(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2"
                  />
                </div>
              )}
            </div>
            {/* Financial Calculations Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan Amount</span>
                  <span className="font-bold">₹{customAmount}</span>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value))}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    value={tax}
                    onChange={(e) => setTax(parseFloat(e.target.value))}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2"
                  />
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount Amount</span>
                    <span>
                      ₹{calculateTotalAmount().discountAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax Amount</span>
                    <span>₹{calculateTotalAmount().taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">
                      Total Amount
                    </span>
                    <span className="font-bold text-purple-600">
                      ₹{calculateTotalAmount().totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>{" "}
            {generatePaymentLink() && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="text-sm text-gray-600 block mb-2">
                  Generated Payment Link
                </label>
                <div className="p-3 bg-purple-50 rounded-md break-all font-mono text-sm border border-purple-100">
                  {generatePaymentLink()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-none border-t border-gray-200 p-4 bg-white">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleContinuePayment}
              disabled={
                !(
                  (selectionType === "class" && selectedPlan) ||
                  (selectionType === "kit" && kitItem)
                )
              }
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        style={{ marginTop: "60px" }} // Adjust the value as needed
      />
    </div>
  );
};

export default PaymentDialog;
