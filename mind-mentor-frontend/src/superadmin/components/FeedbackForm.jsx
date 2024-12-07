import { Button } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const TaskModule = () => {
  const [programs, setPrograms] = useState([{ studentName: '', coachName: '', sessionDate: '', feedback: '', remarks: '' }]);
  const availablePrograms = ['Chess', 'Rubix', 'Art', 'Dance', 'Music'];

  const addProgram = () => {
    setPrograms([...programs, { studentName: '', coachName: '', sessionDate: '', feedback: '', remarks: '' }]);
  };

  const removeProgram = (index) => {
    setPrograms(programs.filter((_, i) => i !== index));
  };

  const handleProgramChange = (index, field, value) => {
    const newPrograms = [...programs];
    newPrograms[index][field] = value;
    setPrograms(newPrograms);
  };

  return (
<div className="min-h-screen p-6">
  <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
    {/* Header Section */}
    <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold mb-2">Coach Feedback Form</h2>
        <p className="text-sm opacity-90">Please fill in the required information below</p>
      </div>
      <Button
        variant="contained"
        color="#642b8f"
        component={Link}
        to="/coachFeedback"
      >
        View Feedabcks
      </Button>
    </div>

    <form className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Name */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-[#642b8f]">
            Student Name
          </label>
          <select
            className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
            onChange={(e) => handleProgramChange(0, 'studentName', e.target.value)}
          >
            <option value="">-Select-</option>
            <option value="student1">Student 1</option>
            <option value="student2">Student 2</option>
            <option value="student3">Student 3</option>
          </select>
        </div>

        {/* Coach Name */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-[#642b8f]">
            Coach Name
          </label>
          <select
            className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
            onChange={(e) => handleProgramChange(0, 'coachName', e.target.value)}
          >
            <option value="">-Select-</option>
            <option value="coach1">Coach 1</option>
            <option value="coach2">Coach 2</option>
            <option value="coach3">Coach 3</option>
          </select>
        </div>

        {/* Session Date */}
        <div className="space-y-4 col-span-2"> {/* Added col-span-2 to make it span across both columns */}
          <label className="block text-sm font-medium text-[#642b8f]">
            Session Date
          </label>
          <input
            type="date"
            className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
            onChange={(e) => handleProgramChange(0, 'sessionDate', e.target.value)}
          />
        </div>

        {/* Feedback */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-[#642b8f]">
            Feedback
          </label>
          <textarea
            rows={4}
            className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors resize-none"
            placeholder="Enter feedback here..."
            onChange={(e) => handleProgramChange(0, 'feedback', e.target.value)}
          />
        </div>

        {/* Remarks */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-[#642b8f]">
            Remarks
          </label>
          <textarea
            rows={4}
            className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors resize-none"
            placeholder="Enter remarks here..."
            onChange={(e) => handleProgramChange(0, 'remarks', e.target.value)}
          />
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex justify-center gap-6 mt-8">
        <button
          type="submit"
          className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
        >
          Submit Task
        </button>
        <button
          type="reset"
          className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
        >
          Reset Form
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default TaskModule;
