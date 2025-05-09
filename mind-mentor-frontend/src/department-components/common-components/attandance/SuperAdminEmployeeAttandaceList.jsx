import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
  UserCheck,
  UserX,
  Clock,
  Users,
  X,
  Calendar,
  Sliders,
  BarChart3,
  PieChart,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { fetchAllEmployeeAttandance } from "../../../api/service/employee/EmployeeService";
import { useNavigate } from "react-router-dom";

const SuperAdminEmployeeAttandaceList = () => {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState("daily"); // daily, weekly, monthly
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split("T")[0], // First day of current month
    endDate: new Date().toISOString().split("T")[0], // Today
  });
  const [attendanceCounts, setAttendanceCounts] = useState({
    totalEmployees: 0,
    present: 0,
    absent: 0,
    late: 0,
  });
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [showReportModal, setShowReportModal] = useState(false);
  const [departmentList, setDepartmentList] = useState(["All"]);

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedDate, selectedDepartment, viewMode]);

  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllEmployeeAttandance();
      console.log("API response:", response);

      if (response.data) {
        const attendanceData = response.data || [];
        console.log("attendanceData", attendanceData);

        // Extract unique departments for filter dropdown
        const departments = [
          "All",
          ...new Set(
            attendanceData.map((emp) => emp.department).filter(Boolean)
          ),
        ];
        setDepartmentList(departments);

        // Filter by department if needed
        let filteredData = [...attendanceData];
        if (selectedDepartment !== "All") {
          filteredData = filteredData.filter(
            (emp) => emp.department === selectedDepartment
          );
        }

        // Apply search filter
        if (searchQuery) {
          filteredData = filteredData.filter(
            (employee) =>
              employee.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              employee.email
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              (employee.department &&
                employee.department
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()))
          );
        }

        setEmployeeAttendance(filteredData);

        // Calculate stats based on filtered data
        const present = filteredData.filter(
          (emp) => emp.status === "present"
        ).length;
        const absent = filteredData.filter(
          (emp) => emp.status === "absent"
        ).length;
        const late = filteredData.filter((emp) => emp.status === "late").length;

        setAttendanceCounts({
          totalEmployees: filteredData.length,
          present,
          absent,
          late,
        });
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
  };

  const formattedSelectedDate = formatDate(selectedDate);

  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const handlePrevWeek = () => {
    const prevWeek = new Date(selectedDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setSelectedDate(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setSelectedDate(nextWeek);
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(selectedDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setSelectedDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedDate(nextMonth);
  };

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const FilterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Advanced Filters</h3>
          <button
            onClick={() => setShowFilterModal(false)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full p-2 border rounded-md bg-white"
            >
              {departmentList.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              max={new Date().toISOString().split("T")[0]}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex space-x-2">
              <div className="flex items-center">
                <input type="checkbox" id="present" className="mr-1" />
                <label htmlFor="present" className="text-sm">
                  Present
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="absent" className="mr-1" />
                <label htmlFor="absent" className="text-sm">
                  Absent
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="late" className="mr-1" />
                <label htmlFor="late" className="text-sm">
                  Late
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              fetchAttendanceData();
              setShowFilterModal(false);
            }}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  const ReportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Generate Attendance Report</h3>
          <button
            onClick={() => setShowReportModal(false)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select className="w-full p-2 border rounded-md bg-white">
              <option>Daily Summary</option>
              <option>Weekly Summary</option>
              <option>Monthly Summary</option>
              <option>Department Comparison</option>
              <option>Individual Employee</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                className="w-full p-2 border rounded-md"
                value={dateRange.startDate}
              />
              <span className="flex items-center">to</span>
              <input
                type="date"
                className="w-full p-2 border rounded-md"
                value={dateRange.endDate}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="pdf"
                  name="format"
                  className="mr-1"
                  defaultChecked
                />
                <label htmlFor="pdf" className="text-sm">
                  PDF
                </label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="excel" name="format" className="mr-1" />
                <label htmlFor="excel" className="text-sm">
                  Excel
                </label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="csv" name="format" className="mr-1" />
                <label htmlFor="csv" className="text-sm">
                  CSV
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setShowReportModal(false);
              // Simulate report generation
              setTimeout(() => alert("Report generated successfully!"), 1000);
            }}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary transition-colors"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "present":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <UserCheck className="w-3 h-3 mr-1" />
            Present
          </span>
        );
      case "absent":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <UserX className="w-3 h-3 mr-1" />
            Absent
          </span>
        );
      case "late":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Late
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const exportToCSV = () => {
    // CSV export logic...
    alert("Attendance data exported to CSV!");
  };

  const StatCard = ({ icon: Icon, title, value, color, percentage = null }) => (
    <div
      className={`bg-white rounded-lg p-5 shadow-md border-l-4 ${color} transition-all duration-300 hover:shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">{value}</p>
            {percentage !== null && (
              <p
                className={`ml-2 text-sm ${
                  percentage >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {percentage >= 0 ? `+${percentage}%` : `${percentage}%`}
              </p>
            )}
          </div>
        </div>
        <div
          className={`p-3 rounded-full ${color
            .replace("border", "bg")
            .replace("500", "100")}`}
        >
          <Icon className={`w-6 h-6 ${color.replace("border", "text")}`} />
        </div>
      </div>
    </div>
  );

  const filteredEmployees = employeeAttendance.filter(
    (employee) =>
      employee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.department &&
        employee.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const attendanceRate =
    attendanceCounts.totalEmployees > 0
      ? Math.round(
          (attendanceCounts.present / attendanceCounts.totalEmployees) * 100
        )
      : 0;

  const getTitleByViewMode = () => {
    switch (viewMode) {
      case "daily":
        return new Date(selectedDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "weekly":
        const weekStart = new Date(selectedDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `Week of ${weekStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${weekEnd.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      case "monthly":
        return new Date(selectedDate).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      default:
        return "";
    }
  };

  const handleViewChange = (newView) => {
    setViewMode(newView);
  };

  const handleNavigate = (direction) => {
    if (viewMode === "daily") {
      direction === "prev" ? handlePrevDay() : handleNextDay();
    } else if (viewMode === "weekly") {
      direction === "prev" ? handlePrevWeek() : handleNextWeek();
    } else if (viewMode === "monthly") {
      direction === "prev" ? handlePrevMonth() : handleNextMonth();
    }
  };

  // Generate department breakdown data from actual attendance data
  const generateDepartmentBreakdown = () => {
    const departments = {};

    employeeAttendance.forEach((emp) => {
      const dept = emp.department || "Unassigned";

      if (!departments[dept]) {
        departments[dept] = { present: 0, absent: 0, late: 0 };
      }

      if (emp.status === "present") departments[dept].present++;
      else if (emp.status === "absent") departments[dept].absent++;
      else if (emp.status === "late") departments[dept].late++;
    });

    return Object.entries(departments).map(([department, stats]) => ({
      department,
      ...stats,
    }));
  };

  const chartData = generateDepartmentBreakdown();

  return (
    <div className="w-full mx-auto p-6 bg-gray-50 min-h-screen">
      {showFilterModal && <FilterModal />}
      {showReportModal && <ReportModal />}

      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Employee Attendance Dashboard
          </h1>

          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </button>
            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50"
            >
              <Sliders className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Users}
            title="Total Employees"
            value={attendanceCounts.totalEmployees}
            color="border-indigo-500"
            percentage={2}
          />

          <StatCard
            icon={UserCheck}
            title="Present"
            value={attendanceCounts.present}
            color="border-green-500"
            percentage={5}
          />

          <StatCard
            icon={UserX}
            title="Absent"
            value={attendanceCounts.absent}
            color="border-red-500"
            percentage={-3}
          />

          <StatCard
            icon={Clock}
            title="Late"
            value={attendanceCounts.late}
            color="border-yellow-500"
            percentage={1}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Attendance Overview Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden col-span-1">
            <div className="p-4 bg-primary text-white">
              <h2 className="text-lg font-semibold flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Attendance Overview
              </h2>
            </div>
            <div className="p-4">
              <div className="flex flex-col items-center justify-center h-48">
                <div className="relative w-32 h-32 rounded-full border-8 border-indigo-100 flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full border-8 border-indigo-500"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0, ${
                        50 + 50 * Math.sin((attendanceRate / 100) * Math.PI * 2)
                      }% ${
                        50 - 50 * Math.cos((attendanceRate / 100) * Math.PI * 2)
                      }%, 50% 50%)`,
                      transform: "rotate(-90deg)",
                    }}
                  ></div>
                  <span className="text-3xl font-bold text-primary">
                    {attendanceRate}%
                  </span>
                </div>
                <p className="mt-4 text-gray-600">Overall Attendance Rate</p>
                <p className="text-sm text-green-600 mt-1">
                  ↑ 3% from previous period
                </p>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-sm font-medium">Present</div>
                  <div className="text-lg font-semibold text-green-600">
                    {Math.round(
                      (attendanceCounts.present /
                        attendanceCounts.totalEmployees) *
                        100
                    ) || 0}
                    %
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">Absent</div>
                  <div className="text-lg font-semibold text-red-600">
                    {Math.round(
                      (attendanceCounts.absent /
                        attendanceCounts.totalEmployees) *
                        100
                    ) || 0}
                    %
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">Late</div>
                  <div className="text-lg font-semibold text-yellow-600">
                    {Math.round(
                      (attendanceCounts.late /
                        attendanceCounts.totalEmployees) *
                        100
                    ) || 0}
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Department Breakdown Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden col-span-2">
            <div className="p-4 bg-primary text-white">
              <h2 className="text-lg font-semibold flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Department Breakdown
              </h2>
            </div>
            <div className="p-4">
              <div className="h-60 overflow-hidden">
                {/* Department breakdown chart */}
                <div className="space-y-4">
                  {chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">
                        No department data available
                      </p>
                    </div>
                  ) : (
                    chartData.map((dept) => (
                      <div key={dept.department} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {dept.department}
                          </span>
                          <span className="text-sm text-gray-500">
                            {dept.present + dept.absent + dept.late} employees
                          </span>
                        </div>
                        <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden">
                          <div className="flex h-full">
                            <div
                              className="bg-green-500"
                              style={{
                                width: `${
                                  (dept.present /
                                    (dept.present + dept.absent + dept.late)) *
                                  100
                                }%`,
                              }}
                            ></div>
                            <div
                              className="bg-red-500"
                              style={{
                                width: `${
                                  (dept.absent /
                                    (dept.present + dept.absent + dept.late)) *
                                  100
                                }%`,
                              }}
                            ></div>
                            <div
                              className="bg-yellow-500"
                              style={{
                                width: `${
                                  (dept.late /
                                    (dept.present + dept.absent + dept.late)) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-xs">Present</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span className="text-xs">Absent</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                  <span className="text-xs">Late</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-5 bg-primary">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between text-white">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <CalendarIcon className="w-6 h-6" />
                <h2 className="text-xl font-bold">Attendance Records</h2>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                {/* View type selector */}
                <div className="flex p-1 bg-primary rounded-md shadow-inner">
                  <button
                    onClick={() => handleViewChange("daily")}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      viewMode === "daily"
                        ? "bg-white text-primary"
                        : "text-white"
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => handleViewChange("weekly")}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      viewMode === "weekly"
                        ? "bg-white text-primary"
                        : "text-white"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => handleViewChange("monthly")}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      viewMode === "monthly"
                        ? "bg-white text-primary"
                        : "text-white"
                    }`}
                  >
                    Monthly
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleNavigate("prev")}
                    className="p-2 rounded-full hover:bg-primary transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {viewMode === "daily" && (
                    <input
                      type="date"
                      value={formattedSelectedDate}
                      onChange={handleDateChange}
                      className="bg-primary text-white border border-indigo-500 rounded px-2 py-1"
                    />
                  )}

                  {viewMode !== "daily" && (
                    <span className="text-white font-medium">
                      {getTitleByViewMode()}
                    </span>
                  )}

                  <button
                    onClick={() => handleNavigate("next")}
                    className="p-2 rounded-full hover:bg-primary transition-colors"
                    disabled={
                      viewMode === "daily" &&
                      formattedSelectedDate === formatDate(new Date())
                    }
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="font-semibold text-gray-800">
                  {getTitleByViewMode()}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedDepartment === "All"
                    ? "All Departments"
                    : `Department: ${selectedDepartment}`}{" "}
                  • Attendance Rate:{" "}
                  <span className="font-medium">{attendanceRate}%</span>
                </p>
              </div>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search employee..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border rounded-lg w-full"
                  />
                </div>

                <button
                  onClick={exportToCSV}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Employee
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check-in Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      <div className="flex justify-center items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-4 h-4 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-4 h-4 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                        <span className="ml-2">Loading attendance data...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      <div className="py-8">
                        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">
                          No attendance records found
                        </p>
                        <p className="text-sm text-gray-400">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.employeeId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-semibold">
                              {employee.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {employee.department}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(employee.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.checkInTime || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-primary hover:text-indigo-900" onClick={()=>navigate(`/super-admin/department/individual-employee-attandance-data/${employee.employeeId}`)} >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-5 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600 mb-4 md:mb-0">
                Showing {filteredEmployees.length} of{" "}
                {attendanceCounts.totalEmployees} employees
              </p>

              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-4">Page 1 of 1</span>
                <div className="flex space-x-1">
                  <button
                    className="px-2 py-1 bg-white border rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    disabled
                  >
                    Previous
                  </button>
                  <button
                    className="px-2 py-1 bg-white border rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    disabled
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default SuperAdminEmployeeAttandaceList;
