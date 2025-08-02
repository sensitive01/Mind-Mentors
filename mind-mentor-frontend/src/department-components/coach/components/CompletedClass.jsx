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

        if (response.status === 200) {
          setClasses(response.data.taughtClasses || []);
        } else if (Array.isArray(response)) {
          setClasses(response.data.taughtClasses || []);
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

  // Function to render appropriate no data message
  const renderNoDataMessage = () => {
    if (classes.length === 0) {
      // No classes at all
      return (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Classes Conducted Yet
            </h3>
            <p className="text-gray-500">
              You haven't conducted any classes yet. Once you start teaching,
              they will appear here.
            </p>
          </div>
        </div>
      );
    } else {
      // Classes exist but filtered results are empty
      return (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Classes Found
            </h3>
            <p className="text-gray-500 mb-4">
              No classes match your current search criteria or filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setCurrentPage(1);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error Loading Classes
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
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

      {/* Only show filters if there are classes */}
      {classes.length > 0 && (
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
      )}

      {/* Classes List or No Data Message */}
      {filteredAndSortedClasses.length === 0 ? (
        renderNoDataMessage()
      ) : (
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
      )}

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
    </div>
  );
};

export default CompletedClass;
