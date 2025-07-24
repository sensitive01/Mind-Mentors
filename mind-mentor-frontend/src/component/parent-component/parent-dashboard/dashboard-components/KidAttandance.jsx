import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  Target,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { getConductedClassDetails } from "../../../../api/service/parent/ParentService";

const KidAttendance = () => {
  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data based on your API response structure
  const { kidId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const respone = await getConductedClassDetails(kidId);
      console.log(respone);
      if (respone.status === 200) {
        setClassData(respone.data.filteredData);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getAttendanceIcon = (attendance) => {
    switch (attendance.toLowerCase()) {
      case "present":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "absent":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getAttendanceColor = (attendance) => {
    switch (attendance.toLowerCase()) {
      case "present":
        return "bg-green-50 text-green-700 border-green-200";
      case "absent":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {classData[0]?.studentDetails.name}'s Attendance & Progress
          </h1>
          <p className="text-gray-600">
            Track your child's class attendance and receive detailed feedback
            from coaches
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Classes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {classData.length}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Classes Attended
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    classData.filter(
                      (c) =>
                        c.studentDetails.attendance.toLowerCase() === "present"
                    ).length
                  }
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Attendance Rate
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    (classData.filter(
                      (c) =>
                        c.studentDetails.attendance.toLowerCase() === "present"
                    ).length /
                      classData.length) *
                      100
                  )}
                  %
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Class History */}
        <div className="space-y-6">
          {classData.map((classItem, index) => (
            <div
              key={classItem.classId}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Class Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">
                        {formatDate(classItem.conductedDate)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-600">
                        {classItem.classDetails.classTime}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getAttendanceColor(
                      classItem.studentDetails.attendance
                    )}`}
                  >
                    {getAttendanceIcon(classItem.studentDetails.attendance)}
                    <span className="font-semibold text-sm">
                      {classItem.studentDetails.attendance}
                    </span>
                  </div>
                </div>
              </div>

              {/* Class Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Class Info */}
                  <div className="lg:col-span-1">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Class Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Program:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {classItem.classDetails.program}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Level:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {classItem.classDetails.level}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Coach:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {classItem.classDetails.coachName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          Class Type:
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            classItem.studentDetails.classType === "demo"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {classItem.studentDetails.classType}
                        </span>
                      </div>
                    </div>
                  </div>

        
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {classData.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Classes Yet
            </h3>
            <p className="text-gray-500">
              Class attendance and feedback will appear here once classes begin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KidAttendance;
