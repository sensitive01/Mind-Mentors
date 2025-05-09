import { useState } from "react";

const NewLeaveForm = () => {
  const [formData, setFormData] = useState({
    employeeName: "Aswinraj R",
    category: "leave", // "leave" or "permission"
    leaveType: "",
    startDate: "",
    endDate: "",
    remarks: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (category) => {
    setFormData({
      ...formData,
      category,
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Here you would typically send the data to an API
    alert("Form submitted successfully!");
  };

  return (
    <div className="bg-blue-500 min-h-screen p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left Column */}
          <div className="space-y-6 border rounded-lg p-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Employee Name:
              </label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category:
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="leave"
                    name="category"
                    checked={formData.category === "leave"}
                    onChange={() => handleCategoryChange("leave")}
                    className="mr-2"
                  />
                  <label htmlFor="leave">Leave</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="permission"
                    name="category"
                    checked={formData.category === "permission"}
                    onChange={() => handleCategoryChange("permission")}
                    className="mr-2"
                  />
                  <label htmlFor="permission">Permission</label>
                </div>
              </div>
            </div>

            {formData.category === "leave" ? (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Leave Type:
                  </label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select Leave Type</option>
                    <option value="sick">Sick Leave</option>
                    <option value="casual">Casual Leave</option>
                    <option value="paid">Paid Leave</option>
                    <option value="unpaid">Unpaid Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Leave Dates:
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    />
                    <span>to</span>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Permission Type:
                  </label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select Permission Type</option>
                    <option value="late">Late Arrival</option>
                    <option value="early">Early Departure</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Permission Date:
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Time Range:
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      name="startTime"
                      className="border border-gray-300 rounded-md p-2 w-full"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      name="endTime"
                      className="border border-gray-300 rounded-md p-2 w-full"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6 border rounded-lg p-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Remarks:
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2 h-32"
                placeholder="Add any remarks"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Attachment:
              </label>
              <div className="border border-gray-300 rounded-md p-2">
                <button className="bg-gray-200 px-2 py-1 rounded-md mr-2">
                  Choose File
                </button>
                <span className="text-gray-500">No file chosen</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center p-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewLeaveForm;