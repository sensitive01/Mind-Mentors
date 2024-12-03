// import React, { useState } from "react";

// const Enquiries = () => {
//   const initialData = [
//     {
//       rollNo: 8,
//       name: "Sowmya Technologies",
//       age: 14,
//       registeredDate: "09-Nov-2024",
//       lastInteractionTime: "26-Sep-2024 23:54:48",
//       lastInteractedWith: "",
//       leadSource: "Untagged",
//       programs: "",
//       stageTag: "Demo Interest",
//       parentEmail: "aswinraj07@example.com",
//       enrolledCenter: "",
//       allotedCenter: "",
//       country: "India",
//       status: "Warm",
//       notes: "",
//     },
//     {
//       rollNo: 7,
//       name: "John Doe",
//       age: 32,
//       registeredDate: "10-Nov-2024",
//       lastInteractionTime: "11-Nov-2024 15:20:10",
//       lastInteractedWith: "Support",
//       leadSource: "Referral",
//       programs: "Math",
//       stageTag: "Enrolled",
//       parentEmail: "johndoe@example.com",
//       enrolledCenter: "ABC Center",
//       allotedCenter: "XYZ Center",
//       country: "India",
//       status: "Active",
//       notes: "",
//     },
//     // More data entries...
//   ];

//   const [tableData, setTableData] = useState(initialData);
//   const [modalVisible, setModalVisible] = useState(false); // Modal visibility for row details
//   const [addNoteModalVisible, setAddNoteModalVisible] = useState(false); // Modal visibility for adding notes
//   const [selectedRow, setSelectedRow] = useState(); // Selected row details
//   const [noteDetails, setNoteDetails] = useState({
//     stageTag: "",
//     noteTo: "",
//     noteText: "",
//   });

//   const [selectedRows, setSelectedRows] = useState([]); // Track selected rows

//   const toggleSelectRow = (rollNo) => {
//     setSelectedRows((prevSelectedRows) =>
//       prevSelectedRows.includes(rollNo)
//         ? prevSelectedRows.filter((row) => row !== rollNo)
//         : [...prevSelectedRows, rollNo]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (selectedRows.length === tableData.length>0) {
//       setSelectedRows([]); // Deselect all if all are selected
//     } else {
//       setSelectedRows(tableData.map((row) => row.rollNo)); // Select all rows
//     }
//   };

//   const toggleSelectWarm = () => {
//     const warmRows = warmData
//       .filter((row) => row.status === "Warm")
//       .map((row) => row.rollNo);
//     setSelectedRows((prevSelectedRows) => {
//       // If all warm rows are selected, deselect them, otherwise select them
//       const areAllSelected = warmRows.every((row) =>
//         prevSelectedRows.includes(row)
//       );
//       return areAllSelected
//         ? prevSelectedRows.filter((row) => !warmRows.includes(row))
//         : [...prevSelectedRows, ...warmRows];
//     });
//   };

//   const toggleSelectCold = () => {
//     const coldRows = coldData
//       .filter((row) => row.status === "Cold")
//       .map((row) => row.rollNo);
//     setSelectedRows((prevSelectedRows) => {
//       // If all cold rows are selected, deselect them, otherwise select them
//       const areAllSelected = coldRows.every((row) =>
//         prevSelectedRows.includes(row)
//       );
//       return areAllSelected
//         ? prevSelectedRows.filter((row) => !coldRows.includes(row))
//         : [...prevSelectedRows, ...coldRows];
//     });
//   };

//   const openModal = (row) => {
//     setSelectedRow(row);
//     setModalVisible(true); // Show modal with row details
//   };

//   const closeModal = () => {
//     setModalVisible(false); // Close modal
//     setSelectedRow(null); // Clear selected row
//   };

//   const openAddNoteModal = (e, row) => {
//     e.stopPropagation(); // Prevent the row modal from opening
//     setSelectedRow(row);
//     setAddNoteModalVisible(true); // Open modal to add notes
//   };

//   const closeAddNoteModal = () => {
//     setAddNoteModalVisible(false); // Close the add note modal
//     setNoteDetails({ stageTag: "", noteTo: "", noteText: "" }); // Clear input values
//   };

