import { Button, Divider, MenuItem, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const TransactionsForm = () => {
  const [transactionDetails, setTransactionDetails] = useState([
    {
      id: 1,
      transactionId: "",
      employeeName: "",
      transactionType: "",
      amount: "",
      status: "",
      date: "",
    },
  ]);

  const transactionTypes = ["Credit", "Debit"];
  const statusOptions = ["Pending", "Completed", "Failed"];
  const [loading, setLoading] = useState(false);

  const addTransactionDetail = () => {
    setTransactionDetails([
      ...transactionDetails,
      {
        id: transactionDetails.length + 1,
        transactionId: "",
        employeeName: "",
        transactionType: "",
        amount: "",
        status: "",
        date: "",
      },
    ]);
  };

  const removeTransactionDetail = (id) => {
    setTransactionDetails(
      transactionDetails.filter((transaction) => transaction.id !== id)
    );
  };

  const handleTransactionChange = (id, field, value) => {
    const updatedTransactionDetails = transactionDetails.map((transaction) =>
      transaction.id === id ? { ...transaction, [field]: value } : transaction
    );
    setTransactionDetails(updatedTransactionDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (let transaction of transactionDetails) {
        if (
          transaction.transactionId &&
          transaction.employeeName &&
          transaction.transactionType &&
          transaction.amount &&
          transaction.status &&
          transaction.date
        ) {
          const transactionData = {
            transactionId: transaction.transactionId,
            employeeName: transaction.employeeName,
            transactionType: transaction.transactionType,
            amount: transaction.amount,
            status: transaction.status,
            date: transaction.date,
          };

          // Create new transaction (mock submission)
          console.log("Submitted Transaction: ", transactionData);
        }
      }

      setTransactionDetails([
        {
          id: 1,
          transactionId: "",
          employeeName: "",
          transactionType: "",
          amount: "",
          status: "",
          date: "",
        },
      ]);
      alert("Transactions submitted successfully!");
    } catch (error) {
      alert("Error while submitting transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "transactionId", headerName: "Transaction ID", width: 150 },
    { field: "employeeName", headerName: "Employee Name", width: 200 },
    { field: "transactionType", headerName: "Transaction Type", width: 150 },
    { field: "amount", headerName: "Amount", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "date", headerName: "Date", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <button
          type="button"
          onClick={() => removeTransactionDetail(params.row.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash className="h-5 w-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Transaction Form</h2>
            <p className="text-sm opacity-90">
              Please fill in the transaction details
            </p>
          </div>
          <Button
            variant="contained"
            color="#642b8f"
            component={Link}
            to="/transactions"
          >
            View Transactions
          </Button>
        </div>

        <form className="p-8" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#642b8f]">
              Transaction Details
            </h3>
            {transactionDetails.map((transaction, index) => (
              <div key={transaction.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#642b8f]">
                    Transaction {index + 1}
                  </label>
                  {transactionDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTransactionDetail(transaction.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    label="Transaction ID"
                    value={transaction.transactionId}
                    onChange={(e) =>
                      handleTransactionChange(
                        transaction.id,
                        "transactionId",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                  <TextField
                    label="Employee Name"
                    value={transaction.employeeName}
                    onChange={(e) =>
                      handleTransactionChange(
                        transaction.id,
                        "employeeName",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                  <TextField
                    select
                    label="Transaction Type"
                    value={transaction.transactionType}
                    onChange={(e) =>
                      handleTransactionChange(
                        transaction.id,
                        "transactionType",
                        e.target.value
                      )
                    }
                    fullWidth
                  >
                    {transactionTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Amount"
                    value={transaction.amount}
                    onChange={(e) =>
                      handleTransactionChange(
                        transaction.id,
                        "amount",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                  <TextField
                    select
                    label="Status"
                    value={transaction.status}
                    onChange={(e) =>
                      handleTransactionChange(
                        transaction.id,
                        "status",
                        e.target.value
                      )
                    }
                    fullWidth
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    type="date"
                    label="Date"
                    value={transaction.date}
                    onChange={(e) =>
                      handleTransactionChange(
                        transaction.id,
                        "date",
                        e.target.value
                      )
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addTransactionDetail}
              className="text-[#642b8f] hover:text-[#642b8f] font-medium text-sm transition-colors"
            >
              + Add Transaction
            </button>
          </div>

          <Divider className="my-6" />

          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={transactionDetails}
              columns={columns}
              pageSize={5}
              disableSelectionOnClick
            />
          </div>

          <div className="flex justify-center gap-6 mt-12">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#642b8f] transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? "Submitting..." : "Submit Transactions"}
            </button>
            <button
              type="reset"
              className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#e0f2fe] transition-colors"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionsForm;
