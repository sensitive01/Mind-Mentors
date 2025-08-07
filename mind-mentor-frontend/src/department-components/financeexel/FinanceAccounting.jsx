import React, { useState, useEffect } from "react";
import {
  Plus,
  Eye,
  CheckCircle,
  DollarSign,
  Calendar,
  User,
  Building,
  CreditCard,
} from "lucide-react";

const FinanceAccounting = () => {
  const [currentView, setCurrentView] = useState("employee"); // 'employee' or 'admin'
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: "2025-01-15",
      refNo: "EXP001",
      particular: "Travel Expenses",
      remarks: "Client meeting in Mumbai",
      invoiceAmount: 5000,
      gst: 900,
      totalAmount: 5900,
      tds: 0,
      payableAmount: 5900,
      paidAmount: 2950,
      balanceAmount: 2950,
      bankAccount: "HDFC Bank",
      paymentMode: "NEFT",
      employeeName: "Rajesh Kumar",
      employeeId: "EMP001",
      status: "Partially Paid",
      payments: [
        {
          date: "2025-01-20",
          amount: 2950,
          mode: "NEFT",
          bank: "HDFC Bank",
          remarks: "First installment",
        },
      ],
    },
  ]);

  const [newExpense, setNewExpense] = useState({
    date: "",
    particular: "",
    remarks: "",
    invoiceAmount: "",
    gst: "",
    employeeName: "",
    employeeId: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    expenseId: null,
    amount: "",
    paymentMode: "NEFT",
    bankAccount: "HDFC Bank",
    remarks: "",
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const employees = [
    { id: "EMP001", name: "Rajesh Kumar" },
    { id: "EMP002", name: "Priya Sharma" },
    { id: "EMP003", name: "Amit Patel" },
    { id: "EMP004", name: "Sneha Singh" },
  ];

  const bankAccounts = ["HDFC Bank", "Axis Bank", "ICICI Bank", "SBI"];
  const paymentModes = ["NEFT", "RTGS", "Cash", "Cheque", "UPI"];

  const calculateAmounts = (invoiceAmount, gst) => {
    const invoice = parseFloat(invoiceAmount) || 0;
    const gstAmount = parseFloat(gst) || 0;
    const totalAmount = invoice + gstAmount;
    const tds = totalAmount * 0.01; // 1% TDS example
    const payableAmount = totalAmount - tds;

    return {
      totalAmount: totalAmount.toFixed(2),
      tds: tds.toFixed(2),
      payableAmount: payableAmount.toFixed(2),
    };
  };

  const handleSubmitExpense = () => {
    if (
      !newExpense.date ||
      !newExpense.employeeId ||
      !newExpense.particular ||
      !newExpense.invoiceAmount ||
      !newExpense.gst
    ) {
      alert("Please fill all required fields");
      return;
    }
    const amounts = calculateAmounts(newExpense.invoiceAmount, newExpense.gst);
    const expense = {
      id: expenses.length + 1,
      refNo: `EXP${String(expenses.length + 1).padStart(3, "0")}`,
      ...newExpense,
      invoiceAmount: parseFloat(newExpense.invoiceAmount),
      gst: parseFloat(newExpense.gst),
      totalAmount: parseFloat(amounts.totalAmount),
      tds: parseFloat(amounts.tds),
      payableAmount: parseFloat(amounts.payableAmount),
      paidAmount: 0,
      balanceAmount: parseFloat(amounts.payableAmount),
      status: "Pending",
      payments: [],
    };

    setExpenses([...expenses, expense]);
    setNewExpense({
      date: "",
      particular: "",
      remarks: "",
      invoiceAmount: "",
      gst: "",
      employeeName: "",
      employeeId: "",
    });
    alert("Expense submitted successfully!");
  };

  const handleMakePayment = (expenseId) => {
    const expense = expenses.find((exp) => exp.id === expenseId);
    setPaymentForm({
      expenseId,
      amount: expense.balanceAmount.toString(),
      paymentMode: "NEFT",
      bankAccount: "HDFC Bank",
      remarks: "",
    });
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    if (!paymentForm.amount) {
      alert("Please enter payment amount");
      return;
    }
    const paymentAmount = parseFloat(paymentForm.amount);

    setExpenses(
      expenses.map((expense) => {
        if (expense.id === paymentForm.expenseId) {
          const newPaidAmount = expense.paidAmount + paymentAmount;
          const newBalanceAmount = expense.payableAmount - newPaidAmount;
          const newPayment = {
            date: new Date().toISOString().split("T")[0],
            amount: paymentAmount,
            mode: paymentForm.paymentMode,
            bank: paymentForm.bankAccount,
            remarks: paymentForm.remarks,
          };

          return {
            ...expense,
            paidAmount: newPaidAmount,
            balanceAmount: newBalanceAmount,
            bankAccount: paymentForm.bankAccount,
            paymentMode: paymentForm.paymentMode,
            status: newBalanceAmount <= 0.01 ? "Fully Paid" : "Partially Paid",
            payments: [...expense.payments, newPayment],
          };
        }
        return expense;
      })
    );

    setShowPaymentModal(false);
    alert("Payment processed successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Franchise Mind Mentorz - Expense Management
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView("employee")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentView === "employee"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Employee View
              </button>
              <button
                onClick={() => setCurrentView("admin")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentView === "admin"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Building className="w-4 h-4 inline mr-2" />
                Admin Panel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employee View */}
      {currentView === "employee" && (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Submit New Expense
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, date: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee
                  </label>
                  <select
                    value={newExpense.employeeId}
                    onChange={(e) => {
                      const emp = employees.find(
                        (emp) => emp.id === e.target.value
                      );
                      setNewExpense({
                        ...newExpense,
                        employeeId: e.target.value,
                        employeeName: emp ? emp.name : "",
                      });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Particular
                  </label>
                  <input
                    type="text"
                    value={newExpense.particular}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        particular: e.target.value,
                      })
                    }
                    placeholder="e.g., Travel Expenses, Office Supplies"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.invoiceAmount}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        invoiceAmount: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.gst}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, gst: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                    value={newExpense.remarks}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, remarks: e.target.value })
                    }
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Amount Preview */}
              {newExpense.invoiceAmount && newExpense.gst && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Amount Calculation Preview:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      Total: ₹
                      {
                        calculateAmounts(
                          newExpense.invoiceAmount,
                          newExpense.gst
                        ).totalAmount
                      }
                    </div>
                    <div>
                      TDS (1%): ₹
                      {
                        calculateAmounts(
                          newExpense.invoiceAmount,
                          newExpense.gst
                        ).tds
                      }
                    </div>
                    <div className="font-medium">
                      Payable: ₹
                      {
                        calculateAmounts(
                          newExpense.invoiceAmount,
                          newExpense.gst
                        ).payableAmount
                      }
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmitExpense}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Submit Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin View */}
      {currentView === "admin" && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Admin - Expense Management Dashboard
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ref No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Particular
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payable Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {expense.date}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {expense.refNo}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            {expense.employeeName}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {expense.employeeId}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {expense.particular}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ₹{expense.payableAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        ₹{expense.paidAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <span
                          className={
                            expense.balanceAmount > 0
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          ₹{expense.balanceAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            expense.status === "Fully Paid"
                              ? "bg-green-100 text-green-800"
                              : expense.status === "Partially Paid"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {expense.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          {expense.balanceAmount > 0 && (
                            <button
                              onClick={() => handleMakePayment(expense.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 flex items-center"
                            >
                              <DollarSign className="w-3 h-3 mr-1" />
                              Pay
                            </button>
                          )}
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Process Payment</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentForm.paymentMode}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentMode: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {paymentModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Account
                </label>
                <select
                  value={paymentForm.bankAccount}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      bankAccount: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {bankAccounts.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Remarks
                </label>
                <textarea
                  value={paymentForm.remarks}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, remarks: e.target.value })
                  }
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={processPayment}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium"
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Process Payment
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceAccounting;
