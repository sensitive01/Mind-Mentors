import React, { useState } from "react";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { createTasks } from "../../api/service/employee/EmployeeService";


const TaskModule = () => {
  const empEmail = localStorage.getItem("email")
  const navigate = useNavigate()
  // State to manage form inputs
  const [formData, setFormData] = useState({
    kidsRelatedTo: "",
    task: "",
    taskDate: "",
    taskTime: "",
    assignedTo: "",
    assignedBy:empEmail||""
  });

  // State to manage form submission and display
  const [submissionStatus, setSubmissionStatus] = useState({
    submitted: false,
    message: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data", formData);

    // Validate form fields
    const { kidsRelatedTo, task, taskDate, taskTime, assignedTo } = formData;

    if (!kidsRelatedTo || !task || !taskDate || !taskTime || !assignedTo) {
      setSubmissionStatus({
        submitted: true,
        message: "Please fill in all required fields.",
      });
      return;
    }

    await createTasks(formData);
    // If all fields are filled, show success message
    setSubmissionStatus({
      submitted: true,
      message: `Task Successfully Assigned to ${assignedTo} for ${kidsRelatedTo} on ${taskDate} at ${taskTime}`,
    });
    setTimeout(() => {
      navigate("/coachMyTasks")
      
    }, 1500);


    // Optional: Reset form after submission
    setFormData({
      kidsRelatedTo: "",
      task: "",
      taskDate: "",
      taskTime: "",
      assignedTo: "",
    });
  };

  // Reset form and submission status
  const handleReset = () => {
    setFormData({
      kidsRelatedTo: "",
      task: "",
      taskDate: "",
      taskTime: "",
      assignedTo: "",
    });
    setSubmissionStatus({
      submitted: false,
      message: "",
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Task Assignment Form</h2>
            <p className="text-sm opacity-90">
              Please fill in the required information below
            </p>
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

        {/* Submission Status Message */}
        {submissionStatus.submitted && (
          <div
            className={`
            p-4 m-4 rounded-lg text-center font-medium 
            ${
              submissionStatus.message.includes("Successfully")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          `}
          >
            {submissionStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} onReset={handleReset} className="p-8">
          <div className="space-y-8">
            {/* Kids Related To */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#642b8f]">
                Kids Related To
              </label>
              <select
                name="kidsRelatedTo"
                value={formData.kidsRelatedTo}
                onChange={handleInputChange}
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
                name="task"
                value={formData.task}
                onChange={handleInputChange}
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
                  name="taskDate"
                  value={formData.taskDate}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors"
                />
              </div>
              <div className="flex-1 space-y-4">
                <label className="block text-sm font-medium text-[#642b8f]">
                  Task Time
                </label>
                <input
                  type="time"
                  name="taskTime"
                  value={formData.taskTime}
                  onChange={handleInputChange}
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
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors bg-white"
              >
                <option value="">-Select-</option>
                <option value="marketingassociate@mindmentorz.com">Marketing</option>
                <option value="coach@mindmentorz.com">Coach</option>
                <option value="operations@mindmentoz.com">Operations</option>
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
