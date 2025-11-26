import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  MessageCircle,
  Building,
  TrendingUp,
  Calendar,
  Target,
  Award,
  BookOpen,
  Brain,
  Zap,
  ChevronDown,
  MoreHorizontal,
  Settings,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import { getSuperAdminDashboard } from "../../../api/service/employee/EmployeeService";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    enquiryCount: 0,
    prospectCount: 0,
    activeKidsCount: 0,
    employeeCount: 0,
    physicalCenterCount: 0,
  });
  const [timeRange, setTimeRange] = useState("week");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        const response = await getSuperAdminDashboard();

        if (response.status === 200) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    color,
    trend,
  }) => (
    <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">
          {title}
        </h3>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
            {loading ? "..." : value.toLocaleString()}
          </span>
          {trend && (
            <span className="text-sm font-medium text-blue-600 flex items-center animate-pulse">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, icon: Icon, color, onClick }) => (
    <button
      onClick={onClick}
      className={`${color} text-white p-6 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-lg flex flex-col items-center text-center space-y-3 relative overflow-hidden group`}
    >
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      <Icon className="w-8 h-8 relative z-10 group-hover:animate-bounce" />
      <span className="font-semibold text-lg relative z-10">{title}</span>
    </button>
  );

  const MetricCard = ({ title, value, icon: Icon, color }) => (
    <div
      className={`${color} bg-opacity-10 p-6 rounded-xl border border-opacity-20`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
        <span className={`text-2xl font-bold ${color.replace("bg-", "text-")}`}>
          {loading ? "..." : value}
        </span>
      </div>
      <h4
        className={`font-semibold ${color.replace("bg-", "text-")} opacity-80`}
      >
        {title}
      </h4>
    </div>
  );

  const totalUsers =
    dashboardData.activeKidsCount + dashboardData.prospectCount;
  const conversionRate =
    dashboardData.enquiryCount > 0
      ? (
        (dashboardData.prospectCount / dashboardData.enquiryCount) *
        100
      ).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <header className="mb-8 lg:mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Super Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Monitor and manage your entire learning ecosystem
              </p>
            </div>

            <div className="flex items-center gap-3 lg:gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-initial">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full lg:w-auto flex items-center justify-center gap-2 bg-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200"
                >
                  <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                  <span className="font-medium text-sm lg:text-base">
                    {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} View
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-10 min-w-[160px]">
                    {["day", "week", "month", "quarter", "year"].map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setTimeRange(range);
                          setShowDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors text-sm"
                      >
                        {range.charAt(0).toUpperCase() + range.slice(1)} View
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="bg-blue-600 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg flex items-center justify-center gap-2 text-sm lg:text-base">
                <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>
        </header>

        {/* Key Metrics Grid */}
        <section className="mb-8 lg:mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
            <StatCard
              title="Total Enquiries"
              value={dashboardData.enquiryCount}
              icon={MessageCircle}
              description="New inquiries received"
              color="bg-blue-500"
              trend="This period"
            />
            <StatCard
              title="Active Prospects"
              value={dashboardData.prospectCount}
              icon={Target}
              description="Potential enrollments"
              color="bg-amber-500"
            />
            <StatCard
              title="Active Students"
              value={dashboardData.activeKidsCount}
              icon={UserCheck}
              description="Currently enrolled"
              color="bg-green-500"
            />
            <StatCard
              title="Staff Members"
              value={dashboardData.employeeCount}
              icon={Users}
              description="Total employees"
              color="bg-purple-500"
            />
            <StatCard
              title="Learning Centers"
              value={dashboardData.physicalCenterCount}
              icon={Building}
              description="Physical locations"
              color="bg-indigo-500"
            />
          </div>
        </section>

        {/* Analytics Overview */}
        <section className="mb-8 lg:mb-10">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Performance Metrics */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                  Performance Overview
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetricCard
                  title="Total Learners"
                  value={totalUsers}
                  icon={Users}
                  color="bg-blue-500"
                />
                <MetricCard
                  title="Conversion Rate"
                  value={`${conversionRate}%`}
                  icon={TrendingUp}
                  color="bg-green-500"
                />
                <MetricCard
                  title="Staff per Center"
                  value={
                    dashboardData.physicalCenterCount > 0
                      ? Math.round(
                        dashboardData.employeeCount /
                        dashboardData.physicalCenterCount
                      )
                      : 0
                  }
                  icon={Building}
                  color="bg-purple-500"
                />
                <MetricCard
                  title="Students per Center"
                  value={
                    dashboardData.physicalCenterCount > 0
                      ? Math.round(
                        dashboardData.activeKidsCount /
                        dashboardData.physicalCenterCount
                      )
                      : 0
                  }
                  icon={BookOpen}
                  color="bg-indigo-500"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                Quick Stats
              </h3>

              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">
                      Enquiry Status
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {dashboardData.enquiryCount === 0
                        ? "No new enquiries"
                        : `${dashboardData.enquiryCount} pending`}
                    </p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-blue-500" />
                </div>

                <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      Active Rate
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {totalUsers > 0
                        ? `${Math.round(
                          (dashboardData.activeKidsCount / totalUsers) * 100
                        )}%`
                        : "0%"}
                    </p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-500" />
                </div>

                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">
                      Team Size
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                      {dashboardData.employeeCount} members
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Center */}
        <section className="mb-8 lg:mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 lg:p-8 border-b border-gray-200">
              <div className="space-y-2">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" />
                  Quick Actions
                </h3>
                <p className="text-gray-600 text-sm lg:text-base">
                  Manage your learning centers efficiently
                </p>
              </div>
            </div>

            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <QuickActionCard
                  title="Manage Centers"
                  icon={Building}
                  color="bg-blue-600"
                  onClick={() => console.log("Manage Centers")}
                />
                <QuickActionCard
                  title="Staff Overview"
                  icon={Users}
                  color="bg-green-600"
                  onClick={() => console.log("Staff Overview")}
                />
                <QuickActionCard
                  title="Student Reports"
                  icon={BookOpen}
                  color="bg-purple-600"
                  onClick={() => console.log("Student Reports")}
                />
                <QuickActionCard
                  title="Analytics"
                  icon={PieChart}
                  color="bg-indigo-600"
                  onClick={() => console.log("Analytics")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* System Status */}
        <footer>
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-6 lg:p-8 text-white">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
              <div className="space-y-2">
                <h3 className="text-xl lg:text-2xl font-bold">System Overview</h3>
                <p className="text-gray-300 text-sm lg:text-base">
                  Your learning management system is running smoothly across all{" "}
                  {dashboardData.physicalCenterCount} centers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium text-sm lg:text-base">
                  All Systems Operational
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mt-6 lg:mt-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {dashboardData.physicalCenterCount}
                </p>
                <p className="text-gray-300">Active Centers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {dashboardData.employeeCount}
                </p>
                <p className="text-gray-300">Team Members</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{totalUsers}</p>
                <p className="text-gray-300">Total Learners</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
