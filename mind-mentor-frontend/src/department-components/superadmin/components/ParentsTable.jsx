import {
  Box,
  createTheme,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import  { useEffect, useState } from "react";
import { getAllParentData } from "../../../api/service/employee/EmployeeService";

const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f", // Indigo
      light: "#818CF8",
      dark: "#4F46E5",
    },
    background: {
      default: "#F1F5F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "none",
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
        },
      },
    },
  },
});

// Updated columns for parent data
const columns = [
  { field: "sno", headerName: "Sno", width: 50 },

  { field: "parentName", headerName: "Parent Name", width: 180 },
  { field: "parentEmail", headerName: "Email", width: 220 },
  { field: "parentMobile", headerName: "Mobile", width: 150 },
  { field: "numberOfKids", headerName: "Number of Kids", width: 130 },
  { field: "role", headerName: "Role", width: 100 },
  { field: "status", headerName: "Status", width: 100 },
  { field: "type", headerName: "Type", width: 100 },
  { field: "createdAt", headerName: "Created At", width: 180 },
];

const ParentTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchParentData = async () => {
      const response = await getAllParentData();
      console.log("parent data", response);

      // Map the response to the format expected by DataGrid
      const formattedData = response.data.parentData.map((parent,index) => ({
        sno:index+1,
        id: parent._id, // DataGrid requires an 'id' field
        parentName: parent.parentName,
        parentEmail: parent.parentEmail,
        parentMobile: parent.parentMobile,
        numberOfKids: parent.kids ? parent.kids.length : 0,
        role: parent.role,
        status: parent.status,
        type: parent.type,
        createdAt: new Date(parent.createdAt).toLocaleDateString(), // Format date as needed
      }));

      setRows(formattedData);
    };
    fetchParentData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", height: "100%", p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: "background.paper",
            borderRadius: 3,
            height: 650,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: "text.primary",
              fontWeight: 600,
              mb: 3,
            }}
          >
            Parent Data
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              height: 500,
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#642b8f",
                color: "white",
                fontWeight: 600,
              },
              "& .MuiCheckbox-root.Mui-checked": {
                color: "#FFFFFF",
              },
              "& .MuiDataGrid-columnHeader .MuiCheckbox-root": {
                color: "#FFFFFF",
              },
            }}
          />
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ParentTable;
