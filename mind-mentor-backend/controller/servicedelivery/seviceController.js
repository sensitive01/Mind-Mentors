// const ServiceDept = require('../../model/serviceDepartmentModel');
// const leaves = require('../../model/serviceLeavesModdel');
// const serviceattendance = require('../../model/serviceattendanceModel');

const CoachAvailability = require("../../model/availabilityModel");
const ClassSchedule = require("../../model/classSheduleModel");
const Employee = require("../../model/employeeModel");
const enquiryLogs = require("../../model/enquiryLogs");
const NotesSection = require("../../model/enquiryNoteSection");
const operationDeptModel = require("../../model/operationDeptModel");
const convertTo12HourFormat = require("../../utils/convertTo12HourFormat");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { generateZoomMeeting } = require("../../utils/generateZoomLink");
const classPaymentModel = require("../../model/classPaymentModel");
const SelectedClass = require("../../model/wholeClassAssignedModel")

// const ZOOM_CLIENT_ID = "ChkFppFRmmzbQKT6jiQlA";

// const ZOOM_CLIENT_SECRET = "A8hGnAi3u6v5LkfRT1fWCVU2Z9qQEqi3";

const getAllActiveEnquiries = async (req, res) => {
  try {
    const enquiries = await operationDeptModel.find({
      enquiryField: "prospects",
      status: "Active",
    });

    const customizedEnquiries = await Promise.all(
      enquiries.map(async (enquiry) => {
        const parentName = `${enquiry.parentFirstName || ""} ${
          enquiry.parentLastName || ""
        }`.trim();
        const kidName = `${enquiry.kidFirstName || ""} ${
          enquiry.kidLastName || ""
        }`.trim();

        let latestAction = null;
        if (enquiry.logs) {
          const lastLog = await enquiryLogs.findOne({ _id: enquiry.logs });
          if (lastLog?.logs?.length) {
            const sortedLogs = lastLog.logs.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            latestAction = sortedLogs[0]?.action || null;
          }
        }

        let lastNoteAction = null;
        const noteSection = await NotesSection.findOne(
          { enqId: enquiry._id },
          { notes: 1, createdOn: 1 }
        );
        if (noteSection?.notes?.length) {
          // Assuming notes are in chronological order
          lastNoteAction = noteSection.notes[noteSection.notes.length - 1];
        }

        const formatDate = (date) => {
          if (!date) return null;
          const d = new Date(date);
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          return `${day}-${month}-${year}`;
        };

        const createdAt = formatDate(enquiry.createdAt);
        const updatedAt = formatDate(enquiry.updatedAt);

        return {
          ...enquiry.toObject(),
          parentName,
          kidName,
          latestAction,
          lastNoteAction: lastNoteAction?.disposition || "None",
          createdOn: lastNoteAction?.createdOn || "createdOn",
          createdAt,
          updatedAt,
        };
      })
    );

    res.status(200).json(customizedEnquiries);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

// const timeTableShedules = async (req, res) => {
//   try {
//     console.log("Welcome to time table schedules", req.body);

//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({ message: "Employee ID is required" });
//     }

//     const empData = await Employee.findOne(
//       { _id: id },
//       { firstName: 1, department: 1 }
//     );

//     if (!empData) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     const { shedules } = req.body;
//     console.log("Shedules00", shedules);

//     if (!Array.isArray(shedules) || shedules.length === 0) {
//       return res.status(400).json({ message: "No shedules provided" });
//     }

//     const savedShedules = await Promise.all(
//       shedules.map(async (shedule) => {
//         const newSchedule = new ClassSchedule({
//           scheduledBy: {
//             name: empData.firstName,
//             id: empData._id,
//             department: empData.department,
//           },
//           day: shedule.day,
//           classTime: `${convertTo12HourFormat(
//             shedule.fromTime
//           )} - ${convertTo12HourFormat(shedule.toTime)}`,

//           coachName: shedule.coachName,
//           coachId: shedule.coachId,
//           program: shedule.program,
//           level: shedule.level,
//           meetingLink: shedule.meetingLink||"https://us05web.zoom.us/j/84470917399?pwd=NFRFWwQNmTdgvQnfV0q3lhzZOzM1v7.1",
//           classType: shedule.isDemo ? "Demo" : "Class",
//         });

//         return await newSchedule.save();
//       })
//     );

//     return res.status(201).json({
//       message: "Schedules saved successfully",
//       savedShedules,
//     });
//   } catch (err) {
//     console.error("Error in saving the timetable schedules:", err);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", error: err.message });
//   }
// };

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
      { kidFirstName: 1, kidId: 1, _id: 1 }
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
        const zoomLink = await generateZoomMeeting(); // Generate Zoom link
        console.log("zoomLink", zoomLink);

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
          meetingLink: zoomLink,
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
const moment = require('moment');  // Import moment.js for date formatting

const getActiveKidAndClassData = async (req, res) => {
  try {
    const { enqId } = req.params;
    const paymentClassData = await classPaymentModel.findOne(
      { enqId: enqId },
      { baseAmount: 0, gstAmount: 0, totalAmount: 0, raz_transaction_id: 0 }
    );

    if (!paymentClassData) {
      return res.status(404).json({
        success: false,
        message: 'No payment data found for the provided enquiry ID.',
      });
    }

    console.log("PaymentData", paymentClassData);

    const { classDetails } = paymentClassData;

    // Check if offlineClasses and onlineClasses are present
    let classData;
    if (classDetails.offlineClasses && classDetails.onlineClasses) {
      // If both offlineClasses and onlineClasses exist
      classData = {
        offlineClasses: classDetails.offlineClasses,
        onlineClasses: classDetails.onlineClasses,
      };
    } else {
      // If offlineClasses or onlineClasses are missing, fall back to numberOfClasses
      classData = {
        numberOfClasses: classDetails.numberOfClasses,
      };
    }

    // Include other class-related data
    classData = {
      ...classData,
      selectedCenter: classDetails.selectedCenter,
      selectedClass: classDetails.selectedClass,
      selectedPackage: classDetails.selectedPackage,
      classType: classDetails.classType,
      day: classDetails.day,
    };

    // Format dates using moment.js
    const formattedTimestamp = moment(paymentClassData.timestamp).format('YYYY-MM-DD HH:mm:ss');
    const formattedCreatedAt = moment(paymentClassData.createdAt).format('DD-MM-YY');
    const formattedUpdatedAt = moment(paymentClassData.updatedAt).format('YYYY-MM-DD HH:mm:ss');

    // Send the response with the necessary class details along with other info
    return res.status(200).json({
      success: true,
      message: 'Active class data fetched successfully',
      data: {
        kidName: paymentClassData.kidName,
        kitItem: paymentClassData.kitItem,
        selectionType: paymentClassData.selectionType,
        whatsappNumber: paymentClassData.whatsappNumber,
        parentId: paymentClassData.parentId,
        enqId: paymentClassData.enqId,
        classDetails: classData,
     
      },
    });
  } catch (err) {
    console.log("Error in getting the active enquiry", err);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching the data',
      error: err.message,
    });
  }
};


const assignWholeClass = async (req, res) => {
  try {
    console.log("Req.bbody",req.body)
    const { studentId, studentName, selectedClasses } = req.body;

    if (!studentId || !studentName || !Array.isArray(selectedClasses)) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const newClassSelection = new SelectedClass({ studentId, studentName, selectedClasses });
    await newClassSelection.save();

    res.status(201).json({ success: true, message: "Classes saved successfully" });
  } catch (error) {
    console.error("Error saving selected classes:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = {
  assignWholeClass,
  getActiveKidAndClassData,
  timeTableShedules,
  getClassShedules,
  getCoachData,
  saveCoachAvailableDays,
  getCoachAvailableDays,
  getClassAndStudentsData,
  saveClassData,
  updateCoachAvailabilityData,
  deleteCoachAvailability,
  getAllActiveEnquiries,
};
