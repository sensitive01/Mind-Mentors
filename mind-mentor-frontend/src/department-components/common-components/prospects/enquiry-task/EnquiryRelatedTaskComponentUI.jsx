/* eslint-disable react/prop-types */
import { Calendar, Users, Building, X, Send, RefreshCw } from "lucide-react";
import { useState } from "react";

const EnquiryRelatedTaskComponentUI = ({
  department,
  submissionStatus,
  kidsInfo,
  departments,
  formData,
  setSearchTerm,
  handleInputChange,
  selectedUsers,
  filteredEmployees,
  handleDepartmentSelection,
  handleUserSelection,
  removeUser,
  removeDepartment,
  handleSubmit,
  selectedDepartments,
  employeesData,
  setFormData,
  setSelectedUsers,
  setSelectedDepartments,
  setSubmissionStatus,
  searchTerm,
}) => {
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const empId = localStorage.getItem("empId");

  const resetForm = () => {
    setFormData({
      task: "",
      taskDateTime: "",
      assignedBy: empId || "",
    });
    setSelectedUsers([]);
    setSelectedDepartments([]);
    setSubmissionStatus({ submitted: false, message: "" });
  };

  return (
    <div className="flex flex-col h-full">
     

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {/* Status Message */}
        {submissionStatus.submitted && (
          <div
            className={`mb-4 p-2 rounded text-sm text-center ${
              submissionStatus.message.includes("Successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {submissionStatus.message}
          </div>
        )}

        {/* Student Info (if present) */}
        {kidsInfo && (
          <div className="mb-4 bg-white rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block mb-1">Student Name</span>
                <span className="font-medium">{kidsInfo.kidFirstName}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Programs</span>
                <div className="space-y-0.5">
                  {kidsInfo.programs.map((programInfo, index) => (
                    <span
                      key={programInfo._id || index}
                      className="block text-xs font-medium"
                    >
                      {programInfo.program} - {programInfo.level}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Description */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Task Description
            </label>
            <textarea
              name="task"
              value={formData.task}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 text-sm rounded-lg border border-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none"
              placeholder="Enter task details..."
            />
          </div>

          {/* Due Date & Time */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
              <Calendar size={16} className="text-purple-600 mr-2" />
              Due Date & Time
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                name="taskDateTime"
                value={formData.taskDateTime}
                onChange={handleInputChange}
                className="w-full p-3 text-sm rounded-lg border border-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                placeholder="dd-mm-yyyy --:--"
              />
            </div>
          </div>

          {/* Department and Team Member section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Departments */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                <Building size={16} className="text-purple-600 mr-2" />
                Departments
              </label>
              
              {/* Selected Departments */}
              <div className="mt-2 mb-3">
                {selectedDepartments.map((dept) => (
                  <div
                    key={dept}
                    className="bg-purple-100 px-3 py-1 rounded-full text-sm flex items-center justify-between text-purple-700 mb-2"
                  >
                    <span>{dept}</span>
                    <button
                      type="button"
                      onClick={() => removeDepartment(dept)}
                      className="text-purple-700 hover:text-purple-900"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Department Dropdown */}
              <div className="relative">
                <div
                  className="w-full p-3 text-sm rounded-lg border border-gray-300 flex justify-between items-center cursor-pointer"
                  onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                >
                  <span className="text-gray-500">Select departments...</span>
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
                {isDeptDropdownOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {departments.map((dept) => (
                      <div
                        key={dept}
                        className="flex items-center p-2 hover:bg-gray-50 cursor-pointer text-sm"
                        onClick={() => {
                          handleDepartmentSelection(dept);
                          setIsDeptDropdownOpen(false);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(dept)}
                          readOnly
                          className="w-4 h-4 rounded border-gray-300 text-purple-600"
                        />
                        <label className="ml-2">{dept}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                <Users size={16} className="text-purple-600 mr-2" />
                Team Members
              </label>
              
              {/* Selected Users */}
              <div className="mt-2 mb-3">
                {selectedUsers.map((email) => {
                  const user = employeesData.find((emp) => emp.email === email);
                  const displayName = user?.firstName || email.split("@")[0];
                  return (
                    <div
                      key={email}
                      className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center justify-between text-blue-700 mb-2"
                    >
                      <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        <span>{displayName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeUser(email)}
                        className="text-blue-700 hover:text-blue-900"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
              
              {/* Team Members Dropdown */}
              <div className="relative">
                <div
                  className="w-full p-3 text-sm rounded-lg border border-gray-300 flex justify-between items-center cursor-pointer"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <span className="text-gray-500">
                    {selectedUsers.length > 0
                      ? `${selectedUsers.length} member(s) selected`
                      : "Select team members..."}
                  </span>
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
                {isUserDropdownOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((user) => (
                        <div
                          key={user.email}
                          className="flex items-center p-2 hover:bg-gray-50 cursor-pointer text-sm"
                          onClick={() => {
                            handleUserSelection(user.email);
                            setIsUserDropdownOpen(false);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.email)}
                            readOnly
                            className="w-4 h-4 rounded border-gray-300 text-purple-600"
                          />
                          <label className="ml-2">{user.firstName}</label>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        No team members available
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <RefreshCw size={16} className="mr-1" />
              Reset
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Send size={16} className="mr-1" />
              Assign Tasks
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryRelatedTaskComponentUI;