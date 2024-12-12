import { Button, Divider, MenuItem, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ExpensesForm = () => {
  const [expenseDetails, setExpenseDetails] = useState([{ id: 1, category: '', description: '', amount: '', date: '' }]);
  const expenseCategories = ['Travel', 'Food', 'Utilities', 'Others']; // Options for the category field
  const [loading, setLoading] = useState(false);

  const addExpenseDetail = () => {
    setExpenseDetails([
      ...expenseDetails,
      { id: expenseDetails.length + 1, category: '', description: '', amount: '', date: '' }
    ]);
  };

  const removeExpenseDetail = (id) => {
    setExpenseDetails(expenseDetails.filter((expense) => expense.id !== id));
  };

  const handleExpenseChange = (id, field, value) => {
    const updatedExpenseDetails = expenseDetails.map((expense) =>
      expense.id === id ? { ...expense, [field]: value } : expense
    );
    setExpenseDetails(updatedExpenseDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (let expense of expenseDetails) {
        if (expense.category && expense.description && expense.amount && expense.date) {
          const expenseData = {
            category: expense.category,
            description: expense.description,
            amount: expense.amount,
            date: expense.date,
          };

          // Create new expense (mock submission)
          console.log("Submitted Expense: ", expenseData);
        }
      }

      setExpenseDetails([{ id: 1, category: '', description: '', amount: '', date: '' }]);
      alert("Expenses submitted successfully!");
    } catch (error) {
      alert("Error while submitting expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'category', headerName: 'Category', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'amount', headerName: 'Amount', width: 150 },
    { field: 'date', headerName: 'Date', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <button
          type="button"
          onClick={() => removeExpenseDetail(params.row.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash className="h-5 w-5" />
        </button>
      )
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Expense Form</h2>
                        <p className="text-sm opacity-90">Please fill in the details for holidays</p>
                    </div>
                    <Button
                        variant="contained"
                        color="#642b8f"
                        component={Link}
                        to="/expenses"
                    >
                        View Expenses
                    </Button>
                </div>


        <form className="p-8" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#642b8f]">
              Expense Details
            </h3>
            {expenseDetails.map((expense, index) => (
              <div key={expense.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#642b8f]">Expense {index + 1}</label>
                  {expenseDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExpenseDetail(expense.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    select
                    label="Category"
                    value={expense.category}
                    onChange={(e) => handleExpenseChange(expense.id, 'category', e.target.value)}
                    fullWidth
                  >
                    {expenseCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Amount"
                    variant="outlined"
                    value={expense.amount}
                    onChange={(e) => handleExpenseChange(expense.id, 'amount', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    type="date"
                    label="Date"
                    variant="outlined"
                    value={expense.date}
                    onChange={(e) => handleExpenseChange(expense.id, 'date', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <TextField
                    label="Description"
                    variant="outlined"
                    value={expense.description}
                    onChange={(e) => handleExpenseChange(expense.id, 'description', e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addExpenseDetail}
              className="text-[#642b8f] hover:text-[#642b8f] font-medium text-sm transition-colors"
            >
              + Add Expense
            </button>
          </div>

          <Divider className="my-6" />

          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={expenseDetails}
              columns={columns}
              pageSize={5}
              disableSelectionOnClick
              checkboxSelection
            />
          </div>

          <div className="flex justify-center gap-6 mt-12">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#642b8f] transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? 'Submitting...' : 'Submit Expenses'}
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

export default ExpensesForm;




















const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login />} // A page without the layout
        />
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/allow-deduct" element={<AllowDeductTable />} />
                <Route path="/another-page" element={<AnotherPage />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};
