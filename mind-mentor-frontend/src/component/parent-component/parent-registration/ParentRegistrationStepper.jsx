import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData } from '../../../store/regDataParentKidsSlice';

const ParentRegistrationStepper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const formData = useSelector((state) => state.formData);
  const dispatch = useDispatch();

  const steps = [
    { number: 1, title: 'Parent Details' },
    { number: 2, title: 'Child Details' },
    { number: 3, title: 'Program Selection' }
  ];

  const handleStepComplete = (stepData) => {
    dispatch(setFormData({ ...formData, ...stepData }));
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stepper Header */}
      <div className="w-full py-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center ${index !== 0 ? 'ml-12' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                    currentStep >= step.number ? 'bg-primary text-white' : 'bg-gray-200'
                  }`}>
                    {step.number}
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-primary' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 ml-4 w-32 h-0.5 ${
                    currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {currentStep === 1 && (
            <ParentDetailsForm 
              initialData={formData}
              onComplete={handleStepComplete}
            />
          )}
          {currentStep === 2 && (
            <ChildDetailsForm
              initialData={formData}
              onComplete={handleStepComplete}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <ProgramSelectionForm
              initialData={formData}
              onComplete={handleStepComplete}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ParentDetailsForm = ({ initialData, onComplete }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    mobile: initialData?.mobile || '',
    isMobileWhatsapp: initialData?.isMobileWhatsapp || true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Your Name"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="Email Address"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="tel"
          value={formData.mobile}
          onChange={(e) => setFormData({...formData, mobile: e.target.value})}
          placeholder="Mobile Number"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>
      <button 
        type="submit"
        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-opacity-90"
      >
        Next →
      </button>
    </form>
  );
};

const ChildDetailsForm = ({ initialData, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    childName: initialData?.childName || '',
    age: initialData?.age || '',
    gender: initialData?.gender || '',
    schoolName: initialData?.schoolName || '',
    address: initialData?.address || '',
    pincode: initialData?.pincode || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          value={formData.childName}
          onChange={(e) => setFormData({...formData, childName: e.target.value})}
          placeholder="Child's Name"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            placeholder="Age"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <select
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <input
          type="text"
          value={formData.schoolName}
          onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
          placeholder="School Name"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          placeholder="Address"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          value={formData.pincode}
          onChange={(e) => setFormData({...formData, pincode: e.target.value})}
          placeholder="Pincode"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="flex gap-4">
        <button 
          type="button"
          onClick={onBack}
          className="w-1/2 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200"
        >
          ← Back
        </button>
        <button 
          type="submit"
          className="w-1/2 bg-primary text-white py-3 rounded-lg hover:bg-opacity-90"
        >
          Next →
        </button>
      </div>
    </form>
  );
};

const ProgramSelectionForm = ({ initialData, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    program: initialData?.program || '',
    programLevel: initialData?.programLevel || '',
    selectedSlot: initialData?.selectedSlot || null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <select
          value={formData.program}
          onChange={(e) => setFormData({...formData, program: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="">Select Program</option>
          <option value="Chess">Chess</option>
          <option value="Coding">Coding</option>
          <option value="Rubiks Cube">Rubiks Cube</option>
          <option value="Robotics">Robotics</option>
        </select>
        <select
          value={formData.programLevel}
          onChange={(e) => setFormData({...formData, programLevel: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
      <div className="flex gap-4">
        <button 
          type="button"
          onClick={onBack}
          className="w-1/2 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200"
        >
          ← Back
        </button>
        <button 
          type="submit"
          className="w-1/2 bg-primary text-white py-3 rounded-lg hover:bg-opacity-90"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ParentRegistrationStepper;