//   const handleSubmitNote = () => {
//     const updatedData = [...tableData];
//     const rowIndex = updatedData.findIndex(
//       (row) => row.rollNo === selectedRow.rollNo
//     );
//     if (rowIndex > -1) {
//       updatedData[rowIndex].notes = noteDetails.noteText;
//     }
//     setTableData(updatedData);
//     closeAddNoteModal();
//   };

//   const handleResetNote = () => {
//     setNoteDetails({ stageTag: "", noteTo: "", noteText: "" }); // Reset the note fields
//   };

//   const headers = [
//     "",
//     "Roll No",
//     "Photograph",
//     "Name",
//     "Age",
//     "Registered Date",
//     "Last Interaction Time",
//     "Last Interacted With",
//     "Lead Source",
//     "Programs",
//     "Stage Tag",
//     "Parent Email",
//     "Enrolled Center",
//     "Alloted Center",
//     "Country",
//     "Notes",
//   ];

//   // Default rows under "Warm" and "Cold"
//   const warmData = [
//     {
//       rollNo: 9,
//       name: "Alex Green",
//       age: 28,
//       registeredDate: "15-Nov-2024",
//       lastInteractionTime: "10-Nov-2024 14:30:00",
//       lastInteractedWith: "John",
//       leadSource: "Website",
//       programs: "Python",
//       stageTag: "Warm",
//       parentEmail: "alex.green@example.com",
//       enrolledCenter: "XYZ Center",
//       allotedCenter: "ABC Center",
//       country: "India",
//       status: "Warm",
//       notes: "",
//     },
//     {
//       rollNo: 10,
//       name: "Emily Carter",
//       age: 22,
//       registeredDate: "12-Nov-2024",
//       lastInteractionTime: "14-Nov-2024 09:00:00",
//       lastInteractedWith: "Sarah",
//       leadSource: "Ad Campaign",
//       programs: "JavaScript",
//       stageTag: "Warm",
//       parentEmail: "emily.carter@example.com",
//       enrolledCenter: "",
//       allotedCenter: "",
//       country: "India",
//       status: "Warm",
//       notes: "",
//     },
//   ];

//   const coldData = [
//     {
//       rollNo: 11,
//       name: "David Smith",
//       age: 35,
//       registeredDate: "16-Nov-2024",
//       lastInteractionTime: "15-Nov-2024 10:45:00",
//       lastInteractedWith: "Support",
//       leadSource: "Referral",
//       programs: "ReactJS",
//       stageTag: "Cold",
//       parentEmail: "david.smith@example.com",
//       enrolledCenter: "",
//       allotedCenter: "",
//       country: "India",
//       status: "Cold",
//       notes: "",
//     },
//     {
//       rollNo: 12,
//       name: "Sophia Brown",
//       age: 29,
//       registeredDate: "20-Nov-2024",
//       lastInteractionTime: "19-Nov-2024 13:00:00",
//       lastInteractedWith: "Manager",
//       leadSource: "Social Media",
//       programs: "Node.js",
//       stageTag: "Cold",
//       parentEmail: "sophia.brown@example.com",
//       enrolledCenter: "ABC Center",
//       allotedCenter: "",
//       country: "India",
//       status: "Cold",
//       notes: "",
//     },
//   ];

//   return (
//     <div className="overflow-x-auto">
//       <div className="flex justify-between items-center py-4">
//         <h2 className="text-xl font-semibold">Enquiries</h2>
//       </div>

