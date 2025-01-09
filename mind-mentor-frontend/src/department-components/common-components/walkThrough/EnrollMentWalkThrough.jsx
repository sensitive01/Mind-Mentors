import React, { useState } from "react";
import Joyride from "react-joyride";

const WalkthroughGuide = () => {
  const [run, setRun] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  const steps = [
    {
      target: ".add-enquiry-btn",
      content: "Step 1: Add a new enquiry by clicking this button.",
      placement: "bottom",
      disableBeacon: true,
    },
    {
      target: ".status-update-btn",
      content: "Step 2: Update the status of an enquiry here.",
      placement: "bottom",
    },
    {
      target: ".notes-section",
      content: "Step 3: Add notes for the enquiry in this section.",
      placement: "bottom",
    },
    {
      target: ".move-to-prospects-btn",
      content: "Step 4: Move the enquiry to the 'Prospects' stage.",
      placement: "bottom",
    },
    {
      target: ".schedule-demo-btn",
      content: "Step 5: Schedule a demo class for the prospect here.",
      placement: "bottom",
    },
    {
      target: ".attendance-update-btn",
      content: "Step 6: After conducting the demo class, update attendance.",
      placement: "bottom",
    },
    {
      target: ".payment-status-btn",
      content: "Step 7: Update the payment status after successful payment.",
      placement: "bottom",
    },
  ];

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: "" });
    }, 3000);
  };

  const handleJoyrideCallback = (data) => {
    const { status, index } = data;
    setStepIndex(index);

    // Status values: 'running', 'paused', 'skipped', 'finished'
    if (status === "finished" || status === "skipped") {
      setRun(false);
    }
  };

  const restartTour = () => {
    setStepIndex(0);
    setRun(true);
  };

  return (
    <div className="relative">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg animate-notification">
          {notification.message}
        </div>
      )}

      {/* Tour Guide */}
      <Joyride
        steps={steps}
        run={run}
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        stepIndex={stepIndex}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: "#3b82f6",
            backgroundColor: "#ffffff",
            arrowColor: "#ffffff",
            textColor: "#1f2937",
          },
          tooltip: {
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
          tooltipContainer: {
            textAlign: "left",
            padding: "12px",
          },
          tooltipTitle: {
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "8px",
          },
          buttonNext: {
            backgroundColor: "#3b82f6",
            borderRadius: "6px",
            color: "#ffffff",
            padding: "8px 16px",
          },
          buttonBack: {
            marginRight: "8px",
            padding: "8px 16px",
            color: "#3b82f6",
            border: "1px solid #3b82f6",
            borderRadius: "6px",
          },
          buttonSkip: {
            color: "#6b7280",
          },
        }}
        floaterProps={{
          disableAnimation: true,
          styles: {
            floater: {
              filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
            },
          },
        }}
      />

      {/* Restart Tour Button */}
      {!run && (
        <button
          onClick={restartTour}
          className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
        >
          Restart Tour
        </button>
      )}

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

export default WalkthroughGuide;
