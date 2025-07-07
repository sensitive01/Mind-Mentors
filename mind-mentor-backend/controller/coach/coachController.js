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
const bbbClassModel = require("../../model/bbbClassModel/bbbClassModel")



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


const getMyScheduledClasses = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await ClassSchedule.find({ coachId: id, });

    console.log("classData",classData)

    const conductedClassData = await ConductedClass.find({status:"Conducted"})
    console.log("conductedClass",conductedClassData)


    if (!classData || classData.length === 0) {
      return res.status(404).json({ message: "No classes scheduled for this coach." });
    }
    // const zoomData = await zoomIntegration2()

    return res.status(200).json({
      message: "Classes retrieved successfully",
      classData,
      conductedClassData
    });
  } catch (err) {
    return res.status(500).json({ message: "Error in getting the coach scheduled classes", error: err.message });
  }
};

const getSuperAdminScheduledClasses = async (req, res) => {
  try {
    console.log("Haillll")
    const classData = await ClassSchedule.find();

    console.log("classData",classData)

    const conductedClassData = await ConductedClass.find({status:"Conducted"})
    console.log("conductedClass",conductedClassData)


    if (!classData || classData.length === 0) {
      return res.status(404).json({ message: "No classes scheduled for this coach." });
    }
    // const zoomData = await zoomIntegration2()

    return res.status(200).json({
      message: "Classes retrieved successfully",
      classData,
      conductedClassData
    });
  } catch (err) {
    return res.status(500).json({ message: "Error in getting the coach scheduled classes", error: err.message });
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

    // Check if the class is a "Demo" type and update the schedule accordingly
    const classType = await ClassSchedule.findOne({
      _id: classId,
      classType: "Demo",
    });

    if (classType) {
      await ClassSchedule.updateOne(
        { _id: classId },
        {
          $pull: {
            selectedStudents: {
              kidId: { $in: submissionData.map((student) => student.studentId) },
            },
          },
        }
      );
    }

    // Create a new ConductedClass document
    const newClass = new ConductedClass({
      classID: classId,
      coachId,
      students: submissionData.map((student) => ({
        studentID: student.studentId,
        name: student.studentName,
        attendance: student.present ? "Present" : "Absent",
        feedback: student.feedback || "",
      })),
      conductedDate: Date.now(),
      status: "Conducted",
    });

    await newClass.save();

    // Fetch kids data in bulk
    const kidIds = submissionData.map((student) => student.studentId);
    console.log("kidId",kidIds)
    const kidsData = await operationDeptModel.find(
      { kidId: { $in: kidIds } },
      { logs: 1, kidId: 1 } // Fetch only logs and kidId
    );
    console.log("kidsData operation",kidsData)


    // Format the current date and time
    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    // Update logs for each student
    const logUpdatePromises = submissionData.map(async (student) => {
      const kid = kidsData.find((k) => k.kidId === student.studentId);
      console.log("kids",kid)
      if (kid && kid.logs) {
        console.log("ok")
        await enquiryLogs.findByIdAndUpdate(
          kid.logs, // Assuming logs contain the log document ID
          {
            $push: {
              logs: {
                coachId,
                action: `Attendance marked as ${
                  student.present ? "Present" : "Absent"
                }. Feedback: "${student.feedback || "No feedback provided"}". Created on ${formattedDateTime}`,
                conductedClassId: classId,
                createdAt: new Date(),
              },
            },
          },
          { new: true }
        );
      }
    });

    // Wait for all log updates to complete
    await Promise.all(logUpdatePromises);

    // Send response
    res.status(201).json({
      message: "New class with attendance and feedback added successfully, logs updated.",
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


const coachGiveFeedbackToClass = async(req,res)=>{
  try{
    const {coachId}  =req.params 
    const {role, coachFeedback,bbTempClassId} =req.body

    const bbbData = await bbbClassModel.findOne({classId:bbTempClassId},{sheduledClassId:1})
    

  }catch(err){

  }
}






module.exports = {
  coachGiveFeedbackToClass,

  saveCoachAvailability,
  getMyScheduledClasses,
  addFeedBackAndAttendance,
  getClassData,
  getSuperAdminScheduledClasses
  






  
};