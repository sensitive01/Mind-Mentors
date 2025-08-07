// const Coach = require('../../model/coachModel');
// const leaves = require('../../model/coachLeaves');
// const serviceattendance = require('../../model/coachAttendanceModel');

const CoachAvailability = require("../../model/availabilityModel");
const ClassSchedule = require("../../model/classSheduleModel");
const ConductedClass = require("../../model/conductedClassSchema");
const Employee = require("../../model/employeeModel");
const enquiryLogs = require("../../model/enquiryLogs");
const operationDeptModel = require("../../model/operationDeptModel");
const { zoomIntegration2 } = require("../../utils/zoomIntegration2");
const bbbClassModel = require("../../model/bbbClassModel/bbbClassModel");
const NotesSection = require("../../model/enquiryNoteSection");
const demoClass = require("../../model/demoClassModel");

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
        return res.status(400).json({
          message: "All fields are required for each availability entry.",
        });
      }
    }

    // Fetch the coach details
    const coachAvailability = await Employee.findOne(
      { _id: id },
      { firstName: 1 }
    );
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
    res
      .status(500)
      .json({ message: "An error occurred while saving availability.", error });
  }
};

const getMyScheduledClasses = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await ClassSchedule.find({ coachId: id });

    console.log("classData", classData);

    const conductedClassData = await ConductedClass.find({
      status: "Conducted",
    });
    console.log("conductedClass", conductedClassData);

    if (!classData || classData.length === 0) {
      return res
        .status(404)
        .json({ message: "No classes scheduled for this coach." });
    }
    // const zoomData = await zoomIntegration2()

    return res.status(200).json({
      message: "Classes retrieved successfully",
      classData,
      conductedClassData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error in getting the coach scheduled classes",
      error: err.message,
    });
  }
};

const getSuperAdminScheduledClasses = async (req, res) => {
  try {
    console.log("Haillll");
    const classData = await ClassSchedule.find();

    console.log("classData", classData);

    const conductedClassData = await ConductedClass.find({
      status: "Conducted",
    });
    console.log("conductedClass", conductedClassData);

    if (!classData || classData.length === 0) {
      return res
        .status(404)
        .json({ message: "No classes scheduled for this coach." });
    }
    // const zoomData = await zoomIntegration2()

    return res.status(200).json({
      message: "Classes retrieved successfully",
      classData,
      conductedClassData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error in getting the coach scheduled classes",
      error: err.message,
    });
  }
};

// const addFeedBackAndAttandance = async (req, res) => {
//   try {
//     const { submissionData } = req.body;
//     const { classId,coachId } = req.params;

//     const classType = await ClassSchedule.findOne({ _id: classId, classType: "Demo" });

//     if (classType) {
//       await ClassSchedule.updateOne(
//         { _id: classId },
//         { $pull: { selectedStudents: { kidId: { $in: submissionData.map(student => student.studentId) } } } }
//       );

//     }

//     const newClass = new ConductedClass({
//       classID: classId,
//       coachId,
//       students: submissionData.map((student) => ({
//         studentID: student.studentId,
//         name: student.studentName,
//         attendance: student.present ? "Present" : "Absent",
//         feedback: student.feedback || "",
//       })),
//       conductedDate: Date.now(),
//       status: "Conducted",
//     });

//     await newClass.save();

