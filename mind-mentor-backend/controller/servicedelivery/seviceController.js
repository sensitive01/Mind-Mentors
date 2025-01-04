// const ServiceDept = require('../../model/serviceDepartmentModel');
// const leaves = require('../../model/serviceLeavesModdel');
// const serviceattendance = require('../../model/serviceattendanceModel');

const CoachAvailability = require("../../model/availabilityModel");
const ClassSchedule = require("../../model/classSheduleModel");
const Employee = require("../../model/employeeModel");
const enquiryLogs = require("../../model/enquiryLogs");
const operationDeptModel = require("../../model/operationDeptModel");
const convertTo12HourFormat = require("../../utils/convertTo12HourFormat");

const timeTableShedules = async (req, res) => {
  try {
    console.log("Welcome to time table schedules", req.body);

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const empData = await Employee.findOne(
      { _id: id },
      { firstName: 1, department: 1 }
    );

    if (!empData) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const { shedules } = req.body;
    console.log("Shedules00", shedules);

    if (!Array.isArray(shedules) || shedules.length === 0) {
      return res.status(400).json({ message: "No shedules provided" });
    }

    const savedShedules = await Promise.all(
      shedules.map(async (shedule) => {
        const newSchedule = new ClassSchedule({
          scheduledBy: {
            name: empData.firstName,
            id: empData._id,
            department: empData.department,
          },
          day: shedule.day,
          classTime: `${convertTo12HourFormat(
            shedule.fromTime
          )} - ${convertTo12HourFormat(shedule.toTime)}`,

          coachName: shedule.coachName,
          coachId: shedule.coachId,
          program: shedule.program,
          level: shedule.level,
          meetingLink: shedule.meetingLink,
          classType: shedule.isDemo ? "Demo" : "Class",
        });

        return await newSchedule.save();
      })
    );

    return res.status(201).json({
      message: "Schedules saved successfully",
      savedShedules,
    });
  } catch (err) {
    console.error("Error in saving the timetable schedules:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getClassShedules = async (req, res) => {
  try {
    console.log("Welcome to class schedules");
    const classData = await ClassSchedule.find();
    console.log(classData);

    res.status(200).json({
      success: true,
      message: "Class schedules retrieved successfully",
      classData,
    });
  } catch (err) {
    console.error("Error in getting the class schedules", err);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve class schedules",
      error: err.message,
    });
  }
};
const getCoachData = async (req, res) => {
  try {
    console.log("Welcome to fetch coach data");

    const coachData = await Employee.find(
      { department: "coach" },
      { firstName: 1, _id: 1 }
    );

    console.log("Fetched Coach Data:", coachData);

    if (coachData.length === 0) {
      return res.status(404).json({ message: "No coaches found." });
    }

    res.status(200).json({
      message: "Coach data fetched successfully.",
      coachData,
    });
  } catch (err) {
    console.error("Error in fetching the coach data:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching coach data." });
  }
};

const saveCoachAvailableDays = async (req, res) => {
  try {
    console.log("Welcome to save availability", req.body);

    const { data } = req.body;

    for (let item of data) {
      const { coachName: coachId, day, program, fromTime, toTime } = item;

      const coach = await Employee.findById(coachId);

      if (!coach) {
        console.log(`Coach with ID ${coachId} not found`);
        continue;
      }

      const coachName = coach.firstName;

      const newAvailability = new CoachAvailability({
        coachId,
        coachName,

        program,
        day,
        fromTime,
        toTime,
      });

      await newAvailability.save();
    }

    res
      .status(200)
      .json({ message: "Coach availabilities saved successfully" });
  } catch (err) {
    console.error("Error in saving the availability", err);
    res
      .status(500)
      .json({ error: "An error occurred while saving availability" });
  }
};

const getCoachAvailableDays = async (req, res) => {
  try {
    // Fetch all availability records from the database
    const availableDays = await CoachAvailability.find();

    if (availableDays.length === 0) {
      return res.status(404).json({ message: "No availability records found" });
    }

    res.status(200).json({
      success: true,
      message: "Coach availability fetched successfully",
      availableDays,
    });
  } catch (err) {
    console.error("Error in getting the available days", err);

    res.status(500).json({
      success: false,
      message: "An error occurred while fetching availability",
      error: err.message,
    });
  }
};

