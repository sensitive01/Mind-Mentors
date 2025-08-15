import React, { useEffect, useState } from "react";
import { Check, ChevronRight, Lock } from "lucide-react";
import { getEnrollementStageSteps } from "../../../../../api/service/parent/ParentService";

const EnrollmentCompletionStage = ({ enrollmentData, kidId }) => {
  console.log("enrollmentData", enrollmentData);

  const [steps, setSteps] = useState([
    {
      id: 1,
      title: "Profile",
      fullTitle: "Parent Profile Completion",
      completed: false,
      route: "/parent/profile",
      dataKey: "isParentNameCompleted",
    },
    {
      id: 2,
      title: "Register Kid",
      fullTitle: "Register Your Kid",
      completed: false,
      route: "/parent/add-kid",
      dataKey: "isFirstKidAdded",
    },
    {
      id: 3,
      title: "Choose Program",
      fullTitle: "Choose Kid Program and Level",
      completed: false,
      route: "/parent/select-program",
      dataKey: "isProgramSelected",
    },
    {
      id: 4,
      title: "Demo Class",
      fullTitle: "Schedule Demo Class",
      completed: false,
      route: "/parent/demo-class",
      dataKey: "isDemoSheduled",
    },
    {
      id: 5,
      title: "Attend Demo",
      fullTitle: "Attend the Demo Class",
      completed: false,
      route: "/parent/demo-attend",
      dataKey: "isDemoAttended",
    },
    {
      id: 6,
      title: "Select Package",
      fullTitle: "Select Package",
      completed: false,
      route: "/parent/package-selection",
      dataKey: "isPackageSelected",
    },
    {
      id: 7,
      title: "Schedule",
      fullTitle: "Choose Your Class Schedule",
      completed: false,
      route: "/parent/schedule",
      dataKey: "isClassAssigned",
    },
  ]);

  // Update steps based on enrollment data
  useEffect(() => {
    if (enrollmentData) {
      setSteps((prevSteps) =>
        prevSteps.map((step) => ({
          ...step,
          completed: enrollmentData[step.dataKey] || false,
        }))
      );
    }
  }, [enrollmentData]);

  // Function to handle navigation
  const handleStepClick = (step) => {
    const completedSteps = steps.filter((s) => s.completed).length;
    const isAccessible = step.completed || step.id === completedSteps + 1;

    if (isAccessible) {
      console.log(`Navigating to: ${step.route}`);
      // Add your navigation logic here
      // navigate(step.route);

      // For specific routes that need kidId
      if (
        kidId &&
        (step.dataKey === "isProgramSelected" ||
          step.dataKey === "isDemoSheduled")
      ) {
        console.log(`Navigating with kidId: ${kidId}`);
        // navigate(`${step.route}/${kidId}`);
      }
    }
  };

  // Check if step is accessible
  const isStepAccessible = (step) => {
    const completedSteps = steps.filter((s) => s.completed).length;
    return step.completed || step.id === completedSteps + 1;
  };

  // Get current step (first incomplete step)
  const getCurrentStep = () => {
    return steps.find((step) => !step.completed) || steps[steps.length - 1];
  };

  // Get next action text
  const getNextActionText = () => {
    const currentStep = getCurrentStep();
    if (!currentStep || currentStep.completed) {
      return "All steps completed!";
    }

    const stepTexts = {
      isParentNameCompleted: "Complete your profile",
      isFirstKidAdded: "Add your first child",
      isProgramSelected: "Choose your child's program",
      isDemoSheduled: "Schedule a demo class",
      isDemoAttended: "Attend the demo class",
      isPackageSelected: "Select a package",
      isClassAssigned: "Choose class schedule",
    };

    return stepTexts[currentStep.dataKey] || "Continue setup";
  };

  const completedCount = steps.filter((step) => step.completed).length;
  const progressPercentage = (completedCount / steps.length) * 100;
  const isAllComplete = completedCount === steps.length;

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Enrollment Progress
          </h2>
          <p className="text-sm text-gray-600">
            {isAllComplete ? "Your setup is complete!" : getNextActionText()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">
            {completedCount}/{steps.length}
          </div>
          <div className="text-xs text-gray-500">Steps Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-600">Progress</span>
          <span className="text-xs font-semibold text-purple-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Stepper */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 z-0"></div>
        <div
          className="absolute top-6 left-6 h-0.5 bg-purple-500 transition-all duration-500 z-0"
          style={{ width: `${(completedCount / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps Container */}
        <div className="relative z-10 flex justify-between">
          {steps.map((step, index) => {
            const isAccessible = isStepAccessible(step);
            const isNext = !step.completed && step.id === completedCount + 1;

            return (
              <div
                key={step.id}
                onClick={() => handleStepClick(step)}
                className={`
                  flex flex-col items-center group cursor-pointer transition-all duration-200
                  ${
                    isAccessible
                      ? "hover:scale-105"
                      : "cursor-not-allowed opacity-60"
                  }
                `}
                style={{ maxWidth: "120px" }}
              >
                {/* Step Circle */}
                <div
                  className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 relative
                  ${
                    step.completed
                      ? "bg-green-500 border-green-500 shadow-md"
                      : isNext
                      ? "bg-purple-500 border-purple-500 shadow-md animate-pulse"
                      : isAccessible
                      ? "bg-blue-500 border-blue-500 shadow-md"
                      : "bg-gray-300 border-gray-300"
                  }
                  ${
                    isAccessible
                      ? "group-hover:shadow-lg group-hover:scale-110"
                      : ""
                  }
                `}
                >
                  {step.completed ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : !isAccessible ? (
                    <Lock className="w-4 h-4 text-gray-500" />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {step.id}
                    </span>
                  )}

                  {/* Pulse ring for current step */}
                  {isNext && (
                    <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping"></div>
                  )}
                </div>

                {/* Step Content */}
                <div className="mt-3 text-center">
                  <h3
                    className={`
                    text-xs font-semibold leading-tight transition-colors duration-200
                    ${
                      step.completed
                        ? "text-green-600"
                        : isNext
                        ? "text-purple-600"
                        : isAccessible
                        ? "text-blue-600"
                        : "text-gray-400"
                    }
                    ${isAccessible ? "group-hover:text-gray-900" : ""}
                  `}
                  >
                    {step.title}
                  </h3>

                  {/* Status indicator */}
                  <div className="mt-1">
                    <span
                      className={`
                      text-xs px-2 py-0.5 rounded-full font-medium
                      ${
                        step.completed
                          ? "bg-green-100 text-green-700"
                          : isNext
                          ? "bg-purple-100 text-purple-700"
                          : isAccessible
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }
                    `}
                    >
                      {step.completed
                        ? "Done"
                        : isNext
                        ? "Current"
                        : isAccessible
                        ? "Next"
                        : "Locked"}
                    </span>
                  </div>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
                  {step.fullTitle}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isAllComplete && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-green-900 mb-1">
              Enrollment Complete!
            </h4>
            <p className="text-sm text-green-700">
              Welcome to your chess journey. Your account is fully set up.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentCompletionStage;