//       <table className="min-w-full border border-gray-200 bg-white">
//         <thead className="bg-white">
//           <tr>
//             {/* kkbox for selecting all rows */}
//             <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={selectedRows.length === initialData.length}
//                 onChange={toggleSelectAll}
//               />
//             </th>
//             {headers.slice(1).map((header, index) => (
//               <th
//                 key={index}
//                 className="px-4 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer relative whitespace-nowrap"
//               >
//                 <span>{header}</span>
//               </th>
//             ))}
//           </tr>
//           {/* Warm Row with Checkbox */}
//           <tr>
//             <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={warmData
//                   .filter((row) => row.status === "Warm")
//                   .every((row) => selectedRows.includes(row.rollNo))}
//                 onChange={toggleSelectWarm}
//               />
//             </th>
//             <th
//               colSpan={16}
//               className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
//             >
//               Warm
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {/* Display Warm Rows */}
//           {warmData.map((row, rowIndex) => (
//             <tr
//               key={rowIndex}
//               className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
//               onClick={(e) => {
//                 // Prevent modal from opening if the checkbox is clicked
//                 if (e.target.type !== "checkbox") {
//                   openModal(row);
//                 }
//               }}
//             >
//               {/* Checkbox for selecting individual rows */}
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 <input
//                   type="checkbox"
//                   checked={selectedRows.includes(row.rollNo)}
//                   onChange={() => toggleSelectRow(row.rollNo)}
//                 />
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.rollNo}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.photograph || "N/A"}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.name}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.age}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.registeredDate}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.lastInteractionTime}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.lastInteractedWith}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.leadSource}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.programs}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.stageTag}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.parentEmail}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.enrolledCenter}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.allotedCenter}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.country}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.notes || (
//                   <button
//                     className="text-blue-500 underline"
//                     onClick={(e) => openAddNoteModal(e, row)}
//                   >
//                     Add Note
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//           {/* Cold Row with Checkbox */}
//           <tr>
//             <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={coldData
//                   .filter((row) => row.status === "Cold")
//                   .every((row) => selectedRows.includes(row.rollNo))}
//                 onChange={toggleSelectCold}
//               />
//             </th>
//             <th
//               colSpan={16}
//               className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
//             >
//               Cold
//             </th>
//           </tr>
//           {/* Display Cold Rows */}
//           {coldData.map((row, rowIndex) => (
//             <tr
//               key={rowIndex}
//               className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
//               onClick={(e) => {
//                 // Prevent modal from opening if the checkbox is clicked
//                 if (e.target.type !== "checkbox") {
//                   openModal(row);
//                 }
//               }}
//             >
//               {/* Checkbox for selecting individual rows */}
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 <input
//                   type="checkbox"
//                   checked={selectedRows.includes(row.rollNo)}
//                   onChange={() => toggleSelectRow(row.rollNo)}
//                 />
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.rollNo}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.photograph || "N/A"}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.name}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.age}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.registeredDate}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.lastInteractionTime}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.lastInteractedWith}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.leadSource}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.programs}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.stageTag}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.parentEmail}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.enrolledCenter}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.allotedCenter}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.country}
//               </td>
//               <td className="px-4 py-2 text-sm text-gray-700 border">
//                 {row.notes || (
//                   <button
//                     className="text-blue-500 underline"
//                     onClick={(e) => openAddNoteModal(e, row)}
//                   >
//                     Add Note
//                   </button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal for row details */}
//       {modalVisible && selectedRow && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-end items-start z-50">
//           <div className="bg-white w-[400px] h-full overflow-hidden rounded-l-lg relative">
//             <button
//               className="absolute top-4 right-4 text-2xl font-bold text-gray-500"
//               onClick={closeModal}
//             >
//               &times;
//             </button>
//             <div className="p-6 overflow-y-auto h-full">
//               <h3 className="text-xl font-semibold mb-6">
//                 Details of {selectedRow.name}
//               </h3>
//               <div className="space-y-4">
//                 <div>
//                   <strong>Roll No:</strong> {selectedRow.rollNo}
//                 </div>
//                 <div>
//                   <strong>Name:</strong> {selectedRow.name}
//                 </div>
//                 <div>
//                   <strong>Age:</strong> {selectedRow.age}
//                 </div>
//                 <div>
//                   <strong>Registered Date:</strong> {selectedRow.registeredDate}
//                 </div>
//                 <div>
//                   <strong>Last Interaction:</strong>{" "}
//                   {selectedRow.lastInteractionTime}
//                 </div>
//                 <div>
//                   <strong>Last Interacted With:</strong>{" "}
//                   {selectedRow.lastInteractedWith || "N/A"}
//                 </div>
//                 <div>
//                   <strong>Lead Source:</strong> {selectedRow.leadSource}
//                 </div>
//                 <div>
//                   <strong>Programs:</strong> {selectedRow.programs || "N/A"}
//                 </div>
//                 <div>
//                   <strong>Stage Tag:</strong> {selectedRow.stageTag}
//                 </div>
//                 <div>
//                   <strong>Parent Email:</strong> {selectedRow.parentEmail}
//                 </div>
//                 <div>
//                   <strong>Enrolled Center:</strong>{" "}
//                   {selectedRow.enrolledCenter || "N/A"}
//                 </div>
//                 <div>
//                   <strong>Alloted Center:</strong>{" "}
//                   {selectedRow.allotedCenter || "N/A"}
//                 </div>
//                 <div>
//                   <strong>Country:</strong> {selectedRow.country}
//                 </div>
//                 <div>
//                   <strong>Status:</strong> {selectedRow.status}
//                 </div>
//                 <div>
//                   <strong>Notes:</strong>{" "}
//                   {selectedRow.notes || "No notes added"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal for adding notes */}
//       {addNoteModalVisible && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg max-w-sm w-full">
//             <h3 className="text-lg font-semibold">
//               Add Note for {selectedRow?.name}
//             </h3>

