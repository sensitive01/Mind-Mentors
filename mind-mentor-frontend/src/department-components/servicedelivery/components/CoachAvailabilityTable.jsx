import {
  Box,
  Button,
  createTheme,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getCoachAvailabilityData } from "../../../api/service/employee/serviceDeliveryService";
import { formatDateOnly } from "../../../utils/formatDateOnly";
import { Link } from "react-router-dom";

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
  { field: "coachName", headerName: "Coach Name", width: 250 },
  { field: "program", headerName: "Program", width: 200 },
  { field: "day", headerName: "Day", width: 200 },
  {
    field: "fromTime",
    headerName: "From Time",
    width: 200,
    valueFormatter: (params) => params.value,
  },
  {
    field: "toTime",
    headerName: "To Time",
    width: 200,
    valueFormatter: (params) => params.value,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 250,
    valueFormatter: (params) => params.value,
  },
];

const CoachAvailabilityTable = () => {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  useEffect(() => {
    const fetchCoachAvailabilityData = async () => {
      try {
        const response = await getCoachAvailabilityData();
        console.log("Coach Availability Data", response);

        const formattedData = response.data.availableDays.map(
          (availability) => ({
            id: availability._id,
            coachName: availability.coachName,
            program: availability.program,
            day: availability.day,
            fromTime: availability.fromTime,
            toTime: availability.toTime,
            createdAt: formatDateOnly(availability.createdAt),
          })
        );
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching coach availability data:", error);
      }
    };

    fetchCoachAvailabilityData();
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "text.primary",
                fontWeight: 600,
              }}
            >
              Coach Availability
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/coachAvailabilityForm"
            >
              + Add Availability
            </Button>
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pagination
            pageSizeOptions={[5]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
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

export default CoachAvailabilityTable;
