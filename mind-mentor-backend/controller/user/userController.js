const express = require("express");
const multer = require("multer");
const User = require("../../model/userModel"); // Adjust the path as necessary
const Employee = require("../../model/employeeModel");
const app = express();
const upload = multer(); // You can configure storage options if needed
const bcrypt = require("bcryptjs");
const {
  Tournament,
  Notification,
  Holiday,
  AllowanceDeduction,
  Expense,
  Transaction,
  Chat,
} = require("../../model/tournamentsModel");

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

// Create a new tournament
const createTournament = async (req, res) => {
  try {
    const tournament = new Tournament(req.body);
    await tournament.save();
    console.log(req.body);
    res.status(201).json(tournament);
  } catch (error) {
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

// Update a tournament by ID
const updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!tournament)
      return res.status(404).json({ error: "Tournament not found" });
    res.status(200).json(tournament);
  } catch (error) {
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

// Create a new holiday
const createHoliday = async (req, res) => {
  try {
    const { holidayName, startDate, endDate, description, status } = req.body;
    const newHoliday = new Holiday({
      holidayName,
      startDate,
      endDate,
      description,
      status,
    });
    await newHoliday.save();
    res.status(201).json(newHoliday);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all holidays
const getAllHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find();
    res.status(200).json(holidays);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get a holiday by ID
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

// Update a holiday by ID
const updateHoliday = async (req, res) => {
  try {
    const { holidayName, startDate, endDate, description, status } = req.body;
    const updatedHoliday = await Holiday.findByIdAndUpdate(
      req.params.id,
      { holidayName, startDate, endDate, description, status },
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

// Delete a holiday by ID
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

    res
      .status(200)
      .json({
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
    const { category, message, attachment, status } = req.body;

    const newChat = new Chat({
      category,
      message,
      attachment,
      status,
    });

    await newChat.save();
    res.status(201).json({
      message: "Chat created successfully",
      newChat,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all chat messages
const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find();
    res.status(200).json({
      message: "Chats retrieved successfully",
      chats,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get a specific chat message by ID
const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({
      message: "Chat retrieved successfully",
      chat,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update a chat message
const updateChat = async (req, res) => {
  try {
    const { category, message, attachment, status } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      req.params.id,
      { category, message, attachment, status },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({
      message: "Chat updated successfully",
      updatedChat,
    });
  } catch (error) {
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


module.exports = {
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
  getChatById,
  updateChat,
  deleteChat,
};