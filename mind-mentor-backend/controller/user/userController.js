const express = require("express");
const xml2js = require("xml2js");

const multer = require("multer");
const User = require("../../model/userModel"); // Adjust the path as necessary
const Employee = require("../../model/employeeModel");
const packagesData = require("../../controller/centeradmin/package");
const Package = require("../../model/packageDetails");
const app = express();
const upload = multer(); // You can configure storage options if needed
const bcrypt = require("bcryptjs");
const Voucher = require("../../model/discount_voucher/voucherModel");
const parentModel = require("../../model/parentModel");
const leavesModel = require("../../model/leavesModel");
const OnlineClass = require("../../model/class/onlineClassPackage");
const parentTicket = require("../../model/supportTiket");
const {
  Tournament,
  Notification,
  Holiday,
  AllowanceDeduction,
  Expense,
  Transaction,
  Chat,
} = require("../../model/tournamentsModel");
const PhysicalCenter = require("../../model/physicalcenter/physicalCenterShema");
const ProgramData = require("../../model/programe/programeDataSchema");
const ClassSchedule = require("../../model/classSheduleModel");
const attendanceModel = require("../../model/attendanceModel");
const taskModel = require("../../model/taskModel");
const offlineclassPackage = require("../../model/class/offlineClassPackage");
const hybridClassSchema = require("../../model/class/hybridClassPackage");
const KitPrice = require("../../model/class/kitPrice");
const packagePaymentData = require("../../model/packagePaymentModel");
const { v4: uuidv4 } = require("uuid");
const kidSchema = require("../../model/kidModel");
const enquiryData = require("../../model/operationDeptModel");
const logsSchema = require("../../model/enquiryLogs");
const wholeClassSchema = require("../../model/wholeClassAssignedModel");
const demoClassSchema = require("../../model/demoClassModel");
const ConductedClass = require("../../model/conductedClassSchema");
const { default: axios } = require("axios");
const ChessKidPlaying = require("../../model/chesskidplay/chessKidPlayingSchema");

const createUser = async (req, res) => {
  try {
    // Log the incoming data
    console.log("Request Body:", req.body);

    // Parse skills and education
    const skills =
      req.body.skills && Array.isArray(req.body.skills) ? req.body.skills : [];
    const education =
      req.body.education && Array.isArray(req.body.education)
        ? req.body.education
        : [];

    // Ensure education is an array of objects with the correct fields
    const validatedEducation = education.map((item) => ({
      degree: item.degree || "",
      institution: item.institution || "",
      graduationYear: item.graduationYear || "",
    }));

    // Prepare application data according to the schema
    const applicationData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      bio: req.body.bio,
      skills: skills,
      education: validatedEducation,
      profilePicture: req.body.profilePicture || null, // Handle null case
    };

    // Create a new user application document in the database
    const newApplication = await User.create(applicationData);

    // Send success response
    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: newApplication,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit application. Please try again later.",
    });
  }
};

// Set up the route
app.post("/superadmin/users", upload.single("profilePicture"), createUser);

// Get All User Applications
const getAllUser = async (req, res) => {
  try {
    const applications = await User.find();
    console.log(applications);
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications" });
  }
};

// Update User Application
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedApplication = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: "Error updating application" });
  }
};
// Get User by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the request parameters
    const user = await User.findById(id); // Find the user by ID in the database

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user); // Log the user (optional)
    res.status(200).json(user); // Send the user data as the response
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ message: "Error fetching user by ID" });
  }
};

const getAllEmployeesByName = async (req, res) => {
  try {
    const applications = await Employee.find(
      {},
      "_id firstName lastName email"
    ); // Only fetch _id, firstName, and lastName
    console.log(applications);
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications" });
  }
};

// Delete User Application
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedApplication = await User.findByIdAndDelete(id);
    if (!deletedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting application" });
  }
};
// Get All User Applications
const getAllUserByName = async (req, res) => {
  try {
    const applications = await User.find({}, "_id firstName lastName email"); // Only fetch _id, firstName, and lastName
    console.log(applications);
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications" });
  }
};
const createEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      department,
      employmentType,
    } = req.body;

    // Log the values to ensure both password and confirmPassword are received
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);

    // Password and confirm password validation
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new employee document
    const newEmployee = new Employee({
      firstName,
      lastName,
      email,

      password: hashedPassword,
      department,
      employmentType,
    });

    // Save the new employee to the database
    await newEmployee.save();

    return res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    return res
      .status(500)
      .json({ error: "There was an error creating the employee." });
  }
};

// Update an existing employee
const updateEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id; // Get employee ID from URL params
    const { firstName, lastName, email, password, department, employmentType } =
      req.body;

    // Check if the employee exists
    const existingEmployee = await Employee.findById(employeeId); // Find employee by ID
    if (!existingEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // If password is being updated, hash it
    let updatedPassword = password;
    if (password) {
      updatedPassword = await hashPassword(password);
    }

    // Update employee details
    existingEmployee.firstName = firstName || existingEmployee.firstName;
    existingEmployee.lastName = lastName || existingEmployee.lastName;
    existingEmployee.email = email || existingEmployee.email;
    existingEmployee.password = updatedPassword;
    existingEmployee.department = department || existingEmployee.department;
    existingEmployee.employmentType =
      employmentType || existingEmployee.employmentType;

    // Save updated employee document
    await existingEmployee.save();

    return res.status(200).json({
      message: "Employee updated successfully",
      employee: existingEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    return res
      .status(500)
      .json({ error: "There was an error updating the employee." });
  }
};
// Get Employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params; // Get the employee ID from the request parameters
    const employee = await Employee.findById(id); // Find the employee by ID in the database

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    console.log(employee); // Log the employee (optional)
    res.status(200).json(employee); // Send the employee data as the response
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ message: "Error fetching employee by ID" });
  }
};
// Delete Employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params; // Get the employee ID from the request parameters
    const deletedEmployee = await Employee.findByIdAndDelete(id); // Delete employee by ID

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee" });
  }
};
// Get All Employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find(); // Fetch all employees from the database
    console.log(employees); // Log the employees (optional)
    res.status(200).json(employees); // Send the employee data as the response
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees" });
  }
};

const createTournament = async (req, res) => {
  try {
    const { tournamentData } = req.body;

    if (!tournamentData || !Array.isArray(tournamentData)) {
      return res.status(400).json({ error: "Invalid tournament data." });
    }

    const formattedData = tournamentData.map((t) => ({
      tournamentName: t.tournamentName,
      mode: t.mode,
      tournamentCentre: t.centreName,
      centerId: t.centerId,
      tournamentDate: new Date(t.date),
      time: t.time,
      hasRegistrationFee: t.hasRegistrationFee,
      registrationFee: t.hasRegistrationFee
        ? Number(t.registrationFeeAmount)
        : 0,
      instructions: t.instructions,
      numberOfParticipants: Number(t.numberOfParticipants),
      prizePool: t.prizePool.map((prize) => ({
        position: prize.position,
        amount: prize.amount,
      })),
      registeredKids: [],
    }));

    const savedTournaments = await Tournament.insertMany(formattedData);

    res.status(201).json({
      message: "Tournaments created successfully",
      data: savedTournaments,
    });
  } catch (error) {
    console.error("Error saving tournaments:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get all tournaments
const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single tournament by ID
const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament)
      return res.status(404).json({ error: "Tournament not found" });
    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { updatedData } = req.body;

    console.log("updateData:", updatedData);
    console.log("tournamentId:", tournamentId);

    if (!updatedData) {
      return res.status(400).json({ error: "No update data provided." });
    }

    // Transform and map fields from frontend to schema
    const transformedData = {
      tournamentName: updatedData.tournamentName,
      mode: updatedData.mode,
      tournamentCentre: updatedData.tournamentCentre,
      centerId: updatedData.centerId,
      tournamentDate: new Date(updatedData.tournamentDate), // this is fine if the format is correct
      time: updatedData.time,
      hasRegistrationFee: updatedData.hasRegistrationFee,
      registrationFee: Number(updatedData.registrationFee) || 0,
      instructions: updatedData.instructions,
      numberOfParticipants: Number(updatedData.numberOfParticipants),
      prizePool: updatedData.prizePool?.map((prize) => ({
        position: prize.position,
        amount: prize.amount,
      })),
    };

    const updatedTournament = await Tournament.findByIdAndUpdate(
      tournamentId,
      transformedData,
      { new: true, runValidators: true }
    );

    if (!updatedTournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    res.status(200).json({
      message: "Tournament updated successfully",
      updatedTournament,
    });
  } catch (error) {
    console.error("Error updating tournament:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Delete a tournament by ID
const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!tournament)
      return res.status(404).json({ error: "Tournament not found" });
    res.status(200).json({ message: "Tournament deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new notification
const createNotification = async (req, res) => {
  const { title, body, type } = req.body;
  try {
    const newNotification = new Notification({ title, body, type });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a notification by ID
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a notification by ID
const updateNotification = async (req, res) => {
  const { title, body, type } = req.body;
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      { title, body, type },
      { new: true }
    );
    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(updatedNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a notification by ID
const deleteNotification = async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(
      req.params.id
    );
    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createHoliday = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debugging req.body
    const {
      holidayName,
      startDate,
      endDate,
      description,
      attachment,
      category,
    } = req.body;
    const newHoliday = new Holiday({
      holidayName,
      startDate,
      endDate,
      description,
      attachment,
      category,
    });
    await newHoliday.save();
    console.log("Saved holiday:", newHoliday); // Debugging saved data
    res.status(200).json(newHoliday);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getAllHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find();
    res.status(200).json(holidays);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getHolidayById = async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) {
      return res.status(404).json({ message: "Holiday not found" });
    }
    res.status(200).json(holiday);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateHoliday = async (req, res) => {
  try {
    const {
      holidayName,
      startDate,
      endDate,
      description,
      attachment,
      category,
    } = req.body;
    const updatedHoliday = await Holiday.findByIdAndUpdate(
      req.params.id,
      { holidayName, startDate, endDate, description, attachment, category },
      { new: true }
    );
    if (!updatedHoliday) {
      return res.status(404).json({ message: "Holiday not found" });
    }
    res.status(200).json(updatedHoliday);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);
    if (!holiday) {
      return res.status(404).json({ message: "Holiday not found" });
    }
    res.status(200).json({ message: "Holiday deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create a new allowance/deduction record
const createAllowanceDeduction = async (req, res) => {
  try {
    const { employeeName, allowance, deduction, amount } = req.body;

    const newAllowanceDeduction = new AllowanceDeduction({
      employeeName,
      allowance,
      deduction,
      amount,
    });

    await newAllowanceDeduction.save();
    res.status(201).json({
      message: "Allowance/Deduction created successfully",
      newAllowanceDeduction,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all allowance/deduction records
const getAllowanceDeductions = async (req, res) => {
  try {
    const allowances = await AllowanceDeduction.find();
    res.status(200).json(allowances);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get a single allowance/deduction record by ID
const getAllowanceDeductionById = async (req, res) => {
  try {
    const allowanceDeduction = await AllowanceDeduction.findById(req.params.id);
    if (!allowanceDeduction) {
      return res.status(404).json({ message: "Allowance/Deduction not found" });
    }
    res.status(200).json(allowanceDeduction);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update an existing allowance/deduction record by ID
const updateAllowanceDeduction = async (req, res) => {
  try {
    const { allowance, deduction, amount } = req.body;

    const updatedAllowanceDeduction =
      await AllowanceDeduction.findByIdAndUpdate(
        req.params.id,
        { allowance, deduction, amount },
        { new: true }
      );

    if (!updatedAllowanceDeduction) {
      return res.status(404).json({ message: "Allowance/Deduction not found" });
    }

    res.status(200).json({
      message: "Allowance/Deduction updated successfully",
      updatedAllowanceDeduction,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete an allowance/deduction record by ID
const deleteAllowanceDeduction = async (req, res) => {
  try {
    const deletedAllowanceDeduction =
      await AllowanceDeduction.findByIdAndDelete(req.params.id);
    if (!deletedAllowanceDeduction) {
      return res.status(404).json({ message: "Allowance/Deduction not found" });
    }
    res
      .status(200)
      .json({ message: "Allowance/Deduction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// Create new expense
const createExpense = async (req, res) => {
  try {
    const { category, description, amount, date } = req.body;

    const newExpense = new Expense({
      category,
      description,
      amount,
      date,
    });

    await newExpense.save();
    res
      .status(201)
      .json({ message: "Expense created successfully", newExpense });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get expense by ID
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update expense by ID
const updateExpense = async (req, res) => {
  try {
    const { category, description, amount, date } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { category, description, amount, date },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res
      .status(200)
      .json({ message: "Expense updated successfully", updatedExpense });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete expense by ID
const deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
const createTransaction = async (req, res) => {
  try {
    const {
      transactionId,
      employeeName,
      transactionType,
      amount,
      status,
      date,
    } = req.body;

    const newTransaction = new Transaction({
      transactionId,
      employeeName,
      transactionType,
      amount,
      status,
      date,
    });

    await newTransaction.save();
    res
      .status(201)
      .json({ message: "Transaction created successfully", newTransaction });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const {
      transactionId,
      employeeName,
      transactionType,
      amount,
      status,
      date,
    } = req.body;

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { transactionId, employeeName, transactionType, amount, status, date },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      updatedTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create a new chat message
const createChat = async (req, res) => {
  try {
    console.log("Headers:", req.headers); // Log headers to check if empId is present
    console.log("Body:", req.body); // Log the request body

    const { category, message, attachment, status, receiverId } = req.body;

    // Extract sender's employee ID from headers or body
    const senderId = req.headers.empId || req.body.senderId;

    // Check if senderId is provided
    if (!senderId) {
      return res.status(400).json({ message: "Sender ID (empId) is required" });
    }

    // Verify the senderId in the Employee collection
    const sender = await Employee.findOne({ _id: senderId });
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Verify the receiverId in the Employee collection
    const receiver = await Employee.findOne({ _id: receiverId });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Find or create a chat ticket
    let chat = await Chat.findOne({ ticketId: receiverId });
    if (!chat) {
      // Generate a custom ticket ID
      const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 random digits
      const randomLetters = Math.random()
        .toString(36)
        .substring(2, 4)
        .toUpperCase(); // 2 random letters
      const ticketId = `TKT${randomDigits}${randomLetters}`; // Combine to form ticketId

      chat = new Chat({
        ticketId,
        category,
        messages: [],
        status,
      });
    }

    // Add a new message to the chat
    chat.messages.push({
      sender: {
        _id: sender._id,
        firstName: sender.firstName,
        lastName: sender.lastName,
      },
      receiver: {
        _id: receiver._id,
        firstName: receiver.firstName,
        lastName: receiver.lastName,
      },
      message,
      attachment,
    });

    // Save the updated chat document
    await chat.save();

    // Send a response back to the client
    res.status(201).json({
      message: "Chat created successfully",
      chat,
    });
  } catch (error) {
    // Log and return error if something goes wrong
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all chat messages
const getAllChats = async (req, res) => {
  try {
    // Get empId from headers sent by the frontend
    const empId = req.headers.empid; // Ensure header name matches exactly

    if (!empId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // Fetch chats where the empId is either the sender or the receiver
    const chats = await Chat.find({
      $or: [
        { "messages.sender._id": empId }, // Check if empId is sender
        { "messages.receiver._id": empId }, // Check if empId is receiver
      ],
    })
      .populate({
        path: "messages.sender._id", // Populate sender's _id inside the message
        select: "firstName lastName email",
      })
      .populate({
        path: "messages.receiver._id", // Populate receiver's _id inside the message
        select: "firstName lastName email",
      });

    // If no chats found, return an appropriate message
    if (chats.length === 0) {
      return res
        .status(400)
        .json({ message: "No chats found for this employee." });
    }

    res.status(200).json({
      message: "Chats retrieved successfully",
      chats,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get a specific chat message by ID
const getChatByTicketId = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Check if ticketId is provided
    if (!ticketId) {
      console.log("No ticketId provided");
      return res.status(400).json({ message: "Ticket ID is required" });
    }

    console.log("Received Ticket ID:", ticketId);

    // Query chat by ticketId
    const chat = await Chat.findOne({ ticketId }) // Query using an object with ticketId
      .populate({
        path: "messages.sender._id", // Populate sender's _id inside the message
        select: "firstName lastName email",
      })
      .populate({
        path: "messages.receiver._id", // Populate receiver's _id inside the message
        select: "firstName lastName email",
      });

    if (!chat) {
      console.log("No chat found for ticketId:", ticketId);
      return res.status(404).json({ message: "Chat not found" });
    }

    console.log("Chat retrieved successfully:", chat);

    res.status(200).json({ message: "Chat retrieved successfully", chat });
  } catch (error) {
    console.error("Error retrieving chat by ticketId:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update a chat message
const updateChat = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const senderId = req.headers.empid || req.headers.empId;
    console.log("Received Ticket ID:", ticketId);
    console.log("Sender ID from headers:", senderId);

    // Validate senderId
    if (!senderId) {
      return res.status(400).json({ message: "Sender ID (empId) is required" });
    }

    // Validate the sender in the Employee collection
    const sender = await Employee.findOne({ _id: senderId });
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Validate the receiverId in the request body
    const { receiverId, message, attachment, status, category } = req.body;
    // if (!receiverId) {
    //   return res.status(400).json({ message: "Receiver ID is required" });
    // }
    const chat = await Chat.findOne({ ticketId }); // Query using an object with ticketId

    // Find the chat by ticketId
    const updatedChat = await Chat.findOne({ ticketId })
      .populate({
        path: "messages.sender._id",
        select: "firstName lastName email",
      })
      .populate({
        path: "messages.receiver._id",
        select: "firstName lastName email",
      });

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Optionally update category and status if provided
    if (category) updatedChat.category = category;
    if (status) updatedChat.status = status;

    // Add new message or attachment to the chat
    if (message || attachment) {
      updatedChat.messages.push({
        sender: {
          _id: sender._id,
          firstName: sender.firstName,
          lastName: sender.lastName,
        },

        message,
        attachment,
      });
    }

    // Save the updated chat document
    await updatedChat.save();

    // Send a response back to the client
    res.status(200).json({
      message: "Chat updated successfully",
      updatedChat,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a chat message
const deleteChat = async (req, res) => {
  try {
    const deletedChat = await Chat.findByIdAndDelete(req.params.id);

    if (!deletedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({
      message: "Chat deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const insertPackage = async (req, res) => {
  try {
    await Package.insertMany(packagesData);
    console.log("Data inserted successfully");
    res.status(201).json({ message: "Data inserted successfully" });
  } catch (err) {
    console.error("Error inserting package data:", err);
    res.status(500).json({ error: "Failed to insert data" });
  }
};

const addNewVoucher = async (req, res) => {
  try {
    const { formData } = req.body;
    const newVoucher = new Voucher(formData);
    const savedVoucher = await newVoucher.save();
    res
      .status(201)
      .json({ message: "Voucher created successfully", savedVoucher });
  } catch (err) {
    console.log("Error in adding new discount voucher");
    res
      .status(500)
      .json({ message: "Error creating voucher", error: error.message });
  }
};

const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching vouchers", error: error.message });
  }
};

const getTheVoucherData = async (req, res) => {
  try {
    const { voucherId } = req.params;

    const vouchers = await Voucher.findOne({ _id: voucherId });
    res.status(200).json(vouchers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching vouchers", error: error.message });
  }
};

const updateTheVoucherData = async (req, res) => {
  try {
    const { voucherId } = req.params;
    const { data } = req.body;

    const updatedVoucher = await Voucher.findByIdAndUpdate(
      voucherId,
      data,
      { new: true } // Return the updated document
    );

    if (!updatedVoucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    res.status(200).json({
      success: true,
      message: "Voucher updated successfully",
      voucher: updatedVoucher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating voucher",
      error: error.message,
    });
  }
};

const savePhysicalCenterData = async (req, res) => {
  try {
    const formData = req.body;
    console.log("Received Form Data:", formData);
    const { programLevels } = formData;
    const { levels } = programLevels;
    console.log("programLevels", programLevels, "levels", levels);

    const newCenter = new PhysicalCenter({
      centerType: formData.centerType,
      centerName: formData.centerName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      photos: formData.photos || [],
      businessHours: formData.businessHours || [],
      programLevels: formData.programLevels || [],
    });

    const savedCenter = await newCenter.save();

    res.status(201).json({
      success: true,
      message: "Physical center data saved successfully",
      data: savedCenter,
    });
  } catch (err) {
    console.error("Error in saving the physical center data", err);
    res.status(500).json({
      success: false,
      message: "Failed to save physical center data",
      error: err.message,
    });
  }
};

const getPhysicalCenterData = async (req, res) => {
  try {
    const centers = await PhysicalCenter.find().lean();
    const programs = await ProgramData.find().lean();

    // Convert program list into a Map for quick lookup
    const programMap = new Map();
    programs.forEach((p) => {
      programMap.set(p._id.toString(), p.programName);
    });

    // Replace program ID with program name in each center's programLevels
    const updatedCenters = centers.map((center) => {
      const updatedProgramLevels = center.programLevels.map((pl) => {
        const programId = pl.program?.toString(); // assuming pl.program is ObjectId
        const programName = programMap.get(programId) || "Unknown Program";

        return {
          ...pl,
          program: programName, // Replace ObjectId with name
        };
      });

      return {
        ...center,
        programLevels: updatedProgramLevels,
      };
    });

    res.status(200).json({
      success: true,
      message: "Physical center data retrieved successfully",
      physicalCenters: updatedCenters,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve physical center data",
      error: err.message,
    });
  }
};

const deleteTheVoucherData = async (req, res) => {
  try {
    const { voucherId } = req.params;

    const deletedVoucher = await Voucher.findByIdAndDelete(voucherId);

    if (!deletedVoucher) {
      return res.status(404).json({
        success: false,
        message: "Voucher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Voucher deleted successfully",
      deletedVoucher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting voucher",
      error: error.message,
    });
  }
};

const getIndividualPhysicalCenterData = async (req, res) => {
  try {
    const { centerId } = req.params;
    const physicalCenter = await PhysicalCenter.findById(centerId);

    if (!physicalCenter) {
      return res.status(404).json({
        success: false,
        message: "Physical center not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Physical center data retrieved successfully",
      data: physicalCenter,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve physical center data",
      error: err.message,
    });
  }
};

const updatePhysicalCenterData = async (req, res) => {
  try {
    const { formData } = req.body;

    const { centerId } = req.params;
    if (!centerId) {
      return res
        .status(400)
        .json({ success: false, message: "Center ID is required for update" });
    }

    const updatedCenter = await PhysicalCenter.findByIdAndUpdate(
      centerId,
      {
        centerType: formData.centerType,
        centerName: formData.centerName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        photos: formData.photos || [],
        businessHours: formData.businessHours || [],
        programLevels: formData.programLevels || [],
      },
      { new: true } // Return the updated document
    );

    if (!updatedCenter) {
      return res
        .status(404)
        .json({ success: false, message: "Center not found" });
    }

    res.status(200).json({
      success: true,
      message: "Physical center data updated successfully",
      data: updatedCenter,
    });
  } catch (err) {
    console.error("Error in updating the physical center data", err);
    res.status(500).json({
      success: false,
      message: "Failed to update physical center data",
      error: err.message,
    });
  }
};

const deletePhysicalCenterData = async (req, res) => {
  try {
    const { centerId } = req.params;

    if (!centerId) {
      return res
        .status(400)
        .json({ success: false, message: "Center ID is required" });
    }

    const deletedCenter = await PhysicalCenter.findByIdAndDelete(centerId);

    if (!deletedCenter) {
      return res
        .status(404)
        .json({ success: false, message: "Center not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Physical center deleted successfully" });
  } catch (err) {
    console.error("Error in deleting the physical center data", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete physical center data",
      error: err.message,
    });
  }
};

const getPhysicalCenterTimings = async (req, res) => {
  try {
    const physicalCenterTimings = await PhysicalCenter.find(
      {},
      { programLevels: 1, businessHours: 1, centerName: 1, centerType: 1 }
    );

    res.status(200).json({
      success: true,
      message: "Physical center timings fetched successfully",
      data: physicalCenterTimings,
    });
  } catch (err) {
    console.error("Error in getting the physical center timings", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch physical center timings",
      error: err.message,
    });
  }
};

const generateUniquePackageId = async () => {
  let isUnique = false;
  let packageId;

  while (!isUnique) {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    packageId = `MMPKG${randomNum}`;
    const existingPackage = await Package.findOne({ packageId });
    if (!existingPackage) {
      isUnique = true;
    }
  }

  return packageId;
};

const addNewPackageData = async (req, res) => {
  try {
    console.log("Welcome to add new package data", req.body);

    const { formData } = req.body;
    if (!formData) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const {
      type,
      packageName,
      description,
      onlineClasses,
      physicalClasses,
      centerName,
      centerId,
      pricing,
    } = formData;

    const packageId = await generateUniquePackageId();

    const newPackage = new Package({
      packageId,
      type,
      packageName,
      description,
      onlineClasses,
      physicalClasses,
      centerName,
      centerId,
      pricing,
    });

    await newPackage.save();

    return res.status(201).json({
      message: "Package data added successfully",
      data: newPackage,
    });
  } catch (err) {
    console.error("Error in adding new package", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllPackageData = async (req, res) => {
  try {
    console.log("Welcome to get all package data");

    const onlinePackageData = await OnlineClass.find();
    const offlinePackageData = await offlineclassPackage.find();
    const hybridPackageData = await hybridClassSchema.find();
    const kitData = await KitPrice.find();

    // Flatten online classes
    const onlinePackages = onlinePackageData.map((item) => ({
      packageType: "Online",
      centerName: item.centers[0]?.centerName || "N/A",
      packageName: item.packageName,
      programName: item.programName,
      programLevel: item.programLevel,
      classStartFrom: item.classStartFrom,
      classUpTo: item.classUpTo,

      amount: item.amount,
      time: item.time,
      mode: item.mode,
      quantity: null,
      kitPrice: null,
    }));

    // Flatten offline classes
    const offlinePackages = offlinePackageData.flatMap((item) =>
      item.centers.map((center) => ({
        packageType: "Offline",
        centerName: center.centerName,
        packageName: center.packageName,
        programName: center.programName,
        programLevel: center.programLevel,
        classStartFrom: center.classStartFrom,
        classUpTo: center.classUpTo,
        amount: center.amount,
        time: center.time,
        mode: item.mode,
        quantity: null,
        kitPrice: null,
      }))
    );

    // Flatten hybrid classes
    const hybridPackages = hybridPackageData.flatMap((item) =>
      item.centers.map((center) => ({
        packageType: "Hybrid",
        centerName: center.centerName,
        packageName: center.packageName,
        programName: center.programName,
        programLevel: center.programLevel,
        classStartFrom: center.classStartFrom,
        classUpTo: center.classUpTo,
        amount: center.amount,
        time: center.time,
        mode: center.mode,
        quantity: null,
        kitPrice: null,
      }))
    );

    // Flatten kit data
    const kitPackages = kitData.map((item) => ({
      packageType: "Kit",
      centerName: null,
      packageName: null,
      programName: null,
      programLevel: null,
      classStartFrom: item.classStartFrom,
      classUpTo: item.classUpTo,
      amount: null,
      time: null,
      mode: "Kit",
      quantity: item.quantity,
      kitPrice: item.kitPrice,
    }));

    const packagesData = [
      ...onlinePackages,
      ...offlinePackages,
      ...hybridPackages,
      ...kitPackages,
    ];

    return res.status(200).json({
      message: "Packages retrieved successfully",
      packagesData,
    });
  } catch (err) {
    console.error("Error in getting the package", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllParentData = async (req, res) => {
  try {
    const parentData = await parentModel.find();

    if (!parentData || parentData.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No parent data found" });
    }

    // Extract all kidIds
    const allKidIds = parentData.flatMap((parent) =>
      parent.kids.map((kid) => kid.kidId)
    );

    // Get all enrollment data for the collected kidIds
    const allEnrollments = await enquiryData.find({
      kidId: { $in: allKidIds },
    });

    // Convert enrollment array into a map for quick access
    const enrollmentMap = {};
    allEnrollments.forEach((enrollment) => {
      enrollmentMap[enrollment.kidId] = enrollment;
    });

    // Attach corresponding enrollment to each kid inside parent.kids
    const enrichedParentData = parentData.map((parent) => {
      const updatedKids = parent.kids.map((kid) => {
        return {
          ...kid._doc,
          enrollment: enrollmentMap[kid.kidId] || null,
        };
      });

      return {
        ...parent._doc,
        kids: updatedKids,
      };
    });

    res.status(200).json({
      success: true,
      message: "Parent data retrieved successfully with enrollment info",
      parentData: enrichedParentData,
    });
  } catch (err) {
    console.error("Error in getting the parent data", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

function toTitleCase(str) {
  if (typeof str !== "string") return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const addNewProgrammeData = async (req, res) => {
  try {
    console.log("Welcome to add programme", req.body);

    const { programName, programLevel } = req.body;

    // Validate input
    if (!programName || !programLevel) {
      return res.status(400).json({
        success: false,
        message: "Program name, level are required",
      });
    }

    const formattedName = toTitleCase(programName);

    // Format levels to title case
    const formattedLevels = Array.isArray(programLevel)
      ? programLevel.map((lvl) => toTitleCase(lvl))
      : [toTitleCase(programLevel)];

    // Check if program already exists
    const existingProgram = await ProgramData.findOne({
      programName: formattedName,
    });

    if (existingProgram) {
      let updated = false;

      // Add new levels if not already present
      formattedLevels.forEach((lvl) => {
        if (!existingProgram.programLevel.includes(lvl)) {
          existingProgram.programLevel.push(lvl);
          updated = true;
        }
      });

      return res.status(200).json({
        success: true,
        message: updated
          ? "Program updated with new level(s) or center(s)"
          : "Program already has all provided levels ",
        data: existingProgram,
      });
    }

    // If not existing, create new program
    const newProgram = new ProgramData({
      programName: formattedName,
      programLevel: formattedLevels,
    });

    await newProgram.save();

    res.status(201).json({
      success: true,
      message: "New program created",
      data: newProgram,
    });
  } catch (err) {
    console.error("Error in adding the program data", err);
    res.status(500).json({ success: false, message: "Failed to add program" });
  }
};

const getAllProgrameData = async (req, res) => {
  try {
    const programDataWithCentre = await PhysicalCenter.find(
      {},
      {
        programLevels: 1,
        centerName: 1,
        centerType: 1,
      }
    );

    const programData = await ProgramData.find();

    // Create a lookup map from program _id to programName
    const programMap = new Map();
    programData.forEach((program) => {
      programMap.set(program._id.toString(), program.programName);
    });

    // Convert each center and its programLevels into plain JS object
    const modifiedCenters = programDataWithCentre.map((centerDoc) => {
      const center = centerDoc.toObject(); // Convert full center to plain JS object

      center.programLevels = center.programLevels.map((pl) => {
        return {
          ...pl,
          program: programMap.get(pl.program.toString()) || "Unknown Program",
        };
      });

      return center;
    });
    modifiedCenters.map((item) => {
      console.log("map", item);
    });

    res.status(200).json({
      success: true,
      message: "Program data fetched successfully",
      programs: modifiedCenters,
    });
  } catch (err) {
    console.error("Error in getting the program data", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch program data",
    });
  }
};

const getAllProgrameDataTable = async (req, res) => {
  try {
    const programs = await ProgramData.find();
    console.log("programs", programs);

    res.status(200).json({
      success: true,
      message: "Program data fetched successfully",
      programs,
    });
  } catch (err) {
    console.log("Error in getting the program data", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch program data",
    });
  }
};

const updateProgrameData = async (req, res) => {
  try {
    console.log("Welcome to update the program data", req.body);

    const { _id, programName, programLevel } = req.body;

    if (!_id) {
      return res
        .status(400)
        .json({ success: false, message: "Program ID is required" });
    }

    const updatedProgram = await ProgramData.findByIdAndUpdate(
      _id,
      { programName, programLevel },
      { new: true } // returns the updated document
    );

    if (!updatedProgram) {
      return res
        .status(404)
        .json({ success: false, message: "Program not found" });
    }

    res.status(200).json({
      success: true,
      message: "Program updated successfully",
      data: updatedProgram,
    });
  } catch (err) {
    console.log("Error in updating the program data", err);
    res.status(500).json({
      success: false,
      message: "Failed to update program data",
    });
  }
};

const deleteProgrameData = async (req, res) => {
  try {
    const { pgmId } = req.params;

    if (!pgmId) {
      return res
        .status(400)
        .json({ success: false, message: "Program ID is required" });
    }

    const deletedProgram = await ProgramData.findByIdAndDelete(pgmId);

    if (!deletedProgram) {
      return res
        .status(404)
        .json({ success: false, message: "Program not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Program deleted successfully" });
  } catch (err) {
    console.log("Error in deleting the program data", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getEmployeeData = async (req, res) => {
  try {
    const { empId } = req.params;

    if (!empId) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID is required" });
    }

    const employee = await Employee.findById(empId);

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employee data fetched successfully",
      data: employee,
    });
  } catch (err) {
    console.error("Error in getting employee data", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee data",
      error: err.message,
    });
  }
};

const updateEmployeeData = async (req, res) => {
  try {
    const { empId } = req.params;
    const { formData } = req.body;
    console.log("Formdata", formData);

    if (!empId) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID is required" });
    }

    const updateFields = {
      firstName: formData.firstName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      gender: formData.gender,
      department: formData.department,
      role: formData.role || "employee",
      centerName: formData.centerName,
      centerId: formData.centerId,
      modes: formData.modes, // fixed name
      status: formData.status,
      perHourRate: formData.perHourRate,
      employmentType: formData.employmentType,
    };

    // Only set password if it's provided
    if (formData.password) {
      // If you hash passwords, hash here before updating
      updateFields.password = formData.password;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      empId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employee data updated successfully",
      data: updatedEmployee,
    });
  } catch (err) {
    console.error("Error in updating employee data", err);
    res.status(500).json({
      success: false,
      message: "Failed to update employee data",
      error: err.message,
    });
  }
};

const deleteEmployeeData = async (req, res) => {
  try {
    const { empId } = req.params;
    const { status } = req.body;

    if (!empId || !status) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and status are required",
      });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      empId,
      { status },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee status updated successfully",
      data: updatedEmployee,
    });
  } catch (err) {
    console.error("Error in updating employee status", err);
    res.status(500).json({
      success: false,
      message: "Failed to update employee status",
      error: err.message,
    });
  }
};

const deleteSelectedClass = async (req, res) => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({ message: "Class ID is required" });
    }

    const classData = await ClassSchedule.findByIdAndDelete(classId);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    return res.status(200).json({ message: "Class deleted successfully" });
  } catch (err) {
    console.error("Error deleting class:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getClassDataForEdit = async (req, res) => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({ message: "Class ID is required" });
    }

    const classData = await ClassSchedule.findById(classId);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    return res
      .status(200)
      .json({ message: "Class data fetched successfully", classData });
  } catch (err) {
    console.error("Error getting class data for edit:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const updateSelectedClassData = async (req, res) => {
  try {
    console.log("Welcome to edit time table schedules");
    console.log("classId", req.params.classId);
    console.log("shedules", req.body.shedules);

    const { classId } = req.params;
    const { shedules } = req.body;

    if (!Array.isArray(shedules) || shedules.length !== 1) {
      return res
        .status(400)
        .json({ message: "Exactly one schedule must be provided in an array" });
    }

    const schedule = shedules[0];

    // Utility function for time format
    const convertTo12HourFormat = (time24) => {
      const [hour, minute] = time24.split(":");
      let hourNum = parseInt(hour);
      const ampm = hourNum >= 12 ? "PM" : "AM";
      hourNum = hourNum % 12 || 12;
      return `${hourNum}:${minute} ${ampm}`;
    };

    // Parse and validate date
    const dateParts = schedule.date.split(/[-\/]/);
    if (dateParts.length !== 3) {
      return res
        .status(400)
        .json({ message: `Invalid date format: ${schedule.date}` });
    }
    const [day, month, year] = dateParts;
    const formattedDate = new Date(`${year}-${month}-${day}`);
    const classTime = `${convertTo12HourFormat(
      schedule.fromTime
    )} - ${convertTo12HourFormat(schedule.toTime)}`;

    // Check if schedule exists for this classId, date, and time
    const existingSchedule = await ClassSchedule.findOne({
      _id: classId,
    });

    let savedSchedule;
    if (existingSchedule) {
      // Update existing
      existingSchedule.day = schedule.day;
      existingSchedule.coachName = schedule.coachName;
      existingSchedule.coachId = schedule.coachId;
      existingSchedule.program = schedule.program;
      existingSchedule.level = schedule.level;
      existingSchedule.isDemoAdded = schedule.isDemo || false;
      existingSchedule.type = schedule.mode;
      existingSchedule.centerName = schedule.centerName;
      existingSchedule.centerId = schedule.centerId;
      existingSchedule.maximumKidCount = schedule.maxKids;

      savedSchedule = await existingSchedule.save();
    }

    return res.status(200).json({
      message: "Schedule updated successfully",
      schedule: savedSchedule,
    });
  } catch (err) {
    console.error("Error updating the timetable schedules:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getAllEmployeeAttandance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Get today's attendance records
    const todaysAttendance = await attendanceModel.find({
      date: { $gte: today, $lt: tomorrow },
    });

    // Transform the attendance records into the desired structure
    const result = todaysAttendance.map((record) => ({
      employeeId: record.empId,
      name: record.empName,
      email: record.email || "N/A", // Add email in your attendance model if needed
      department: record.department,
      status: record.status.toLowerCase(), // present / late
      checkInTime: record.loginTime || null,
    }));

    res.status(200).json({
      success: true,
      message: "Today's attendance fetched successfully.",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching today's employee attendance:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance data.",
    });
  }
};

const getIndividualEmployeeAttendance = async (req, res) => {
  try {
    const { empId } = req.params;

    const empData = await Employee.findOne({ _id: empId });

    if (!empData) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const empAttendance = await attendanceModel
      .find({ empId })
      .sort({ date: -1 });

    const formattedAttendance = empAttendance.map((record) => {
      const dateObj = new Date(record.date);
      const formattedDate = dateObj.toISOString().split("T")[0];

      const login = record.loginTime || "";
      const logout = record.logoutTime || "";

      let totalHours = "0h 00m";
      let lateBy = "0h 00m";

      if (login && logout) {
        const [loginHour, loginMin, loginSec] = convertTo24Hour(login)
          .split(":")
          .map(Number);
        const [logoutHour, logoutMin, logoutSec] = convertTo24Hour(logout)
          .split(":")
          .map(Number);

        const loginDate = new Date(dateObj);
        loginDate.setHours(loginHour, loginMin, loginSec || 0);

        const logoutDate = new Date(dateObj);
        logoutDate.setHours(logoutHour, logoutMin, logoutSec || 0);

        const diffMs = logoutDate - loginDate;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        totalHours = `${hours}h ${mins}m`;

        const shiftStart = new Date(dateObj);
        shiftStart.setHours(9, 30, 0); // Shift time is 9:30 AM

        const lateMs = loginDate - shiftStart;
        if (lateMs > 0) {
          const lateHours = Math.floor(lateMs / (1000 * 60 * 60));
          const lateMinutes = Math.floor(
            (lateMs % (1000 * 60 * 60)) / (1000 * 60)
          );
          const lateSeconds = Math.floor((lateMs % (1000 * 60)) / 1000);
          lateBy = `${lateHours}h ${lateMinutes}m ${lateSeconds}s`;
        } else {
          lateBy = "0h 00m 00s"; // No late time if login is on time or before shift time
        }
      }

      return {
        date: formattedDate,
        loginTime: login,
        logoutTime: logout,
        lateBy,
        status: record.status,
        totalHours,
      };
    });

    const employeeData = {
      empId,
      name: empData.firstName || "N/A",
      department: empData.department || "N/A",
      position: empData.role || "N/A",
      profileImage: empData.profileImage || "/api/placeholder/120/120",
      attendance: formattedAttendance,
    };

    res.status(200).json(employeeData);
  } catch (err) {
    console.error("Error fetching employee data:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee data.",
    });
  }
};

function convertTo24Hour(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes, seconds] = time.split(":").map(Number);
  if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
  if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;
  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    (seconds || 0).toString().padStart(2, "0"),
  ].join(":");
}

const superAdminGetAllTaskData = async (req, res) => {
  try {
    // Fetch all tasks and populate 'assignedBy'
    const tasks = await taskModel.find().populate("assignedBy", "name email");
    console.log("Task==>", tasks);

    // Format date and time to dd/mm/yy HH:mm
    const formatDateTime = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear()).slice(-2);
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const formattedTasks = tasks.map((task) => ({
      ...task._doc, // Spread the original task document
      taskTime: formatDateTime(task.taskTime),
      createdAt: formatDateTime(task.createdAt),
      updatedAt: formatDateTime(task.updatedAt),
      assignedBy: task.assignedBy || { name: "No assigned person", email: "" }, // Keep it as an object
    }));

    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
      data: formattedTasks,
    });
  } catch (error) {
    console.error("Error fetching tasks", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks. Please try again later.",
    });
  }
};

const superAdminDeleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await taskModel.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
      data: deletedTask,
    });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete task. Please try again later.",
    });
  }
};

const superAdminGetAllLeaves = async (req, res) => {
  try {
    console.log("Welcome to fetch the leaves");
    const empLeaves = await leavesModel.find();

    if (empLeaves && empLeaves.length > 0) {
      // Format the dates before sending the response
      const formattedLeaves = empLeaves.map((leave) => ({
        ...leave._doc,
        leaveStartDate: new Date(leave.leaveStartDate).toLocaleDateString(
          "en-US"
        ),
        leaveEndDate: new Date(leave.leaveEndDate).toLocaleDateString("en-US"),
        createdAt: new Date(leave.createdAt).toLocaleDateString("en-US"),
      }));

      res.status(200).json({
        success: true,
        message: "Employee leave data fetched successfully",
        formattedLeaves,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "No leave data found for this employee",
      });
    }
  } catch (err) {
    console.error("Error in fetching my leaves", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching leave data",
      error: err.message,
    });
  }
};

const superAdminUpdateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    const updatedLeave = await leavesModel.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true } // return the updated document
    );

    if (!updatedLeave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Leave status updated successfully.",
      data: updatedLeave,
    });
  } catch (err) {
    console.error("Error updating leave status:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update leave status. Please try again later.",
    });
  }
};

const getAvailableProgramData = async (req, res) => {
  try {
    const availableProgramsData = await PhysicalCenter.find(
      {},
      { centerName: 1, programLevels: 1 }
    );
    const allPrograms = await ProgramData.find({}, { _id: 1, programName: 1 });

    const programMap = {};
    allPrograms.forEach((program) => {
      programMap[program._id.toString()] = program.programName;
    });

    const formattedData = availableProgramsData.map((center) => ({
      _id: center._id,
      centerName: center.centerName,
      programLevels: center.programLevels.map((pl) => ({
        program: programMap[pl.program.toString()] || "Unknown Program",
        levels: pl.levels,
      })),
    }));

    res.status(200).json({
      success: true,
      message: "Available program data fetched successfully.",
      data: formattedData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch available program data.",
    });
  }
};

const saveOnlineClassPackage = async (req, res) => {
  try {
    const { onlinePackage } = req.body;

    const physicalCenterData = await PhysicalCenter.find(
      { centerType: "online" },
      { _id: 1, centerName: 1 }
    );

    const programList = await ProgramData.find({}, { _id: 1, programName: 1 });

    const programMap = programList.reduce((map, program) => {
      map[program._id.toString()] = program.programName;
      return map;
    }, {});

    const centers = physicalCenterData.map((center) => ({
      centerId: center._id.toString(),
      centerName: center.centerName,
    }));

    const savedPackages = await Promise.all(
      onlinePackage.map(async (pkg) => {
        const newOnlineClass = new OnlineClass({
          packageName: `Online ${pkg.classUpTo} ${pkg.time.charAt(0).toUpperCase() + pkg.time.slice(1)
            } Classes`,
          classUpTo: Number(pkg.classUpTo),
          classStartFrom: Number(pkg.classStartFrom),
          oneClassPrice: Number(pkg.amount) / Number(pkg.classUpTo),

          amount: Number(pkg.amount),
          programName: programMap[pkg.program] || pkg.program,
          programLevel: pkg.level,
          mode: "Online",
          time: pkg.time.charAt(0).toUpperCase() + pkg.time.slice(1),
          centers,
        });

        return await newOnlineClass.save();
      })
    );

    res.status(201).json({
      message: "Online class packages saved successfully",
      data: savedPackages,
    });
  } catch (err) {
    console.error("Error in saving the online package:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const submitPhysicalCenterClassPrice = async (req, res) => {
  try {
    console.log("Welcome to offline package", req.body);

    const { offlinePackageData, applyToAll, centerId } = req.body;

    if (!Array.isArray(offlinePackageData) || offlinePackageData.length === 0) {
      return res
        .status(400)
        .json({ message: "offlinePackageData is required" });
    }

    const programDataList = await ProgramData.find();

    const getProgramNameById = (id) => {
      const program = programDataList.find(
        (p) => p._id.toString() === id.toString()
      );
      return program ? program.programName : "";
    };

    const saveOrUpdateCenterPackage = async (centerId, centerName, pkg) => {
      const { program, level, time, classStartFrom, classUpTo, amount } = pkg;

      if (
        !program ||
        !level ||
        !time ||
        isNaN(parseInt(classUpTo)) ||
        isNaN(parseFloat(amount))
      ) {
        console.error("Invalid package data:", pkg);
        return;
      }

      const parsedClassesUpTo = parseInt(classUpTo);
      const parsedClassStartFrom = parseInt(classStartFrom);

      const parsedAmount = parseFloat(amount);
      const programName = getProgramNameById(program);
      const packageName = `Offline ${parsedClassesUpTo} ${time === "day" ? "Day" : "Night"
        } Class`;

      const newEntry = {
        centerId,
        centerName,
        packageName,
        programName,
        programLevel: level,
        classUpTo: parsedClassesUpTo,
        classStartFrom: parsedClassStartFrom,
        amount: parsedAmount,
        oneClassPrice: parsedAmount / parsedClassesUpTo,

        status: "Active",
        time: time === "day" ? "Day" : "Night",
      };

      let existingPackage = await offlineclassPackage.findOne({
        mode: "Offline",
      });

      if (existingPackage) {
        console.log("Am inside the existing entry");

        // Find match based on programName instead of program id
        const matchIndex = existingPackage.centers.findIndex(
          (c) =>
            c &&
            c.centerId?.toString() == centerId.toString() &&
            c.programName == programName && // Match by programName here
            c.programLevel == level &&
            c.classUpTo == parsedClassesUpTo &&
            c.time == newEntry.time
        );

        console.log("matchIndex", matchIndex);

        if (matchIndex !== -1) {
          console.log("Updating existing entry");
          existingPackage.centers[matchIndex].amount = parsedAmount;
          existingPackage.centers[matchIndex].packageName = packageName;
        } else {
          console.log("Creating new entry");
          existingPackage.centers.push(newEntry);
        }

        await existingPackage.save();
      } else {
        console.log("Creating new offlineclassPackage document");
        const newOfflinePackage = new offlineclassPackage({
          mode: "Offline",
          centers: [newEntry],
        });

        await newOfflinePackage.save();
      }
    };

    if (applyToAll) {
      const centerList = await PhysicalCenter.find(
        { centerType: "offline" },
        { _id: 1, centerName: 1 }
      );

      for (const center of centerList) {
        for (const pkg of offlinePackageData) {
          await saveOrUpdateCenterPackage(center._id, center.centerName, pkg);
        }
      }
    } else {
      if (!centerId) {
        return res.status(400).json({ message: "Center ID is required" });
      }

      const center = await PhysicalCenter.findById(centerId);
      if (!center) {
        return res.status(404).json({ message: "Center not found" });
      }

      for (const pkg of offlinePackageData) {
        await saveOrUpdateCenterPackage(center._id, center.centerName, pkg);
      }
    }

    return res
      .status(200)
      .json({ message: "Offline package saved/updated successfully." });
  } catch (err) {
    console.error("Error in saving the offline package", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const submitHybridClassPrice = async (req, res) => {
  try {
    console.log("Welcome to saving the hybrid class package", req.body);

    const { hybridPackageData, applyToAll, centerId } = req.body;

    if (!Array.isArray(hybridPackageData) || hybridPackageData.length === 0) {
      return res.status(400).json({ message: "hybridPackageData is required" });
    }

    const programDataList = await ProgramData.find();

    const getProgramNameById = (id) => {
      const program = programDataList.find(
        (p) => p._id.toString() === id.toString()
      );
      return program ? program.programName : "";
    };

    const saveOrUpdateHybridPackage = async (centerId, centerName, pkg) => {
      const { program, level, time, upToClasses, amount, mode, classFrom } =
        pkg;

      if (
        !program ||
        !level ||
        !time ||
        !mode ||
        isNaN(parseInt(upToClasses)) ||
        isNaN(parseFloat(amount))
      ) {
        console.error("Invalid package data:", pkg);
        return;
      }

      const classNumFrom = pareseInt(classFrom);
      const parsedClasses = parseInt(upToClasses);
      const parsedAmount = parseFloat(amount);
      const oneClassPrice = parsedAmount / parsedClasses;
      const programName = getProgramNameById(program);
      const packageName = `Hybrid ${parsedClasses} ${time === "day" ? "Day" : "Night"
        } Class`;

      const newEntry = {
        centerId,
        centerName,
        packageName,
        programName,
        programLevel: level,
        upToClasses: parsedClasses,
        classFrom,
        amount: parsedAmount,
        oneClassPrice,
        time: time === "day" ? "Day" : "Night",
        status: "Active",
        mode,
      };

      let existingPackage = await hybridClassSchema.findOne({
        mode: "Hybrid",
      });

      if (existingPackage) {
        const matchIndex = existingPackage.centers.findIndex(
          (c) =>
            c &&
            c.centerId?.toString() === centerId.toString() &&
            c.programName === programName &&
            c.programLevel === level &&
            c.upToClasses === parsedClasses &&
            c.time === newEntry.time
        );

        if (matchIndex !== -1) {
          console.log("Updating existing hybrid entry");
          existingPackage.centers[matchIndex] = {
            ...existingPackage.centers[matchIndex],
            ...newEntry,
          };
        } else {
          console.log("Creating new hybrid entry");
          existingPackage.centers.push(newEntry);
        }

        await existingPackage.save();
      } else {
        const newHybridPackage = new hybridClassSchema({
          mode: "Hybrid",
          centers: [newEntry],
        });

        await newHybridPackage.save();
      }
    };

    if (applyToAll === true) {
      const centerList = await PhysicalCenter.find(
        { centerType: "offline" },
        { _id: 1, centerName: 1 }
      );

      for (const center of centerList) {
        for (const pkg of hybridPackageData) {
          await saveOrUpdateHybridPackage(center._id, center.centerName, pkg);
        }
      }
    } else {
      if (!centerId) {
        return res.status(400).json({ message: "Center ID is required" });
      }

      const center = await PhysicalCenter.findById(centerId);
      if (!center) {
        return res.status(404).json({ message: "Center not found" });
      }

      for (const pkg of hybridPackageData) {
        await saveOrUpdateHybridPackage(center._id, center.centerName, pkg);
      }
    }

    return res
      .status(200)
      .json({ message: "Hybrid package saved/updated successfully." });
  } catch (err) {
    console.error("Error in saving the hybrid package", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const submitKitPriceData = async (req, res) => {
  try {
    console.log("welcome to set the kit price data", req.body);

    const { quantity, kitPrice } = req.body;

    if (!quantity || !kitPrice) {
      return res
        .status(400)
        .json({ message: "Quantity and kit price are required" });
    }

    const newKitPrice = new KitPrice({
      quantity: Number(quantity),
      kitPrice: Number(kitPrice),
    });

    await newKitPrice.save();

    res.status(201).json({
      message: "Kit price saved successfully",
      data: newKitPrice,
    });
  } catch (err) {
    console.error("Error in setting the kit price", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editPackageData = async (req, res) => {
  try {
    console.log("Welcome to updating the package", req.body);

    const editPackage = req.body.editPackage;

    if (!editPackage) {
      return res
        .status(400)
        .json({ success: false, message: "No package data provided" });
    }

    const {
      mode,
      packageName,
      classStartFrom,
      classUpTo,
      amount,
      originalData,
      packageType,
    } = editPackage;

    if (!mode || !originalData) {
      return res
        .status(400)
        .json({ success: false, message: "Mode or original data missing" });
    }

    let Model;
    if (packageType === "Hybrid") {
      Model = hybridClassSchema;
    } else if (mode === "Online") {
      Model = OnlineClass;
    } else if (mode === "Offline") {
      Model = offlineclassPackage;
    } else {
      return res.status(400).json({ success: false, message: "Invalid mode" });
    }

    let doc;

    // 📦 Hybrid Package Update Logic
    if (packageType === "Hybrid") {
      doc = await Model.findOne({
        mode: "Hybrid",
        centers: {
          $elemMatch: {
            packageName: originalData.packageName,
            classStartFrom: originalData.classStartFrom,
            classUpTo: originalData.classUpTo,
            amount: originalData.amount,
            time: originalData.time,
            programName: originalData.programName,
            programLevel: originalData.programLevel,
            centerName: originalData.centerName,
            mode: originalData.mode, // 'online' or 'offline'
          },
        },
      });

      if (!doc) {
        return res
          .status(404)
          .json({ success: false, message: "Hybrid center not found" });
      }

      const centerToUpdate = doc.centers.find(
        (center) =>
          center.packageName === originalData.packageName &&
          center.classUpTo === originalData.classUpTo &&
          center.amount === originalData.amount &&
          center.time === originalData.time &&
          center.programName === originalData.programName &&
          center.programLevel === originalData.programLevel &&
          center.centerName === originalData.centerName &&
          center.mode === originalData.mode
      );

      if (!centerToUpdate) {
        return res
          .status(404)
          .json({ success: false, message: "Center to update not found" });
      }

      centerToUpdate.packageName = packageName;
      centerToUpdate.classUpTo = classUpTo;
      centerToUpdate.amount = amount;
      centerToUpdate.classStartFrom = classStartFrom;

      await doc.save();

      return res.json({
        success: true,
        message: "Hybrid package updated successfully",
        data: doc,
      });
    }

    // 💻 Online Package Update
    else if (mode === "Online") {
      doc = await Model.findOne({
        packageName: originalData.packageName,
        classStartFrom: originalData.classStartFrom,
        classUpTo: originalData.classUpTo,
        amount: originalData.amount,
        time: originalData.time,
        programName: originalData.programName,
        programLevel: originalData.programLevel,
        mode: "Online",
      });

      if (!doc) {
        return res
          .status(404)
          .json({ success: false, message: "Online package not found" });
      }

      doc.packageName = packageName;
      doc.classUpTo = classUpTo;
      doc.amount = amount;
      doc.classStartFrom = classStartFrom;

      await doc.save();

      return res.json({
        success: true,
        message: "Online package updated successfully",
        data: doc,
      });
    }

    // 🏫 Offline Package Update
    else if (mode === "Offline") {
      doc = await Model.findOne({
        centers: {
          $elemMatch: {
            packageName: originalData.packageName,
            classStartFrom: originalData.classStartFrom,
            classUpTo: originalData.classUpTo,
            amount: originalData.amount,
            time: originalData.time,
            programName: originalData.programName,
            programLevel: originalData.programLevel,
            centerName: originalData.centerName,
          },
        },
      });

      if (!doc) {
        return res
          .status(404)
          .json({ success: false, message: "Offline center not found" });
      }

      const centerToUpdate = doc.centers.find(
        (center) =>
          center.packageName === originalData.packageName &&
          center.classStartFrom === originalData.classStartFrom &&
          center.classUpTo === originalData.classUpTo &&
          center.amount === originalData.amount &&
          center.time === originalData.time &&
          center.programName === originalData.programName &&
          center.programLevel === originalData.programLevel &&
          center.centerName === originalData.centerName
      );

      if (!centerToUpdate) {
        return res
          .status(404)
          .json({ success: false, message: "Center to update not found" });
      }

      centerToUpdate.packageName = packageName;
      centerToUpdate.classUpTo = classUpTo;
      centerToUpdate.amount = amount;
      centerToUpdate.classStartFrom = classStartFrom;

      await doc.save();

      return res.json({
        success: true,
        message: "Offline package updated successfully",
        data: doc,
      });
    }
  } catch (err) {
    console.error("Error in updating the package:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deletePackageData = async (req, res) => {
  try {
    console.log("Welcome to delete the data", req.body);

    const deleteItems = req.body.deletePackage;

    if (!deleteItems || deleteItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data to delete" });
    }

    for (const item of deleteItems) {
      let { mode, originalData, packageType } = item;

      if (!mode || !originalData) continue;

      // Normalize mode (Online, Offline, Hybrid)
      mode = mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase();

      if (packageType === "Hybrid") {
        console.log("Am inside hybrid");
        console.log("originalData", originalData);

        const centerMode = originalData.mode.toLowerCase(); // normalize for exact match

        const result = await hybridClassSchema.updateOne(
          {
            mode: "Hybrid",
          },
          {
            $pull: {
              centers: {
                packageName: originalData.packageName,
                classUpTo: originalData.classUpTo,
                amount: originalData.amount,
                time: originalData.time,
                programName: originalData.programName,
                programLevel: originalData.programLevel,
                centerName: originalData.centerName,
                mode: centerMode,
              },
            },
          }
        );

        if (result.modifiedCount > 0) {
          console.log(
            `✅ Deleted hybrid center from '${originalData.centerName}'`
          );
        } else {
          console.log("❌ No matching hybrid center found to delete");
        }
      }

      if (mode === "Online") {
        console.log("");
        // Delete from OnlineClass collection
        await OnlineClass.findOneAndDelete({
          packageName: originalData.packageName,
          classUpTo: originalData.classUpTo,
          amount: originalData.amount,
          time: originalData.time,
          programName: originalData.programName,
          programLevel: originalData.programLevel,
          mode: "Online",
        });
      } else if (mode === "Offline") {
        // Delete from offlineclassPackage centers array
        const doc = await offlineclassPackage.findOne({
          mode: "Offline",
          centers: {
            $elemMatch: {
              packageName: originalData.packageName,
              classUpTo: originalData.classUpTo,
              amount: originalData.amount,
              time: originalData.time,
              programName: originalData.programName,
              programLevel: originalData.programLevel,
              centerName: originalData.centerName,
            },
          },
        });

        if (doc) {
          doc.centers = doc.centers.filter(
            (center) =>
              !(
                center.packageName === originalData.packageName &&
                center.classUpTo === originalData.classUpTo &&
                center.amount === originalData.amount &&
                center.time === originalData.time &&
                center.programName === originalData.programName &&
                center.programLevel === originalData.programLevel &&
                center.centerName === originalData.centerName
              )
          );
          await doc.save();
        }
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Package(s) deleted successfully" });
  } catch (err) {
    console.log("Error in deleting the data", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const sendSelectedPackageData = async (req, res) => {
  try {
    console.log("Selected package data", req.body);
    const { enqId } = req.params;
    const { packageData, empId } = req.body;

    // ✅ Validate packageData
    if (!packageData) {
      return res.status(400).json({ message: "Package data is required." });
    }

    // ✅ Get employee details
    const empData = await Employee.findOne(
      { _id: empId },
      { firstName: 1, department: 1 }
    );

    if (!empData) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // ✅ Create payment ID
    const paymentId = `PAY-${uuidv4().slice(0, 8).toUpperCase()}`;

    // ✅ Create new package payment
    const newPackage = new packagePaymentData({
      paymentId,
      enqId: packageData.enqId || enqId,
      kidName: packageData.kidName,
      kidId: packageData.kidId,
      whatsappNumber: packageData.whatsappNumber,
      programs: packageData.programs,
      classMode: packageData.classMode,
      discount: packageData.discount,
      baseAmount: packageData.baseAmount,
      totalAmount: packageData.totalAmount,
      packageId: packageData.packageId,
      selectedPackage: packageData.selectedPackage,
      onlineClasses: packageData.onlineClasses,
      offlineClasses: packageData.offlineClasses,
      centerId: packageData.centerId || null,
      centerName: packageData.centerName,
      employeeAssisted: empId,
    });

    const savedPackage = await newPackage.save();

    // ✅ Build dynamic comment
    let comment = `Package selection completed for kid: ${packageData.kidName}`;

    const online = packageData.onlineClasses;
    const offline = packageData.offlineClasses;

    const details = [];

    if (online) {
      details.push(`Online Classes: ${online}`);
    }
    if (offline) {
      details.push(`Offline Classes: ${offline}`);
    }

    if (details.length > 0) {
      comment += ` (${details.join(", ")})`;
    }

    // ✅ Log the package selection action
    await logsSchema.updateOne(
      { enqId: enqId },
      {
        $push: {
          logs: {
            employeeId: empId,
            employeeName: empData.firstName,
            department: empData.department,
            comment: comment,
            action: "Package Selection",
          },
        },
      },
      { upsert: true }
    );

    // ✅ Send response
    res.status(201).json({
      message: "Package data saved successfully.",
      paymentId,
      data: savedPackage,
    });
  } catch (err) {
    console.error("Error in saving the selected package data", err);
    res.status(500).json({
      message: "Failed to save package data.",
      error: err.message,
    });
  }
};

const getThePaymentData = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const paymentDetails = await packagePaymentData.findOne({
      paymentId: paymentId,
    });

    if (!paymentDetails) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(paymentDetails);
  } catch (err) {
    console.log("Error in getting the payment data", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updatePaymentDetails = async (req, res) => {
  try {
    const { data } = req.body;
    console.log("data", data);

    // Step 1: Get kidId and enqId from payment data
    const newData = await packagePaymentData.findOne(
      { paymentId: data.paymentId },
      { kidId: 1, enqId: 1 }
    );

    if (!newData) {
      return res
        .status(404)
        .json({ message: "No data found with given paymentId" });
    }

    // Step 2: Get contact/whatsapp number from enquiryData
    const enqData = await enquiryData.findOne(
      { _id: newData.enqId },
      { contactNumber: 1, whatsappNumber: 1 }
    );

    const oldPackage = await packagePaymentData.find({
      enqId: newData.enqId,
      isPackageActive: true,
    });

    // Step 3: Update payment data
    const updatedPackage = await packagePaymentData.findOneAndUpdate(
      { paymentId: data.paymentId },
      {
        paymentStatus: data.status,
        transactionId: data.transactionId,
        paymentMode: data.paymentMode,
        remarks: data.remarks,
        documentUrl: data.documentUrl,
        isPackageActive: true,
        isExtraPackage: oldPackage.length > 1 ? true : false,
        employeeAssisted: data.empId,
      },
      { new: true }
    );

    if (!updatedPackage) {
      return res
        .status(404)
        .json({ message: "Package not found with given paymentId" });
    }

    // Step 4: If payment is successful, update kid, enquiry, and parent data
    if (data.status === "Success") {
      await kidSchema.findOneAndUpdate(
        { _id: newData.kidId },
        { $set: { status: "Active" } }
      );

      await enquiryData.findOneAndUpdate(
        { _id: newData.enqId },
        {
          $set: {
            enquiryStatus: "Active",
            paymentStatus: "Success",
          },
        }
      );

      // Step 5: Update parentModel using either contactNumber or whatsappNumber
      const parentQuery = {
        $or: [
          { parentMobile: enqData.contactNumber },
          { parentMobile: enqData.whatsappNumber },
        ],
      };

      await parentModel.findOneAndUpdate(parentQuery, {
        $set: {
          status: "Active",
          isParentNew: false,
        },
      });
    }

    res.status(200).json({
      message: "Manual payment data stored for verification",
      updatedPackage,
    });
  } catch (err) {
    console.error("Error in updating the payment data", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getInvoiceData = async (req, res) => {
  try {
    const invoiceData = await packagePaymentData.find();

    if (!invoiceData || invoiceData.length === 0) {
      return res.status(404).json({ message: "No invoice data found" });
    }

    res.status(200).json({
      message: "Invoice data fetched successfully",
      data: invoiceData,
    });
  } catch (err) {
    console.error("Error fetching invoice data", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getThePaymentId = async (req, res) => {
  try {
    const { enqId } = req.params;

    const paymentData = await packagePaymentData.findOne(
      { enqId: enqId },
      { paymentId: 1 }
    );

    if (!paymentData) {
      return res.status(404).json({ message: "Payment data not found" });
    }

    res
      .status(200)
      .json({ message: "Payment data retrieved successfully", paymentData });
  } catch (err) {
    console.error("Error in getting the payment id", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const changeThePassword = async (req, res) => {
  try {
    console.log("Welcome to change password", req.body);

    const { currentPassword, newPassword } = req.body;
    const { empId } = req.params;

    // Fetch employee
    const empData = await Employee.findById(empId).select("password");
    console.log("empData", empData);
    if (!empData) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if old password matches
    if (empData.password != currentPassword) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update password
    empData.password = newPassword;
    await empData.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getParentTicketsData = async (req, res) => {
  try {
    const { empId } = req.params;
    const empData = await Employee.findOne(
      { _id: empId },
      { department: 1, firstName: 1 }
    );
    let ticketsData;
    if (empData.department === "operation") {
      ticketsData = await parentTicket
        .find({ tiketAssignedToDepartment: "operation" })
        .sort({ createdAt: -1 });
    } else if (empData.department === "service-delivery") {
      ticketsData = await parentTicket
        .find({ tiketAssignedToDepartment: "service-delivery" })
        .sort({ createdAt: -1 });
    } else {
      ticketsData = await parentTicket.find().sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      message: "All Parent Support Tickets",
      data: ticketsData,
    });
  } catch (err) {
    console.log("Error in getting the parent support data", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch parent support tickets",
      error: err.message || "Internal Server Error",
    });
  }
};

const reponseToTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message, empId } = req.body;

    const time = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage = {
      senderId: empId,
      message,
      time,
    };

    const updatedTicket = await parentTicket.findByIdAndUpdate(
      ticketId,
      {
        $push: { messages: newMessage },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Response added successfully",
      data: updatedTicket,
    });
  } catch (err) {
    console.error("Error in response to tickets", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateTicketPriority = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { priorityStatus } = req.body;

    console.log("Updating priority:", ticketId, priorityStatus);

    const updatedTicket = await parentTicket.findOneAndUpdate(
      { _id: ticketId },
      { $set: { priority: priorityStatus } },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json({
      message: "Ticket priority updated successfully",
      ticket: updatedTicket,
    });
  } catch (err) {
    console.error("Error updating ticket priority:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getEnquiryRelatedAllKidData = async (req, res) => {
  try {
    const { enqId } = req.params;

    const endData = await enquiryData.findOne({ _id: enqId });
    if (!endData)
      return res.status(404).json({ message: "Operation data not found" });

    const kidData = await kidSchema.findOne(
      { _id: endData.kidId },
      { kidPin: 0 }
    );
    if (!kidData) return res.status(404).json({ message: "Kid not found" });

    const parentData = await parentModel.findOne({ _id: kidData.parentId });
    if (!parentData)
      return res.status(404).json({ message: "Parent not found" });

    const classPaymentData = await packagePaymentData.find({ enqId: enqId });

    const selectedClassData = await wholeClassSchema.find({ enqId: enqId });
    const logData = await logsSchema.findOne({ enqId: enqId });

    res.status(200).json({
      success: true,
      message: "Kid data retrieved successfully",
      data: {
        operationData: endData,
        kid: kidData,
        parent: parentData,
        classPayments: classPaymentData,
        selectedClasses: selectedClassData,
        logData: logData,
      },
    });
  } catch (err) {
    console.error("Error in getting the kid data", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getSuperAdminDashboardData = async (req, res) => {
  try {
    const enqData = await enquiryData.find({ enquiryField: "enquiryList" });
    const prospectData = await enquiryData.find({
      enquiryField: "prospects",
      paymentStatus: { $ne: "Success" },
    });
    const activeKids = await enquiryData.find({
      enquiryField: "prospects",
      enquiryStatus: "Active"
    });
    const employeeData = await Employee.find();
    const physicalCenter = await PhysicalCenter.find();

    res.status(200).json({
      success: true,
      data: {
        enquiryCount: enqData.length,
        prospectCount: prospectData.length,
        activeKidsCount: activeKids.length,
        employeeCount: employeeData.length,
        physicalCenterCount: physicalCenter.length,
      },
    });
  } catch (err) {
    console.error("Error fetching Super Admin Dashboard data:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getIsDemoSheduledForKid = async (req, res) => {
  try {
    const { enqId } = req.params;

    // Find enquiry data
    const enqData = await enquiryData.findOne(
      { _id: enqId },
      { kidId: 1, kidFirstName: 1, programs: 1 }
    );

    if (!enqData) {
      return res
        .status(404)
        .json({ success: false, message: "Enquiry not found" });
    }

    // Find if demo class is scheduled
    const demoClassData = await demoClassSchema.findOne({
      kidId: enqData.kidId,
    });

    if (demoClassData) {
      return res.status(200).json({
        success: true,
        message: "Demo class is already scheduled for this kid",
        kidData: enqData,
        demoDetails: demoClassData,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "No demo class scheduled for this kid yet",
        kidData: enqData,
      });
    }
  } catch (err) {
    console.error("Error in getIsDemoSheduledForKid:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getSheduleDemoDetails = async (req, res) => {
  try {
    const { kidId } = req.params;
    console.log("welcome", kidId);

    const demoClassData = await ClassSchedule.find({ isDemoAdded: true });
    const kidData = await kidSchema.findById(kidId, { selectedProgram: 1 });

    console.log("demoClassData", demoClassData);
    console.log("kidData", kidData);

    // Sending response
    return res.status(200).json({
      success: true,
      message: "Demo class and kid details fetched successfully",
      demoClassData,
      kidData,
    });
  } catch (err) {
    console.error("Error in getting the kid schedule demo details", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch demo schedule details",
      error: err.message,
    });
  }
};

const cancelDemoClass = async (req, res) => {
  try {
    const { kidId, classId, empId } = req.params;
    console.log(kidId, classId);
    const empData = await Employee.findOne(
      { _id: empId },
      { firstName: 1, department: 1 }
    );

    // Step 1: Get kid details
    const kidDetails = await kidSchema.findById(kidId);
    if (!kidDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Kid not found." });
    }

    const existingDemo = await demoClassSchema.findOne({
      _id: classId,
    });

    // Step 3: Remove kid from scheduled class
    const classData = await ClassSchedule.findOneAndUpdate(
      { _id: existingDemo.classId },
      { $pull: { demoAssignedKid: { kidId } } },
      { new: true }
    );

    console.log("ClassData", classData);

    // Step 4: Update operation model
    const enqData = await enquiryData.findOneAndUpdate(
      { kidId },
      {
        $set: {
          "scheduleDemo.status": "Pending",
          enquiryField: "prospects",
        },
      }
    );
    await logsSchema.findByIdAndUpdate(
      enqData.logs,
      {
        $push: {
          logs: {
            employeeId: empId,
            employeeName: empData.firstName,
            department: empData.department,
            comment: `  Cancelled  demo class for the ${classData.program} program at the ${classData.level} level with coach ${classData.coachName}.`,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );
    await demoClassSchema.findOneAndDelete({
      _id: classId,
    });

    return res.status(200).json({
      success: true,
      message: "Demo class cancelled successfully.",
    });
  } catch (err) {
    console.error("Error cancelling demo class:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel demo class",
      error: err.message,
    });
  }
};

const employeeBookDemoClass = async (req, res) => {
  try {
    const { kidId } = req.params;
    const { bookingDetails, empId } = req.body;
    const empData = await Employee.findOne(
      { _id: empId },
      { firstName: 1, department: 1 }
    );

    const kidDetails = await kidSchema.findById(kidId);
    if (!kidDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Kid not found." });
    }

    const existingDemo = await demoClassSchema.findOne({ kidId });
    let savedBooking;

    const kidData = {
      kidId,
      chessKid: kidDetails.chessId || "",
      kidName: kidDetails.kidsName || "",
      status: "Scheduled",
      sheduleId: bookingDetails.classId,
      sheduledDate: bookingDetails.date,
    };

    if (existingDemo) {
      const previousClassId = existingDemo.classId;

      // Check if class has changed
      if (previousClassId !== bookingDetails.classId) {
        // Remove kid from old class schedule
        await ClassSchedule.updateOne(
          { _id: previousClassId },
          { $pull: { demoAssignedKid: { kidId } } }
        );

        // Add to new class schedule
        await ClassSchedule.updateOne(
          { _id: bookingDetails.classId },
          { $push: { demoAssignedKid: kidData } }
        );
      }

      // Update existing demo class
      existingDemo.classId = bookingDetails.classId;
      existingDemo.program = bookingDetails.program;
      existingDemo.level = bookingDetails.level;
      existingDemo.date = bookingDetails.date;
      existingDemo.time = bookingDetails.time;
      existingDemo.coachName = bookingDetails.coachName;
      existingDemo.type = bookingDetails.type;
      existingDemo.centerName = bookingDetails.centerName || null;
      existingDemo.centerId = bookingDetails.centerId || null;

      savedBooking = await existingDemo.save();

      // Update OperationDept program & demo status
      const enqData = await enquiryData.findOneAndUpdate(
        { kidId },
        {
          $set: {
            "scheduleDemo.status": "Scheduled",
            "programs.0.program": bookingDetails.program,
            "programs.0.level": bookingDetails.level,
            enquiryField: "prospects",
          },
        }
      );

      await logsSchema.findByIdAndUpdate(
        enqData.logs,
        {
          $push: {
            logs: {
              employeeId: empId,
              employeeName: empData.firstName,
              department: empData.department,
              comment: `  Updated  demo class for the ${bookingDetails.program} program at the ${bookingDetails.level} level with coach ${bookingDetails.coachName}.`,
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      );

      // Update Kid model selectedProgram
      await kidSchema.findByIdAndUpdate(kidId, {
        $set: {
          "selectedProgram.0.program": bookingDetails.program,
          "selectedProgram.0.level": bookingDetails.level,
        },
      });
    } else {
      // No existing demo — create new
      const newBooking = new demoClassSchema({
        classId: bookingDetails.classId,
        program: bookingDetails.program,
        level: bookingDetails.level,
        date: bookingDetails.date,
        time: bookingDetails.time,
        coachName: bookingDetails.coachName,
        type: bookingDetails.type,
        centerName: bookingDetails.centerName || null,
        centerId: bookingDetails.centerId || null,
        kidId,
      });

      savedBooking = await newBooking.save();

      // Add kid to demoAssignedKid in class schedule
      await ClassSchedule.updateOne(
        { _id: bookingDetails.classId },
        { $push: { demoAssignedKid: kidData } }
      );

      // Update OperationDept (replace first program)
      const enqData = await enquiryData.findOneAndUpdate(
        { kidId },
        {
          $set: {
            "scheduleDemo.status": "Scheduled",
            "programs.0.program": bookingDetails.program,
            "programs.0.level": bookingDetails.level,
            enquiryField: "prospects",
          },
        },
        { upsert: true }
      );

      await logsSchema.findByIdAndUpdate(
        enqData.logs,
        {
          $push: {
            logs: {
              employeeId: empId,
              employeeName: empData.firstName,
              department: empData.department,
              comment: `  Sheduled  demo class for the ${bookingDetails.program} program at the ${bookingDetails.level} level with coach ${bookingDetails.coachName}.`,
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      );

      // Update kid model
      await kidSchema.findByIdAndUpdate(
        kidId,
        {
          $set: {
            "selectedProgram.0.program": bookingDetails.program,
            "selectedProgram.0.level": bookingDetails.level,
          },
        },
        { new: true }
      );
    }

    return res.status(201).json({
      success: true,
      message: existingDemo
        ? "Demo class updated successfully!"
        : "Demo class booked successfully!",
      data: savedBooking,
    });
  } catch (err) {
    console.error("Error in saving the demo bookings", err);
    return res.status(500).json({
      success: false,
      message: "Failed to save demo class booking",
      error: err.message,
    });
  }
};

const superAdminGetConductedClassDetails = async (req, res) => {
  try {
    const conductedClasses = await ConductedClass.find();
    console.log("conductedClasses", conductedClasses);

    // Fetch all class schedules in one query for efficient mapping
    const classScheduleMap = {};
    const classSchedules = await ClassSchedule.find(
      {},
      { _id: 1, coachName: 1, program: 1, level: 1 }
    );
    console.log("classSchedules", classSchedules);

    // Create a map of classId to schedule data
    classSchedules.forEach((schedule) => {
      classScheduleMap[schedule._id.toString()] = {
        coachName: schedule.coachName,
        program: schedule.program,
        level: schedule.level,
      };
    });

    // Merge class schedule data into each conducted class
    const enrichedClasses = conductedClasses.map((classItem) => {
      const classIdStr = classItem.classId?.toString();
      const scheduleInfo = classScheduleMap[classIdStr] || {};

      return {
        ...classItem._doc,
        coachName: scheduleInfo.coachName || "N/A",
        program: scheduleInfo.program || "N/A",
        level: scheduleInfo.level || "N/A",
      };
    });

    return res.status(200).json({
      success: true,
      data: enrichedClasses,
    });
  } catch (err) {
    console.error("Error in superAdminGetConductedClassDetails:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch conducted classes",
      error: err.message,
    });
  }
};

const getMyDetailedAttendance = async (req, res) => {
  try {
    const { empId } = req.params;
    const myAttendance = await attendanceModel.find({ empId });

    if (!myAttendance || myAttendance.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found for this employee.",
      });
    }

    return res.status(200).json({
      success: true,
      data: myAttendance,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const toInt = (val) => parseInt(val || 0, 10);

const getChessRfidCount = async (req, res) => {
  try {
    let page = 0;
    let hasNext = true;
    let kidCount = 0;
    const pageStats = [];

    while (hasNext) {
      const { data: xml } = await axios.get(
        `https://www.chesskid.com/groups/rss/11E7FD5D12F7014280004A78600200C0/3MHqxsgC/7?page=${page}`
      );

      const parsed = await xml2js.parseStringPromise(xml, {
        explicitArray: false,
      });

      if (!parsed?.kids?.kid) break;

      let kids = parsed.kids.kid;
      if (!Array.isArray(kids)) kids = [kids];

      const docs = kids.map((kid) => {
        kidCount++;

        return {
          username: kid.username,
          userId: toInt(kid.userId),
          firstName: kid.firstName || "",
          lastName: kid.lastName || "",
          level: kid.level || "",
          slowChessRating: toInt(kid.slowChessRating),
          blitzRating: toInt(kid.blitzRating),
          puzzleRating: toInt(kid.puzzleRating),
          rssUrl: kid.rssUrl || "",
          dateRecorded: new Date(), // ✅ track when this record was inserted
          last7days: {
            slowChessStats: {
              wins: toInt(kid.last7days?.slowChessStats?.wins),
              draws: toInt(kid.last7days?.slowChessStats?.draws),
              losses: toInt(kid.last7days?.slowChessStats?.losses),
              ratingChange: toInt(kid.last7days?.slowChessStats?.ratingChange),
            },
            blitzStats: {
              wins: toInt(kid.last7days?.blitzStats?.wins),
              draws: toInt(kid.last7days?.blitzStats?.draws),
              losses: toInt(kid.last7days?.blitzStats?.losses),
              ratingChange: toInt(kid.last7days?.blitzStats?.ratingChange),
            },
            puzzleStats: {
              correct: toInt(kid.last7days?.puzzleStats?.correct),
              attempted: toInt(kid.last7days?.puzzleStats?.attempted),
              ratingChange: toInt(kid.last7days?.puzzleStats?.ratingChange),
            },
            lessonCount: toInt(kid.last7days?.lessonCount),
            workoutCount: toInt(kid.last7days?.workoutCount),
            articleCount: toInt(kid.last7days?.articleCount),
            videoCount: toInt(kid.last7days?.videoCount),
            trophyCount: toInt(kid.last7days?.trophyCount),
          },
          alltime: {
            slowChessStats: {
              wins: toInt(kid.alltime?.slowChessStats?.wins),
              draws: toInt(kid.alltime?.slowChessStats?.draws),
              losses: toInt(kid.alltime?.slowChessStats?.losses),
              ratingChange: toInt(kid.alltime?.slowChessStats?.ratingChange),
            },
            blitzStats: {
              wins: toInt(kid.alltime?.blitzStats?.wins),
              draws: toInt(kid.alltime?.blitzStats?.draws),
              losses: toInt(kid.alltime?.blitzStats?.losses),
              ratingChange: toInt(kid.alltime?.blitzStats?.ratingChange),
            },
            puzzleStats: {
              correct: toInt(kid.alltime?.puzzleStats?.correct),
              attempted: toInt(kid.alltime?.puzzleStats?.attempted),
              ratingChange: toInt(kid.alltime?.puzzleStats?.ratingChange),
            },
            lessonCount: toInt(kid.alltime?.lessonCount),
            workoutCount: toInt(kid.alltime?.workoutCount),
            articleCount: toInt(kid.alltime?.articleCount),
            videoCount: toInt(kid.alltime?.videoCount),
            trophyCount: toInt(kid.alltime?.trophyCount),
          },
        };
      });

      if (docs.length > 0) {
        await ChessKidPlaying.insertMany(docs); // ✅ always inserts
      }

      pageStats.push({
        page,
        kidsInPage: kids.length,
        totalSoFar: kidCount,
      });

      console.log(
        `Page ${page} processed: ${kids.length} kids, total so far: ${kidCount}`
      );

      hasNext = Boolean(parsed?.kids?.next);
      if (hasNext) page++;
    }

    res.status(200).json({
      success: true,
      message: "ChessKid data inserted (new records)",
      totalKidsProcessed: kidCount,
      totalPages: pageStats.length,
      pages: pageStats,
    });
  } catch (err) {
    console.error("Error in ChessKid insert", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllPaidPackageData = async (req, res) => {
  try {
    const { enqId } = req.params;
    const paymentData = await packagePaymentData.find({ enqId: enqId });

    if (!paymentData || paymentData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No payment data found for this enquiry ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment data retrieved successfully",
      data: paymentData,
    });
  } catch (err) {
    console.error("Error fetching paid package data:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching payment data",
      error: err.message,
    });
  }
};

const updatePackageData = async (req, res) => {
  try {
    const { enqId } = req.params;
    const { packageUpdate } = req.body;

    if (!packageUpdate || !packageUpdate._id) {
      return res.status(400).json({
        success: false,
        message: "Package _id is required for update",
      });
    }

    // Update the package
    const updatedPackage = await packagePaymentData.findOneAndUpdate(
      { _id: packageUpdate._id, enqId }, // match by both _id and enqId for safety
      { $set: packageUpdate }, // overwrite fields with incoming data
      { new: true } // return the updated document
    );

    if (!updatedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: updatedPackage,
    });
  } catch (err) {
    console.error("Error in updating the package", err);
    res.status(500).json({
      success: false,
      message: "Error in updating the package",
      error: err.message,
    });
  }
};

const getPhysicalCenterDetails = async (req, res) => {
  try {
    const physicalCenters = await PhysicalCenter.find(
      {},
      { centerName: 1, address: 1, centerType: 1 }
    ).lean();

    return res.status(200).json({
      success: true,
      data: physicalCenters,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching physical center details",
    });
  }
};

const getKidForInvoiceGeneration = async (req, res) => {
  try {
    const kidData = await enquiryData.find(
      {},
      {
        kidFirstName: 1,
        parentFirstName: 1,
        contactNumber: 1,
        kidId: 1,
        whatsappNumber: 1,
        programs: 1,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Kid data fetched successfully",
      data: kidData,
    });
  } catch (err) {
    console.error("Error fetching kid data:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching kid data",
    });
  }
};

const getLatestKids = async (req, res) => {
  try {
    const limit = 50;

    // First, get distinct usernames and count
    const usernames = await ChessKidPlaying.distinct("username", {
      username: { $ne: null, $exists: true }
    });
    const totalKids = usernames.length;

    // Then get the latest record for each username
    const latestRecords = await Promise.all(
      usernames.map(username =>
        ChessKidPlaying.findOne({ username })
          .sort({ createdAt: -1 })
          .lean()
          .exec()
      )
    );

    // Filter out any nulls and sort by rating
    const sortedKids = latestRecords
      .filter(record => record !== null)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);

    res.status(200).json({
      success: true,
      count: sortedKids.length,
      total: totalKids,  // Total number of distinct kids
      data: sortedKids,
    });
  } catch (err) {
    console.error("Error in getLatestKids:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: err.message
    });
  }
};




const getChessKidPerformanceData = async (req, res) => {
  try {
    const { chessKidId } = req.params;

    const kidPerformanceData = await ChessKidPlaying.find({
      username: chessKidId,
    });
    console.log("kidPerformanceData", kidPerformanceData);

    if (!kidPerformanceData || kidPerformanceData.length === 0) {
      return res
        .status(404)
        .json({ message: "No performance data found for this ChessKid" });
    }

    res.status(200).json({ data: kidPerformanceData });
  } catch (err) {
    console.error("Error in getting the chesskid performance data", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getChessKidPerformanceData,
  getLatestKids,
  getKidForInvoiceGeneration,
  getPhysicalCenterDetails,
  updatePackageData,
  getAllPaidPackageData,
  getChessRfidCount,
  getMyDetailedAttendance,
  superAdminGetConductedClassDetails,
  employeeBookDemoClass,
  cancelDemoClass,
  getSheduleDemoDetails,
  getIsDemoSheduledForKid,
  getSuperAdminDashboardData,
  getEnquiryRelatedAllKidData,
  updateTicketPriority,
  reponseToTicket,
  getParentTicketsData,
  changeThePassword,
  getThePaymentId,
  getInvoiceData,
  getAllProgrameDataTable,
  updatePaymentDetails,
  getThePaymentData,
  sendSelectedPackageData,
  deleteTheVoucherData,
  getTheVoucherData,
  deletePackageData,
  editPackageData,
  submitKitPriceData,
  submitHybridClassPrice,
  submitPhysicalCenterClassPrice,
  saveOnlineClassPackage,
  getIndividualEmployeeAttendance,
  getAvailableProgramData,
  superAdminUpdateLeaveStatus,
  superAdminGetAllLeaves,
  superAdminDeleteTask,
  superAdminGetAllTaskData,
  getAllEmployeeAttandance,
  updateSelectedClassData,
  getClassDataForEdit,
  deleteSelectedClass,
  getPhysicalCenterTimings,
  deleteEmployeeData,
  updateEmployeeData,
  getEmployeeData,
  deletePhysicalCenterData,
  updatePhysicalCenterData,
  deleteProgrameData,
  updateProgrameData,
  getAllProgrameData,
  addNewProgrammeData,
  getAllParentData,
  getAllPackageData,
  addNewPackageData,
  getIndividualPhysicalCenterData,
  getPhysicalCenterData,
  savePhysicalCenterData,
  getAllVouchers,
  updateTheVoucherData,
  addNewVoucher,
  insertPackage,
  createUser,
  deleteExpense,
  deleteTransaction,
  updateTransaction,
  getTransactionById,
  getTransactions,
  createTransaction,
  updateExpense,
  getExpenseById,
  getExpenses,
  createExpense,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUserByName,
  createEmployee,
  updateEmployee,
  getEmployeeById,
  deleteEmployee,
  getAllEmployees,
  deleteTournament,
  updateTournament,
  getTournamentById,
  getTournaments,
  createTournament,
  getNotifications,
  createNotification,
  getNotificationById,
  updateNotification,
  deleteNotification,
  createAllowanceDeduction,
  getAllowanceDeductions,
  deleteHoliday,
  updateHoliday,
  getHolidayById,
  createHoliday,
  getAllHolidays,
  deleteAllowanceDeduction,
  updateAllowanceDeduction,
  getAllowanceDeductionById,
  createChat,
  getAllChats,
  getChatByTicketId,
  updateChat,
  deleteChat,
  getAllEmployeesByName,
  getAllEmployeesByName,
};
