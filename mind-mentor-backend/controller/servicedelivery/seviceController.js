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
const classPaymentModel = require("../../model/packagePaymentModel");
const SelectedClass = require("../../model/wholeClassAssignedModel");
const moment = require("moment"); // Import moment.js for date formatting
const PhysicalCenter = require("../../model/physicalcenter/physicalCenterShema");

// const ZOOM_CLIENT_ID = "ChkFppFRmmzbQKT6jiQlA";

// const ZOOM_CLIENT_SECRET = "A8hGnAi3u6v5LkfRT1fWCVU2Z9qQEqi3";

const getAllActiveEnquiries = async (req, res) => {
  try {
    const enquiries = await operationDeptModel.find({
      enquiryField: "prospects",
      enquiryStatus: "Active",
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
    const { department } = req.query;

    let query = {};
    if (department === "centeradmin") {
      query.type = "offline";
    } else if (department === "operation" || department === "service-delivary") {
      query.type = "online";
    } // else, no filter — return all

    const classData = await ClassSchedule.find(query); // `query` may be empty, which fetches all

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
    // Fetch all coaches
    const coachData = await Employee.find(
      { role: "coach" },
      { firstName: 1, centerId: 1, centerName: 1, modes: 1 }
    );

    // Fetch center data
    const centerData = await PhysicalCenter.find({}, { businessHours: 1, programLevels: 1,centerType:1 });

    // Fetch all availability records
    const availableDays = await CoachAvailability.find();

    if (availableDays.length === 0) {
      return res.status(404).json({ message: "No availability records found" });
    }

    // Create maps for quick lookups
    const coachMap = {};
    coachData.forEach(coach => {
      coachMap[coach._id.toString()] = coach;
    });

    const centerMap = {};
    centerData.forEach(center => {
      centerMap[center._id.toString()] = center;
    });

    // Merge coach and center details
    const mergedAvailableDays = availableDays.map(entry => {
      const coachInfo = coachMap[entry.coachId];
      let centerInfo = null;

      if (coachInfo && coachInfo.centerId) {
        centerInfo = centerMap[coachInfo.centerId.toString()] || null;
      }

      return {
        ...entry.toObject(),
        coachInfo: coachInfo || null,
        centerInfo: centerInfo ? {
          centerId: centerInfo._id,
          centerType:centerInfo.centerType,
          businessHours: centerInfo.businessHours,
          programLevels: centerInfo.programLevels
        } : null
      };
    });

    console.log("mergedAvailableDays",mergedAvailableDays)

    res.status(200).json({
      success: true,
      message: "Coach availability fetched successfully",
      availableDays: mergedAvailableDays,
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
        // Convert date from 'DD-MM-YYYY' to 'YYYY-MM-DD'
        const dateParts = shedule.date.split("-");
        if (dateParts.length !== 3) {
          throw new Error(`Invalid date format: ${shedule.date}`);
        }
        const [day, month, year] = dateParts;
        const formattedDate = new Date(`${year}-${month}-${day}`);

        const newSchedule = new ClassSchedule({
          scheduledBy: {
            name: empData.firstName,
            id: empData._id,
            department: empData.department,
          },
          day: shedule.day,
          classDate: formattedDate,
          classTime: `${convertTo12HourFormat(
            shedule.fromTime
          )} - ${convertTo12HourFormat(shedule.toTime)}`,
          coachName: shedule.coachName,
          coachId: shedule.coachId,
          program: shedule.program,
          level: shedule.level,
          isDemoAdded: shedule.isDemo ? true : false,
          type: shedule.mode,
          centerName: shedule.centerName,
          centerId: shedule.centerId,
          maximumKidCount: shedule.maxKids,
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




const getActiveKidAndClassData = async (req, res) => {
  try {
    const { enqId } = req.params;

    const paymentClassData = await classPaymentModel.findOne({
      enqId: enqId,
      paymentStatus: "Success",
    });

    if (!paymentClassData) {
      return res.status(404).json({
        success: false,
        message: "No payment data found for the provided enquiry ID.",
      });
    }

    const programData = paymentClassData.programs[0]; // assuming one program per payment
    let classData = {};

    // Assign offline/online class counts
    if (
      paymentClassData.offlineClasses !== undefined &&
      paymentClassData.onlineClasses !== undefined
    ) {
      classData.offlineClasses = paymentClassData.offlineClasses;
      classData.onlineClasses = paymentClassData.onlineClasses;
    } else if (paymentClassData.numberOfClasses !== undefined) {
      classData.numberOfClasses = paymentClassData.numberOfClasses;
    }

    // Include additional class details
    classData = {
      ...classData,
      selectedCenter: paymentClassData.centerId,
      selectedPackage: paymentClassData.selectedPackage,
      classMode: paymentClassData.classMode,
      centerType: programData?.centerType,
      level: programData?.level,
      program: programData?.program,
    };

    // Format dates
    const formattedTimestamp = moment(paymentClassData.timestamp).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const formattedCreatedAt = moment(paymentClassData.createdAt).format(
      "DD-MM-YY"
    );
    const formattedUpdatedAt = moment(paymentClassData.updatedAt).format(
      "YYYY-MM-DD HH:mm:ss"
    );

    return res.status(200).json({
      success: true,
      message: "Active class data fetched successfully",
      data: {
        kidName: paymentClassData.kidName,
        kitItem: paymentClassData.kitItem,
        selectionType: paymentClassData.selectionType,
        whatsappNumber: paymentClassData.whatsappNumber,
        parentId: paymentClassData.parentId,
        enqId: paymentClassData.enqId,
        paymentId: paymentClassData.paymentId,
        classDetails: classData,
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt,
        timestamp: formattedTimestamp,
      },
    });
  } catch (err) {
    console.log("Error in getting the active enquiry", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching the data",
      error: err.message,
    });
  }
};


const assignWholeClass = async (req, res) => {
  try {
    console.log("Req.body", req.body);

    const { submissionData } = req.body; // Extract submissionData

    if (!submissionData) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const {
      studentId,
      studentName,
      selectedClasses,
      generatedSchedule,
      cancelledSessions,
    } = submissionData;
    const enqData = await operationDeptModel.findOne(
      { _id: studentId, payment: "Success", status: "Active" },
      { kidId: 1 }
    );
    console.log("EnqId==>", enqData);

    if (!studentId || !studentName || !Array.isArray(selectedClasses)) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    console.log("Student ID:", studentId);
    console.log("Student Name:", studentName);
    console.log("Selected Classes:", selectedClasses);
    console.log("Generated Schedule:", generatedSchedule);
    console.log("Cancelled Sessions:", cancelledSessions);

    const newClassSelection = new SelectedClass({
      kidId: enqData.kidId,
      studentName,
      selectedClasses,
      generatedSchedule,
      cancelledSessions,
      enqId: studentId,
    });
    await newClassSelection.save();

    res
      .status(201)
      .json({ success: true, message: "Classes saved successfully" });
  } catch (error) {
    console.error("Error saving selected classes:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const displaySelectedClass = async (req, res) => {
  try {
    const { enqId } = req.params;

    const selectedClass = await SelectedClass.findOne(
      { enqId: enqId },
      { generatedSchedule: 1, _id: 0, studentName: 1 } // Only return the `generatedSchedule` field
    );

    if (!selectedClass) {
      return res
        .status(404)
        .json({ message: "No schedule found for the given ID" });
    }

    res
      .status(200)
      .json({
        message: "Selected class retrieved successfully",
        data: selectedClass.generatedSchedule,
        kidName: selectedClass.studentName,
      });
  } catch (err) {
    console.error("Error in displaying the selected class", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const getScheduledClassData = async (req, res) => {
  try {
    const { enqId } = req.params;

    // Fetch enrollment data
    const enqData = await operationDeptModel.findOne(
      { _id: enqId, paymentStatus: "Success", enquiryStatus: "Active" },
      { programs: 1 }
    );

    if (!enqData) {
      return res.status(404).json({ message: "Enrollment data not found" });
    }

    console.log("EnqId==>", enqData);

    // Fetch class schedule data
    const classData = await ClassSchedule.find(
      {},
      { day: 1, classTime: 1, coachName: 1, coachId: 1,type:1 }
    );

    console.log("classData", classData);

    // Send response to client
    res.status(200).json({
      enrollment: enqData,
       classData,
    });

  } catch (err) {
    console.error("Error in getting the schedule", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


module.exports = {
  displaySelectedClass,
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
  getScheduledClassData,
};
