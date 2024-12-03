// import { Button, Divider, MenuItem, TextField } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import { Trash } from 'lucide-react';
// import { useState } from 'react';
// import { Link } from 'react-router-dom'; // Import Link for navigation
// import { createEnquiry, updateEnquiry } from '../../../api/service/employee/EmployeeService';

// const EmployeeLeaveForm = () => {
//   const [leaveDetails, setLeaveDetails] = useState([{ id: 1, employeeName: '', leaveType: '', leaveStartDate: '', leaveEndDate: '' }]);
//   const leaveTypes = ['Sick Leave', 'Casual Leave', 'Paid Leave', 'Unpaid Leave'];

//   const addLeaveDetail = () => {
//     setLeaveDetails([
//       ...leaveDetails,
//       { id: leaveDetails.length + 1, employeeName: '', leaveType: '', leaveStartDate: '', leaveEndDate: '' }
//     ]);
//   };

//   const removeLeaveDetail = (id) => {
//     setLeaveDetails(leaveDetails.filter((leave) => leave.id !== id));
//   };

//   const handleLeaveChange = (id, field, value) => {
//     const updatedLeaveDetails = leaveDetails.map((leave) =>
//       leave.id === id ? { ...leave, [field]: value } : leave
//     );
//     setLeaveDetails(updatedLeaveDetails);
//   };

//   const columns = [
//     { field: 'id', headerName: 'ID', width: 70 },
//     { field: 'employeeName', headerName: 'Employee Name', width: 200 },
//     { field: 'leaveType', headerName: 'Leave Type', width: 150 },
//     { field: 'leaveStartDate', headerName: 'Leave Start Date', width: 150 },
//     { field: 'leaveEndDate', headerName: 'Leave End Date', width: 150 },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       width: 100,
//       renderCell: (params) => (
//         <button
//           onClick={() => removeLeaveDetail(params.row.id)}
//           className="text-red-500 hover:text-red-700"
//         >
//           <Trash className="h-5 w-5" />
//         </button>
//       )
//     }
//   ];

//   return (
//     <div className="min-h-screen p-6">
//       <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
//       <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
//   <div>
//     <h2 className="text-3xl font-bold mb-2">Employee Leave Form</h2>
//     <p className="text-sm opacity-90">Please fill in the details for your leave request</p>
//   </div>
//   <Button
//     variant="contained"
//     color="#642b8f"
//     component={Link}
//     to="/employee-operation/leaves/" 
//     >
//        View Leaves
//   </Button>
// </div>


//         <form className="p-8">
//           <div className="space-y-8">
//             <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
//               Leave Details
//             </h3>
//             {leaveDetails.map((leave, index) => (
//               <div key={leave.id} className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <label className="text-sm font-medium text-[#642b8f]">Leave {index + 1}</label>
//                   {leaveDetails.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeLeaveDetail(leave.id)}
//                       className="text-red-500 hover:text-red-700 transition-colors"
//                     >
//                       <Trash className="h-5 w-5" />
//                     </button>
//                   )}
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <TextField
//                     label="Employee Name"
//                     variant="outlined"
//                     value={leave.employeeName}
//                     onChange={(e) => handleLeaveChange(leave.id, 'employeeName', e.target.value)}
//                     fullWidth
//                   />
//                   <TextField
//                     select
//                     label="Leave Type"
//                     value={leave.leaveType}
//                     onChange={(e) => handleLeaveChange(leave.id, 'leaveType', e.target.value)}
//                     fullWidth
//                   >
//                     {leaveTypes.map((type) => (
//                       <MenuItem key={type} value={type}>
//                         {type}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                   <TextField
//                     type="date"
//                     label="Leave Start Date"
//                     variant="outlined"
//                     value={leave.leaveStartDate}
//                     onChange={(e) => handleLeaveChange(leave.id, 'leaveStartDate', e.target.value)}
//                     fullWidth
//                     InputLabelProps={{ shrink: true }}
//                   />
//                   <TextField
//                     type="date"
//                     label="Leave End Date"
//                     variant="outlined"
//                     value={leave.leaveEndDate}
//                     onChange={(e) => handleLeaveChange(leave.id, 'leaveEndDate', e.target.value)}
//                     fullWidth
//                     InputLabelProps={{ shrink: true }}
//                   />
//                 </div>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={addLeaveDetail}
//               className="text-[#642b8f] hover:text-[#aa88be] font-medium text-sm transition-colors"
//             >
//               + Add Leave
//             </button>
//           </div>

//           <Divider className="my-6" />

