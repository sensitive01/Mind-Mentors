/* eslint-disable react/prop-types */
import { Plus, Trash2, X } from "lucide-react";

const EditDialogBox = ({
  showEdit,
  onEditClose,
  formData,
  handleInputChange,
  handleSave,
}) => {
  if (!showEdit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-lg shadow-xl flex flex-col">
 
        <style>
          {`
          .custom-gradient {
            background: linear-gradient(to bottom, #642b8f, #aa88be);
          }
        `}
        </style>

        {/* Header */}
        <div className="custom-gradient flex justify-between items-center p-4 rounded-t-lg">
          <h2 className="text-white text-xl font-semibold">Edit Details</h2>
          <button
            onClick={onEditClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Parent Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.parentName || ""}
                    onChange={(e) =>
                      handleInputChange("parentName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.whatsappNumber || ""}
                    onChange={(e) =>
                      handleInputChange("whatsappNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.contactNumber || ""}
                    onChange={(e) =>
                      handleInputChange("contactNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Kid Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Kid Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kid Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.kidName || ""}
                    onChange={(e) =>
                      handleInputChange("kidName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.kidsAge || ""}
                    onChange={(e) =>
                      handleInputChange("kidsAge", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.kidsGender || ""}
                    onChange={(e) =>
                      handleInputChange("kidsGender", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.schoolName || ""}
                    onChange={(e) =>
                      handleInputChange("schoolName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Pincode
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.schoolPincode || ""}
                    onChange={(e) =>
                      handleInputChange("schoolPincode", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Programs */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Programs</h3>
                <button
                  className="flex items-center gap-1 px-3 py-1 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50"
                  onClick={() => {
                    const updatedPrograms = [
                      ...(formData?.programs || []),
                      { program: "", level: "" },
                    ];
                    handleInputChange("programs", updatedPrograms);
                  }}
                >
                  <Plus size={16} />
                  Add Program
                </button>
              </div>
              <div className="space-y-4">
                {formData?.programs?.map((program, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-5">
                        <input
                          type="text"
                          placeholder="Program Name"
                          className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                          value={program.program || ""}
                          onChange={(e) => {
                            const updatedPrograms = [...formData.programs];
                            updatedPrograms[index].program = e.target.value;
                            handleInputChange("programs", updatedPrograms);
                          }}
                        />
                      </div>
                      <div className="md:col-span-5">
                        <input
                          type="text"
                          placeholder="Level"
                          className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                          value={program.level || ""}
                          onChange={(e) => {
                            const updatedPrograms = [...formData.programs];
                            updatedPrograms[index].level = e.target.value;
                            handleInputChange("programs", updatedPrograms);
                          }}
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <button
                          onClick={() => {
                            const updatedPrograms = formData.programs.filter(
                              (_, i) => i !== index
                            );
                            handleInputChange("programs", updatedPrograms);
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Status Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.payment || ""}
                    onChange={(e) =>
                      handleInputChange("payment", e.target.value)
                    }
                  >
                    <option value="">Select Payment Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.source || ""}
                    onChange={(e) =>
                      handleInputChange("source", e.target.value)
                    }
                  >
                    <option value="">Select Source</option>
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="social">Social Media</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Disposition
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.disposition || ""}
                    onChange={(e) =>
                      handleInputChange("disposition", e.target.value)
                    }
                  >
                    <option value="">Select Disposition</option>
                    <option value="RnR">RnR</option>
                    <option value="Call Back">Call Back</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Demo Schedule
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.scheduleDemo?.status || ""}
                    onChange={(e) =>
                      handleInputChange("scheduleDemo", {
                        ...formData?.scheduleDemo,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Demo Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enrollment Status
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500"
                    value={formData?.enquiryStatus || ""}
                    onChange={(e) =>
                      handleInputChange("enquiryStatus", e.target.value)
                    }
                  >
                    <option value="">Select Enrollment Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Qualified Lead">Qualified Lead</option>
                    <option value="Unqualified Lead">Unqualified Lead</option>
                  </select>
                </div>
              
              </div>
            </div>

            {/* Messages and Notes */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Messages & Notes</h3>
              <div>
                <textarea
                  className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-purple-500 min-h-32 resize-none"
                  placeholder="Enter messages or notes..."
                  value={formData?.message || ""}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end gap-2">
          <button
            onClick={onEditClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDialogBox;
