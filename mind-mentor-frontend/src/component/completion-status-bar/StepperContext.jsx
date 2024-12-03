import { createContext, useState } from "react";

export const StepperContext = createContext();

export const StepperProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [parentData, setParentData] = useState(null); // This can be used if needed for a separate parent step
  const [stepData, setStepData] = useState({}); // Store data for each step

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const previousStep = () => setCurrentStep((prev) => prev - 1);

  // Function to update data for a specific step
  const updateStepData = (step, data) => {
    setStepData((prevData) => ({
      ...prevData,
      [step]: data, // Store data specific to a step
    }));
  };

  return (
    <StepperContext.Provider
      value={{
        currentStep,
        nextStep,
        previousStep,
        setCurrentStep,
        parentData,
        setParentData,
        stepData,
        setStepData,
        updateStepData, // Expose the update function to components
      }}
    >
      {children}
    </StepperContext.Provider>
  );
};
