const express = require("express");
const multer = require("multer");
const User = require("../../model/userModel"); // Adjust the path as necessary
const Employee = require("../../model/employeeModel");
const packagesData = require("../../controller/centeradmin/package");
const Package = require("../../model/packageDetails");
const app = express();
const upload = multer(); // You can configure storage options if needed
const bcrypt = require("bcryptjs");
const Voucher = require("../../model/discount_voucher/voucherModel");
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
    const {formData} = req.body
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

module.exports = {
  getAllVouchers,
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
};