//           {/* Data Table to display leave details */}
//           <div style={{ height: 400, width: '100%' }}>
//             <DataGrid
//               rows={leaveDetails}
//               columns={columns}
//               pageSize={5}
//               disableSelectionOnClick
//               checkboxSelection
//             />
//           </div>

//           <div className="flex justify-center gap-6 mt-12">
//             <button
//               type="submit"
//               className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
//             >
//               Submit Leave Request
//             </button>
//             <button
//               type="reset"
//               className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
//             >
//               Reset Form
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EmployeeLeaveForm;

import { Button, Divider, MenuItem, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createLeave } from '../../api/service/employee/EmployeeService';

const EmployeeLeaveForm = () => {
  const [leaveDetails, setLeaveDetails] = useState([{ id: 1, employeeName: '', leaveType: '', leaveStartDate: '', leaveEndDate: '' }]);
  const leaveTypes = ['Sick Leave', 'Casual Leave', 'Paid Leave', 'Unpaid Leave'];
  const [loading, setLoading] = useState(false);

  const addLeaveDetail = () => {
    setLeaveDetails([
      ...leaveDetails,
      { id: leaveDetails.length + 1, employeeName: '', leaveType: '', leaveStartDate: '', leaveEndDate: '' }
    ]);
  };

  const removeLeaveDetail = (id) => {
    setLeaveDetails(leaveDetails.filter((leave) => leave.id !== id));
  };

  const handleLeaveChange = (id, field, value) => {
    const updatedLeaveDetails = leaveDetails.map((leave) =>
      leave.id === id ? { ...leave, [field]: value } : leave
    );
    setLeaveDetails(updatedLeaveDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (let leave of leaveDetails) {
        // Only process non-empty leave details
        if (leave.employeeName && leave.leaveType && leave.leaveStartDate && leave.leaveEndDate) {
          const leaveData = {
            employeeName: leave.employeeName,
            leaveType: leave.leaveType,
            leaveStartDate: leave.leaveStartDate,
            leaveEndDate: leave.leaveEndDate
          };

          // Create new leave (no update logic)
          await createLeave(leaveData);
        }
      }

      // Reset leave details after submission
      setLeaveDetails([{ id: 1, employeeName: '', leaveType: '', leaveStartDate: '', leaveEndDate: '' }]);
      alert("Leave details submitted successfully!");
    } catch (error) {
      alert("Error while submitting leave details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'employeeName', headerName: 'Employee Name', width: 200 },
    { field: 'leaveType', headerName: 'Leave Type', width: 150 },
    { field: 'leaveStartDate', headerName: 'Leave Start Date', width: 150 },
    { field: 'leaveEndDate', headerName: 'Leave End Date', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <button
          type="button"
          onClick={() => removeLeaveDetail(params.row.id)}
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
            <h2 className="text-3xl font-bold mb-2">Employee Leave Form</h2>
            <p className=" text-sm opacity-90">Please fill in the details for your leave request</p>
          </div>
          <Button
            variant="contained"
            color="#642b8f"
            component={Link}
            to="/employee-operation/leaves/"
          >
            View Leaves
          </Button>
        </div>

        <form className="p-8" onSubmit={handleSubmit}>
          <div class ="space-y-8">
            <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
              Leave Details
            </h3>
            {leaveDetails.map((leave, index) => (
              <div key={leave.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#642b8f]">Leave {index + 1}</label>
                  {leaveDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLeaveDetail(leave.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    label="Employee Name"
                    variant="outlined"
                    value={leave.employeeName}
                    onChange={(e) => handleLeaveChange(leave.id, 'employeeName', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    select
                    label="Leave Type"
                    value={leave.leaveType}
                    onChange={(e) => handleLeaveChange(leave.id, 'leaveType', e.target.value)}
                    fullWidth
                  >
                    {leaveTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    type="date"
                    label="Leave Start Date"
                    variant="outlined"
                    value={leave.leaveStartDate}
                    onChange={(e) => handleLeaveChange(leave.id, 'leaveStartDate', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    type="date"
                    label="Leave End Date"
                    variant="outlined"
                    value={leave.leaveEndDate}
                    onChange={(e) => handleLeaveChange(leave.id, 'leaveEndDate', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addLeaveDetail}
              className="text-[#642b8f] hover:text-[#aa88be] font-medium text-sm transition-colors"
            >
              + Add Leave
            </button>
          </div>

          <Divider className="my-6" />

          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={leaveDetails}
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
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? 'Submitting...' : 'Submit Leave Request'}
            </button>
            <button
              type="reset"
              className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLeaveForm;