import React, { useState, useEffect } from "react";
import {
  Users,
  MessageCircle,
  TrendingUp,
  Briefcase,
  Calendar,
  CheckCircle2,
  DollarSign,
  Clock,
  Filter,
  CreditCard,
  AlertCircle,
  UserX,
  UserMinus
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getSuperAdminDashboard } from "../../../api/service/employee/EmployeeService";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("today"); // Default filter

  const [dashboardData, setDashboardData] = useState({
    enquiryCount: 0,
    prospectCount: 0,
    activeKidsCount: 0,
    employeeCount: 0,
    physicalCenterCount: 0,
    totalRevenue: 0,
    renewalAmount: 0, // treating as pending amount
    pendingRenewableCount: 0,
    cancelledKidCount: 0,
    inactiveKidCount: 0,
    employeePresentCount: 0,
    employeeAbsentCount: 0,
    classesScheduled: 0, // Assuming this might come from API or defaulting to 0
    attendanceCount: 0,  // Student attendance if available
    graphData: []
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getSuperAdminDashboard(filter);
        if (response.data && response.data.success) {
          const data = response.data.data || {};
          setDashboardData({
            enquiryCount: data.enquiryCount || 0,
            prospectCount: data.prospectCount || 0,
            activeKidsCount: data.activeKidsCount || 0,
            employeeCount: data.employeeCount || 0,
            physicalCenterCount: data.physicalCenterCount || 0,
            totalRevenue: data.totalAmount || 0,
            renewalAmount: data.renewableAmount || 0,
            pendingRenewableCount: data.pendingRenewableCount || 0,
            cancelledKidCount: data.cancelledKidCount || 0,
            inactiveKidCount: data.inactiveKidCount || 0,
            employeePresentCount: data.employeePresentCount || 0,
            employeeAbsentCount: data.employeeAbsentCount || 0,
            classesScheduled: data.classesScheduled || 0, // Use if available
            attendanceCount: data.attendanceCount || 0, // Use if available
            // If the backend provides graph data, map it here. Otherwise []
            graphData: data.graphData || []
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);


  const FilterTab = ({ label, value }) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${filter === value
          ? "bg-indigo-600 text-white shadow-md transform scale-105"
          : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
        }`}
    >
      {label}
    </button>
  );

  const MetricCard = ({ title, value, icon: Icon, color, subtext, trend }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
        </div>
        {trend && (
          <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-bold flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">
          {loading ? (
            <span className="inline-block w-24 h-8 bg-slate-100 animate-pulse rounded"></span>
          ) : (
            value?.toLocaleString()
          )}
        </h3>
        {subtext && <p className="text-xs text-slate-400 mt-2 font-medium">{subtext}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-8 font-sans">

      {/* Top Header & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Overview for: <span className="font-bold text-indigo-600 capitalize">{filter}</span>
          </p>
        </div>

        <div className="flex p-1 gap-2 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
          <FilterTab label="Today" value="today" />
          <FilterTab label="Week" value="week" />
          <FilterTab label="Month" value="month" />
          <FilterTab label="Year" value="year" />
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {/* 1. Classes / Operations */}
        <MetricCard
          title="Classes Scheduled"
          value={dashboardData.classesScheduled}
          icon={Calendar}
          color="bg-blue-600"
          subtext="Total sessions"
        />

        {/* 2. Employee Attendance */}
        <MetricCard
          title="Staff Present"
          value={dashboardData.employeePresentCount}
          icon={CheckCircle2}
          color="bg-emerald-500"
          subtext={`Absent: ${dashboardData.employeeAbsentCount}`}
        />

        {/* 3. Income */}
        <MetricCard
          title="Total Income"
          value={`₹${dashboardData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-indigo-600"
          subtext="Revenue Collected"
        />

        {/* 4. Renewals Amount */}
        <MetricCard
          title="Renewable Amount"
          value={`₹${dashboardData.renewalAmount.toLocaleString()}`}
          icon={AlertCircle}
          color="bg-amber-500"
          subtext="Outstanding / Pending"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Financial Chart (Only show if data exists) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Financial Overview
            </h3>
          </div>

          <div className="h-[350px] w-full flex items-center justify-center">
            {dashboardData.graphData && dashboardData.graphData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.graphData} barGap={0} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#4f46e5"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="pending"
                    name="Pending"
                    fill="#cbd5e1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-400">
                <p>No graph data available for this period.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Operational Summary */}
        <div className="space-y-6">

          {/* Academy Status */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Academy Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm"><Users className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-slate-600">Active Students</span>
                </div>
                <span className="font-bold text-slate-900">{dashboardData.activeKidsCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm"><MessageCircle className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-slate-600">Enquiries</span>
                </div>
                <span className="font-bold text-slate-900">{dashboardData.enquiryCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-purple-600 shadow-sm"><Briefcase className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-slate-600">Employees</span>
                </div>
                <span className="font-bold text-slate-900">{dashboardData.employeeCount}</span>
              </div>
            </div>
          </div>

          {/* At Risk / Action Items */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 text-red-600">Attention Needed</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-red-600 shadow-sm"><UserMinus className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-slate-700">Inactive Kids</span>
                </div>
                <span className="font-bold text-red-700">{dashboardData.inactiveKidCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-orange-600 shadow-sm"><UserX className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-slate-700">Cancelled</span>
                </div>
                <span className="font-bold text-orange-700">{dashboardData.cancelledKidCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-yellow-600 shadow-sm"><AlertCircle className="w-4 h-4" /></div>
                  <span className="text-sm font-medium text-slate-700">Renewals Due</span>
                </div>
                <span className="font-bold text-yellow-700">{dashboardData.pendingRenewableCount}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
