import { useNavigate } from "react-router-dom";
import mindmentors from "../../../../images/mindmentorz.png";
import { useEffect, useState, useRef } from "react";
import { getEmployeeData } from "../../../../api/service/employee/EmployeeService";

const EmployeeTopBar = () => {
  const navigate = useNavigate();
  const department = localStorage.getItem("department");

  const [empData, setEmpData] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const empId = localStorage.getItem("empId");
        if (!empId) {
          console.error("Employee ID not found in localStorage");
          return;
        }

        const response = await getEmployeeData(empId);

        if (response && response.status === 200) {
          setEmpData(response.data);
        } else {
          console.error("Failed to fetch employee data:", response);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployee();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate(`/${department}/department/profile`); // Update this path as needed
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="bg-white shadow-lg">
      <div className="flex justify-between items-center px-5 py-2">
        <div className="flex items-center">
          
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex items-center justify-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {/* Account Icon SVG */}
            <svg
              className="w-8 h-8 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {empData.firstName
                        ? empData.firstName.charAt(0).toUpperCase()
                        : "A"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {empData.firstName || "Aswinraj"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {empData.department || "super-admin"}
                    </p>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Email:</span>{" "}
                    {empData.email || "aswinrajr07@gmail.com"}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Role:</span>{" "}
                    {empData.role || "super-admin"}
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={handleProfileClick}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Profile</span>
                </button>

                <button
                  onClick={handleLogoutClick}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeTopBar;
