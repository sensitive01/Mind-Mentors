// import { useState } from "react";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Typography,
//   MenuItem,
//   Grid,
//   Slide,
// } from "@mui/material";

// const PaymentDialog = ({ open, onClose, data }) => {
//   const [paymentDetails, setPaymentDetails] = useState({
//     amount: "",
//     paymentLink: "",
//     previouslyPaidAmount: "",
//     currentExpirationDate: "",
//     nextExpirationDate: "",
//     numberOfClasses: "",
//     validityDays: "",
//     paymentMode: "",
//   });

//   const paymentModes = [
//     { value: "upi", label: "UPI" },
//     { value: "netBanking", label: "Net Banking" },
//     { value: "card", label: "Card" },
//     { value: "cash", label: "Cash" },
//   ];

//   const handleInputChange = (field, value) => {
//     setPaymentDetails((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = () => {
//     console.log("Payment Details:", paymentDetails);
//     setPaymentDetails({
//       amount: "",
//       paymentLink: "",
//       previouslyPaidAmount: "",
//       currentExpirationDate: "",
//       nextExpirationDate: "",
//       numberOfClasses: "",
//       validityDays: "",
//       paymentMode: "",
//     });
//     onClose();
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       TransitionComponent={Slide}
//       TransitionProps={{
//         direction: "left",
//         timeout: {
//           enter: 300,
//           exit: 200,
//         },
//       }}
//       PaperProps={{
//         sx: {
//           borderRadius: 2,
//           position: "fixed",
//           right: 0,
//           top: 0,
//           bottom: 0,
//           m: 0,
//           maxWidth: "600px",
//           width: "100%",
//           height: "100%",
//           boxShadow: "-4px 0 8px rgba(0, 0, 0, 0.1)",
//         },
//       }}
//       sx={{
//         "& .MuiDialog-container": {
//           justifyContent: "flex-end",
//         },
//       }}
//     >
//       <DialogTitle
//         sx={{
//           borderBottom: "1px solid",
//           background: "linear-gradient(#642b8f, #aa88be)",
//           color: "#ffffff",
//           fontWeight: 600,
//           px: 3,
//           py: 2,
//         }}
//       >
//         Send Payment Link
//       </DialogTitle>
//       <DialogContent sx={{ p: 3 }}>
//         <Grid container spacing={3}>
//           <Grid item xs={6}>
//             <Box sx={{ mb: 3 }}>
//               <Typography
//                 variant="subtitle2"
//                 sx={{ mb: 1, color: "text.secondary" }}
//               >
//                 Kid Name
//               </Typography>
//               <Typography variant="body1" sx={{ fontWeight: 500 }}>
//                 {data?.kidName || "N/A"}
//               </Typography>
//             </Box>
//           </Grid>
//           <Grid item xs={6}>
//             <Box sx={{ mb: 3 }}>
//               <Typography
//                 variant="subtitle2"
//                 sx={{ mb: 1, color: "text.secondary" }}
//               >
//                 WhatsApp Number
//               </Typography>
//               <Typography variant="body1" sx={{ fontWeight: 500 }}>
//                 {data?.whatsappNumber || "N/A"}
//               </Typography>
//             </Box>
//           </Grid>

//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Previously Paid Amount"
//               type="number"
//               value={paymentDetails.previouslyPaidAmount}
//               onChange={(e) =>
//                 handleInputChange("previouslyPaidAmount", e.target.value)
//               }
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Current Amount"
//               type="number"
//               value={paymentDetails.amount}
//               onChange={(e) => handleInputChange("amount", e.target.value)}
//             />
//           </Grid>

//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Current Expiration Date"
//               type="date"
//               value={paymentDetails.currentExpirationDate}
//               onChange={(e) =>
//                 handleInputChange("currentExpirationDate", e.target.value)
//               }
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Next Expiration Date"
//               type="date"
//               value={paymentDetails.nextExpirationDate}
//               onChange={(e) =>
//                 handleInputChange("nextExpirationDate", e.target.value)
//               }
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>

//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               select
//               label="Payment Mode"
//               value={paymentDetails.paymentMode}
//               onChange={(e) => handleInputChange("paymentMode", e.target.value)}
//             >
//               {paymentModes.map((option) => (
//                 <MenuItem key={option.value} value={option.value}>
//                   {option.label}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Number of Classes"
//               type="number"
//               value={paymentDetails.numberOfClasses}
//               onChange={(e) =>
//                 handleInputChange("numberOfClasses", e.target.value)
//               }
//             />
//           </Grid>

//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Validity Days"
//               type="number"
//               value={paymentDetails.validityDays}
//               onChange={(e) =>
//                 handleInputChange("validityDays", e.target.value)
//               }
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Payment Link"
//               value={paymentDetails.paymentLink}
//               onChange={(e) => handleInputChange("paymentLink", e.target.value)}
//             />
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions
//         sx={{
//           p: 3,
//           borderTop: "1px solid",
//           borderColor: "divider",
//           position: "sticky",
//           bottom: 0,
//           bgcolor: "background.paper",
//           zIndex: 1,
//         }}
//       >
//         <Button onClick={onClose} variant="outlined" sx={{ mr: 1 }}>
//           Cancel
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           color="primary"
//           disabled={!paymentDetails.amount || !paymentDetails.paymentLink}
//         >
//           Send Link
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default PaymentDialog;



import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  Users,
  Tag,
  BookOpen,
  CheckCircle,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getDemoClassandStudentData,
  getDemoClassById,
  getDemoSheduleClass,
  saveDemoClassDetails,
  // cancelDemoClass,
} from "../../../api/service/employee/EmployeeService";
import { toast, ToastContainer } from "react-toastify";

// Add this new function to your EmployeeService.js
export const rescheduleDemoClass = async (demoClassId, newClassId, studentIds, empId) => {
  const requestData = {
    newClassId,
    studentIds,
    empId,
    updatedAt: new Date().toISOString()
  };



  try {
    console.log("requested data",demoClassId,requestData)



    const response = await rescheduleDemoClass(demoClassId,requestData);
    console.log("API Response:", response);
    return response;
  } catch (error) {
    console.error("API Error:", {
      status: error.response?.status,
      message: error.response?.data || error.message,
      requestData
    });
    throw error;
  }
};

