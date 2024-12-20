const OperationDept = require("../../../model/operationDeptModel");
const leaves = require("../../../model/leavesModel");
const attendance = require("../../../model/attendanceModel");
const Task = require("../../../model/taskModel");
const kidSchema = require("../../../model/kidModel");
const parentSchema = require("../../../model/parentModel");
const DemoClass = require("../../../model/demoClassModel");
const Parent = require("../../../model/parentModel");
const generateChessId = require("../../../utils/generateChessId");
const generateOTP = require("../../../utils/generateOtp");
const Employee = require("../../../model/employeeModel");
const enquiryLogs = require("../../../model/enquiryLogs");
const moment = require("moment");
const ClassSchedule = require("../../../model/classSheduleModel");
const ConductedClass = require("../../../model/conductedClassSchema");

// Email Verification

const registerEmployee = async (req, res) => {
  try {
    // Extract employee details from the request body
    const { name, email, password, department, role } = req.body;

    // Validate the input
    if (!name || !email || !password || !department) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Create a new employee
    const newEmployee = new Employee({
      name,
      email,
      password,
      department,
      role: role || "employee", // Default role is "employee"
    });

    // Save the employee to the database
    await newEmployee.save();

    // Return a success response
    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: {
        id: newEmployee._id,
        name: newEmployee.name,
        email: newEmployee.email,
        department: newEmployee.department,
        role: newEmployee.role,
        status: newEmployee.status,
      },
    });
  } catch (error) {
    console.error("Error registering employee:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while registering the employee",
    });
  }
};

