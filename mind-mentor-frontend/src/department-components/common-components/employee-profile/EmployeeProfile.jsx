import {
  Calendar,
  Edit,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Save,
  X,
  User,
  Shield,
  Building,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  changePassword,
  getEmployeeData,
} from "../../../api/service/employee/EmployeeService";

const EmployeeProfile = () => {
  const empId = localStorage.getItem("empId");
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Employee data state
  const [employeeData, setEmployeeData] = useState({
    _id: "",
    firstName: "",
    email: "",
    department: "",
    role: "",
  });

  const [editedData, setEditedData] = useState({
    firstName: "",
    email: "",
    department: "",
    role: "",
  });

  // Password reset states
  const [passwordResetForm, setPasswordResetForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordResetError, setPasswordResetError] = useState("");
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);

  // Fetch employee data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getEmployeeData(empId);
        console.log(response);
        if (response.status === 200) {
          setEmployeeData(response.data);
          setEditedData({
            firstName: response.data.firstName,
            email: response.data.email,
            department: response.data.department,
            role: response.data.role,
          });
        }
      } catch (err) {
        setError("Failed to load employee data");
        console.error("Error fetching employee data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (empId) {
      fetchData();
    }
  }, [empId]);

  // Generate avatar initials
  const getAvatarInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  // Format role display
  const formatRole = (role) => {
    return (
      role?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
      "Employee"
    );
  };

  // Format department display
  const formatDepartment = (dept) => {
    return (
      dept?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
      "General"
    );
  };

  // Password validation
  const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password
    );

    if (password.length < minLength)
      return "Password must be at least 8 characters long";
    if (!hasUppercase)
      return "Password must contain at least one uppercase letter";
    if (!hasLowercase)
      return "Password must contain at least one lowercase letter";
    if (!hasNumber) return "Password must contain at least one number";
    if (!hasSpecialChar)
      return "Password must contain at least one special character";

    return "";
  };

  // Handle profile save
  const handleSave = () => {
    setEmployeeData((prev) => ({
      ...prev,
      ...editedData,
    }));
    setIsEditing(false);
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditedData({
      firstName: employeeData.firstName,
      email: employeeData.email,
      department: employeeData.department,
      role: employeeData.role,
    });
    setIsEditing(false);
  };

  // Handle profile field change
  const handleChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle password form change
  const handlePasswordResetChange = (field, value) => {
    setPasswordResetForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setPasswordResetError("");

    if (field === "newPassword" && value) {
      const error = validatePasswordStrength(value);
      if (error) setPasswordResetError(error);
    }

    if (field === "confirmPassword" && value) {
      if (passwordResetForm.newPassword !== value) {
        setPasswordResetError("New passwords do not match");
      }
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    setPasswordResetError("");
    setPasswordResetLoading(true);

    if (
      !passwordResetForm.currentPassword ||
      !passwordResetForm.newPassword ||
      !passwordResetForm.confirmPassword
    ) {
      setPasswordResetError("All fields are required");
      setPasswordResetLoading(false);
      return;
    }

    if (passwordResetForm.newPassword !== passwordResetForm.confirmPassword) {
      setPasswordResetError("New passwords do not match");
      setPasswordResetLoading(false);
      return;
    }

    const strengthError = validatePasswordStrength(
      passwordResetForm.newPassword
    );
    if (strengthError) {
      setPasswordResetError(strengthError);
      setPasswordResetLoading(false);
      return;
    }

    try {
      const response = await changePassword(
        passwordResetForm.currentPassword,
        passwordResetForm.newPassword,
        empId
      );

      setPasswordResetSuccess(true);

      setTimeout(() => {
        setIsPasswordResetModalOpen(false);
        setPasswordResetSuccess(false);
        setPasswordResetForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordVisibility({
          current: false,
          new: false,
          confirm: false,
        });
      }, 2000);
    } catch (err) {
      setPasswordResetError(
        "Failed to reset password. Please check your current password."
      );
      console.error("Password reset error:", err);
    } finally {
      setPasswordResetLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      {/* Success Toast */}
      <div
        className={`fixed top-4 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
          showSaveMessage
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>Profile updated successfully!</span>
        </div>
      </div>

      {/* Password Reset Modal */}
      {isPasswordResetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Lock className="w-6 h-6 mr-3 text-blue-500" />
                  Reset Password
                </h2>
                <button
                  onClick={() => setIsPasswordResetModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {passwordResetSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Password reset successful!
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisibility.current ? "text" : "password"}
                        value={passwordResetForm.currentPassword}
                        onChange={(e) =>
                          handlePasswordResetChange(
                            "currentPassword",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {passwordVisibility.current ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisibility.new ? "text" : "password"}
                        value={passwordResetForm.newPassword}
                        onChange={(e) =>
                          handlePasswordResetChange(
                            "newPassword",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {passwordVisibility.new ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisibility.confirm ? "text" : "password"}
                        value={passwordResetForm.confirmPassword}
                        onChange={(e) =>
                          handlePasswordResetChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {passwordVisibility.confirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {passwordResetError && (
                    <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                      <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      {passwordResetError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={passwordResetLoading}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {passwordResetLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Reset Password
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              
            </div>

            {/* Avatar */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
                  {getAvatarInitials(employeeData.firstName)}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            {/* Name and Actions */}
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="text-3xl font-bold text-gray-900 border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 transition-colors duration-200 bg-transparent"
                    placeholder="First Name"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900">
                    {employeeData.firstName}
                  </h1>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-emerald-500 text-white px-6 py-2 rounded-full hover:bg-emerald-600 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsPasswordResetModalOpen(true)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Reset Password</span>
                  </button>
                )}
              </div>
            </div>

            {/* Profile Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedData.firstName}
                          onChange={(e) =>
                            handleChange("firstName", e.target.value)
                          }
                          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {employeeData.firstName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedData.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {employeeData.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Work Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500">
                        Department
                      </label>
                      <p className="text-gray-900 font-medium">
                        {formatDepartment(employeeData.department)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
