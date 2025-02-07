const express = require('express');
const userRoute = express.Router();
const userController = require('../../controller/user/userController'); // Adjust the path as necessary

// User CRUD Operations
userRoute.post('/users', userController.createUser ); // Create a new user
userRoute.get('/users', userController.getAllUser); // Get all users
// userRoute.get('/users/:id', userController.getUserById); // Get a user by ID
userRoute.put('/user/:id', userController.updateUser ); // Update a user by ID
userRoute.delete('/user/:id', userController.deleteUser ); // Delete a user by ID
userRoute.get('/user/:id', userController.getUserById ); // Update a user by ID
userRoute.get('/employeesbyname', userController.getAllEmployeesByName ); // Create a new user


userRoute.get('/usersbyname', userController.getAllUserByName ); // Create a new user

userRoute.get('/get-users', userController.getAllUser);
 // Get all users
userRoute.post('/employee', userController.createEmployee ); // Create a new user
userRoute.get('/employees', userController.getAllEmployees);
userRoute.get('/employees/:id', userController.getEmployeeById);
userRoute.put('/employees/:id', userController.updateEmployee);
userRoute.delete('/employees/:id',userController.deleteEmployee);

userRoute.post('/tournaments',  userController.createTournament);
userRoute.get('/tournaments',  userController.getTournaments);
userRoute.get('/tournaments/:id',  userController.getTournamentById);
userRoute.put('/tournaments/:id',  userController.updateTournament);
userRoute.delete('/tournaments/:id',  userController.deleteTournament);


userRoute.get('/notifications', userController.getNotifications);
userRoute.post('/notifications', userController.createNotification);
userRoute.get('/notifications/:id', userController.getNotificationById);
userRoute.put('/notifications/:id',userController.updateNotification);
userRoute.delete('/notifications/:id', userController.deleteNotification);

userRoute.post('/holidays',  userController.createHoliday);
userRoute.get('/holidays',  userController.getAllHolidays);
userRoute.get('/holidays/:id',  userController.getHolidayById);
userRoute.put('/holidays/:id',  userController.updateHoliday);
userRoute.delete('/holidays/:id',  userController.deleteHoliday);

 // Create new allowance/deduction
userRoute.post('/allowance-deductions', userController.createAllowanceDeduction);

// Get all allowance/deduction records
userRoute.get('/allowance-deductions',userController.getAllowanceDeductions);

// Get single allowance/deduction by ID
userRoute.get('/allowance-deductions/:id', userController.getAllowanceDeductionById);

// Update allowance/deduction by ID
userRoute.put('/allowance-deductions/:id', userController.updateAllowanceDeduction);

// Delete allowance/deduction by ID
userRoute.delete('/allowance-deductions/:id', userController.deleteAllowanceDeduction);

// Create new expense
userRoute.post('/expenses', userController.createExpense);

// Get all expenses
userRoute.get('/expenses', userController.getExpenses);

// Get single expense by ID
userRoute.get('/expenses/:id', userController.getExpenseById);

// Update expense by ID
userRoute.put('/expenses/:id', userController.updateExpense);

// Delete expense by ID
userRoute.delete('/expenses/:id',userController.deleteExpense);

userRoute.post('/transactions', userController.createTransaction);
userRoute.get('/transactions', userController.getTransactions);
userRoute.get('/transactions/:id',userController.getTransactionById);
userRoute.put('/transactions/:id', userController.updateTransaction);
userRoute.delete('/transactions/:id', userController.deleteTransaction);


userRoute.post('/chats', userController.createChat);
userRoute.get('/chats', userController.getAllChats);
userRoute.get('/chats/:ticketId',userController.getChatByTicketId);
userRoute.put("/chats/ticket/:ticketId", userController.updateChat);
userRoute.delete('/chats/:id', userController.deleteChat);



userRoute.post('/package', userController.insertPackage);




module.exports = userRoute;