//             {/* Enquiry Stage Tag */}
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Enquiry Stage Tag*
//               </label>
//               <input
//                 type="text"
//                 value={noteDetails.enquiryStageTag}
//                 onChange={(e) =>
//                   setNoteDetails({
//                     ...noteDetails,
//                     enquiryStageTag: e.target.value,
//                   })
//                 }
//                 className="w-full p-2 mt-1 border border-gray-300 rounded-md"
//                 placeholder="Enter Enquiry Stage Tag"
//               />
//             </div>

//             {/* Add Note To */}
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Add Note to*
//               </label>
//               <input
//                 type="text"
//                 value={noteDetails.addNoteTo}
//                 onChange={(e) =>
//                   setNoteDetails({ ...noteDetails, addNoteTo: e.target.value })
//                 }
//                 className="w-full p-2 mt-1 border border-gray-300 rounded-md"
//                 placeholder="Enter who this note is for"
//               />
//             </div>

//             {/* Notes */}
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Notes*
//               </label>
//               <textarea
//                 value={noteDetails.noteText}
//                 onChange={(e) =>
//                   setNoteDetails({ ...noteDetails, noteText: e.target.value })
//                 }
//                 className="w-full p-2 mt-1 border border-gray-300 rounded-md"
//                 placeholder="Enter your note here"
//               />
//             </div>

//             {/* Submit and Reset buttons */}
//             <div className="flex justify-end mt-4">
//               <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md"
//                 onClick={handleSubmitNote}
//               >
//                 Submit
//               </button>
//               <button
//                 className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
//                 onClick={handleResetNote}
//               >
//                 Reset
//               </button>
//               <button
//                 className="ml-2 text-gray-500"
//                 onClick={closeAddNoteModal}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Enquiries;




import {
    Box,
    Button,
    createTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Fade,
    Grid,
    Paper,
    Slide,
    TextField,
    ThemeProvider,
    Typography
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React, { useEffect, useState } from 'react';
import columns from './Columns'; // Import columns from the separate file
import data from './Enquiry';
import { Link } from 'react-router-dom'; // Import Link for navigation

import { alpha } from '@mui/material/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// Updated modern color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: '#642b8f', // Indigo
    // main: '#f8a213', // Indigo
      light: '#818CF8',
      dark: '#4F46E5',
    },
    secondary: {
      main: '#EC4899', // Pink
      light: '#F472B6',
      dark: '#DB2777',
    },
    warm: {
      main: '#F59E0B', // Amber
      light: '#FCD34D',
      dark: '#D97706',
    },
    cold: {
      main: '#3B82F6', // Blue
      light: '#60A5FA',
      dark: '#2563EB',
    },
    background: {
      default: '#F1F5F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: 'none',
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
        },
      },
    },
  },
});

