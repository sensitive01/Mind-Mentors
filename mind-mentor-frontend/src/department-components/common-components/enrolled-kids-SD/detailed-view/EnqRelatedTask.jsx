import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  Users,
  Building,
  FileText,
  CalendarClock,
} from "lucide-react";
import {
  assignTaskForSpecificKid,
  createTasks,
} from "../../../../api/service/employee/EmployeeService";

const EnqRelatedTask = ({id}) => {
  console.log("enq Related task",id)
  const empId = localStorage.getItem("empId");
  const department = localStorage.getItem("department");

  const [kidsInfo, setKidsInfo] = useState(null);
  const [employeesData, setEmployeesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);


  const [formData, setFormData] = useState({
    task: "",
    taskDateTime: "",
    assignedBy: empId || "",
  });

  const [submissionStatus, setSubmissionStatus] = useState({
    submitted: false,
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dropDownData = await assignTaskForSpecificKid(id);
        if (!dropDownData.status === 200) {
          throw new Error("Failed to fetch data");
        }
        setKidsInfo(dropDownData.data.kidsData);
        setEmployeesData(dropDownData.data.employeeData);

        const uniqueDepartments = [
          ...new Set(
            dropDownData.data.employeeData.map((emp) => emp.department)
          ),
        ];
        setDepartments(uniqueDepartments);
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
    // Automatically select users when departments are selected
    const usersInSelectedDepartments = employeesData
      .filter((emp) => selectedDepartments.includes(emp.department))
      .map((emp) => emp.email);

    setSelectedUsers((prev) => {
      const nonDepartmentUsers = prev.filter(
        (email) =>
          !employeesData.find((emp) => emp.email === email)?.department ||
          !selectedDepartments.includes(
            employeesData.find((emp) => emp.email === email)?.department
          )
      );
      return [
        ...new Set([...nonDepartmentUsers, ...usersInSelectedDepartments]),
      ];
    });
  }, [selectedDepartments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.task ||
      !formData.taskDateTime ||
      selectedUsers.length === 0
    ) {
      setSubmissionStatus({
        submitted: true,
        message:
          "Please fill in all required fields and select at least one user.",
      });
      return;
    }

    try {
      await Promise.all(
        selectedUsers.map(async (userEmail) => {
          const taskData = {
            ...formData,
            assignedTo: userEmail,
            kidsRelatedTo: kidsInfo._id,
          };
          await createTasks(taskData);
        })
      );

      setSubmissionStatus({
        submitted: true,
        message: `Tasks Successfully Assigned to ${selectedUsers.length} users`,
      });

      setFormData({
        task: "",
        taskDateTime: "",
        assignedBy: empId || "",
      });
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error creating tasks:", error);
      setSubmissionStatus({
        submitted: true,
        message: "Error creating tasks, please try again.",
      });
    }
  };

  const filteredEmployees = employeesData.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDepartmentSelection = (dept) => {
    setSelectedDepartments((prev) => {
      if (prev.includes(dept)) {
        return prev.filter((d) => d !== dept);
      }
      return [...prev, dept];
    });
  };

  const handleUserSelection = (email) => {
    const user = employeesData.find((emp) => emp.email === email);
    setSelectedUsers((prev) => {
      if (prev.includes(email)) {
        return prev.filter((e) => e !== email);
      }
      return [...prev, email];
    });
  };

  const removeUser = (email) => {
    setSelectedUsers((prev) => prev.filter((e) => e !== email));
    // If user belongs to a selected department, deselect the department
    const user = employeesData.find((emp) => emp.email === email);
    if (user && selectedDepartments.includes(user.department)) {
      setSelectedDepartments((prev) =>
        prev.filter((d) => d !== user.department)
      );
    }
  };

  const removeDepartment = (dept) => {
    setSelectedDepartments((prev) => prev.filter((d) => d !== dept));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
    {/* Main Container - Set to screen height */}
    <div className="max-w-7xl mx-auto px-4 h-screen py-4">
      {/* Header and Content Container - Set to full height with flex */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
        {/* Header Section - Fixed height */}
        <div className="bg-gradient-to-r from-primary to-purple-500 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">Task Assignment</h2>
              <p className="text-purple-100">
                Create and manage tasks for your team members
              </p>
            </div>
            <button
              onClick={() => (window.location.href = `/${department}/department/list-task-assigned-me`)}
              className="bg-white text-primary px-6 py-3 rounded-xl hover:bg-purple-50 transition-all duration-200 font-medium shadow-sm"
            >
              View Tasks
            </button>
          </div>
        </div>
  
        {/* Form Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Status Message */}
          {submissionStatus.submitted && (
            <div
              className={`mb-4 p-3 rounded-lg text-center ${
                submissionStatus.message.includes("Successfully")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {submissionStatus.message}
            </div>
          )}
  
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* Left Sidebar - Student Info */}
            <div className="col-span-12 md:col-span-3">
              {kidsInfo && (
                <div className="bg-white rounded-lg shadow-sm p-4 sticky top-0">
                  <h3 className="text-primary font-semibold mb-3">Student Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Name</label>
                      <p className="font-medium">{kidsInfo.kidFirstName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Program & Level</label>
                      <div className="space-y-1">
                        {kidsInfo.programs.map((programInfo, index) => (
                          <p className="font-medium" key={programInfo._id || index}>
                            {programInfo.program} - {programInfo.level}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
  
            {/* Main Form Area */}
            <div className="col-span-12 md:col-span-9">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Task Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Description
                    </label>
                    <textarea
                      name="task"
                      value={formData.task}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                      placeholder="Enter detailed task description..."
                    />
                  </div>
  
                  {/* DateTime */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="taskDateTime"
                      value={formData.taskDateTime}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
  
                  {/* Assignment Section */}
                  <div className="grid grid-cols-12 gap-4">
                    {/* Department Selection */}
                    <div className="col-span-12 md:col-span-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Departments
                      </label>
  
                      {/* Selected Departments Tags */}
                      {selectedDepartments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 rounded-lg min-h-8 max-h-24 overflow-y-auto">
                          {selectedDepartments.map((dept) => (
                            <div
                              key={dept}
                              className="bg-white px-2 py-1 rounded flex items-center gap-1 text-sm border"
                            >
                              <Building size={12} />
                              <span>{dept}</span>
                              <button
                                type="button"
                                onClick={() => removeDepartment(dept)}
                                className="text-gray-500 hover:text-red-500"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
  
                      {/* Department Dropdown */}
                      <div className="relative">
                        <div
                          className="w-full p-2 rounded-lg border border-gray-300 flex justify-between items-center cursor-pointer"
                          onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                        >
                          <span className="text-gray-500 text-sm">Select departments...</span>
                          {isDeptDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
  
                        {isDeptDropdownOpen && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {departments.map((dept) => (
                              <div
                                key={dept}
                                className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleDepartmentSelection(dept)}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedDepartments.includes(dept)}
                                  onChange={() => {}}
                                  className="w-4 h-4 rounded border-gray-300 text-purple-600"
                                />
                                <label className="ml-2 text-sm">{dept}</label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
  
                    {/* User Selection */}
                    <div className="col-span-12 md:col-span-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Users
                      </label>
  
                      {/* Selected Users Tags */}
                      {selectedUsers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 rounded-lg min-h-8 max-h-24 overflow-y-auto">
                          {selectedUsers.map((email) => {
                            const user = employeesData.find((emp) => emp.email === email);
                            return (
                              <div
                                key={email}
                                className="bg-white px-2 py-1 rounded flex items-center gap-1 text-sm border"
                              >
                                <Users size={12} />
                                <span>{user?.firstName}</span>
                                <button
                                  type="button"
                                  onClick={() => removeUser(email)}
                                  className="text-gray-500 hover:text-red-500"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
  
                      {/* User Dropdown */}
                      <div className="relative">
                        <div
                          className="w-full p-2 rounded-lg border border-gray-300 flex justify-between items-center cursor-pointer"
                          onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        >
                          <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="outline-none text-sm w-full"
                          />
                          {isUserDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
  
                        {isUserDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filteredEmployees.map((employee) => (
                              <div
                                key={employee._id}
                                className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleUserSelection(employee.email)}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.includes(employee.email)}
                                  onChange={() => {}}
                                  className="w-4 h-4 rounded border-gray-300 text-purple-600"
                                />
                                <label className="ml-2">
                                  <span className="block text-sm font-medium">
                                    {employee.firstName}
                                  </span>
                                  <span className="block text-xs text-gray-500">
                                    {employee.department}
                                  </span>
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
  
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          task: "",
                          taskDateTime: "",
                          assignedBy: empId || "",
                        });
                        setSelectedUsers([]);
                        setSelectedDepartments([]);
                        setSubmissionStatus({ submitted: false, message: "" });
                      }}
                      className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 text-sm"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                    >
                      Assign Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default EnqRelatedTask;