//     res.status(201).json({
//       message: "New class with attendance and feedback added successfully",
//       class: newClass,
//     });
//   } catch (err) {
//     console.log("Error in adding attendance and feedback", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const addFeedBackAndAttendance = async (req, res) => {
  try {
    const { submissionData } = req.body;
    const { classId, coachId } = req.params;
    console.log("Submission data:", submissionData);
    const empData = await Employee.findOne(
      { _id: coachId },
      { firstName: 1, department: 1 }
    );

    const classType = await ClassSchedule.findOne({
      _id: classId,
      isDemoAdded: true,
    });
    console.log("classType", classType);

    if (classType) {
      await ClassSchedule.updateOne(
        { _id: classId },
        {
          $pull: {
            demoAssignedKid: {
              kidId: {
                $in: submissionData?.students?.map(
                  (student) => student.studentId
                ),
              },
            },
          },
        }
      );
    }

    const demoStatusUpdatePromises = submissionData?.students?.map(
      async (student) => {
        await demoClass.findOneAndUpdate(
          { kidId: student.studentId, classId: classId },
          { $set: { status: "Conducted" } }
        );
      }
    );

    await Promise.all(demoStatusUpdatePromises);

    const newClass = new ConductedClass({
      classId: submissionData.classId,
      coachId: submissionData.coachId,
      students: submissionData?.students?.map((student) => ({
        studentId: student.studentId,
        name: student.studentName,
        attendance: student.present ? "Present" : "Absent",
        feedback: student.feedback || "",
        classType: student.studentType || "",
      })),
      conductedDate: Date.now(),
      status: "Conducted",
      coachClassFeedBack: submissionData?.overallClassFeedback || "",
    });

    await newClass.save();

    const kidIds = submissionData?.students?.map(
      (student) => student.studentId
    );
    console.log("kidId", kidIds);
    const kidsData = await operationDeptModel.find(
      { kidId: { $in: kidIds } },
      { logs: 1, kidId: 1 }
    );
    console.log("kidsData operation", kidsData);

    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    const logUpdatePromises = submissionData?.students?.map(async (student) => {
      const kid = kidsData.find((k) => k.kidId === student.studentId);
      if (
        student.studentType === "demo" &&
        student.levelUpdate && // Make sure it's provided
        student.studentId
      ) {
        const recNote = `Recommending level upgrade from ${classType.program} wit level ${classType.level} to  ${student.levelUpdate}`;

        const enqData = await operationDeptModel.findOneAndUpdate(
          { kidId: student.studentId },
          { $set: { recomentedLevel: student.levelUpdate, note: recNote,"scheduleDemo.status":"Conducted" } },
          { new: true, upsert: true }
        );
        await enquiryLogs.findByIdAndUpdate(
          kid.logs,
          {
            $push: {
              logs: {
                employeeId: coachId,
                comment: `Recommending level upgrade for the kid  ${student.levelUpdate}. Created on ${formattedDateTime}`,
                conductedClassId: classId,
                createdAt: new Date(),
                employeeName: empData.firstName,
                department: empData.department,
              },
            },
          },
          { new: true }
        );
        await NotesSection.findOneAndUpdate(
          { enqId: enqData._id },
          {
            $push: {
              notes: {
                employeeId: coachId,
                note: recNote,
                updatedBy: empData.firstName,
                department: empData.department,
                createdOn: formattedDateTime,
              },
            },
          },
          { new: true }
        );
        await enquiryLogs.findByIdAndUpdate(
          kid.logs,
          {
            $push: {
              logs: {
                coachId,
                comment: `Attendance marked as ${
                  student.present ? "Present" : "Absent"
                }. Feedback: "${
                  student.feedback || "No feedback provided"
                }". Created on ${formattedDateTime}`,
                conductedClassId: classId,
                createdAt: new Date(),
                employeeName: empData.firstName,
                department: empData.department,
              },
            },
          },
          { new: true }
        );
      }
    });

    await Promise.all(logUpdatePromises);

    res.status(201).json({
      message:
        "New class with attendance and feedback added successfully, logs updated.",
      class: newClass,
    });
  } catch (err) {
    console.log("Error in adding attendance and feedback", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getClassData = async (req, res) => {
  try {
    console.log("Welcome to get class data");
    const { classId } = req.params;

    const ClassScheduleData = await ClassSchedule.findOne({ _id: classId });
    console.log(ClassScheduleData);

    if (!ClassScheduleData) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({
      message: "Class data retrieved successfully",
      ClassScheduleData,
    });
  } catch (err) {
    console.log("Error in getting the class data", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getClassITaught = async (req, res) => {
  try {
    const { empId } = req.params;
    console.log("empId:", empId);

    const myTaughtClassData = await ConductedClass.find({ coachId: empId });

    console.log("myTaughtClassData:", myTaughtClassData);

    if (myTaughtClassData.length === 0) {
      return res
        .status(201)
        .json({ message: "No classes found for this coach" });
    }

    res.status(200).json({ taughtClasses: myTaughtClassData });
  } catch (err) {
    console.error("Error fetching taught classes:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyDashboardData = async (req, res) => {
  try {
    const { empId } = req.params;
    console.log("empId:", empId);

    // Get upcoming class schedules for the coach
    const upcomingClass = await ClassSchedule.find({ coachId: empId });

    // Get conducted classes by the coach
    const myTaughtClassData = await ConductedClass.find({ coachId: empId });

    // Count selected and demo kids from upcoming classes
    let totalSelectedKids = 0;
    let totalDemoKids = 0;

    upcomingClass.forEach((cls) => {
      totalSelectedKids += cls.selectedStudents?.length || 0;
      totalDemoKids += cls.demoAssignedKid?.length || 0;
    });

    res.status(200).json({
      success: true,
      upcomingClasses: upcomingClass.length,
      taughtClasses: myTaughtClassData.length,
      totalSelectedKids,
      totalDemoKids,
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error while retrieving dashboard data",
    });
  }
};

const coachGiveFeedbackToClass = async (req, res) => {
  try {
    const { coachId } = req.params;
    const { role, coachFeedback, bbTempClassId } = req.body;

    const bbbData = await bbbClassModel.findOne(
      { classId: bbTempClassId },
      { sheduledClassId: 1 }
    );
  } catch (err) {}
};

module.exports = {
  coachGiveFeedbackToClass,
  getClassITaught,
  getMyDashboardData,

  saveCoachAvailability,
  getMyScheduledClasses,
  addFeedBackAndAttendance,
  getClassData,
  getSuperAdminScheduledClasses,
};
