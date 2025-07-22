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
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState("week");
  const [showDropdown, setShowDropdown] = useState(false);

  // API data
  const dashboardData = {
    enquiryCount: 0,
    prospectCount: 2,
    activeKidsCount: 1,
    employeeCount: 11,
    physicalCenterCount: 2,
  };

  // Sample trend data for charts
  const monthlyData = [
    { month: "Jan", enquiries: 15, activeKids: 8, prospects: 5 },
    { month: "Feb", enquiries: 22, activeKids: 12, prospects: 8 },
    { month: "Mar", enquiries: 18, activeKids: 15, prospects: 6 },
    { month: "Apr", enquiries: 28, activeKids: 18, prospects: 10 },
    { month: "May", enquiries: 32, activeKids: 22, prospects: 12 },
    { month: "Jun", enquiries: 25, activeKids: 20, prospects: 8 },
  ];

  const skillsData = [
    { skill: "Chess Openings", beginner: 45, intermediate: 30, advanced: 15 },
    { skill: "Rubik's Speed", beginner: 35, intermediate: 25, advanced: 20 },
    { skill: "Problem Solving", beginner: 40, intermediate: 35, advanced: 25 },
    {
      skill: "Strategic Thinking",
      beginner: 38,
      intermediate: 32,
      advanced: 18,
    },
  ];

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    description,
    color,
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-gray-900">{value}</span>
          {trend && (
            <span
              className={`text-sm font-medium ${
                trend > 0 ? "text-green-600" : "text-red-600"
              } flex items-center`}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="text-gray-500 text-xs">{description}</p>
      </div>
    </div>
  );

  const LineChart = ({ data, height = 200 }) => {
    const maxValue = Math.max(
      ...data.map((d) => Math.max(d.enquiries, d.activeKids, d.prospects))
    );

    return (
      <div className="relative" style={{ height }}>
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              y1={40 + i * 30}
              x2="400"
              y2={40 + i * 30}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}

          {/* Data lines */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            points={data
              .map(
                (d, i) =>
                  `${60 + i * 55},${180 - (d.enquiries / maxValue) * 120}`
              )
              .join(" ")}
          />
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            points={data
              .map(
                (d, i) =>
                  `${60 + i * 55},${180 - (d.activeKids / maxValue) * 120}`
              )
              .join(" ")}
          />
          <polyline
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            points={data
              .map(
                (d, i) =>
                  `${60 + i * 55},${180 - (d.prospects / maxValue) * 120}`
              )
              .join(" ")}
          />

          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              <circle
                cx={60 + i * 55}
                cy={180 - (d.enquiries / maxValue) * 120}
                r="4"
                fill="#3b82f6"
              />
              <circle
                cx={60 + i * 55}
                cy={180 - (d.activeKids / maxValue) * 120}
                r="4"
                fill="#10b981"
              />
              <circle
                cx={60 + i * 55}
                cy={180 - (d.prospects / maxValue) * 120}
                r="4"
                fill="#f59e0b"
              />
              <text
                x={60 + i * 55}
                y="195"
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {d.month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const SkillsBarChart = ({ data }) => (
    <div className="space-y-4">
      {data.map((skill, index) => {
        const total = skill.beginner + skill.intermediate + skill.advanced;
        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                {skill.skill}
              </span>
              <span className="text-xs text-gray-500">{total} students</span>
            </div>
            <div className="flex rounded-lg overflow-hidden bg-gray-100 h-3">
              <div
                className="bg-blue-500"
                style={{ width: `${(skill.beginner / total) * 100}%` }}
                title={`Beginner: ${skill.beginner}`}
              />
              <div
                className="bg-yellow-500"
                style={{ width: `${(skill.intermediate / total) * 100}%` }}
                title={`Intermediate: ${skill.intermediate}`}
              />
              <div
                className="bg-green-500"
                style={{ width: `${(skill.advanced / total) * 100}%` }}
                title={`Advanced: ${skill.advanced}`}
              />
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Beginner ({skill.beginner})
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Intermediate ({skill.intermediate})
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Advanced ({skill.advanced})
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <Calendar className="w-4 h-4" />
              {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} View
              <ChevronDown className="w-4 h-4" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                {["day", "week", "month", "quarter"].map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setTimeRange(range);
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)} View
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Total Enquiries"
            value={dashboardData.enquiryCount}
            icon={MessageCircle}
            trend={0}
            description="New interest this period"
            color="bg-blue-500"
          />
          <StatCard
            title="Prospects"
            value={dashboardData.prospectCount}
            icon={Target}
            trend={15}
            description="Potential new students"
            color="bg-yellow-500"
          />
          <StatCard
            title="Active Students"
            value={dashboardData.activeKidsCount}
            icon={UserCheck}
            trend={8}
            description="Currently enrolled kids"
            color="bg-green-500"
          />
          <StatCard
            title="Staff Members"
            value={dashboardData.employeeCount}
            icon={Users}
            trend={5}
            description="Chess & Rubik's coaches"
            color="bg-purple-500"
          />
          <StatCard
            title="Learning Centers"
            value={dashboardData.physicalCenterCount}
            icon={Building}
            trend={0}
            description="Physical locations"
            color="bg-indigo-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrollment Trends */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Enrollment Trends
              </h3>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Enquiries
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Active Students
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  Prospects
                </span>
              </div>
            </div>
            <LineChart data={monthlyData} />
          </div>

          {/* Skills Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-green-500" />
                Skills Distribution
              </h3>
            </div>
            <SkillsBarChart data={skillsData} />
          </div>
        </div>

        {/* Activity Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { name: "Chess Progress", icon: BookOpen },
                { name: "Rubik's Records", icon: Zap },
                { name: "Student Analytics", icon: Users },
              ].map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === index
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Opening Mastery
                  </h4>
                  <p className="text-2xl font-bold text-blue-700">85%</p>
                  <p className="text-blue-600 text-sm">
                    Average completion rate
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Tactical Progress
                  </h4>
                  <p className="text-2xl font-bold text-green-700">92%</p>
                  <p className="text-green-600 text-sm">
                    Problem solving accuracy
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    Tournament Ready
                  </h4>
                  <p className="text-2xl font-bold text-purple-700">12</p>
                  <p className="text-purple-600 text-sm">Students qualified</p>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    Speed Records
                  </h4>
                  <p className="text-2xl font-bold text-orange-700">45s</p>
                  <p className="text-orange-600 text-sm">Average solve time</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
                  <h4 className="font-semibold text-red-900 mb-2">
                    Personal Bests
                  </h4>
                  <p className="text-2xl font-bold text-red-700">23</p>
                  <p className="text-red-600 text-sm">New records this month</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl">
                  <h4 className="font-semibold text-indigo-900 mb-2">
                    Advanced Methods
                  </h4>
                  <p className="text-2xl font-bold text-indigo-700">78%</p>
                  <p className="text-indigo-600 text-sm">
                    CFOP method adoption
                  </p>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Age Distribution
                  </h4>
                  <div className="space-y-3">
                    {[
                      { age: "6-8 years", count: 15, color: "bg-blue-500" },
                      { age: "9-11 years", count: 25, color: "bg-green-500" },
                      { age: "12-14 years", count: 18, color: "bg-yellow-500" },
                      { age: "15+ years", count: 8, color: "bg-purple-500" },
                    ].map((group, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-4 h-4 ${group.color} rounded`}></div>
                        <span className="text-sm text-gray-600 flex-1">
                          {group.age}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {group.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Learning Preferences
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        preference: "Chess Only",
                        count: 12,
                        color: "bg-brown-500",
                      },
                      {
                        preference: "Rubik's Only",
                        count: 8,
                        color: "bg-orange-500",
                      },
                      {
                        preference: "Both Programs",
                        count: 28,
                        color: "bg-teal-500",
                      },
                    ].map((pref, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-4 h-4 ${pref.color} rounded`}></div>
                        <span className="text-sm text-gray-600 flex-1">
                          {pref.preference}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {pref.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              title: "Schedule Tournament",
              icon: Award,
              color: "bg-yellow-500",
            },
            { title: "Add New Student", icon: Users, color: "bg-blue-500" },
            {
              title: "Progress Reports",
              icon: BookOpen,
              color: "bg-green-500",
            },
            { title: "Coach Training", icon: Brain, color: "bg-purple-500" },
          ].map((action, index) => (
            <button
              key={index}
              className={`${action.color} text-white p-4 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-3 shadow-lg`}
            >
              <action.icon className="w-5 h-5" />
              <span className="font-medium">{action.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