const operationEmailVerification = async (req, res) => {
  try {
    console.log("Welcome to operation employee verification", req.body);

    const { email } = req.body;
    console.log(email);
    const data = await Employee.find();
    console.log(data);

    const operationEmail = await Employee.findOne({ email: email });
    console.log("operationEmail", operationEmail);

    if (operationEmail) {
      console.log("Email exists");
      return res.status(200).json({
        success: true,
        message: "Email verification successful. Employee exists.",
        operationEmail,
      });
    } else {
      console.log("No details found");
      return res.status(404).json({
        success: false,
        message: "No employee details found for the provided email.",
      });
    }
  } catch (err) {
    console.error("Error in verifying the employee login", err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Password Verification
const operationPasswordVerification = async (req, res) => {
  try {
    console.log("Welcome to verify operation dept password", req.body);

    const { password, email } = req.body;

    const operationEmail = await Employee.findOne({
      email: email,
      password: password,
    });

    console.log(operationEmail);

    if (operationEmail) {
      return res.status(200).json({
        success: true,
        message: "Password verification successful.",
        operationEmail,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid password. Please try again.",
      });
    }
  } catch (err) {
    console.error("Error in verify password", err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Create Enquiry Form
const enquiryFormData = async (req, res) => {
  try {
    console.log("Welcome to create new enquiry", req.body);

    const formData = req.body;
    const { empId } = req.body;

    const empData = await Employee.findOne(
      { _id: empId },
      { department: 1, firstName: 1 }
    );
    if (!empData) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const newEntry = await OperationDept.create(formData);

    const logEntry = {
      enqId: newEntry._id,
      logs: [
        {
          employeeId: empId,
          employeeName: empData.firstName,
          comment: "Enquiry form submission",
          action: `Enquiry form submitted by ${empData.firstName} in ${
            empData.department
          } on ${new Date().toLocaleString()}`,
          createdAt: new Date(),
        },
      ],
    };
    const logData = await enquiryLogs.create(logEntry);
    newEntry.logs = logData._id;
    await newEntry.save();

    res.status(201).json({
      success: true,
      message: "Enquiry form submitted successfully",
      data: newEntry,
    });
  } catch (error) {
    console.error("Error submitting enquiry form", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry form. Please try again later.",
    });
  }
};
const updateProspectData = async (req, res) => {
  try {
    console.log("..........................................");
    console.log("Prospects");
    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    const { id } = req.params;
    const { empId } = req.body;

    const empData = await Employee.findOne(
      { _id: empId },
      { firstName: 1, department: 1 }
    );
    if (!empData) {
      return res.status(404).json({ message: "Employee not found" });
    }
    console.log("Employee Data", empData);

    const enquiryData = await OperationDept.findOne({ _id: id });
    if (!enquiryData) {
      return res.status(404).json({ message: "Enquiry data not found" });
    }
    console.log("Enquiry Data", enquiryData);

    console.log("..........................................");

    // 1. Handle Parent Registration
    let parentData = await parentSchema.findOne({
      parentMobile: enquiryData.whatsappNumber,
    });

    // If Parent doesn't exist, create a new one
    if (!parentData) {
      parentData = new parentSchema({
        parentName: enquiryData.parentFirstName,
        parentEmail: enquiryData.email,
        parentMobile: enquiryData.whatsappNumber,
        kids: [],
        type: "new",
        status: "Active",
      });

      await parentData.save();
    }
    console.log("parent data after move to prospects", parentData);

    // 2. Handle Kid Registration
    const chessId = generateChessId();
    const kidPin = generateOTP();

    // Create new Kid
    const newKid = new kidSchema({
      enqId: id,
      kidsName: enquiryData.kidFirstName,
      age: enquiryData.kidsAge,
      gender: enquiryData.kidsGender,
      schoolName: enquiryData.schoolName,
      address: enquiryData.address,
      pincode: enquiryData.pincode,
      parentId: parentData._id,
      selectedProgram: enquiryData.programs||"", 
      chessId,
      kidPin,
    });

    await newKid.save();
    console.log("kids data after move to prospects", parentData);

    parentData.kids.push({ kidId: newKid._id });
    await parentData.save();

    enquiryData.kidId = newKid._id;
    await enquiryData.save();

    // 4. Update the Log in the Log Database
    if (enquiryData.logs) {
      console.log("insode the logs");
      const logUpdate = {
        employeeId: empId,
        employeeName: empData.firstName,
        action: `Enuiry data is moved to prospects by ${empData.firstName} in ${empData.department} department on ${formattedDateTime}`,

        updatedAt: new Date(),
      };

      const newLogs = await enquiryLogs.findByIdAndUpdate(
        { _id: enquiryData.logs },
        {
          $push: { logs: logUpdate },
        },
        { new: true }
      );

      console.log("new log updated", newLogs);
    }

    // 5. Create Log Entries for the Action
    const logs = [
      {
        employeeId: empId,
        employeeName: empData.firstName,

        action: `Enquiry moved to prospects by ${
          empData.name
        } on ${new Date().toLocaleString()}`,
        createdAt: new Date(),
      },
    ];

    if (parentData._id) {
      logs.push({
        employeeId: empId,
        employeeName: empData.firstName,
        comments: `Registered new parent with ID: ${parentData._id}`,
        action: "Parent Registration",
        createdAt: new Date(),
      });
    }

    if (newKid._id) {
      logs.push({
        employeeId: empId,
        employeeName: empData.firstName,
        comments: `Registered new kid with ID: ${newKid._id}`,
        action: "Kid Registration",
        createdAt: new Date(),
      });
    }

    // 6. Update the OperationDept Entry
    const updatedEntry = await OperationDept.findByIdAndUpdate(
      { _id: id },
      {
        $set: { enquiryField: "prospects" },
      },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Prospect data not found" });
    }

    console.log("updatedEntry", updatedEntry);

    // Return Success Response
    res.status(200).json({
      success: true,
      message: "Prospect data updated successfully and moved to prospects",
      data: updatedEntry,
      parentData: parentData,
      kidData: newKid,
    });
  } catch (error) {
    console.error("Error updating prospect data", error);
    res.status(500).json({
      success: false,
      message: "Failed to update prospect data. Please try again later.",
    });
  }
};

// Get All Enquiries
const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await OperationDept.find({ enquiryField: "enquiryList" });
    console.log(enquiries);
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
};

const getProspectsData = async (req, res) => {
  try {
    const enquiries = await OperationDept.find({ enquiryField: "prospects" });
    console.log(enquiries);
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
};

// Update Enquiry
const updateEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEntry = await OperationDept.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: "Error updating data" });
  }
};

// Delete Enquiry
const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEntry = await OperationDept.findByIdAndDelete(id);
    if (!deletedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting data" });
  }
};

