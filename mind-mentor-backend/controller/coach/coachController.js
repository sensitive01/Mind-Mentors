// const Coach = require('../../model/coachModel');
// const leaves = require('../../model/coachLeaves');
// const serviceattendance = require('../../model/coachAttendanceModel');

const CoachAvailability = require("../../model/availabilityModel");
const Employee = require("../../model/employeeModel");



// Post availabile days for the class

const saveCoachAvailability = async (req, res) => {
  try {
    console.log("Welcome to availability", req.body);
    const { id } = req.params;
    console.log(id);

    const { data } = req.body;

    if (!id || !data || !Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid input data." });
    }

    // Validate availability entries
    for (let availability of data) {
      const { program, levels, days, times } = availability;
      if (!program || !levels?.length || !days?.length || !times?.length) {
        return res.status(400).json({ message: "All fields are required for each availability entry." });
      }
    }

    // Fetch the coach details
    const coachAvailability = await Employee.findOne({ _id: id }, { firstName: 1 });
    console.log(coachAvailability);

    if (!coachAvailability) {
      return res.status(404).json({ message: "Coach not found." });
    }

    // Create the availability document
    const saveAvailability = await CoachAvailability.create({
      coachId: id,
      coachName: coachAvailability.firstName,
      availabilities: data,
    });

    // Return success response with saved data
    res.status(200).json({
      message: "Availability saved successfully!",
      data: saveAvailability,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while saving availability.", error });
  }
};













// Email Verification
// const operationEmailVerification = async (req, res) => {
//   try {
//     console.log("Welcome to operation employee verification", req.body);

//     const operationEmail = "Coach@gmail.com";
//     const { email } = req.body;

//     if (operationEmail === email) {
//       console.log("Email exists");
//       return res.status(200).json({
//         success: true,
//         message: "Email verification successful. Employee exists."
//       });
//     } else {
//       console.log("No details found");
//       return res.status(404).json({
//         success: false,
//         message: "No employee details found for the provided email."
//       });
//     }
//   } catch (err) {
//     console.error("Error in verifying the employee login", err);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error. Please try again later."
//     });
//   }
// };

// Password Verification
// const operationPasswordVerification = async (req, res) => {
//   try {
//     console.log("Welcome to verify operation dept password", req.body);

//     const orgPassword = "Coach@123";
//     const { password } = req.body;

//     if (password === orgPassword) {
//       return res.status(200).json({
//         success: true,
//         message: "Password verification successful."
//       });
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid password. Please try again."
//       });
//     }
//   } catch (err) {
//     console.error("Error in verify password", err);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error. Please try again later."
//     });
//   }
// };

// Create Enquiry Form
// const enquiryFormData = async (req, res) => {
//   try {
//     const formData = req.body;
//     const newEntry = await Coach.create(formData);

//     res.status(201).json({
//       success: true,
//       message: "Enquiry form submitted successfully",
//       data: newEntry
//     });
//   } catch (error) {
//     console.error("Error submitting enquiry form", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to submit enquiry form. Please try again later."
//     });
//   }
// };

// Get All Enquiries
// const getAllEnquiries = async (req, res) => {
//   try {
//     const enquiries = await Coach.find();
//     res.status(200).json(enquiries);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching data' });
//   }
// };

// Update Enquiry
// const updateEnquiry = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedEntry = await Coach.findByIdAndUpdate(id, req.body, { new: true });
//     if (!updatedEntry) {
//       return res.status(404).json({ message: "Enquiry not found" });
//     }
//     res.status(200).json(updatedEntry);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating data' });
//   }
// };

// Delete Enquiry
// const deleteEnquiry = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedEntry = await Coach.findByIdAndDelete(id);
//     if (!deletedEntry) {
//       return res.status(404).json({ message: "Enquiry not found" });
//     }
//     res.status(200).json({ message: "Enquiry deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting data' });
//   }
// };

// Update Enquiry Status (Cold/Warm)
// const updateEnquiryStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body; // The status should be passed in the body (either 'cold' or 'warm')

//     // Validate status
//     if (!['cold', 'warm'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status. It must be either 'cold' or 'warm'."
//       });
//     }

//     // Update the status of the enquiry, including both `status` and `enquiryStatus`
//     const updatedEntry = await Coach.findByIdAndUpdate(
//       id, 
//       { 
//         status, 
//         enquiryStatus: status  // Ensuring both fields are updated
//       },
//       { new: true }  // Return the updated document
//     );

//     if (!updatedEntry) {
//       return res.status(404).json({ message: "Enquiry not found" });
//     }

//     // Send success response with updated data
//     res.status(200).json({
//       success: true,
//       message: "Enquiry status updated successfully",
//       data: updatedEntry  // Returning the updated document
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating enquiry status', error: error.message });
//   }
// };

// Add Notes to Enquiry
// const addNotesToEnquiry = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { enquiryStageTag, addNoteTo, notes } = req.body; // Notes data from the body

//     // Validate if note data is provided
//     if (!enquiryStageTag || !addNoteTo || !notes) {
//       return res.status(400).json({
//         success: false,
//         message: "Enquiry Stage Tag, Add Note To, and Notes are required."
//       });
//     }

//     // Create the new note
//     const newNote = { enquiryStageTag, addNoteTo, notes };

//     // Find the enquiry by ID and push the new note into the notes array
//     const updatedEntry = await Coach.findByIdAndUpdate(
//       id,
//       { $push: { notes: newNote } },
//       { new: true }
//     );

//     if (!updatedEntry) {
//       return res.status(404).json({ message: "Enquiry not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Note added successfully",
//       data: updatedEntry
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding note to enquiry' });
//   }
// };

// Update Prospect Status (Cold/Warm)
// const updateProspectStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { enquiryStatus } = req.body;
//     const updatedEntry = await Coach.findByIdAndUpdate(id, { enquiryStatus }, { new: true });
//     if (!updatedEntry) {
//       return res.status(404).json({ message: "Enquiry not found" });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Prospect status updated successfully",
//       data: updatedEntry
//     });
//   } catch (error) {
//     console.error("Error updating prospect status", error);
//     res.status(500).json({ message: 'Error updating prospect status' });
//   }
// };

// Schedule Demo
// const scheduleDemo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { date, status } = req.body;
//     const updatedEntry = await Coach.findByIdAndUpdate(id, { scheduleDemo: { date, status } }, { new: true });
//     if (!updatedEntry) {
//       return res.status(404).json({ message: "Enquiry not found" });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Demo scheduled successfully",
//       data: updatedEntry
//     });
//   } catch (error) {
//     console.error("Error scheduling demo", error);
//     res.status(500).json({ message: 'Error scheduling demo' });
//   }
// };

// Add Notes
// const addNotes = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { notes } = req.body;
//     const updatedEntry = await Coach.findByIdAndUpdate(id, { notes }, { new: true });
//     if (!updatedEntry) {
//       return res.status(404).json({ message: "Enquiry not found" });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Notes added successfully",
//       data: updatedEntry
//     });
//   } catch (error) {
//     console.error("Error adding notes", error);
//     res.status(500).json({ message: 'Error adding notes' });
//   }
// };

// Referral to a Friend
// const referToFriend = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { referredTo, referredEmail } = req.body;
//     const updatedEntry = await Coach.findByIdAndUpdate(id, { referral: { referredTo, referredEmail } }, { new: true });
//     if (!updatedEntry) {
//       return res.status(404).json({ message: "Enquiry not found" });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Referral added successfully",
//       data: updatedEntry
//     });
//   } catch (error) {
//     console.error("Error adding referral", error);
//     res.status(500).json({ message: 'Error adding referral' });
//   }
// };
// const createLeave = async (req, res) => {
//   try {
//     const leaveData = req.body;
//     const newLeave = await leaves.create(leaveData);

//     res.status(201).json({
//       success: true,
//       message: "Leave created successfully",
//       data: newLeave,
//     });
//   } catch (error) {
//     console.error("Error creating leave", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create leave. Please try again later.",
//     });
//   }
// };
// const createserviceattendance = async (req, res) => {
//   try {
//     const { employeeName } = req.body; // Get employee name from the request body

//     // Get the current date
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Reset time to midnight for the serviceattendanceDate

//     // Set allowed time range (5:00 PM to 8:00 PM)
//     const startTime = new Date(today);
//     startTime.setHours(0, 0, 0, 0); // 5:00 PM

//     const endTime = new Date(today);
//     endTime.setHours(24, 0, 0, 0); // 8:00 PM

//     // Check if current time is within the allowed window
//     const currentTime = new Date();
//     if (currentTime < startTime || currentTime > endTime) {
//       return res.status(400).json({
//         success: false,
//         message: "serviceattendance can only be marked between 5:00 PM and 8:00 PM.",
//       });
//     }

//     // Check if serviceattendance for today is already recorded
//     const existingserviceattendance = await serviceattendance.findOne({
//       employeeName,
//       serviceattendanceDate: today, // Ensure serviceattendance is for today
//     });

//     if (existingserviceattendance) {
//       // If serviceattendance is already marked, return an error message
//       return res.status(400).json({
//         success: false,
//         message: "serviceattendance for today has already been recorded.",
//       });
//     }

//     // Create new serviceattendance entry
//     const serviceattendanceData = {
//       serviceattendanceDate: today,
//       time: currentTime, // Use current time for the serviceattendance
//       employeeName,
//       status: "Present", // Set status to Present
//     };

//     const newserviceattendance = await serviceattendance.create(serviceattendanceData);

//     res.status(201).json({
//       success: true,
//       message: "serviceattendance recorded successfully.",
//       data: newserviceattendance,
//     });
//   } catch (error) {
//     console.error("Error recording serviceattendance", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to record serviceattendance. Please try again later.",
//     });
//   }
// };
// const fetchserviceattendance = async (req, res) => {
//   try {
//     const { date } = req.query; // Get the date from query params, e.g., '?date=YYYY-MM-DD'

//     // Parse the date or use today's date
//     const targetDate = date ? new Date(date) : new Date();
//     targetDate.setHours(0, 0, 0, 0); // Reset time to midnight

//     // Fetch all employee names (assuming an Employee model or predefined list)
//     const employees = await Employee.find({}, { name: 1 }); // Fetch all employee names

//     // Fetch serviceattendance for the target date
//     const serviceattendanceRecords = await serviceattendance.find({
//       serviceattendanceDate: targetDate,
//     });

//     // Create a map of serviceattendance records for quick lookup
//     const serviceattendanceMap = serviceattendanceRecords.reduce((acc, record) => {
//       acc[record.employeeName] = record;
//       return acc;
//     }, {});

//     // Generate the serviceattendance response, marking absent if no record found
//     const serviceattendanceResponse = employees.map((employee) => {
//       if (serviceattendanceMap[employee.name]) {
//         return {
//           employeeName: employee.name,
//           status: serviceattendanceMap[employee.name].status,
//           time: serviceattendanceMap[employee.name].time,
//         };
//       } else {
//         return {
//           employeeName: employee.name,
//           status: "Absent",
//           time: null, // No time for absent employees
//         };
//       }
//     });

//     res.status(200).json({
//       success: true,
//       data: serviceattendanceResponse,
//     });
//   } catch (error) {
//     console.error("Error fetching serviceattendance", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch serviceattendance. Please try again later.",
//     });
//   }
// };

// const updateLeave = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedLeave = await leaves.findByIdAndUpdate(id, req.body, { new: true });
//     if (!updatedLeave) {
//       return res.status(404).json({ message: "Leave not found" });
//     }
//     res.status(200).json(updatedLeave);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating leave" });
//   }
// };
// const deleteLeave = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedLeave = await leaves.findByIdAndDelete(id);
//     if (!deletedLeave) {
//       return res.status(404).json({ message: "Leave not found" });
//     }
//     res.status(200).json({ message: "Leave deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting leave" });
//   }
// };
// const getAllLeaves = async (req, res) => {
//   try {
//     const leavess = await leaves.find();
//     res.status(200).json(leavess);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching leaves" });
//   }
// };

module.exports = {

  saveCoachAvailability






  // operationEmailVerification,
  // operationPasswordVerification,
  // enquiryFormData,
  // getAllEnquiries,
  // updateEnquiry,createserviceattendance,fetchserviceattendance,
  // deleteEnquiry,
  // updateProspectStatus,addNotesToEnquiry,
  // scheduleDemo,
  // addNotes, getAllLeaves, deleteLeave, updateLeave, createLeave,
  // referToFriend,updateEnquiryStatus
};