const DetailView = ({ data }) => (
  <Grid container spacing={3} sx={{ p: 2 }}>
    {Object.entries(data).map(([key, value]) => (
      key !== 'id' && (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              height: '100%',
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
            </Typography>
            <Typography variant="body1" color="text.primary">
              {value || 'N/A'}
            </Typography>
          </Box>
        </Grid>
      )
    ))}
  </Grid>
);

const Enquiries = () => {

  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(data); // Set the imported data into the state
  }, []);
  const [noteDialog, setNoteDialog] = useState({
    open: false,
    rowData: null,
    noteText: ''
  });

  const [viewDialog, setViewDialog] = useState({
    open: false,
    rowData: null
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const [editRowsModel, setEditRowsModel] = useState({});

  const handleStatusToggle = (id) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const newStatus = row.status === 'Warm' ? 'Cold' : 'Warm';
        return {
          ...row,
          status: newStatus,
          stageTag: newStatus
        };
      }
      return row;
    }));
  };

  const handleNoteSave = () => {
    if (noteDialog.rowData) {
      setRows(rows.map(row =>
        row.id === noteDialog.rowData.id
          ? { ...row, notes: noteDialog.noteText }
          : row
      ));
      setNoteDialog({ open: false, rowData: null, noteText: '' });
    }
  };
  const handleRowEditStop = (params, event) => {
    // Prevent default row edit stop behavior
    event.defaultMuiPrevented = true;
  };

  const handleProcessRowUpdate = (newRow, oldRow) => {
    // Update the rows state with the edited row
    const updatedRows = rows.map((row) => 
      row.id === newRow.id ? newRow : row
    );
    setRows(updatedRows);
    return newRow;
  };

  const handleProcessRowUpdateError = (error) => {
    console.error('Row update error:', error);
  };

  return (
    <ThemeProvider theme={theme}>
      <Fade in={true}>
        <Box sx={{ width: '100%', height: '100%', p: 3, ml:"auto" }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              backgroundColor: 'background.paper',
              borderRadius: 3,
              height: 650,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
            }}
          >

            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 600, mb: 3 }}>
            Enquiries

            </Typography>
            <Button 
            variant="contained"
            color="primary"
            component={Link}
            to="/employee-operation-enquiry-form" 
          >
            + Enquire Details
          </Button>
          </Box>
          <DataGrid
            rows={rows}
            columns={columns(theme, handleStatusToggle, setViewDialog, setNoteDialog)}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
            editMode="row"
            onRowDoubleClick={(params) => {
              setViewDialog({ open: true, rowData: params.row });
              // Enable editing on double click
              params.row.isEditable = true;
            }}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={handleProcessRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              height: 500,
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#642b8f',
                color: 'white',
                fontWeight: 600,
              },
              '& .MuiDataGrid-footerContainer': {
                display: 'flex',
                justifyContent: 'flex-end',
              },
              '& .MuiDataGrid-root': {
                overflow: 'hidden',
              },
              '& .MuiCheckbox-root.Mui-checked': {
                color: '#FFFFFF',
              },
              '& .MuiDataGrid-columnHeader .MuiCheckbox-root': {
                color: '#FFFFFF',
              },
            }}
          />
            {/* View Dialog */}
            <Dialog
              open={viewDialog.open}
              onClose={() => setViewDialog({ open: false, rowData: null })}
              maxWidth="md"
              fullWidth
              TransitionComponent={Slide}
              TransitionProps={{ direction: "up" }}
            >
              <DialogTitle sx={{ 
                background: 'linear-gradient(#642b8f, #aa88be)',
                color: '#ffffff',
                fontWeight: 600
              }}>
                Student Details
              </DialogTitle>
              <Divider />
              <DialogContent>
                <DetailView data={viewDialog.rowData || {}} />
              </DialogContent>
              <Divider sx={{ borderColor: '#aa88be' }} />

              <DialogActions sx={{ p: 2.5 }}>
                <Button 
                class="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
                  onClick={() => setViewDialog({ open: false, rowData: null })}
                  variant="outlined"
                  sx={{ 
                    color: '#f8a213',
                    borderColor: '#f8a213'
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>

{/* Notes Dialog */}
<Dialog
  open={noteDialog.open}
  onClose={() => setNoteDialog({ open: false, rowData: null, noteText: '', enquiryStage: '', notesTo: '', parents: '' })}
  maxWidth="sm"
  fullWidth
  TransitionComponent={Slide}
  TransitionProps={{ direction: "up" }}
  BackdropProps={{
    sx: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a semi-transparent black color
      backdropFilter: 'blur(4px)',          // Applies a blur effect to the backdrop
    },
  }}
>
  <DialogTitle
  sx={{ 
    color: '#ffffff',
    fontWeight: 600,
    background: 'linear-gradient(to right, #642b8f, #aa88be)', // Apply the gradient background


  }}>
    Add Note
  </DialogTitle>
  <Divider />
  <DialogContent>

    {/* Enquiry Stage Select Box */}
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel>Enquiry Stage</InputLabel>
      <Select
        value={noteDialog.enquiryStage}
        onChange={(e) => setNoteDialog(prev => ({ ...prev, enquiryStage: e.target.value }))}
        label="Enquiry Stage"
      >
        <MenuItem value="New">New</MenuItem>
        <MenuItem value="Follow-Up">Follow-Up</MenuItem>
        <MenuItem value="Closed">Closed</MenuItem>
        <MenuItem value="Converted">Converted</MenuItem>
      </Select>
    </FormControl>

    {/* Notes To Field */}
    <TextField
      label="Notes To"
      value={noteDialog.notesTo}
      onChange={(e) => setNoteDialog(prev => ({ ...prev, notesTo: e.target.value }))}
      fullWidth
      sx={{ mt: 2 }}
    />
    
    <TextField
      label="Note"
      value={noteDialog.noteText}
      onChange={(e) => setNoteDialog(prev => ({ ...prev, noteText: e.target.value }))}
      multiline
      rows={4}
      fullWidth
      sx={{ mt: 1 }}
    />
  </DialogContent>
  <Divider sx={{ borderColor: '#aa88be' }} />
  <DialogActions sx={{ p: 2.5 }}>

    <Button 
      onClick={handleNoteSave}
      variant="contained"
      class="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
      sx={{ 
        bgcolor: 'primary.main',
        '&:hover': {
          bgcolor: 'primary.dark',
        }
      }}
    >
      Save Note
    </Button>

    <Button 
    class="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
      onClick={() => setNoteDialog({ open: false, rowData: null, noteText: '', enquiryStage: '', notesTo: '', parents: '' })}
      variant="outlined"
      sx={{ 
        color: 'text.primary',
        borderColor: 'divider'
      }}
      type='reset'
    >
      Cancel
    </Button>
  </DialogActions>
</Dialog>

          </Paper>
        </Box>
      </Fade>
    </ThemeProvider>
  );
};