// Update Enquiry Status (Cold/Warm)
const updateEnquiryStatus = async (req, res) => {
  try {
    console.log("Status update", req.body);

    const { id } = req.params;
    const { enquiryStatus, empId } = req.body;

    // Fetch employee data

    if (!["cold", "warm"].includes(enquiryStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. It must be either 'cold' or 'warm'.",
      });
    }

    const existingEntry = await OperationDept.findById(id);
    console.log("Existing Entry", existingEntry.logs);

    if (!existingEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    const previousStatus = existingEntry.enquiryType || "unknown";

    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    // Update the enquiry type
    const updatedEntry = await OperationDept.findByIdAndUpdate(
      { _id: id },
      { enquiryType: enquiryStatus },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    const empData = await Employee.findOne(
      { _id: empId },
      { department: 1, firstName: 1 }
    );
    if (!empData) {
      return res.status(404).json({ message: "Employee not found" });
    }

    console.log("empData==>", empData, empData.firstName);

    const logId = existingEntry.logs;

    // Push logs
    const logUpdate = await enquiryLogs.findByIdAndUpdate(
      { _id: logId },
      {
        $push: {
          logs: {
            employeeId: empId,
            employeeName: empData.firstName, // empData.firstName should exist here
            comment: `Status updated from '${previousStatus}' to '${enquiryStatus}'`,
            action: `Status updated by ${empData.firstName} in ${empData.department} department from '${previousStatus}' to '${enquiryStatus}' on ${formattedDateTime}`,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    console.log(
      `Status updated by _id:${empData._id}---> name:${empData.firstName}--->department:${empData.department} from '${previousStatus}' to '${enquiryStatus} on ${formattedDateTime}'`
    );

    if (!logUpdate) {
      return res.status(404).json({ message: "Log document not found" });
    }

    res.status(200).json({
      success: true,
      message: `Enquiry status updated successfully from '${previousStatus}' to '${enquiryStatus}' on ${formattedDateTime}`,
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error updating enquiry status", error);
    res.status(500).json({
      success: false,
      message: "Error updating enquiry status",
      error: error.message,
    });
  }
};

// Add Notes to Enquiry
const addNotesToEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { enquiryStageTag, addNoteTo, notes } = req.body;

    if (!enquiryStageTag || !addNoteTo || !notes) {
      return res.status(400).json({
        success: false,
        message: "Enquiry Stage Tag, Add Note To, and Notes are required.",
      });
    }

    const newNote = { enquiryStageTag, addNoteTo, notes };

    const updatedEntry = await OperationDept.findByIdAndUpdate(
      id,
      { $push: { notes: newNote } },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Note added successfully",
      data: updatedEntry,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding note to enquiry" });
  }
};

const updateProspectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { enquiryStatus } = req.body;
    const updatedEntry = await OperationDept.findByIdAndUpdate(
      id,
      { enquiryStatus },
      { new: true }
    );
    if (!updatedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json({
      success: true,
      message: "Prospect status updated successfully",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error updating prospect status", error);
    res.status(500).json({ message: "Error updating prospect status" });
  }
};

// Schedule Demo
const scheduleDemo = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, status } = req.body;
    const empData = await Employee.findOne(
      { id: id },
      { firstName: 1, department: 1, _id: 1 }
    );
    console.log("empData", empData);
    // const updatedEntry = await OperationDept.findByIdAndUpdate(
    //   id,
    //   { scheduleDemo: { date, status } },
    //   { new: true }
    // );
    // if (!updatedEntry) {
    //   return res.status(404).json({ message: "Enquiry not found" });
    // }
    // res.status(200).json({
    //   success: true,
    //   message: "Demo scheduled successfully",
    //   data: updatedEntry,
    // });
  } catch (error) {
    console.error("Error scheduling demo", error);
    res.status(500).json({ message: "Error scheduling demo" });
  }
};

// Add Notes
const addNotes = async (req, res) => {
  try {
    console.log("Add notes", req.body);
    const { id } = req.params; // Enquiry ID
    const { notes, empId } = req.body;
    const { enquiryStatus, disposition } = notes;

    // Fetch employee details
    const empData = await Employee.findOne(
      { _id: empId },
      { firstName: 1, department: 1 }
    );
    if (!empData) {
      return res.status(404).json({ message: "Employee not found" });
    }

    console.log("Employee Data", empData);

    // Ensure that notes is a string
    let notesToSave = notes;
    if (typeof notes === "object") {
      notesToSave = notes.notes || "";
    }

    // Validate enquiryStatus and disposition
    const validEnquiryStatus = [
      "Pending",
      "Qualified Lead",
      "Unqualified Lead",
    ];
    const validDisposition = ["RnR", "Call Back", "None"];

    if (enquiryStatus && !validEnquiryStatus.includes(enquiryStatus)) {
      return res.status(400).json({ message: "Invalid enquiryStatus value" });
    }

    if (disposition && !validDisposition.includes(disposition)) {
      return res.status(400).json({ message: "Invalid disposition value" });
    }

    // Fetch the current entry to compare changes
    const currentEntry = await OperationDept.findById(id);
    if (!currentEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    // Prepare logs for changes
    const logs = [];
    const actionDescription = []; // For a summary of changes

    if (notesToSave !== currentEntry.notes) {
      logs.push({
        employeeId: empId,
        employeeName: empData.firstName,
        comment: `Updated notes from "${currentEntry.notes}" to "${notesToSave}"`,
        action: ` ${empData.firstName} in ${empData.department} department updated notes from "${currentEntry.notes}" to "${notesToSave}"`,
        createdAt: new Date(),
      });
      actionDescription.push("Notes Updated");
    }

    if (enquiryStatus && enquiryStatus !== currentEntry.enquiryStatus) {
      logs.push({
        employeeId: empId,
        employeeName: empData.firstName,
        comment: `Changed enquiryStatus from "${currentEntry.enquiryStatus}" to "${enquiryStatus}"`,
        action: ` ${empData.firstName} in ${empData.department} department updated enquiry status from "${currentEntry.enquiryStatus}" to "${enquiryStatus}" `,
        createdAt: new Date(),
      });
      actionDescription.push("Enquiry Status Updated");
    }

    if (disposition && disposition !== currentEntry.disposition) {
      logs.push({
        employeeId: empId,
        employeeName: empData.firstName,
        comment: `Changed disposition from "${currentEntry.disposition}" to "${disposition}"`,
        action: `${empData.firstName} in ${empData.department} department Updated disposition from "${currentEntry.disposition}" to "${disposition}" `,
        createdAt: new Date(),
      });
      actionDescription.push("Disposition Updated");
    }

    // Update the OperationDept entry
    const updatedEntry = await OperationDept.findByIdAndUpdate(
      id,
      {
        notes: notesToSave,
        enquiryStatus: enquiryStatus || currentEntry.enquiryStatus,
        disposition: disposition || currentEntry.disposition,
      },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    // Update logs in the Log model
    const logId = currentEntry.logs; // Assuming logs field contains the Log document ID
    const logUpdate = await enquiryLogs.findByIdAndUpdate(
      logId,
      { $push: { logs: { $each: logs } } }, // Append the prepared logs
      { new: true }
    );

    if (!logUpdate) {
      return res.status(404).json({ message: "Log document not found" });
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: `Enquiry updated successfully. Actions performed: ${actionDescription.join(
        ", "
      )}`,
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error adding notes:", error);
    res
      .status(500)
      .json({ message: "Error adding notes", error: error.message });
  }
};

// Referral to a Friend
const referToFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const { referredTo, referredEmail } = req.body;
    const updatedEntry = await OperationDept.findByIdAndUpdate(
      id,
      { referral: { referredTo, referredEmail } },
      { new: true }
    );
    if (!updatedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json({
      success: true,
      message: "Referral added successfully",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error adding referral", error);
    res.status(500).json({ message: "Error adding referral" });
  }
};
const createLeave = async (req, res) => {
  try {
    const leaveData = req.body;
    const newLeave = await leaves.create(leaveData);

    // Format dates to dd/mm/yy
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = String(d.getFullYear()).slice(-2); // Get last 2 digits of the year
      return `${day}/${month}/${year}`;
    };

    // Modify the newLeave data for response
    const formattedLeave = {
      ...newLeave._doc, // Spread the original leave document
      leaveStartDate: formatDate(newLeave.leaveStartDate),
      leaveEndDate: formatDate(newLeave.leaveEndDate),
    };

    res.status(201).json({
      success: true,
      message: "Leave created successfully",
      data: formattedLeave,
    });
  } catch (error) {
    console.error("Error creating leave", error);
    res.status(500).json({
      success: false,
      message: "Failed to create leave. Please try again later.",
    });
  }
};

const createAttendance = async (req, res) => {
  try {
    const { employeeName, email } = req.body; // Get employee name from the request body

    // Get the current date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for the attendanceDate

    // Set allowed time range (5:00 PM to 8:00 PM)
    const startTime = new Date(today);
    startTime.setHours(0, 0, 0, 0); // 5:00 PM

    const endTime = new Date(today);
    endTime.setHours(24, 0, 0, 0); // 8:00 PM

    // Check if current time is within the allowed window
    const currentTime = new Date();
    if (currentTime < startTime || currentTime > endTime) {
      return res.status(400).json({
        success: false,
        message: "Attendance can only be marked between 5:00 PM and 8:00 PM.",
      });
    }

    // Check if attendance for today is already recorded
    const existingAttendance = await attendance.findOne({
      attendanceDate: today,
      employeeEmail: email,
    });
    console.log(existingAttendance, email);
    if (existingAttendance) {
      // If attendance is already marked, return an error message
      return res.status(400).json({
        success: false,
        message: "Attendance for today has already been recorded.",
      });
    }

    // Create new attendance entry
    const attendanceData = {
      attendanceDate: today,
      time: currentTime, // Use current time for the attendance
      employeeName,
      status: "Present",
      employeeEmail: email,
    };

    const newAttendance = await attendance.create(attendanceData);
    console.log(newAttendance, email);
    res.status(201).json({
      success: true,
      message: "Attendance recorded successfully.",
      data: newAttendance,
    });
  } catch (error) {
    console.error("Error recording attendance", error);
    res.status(500).json({
      success: false,
      message: "Failed to record attendance. Please try again later.",
    });
  }
};
const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLeave = await leaves.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    res.status(200).json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: "Error updating leave" });
  }
};
const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLeave = await leaves.findByIdAndDelete(id);
    if (!deletedLeave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    res.status(200).json({ message: "Leave deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting leave" });
  }
};
const getAllLeaves = async (req, res) => {
  try {
    const { email } = req.query;
    console.log(email);

    // Fetch leaves for the given email
    const leavess = await leaves.find({ empEmail: email });

    // Format the dates to dd/mm/yy
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = String(d.getFullYear()).slice(-2); // Get last 2 digits of the year
      return `${day}/${month}/${year}`;
    };

    // Format the response
    const formattedLeaves = leavess.map((leave) => ({
      ...leave._doc, // Spread the original leave document
      leaveStartDate: formatDate(leave.leaveStartDate),
      leaveEndDate: formatDate(leave.leaveEndDate),
    }));

    res.status(200).json(formattedLeaves);
  } catch (error) {
    console.error("Error fetching leaves", error);
    res.status(500).json({ message: "Error fetching leaves" });
  }
};

const createTask = async (req, res) => {
  try {
    console.log(req.body);
    const { task, taskDate, taskTime, assignedTo, assignedBy } = req.body;

    const taskDateTime = new Date(`${taskDate}T${taskTime}:00`);

    const newTask = await Task.create({
      taskTime: taskDateTime,
      task,
      assignedBy,
      assignedTo,
    });

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task", error);
    res.status(400).json({ message: "Failed to create task", error });
  }
};

// Get All Tasks
const getAllTasks = async (req, res) => {
  try {
    // Fetch all tasks
    const tasks = await Task.find();

    // Format date and time to dd/mm/yy HH:mm
    const formattedTasks = tasks.map((task) => {
      const formatDateTime = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = String(d.getFullYear()).slice(-2); // Get last 2 digits of the year
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      };

      return {
        ...task._doc, // Spread the original task document
        taskTime: formatDateTime(task.taskTime),
        createdAt: formatDateTime(task.createdAt),
        updatedAt: formatDateTime(task.updatedAt),
      };
    });

    // Send response
    res.status(200).json(formattedTasks);
  } catch (error) {
    console.error("Error fetching tasks", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks. Please try again later.",
    });
  }
};

