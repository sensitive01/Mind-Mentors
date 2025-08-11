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

userRoute.put('/change-the-employee-password/:empId',userController.changeThePassword);


userRoute.get('/get-rfid-count-chess',userController.getChessRfidCount);
userRoute.get('/get-chess-kid-playing-data-table',userController.getLatestKids);
userRoute.get('/get-chess-kid-performance-data/:chessKidId',userController.getChessKidPerformanceData);






userRoute.post('/add-new-tournament-data',  userController.createTournament);
userRoute.get('/tournaments',  userController.getTournaments);
userRoute.get('/tournaments/:id',  userController.getTournamentById);
userRoute.put('/update-tournaments-data/:tournamentId',  userController.updateTournament);
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
userRoute.post('/edit-package-data', userController.editPackageData);
userRoute.put('/delete-package-data', userController.deletePackageData);

userRoute.post('/send-selected-package-data/:enqId', userController.sendSelectedPackageData);
userRoute.get('/get-payment-details/:paymentId', userController.getThePaymentData);
userRoute.post('/update-payment-details', userController.updatePaymentDetails);
userRoute.get('/get-Payment-id/:enqId', userController.getThePaymentId);


userRoute.get('/get-parent-tickets-data/:empId', userController.getParentTicketsData);
userRoute.put("/response-to-ticket/:ticketId", userController.reponseToTicket);
userRoute.put("/update-ticket-priority/:ticketId", userController.updateTicketPriority);

userRoute.get("/get-my-detailed-attandance/:empId", userController.getMyDetailedAttendance);
userRoute.get(
  "/get-all-paid-package-data/:enqId",
  userController.getAllPaidPackageData
);







userRoute.put("/update-paid-package-data/:enqId", userController.updatePackageData);
userRoute.get("/get-physical-center-data", userController.getPhysicalCenterDetails);
userRoute.get(
  "/get-kid-for-invoice-generation",
  userController.getKidForInvoiceGeneration
);








userRoute.get('/get-voucher-data/:voucherId', userController.getTheVoucherData);
userRoute.put('/update-voucher-data/:voucherId', userController.updateTheVoucherData);
userRoute.delete('/delete-voucher-data/:voucherId', userController.deleteTheVoucherData);



userRoute.get('/get-all-vouchers', userController.getAllVouchers);
userRoute.post('/add-new-voucher', userController.addNewVoucher);


userRoute.get('/get-physcical-center-data', userController.getPhysicalCenterData);
userRoute.get('/get-physcial-center-timings', userController.getPhysicalCenterTimings);
userRoute.get('/get-individual-physcical-center-data/:centerId', userController.getIndividualPhysicalCenterData);
userRoute.post('/save-physcical-center-data', userController.savePhysicalCenterData);
userRoute.put('/update-individual-physcical-center-data/:centerId', userController.updatePhysicalCenterData);
userRoute.delete('/delete-physcical-center-data/:centerId', userController.deletePhysicalCenterData);





userRoute.get('/get-all-parent-data', userController.getAllParentData);

userRoute.get('/get-programme-data-table', userController.getAllProgrameDataTable);


userRoute.get('/get-programme-data', userController.getAllProgrameData);
userRoute.get('/get-available-programme-data', userController.getAvailableProgramData);


userRoute.post('/add-new-programme', userController.addNewProgrammeData);
userRoute.put('/update-programData', userController.updateProgrameData);
userRoute.delete('/delete-programData/:pgmId', userController.deleteProgrameData);


userRoute.get('/get-selected-class-data/:classId', userController.getClassDataForEdit);
userRoute.put('/update-selected-class-data/:classId', userController.updateSelectedClassData);
userRoute.delete('/delete-selected-class-data/:classId', userController.deleteSelectedClass);

userRoute.get('/get-all-employee-attandance', userController.getAllEmployeeAttandance);
userRoute.get('/super-admin-get-individial-employee-attandance/:empId', userController.getIndividualEmployeeAttendance);


userRoute.get('/get-all-task-data', userController.superAdminGetAllTaskData);
userRoute.delete('/super-admin-delete-task/:taskId', userController.superAdminDeleteTask);

userRoute.get('/super-admin-get-all-leaves', userController.superAdminGetAllLeaves);
userRoute.put('/super-admin-update-leave-status/:leaveId', userController.superAdminUpdateLeaveStatus);

userRoute.post('/save-online-package-data', userController.saveOnlineClassPackage);
userRoute.post('/save-offline-package-data', userController.submitPhysicalCenterClassPrice);
userRoute.post('/save-hybrid-package-data', userController.submitHybridClassPrice);
userRoute.post('/save-kit-price-data', userController.submitKitPriceData);


userRoute.get(
  "/get-super-admin-dashboard-data",
  userController.getSuperAdminDashboardData
);




userRoute.get('/get-invoice-data', userController.getInvoiceData);
userRoute.get(
  "/get-enquiry-related-all-kid-data/:enqId",
  userController.getEnquiryRelatedAllKidData
);

userRoute.get(
  "/get-is-demo-sheduled/:enqId/:isDemoSheduled",
  userController.getIsDemoSheduledForKid
);

userRoute.get(
  "/get-is-demo-sheduled-for-kid/:kidId",
  userController.getSheduleDemoDetails
);

userRoute.delete(
  "/cancel-demo-sheduled-for-kid/:classId/:kidId/:empId",
  userController.cancelDemoClass
);

userRoute.post(
  "/book-demo-class-data/:kidId",
  userController.employeeBookDemoClass
);

userRoute.get(
  "/get-conducted-class-details",
  userController.superAdminGetConductedClassDetails
);





















module.exports = userRoute;