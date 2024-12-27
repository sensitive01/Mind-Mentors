import { useContext, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { parentBookDemoClass } from "../../api/service/parent/ParentService";
import LeftLogoBar from "./parent-dashboard/layout/LeftLogoBar";
import { StepperContext } from "../completion-status-bar/StepperContext";
import Stepper from "../completion-status-bar/Stepper";
import { getDemoSheduleClass } from "../../api/service/employee/EmployeeService";
import { useDispatch, useSelector } from "react-redux";
import { setFormData } from "../../store/regDataParentKidsSlice";

const KidsRegistration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { previousStep } = useContext(StepperContext);

  const [enrollments, setEnrollments] = useState([
    {
      id: Date.now(),
      program: "",
      programLevel: "",
    },
  ]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const regFormData = useSelector((state) => state.formData);

  useEffect(() => {
    const fetchDemoClass = async () => {
      try {
        const response = await getDemoSheduleClass();
        setAvailableSlots(response.data.scheduleData);
      } catch (error) {
        console.error("Error fetching demo classes:", error);
      }
    };
    fetchDemoClass();
  }, []);

  const handleAddProgram = () => {
    setEnrollments([
      ...enrollments,
      { id: Date.now(), program: "", programLevel: "" },
    ]);
  };

  const handleRemoveProgram = (id) => {
    if (enrollments.length > 1) {
      setEnrollments(enrollments.filter((item) => item.id !== id));
    }
  };

  const handleProgramChange = (id, field, value) => {
    setEnrollments(
      enrollments.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    setSelectedSlot(null); // Reset selected slot when program changes
  };

  // Filter available slots based on selected program and level
  const getMatchingSlots = (program, level) => {
    return availableSlots.filter(
      slot => slot.program === program && slot.level === level
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      enrollments.some(
        (enrollment) => !enrollment.program || !enrollment.programLevel
      )
    ) {
      toast.error("Please complete all program and level selections");
      return;
    }

    const programsData = enrollments.map(({ program, programLevel }) => ({
      program,
      programLevel,
    }));

    const formData = {
      programs: programsData,
      scheduleId: selectedSlot?._id,
      hasSchedule: !!selectedSlot
    };

    dispatch(
      setFormData((prevData) => ({
        ...prevData,
        ...formData,
      }))
    );

    try {
      const response = await parentBookDemoClass(formData, state);
      
      if (response.status === 201) {
        toast.success(selectedSlot 
          ? "Registration successful! Your demo class has been scheduled."
          : "Registration successful! Our team will contact you soon to schedule your demo class.");
        localStorage.setItem("parentId", response?.data?.parentId);
        setTimeout(() => {
          navigate("/parent/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <LeftLogoBar />

      <div className="lg:w-3/5 w-auto p-8 bg-white ml-0 mt-8 lg:mt-10 lg:ml-20 lg:mr-20 flex-1 min-h-auto rounded-lg">
        <Stepper />

        <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-md">
          <h2 className="text-2xl font-bold text-primary text-center mb-2">
            Enrol your Program - Level
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Program Selection Section */}
            <div className="border p-8 rounded-lg border-primary mb-6 relative">
              <h3 className="text-xl font-semibold text-primary mb-6">
                Program Selection
              </h3>

              <div className="space-y-6">
                {enrollments.map((enrollment, index) => (
                  <div key={enrollment.id} className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-8">
                      <div className="flex flex-col">
                        <label
                          htmlFor={`program-${index}`}
                          className="font-medium mb-2 text-gray-700"
                        >
                          Program
                        </label>
                        <select
                          id={`program-${index}`}
                          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full bg-white transition-all duration-200"
                          value={enrollment.program}
                          onChange={(e) =>
                            handleProgramChange(
                              enrollment.id,
                              "program",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="">Choose a program</option>
                          <option value="Chess">Chess</option>
                          <option value="Coding">Coding</option>
                          <option value="Rubiks Cube">Rubiks Cube</option>
                          <option value="Robotics">Robotics</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label
                          htmlFor={`program-level-${index}`}
                          className="font-medium mb-2 text-gray-700"
                        >
                          Program Level
                        </label>
                        <select
                          id={`program-level-${index}`}
                          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full bg-white transition-all duration-200"
                          value={enrollment.programLevel}
                          onChange={(e) =>
                            handleProgramChange(
                              enrollment.id,
                              "programLevel",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="">Choose a level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    {/* Available Slots Section */}
                    {enrollment.program && enrollment.programLevel && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Available Demo Classes</h4>
                        {getMatchingSlots(enrollment.program, enrollment.programLevel).length > 0 ? (
                          <div className="space-y-2">
                            {getMatchingSlots(enrollment.program, enrollment.programLevel).map((slot) => (
                              <div 
                                key={slot._id}
                                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                                  selectedSlot?._id === slot._id 
                                    ? 'border-primary bg-purple-50' 
                                    : 'border-gray-200 hover:border-primary'
                                }`}
                                onClick={() => setSelectedSlot(slot)}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{slot.day}</p>
                                    <p className="text-gray-600">{slot.classTime}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">Coach: {slot.coachName}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600 italic">
                            No scheduled demo classes available for this program and level. 
                            You can still register and our team will contact you to schedule your demo class.
                          </p>
                        )}
                      </div>
                    )}

                    {enrollments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProgram(enrollment.id)}
                        className="absolute right-0 top-8 p-2 text-red-500 hover:text-red-700 transition-colors duration-200 hover:bg-red-50 rounded-full"
                        aria-label="Remove program"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* <button
                type="button"
                onClick={handleAddProgram}
                className="flex items-center gap-2 text-primary hover:text-opacity-80 mt-6 py-2 px-4 rounded-lg hover:bg-purple-50 transition-all duration-200"
              >
                <Plus size={20} />
                <span>Add Another Program</span>
              </button> */}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={() => {
                  previousStep();
                  navigate(-1);
                }}
                type="button"
                className="w-1/4 bg-primary text-white py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 flex items-center justify-center"
              >
                ← Back
              </button>

              <button
                type="button"
                className="w-1/2 bg-primary text-white py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300"
                onClick={() => navigate("/parent/dashboard")}
              >
                Skip to Dashboard
              </button>

              <button
                type="submit"
                className="w-1/4 bg-primary text-white py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300"
              >
                Submit →
              </button>
            </div>
          </form>
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
      />
    </div>
  );
};

export default KidsRegistration;