const getMyTasks = async (req, res) => {
  try {
    // Fetch all tasks
    const tasks = await Task.find({ assignedTo: req.params.id });
    console.log(tasks);

    // Format date and time to dd/mm/yy HH:mm
    const formattedTasks = tasks.map((task) => {
      const formatDateTime = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = String(d.getFullYear()).slice(-2); // Get last 2 digits of the year
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      };

      return {
        ...task._doc, // Spread the original task document
        taskTime: formatDateTime(task.taskTime),
        createdAt: formatDateTime(task.createdAt),
        updatedAt: formatDateTime(task.updatedAt),
      };
    });

    // Send response
    res.status(200).json(formattedTasks);
  } catch (error) {
    console.error("Error fetching tasks", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks. Please try again later.",
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task. Please try again later.",
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task. Please try again later.",
    });
  }
};

const fetchAttendance = async (req, res) => {
  try {
    const { date } = req.query; // Get the date from query params, e.g., '?date=YYYY-MM-DD'

    // Parse the date or use today's date
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0); // Reset time to midnight

    // Fetch all employee names (assuming an Employee model or predefined list)
    const employees = await Employee.find({}, { name: 1 }); // Fetch all employee names

    // Fetch attendance for the target date
    const attendanceRecords = await attendance.find({
      attendanceDate: targetDate,
    });

    // Create a map of attendance records for quick lookup
    const attendanceMap = attendanceRecords.reduce((acc, record) => {
      acc[record.employeeName] = record;
      return acc;
    }, {});

    // Generate the attendance response, marking absent if no record found
    const attendanceResponse = employees.map((employee) => {
      if (attendanceMap[employee.name]) {
        return {
          employeeName: employee.firstName,
          status: attendanceMap[employee.name].status,
          time: attendanceMap[employee.name].time,
        };
      } else {
        return {
          employeeName: employee.firstName,
          status: "Absent",
          time: null, // No time for absent employees
        };
      }
    });

    res.status(200).json({
      success: true,
      data: attendanceResponse,
    });
  } catch (error) {
    console.error("Error fetching attendance", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance. Please try again later.",
    });
  }
};

