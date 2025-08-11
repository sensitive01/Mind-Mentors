import React, { useEffect, useState } from "react";
import {
  Eye,
  TrendingUp,
  User,
  Trophy,
  Target,
  Clock,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import {
  getChessPayingKidTable,
  getRFID,
} from "../../../api/service/employee/EmployeeService";
import { useNavigate } from "react-router-dom";



const ChessKidButton = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(null);
  const [loadingRFID, setLoadingRFID] = useState(false);
  const [error, setError] = useState(null);

  const [studentsData, setStudentsData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingTable, setLoadingTable] = useState(false);

  const studentsPerPage = 10;

  /** Fetch paginated students when currentPage changes */
  useEffect(() => {
    const fetchStudentsData = async () => {
      setLoadingTable(true);
      setError(null);

      try {
        const res = await getChessPayingKidTable(currentPage, studentsPerPage);

        if (res.status === 200) {
          setStudentsData(res.data.data);
          setTotalStudents(res.data.total);
          setTotalPages(Math.ceil(res.data.total / studentsPerPage));
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err.message);
      } finally {
        setLoadingTable(false);
      }
    };

    fetchStudentsData();
  }, [currentPage]);

  /** Fetch RFID statistics */
  const fetchCount = async () => {
    setLoadingRFID(true);
    setError(null);

    try {
      const res = await getRFID();
      if (res.status === 200) setCount(res.data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoadingRFID(false);
    }
  };

  /** Pagination numbers */
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) pageNumbers.push(i);
    return pageNumbers;
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "#10B981";
      case "intermediate":
        return "#F59E0B";
      case "advanced":
        return "#DC2626";
      default:
        return "#6B7280";
    }
  };

  const getPerformanceColor = (wins, losses) => {
    const winRate = (wins / (wins + losses)) * 100;
    if (winRate >= 70) return "#10B981";
    if (winRate >= 50) return "#F59E0B";
    return "#EF4444";
  };

  const handleViewProfile = (username) => {
    if (onNavigateToProfile) {
      onNavigateToProfile(username);
    } else {
      // Fallback navigation
      window.location.href = `/profile/${username}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chess Students Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor student performance and statistics
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Students Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalStudents}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* RFID Stats Button */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <button
              onClick={fetchCount}
              disabled={loadingRFID}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg py-3 px-4 font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loadingRFID ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <Trophy className="w-4 h-4" />
              )}
              {loadingRFID ? "Loading..." : "Get Chess Stats"}
            </button>
          </div>

          {/* Performance Overview Cards */}
          {count && (
            <>
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Blitz Performance
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {count.blitzWins}W / {count.blitzLosses}L
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Puzzle Success</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {count.puzzleCorrect} / {count.puzzleAttempted}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Detailed Chess Statistics */}
        {count && (
          <div className="bg-white rounded-xl shadow-sm border mb-8 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Overall Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Slow Chess</h4>
                <p className="text-2xl font-bold text-blue-700">
                  {count.slowWins}W / {count.slowLosses}L
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {(
                    (count.slowWins / (count.slowWins + count.slowLosses)) *
                    100
                  ).toFixed(1)}
                  % Win Rate
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Blitz Chess</h4>
                <p className="text-2xl font-bold text-green-700">
                  {count.blitzWins}W / {count.blitzLosses}L
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {(
                    (count.blitzWins / (count.blitzWins + count.blitzLosses)) *
                    100
                  ).toFixed(1)}
                  % Win Rate
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Puzzles</h4>
                <p className="text-2xl font-bold text-purple-700">
                  {count.puzzleCorrect} / {count.puzzleAttempted}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  {(
                    (count.puzzleCorrect / count.puzzleAttempted) *
                    100
                  ).toFixed(1)}
                  % Success Rate
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Chess Students ({totalStudents} total)
            </h2>
          </div>

          {loadingTable ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
              <span className="ml-3 text-gray-600">Loading students...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Slow Rating
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Blitz Rating
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Puzzle Rating
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        7-Day Performance
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentsData.map((student, index) => {
                      const serialNumber =
                        (currentPage - 1) * studentsPerPage + index + 1;
                      const blitzWins =
                        student.last7days?.blitzStats?.wins || 0;
                      const blitzLosses =
                        student.last7days?.blitzStats?.losses || 0;
                      const puzzleCorrect =
                        student.last7days?.puzzleStats?.correct || 0;
                      const puzzleAttempted =
                        student.last7days?.puzzleStats?.attempted || 0;

                      return (
                        <tr
                          key={student._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {serialNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                @{student.username}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className="inline-flex px-3 py-1 rounded-full text-xs font-medium text-white"
                              style={{
                                backgroundColor: getLevelColor(student.level),
                              }}
                            >
                              {student.level}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-gray-900">
                              {student.slowChessRating}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-gray-900">
                              {student.blitzRating}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-gray-900">
                              {student.puzzleRating}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="space-y-1">
                              <div className="flex items-center justify-center gap-1">
                                <span className="text-xs text-gray-600">
                                  Blitz:
                                </span>
                                <span
                                  className="text-xs font-medium px-2 py-1 rounded text-white"
                                  style={{
                                    backgroundColor: getPerformanceColor(
                                      blitzWins,
                                      blitzLosses
                                    ),
                                  }}
                                >
                                  {blitzWins}W/{blitzLosses}L
                                </span>
                              </div>
                              <div className="flex items-center justify-center gap-1">
                                <span className="text-xs text-gray-600">
                                  Puzzles:
                                </span>
                                <span className="text-xs font-medium text-gray-900">
                                  {puzzleCorrect}/{puzzleAttempted}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                 navigate(
                                   `/super-admin/department/chess-kid-performance/${student.username}`
                                 );
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors"
                              >
                                <TrendingUp className="w-3 h-3" />
                                Performance
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium mx-1">
                    {(currentPage - 1) * studentsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium mx-1">
                    {Math.min(currentPage * studentsPerPage, totalStudents)}
                  </span>{" "}
                  of <span className="font-medium mx-1">{totalStudents}</span>{" "}
                  students
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {getPageNumbers().map((num) => (
                      <button
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          num === currentPage
                            ? "bg-purple-600 text-white"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="p-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <span>Error: {error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessKidButton;
