
import React, { useEffect, useState } from "react";
import { Calendar, Clock, Award } from "lucide-react";
import { useParams } from "react-router-dom";
import { dispaySelectedClass } from "../../../api/service/employee/serviceDeliveryService";

export default function DisplaySelectedClass() {
  const {enqId} = useParams()
  const [kidName,setKidName] = useState()
  const [data,setData] = useState([])
  useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await dispaySelectedClass(enqId);
            console.log("Response",response)
            if (response.status===200) {
              setKidName(response.data.kidName);
              // Assuming class data comes from the same API
              setData(response.data.data || []);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }, [enqId]);
  const ClassCard = ({ session }) => (
    <div className={`group relative bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 ${
      session.status === 'cancelled' ? 'bg-red-50' : ''
    } ${session.status === 'rescheduled' ? 'bg-yellow-50' : ''}`}>
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        session.type === "online" ? "bg-blue-500" : "bg-green-500"
      }`} />

      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-semibold text-gray-800">
                Session {session.sessionNumber}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                session.type === "online"
                  ? "bg-blue-100 text-primary"
                  : "bg-green-100 text-green-700"
              }`}>
                {session.type}
              </span>
              {session.status === "cancelled" && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                  Cancelled
                </span>
              )}
              {session.status === "rescheduled" && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                  Rescheduled
                </span>
              )}
            </div>
            <h3 className="text-base font-medium text-gray-700">
              {session.day}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{session.formattedDate}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{session.startTime}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Award className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{session.coach}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow mb-4 p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Class Schedule
          </h1>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-500">Student Name</span>
            <p className="font-semibold text-gray-800 mt-1">
              {kidName}
            </p>
          </div>
        </div>

        {/* Class Schedule Display */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Class Schedule
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Online Class</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Offline Class</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Cancelled Class</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-600">Rescheduled Class</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.map((session) => (
              <ClassCard key={session._id} session={session} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}





// import React, { useEffect, useState } from "react";
// import { Calendar, Clock, Award } from "lucide-react";
// import { dispaySelectedClass } from "../../../api/service/employee/serviceDeliveryService";
// import { useParams } from "react-router-dom";

// export default function ClassDisplay() {
//   const { enqId } = useParams();
//   const [kidData, setKidData] = useState(null);
//   const [classData, setClassData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await dispaySelectedClass(enqId);
//         console.log("Response",response)
//         if (response.success) {
//           setKidData(response.data);
//           // Assuming class data comes from the same API
//           setClassData(response.data || []);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [enqId]);

//   const ClassCard = ({ session }) => (
//     <div className="group relative bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
//       <div
//         className={`absolute top-0 left-0 right-0 h-1 ${
//           session.type === "online" ? "bg-blue-500" : "bg-green-500"
//         }`}
//       />

//       <div className="p-4">
//         <div className="flex justify-between items-start mb-3">
//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <span className="text-lg font-semibold text-gray-800">
//                 Session {session.sessionNumber}
//               </span>
//               <span
//                 className={`px-2 py-0.5 text-xs font-medium rounded-full ${
//                   session.type === "online"
//                     ? "bg-blue-100 text-primary"
//                     : "bg-green-100 text-green-700"
//                 }`}
//               >
//                 {session.type}
//               </span>
//             </div>
//             <h3 className="text-base font-medium text-gray-700">
//               {session.day}
//             </h3>
//           </div>
//         </div>

//         <div className="flex items-center gap-6">
//           <div className="flex items-center gap-2 text-gray-600">
//             <Calendar className="w-4 h-4 text-gray-400" />
//             <span className="text-sm">{session.date}</span>
//           </div>

//           <div className="flex items-center gap-2 text-gray-600">
//             <Clock className="w-4 h-4 text-gray-400" />
//             <span className="text-sm">{session.startTime}</span>
//           </div>

//           <div className="flex items-center gap-2 text-gray-600">
//             <Award className="w-4 h-4 text-gray-400" />
//             <span className="text-sm">{session.coach}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (!kidData) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="max-w-7xl mx-auto p-4">
//         {/* Header Section */}
//         <div className="bg-white rounded-lg shadow mb-4 p-4">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4">
//             Class Schedule
//           </h1>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//             <div className="p-3 bg-gray-50 rounded-lg">
//               <span className="text-sm text-gray-500">Student Name</span>
//               <p className="font-semibold text-gray-800 mt-1">
//                 {kidData.kidName}
//               </p>
//             </div>
//             <div className="p-3 bg-gray-50 rounded-lg">
//               <span className="text-sm text-gray-500">Program</span>
//               <p className="font-semibold text-gray-800 mt-1">
//                 {kidData.classDetails?.selectedPackage || "Not Specified"}
//               </p>
//             </div>
//             <div className="p-3 bg-gray-50 rounded-lg">
//               <div className="space-y-1">
//                 {kidData.classDetails?.onlineClasses && (
//                   <p className="font-semibold text-gray-800">
//                     Online Classes: {kidData.classDetails.onlineClasses}
//                   </p>
//                 )}
//                 {kidData.classDetails?.offlineClasses && (
//                   <p className="font-semibold text-gray-800">
//                     Offline Classes: {kidData.classDetails.offlineClasses}
//                   </p>
//                 )}
//                 {kidData.classDetails?.numberOfClasses && (
//                   <p className="font-semibold text-gray-800">
//                     Total Classes: {kidData.classDetails.numberOfClasses}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Class Schedule Display */}
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold text-gray-800">Class Schedule</h2>
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//                 <span className="text-sm text-gray-600">Online Class</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                 <span className="text-sm text-gray-600">Offline Class</span>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//             {classData.map((session) => (
//               <ClassCard key={session.id} session={session} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
