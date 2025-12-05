import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Users, Building } from "lucide-react";
import {
  assignTaskForSpecificKid,
  createTasks,
} from "../../../../api/service/employee/EmployeeService";

const EnqRelatedTask = ({ id }) => {
  console.log("enq Related task", id);
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
      setSelectedDepartments([]);
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-purple-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      {/* Status Message */}
      {submissionStatus.submitted && (
        <div
          className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${submissionStatus.message.includes("Successfully")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
            }`}
        >
          {submissionStatus.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 flex-1 overflow-hidden">
        {/* Student Info Card */}
        {kidsInfo && (
          <div className="lg:col-span-1 bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm p-5 border border-purple-100 h-fit">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">
                  {kidsInfo.kidFirstName?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {kidsInfo.kidFirstName}
                </h3>
                <p className="text-sm text-purple-600 font-medium">Student</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-purple-100">
                <p className="text-xs font-semibold text-purple-600 mb-2 uppercase tracking-wide">
                  Enrolled Programs
                </p>
                <div className="space-y-2">
                  {kidsInfo.programs?.length > 0 ? (
                    kidsInfo.programs.map((program, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 bg-purple-50 rounded-md"
                      >
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {program.program}
                          </p>
                          <p className="text-xs text-purple-600">{program.level}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No programs assigned</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Form */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
            <div className="p-5 flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} id="taskForm" className="space-y-5">
                <div className="space-y-5">
                  {/* Task Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Task Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="task"
                      value={formData.task}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-3 text-sm rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                      placeholder="Describe the task in detail..."
                      required
                    />
                  </div>

                  {/* Due Date & Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Due Date & Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="taskDateTime"
                      value={formData.taskDateTime}
                      onChange={handleInputChange}
                      className="w-full md:w-2/3 p-2.5 text-sm rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                    />
                  </div>

                  {/* Assignment Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Department Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Departments
                      </label>

                      {/* Selected Departments Tags */}
                      {selectedDepartments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2 p-2.5 bg-purple-50 rounded-lg border border-purple-100 max-h-24 overflow-y-auto">
                          {selectedDepartments.map((dept) => (
                            <div
                              key={dept}
                              className="bg-white px-2.5 py-1.5 rounded-md flex items-center gap-2 text-sm border border-purple-200 shadow-sm"
                            >
                              <Building size={14} className="text-purple-600" />
                              <span className="font-medium text-gray-700">{dept}</span>
                              <button
                                type="button"
                                onClick={() => removeDepartment(dept)}
                                className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Department Dropdown */}
                      <div className="relative">
                        <div
                          className="w-full p-2.5 rounded-lg border border-gray-300 flex justify-between items-center cursor-pointer hover:border-purple-400 transition-colors bg-white"
                          onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                        >
                          <span className="text-gray-500 text-sm">
                            {selectedDepartments.length > 0
                              ? `${selectedDepartments.length} selected`
                              : "Select departments..."}
                          </span>
                          {isDeptDropdownOpen ? (
                            <ChevronUp size={18} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={18} className="text-gray-400" />
                          )}
                        </div>

                        {isDeptDropdownOpen && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {departments.map((dept) => (
                              <div
                                key={dept}
                                className="flex items-center p-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                                onClick={() => handleDepartmentSelection(dept)}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedDepartments.includes(dept)}
                                  onChange={() => { }}
                                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <label className="ml-2.5 text-sm font-medium text-gray-700 cursor-pointer">
                                  {dept}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* User Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Users <span className="text-red-500">*</span>
                      </label>

                      {/* Selected Users Tags */}
                      {selectedUsers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2 p-2.5 bg-purple-50 rounded-lg border border-purple-100 max-h-24 overflow-y-auto">
                          {selectedUsers.map((email) => {
                            const user = employeesData.find((emp) => emp.email === email);
                            return (
                              <div
                                key={email}
                                className="bg-white px-2.5 py-1.5 rounded-md flex items-center gap-2 text-sm border border-purple-200 shadow-sm"
                              >
                                <Users size={14} className="text-purple-600" />
                                <span className="font-medium text-gray-700">{user?.firstName}</span>
                                <button
                                  type="button"
                                  onClick={() => removeUser(email)}
                                  className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* User Dropdown */}
                      <div className="relative">
                        <div
                          className="w-full p-2.5 rounded-lg border border-gray-300 flex justify-between items-center cursor-pointer hover:border-purple-400 transition-colors bg-white"
                          onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        >
                          <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="outline-none text-sm w-full text-gray-700 placeholder-gray-400"
                          />
                          {isUserDropdownOpen ? (
                            <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                          )}
                        </div>

                        {isUserDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filteredEmployees.length > 0 ? (
                              filteredEmployees.map((employee) => (
                                <div
                                  key={employee._id}
                                  className="flex items-center p-2.5 hover:bg-purple-50 cursor-pointer transition-colors"
                                  onClick={() => handleUserSelection(employee.email)}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(employee.email)}
                                    onChange={() => { }}
                                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                  />
                                  <label className="ml-2.5 cursor-pointer flex-1">
                                    <span className="block text-sm font-medium text-gray-800">
                                      {employee.firstName}
                                    </span>
                                    <span className="block text-xs text-purple-600">
                                      {employee.department}
                                    </span>
                                  </label>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-center text-sm text-gray-500">
                                No users found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form ID for the submit button outside the form */}
                  <input type="hidden" form="taskForm" />
                </div>
              </form>
            </div>

            {/* Action Buttons - Moved outside the scrollable area */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-end gap-3">
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
                  className="px-5 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 text-sm font-semibold transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  form="taskForm"
                  className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-semibold transition-colors shadow-sm"
                >
                  Assign Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnqRelatedTask;