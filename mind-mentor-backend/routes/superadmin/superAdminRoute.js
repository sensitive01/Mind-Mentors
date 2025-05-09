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


userRoute.get('/get-employee-data/:empId',userController.getEmployeeData);
userRoute.put('/update-employee-data/:empId',userController.updateEmployeeData);
userRoute.put('/delete-employee-data/:empId',userController.deleteEmployeeData);





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
userRoute.post('/add-new-package-data', userController.addNewPackageData);
userRoute.get('/get-package-data', userController.getAllPackageData);



userRoute.get('/get-all-vouchers', userController.getAllVouchers);
userRoute.post('/add-new-voucher', userController.addNewVoucher);


userRoute.get('/get-physcical-center-data', userController.getPhysicalCenterData);
userRoute.get('/get-physcial-center-timings', userController.getPhysicalCenterTimings);
userRoute.get('/get-individual-physcical-center-data/:centerId', userController.getIndividualPhysicalCenterData);
userRoute.post('/save-physcical-center-data', userController.savePhysicalCenterData);
userRoute.put('/update-individual-physcical-center-data/:centerId', userController.updatePhysicalCenterData);
userRoute.delete('/delete-physcical-center-data/:centerId', userController.deletePhysicalCenterData);





userRoute.get('/get-all-parent-data', userController.getAllParentData);


userRoute.get('/get-programme-data', userController.getAllProgrameData);
userRoute.post('/add-new-programme', userController.addNewProgrammeData);
userRoute.put('/update-programData', userController.updateProgrameData);
userRoute.delete('/delete-programData/:pgmId', userController.deleteProgrameData);


userRoute.get('/get-selected-class-data/:classId', userController.getClassDataForEdit);
userRoute.put('/update-selected-class-data/:classId', userController.updateSelectedClassData);
userRoute.delete('/delete-selected-class-data/:classId', userController.deleteSelectedClass);

userRoute.get('/get-all-employee-attandance', userController.getAllEmployeeAttandance);

userRoute.get('/get-all-task-data', userController.superAdminGetAllTaskData);
userRoute.delete('/super-admin-delete-task/:taskId', userController.superAdminDeleteTask);


















module.exports = userRoute;