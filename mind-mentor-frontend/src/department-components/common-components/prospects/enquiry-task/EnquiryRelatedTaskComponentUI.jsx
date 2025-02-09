/* eslint-disable react/prop-types */
import { Building, ChevronDown, ChevronUp, Users, X } from "lucide-react";
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

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {submissionStatus.submitted && (
        <div
          className={`mb-3 p-2 rounded text-sm text-center ${
            submissionStatus.message.includes("Successfully")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {submissionStatus.message}
        </div>
      )}

      {/* Student Info Card */}
      {kidsInfo && (
        <div className="mb-4 bg-gray-50 rounded-lg p-3">
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
        <div>
          <label className="text-sm font-medium text-gray-700">
            Task Description
          </label>
          <textarea
            name="task"
            value={formData.task}
            onChange={handleInputChange}
            rows={2}
            className="mt-1 w-full p-2 text-sm rounded-lg border focus:ring-1 focus:ring-purple-500 resize-none"
            placeholder="Enter task details..."
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Due Date & Time
          </label>
          <input
            type="datetime-local"
            name="taskDateTime"
            value={formData.taskDateTime}
            onChange={handleInputChange}
            className="mt-1 w-full p-2 text-sm rounded-lg border focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Department and Team Member Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Department Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Departments
            </label>
            {selectedDepartments.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1 p-1.5 bg-gray-50 rounded-lg max-h-16 overflow-y-auto">
                {selectedDepartments.map((dept) => (
                  <div
                    key={dept}
                    className="bg-white px-2 py-0.5 rounded text-xs border flex items-center gap-1"
                  >
                    <Building size={10} />
                    <span>{dept}</span>
                    <button
                      type="button"
                      onClick={() => removeDepartment(dept)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="relative mt-1">
              <div
                className="w-full p-2 text-sm rounded-lg border flex justify-between items-center cursor-pointer"
                onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
              >
                <span className="text-gray-500">Select departments...</span>
                {isDeptDropdownOpen ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </div>
              {isDeptDropdownOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-32 overflow-y-auto">
                  {departments.map((dept) => (
                    <div
                      key={dept}
                      className="flex items-center p-2 hover:bg-gray-50 cursor-pointer text-sm"
                      onClick={() => handleDepartmentSelection(dept)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(dept)}
                        onChange={() => {}}
                        className="w-3 h-3 rounded border-gray-300 text-purple-600"
                      />
                      <label className="ml-2">{dept}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Team Members
            </label>
            {selectedUsers.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1 p-1.5 bg-gray-50 rounded-lg max-h-16 overflow-y-auto">
                {selectedUsers.map((email) => {
                  const user = employeesData.find((emp) => emp.email === email);
                  return (
                    <div
                      key={email}
                      className="bg-white px-2 py-0.5 rounded text-xs border flex items-center gap-1"
                    >
                      <Users size={10} />
                      <span>{user?.firstName}</span>
                      <button
                        type="button"
                        onClick={() => removeUser(email)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Team Members Dropdown */}
            <div className="relative mt-1">
              <div
                className="w-full p-2 text-sm rounded-lg border flex justify-between items-center cursor-pointer"
                onClick={() => setIsUserDropdownOpen((prev) => !prev)}
              >
                <span className="text-gray-500">Select team members...</span>
                {isUserDropdownOpen ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </div>
              {isUserDropdownOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-32 overflow-y-auto">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((user) => (
                      <div
                        key={user.email}
                        className="flex items-center p-2 hover:bg-gray-50 cursor-pointer text-sm"
                        onClick={() => handleUserSelection(user.email)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.email)}
                          readOnly
                          className="w-3 h-3 rounded border-gray-300 text-purple-600"
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
        <div className="flex justify-end gap-2 pt-3">
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
            className="px-3 py-1.5 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 text-sm"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
          >
            Assign Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnquiryRelatedTaskComponentUI;
