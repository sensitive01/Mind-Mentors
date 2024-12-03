import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchDemoClassDetails, parentBookNewDemoClass } from '../../../../api/service/parent/ParentService';

const SheduleDemoClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([{ id: Date.now(), program: "", programLevel: "" }]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoClass, setDemoClass] = useState(null); 
  const [isScheduled, setIsScheduled] = useState(true); 

  useEffect(() => {
    const fetchDemoClass = async () => {
      try {
        const response = await fetchDemoClassDetails(id); 
        if (response.status === 200 && response.data.data !== null) {
          setDemoClass(response.data.data); 
          setIsScheduled(true); 
          setEnrollments(response.data.data.programs || [{ id: Date.now(), program: "", programLevel: "" }]);
          setDate(formatDate(response.data.data.date)); 
          setTime(response.data.data.time || "");
        }
      } catch (error) {
        console.error("Failed to fetch demo class details:", error);
      }
    };

    fetchDemoClass();
  }, [id]);

  const formatDate = (isoDate) => {
    const dateObj = new Date(isoDate);
    return dateObj.toISOString().split('T')[0]; 
  };

  const handleAddProgram = () => {
    setEnrollments([...enrollments, { id: Date.now(), program: "", programLevel: "" }]);
  };

  const handleRemoveProgram = (index) => {
    if (enrollments.length > 1) {
      setEnrollments(enrollments.filter((_, i) => i !== index)); 
    }
  };

  const handleProgramChange = (index, field, value) => {
    setEnrollments((prevEnrollments) =>
      prevEnrollments.map((enrollment, i) =>
        i === index
          ? { ...enrollment, [field]: value } 
          : enrollment 
      )
    );
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const programsData = enrollments.map(({ program, programLevel }) => ({ program, programLevel }));
    const formData = { programs: programsData, date, time };
  
    try {
      if (isScheduled) {
        await parentBookNewDemoClass(id, formData);
        toast.success("Demo class updated successfully!");
      } else {
        await parentBookNewDemoClass(id, formData);
        toast.success("Demo class booked successfully!");
      }
  
      setTimeout(() => {
        navigate("/parent/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error booking or updating demo class:", error);
      toast.error("Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate("/parent/kid/attendance/:id")} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="ml-4 text-2xl font-bold text-primary">Demo Class</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-9">
          <form onSubmit={handleSubmit} className="space-y-6">
            {enrollments.map((enrollment, index) => (
              <div key={index} className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor={`program-${index}`} className="font-medium block mb-2">Program</label>
                    <select
                      id={`program-${index}`}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent w-full"
                      value={enrollment.program}
                      onChange={(e) => handleProgramChange(index, 'program', e.target.value)}
                    >
                      <option value="">Choose a program</option>
                      <option value="Chess">Chess</option>
                      <option value="Coding">Coding</option>
                      <option value="Rubiks Cube">Rubiks Cube</option>
                      <option value="Robotics">Robotics</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`program-level-${index}`} className="font-medium block mb-2">Program Level</label>
                    <select
                      id={`program-level-${index}`}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent w-full"
                      value={enrollment.programLevel}
                      onChange={(e) => handleProgramChange(index, 'programLevel', e.target.value)}
                    >
                      <option value="">Choose a level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                {enrollments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProgram(index)} 
                    className="absolute -right-6 top-10 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}

            <button type="button" onClick={handleAddProgram} className="flex items-center gap-2 text-primary hover:text-opacity-80">
              <Plus size={20} />
              Add Another Program
            </button>

            <div>
              <label htmlFor="date-time" className="font-medium block mb-2">Suitable Date & Time</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label htmlFor="date" className="text-sm mb-2">Date</label>
                  <input
                    type="date"
                    id="date"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="time" className="text-sm mb-2">Time</label>
                  <input
                    type="time"
                    id="time"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : isScheduled ? "Update Demo Class" : "Book Demo Class"}
            </button>
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

export default SheduleDemoClass;
