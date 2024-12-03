import { useState } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Grid, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link for navigation


const TaskModule = () => {
  const [programs, setPrograms] = useState([{ program: '', level: '' }]);
  const availablePrograms = ['Chess', 'Rubix', 'Art', 'Dance', 'Music'];

  const addProgram = () => {
    setPrograms([...programs, { program: '', level: '' }]);
  };

  const removeProgram = (index) => {
    setPrograms(programs.filter((_, i) => i !== index));
  };

  const handleProgramChange = (index, field, value) => {
    const newPrograms = [...programs];
    newPrograms[index][field] = value;
    setPrograms(newPrograms);
  };

  const getAvailableProgramOptions = (currentProgram) => {
    const selectedPrograms = programs
      .map((p) => p.program)
      .filter((p) => p !== currentProgram);
    return availablePrograms.filter((program) => !selectedPrograms.includes(program));
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
        <div>
        <h2 className="text-3xl font-bold mb-2">Task Assignment Form</h2>
          <p className="text-sm opacity-90">Please fill in the required information below</p>
        </div>
        <Button
    variant="contained"
    color="#642b8f"
    component={Link}
    to="/employee-operation-tasks/tasks" 
    >
       View Tasks
  </Button>
</div>
        <form className="p-8">
          <div className="space-y-8">
            {/* Kids Related To */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#642b8f]">
                Kids Related To
              </label>
              <select
                className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
              >
                <option value="">-Select-</option>
                <option value="groupA">Group A</option>
                <option value="groupB">Group B</option>
                <option value="groupC">Group C</option>
              </select>
            </div>
  
            {/* Task */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#642b8f]">
                Task
              </label>
              <textarea
                rows={4}
                className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors resize-none"
                placeholder="Enter task description here..."
              />
            </div>
  
            {/* Task Time */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-4">
              <label className="block text-sm font-medium text-[#642b8f]">
                  Task Date
                </label>
                <input
                  type="date"
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                />


              </div>
              <div className="flex-1 space-y-4">
              <label className="block text-sm font-medium text-[#642b8f]">
                  Task Time
                </label>
                <input
                  type="time"
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                />
              </div>
            </div>
  
            {/* Assigned To */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#642b8f]">
                Assigned To
              </label>
              <select
                className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
              >
                <option value="">-Select-</option>
                <option value="teacher1">Teacher 1</option>
                <option value="teacher2">Teacher 2</option>
                <option value="teacher3">Teacher 3</option>
              </select>
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
