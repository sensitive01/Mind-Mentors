import { useContext } from "react";
import { StepperContext } from "./StepperContext";

const ProgressBar = () => {
  const { currentStep } = useContext(StepperContext);

  const steps = [
    "Parent Login/OTP",
    "Parent Registration",
    "Kid Registration/Enrollment",
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`relative flex flex-col items-center text-center ${
            currentStep >= index ? "text-green-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center 
              ${
                currentStep >= index
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-gray-400"
              }`}
          >
            {currentStep >= index ? "✓" : index + 1}
          </div>
          <div className="mt-2 text-sm">{step}</div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
