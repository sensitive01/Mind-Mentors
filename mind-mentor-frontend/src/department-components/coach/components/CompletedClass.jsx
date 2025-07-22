import React, { useEffect, useState, useMemo } from "react";
import { getConductedClassITaught } from "../../../api/service/employee/coachService";

const CompletedClass = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedClass, setExpandedClass] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 10;

  const empId = localStorage.getItem("empId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getConductedClassITaught(empId);

        if (response.status===200) {
          setClasses(response.data.taughtClasses);
        } else if (Array.isArray(response)) {
          setClasses(response.data.taughtClasses);
        }
      } catch (err) {
        setError("Failed to fetch class data");
        console.error("Error fetching classes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (empId) {
      fetchData();
    }
  }, [empId]);

  // Memoized filtered and sorted classes
  const filteredAndSortedClasses = useMemo(() => {
    let filtered = classes.filter((classItem) => {
      const matchesSearch =
        classItem.classId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.students.some((student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesStatus =
        filterStatus === "all" ||
        classItem.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.conductedDate) - new Date(a.conductedDate);
        case "students":
          return b.students.length - a.students.length;
        case "attendance":
          const aRate =
            a.students.length > 0
              ? a.students.filter((s) => s.attendance === "Present").length /
                a.students.length
              : 0;
          const bRate =
            b.students.length > 0
              ? b.students.filter((s) => s.attendance === "Present").length /
                b.students.length
              : 0;
          return bRate - aRate;
        default:
          return 0;
      }
    });

    return filtered;
  }, [classes, searchTerm, sortBy, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedClasses.length / classesPerPage
  );
  const currentClasses = filteredAndSortedClasses.slice(
    (currentPage - 1) * classesPerPage,
    currentPage * classesPerPage
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAttendanceStats = (students) => {
    const present = students.filter(
      (student) => student.attendance === "Present"
    ).length;
    const total = students.length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    return { present, total, rate };
  };

  const toggleExpanded = (classId) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 m-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Completed Classes
        </h1>
        <p className="text-gray-600 text-sm">
          Total: {classes.length} classes conducted
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Class ID or student name..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Latest First</option>
              <option value="students">Most Students</option>
              <option value="attendance">Best Attendance</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="conducted">Conducted</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing {currentClasses.length} of{" "}
              {filteredAndSortedClasses.length} classes
            </div>
          </div>
        </div>
      </div>

      {/* Classes List */}
      <div className="space-y-3">
        {currentClasses.map((classItem) => {
          const { present, total, rate } = getAttendanceStats(
            classItem.students
          );
          const isExpanded = expandedClass === classItem._id;

          return (
            <div
              key={classItem._id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              {/* Compact Row */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleExpanded(classItem._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {classItem.classId.substring(
                          classItem.classId.length - 8
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(classItem.conductedDate)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-600">
                        {total}
                      </div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium text-green-600">
                        {present}
                      </div>
                      <div className="text-xs text-gray-500">Present</div>
                    </div>

                    <div className="text-center">
                      <div
                        className={`text-sm font-medium ${
                          rate >= 80
                            ? "text-green-600"
                            : rate >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {rate}%
                      </div>
                      <div className="text-xs text-gray-500">Attendance</div>
                    </div>

                    <div>
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          classItem.status === "Conducted"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {classItem.status}
                      </span>
                    </div>

                    <div className="text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          className={`w-5 h-5 transform transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t bg-gray-50">
                  {/* Coach Feedback */}
                  {classItem.coachClassFeedBack && (
                    <div className="p-4 border-b">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Coach Feedback
                      </h4>
                      <p className="text-sm text-gray-700">
                        {classItem.coachClassFeedBack}
                      </p>
                    </div>
                  )}

                  {/* Students Table */}
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Students ({total})
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 font-medium text-gray-700">
                              Name
                            </th>
                            <th className="text-left py-2 font-medium text-gray-700">
                              Type
                            </th>
                            <th className="text-left py-2 font-medium text-gray-700">
                              Status
                            </th>
                            <th className="text-left py-2 font-medium text-gray-700">
                              Feedback
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {classItem.students.map((student, index) => (
                            <tr
                              key={student._id || index}
                              className="border-b border-gray-100"
                            >
                              <td className="py-2">{student.name}</td>
                              <td className="py-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    student.classType === "regular"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-orange-100 text-orange-700"
                                  }`}
                                >
                                  {student.classType}
                                </span>
                              </td>
                              <td className="py-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs ${
                                    student.attendance === "Present"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {student.attendance}
                                </span>
                              </td>
                              <td className="py-2 text-gray-600">
                                {student.feedback}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 bg-white rounded-lg shadow-sm border p-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {filteredAndSortedClasses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <div className="text-gray-500">
            No classes found matching your criteria
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedClass;
