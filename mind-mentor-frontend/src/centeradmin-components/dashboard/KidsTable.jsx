import {
  Box,
  createTheme,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { getKidData } from "../../../api/service/employee/EmployeeService";

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

// Updated columns to include new fields
const columns = [
  { field: "chessId", headerName: "ChessKid ID", width: 150 },
  { field: "kidsName", headerName: "Name", width: 180 },
  { field: "age", headerName: "Age", width: 60 },
  { field: "gender", headerName: "Gender", width: 100 },
  { field: "intention", headerName: "Intention", width: 150 },
  { field: "schoolName", headerName: "School Name", width: 180 },
  // { field: 'address', headerName: 'Address', width: 200 },
  { field: "parentMobile", headerName: "Parent Mobile", width: 180 },
  { field: "createdAt", headerName: "Created At", width: 200 },
  // { field: 'updatedAt', headerName: 'Updated At', width: 180 },
];

const KidsTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchKidsData = async () => {
      const response = await getKidData();
      console.log("kids data", response);

      // Map the response to the format expected by DataGrid
      const formattedData = response.map((kid) => ({
        id: kid._id, // DataGrid requires an 'id' field
        chessId: kid.chessId,
        kidsName: kid.kidsName,
        age: kid.age,
        gender: kid.gender,
        intention: kid.intention,
        schoolName: kid.schoolName,
        // address: kid.address,
        parentMobile: kid.parentData ? kid.parentData.parentMobile : "N/A", // Check if parentData exists
        createdAt: new Date(kid.createdAt).toLocaleDateString(), // Format date as needed
      }));

      setRows(formattedData);
    };
    fetchKidsData();
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
            Enrollment Data
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
                backgroundColor: "#642b8f", // Corrected this line
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

export default KidsTable;