const getAllKidData = async (req, res) => {
  try {
    // Fetch all kids data (excluding `kidPin`)
    const kidsData = await kidSchema.find({}, { kidPin: 0 });

    const kidsWithParentData = await Promise.all(
      kidsData.map(async (kid) => {
        const parentData = await parentSchema.findOne(
          { _id: kid.parentId },
          { parentName: 1, parentEmail: 1, parentMobile: 1 }
        );
        return {
          ...kid.toObject(),
          parentData,
        };
      })
    );

    console.log(kidsWithParentData);

    // Return the result
    res.status(200).json(kidsWithParentData);
  } catch (err) {
    console.error("Error in getting kids data", err);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const getAllParentData = async (req, res) => {
  try {
    // Fetch all parent data (excluding `parentPin`)
    const parentData = await parentSchema.find({}, { parentPin: 0 });

    // Fetch kids data for each parent
    const parentsWithKidsData = await Promise.all(
      parentData.map(async (parent) => {
        // Fetch kids data based on `parentId`
        const kidsData = await kidSchema.find(
          { parentId: parent._id },
          { kidPin: 0 } // Exclude `kidPin`
        );
        return {
          ...parent.toObject(), // Convert Mongoose document to plain object
          kidsData,
        };
      })
    );

    console.log(parentsWithKidsData);

    // Return the result
    res.status(200).json(parentsWithKidsData);
  } catch (err) {
    console.error("Error in getting the parent data", err);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const getProspectsStudentsData = async (req, res) => {
  try {
    const prospectData = await OperationDept.find(
      { enquiryField: "prospects", "scheduleDemo.status": "Pending" },
      {
        parentFirstName: 1,
        kidFirstName: 1,
        programs: 1,
        whatsappNumber: 1,
        email: 1,
        logs: 1,
      }
    );

    if (!prospectData || prospectData.length === 0) {
      return res.status(404).json({ message: "No prospect data found" });
    }

    res.status(200).json({
      success: true,
      message: "Prospect data retrieved successfully",
      data: prospectData,
    });
  } catch (err) {
    console.error("Error in getting prospects data", err);
    res.status(500).json({
      success: false,
      message: "Error in retrieving prospect data",
      error: err.message,
    });
  }
};
const scheduleDemoClass = async (req, res) => {
  try {
    console.log("Welcome to schedule demo class");
    console.log(req.params, req.body);

    const { id } = req.params;
    const { date, time, selectedProgram, email, _id, kidFirstName } =
      req.body.data;
    console.log("_id", _id);

    if (!date || !time || !selectedProgram) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const empData = await Employee.findOne(
      { _id: id },
      { department: 1, name: 1 }
    );
    if (!empData) {
      return res.status(404).json({ message: "Employee not found." });
    }
    console.log("Employee Data", empData);

    const parentData = await Parent.findOne({ parentEmail: email }, { _id: 1 });
    if (!parentData) {
      return res.status(404).json({ message: "Parent not found." });
    }

    const kidsData = await kidSchema.findOne(
      { parentId: parentData._id },
      { _id: 1 }
    );
    if (!kidsData) {
      return res.status(404).json({ message: "Kid not found." });
    }

    const existingClasses = await DemoClass.find({
      date,
      time,
      kidId: kidsData._id,
    });
    if (existingClasses.length > 0) {
      return res.status(400).json({
        message: `A demo class is already scheduled for this date and time.`,
        existingClasses,
      });
    }

    const demoClass = await DemoClass.create({
      date,
      time,
      programs: [
        {
          program: selectedProgram.program,
          programLevel: selectedProgram.level,
        },
      ],
      kidId: kidsData._id,
      parentId: parentData._id,
      scheduledByName: empData.name,
      scheduledById: id,
      enqId: _id,
    });

    const logId = await OperationDept.findOne({ _id: _id }, { logs: 1 });
    console.log("logs data", logId);

    const logs = [
      {
        employeeId: id,
        employeeName: empData.firstName,

        action: `Demo class is sheduled for ${kidFirstName} with ${
          selectedProgram.program
        } (Level: ${selectedProgram.level}) on ${date} at ${time} by  ${
          empData.name
        } on ${new Date().toLocaleString()}`,
        createdAt: new Date(),
      },
    ];

    const updatedEnquiry = await enquiryLogs.findOneAndUpdate(
      { _id: logId.logs },
      {
        $push: {
          logs: logs,
        },
      },
      { new: true }
    );

    const updateStatus = await OperationDept.findByIdAndUpdate(
      _id,
      {
        $set: {
          "scheduleDemo.status": "Sheduled",
        },
      },
      { new: true }
    );

    console.log("id", updateStatus, _id);

    if (!updatedEnquiry) {
      return res
        .status(404)
        .json({ message: "Log not found in enquiry form." });
    }

    // Respond with the created demo class and updated enquiry log
    res.status(201).json({
      message: "Demo class scheduled successfully and log updated.",
      demoClass,
      updatedEnquiry,
    });
  } catch (err) {
    console.error("Error scheduling demo class:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getAllAttandanceData = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
  } catch (err) {
    console.log("Error in fetching the attandance", err);
  }
};

const getAllSheduleClass = async (req, res) => {
  try {
    const scheduleData = await ClassSchedule.find({ classType: "Demo" });
    console.log("Demo Class Schedule Data:", scheduleData);

    res.status(200).json({
      success: true,
      message: "Demo class schedules retrieved successfully",
      scheduleData,
    });
  } catch (err) {
    console.error("Error in getting the demo class", err);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const fetchAllLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const logsData = await enquiryLogs.findOne({ enqId: id });

    if (!logsData) {
      return res.status(404).json({ message: "Logs not found" });
    }

    // Extracting only the `createdAt` and `action` fields
    const logs = logsData.logs.map((log) => ({
      createdAt: moment(log.createdAt).format("DD-MM-YY"), // Format the date to dd-mm-yy
      action: log.action,
    }));

    return res.status(200).json(logs);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in fetching the logs", error: err.message });
  }
};

const getDemoClassAndStudentsData = async (req, res) => {
  try {
    console.log(
      "Welcome to getting the demo class and student data",
      req.params
    );
    const { classId } = req.params;

    // Find the class data by ID
    const classData = await ClassSchedule.find({ _id: classId });

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Find kids data matching the program and level in arrays
    const kidsData = await OperationDept.find(
      {
        enquiryField: "prospects",
        "scheduleDemo.status": "Pending",
        programs: {
          $elemMatch: {
            program: classData[0].program,
            level: classData[0].level,
          },
        },
      },
      { kidFirstName: 1 } // Project only the required fields
    );

    console.log("Class Data", classData);
    console.log("Kids Data", kidsData);

    res.status(200).json({ classData, kidsData });
  } catch (err) {
    console.error("Error in getting the demo class and student data", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const saveDemoClassData = async (req, res) => {
  try {
    console.log("Welcome to save the demo class", req.body, req.params);

    const { empId } = req.params;
    const { classId, students } = req.body;

    // Fetch employee data
    const empData = await Employee.findOne(
      { _id: empId },
      { name: 1, department: 1 }
    );

    // Fetch kids data
    const kidsData = await OperationDept.find(
      { _id: { $in: students } },
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
      console.log();
      const kid = kidsData.find((kid) => kid._id.toString() === studentId);
      return {
        kidId: kid.kidId,
        kidName: kid ? kid.kidFirstName : "Unknown",
      };
    });

    console.log("updatedSelectedStudents", updatedSelectedStudents, kidsData);

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
          "scheduledBy.name": empData.name || "",
        },
      },
      { new: true }
    );

    // Update the scheduleDemo field in the kidsData
    const updatedKidsDataPromises = kidsData.map(async (kid) => {
      if (students.includes(kid._id.toString())) {
        kid.scheduleDemo = {
          status: "Scheduled",
          scheduledDay: classSchedule.day,
        };

        await kid.save();
      }
    });

    // Wait for all updates to finish
    await Promise.all(updatedKidsDataPromises);

    const logUpdate = await enquiryLogs.findByIdAndUpdate(
      { _id: kidsData.logs },
      {
        $push: {
          logs: {
            employeeId: empId,
            employeeName: empData.firstName, // empData.firstName should exist here
            comment: `Status updated from '${previousStatus}' to '${enquiryStatus}'`,
            action: ` ${empData.firstName} in ${empData.department} department sheduled demo class. created on ${formattedDateTime}`,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    // Respond with success
    res.status(200).json({
      message: "Demo class data saved successfully.",
      updatedClassSchedule: classSchedule,
      updatedKidsData: kidsData,
    });
  } catch (err) {
    console.log("Error in saving the demo class", err);
    res
      .status(500)
      .json({ error: "An error occurred while saving the demo class." });
  }
};

const getConductedDemoClass = async (req, res) => {
  try {
    const classSchedule = await ClassSchedule.find({ classType: "Demo" });
    const conductedClasses = await ConductedClass.find();

    const conductedDemoClasses = classSchedule 
      .filter(schedule => 
        conductedClasses.some(conducted => conducted.classID.toString() === schedule._id.toString())
      )
      .map(schedule => {
        const conductedDetails = conductedClasses.find(
          conducted => conducted.classID.toString() === schedule._id.toString()
        );
        return {
          ...schedule.toObject(),
          conductedDate: conductedDetails.conductedDate,
          status: conductedDetails.status,
          students: conductedDetails.students,
        };
      });

      console.log("Conducted demo class",conductedDemoClasses) 

    res.status(200).json(conductedDemoClasses);
  } catch (err) {
    console.log("Error in getting the conducted demo class", err);
    res.status(500).json({ error: "Internal Server Error" }); 
  }
};



const updateEnrollmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Id status", id);

    const enrollmentData = await kidSchema.findOne({ _id: id }, { enqId: 1 });
    
    if (!enrollmentData) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    console.log("Enrollment Data", enrollmentData);

    const updateEqStatus = await OperationDept.findOneAndUpdate(
      { _id: enrollmentData.enqId, payment: "Pending" },
      { $set: { payment: "Success" } },
      { new: true }
    ); 

    if (!updateEqStatus) {
      return res.status(404).json({ message: "Enrollment with pending payment not found" });
    }

    console.log("Updated Enrollment Status", updateEqStatus);

    return res.status(200).json({
      message: "Payment status updated successfully",
      updatedStatus: updateEqStatus
    });

  } catch (err) {
    console.error("Error in updating the status", err);
    return res.status(500).json({ message: "Server error while updating the status" });
  }
};











module.exports = {
  operationEmailVerification,
  operationPasswordVerification,
  enquiryFormData,
  getAllEnquiries,
  updateEnquiry,
  createAttendance,
  deleteEnquiry,
  updateProspectStatus,
  scheduleDemo,
  addNotes,
  getAllLeaves,
  deleteLeave,
  updateLeave,
  createLeave,
  referToFriend,
  updateEnquiryStatus,
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  fetchAttendance,
  getMyTasks,
  getAllKidData,
  getAllParentData,
  getAllAttandanceData,
  getProspectsData,
  getProspectsStudentsData,
  scheduleDemoClass,
  getAllSheduleClass,
  updateProspectData,
  registerEmployee,
  fetchAllLogs,
  saveDemoClassData,
  getDemoClassAndStudentsData,
  getConductedDemoClass,
  updateEnrollmentStatus
};
