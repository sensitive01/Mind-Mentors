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
      main: "#642b8f",
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

const columns = [
  { field: "chessId", headerName: "ChessKid ID", width: 150, flex: 1 },
  { field: "kidsName", headerName: "Name", width: 180, flex: 1 },
  { field: "age", headerName: "Age", width: 60, flex: 0.5 },
  { field: "gender", headerName: "Gender", width: 100, flex: 0.7 },
  { field: "intention", headerName: "Intention", width: 150, flex: 1 },
  { field: "schoolName", headerName: "School Name", width: 180, flex: 1.2 },
  { field: "parentMobile", headerName: "Parent Mobile", width: 180, flex: 1 },
  { field: "createdAt", headerName: "Created At", width: 200, flex: 1 },
];

const KidsTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchKidsData = async () => {
      const response = await getKidData();
      const formattedData = response.map((kid) => ({
        id: kid._id,
        chessId: kid.chessId,
        kidsName: kid.kidsName,
        age: kid.age,
        gender: kid.gender,
        intention: kid.intention,
        schoolName: kid.schoolName,
        parentMobile: kid.parentData ? kid.parentData.parentMobile : "N/A",
        createdAt: new Date(kid.createdAt).toLocaleDateString(),
      }));
      setRows(formattedData);
    };
    fetchKidsData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        <Paper
          elevation={0}
          sx={{
            height: 'calc(100vh - 32px)', // Adjust based on your layout
            m: 2,
            backgroundColor: "background.paper",
            borderRadius: 3,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              p: 3,
              pb: 2
            }}
          >
            Enrollment Data
          </Typography>
          <Box sx={{ flex: 1, width: '100%', p: 3, pt: 0 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                height: '100%',
                width: '100%',
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
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default KidsTable;