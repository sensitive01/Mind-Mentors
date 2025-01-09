import React, { useState } from "react";
import Joyride from "react-joyride";
import addEnquiryImg from "../../../images/enrollmentSteps/step1.png";
import statusUpdateImg from "../../../images/enrollmentSteps/step2.png";
import addNotesImg from "../../../images/enrollmentSteps/step3.png";
import moveToProspectsImg from "../../../images/enrollmentSteps/step4.png";
import scheduleDemoImg from "../../../images/enrollmentSteps/step6.png";
import updatePaymentImg from "../../../images/enrollmentSteps/step8.png";

const WalkThroughComponent = () => {
  const [run, setRun] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  const steps = [
    {
      target: ".add-enquiry-btn",
      content:
        "Step 1: Add a new enquiry by clicking the New button in the enquiry list table.",
      placement: "bottom",
      disableBeacon: true,
    },
    {
      target: ".status-update-btn",
      content:
        "Step 2: Update the status of an enquiry from warm to cold in enquiry list table .",
      placement: "bottom",
    },
    {
      target: ".notes-section",
      content: "Step 3: Add notes for the enquiry form in this section.",
      placement: "bottom",
    },
    {
      target: ".move-to-prospects-btn",
      content:
        "Step 4: Move the enquiry to the 'Prospects'  stage for status updation.",
      placement: "bottom",
    },
    {
      target: ".schedule-demo-btn",
      content:
        "Step 5: Schedule a demo class for the student in the prospect here by clicking the add kid button.",
      placement: "bottom",
    },
    {
      target: ".attendance-update-btn",
      content:
        "Step 6:The list of students who attended the demo class will appear on this page. Please select the students and confirm the attendance",
      placement: "bottom",
    },
    {
      target: ".payment-status-btn",
      content:
        "Step 7: After the successful conduction of the demo class, the coach will provide feedback and update the attendance. The list of students who attended the class will be displayed on the invoice page, along with a payment confirmation button to verify the payment status.",
      placement: "bottom",
    },
  ];

  const handleButtonClick = (action) => {
    showNotification(`${action} action initiated`);
  };

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: "" });
    }, 3000);
  };

  const handleJoyrideCallback = (data) => {
    const { status, index } = data;
    setStepIndex(index);
    if (status === "finished" || status === "skipped") {
      setRun(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg animate-notification">
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Enrollment Process Walkthrough
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Follow this step-by-step guide to manage the complete enrollment
          process from initial enquiry to payment confirmation.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Step Cards */}
        <StepCard
          number="1"
          title="Add Enquiry"
          image={addEnquiryImg}
          description="Start the enrollment process by adding a new student enquiry to the system."
          buttonClass="add-enquiry-btn"
          buttonText="Add Enquiry"
          onClick={() => handleButtonClick("Add Enquiry")}
          accent="blue"
        />

        <StepCard
          number="2"
          title="Update Status"
          image={statusUpdateImg}
          description="Track the progress by updating the current status of the enquiry."
          buttonClass="status-update-btn"
          buttonText="Update Status"
          onClick={() => handleButtonClick("Update Status")}
          accent="green"
        />

        <StepCard
          number="3"
          title="Add Notes"
          image={addNotesImg}
          description="Record important information and observations about the enquiry."
          isTextArea={true}
          buttonClass="notes-section"
          accent="purple"
        />

        <StepCard
          number="4"
          title="Move to Prospects"
          image={moveToProspectsImg}
          description="Convert qualified enquiries to the prospects stage for further processing."
          buttonClass="move-to-prospects-btn"
          buttonText="Move to Prospects"
          onClick={() => handleButtonClick("Move to Prospects")}
          accent="orange"
        />

        <StepCard
          number="5"
          title="Schedule Demo"
          image={scheduleDemoImg}
          description="Schedule a demo class for interested prospects to experience our teaching."
          buttonClass="schedule-demo-btn"
          buttonText="Schedule Demo"
          onClick={() => handleButtonClick("Schedule Demo")}
          accent="indigo"
        />

        <StepCard
          number="6"
          title="Update Payment"
          image={updatePaymentImg}
          description="Record and update payment information after receiving payment."
          buttonClass="payment-status-btn"
          buttonText="Update Payment"
          onClick={() => handleButtonClick("Update Payment")}
          accent="teal"
        />
      </div>

      {/* Tour Guide */}
      <Joyride
        steps={steps}
        run={run}
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: "#3b82f6",
            backgroundColor: "#ffffff",
            textColor: "#1f2937",
          },
        }}
      />

      <style jsx>{`
        @keyframes slideIn {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            transform: translateY(0);
            opacity: 1;
          }
          90% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
        .animate-notification {
          animation: slideIn 3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

// Step Card Component
const StepCard = ({
  number,
  title,
  image,
  description,
  buttonClass,
  buttonText,
  onClick,
  isTextArea,
  accent,
}) => {
  const accentColors = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    orange: "bg-orange-500 hover:bg-orange-600",
    indigo: "bg-indigo-500 hover:bg-indigo-600",
    pink: "bg-pink-500 hover:bg-pink-600",
    teal: "bg-teal-500 hover:bg-teal-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
          <span className="text-gray-700 font-semibold">{number}</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        {isTextArea ? (
          <textarea
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${buttonClass}`}
            placeholder="Add your notes here..."
            rows="3"
          />
        ) : (
          <button
            onClick={onClick}
            className={`w-full py-3 px-4 rounded-lg text-white transition-colors ${buttonClass} ${accentColors[accent]}`}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default WalkThroughComponent;
