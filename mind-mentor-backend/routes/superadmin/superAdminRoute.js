const express = require('express');
const userRoute = express.Router();
const userController = require('../../controller/user/userController'); 

userRoute.get('/users', userController.getAllUser);
userRoute.post('/users', userController.createUser ); 
userRoute.put('/user/:id', userController.updateUser );
userRoute.delete('/user/:id', userController.deleteUser );
userRoute.get('/user/:id', userController.getUserById ); 
userRoute.get('/employeesbyname', userController.getAllEmployeesByName );
userRoute.get('/usersbyname', userController.getAllUserByName );

userRoute.get('/get-users', userController.getAllUser);
userRoute.post('/employee', userController.createEmployee ); 
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

userRoute.post('/allowance-deductions', userController.createAllowanceDeduction);
userRoute.get('/allowance-deductions',userController.getAllowanceDeductions);
userRoute.get('/allowance-deductions/:id', userController.getAllowanceDeductionById);
userRoute.put('/allowance-deductions/:id', userController.updateAllowanceDeduction);
userRoute.delete('/allowance-deductions/:id', userController.deleteAllowanceDeduction);

userRoute.post('/expenses', userController.createExpense);
userRoute.get('/expenses', userController.getExpenses);
userRoute.get('/expenses/:id', userController.getExpenseById);
userRoute.put('/expenses/:id', userController.updateExpense);
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

userRoute.get('/get-all-vouchers', userController.getAllVouchers);
userRoute.post('/add-new-voucher', userController.addNewVoucher);






module.exports = userRoute;