// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const BbKidJoinClassHostinger = () => {
//   const { classId } = useParams();
//   const [kidName, setKidName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleJoinClass = async (e) => {
//     e.preventDefault();
//     if (!kidName.trim()) {
//       alert("Please enter your name.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       // First, get the class details using the classId
//       const response = await axios.get(
//         `https://live.mindmentorz.in/api/new-class/get-new-class/${classId}`
//       );

//       const { meetingID } = response.data;

//       if (!meetingID) {
//         throw new Error("Meeting ID not found");
//       }

//       // Construct the BBB join URL with proper parameters
//       // Note: This URL construction matches how it's done in the server-side code
//       const joinUrl = `https://bbb.mindmentorz.in/bigbluebutton/api/join?fullName=${encodeURIComponent(
//         kidName
//       )}&meetingID=${meetingID}&password=apwd&redirect=true`;

//       // Create a properly signed URL using a helper function
//       // Note: We need to redirect to a properly signed URL
//       const joinResponse = await axios.post(
//         `https://live.mindmentorz.in/api/new-class/new-sign-join-url`,
//         {
//           fullName: kidName,
//           meetingID: meetingID,
//           password: "apwd", // Using the attendee password
//         }
//       );

//       // Redirect to the signed URL
//       window.location.href = joinResponse.data.signedUrl;
//     } catch (error) {
//       console.error("Error joining class:", error);
//       setError(
//         "Failed to join class. Please check if the class exists and try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
//       <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-indigo-700">
//             Join Your Class
//           </h2>
//           <p className="text-gray-600 mt-2">Enter your name to get started</p>
//           {classId && (
//             <div className="mt-2 p-2 bg-blue-50 rounded-md">
//               <p className="text-sm text-blue-700">Class ID: {classId}</p>
//             </div>
//           )}
//         </div>
//         <form onSubmit={handleJoinClass} className="space-y-4">
//           <input
//             type="text"
//             value={kidName}
//             onChange={(e) => setKidName(e.target.value)}
//             placeholder="Your Name"
//             className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-200 font-medium"
//           >
//             {loading ? (
//               <div className="flex items-center justify-center">
//                 <svg
//                   className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Joining...
//               </div>
//             ) : (
//               "Join Class"
//             )}
//           </button>
//         </form>

//         {error && (
//           <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
//             <p className="text-red-600 text-sm">{error}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BbKidJoinClassHostinger;
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BbKidJoinClassHostinger = () => {
  const { classId } = useParams();
  const [kidName, setKidName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Apply no-scroll CSS rules on mobile only
  useEffect(() => {
    // Function to apply or remove styles based on screen width
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Mobile styles
        document.body.style.overflow = "hidden";
        document.body.style.height = "100%";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
      } else {
        // Desktop styles - normal scrolling
        document.body.style.overflow = "";
        document.body.style.height = "";
        document.body.style.position = "";
        document.body.style.width = "";
      }
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!kidName.trim()) {
      alert("Please enter your name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First, get the class details using the classId
      const response = await axios.get(
        `https://live.mindmentorz.in/api/new-class/get-new-class/${classId}`
      );

      const { meetingID } = response.data;

      if (!meetingID) {
        throw new Error("Meeting ID not found");
      }

      // Create a properly signed URL
      const joinResponse = await axios.post(
        `https://live.mindmentorz.in/api/new-class/new-sign-join-url`,
        {
          fullName: kidName,
          meetingID: meetingID,
          password: "apwd",
        }
      );

      // Redirect to the signed URL
      window.location.href = joinResponse.data.signedUrl;
    } catch (error) {
      console.error("Error joining class:", error);
      setError(
        "Failed to join class. Please check if the class exists and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 md:static md:min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="w-full mx-4 md:mx-0 max-w-xs md:max-w-md bg-white rounded-lg shadow-lg p-4 md:p-8">
        <div className="text-center mb-4 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-indigo-700">
            Join Your Class
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
            Enter your name to get started
          </p>
          {classId && (
            <div className="mt-2 p-2 bg-blue-50 rounded-md">
              <p className="text-xs md:text-sm text-blue-700 break-all md:break-words">
                Class ID: {classId}
              </p>
            </div>
          )}
        </div>
        <form onSubmit={handleJoinClass} className="space-y-3 md:space-y-4">
          <input
            type="text"
            value={kidName}
            onChange={(e) => setKidName(e.target.value)}
            placeholder="Your Name"
            className="w-full border border-gray-300 px-3 py-2 md:px-4 md:py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 md:py-3 rounded-md hover:bg-indigo-700 transition duration-200 font-medium text-sm md:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Joining...
              </div>
            ) : (
              "Join Class"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-3 md:mt-4 p-2 md:p-3 bg-red-50 border border-red-100 rounded-md">
            <p className="text-red-600 text-xs md:text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BbKidJoinClassHostinger;