export default Enquiries;



// import {
//   Box,
//   Button,
//   createTheme,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   Fade,
//   Grid,
//   Paper,
//   Slide,
//   TextField,
//   ThemeProvider,
//   Typography
// } from '@mui/material';
// import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
// import React, { useEffect, useState } from 'react';
// import columns from './Columns';
// import data from './Enquiry';
// import { Link } from 'react-router-dom';

// import { alpha } from '@mui/material/styles';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#642b8f', // Indigo
//     },
//     secondary: {
//       main: '#EC4899', // Pink
//     },
//     background: {
//       default: '#F1F5F9',
//       paper: '#FFFFFF',
//     },
//     text: {
//       primary: '#1E293B',
//     },
//   },
// });

// const DetailView = ({ data }) => (
// <Grid container spacing={3} sx={{ p: 2 }}>
//   {Object.entries(data).map(([key, value]) => (
//     key !== 'id' && (
//       <Grid item xs={12} sm={6} md={4} key={key}>
//         <Box
//           sx={{
//             p: 2,
//             borderRadius: 2,
//             bgcolor: alpha(theme.palette.primary.main, 0.04),
//             height: '100%',
//           }}
//         >
//           <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
//             {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
//           </Typography>
//           <Typography variant="body1" color="text.primary">
//             {value || 'N/A'}
//           </Typography>
//         </Box>
//       </Grid>
//     )
//   ))}
// </Grid>
// );