const getClassAndStudentsData = async (req, res) => {
  try {
    console.log(
      "Welcome to getting the demo class and student data",
      req.params
    );
    const { classId } = req.params;

    const classData = await ClassSchedule.findOne({ _id: classId });
    console.log("Class Data", classData);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const selectedStudentIds = classData.selectedStudents.map(
      (student) => student.kidId
    );
    console.log("selectedStudentIds", selectedStudentIds);

    const kidsData = await operationDeptModel.find(
      {
        enquiryField: "prospects",
        payment: "Success",
        programs: {
          $elemMatch: {
            program: classData.program,
            level: classData.level,
          },
        },
      },
      { kidFirstName: 1, kidId: 1,_id:1 }
    );

    console.log("kidsData", kidsData);

    const unselectedKids = kidsData.filter(
      (kid) => !selectedStudentIds.includes(kid.kidId.toString())
    );

    console.log("Unselected Kids", unselectedKids);

    res.status(200).json({ classData, unselectedKids });
  } catch (err) {
    console.error("Error in getting the demo class and student data", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const saveClassData = async (req, res) => {
//   try {
//     console.log("Welcome to save the  class", req.body, req.params);

//     const formattedDateTime = new Intl.DateTimeFormat("en-US", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     }).format(new Date());

//     const { empId } = req.params;
//     const { classId, students } = req.body;

//     // Fetch employee data
//     const empData = await Employee.findOne(
//       { _id: empId },
//       { name: 1, department: 1 }
//     );

//     // Fetch kids data
//     const kidsData = await operationDeptModel.find(
//       { _id: { $in: students } },
//       { kidFirstName: 1, _id: 1, logs: 1, kidId: 1 }
//     );

//     console.log("Fetched kids data:", kidsData);
//     console.log("Fetched empData:", empData);

//     // Fetch the class schedule data
//     const classSchedule = await ClassSchedule.findById(classId);

//     if (!classSchedule) {
//       return res.status(404).json({ message: "Class schedule not found." });
//     }

//     // Prepare new selected students data
//     const updatedSelectedStudents = students.map((studentId) => {
//       console.log();
//       const kid = kidsData.find((kid) => kid._id.toString() === studentId);
//       return {
//         kidId: kid.kidId,
//         kidName: kid ? kid.kidFirstName : "Unknown",
//       };
//     });

//     console.log("updatedSelectedStudents", updatedSelectedStudents, kidsData);

//     // Update class schedule with the new selected students (using $push to add to existing array)
//     // await ClassSchedule.findByIdAndUpdate(
//     //   classId,
//     //   {
//     //     $push: {
//     //       selectedStudents: { $each: updatedSelectedStudents },
//     //     },
//     //     $set: {
//     //       "scheduledBy.id": empData._id,
//     //       "scheduledBy.department": empData.department,
//     //       "scheduledBy.name": empData.name || "",
//     //     },
//     //   },
//     //   { new: true }
//     // );

//     // Update the scheduleDemo field in the kidsData
//     // const updatedKidsDataPromises = kidsData.map(async (kid) => {
//     //   if (students.includes(kid._id.toString())) {
//     //     kid.scheduleDemo = {
//     //       status: "Scheduled",
//     //       scheduledDay: classSchedule.day,
//     //     };

//     //     await kid.save();
//     //   }
//     // });

//     // Wait for all updates to finish
//     // await Promise.all(updatedKidsDataPromises);

//     // const logUpdate = await enquiryLogs.findByIdAndUpdate(
//     //   { _id: kidsData.logs },
//     //   {
//     //     $push: {
//     //       logs: {
//     //         employeeId: empId,
//     //         employeeName: empData.firstName, // empData.firstName should exist here
//     //         action: ` ${empData.firstName} in ${empData.department} department sheduled class for kid. created on ${formattedDateTime}`,
//     //         createdAt: new Date(),
//     //       },
//     //     },
//     //   },
//     //   { new: true }
//     // );

//     // Respond with success
//     // res.status(200).json({
//     //   message: "Demo class data saved successfully.",
//     //   updatedClassSchedule: classSchedule,
//     //   updatedKidsData: kidsData,
//     // });
//   } catch (err) {
//     console.log("Error in saving the demo class", err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while saving the demo class." });
//   }
// };

const saveClassData = async (req, res) => {
  try {
    console.log("Welcome to save the class", req.body, req.params);

    const { empId } = req.params;
    const { classId, students } = req.body;

    // Fetch employee data
    const empData = await Employee.findOne(
      { _id: empId },
      { firstName: 1, department: 1 }
    );

    // Fetch kids data
    const kidsData = await operationDeptModel.find(
      { kidId: { $in: students } },
      { kidFirstName: 1, _id: 1, logs: 1, kidId: 1 }
    );

    console.log("Fetched kids data:", kidsData);
    console.log("Fetched empData:", empData);

    // Fetch the class schedule data
    const classSchedule = await ClassSchedule.findById(classId);

    if (!classSchedule) {
      return res.status(404).json({ message: "Class schedule not found." });
    }

    // Prepare new selected students data
    const updatedSelectedStudents = students.map((studentId) => {
      const kid = kidsData.find((kid) => kid.kidId === studentId);
      return {
        kidId: kid.kidId,
        kidName: kid ? kid.kidFirstName : "Unknown",
      };
    });

    console.log("updatedSelectedStudents", updatedSelectedStudents);

    // Update class schedule with the new selected students (using $push to add to existing array)
    await ClassSchedule.findByIdAndUpdate(
      classId,
      {
        $push: {
          selectedStudents: { $each: updatedSelectedStudents },
        },
        $set: {
          "scheduledBy.id": empData._id,
          "scheduledBy.department": empData.department,
          "scheduledBy.name": empData.firstName || "",
        },
      },
      { new: true }
    );

    // Format the date and time for the log
    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    // Prepare the log entry for the class schedule
    const classLogMessage = `${empData.firstName} in the ${empData.department} department scheduled a class for the ${classSchedule.program} program at the ${classSchedule.level} level with coach ${classSchedule.coachName}. Created on ${formattedDateTime}`;

    // Update logs for each kid based on their `logs` array (which contains log document IDs)
    const logUpdatePromises = kidsData.map(async (kid) => {
        await enquiryLogs.findByIdAndUpdate(
          kid.logs, // Log ID
          {
            $push: {
              logs: {
                action: classLogMessage,
                createdAt: new Date(),
                employeeId: empId,
                employeeName: empData.firstName,
              },
            },
          },
          { new: true }
        );
      
    });

    // Wait for all log updates to finish
    await Promise.all(logUpdatePromises);

    // Respond with success
    res.status(200).json({
      message: "Class schedule data saved successfully.",
      updatedClassSchedule: classSchedule,
    });
  } catch (err) {
    console.log("Error in saving the class", err);
    res
      .status(500)
      .json({ error: "An error occurred while saving the class schedule." });
  }
};

const updateCoachAvailabilityData = async (req, res) => {
  try {
    console.log("Welcome to update coach available data", req.body);

    const {
      id,
      coachId,
      coachName,
      program,
      day,
      fromTime,
      toTime,
      createdAt,
    } = req.body.data;

    const filter = { _id: id };

    // Define the update fields
    const update = {
      coachId,
      coachName,
      program,
      day,
      fromTime,
      toTime,
      createdAt,
    };

    const updatedAvailability = await CoachAvailability.findOneAndUpdate(
      filter,
      update,
      {
        new: true,
        upsert: true,
      }
    );

    if (updatedAvailability) {
      res.status(200).json({
        success: true,
        message: "Coach availability updated successfully",
        data: updatedAvailability,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Coach availability not found",
      });
    }
  } catch (err) {
    console.error("Error in updating the coach available data", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteCoachAvailability = async (req, res) => {
  try {
    console.log("Welcome to delete coach availability", req.params);

    const { id } = req.params; // Extract `id` from URL params

    const deletedAvailability = await CoachAvailability.findByIdAndDelete(id);

    if (deletedAvailability) {
      res.status(200).json({
        success: true,
        message: "Coach availability deleted successfully",
        data: deletedAvailability,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Coach availability not found",
      });
    }
  } catch (err) {
    console.error("Error in deleting the coach availability", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Email Verification
// const operationEmailVerification = async (req, res) => {
//   try {
//     console.log("Welcome to operation employee verification", req.body);

//     const operationEmail = "ServiceDept@gmail.com";
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

// // Password Verification
// const operationPasswordVerification = async (req, res) => {
//   try {
//     console.log("Welcome to verify operation dept password", req.body);

//     const orgPassword = "ServiceDept@123";
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

// // Create Enquiry Form
// const enquiryFormData = async (req, res) => {
//   try {
//     const formData = req.body;
//     const newEntry = await ServiceDept.create(formData);

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

// // Get All Enquiries
// const getAllEnquiries = async (req, res) => {
//   try {
//     const enquiries = await ServiceDept.find();
//     res.status(200).json(enquiries);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching data' });
//   }
// };

// // Update Enquiry
// const updateEnquiry = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedEntry = await ServiceDept.findByIdAndUpdate(id, req.body, { new: true });
//     if (!updatedEntry) {
//       return res.status(404).json({ message: "Enquiry not found" });
//     }
//     res.status(200).json(updatedEntry);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating data' });
//   }
// };

// // Delete Enquiry
// const deleteEnquiry = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedEntry = await ServiceDept.findByIdAndDelete(id);
//     if (!deletedEntry) {
//       return res.status(404).json({ message: "Enquiry not found" });
//     }
//     res.status(200).json({ message: "Enquiry deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting data' });
//   }
// };

// // Update Enquiry Status (Cold/Warm)
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
//     const updatedEntry = await ServiceDept.findByIdAndUpdate(
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

// // Add Notes to Enquiry
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
//     const updatedEntry = await ServiceDept.findByIdAndUpdate(
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

// // Update Prospect Status (Cold/Warm)
// const updateProspectStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { enquiryStatus } = req.body;
//     const updatedEntry = await ServiceDept.findByIdAndUpdate(id, { enquiryStatus }, { new: true });
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

// // Schedule Demo
// const scheduleDemo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { date, status } = req.body;
//     const updatedEntry = await ServiceDept.findByIdAndUpdate(id, { scheduleDemo: { date, status } }, { new: true });
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

// // Add Notes
// const addNotes = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { notes } = req.body;
//     const updatedEntry = await ServiceDept.findByIdAndUpdate(id, { notes }, { new: true });
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

// // Referral to a Friend
// const referToFriend = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { referredTo, referredEmail } = req.body;
//     const updatedEntry = await ServiceDept.findByIdAndUpdate(id, { referral: { referredTo, referredEmail } }, { new: true });
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
  timeTableShedules,
  getClassShedules,
  getCoachData,
  saveCoachAvailableDays,
  getCoachAvailableDays,
  getClassAndStudentsData,
  saveClassData,
  updateCoachAvailabilityData,
  deleteCoachAvailability,

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