const AssignDemoClass = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const { enqId, isSheduled } = useParams();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [classData, setClassData] = useState([]);
  const [student, setStudent] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDemoClass, setCurrentDemoClass] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isSheduled === "true") {
          setIsEditing(true);
          // Get both the current demo class and available class schedules
          const [demoClassResponse, availableClassesResponse] = await Promise.all([
            getDemoClassById(enqId),
            getDemoSheduleClass()
          ]);a

          console.log("Demo Class Response:", demoClassResponse.data);
          console.log("Available Classes Response:", availableClassesResponse.data);

          // Set available classes for rescheduling
          setClassData(availableClassesResponse.data.scheduleData || []);

          // Set current class details
          const currentClass = demoClassResponse.data.classData[0];
          setCurrentDemoClass(currentClass);
          setSelectedClass(currentClass);

          // Set student data
          setStudent(demoClassResponse.data.kidsData);
          console.log("Student Data:", demoClassResponse.data.kidsData);

          // Set selected students from the current class
          if (currentClass?.selectedStudents) {
            const studentIds = currentClass.selectedStudents.map((student) => student.kidId);
            setSelectedStudents(studentIds);
            console.log("Selected Student IDs:", studentIds);
          }
        } else {
          const response = await getDemoClassandStudentData(enqId);
          console.log("New Demo Class Data:", response.data);
          setClassData(response?.data?.classData || []);
          setStudent(response?.data?.kidsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      }
    };
    fetchData();
  }, [enqId, isSheduled]);

  const handleStudentSelection = (student) => {
    console.log("Student Selection:", student);
    if (selectedStudents.includes(student.kidId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== student.kidId));
    } else {
      setSelectedStudents([...selectedStudents, student.kidId]);
    }
    console.log("Updated Selected Students:", selectedStudents);
  };

  const handleReschedule = async () => {
    if (!selectedClass || selectedStudents.length === 0) {
      toast.warning("Please select both a class and students");
      return;
    }

    // Log current and new class details
    console.log("Current Demo Class Details:", {
      currentClass: currentDemoClass,
      currentClassId: enqId,
      currentSchedule: {
        day: currentDemoClass?.day,
        time: currentDemoClass?.classTime,
        coach: currentDemoClass?.coachName,
        program: currentDemoClass?.program,
        level: currentDemoClass?.level
      }
    });

    console.log("New Class Details:", {
      newClassId: selectedClass._id,
      newSchedule: {
        day: selectedClass.day,
        time: selectedClass.classTime,
        coach: selectedClass.coachName,
        program: selectedClass.program,
        level: selectedClass.level
      }
    });

    console.log("Selected Students:", {
      studentIds: selectedStudents,
      studentDetails: student
    });

    // Check if the selected class is different from the current class
    if (selectedClass._id === currentDemoClass._id) {
      console.log("Error: Same class selected for rescheduling");
      toast.warning("Please select a different class schedule for rescheduling");
      return;
    }

    // Prepare the data for rescheduling
    const rescheduleData = {
      demoClassId: enqId,
      newClassId: selectedClass._id,
      studentIds: selectedStudents,
      empId: empId,
      updatedAt: new Date().toISOString(),
      oldSchedule: {
        day: currentDemoClass?.day,
        time: currentDemoClass?.classTime,
        coach: currentDemoClass?.coachName
      },
      newSchedule: {
        day: selectedClass.day,
        time: selectedClass.classTime,
        coach: selectedClass.coachName
      }
    };

    console.log("Reschedule Data Being Sent:", rescheduleData);

    try {
      const response = await rescheduleDemoClass(
        enqId,
        selectedClass._id,
        selectedStudents,
        empId
      );

      console.log("Reschedule API Response:", response);

      if (response.status === 200) {
        console.log("Reschedule Successful:", response.data);
        toast.success("Demo class rescheduled successfully");
        setTimeout(() => navigate("/operation/department/enrollment-data"), 1500);
      }
    } catch (error) {
      console.error("Reschedule Error Details:", {
        error: error.response?.data || error.message,
        requestData: rescheduleData
      });
      toast.error("Failed to reschedule demo class");
    }
  };

  const handleSaveAssignments = async () => {
    if (!selectedClass || selectedStudents.length === 0) {
      toast.warning("Please select both a class and students");
      return;
    }

    try {
      if (isEditing) {
        console.log("Initiating reschedule process...");
        await handleReschedule();
      } else {
        console.log("Saving new demo class assignment...");
        const response = await saveDemoClassDetails(
          selectedClass._id,
          selectedStudents,
          empId
        );

        console.log("Save Response:", response);

        if (response.status === 200) {
          toast.success("Demo class scheduled successfully");
          setTimeout(() => navigate("/operation/department/enrollment-data"), 1500);
        }
      }
    } catch (error) {
      console.error("Save/Reschedule Error:", error);
      toast.error(
        isEditing
          ? "Failed to reschedule demo class"
          : "Failed to save assignments"
      );
    }
  };

  const handleCancelDemoClass = async () => {
    if (window.confirm("Are you sure you want to cancel this demo class?")) {
      try {
        console.log("Cancelling demo class:", enqId);
        const response = await cancelDemoClass(enqId);
        console.log("Cancel Response:", response);
        
        if (response.status === 200) {
          toast.success("Demo class cancelled successfully");
          setTimeout(() => navigate("/operation/department/enrollment-data"), 1500);
        }
      } catch (error) {
        console.error("Cancel Error:", error);
        toast.error("Failed to cancel demo class");
      }
    }
  };

  const InfoCard = ({ icon: Icon, label, value, color = "text-primary" }) => (
    <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <Icon className={`${color} w-4 h-4`} />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            {isEditing ? "Reschedule Demo Class" : "Demo Class Assignment"}
          </h1>
          <p className="text-sm text-gray-600">
            {isEditing
              ? "Modify demo class schedule and details"
              : "Schedule demo classes for students"}
          </p>
        </div>

        {isEditing && currentDemoClass && (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <h2 className="text-sm font-medium text-blue-800 mb-2">
              Current Schedule
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <InfoCard
                icon={Calendar}
                label="Current Day"
                value={currentDemoClass.day}
              />
              <InfoCard
                icon={Clock}
                label="Current Time"
                value={currentDemoClass.classTime}
              />
              <InfoCard
                icon={User}
                label="Current Coach"
                value={currentDemoClass.coachName}
              />
              <InfoCard
                icon={BookOpen}
                label="Program"
                value={currentDemoClass.program}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {isEditing ? "New Class Schedule" : "Class Schedule"}
              </h2>

              <div className="relative mb-4">
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-3 border rounded-lg cursor-pointer flex justify-between items-center hover:border-blue-300 transition-all duration-200"
                >
                  {selectedClass ? (
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2 w-32">
                        <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {selectedClass.day}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 w-32">
                        <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {selectedClass.classTime}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">
                      Select class schedule...
                    </span>
                  )}
                  {isDropdownOpen ? (
                    <ChevronUp className="w-4 h-4 text-primary" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-primary" />
                  )}
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {classData.map((classItem) => (
                      <div
                        key={classItem._id}
                        onClick={() => {
                          setSelectedClass(classItem);
                          setIsDropdownOpen(false);
                          console.log("Selected New Class:", classItem);
                        }}
                        className={`p-3 cursor-pointer border-b last:border-b-0 transition-colors ${
                          selectedClass?._id === classItem._id
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2 w-32">
                              <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm font-medium truncate">
                                {classItem.day}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 w-32">
                              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm truncate">
                                {classItem.classTime}
                              </span>
                            </div>
                          </div>
                          {selectedClass?._id === classItem._id && (
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedClass && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <InfoCard
                    icon={User}
                    label="Coach"
                    value={selectedClass.coachName}
                  />
                  <InfoCard
                    icon={Users}
                    label="Students"
                    value={`${
                      selectedClass.selectedStudents?.length || 0
                    } Enrolled`}
                  />
                  <InfoCard
                    icon={BookOpen}
                    label="Program"
                    value={selectedClass.program}
                  />
                  <InfoCard
                    icon={Tag}
                    label="Level"
                    value={selectedClass.level}
                  />
                </div>
              )}

              {selectedClass?.selectedStudents?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Currently Enrolled Students
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedClass.selectedStudents.map((student) => (
                      <div
                        key={student.kidId}
                        className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md"
                      >
                        <GraduationCap className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-700">
                          {student.kidName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Select Student
              </h2>

              {student && (
                <div className="space-y-2 mb-4">
                  <div
                    onClick={() => handleStudentSelection(student)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedStudents.includes(student.kidId)
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <GraduationCap
                        className={`w-4 h-4 ${
                          selectedStudents.includes(student.kidId)
                            ? "text-primary"
                            : "text-gray-400"
                        }`}
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          {student.kidFirstName}
                        </span>
                        <div className="text-xs text-gray-500">
                          {student.programs
                            .map((p) => `${p.program} - ${p.level}`)
                            .join(", ")}
                        </div>
                      </div>
                    </div>
                    {selectedStudents.includes(student.kidId) && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-600">
                    {selectedStudents.length} student selected
                  </span>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={handleSaveAssignments}
                    disabled={!selectedClass || selectedStudents.length === 0}
                    className="w-full bg-primary text-white py-2 px-4 rounded-lg
                      text-sm font-medium
                      hover:bg-blue-700 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors duration-200"
                  >
                    {isEditing ? "Update Demo Class" : "Confirm Assignment"}
                  </button>

                  {isEditing && (
                    <button
                      onClick={handleCancelDemoClass}
                      className="w-full bg-red-500 text-white py-2 px-4 rounded-lg
                        text-sm font-medium
                        hover:bg-red-600
                        transition-colors duration-200"
                    >
                      Cancel Demo Class
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        style={{ marginTop: "60px" }}
      />
    </div>
  );
};

export default AssignDemoClass;