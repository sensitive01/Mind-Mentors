const OperationDept = require("../../../model/operationDeptModel");
const leaves = require("../../../model/leavesModel");
const attendance = require("../../../model/attendanceModel");
const Task = require("../../../model/taskModel");
const kidSchema = require("../../../model/kidModel")
const parentSchema =require("../../../model/parentModel")

// Email Verification
const operationEmailVerification = async (req, res) => {
  try {
    console.log("Welcome to operation employee verification", req.body);

    const operationEmail = "operationdept@gmail.com";
    const { email } = req.body;

    if (operationEmail === email) {
      console.log("Email exists");
      return res.status(200).json({
        success: true,
        message: "Email verification successful. Employee exists.",
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

    const orgPassword = "operationdept@123";
    const { password } = req.body;

    if (password === orgPassword) {
      return res.status(200).json({
        success: true,
        message: "Password verification successful.",
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
    const formData = req.body;
    const newEntry = await OperationDept.create(formData);

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

// Get All Enquiries
const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await OperationDept.find();
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
    const { enquiryStatus } = req.body;
    console.log(enquiryStatus, id);

    // Validate status
    if (!["cold", "warm"].includes(enquiryStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. It must be either 'cold' or 'warm'.",
      });
    }

    // Update the status of the enquiry, including both `status` and `enquiryStatus`
    const updatedEntry = await OperationDept.findByIdAndUpdate(
      { _id: id },
      {
        enquiryStatus, // Ensuring both fields are updated
      },
      { new: true } // Return the updated document
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    // Send success response with updated data
    res.status(200).json({
      success: true,
      message: "Enquiry status updated successfully",
      data: updatedEntry, // Returning the updated document
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating enquiry status", error: error.message });
  }
};

// Add Notes to Enquiry
const addNotesToEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { enquiryStageTag, addNoteTo, notes } = req.body; // Notes data from the body

    // Validate if note data is provided
    if (!enquiryStageTag || !addNoteTo || !notes) {
      return res.status(400).json({
        success: false,
        message: "Enquiry Stage Tag, Add Note To, and Notes are required.",
      });
    }

    // Create the new note
    const newNote = { enquiryStageTag, addNoteTo, notes };

    // Find the enquiry by ID and push the new note into the notes array
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

// Update Prospect Status (Cold/Warm)
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
    const updatedEntry = await OperationDept.findByIdAndUpdate(
      id,
      { scheduleDemo: { date, status } },
      { new: true }
    );
    if (!updatedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json({
      success: true,
      message: "Demo scheduled successfully",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error scheduling demo", error);
    res.status(500).json({ message: "Error scheduling demo" });
  }
};

// Add Notes
const addNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const updatedEntry = await OperationDept.findByIdAndUpdate(
      id,
      { notes },
      { new: true }
    );
    if (!updatedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json({
      success: true,
      message: "Notes added successfully",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error adding notes", error);
    res.status(500).json({ message: "Error adding notes" });
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
    console.log(newAttendance,email)
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
          employeeName: employee.name,
          status: attendanceMap[employee.name].status,
          time: attendanceMap[employee.name].time,
        };
      } else {
        return {
          employeeName: employee.name,
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
          { parentName: 1,parentEmail:1,parentMobile:1 } 
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
          kidsData,            // Add kids data
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
  getAllParentData
};
