import { useContext } from "react";
import { StepperContext } from "../completion-status-bar/StepperContext";

const Stepper = () => {
  const { currentStep } = useContext(StepperContext);

  const steps = [
    { number: 1, label: "Parent Registration" },
    { number: 2, label: "Kids Registration" },
    { number: 3, label: "Enrolment" },
  ];

  const getStepClass = (stepNumber) => {
    return currentStep >= stepNumber
      ? "bg-purple-600 text-white"
      : "bg-gray-300 text-gray-500";
  };

  const getLineClass = (stepNumber) => {
    return currentStep >= stepNumber ? "bg-primary" : "bg-gray-300";
  };

  return (
    <div className="flex items-center justify-around w-full mb-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex flex-col items-center w-full last:w-auto">
          <div className="flex items-center w-full">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-7 flex items-center justify-center rounded-full ${getStepClass(
                  step.number
                )}`}
              >
                {step.number}
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 ml-2 ${getLineClass(step.number + 1)}`}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
