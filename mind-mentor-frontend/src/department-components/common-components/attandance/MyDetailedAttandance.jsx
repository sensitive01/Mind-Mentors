import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  createTheme,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ArrowBack, CalendarToday } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getMyDetailedAttandance } from "../../../api/service/employee/EmployeeService";

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

const MyDetailedAttendance = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceData();
  }, [empId]);

  useEffect(() => {
    filterDataByMonth();
  }, [selectedMonth, selectedYear, attendanceData]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await getMyDetailedAttandance(empId);

      if (response.status === 200) {
        // Process the data and add serial numbers
        const processedData = response.data.data.map((record, index) => ({
          id: record._id,
          sno: index + 1,
          date: record.date,
          loginTime: record.loginTime,
          empName: record.empName,
          department: record.department,
          status: record.status,
          isLoginMarked: record.isLoginMarked,
          isLogoutMarked: record.isLogoutMarked,
          formattedDate: formatDate(record.date),
          month: new Date(record.date).getMonth() + 1,
          year: new Date(record.date).getFullYear(),
          monthYear: `${new Date(record.date).toLocaleString("default", {
            month: "long",
          })} ${new Date(record.date).getFullYear()}`,
        }));

        setAttendanceData(processedData);

        // Extract unique months and years for filter
        const months = [
          ...new Set(processedData.map((item) => item.month)),
        ].sort((a, b) => a - b);
        const years = [...new Set(processedData.map((item) => item.year))].sort(
          (a, b) => b - a
        );

        setAvailableMonths(months);
        setAvailableYears(years);

        // Set default to current month and year
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        if (years.includes(currentYear)) {
          setSelectedYear(currentYear.toString());
          if (months.includes(currentMonth)) {
            setSelectedMonth(currentMonth.toString());
          }
        } else if (years.length > 0) {
          setSelectedYear(years[0].toString());
        }
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDataByMonth = () => {
    if (!selectedMonth || !selectedYear) {
      setFilteredData(attendanceData);
      return;
    }

    const filtered = attendanceData.filter(
      (record) =>
        record.month === parseInt(selectedMonth) &&
        record.year === parseInt(selectedYear)
    );

    // Re-index serial numbers for filtered data
    const reIndexedData = filtered.map((record, index) => ({
      ...record,
      sno: index + 1,
    }));

    setFilteredData(reIndexedData);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    // If time is already formatted, return as is
    if (timeString && timeString.includes("m")) {
      return timeString;
    }
    // Otherwise, format the time
    try {
      const date = new Date(`1970-01-01T${timeString}`);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString || "N/A";
    }
  };

  const getMonthName = (monthNumber) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthNumber - 1];
  };

  const columns = [
    {
      field: "sno",
      headerName: "S.No",
      flex: 0.5,
      minWidth: 60,
    },
    {
      field: "formattedDate",
      headerName: "Date",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "loginTime",
      headerName: "Login Time",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ marginTop: "15px" }}>
          {formatTime(params.value)}
        </Typography>
      ),
    },
    {
      field: "empName",
      headerName: "Employee Name",
      flex: 1.2,
      minWidth: 150,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => {
        const getStatusColor = (status) => {
          switch (status?.toLowerCase()) {
            case "present":
              return { bg: "rgba(46, 204, 113, 0.15)", color: "#2ecc71" };
            case "late":
              return { bg: "rgba(255, 193, 7, 0.15)", color: "#ffc107" };
            case "absent":
              return { bg: "rgba(231, 76, 60, 0.15)", color: "#e74c3c" };
            default:
              return { bg: "rgba(108, 117, 125, 0.15)", color: "#6c757d" };
          }
        };

        const statusStyle = getStatusColor(params.value);

        return (
          <Box
            sx={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.color,
              borderRadius: "16px",
              py: 0.5,
              px: 2,
              marginTop: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              {params.value}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "isLoginMarked",
      headerName: "Login Marked",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: params.value
              ? "rgba(46, 204, 113, 0.15)"
              : "rgba(231, 76, 60, 0.15)",
            color: params.value ? "#2ecc71" : "#e74c3c",
            borderRadius: "16px",
            py: 0.5,
            px: 2,
            marginTop: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            {params.value ? "Yes" : "No"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "isLogoutMarked",
      headerName: "Logout Marked",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: params.value
              ? "rgba(46, 204, 113, 0.15)"
              : "rgba(231, 76, 60, 0.15)",
            color: params.value ? "#2ecc71" : "#e74c3c",
            borderRadius: "16px",
            py: 0.5,
            px: 2,
            marginTop: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            {params.value ? "Yes" : "No"}
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", height: "100%", p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: "background.paper",
            borderRadius: 3,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 100px)",
          }}
        >
          {/* Header Section */}
          <Box
            mb={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            <Box display="flex" alignItems="center">
              <IconButton
                sx={{ mr: 1 }}
                onClick={() => navigate(-1)}
                color="primary"
              >
                <ArrowBack />
              </IconButton>
              <Typography
                variant="h5"
                sx={{ color: "#642b8f", fontWeight: 600, mb: 0 }}
              >
                My Detailed Attendance
              </Typography>
            </Box>

            {/* Month/Year Filter Section */}
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  label="Year"
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <MenuItem value="">All Years</MenuItem>
                  {availableYears.map((year) => (
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  label="Month"
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <MenuItem value="">All Months</MenuItem>
                  {availableMonths.map((month) => (
                    <MenuItem key={month} value={month.toString()}>
                      {getMonthName(month)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                startIcon={<CalendarToday />}
                onClick={() => {
                  setSelectedMonth("");
                  setSelectedYear("");
                }}
                size="small"
              >
                Clear Filters
              </Button>
            </Box>
          </Box>

          {/* Summary Section */}
          {selectedMonth && selectedYear && (
            <Box mb={2}>
              <Typography variant="h6" color="primary" gutterBottom>
                {getMonthName(parseInt(selectedMonth))} {selectedYear} Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h4" color="primary">
                      {filteredData.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Days
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h4" color="success.main">
                      {
                        filteredData.filter(
                          (d) => d.status?.toLowerCase() === "present"
                        ).length
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Present
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h4" color="warning.main">
                      {
                        filteredData.filter(
                          (d) => d.status?.toLowerCase() === "late"
                        ).length
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Late
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h4" color="error.main">
                      {
                        filteredData.filter(
                          (d) => d.status?.toLowerCase() === "absent"
                        ).length
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Absent
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Data Grid */}
          <Box sx={{ flexGrow: 1, width: "100%", overflow: "hidden" }}>
            <DataGrid
              rows={filteredData}
              columns={columns}
              loading={loading}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                border: "none",
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
              pagination
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 25 },
                },
                sorting: {
                  sortModel: [{ field: "date", sort: "desc" }],
                },
              }}
            />
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default MyDetailedAttendance;
