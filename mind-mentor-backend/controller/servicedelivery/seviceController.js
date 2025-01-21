// const ServiceDept = require('../../model/serviceDepartmentModel');
// const leaves = require('../../model/serviceLeavesModdel');
// const serviceattendance = require('../../model/serviceattendanceModel');

const CoachAvailability = require("../../model/availabilityModel");
const ClassSchedule = require("../../model/classSheduleModel");
const Employee = require("../../model/employeeModel");
const enquiryLogs = require("../../model/enquiryLogs");
const operationDeptModel = require("../../model/operationDeptModel");
const convertTo12HourFormat = require("../../utils/convertTo12HourFormat");
const axios = require("axios");

// const ZOOM_CLIENT_ID = "ChkFppFRmmzbQKT6jiQlA";

// const ZOOM_CLIENT_SECRET = "A8hGnAi3u6v5LkfRT1fWCVU2Z9qQEqi3";

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
          meetingLink: shedule.meetingLink||"https://us05web.zoom.us/j/84470917399?pwd=NFRFWwQNmTdgvQnfV0q3lhzZOzM1v7.1",
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

// async function getZoomAccessToken() {
//   try {
//     const response = await axios.post("https://zoom.us/oauth/token", null, {
//       headers: {
//         Authorization: `Basic ${Buffer.from(
//           `${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`
//         ).toString("base64")}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       params: {
//         grant_type: "client_credentials",
//       },
//     });

//     console.log("Zoom OAuth Token:", response.data.access_token);
//     return response.data.access_token; // Return the access token
//   } catch (error) {
//     console.error(
//       "Error fetching Zoom access token:",
//       error.response?.data || error.message
//     );
//     throw new Error("Failed to fetch Zoom access token");
//   }
// }


// async function generateZoomMeeting() {
//   try {
//     const accessToken = await getZoomAccessToken();
//     const response = await axios.post(
//       "https://api.zoom.us/v2/users/me/meetings",
//       {
//         topic: "Classroom Meeting",
//         type: 2, // Scheduled meeting
//         start_time: new Date().toISOString(), // Current time, can be customized
//         duration: 60, // Duration in minutes
//         timezone: "UTC", // Adjust timezone as needed
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("Zoom Meeting Link:", response.data.join_url);
//     return response.data.join_url; // Return the meeting link
//   } catch (error) {
//     console.error("Error creating Zoom meeting:", error);
//     throw new Error("Failed to create Zoom meeting");
//   }
// }

// const timeTableShedules = async (req, res) => {
//   try {
//     console.log("Processing timetable schedules:", req.body.shedules);

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

//     const schedules  = req.body.shedules;
//     console.log("schedules",schedules)
//     if (!Array.isArray(schedules) || schedules.length === 0) {
//       return res.status(400).json({ message: "No schedules provided" });
//     }

//     const savedSchedules = await Promise.all(
//       schedules.map(async (schedule) => {
//         const zoomMeetingLink = await generateZoomMeeting(); // Generate Zoom meeting link
//         console.log("zoomMeetingLink",zoomMeetingLink)

//         const newSchedule = new ClassSchedule({
//           scheduledBy: {
//             name: empData.firstName,
//             id: empData._id,
//             department: empData.department,
//           },
//           day: schedule.day,
//           classTime: `${convertTo12HourFormat(
//             schedule.fromTime
//           )} - ${convertTo12HourFormat(schedule.toTime)}`,
//           coachName: schedule.coachName,
//           coachId: schedule.coachId,
//           program: schedule.program,
//           level: schedule.level,
//           meetingLink: zoomMeetingLink, // Store the Zoom meeting link here
//           classType: schedule.isDemo ? "Demo" : "Class",
//         });

//         return await newSchedule.save(); // Save the schedule to the database
//       })
//     );

//     return res.status(201).json({
//       message: "Schedules saved successfully",
//       savedSchedules,
//     });
//   } catch (error) {
//     console.error("Error saving timetable schedules:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

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
};
