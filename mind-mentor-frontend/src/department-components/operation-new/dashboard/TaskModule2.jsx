import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import {
  createTasks,
  getDropDownData,
} from "../../../api/service/employee/EmployeeService";

const TaskModule = () => {
  const empId = localStorage.getItem("empId");
  // Add new state for kids and employees data
  const [kidsData, setKidsData] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    kidsRelatedTo: "",
    task: "",
    taskDate: "",
    taskTime: "",
    assignedTo: "",
    assignedBy: empId || "",
  });

  const [submissionStatus, setSubmissionStatus] = useState({
    submitted: false,
    message: "",
  });

  // Add new useEffect for fetching kids and employees data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace these with your actual API endpoints
        const dropDownData = await getDropDownData();
        console.log("dropDownData", dropDownData);

        if (!dropDownData.status === 200) {
          throw new Error("Failed to fetch data");
        }

        setKidsData(dropDownData.data.kidsData);
        setEmployeesData(dropDownData.data.employeeData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSubmissionStatus({
          submitted: true,
          message: "Error loading data. Please refresh the page.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedempId = localStorage.getItem("empId");
    if (storedempId) {
      setFormData((prevState) => ({
        ...prevState,
        assignedBy: storedempId,
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { kidsRelatedTo, task, taskDate, taskTime, assignedTo } = formData;

    if (!kidsRelatedTo || !task || !taskDate || !taskTime || !assignedTo) {
      setSubmissionStatus({
        submitted: true,
        message: "Please fill in all required fields.",
      });
      return;
    }

    try {
      await createTasks(formData);

      const empId = localStorage.getItem("empId");

      setSubmissionStatus({
        submitted: true,
        message: `Task Successfully Assigned to ${assignedTo} for ${kidsRelatedTo} on ${taskDate} at ${taskTime}`,
      });

      setFormData({
        kidsRelatedTo: "",
        task: "",
        taskDate: "",
        taskTime: "",
        assignedTo: "",
        assignedBy: empId || "",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      setSubmissionStatus({
        submitted: true,
        message: "Error creating task, please try again.",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      kidsRelatedTo: "",
      task: "",
      taskDate: "",
      taskTime: "",
      assignedTo: "",
      assignedBy: empId || "",
    });
    setSubmissionStatus({
      submitted: false,
      message: "",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-[#642b8f]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
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
            to="/operation/department/list-task-assigned-me"
          >
            View Assigned Task
          </Button>
        </div>

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
            {/* Updated Kids Related To dropdown */}
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
                {kidsData?.map((kid) => (
                  <option key={kid._id} value={kid._id}>
                    {kid.kidsName}
                  </option>
                ))}
              </select>
            </div>

            {/* Task textarea remains the same */}
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

            {/* Date and Time inputs remain the same */}
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

            {/* Updated Assigned To dropdown */}
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
                {employeesData.map((employee) => (
                  <option key={employee._id} value={employee.email}>
                    {employee.firstName}-{employee.department}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
