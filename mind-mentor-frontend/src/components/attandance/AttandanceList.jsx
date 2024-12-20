import { Calendar, Clock, GraduationCap, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getKidAttendace } from '../../api/service/parent/ParentService';

const AttendanceList = () => {
  const { id } = useParams();
  const [attendanceData, setAttendanceData] = useState({
    totalConductedClasses: 0,
    totalPresent: 0,
    conductedClassDetails: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const fetchStudentAttandace = async () => {
      try {
        setLoading(true);
        const response = await getKidAttendace(id);
        if (response) {
          setAttendanceData(response.data.responseData);
          if (response.data.responseData.conductedClassDetails[0]?.student?.name) {
            setStudentName(response.data.responseData.conductedClassDetails[0].student.name);
          }
        }
      } catch (err) {
        setError('Failed to fetch attendance data');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentAttandace();
  }, [id]);

  const totalMissed = attendanceData.totalConductedClasses - attendanceData.totalPresent;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto p-8">
        <div className="text-center text-gray-600">
          Loading attendance data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto p-8">
        <div className="text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!attendanceData.conductedClassDetails || attendanceData.conductedClassDetails.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto p-8">
        <div className="text-center">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Yet</h3>
          <p className="text-gray-600">No attendance records are available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-semibold">
              {studentName ? studentName.charAt(0) : 'S'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {studentName || 'Student'}
              </h2>
              <p className="text-sm text-gray-600">
                {attendanceData.conductedClassDetails[0]?.classData?.level || 'Level Not Set'}
              </p>
            </div>
          </div>
          <div className="text-sm text-purple-600 font-medium bg-white px-4 py-2 rounded-full shadow-sm">
            <Calendar className="w-4 h-4 inline-block mr-2" />
            Class Details
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-sm text-gray-600">Total Classes</div>
            <div className="text-2xl font-semibold text-gray-900">{attendanceData.totalConductedClasses || 0}</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-sm text-green-600">Attended</div>
            <div className="text-2xl font-semibold text-green-600">{attendanceData.totalPresent || 0}</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-sm text-red-600">Missed</div>
            <div className="text-2xl font-semibold text-red-600">{totalMissed || 0}</div>
          </div>
        </div>
      </div>

      <div className="p-6 max-h-80 overflow-y-auto">
        <div className="space-y-4">
          {attendanceData.conductedClassDetails.map((classDetail) => (
            <div 
              key={classDetail._id} 
              className={`p-4 rounded-lg border ${
                classDetail.student?.attendance === 'Present'
                  ? 'border-green-100 bg-green-50'
                  : 'border-red-100 bg-red-50'
              } transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className={`w-5 h-5 ${
                    classDetail.student?.attendance === 'Present' ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className="font-medium text-gray-900">
                    {classDetail.classData?.program || 'Class'}
                  </span>
                </div>
                {classDetail.student?.attendance === 'Present' ? (
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Present
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                    <XCircle className="w-4 h-4" />
                    Absent
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {classDetail.conductedDate ? 
                    new Date(classDetail.conductedDate).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    }) : 'Date not set'
                  }
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {classDetail.classData?.classTime || 'Time not set'}
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mt-2">
                Teacher: {classDetail.classData?.coachName || 'Not assigned'}
              </div>
              {classDetail.student?.feedback && (
                <div className="text-sm text-gray-600 mt-2">
                  Feedback: {classDetail.student.feedback}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="m-5 pt-6 border-t border-gray-100 text-center">
        <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200">
          View Full Attendance History
        </button>
      </div>
    </div>
  );
};

export default AttendanceList;