// const Enquiries = () => {
// const [rows, setRows] = useState([]);
// const [viewDialog, setViewDialog] = useState({
//   open: false,
//   rowData: null
// });
// const [paginationModel, setPaginationModel] = useState({
//   page: 0,
//   pageSize: 5,
// });

// useEffect(() => {
//   setRows(data);
// }, []);

// const handleRowClick = (params) => {
//   setViewDialog({
//     open: true,
//     rowData: params.row
//   });
// };

// return (
//   <ThemeProvider theme={theme}>
//     <Fade in={true}>
//       <Box sx={{ width: '100%', height: '100%', p: 3, ml: "auto" }}>
//         <Paper 
//           elevation={0}
//           sx={{ 
//             p: 3,
//             backgroundColor: 'background.paper',
//             borderRadius: 3,
//             height: 650,
//             boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
//           }}
//         >
//           <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', fontWeight: 600, mb: 3 }}>
//               Enquiries
//             </Typography>
//             <Button 
//               variant="contained"
//               component={Link}
//               to="/employee-operation-enquiry-form" 
//               sx={{color:"#ffffff",background:"#642b8f"}}
//             >
//               + Enquire Details
//             </Button>
//           </Box>
          
//           <DataGrid
//             rows={rows}
//             columns={columns(theme)}
//             paginationModel={paginationModel}
//             onPaginationModelChange={setPaginationModel}
//             pageSizeOptions={[5, 10, 25]}
//             checkboxSelection
//             onRowClick={handleRowClick}
//             slots={{ toolbar: GridToolbar }}
//             slotProps={{
//               toolbar: {
//                 showQuickFilter: true,
//                 quickFilterProps: { debounceMs: 500 },
//               },
//             }}
//             sx={{
//               height: 500,
//               '& .MuiDataGrid-cell:focus': {
//                 outline: 'none',
//               },
//               '& .MuiDataGrid-row:hover': {
//                 backgroundColor: alpha(theme.palette.primary.main, 0.04),
//                 cursor: 'pointer',
//               },
//               '& .MuiDataGrid-columnHeader': {
//                 backgroundColor: '#642b8f',
//                 color: 'white',
//                 fontWeight: 600,
//               },
//               '& .MuiDataGrid-footerContainer': {
//                 display: 'flex',
//                 justifyContent: 'flex-end',
//               },
//               '& .MuiDataGrid-root': {
//                 overflow: 'hidden',
//               },
//               '& .MuiCheckbox-root.Mui-checked': {
//                 color: '#FFFFFF',
//               },
//               '& .MuiDataGrid-columnHeader .MuiCheckbox-root': {
//                 color: '#FFFFFF',
//               },
//             }}
//           />

//           {/* View Dialog */}
//           <Dialog
//             open={viewDialog.open}
//             onClose={() => setViewDialog({ open: false, rowData: null })}
//             maxWidth="md"
//             fullWidth
//             TransitionComponent={Slide}
//             TransitionProps={{ direction: "up" }}
//           >
//             <DialogTitle sx={{ 
//               background: 'linear-gradient(#642b8f, #aa88be)',
//               color: '#ffffff',
//               fontWeight: 600
//             }}>
//               Student Details
//             </DialogTitle>
//             <Divider />
//             <DialogContent>
//               <DetailView data={viewDialog.rowData || {}} />
//             </DialogContent>
//             <Divider sx={{ borderColor: '#aa88be' }} />
//             <DialogActions sx={{ p: 2.5 }}>
//               <Button 
//                 className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
//                 onClick={() => setViewDialog({ open: false, rowData: null })}
//                 variant="outlined"
//                 sx={{ 
//                   color: '#f8a213',
//                   borderColor: '#f8a213'
//                 }}
//               >
//                 Close
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Paper>
//       </Box>
//     </Fade>
//   </ThemeProvider>
// );
// };

// export default Enquiries;