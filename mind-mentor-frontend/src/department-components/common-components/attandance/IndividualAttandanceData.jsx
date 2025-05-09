import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  ChevronDown,
  BarChart2,
  Briefcase,
  Clock as ClockIcon,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { getEmployeeAttandanceRecord } from "../../../api/service/employee/EmployeeService";

// Define primary theme color
const primaryColor = "#2563eb"; // Blue-600

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export default function EmployeeAttendance() {
  const { employeeId } = useParams();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [employeeData, setEmployeeData] = useState({
    empId: "",
    name: "",
    department: "",
    position: "",
    profileImage: "/api/placeholder/120/120",
    attendance: [] // Initialize with empty array to prevent errors
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data for employee ID:", employeeId);
        
        if (!employeeId) {
          console.error("Employee ID is undefined or null");
          setError("Employee ID is missing");
          setLoading(false);
          return;
        }

        const response = await getEmployeeAttandanceRecord(employeeId);
        console.log("API Response:", response);
        
        if (response && response.status === 200 && response.data) {
          setEmployeeData({
            empId: response.data.empId || "",
            name: response.data.name || "",
            department: response.data.department || "",
            position: response.data.position || "",
            profileImage: response.data.profileImage || "/api/placeholder/120/120",
            attendance: Array.isArray(response.data.attendance) ? response.data.attendance : [],
          });
        } else {
          console.error("Invalid API response format:", response);
          setError("Failed to load employee data");
        }
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [employeeId]); // Add employeeId as dependency to re-fetch when it changes

  const filteredAttendance = selectedStatus === "All"
    ? (employeeData.attendance || [])
    : (employeeData.attendance || []).filter(
        (record) => record.status === selectedStatus
      );

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Late":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Absent":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Present":
        return <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>;
      case "Late":
        return <div className="h-2 w-2 rounded-full bg-amber-500 mr-1.5"></div>;
      case "Absent":
        return <div className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></div>;
      default:
        return null;
    }
  };

  // Safely calculate attendance statistics
  const attendanceSummary = {
    present: (employeeData.attendance || []).filter(
      (record) => record.status === "Present"
    ).length,
    late: (employeeData.attendance || []).filter(
      (record) => record.status === "Late"
    ).length,
    absent: (employeeData.attendance || []).filter(
      (record) => record.status === "Absent"
    ).length,
  };

  // Calculate attendance percentage safely
  const totalDays = (employeeData.attendance || []).length;
  const presentPercentage = totalDays > 0 
    ? Math.round((attendanceSummary.present / totalDays) * 100) 
    : 0;
  const latePercentage = totalDays > 0 
    ? Math.round((attendanceSummary.late / totalDays) * 100) 
    : 0;
  const absentPercentage = totalDays > 0 
    ? Math.round((attendanceSummary.absent / totalDays) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header section with employee info */}
      <div className="bg-gradient-to-r from-primary to-primary px-6 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-4">
              <img
                src={employeeData.profileImage}
                alt={employeeData.name || "Employee"}
                className="h-16 w-16 rounded-full border-4 border-white shadow-md"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {employeeData.name || "Employee Name"}
              </h1>
              <div className="flex items-center text-blue-100 mt-1">
                <Briefcase size={14} className="mr-1" />
                <span className="text-sm">{employeeData.position || "Position"}</span>
                <span className="mx-2">•</span>
                <span className="text-sm">ID: {employeeData.empId || "N/A"}</span>
                <span className="mx-2">•</span>
                <span className="text-sm">{employeeData.department || "Department"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <div className="text-xs text-blue-100 uppercase tracking-wider mb-1">
                Date Range
              </div>
              <div className="flex items-center text-white">
                <span>{dateRange}</span>
                <ChevronDown size={16} className="ml-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <User size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Present</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-gray-800">
                {attendanceSummary.present}
              </p>
              <p className="ml-2 text-sm text-gray-500">
                ({presentPercentage}%)
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
            <ClockIcon size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Late</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-gray-800">
                {attendanceSummary.late}
              </p>
              <p className="ml-2 text-sm text-gray-500">({latePercentage}%)</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
            <AlertCircle size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Absent</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-gray-800">
                {attendanceSummary.absent}
              </p>
              <p className="ml-2 text-sm text-gray-500">
                ({absentPercentage}%)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table section */}
      <div className="px-6 py-4">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Attendance Records
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedStatus("All")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  selectedStatus === "All"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedStatus("Present")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  selectedStatus === "Present"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Present
              </button>
              <button
                onClick={() => setSelectedStatus("Late")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  selectedStatus === "Late"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Late
              </button>
              <button
                onClick={() => setSelectedStatus("Absent")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  selectedStatus === "Absent"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Absent
              </button>
            </div>
          </div>

          {filteredAttendance.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Calendar size={24} className="text-gray-400" />
              </div>
              <h3 className="text-gray-500 font-medium mb-1">No attendance records found</h3>
              <p className="text-gray-400 text-sm">
                There are no attendance records available for the selected filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Login Time
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Logout Time
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Hours
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Late By
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAttendance.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3.5 px-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar size={16} className="text-gray-400 mr-2" />
                          {formatDate(record.date)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            record.status
                          )}`}
                        >
                          {getStatusIcon(record.status)}
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-700">
                        {record.loginTime || "-"}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-700">
                        {record.logoutTime || "-"}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-700">
                        {record.totalHours || "-"}
                      </td>
                      <td className="py-3.5 px-4 text-sm">
                        {record.status === "Late" ? (
                          <div className="text-amber-600 font-medium">
                            {record.lateBy}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 pb-4">
          <div>
            Showing {filteredAttendance.length} of{" "}
            {(employeeData.attendance || []).length} entries
          </div>
          <div className="flex items-center space-x-1">
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}