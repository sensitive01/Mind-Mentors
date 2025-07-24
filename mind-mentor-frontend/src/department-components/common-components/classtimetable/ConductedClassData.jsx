import {
  Visibility,
  Person,
  School,
  AccessTime,
  CalendarToday,
} from "@mui/icons-material";
import {
  Box,
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  ThemeProvider,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { superAdminGetConductedClass } from "../../../api/service/employee/EmployeeService";
import toast from "react-hot-toast";

const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f",
      light: "#818CF8",
      dark: "#4F46E5",
    },
    background: {
      default: "#F8FAFC",
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
          borderRadius: 16,
          border: "none",
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
        },
      },
    },
  },
});

const ConductedClassTable = () => {
  const [rows, setRows] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchConductedClasses = async () => {
    setLoading(true);
    try {
      const response = await superAdminGetConductedClass();
      if (response.status === 200) {
        setRows(
          response.data.data.map((classData, index) => ({
            id: classData._id,
            slNo: index + 1,
            ...classData,
            totalStudents: classData.students.length,
            presentStudents: classData.students.filter(
              (s) => s.attendance === "Present"
            ).length,
            demoStudents: classData.students.filter(
              (s) => s.classType === "demo"
            ).length,
            regularStudents: classData.students.filter(
              (s) => s.classType === "regular"
            ).length,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching conducted classes:", error);
      toast.error("Failed to load conducted classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConductedClasses();
  }, []);

  const handleView = (classData) => {
    setSelectedClass(classData);
    setOpenViewDialog(true);
  };

  const handleRowClick = (params) => {
    handleView(params.row);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAttendanceColor = (present, total) => {
    const percentage = (present / total) * 100;
    if (percentage === 100)
      return { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
    if (percentage >= 80)
      return { bg: "#fef3c7", color: "#92400e", border: "#fde68a" };
    return { bg: "#fee2e2", color: "#b91c1c", border: "#fecaca" };
  };

  const columns = [
    {
      field: "slNo",
      headerName: "#",
      width: 80,
      align: "center",
      headerAlign: "center",
      resizable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "#64748b",
              fontSize: "0.9rem",
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "conductedDate",
      headerName: "Date & Time",
      width: 200,
      align: "center",
      headerAlign: "center",
      resizable: false,
      renderCell: (params) => (
        <Box
          sx={{
            py: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mb: 0.5 }}
          >
            <CalendarToday sx={{ fontSize: 14, color: "#642b8f" }} />
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: "#1e293b", fontSize: "0.85rem" }}
            >
              {new Date(params.value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccessTime sx={{ fontSize: 12, color: "#64748b" }} />
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}
            >
              {new Date(params.value).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Stack>
        </Box>
      ),
    },
    {
      field: "coachName",
      headerName: "Coach",
      width: 180,
      align: "center",
      headerAlign: "center",
      resizable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            py: 1,
            width: "100%",
            height: "100%",
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: "#642b8f",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {params.value && params.value !== "N/A"
              ? params.value.charAt(0).toUpperCase()
              : "?"}
          </Avatar>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: "#1e293b", fontSize: "0.85rem" }}
            >
              {params.value || "Unassigned"}
            </Typography>
           
          </Box>
        </Box>
      ),
    },
    {
      field: "program",
      headerName: "Program",
      width: 140,
      align: "center",
      headerAlign: "center",
      resizable: false,
      renderCell: (params) => (
        <Box
          sx={{
            py: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Chip
            label={params.value || "N/A"}
            size="small"
            sx={{
              backgroundColor: "rgba(100, 43, 143, 0.1)",
              color: "#642b8f",
              fontWeight: 600,
              fontSize: "0.75rem",
              height: 26,
              borderRadius: 2,
              border: "1px solid rgba(100, 43, 143, 0.2)",
            }}
          />
        </Box>
      ),
    },
    {
      field: "level",
      headerName: "Level",
      width: 160,
      align: "center",
      headerAlign: "center",
      resizable: false,
      renderCell: (params) => (
        <Box
          sx={{
            py: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              color: "#642b8f",
              fontSize: "0.8rem",
              backgroundColor: "rgba(100, 43, 143, 0.05)",
              padding: "6px 14px",
              borderRadius: 2,
              display: "inline-block",
              textAlign: "center",
            }}
          >
            {params.value || "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "totalStudents",
      headerName: "Attendance",
      width: 140,
      align: "center",
      headerAlign: "center",
      resizable: false,
      renderCell: (params) => {
        const colors = getAttendanceColor(
          params.row.presentStudents,
          params.value
        );
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 1,
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                color: colors.color,
                borderRadius: 2,
                padding: "1px 4px",
                fontWeight: 700,
                fontSize: "1rem",
                mt:0.75,
                display: "inline-block",
                minWidth: 60,
                textAlign: "center",
              }}
            >
              {params.row.presentStudents}/{params.value}
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.65rem", textAlign: "center" }}
            >
              Present/Total
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      align: "center",
      headerAlign: "center",
      resizable: false,
      renderCell: (params) => (
        <Box
          sx={{
            py: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Chip
            label={params.value}
            size="small"
            sx={{
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              color: "rgb(21, 128, 61)",
              borderRadius: 3,
              fontWeight: 700,
              fontSize: "0.75rem",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              height: 26,
              textTransform: "capitalize",
            }}
          />
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      align: "center",
      headerAlign: "center",
      resizable: false,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Visibility
              sx={{
                color: "#642b8f",
                fontSize: 18,
              }}
            />
          }
          label="View Details"
          onClick={() => handleView(params.row)}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(100, 43, 143, 0.1)",
              borderRadius: 2,
            },
            borderRadius: 2,
            padding: "6px",
            mx: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />,
      ],
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ width: "100%", height: "100%", p: 3, backgroundColor: "#f8fafc" }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            backgroundColor: "background.paper",
            borderRadius: 4,
            height: 700,
            boxShadow: "0px 4px 25px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
          }}
        >
          <Box
            mb={4}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: "#1e293b",
                  fontWeight: 800,
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <School sx={{ fontSize: 32, color: "#642b8f" }} />
                Conducted Classes
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Manage and review all conducted classes with detailed insights
              </Typography>
              <Stack direction="row" spacing={2}>
                <Chip
                  label={`${rows.length} Total Classes`}
                  size="medium"
                  sx={{
                    backgroundColor: "rgba(100, 43, 143, 0.1)",
                    color: "#642b8f",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                />
                <Chip
                  label={`${rows.reduce(
                    (sum, row) => sum + row.presentStudents,
                    0
                  )} Students Attended`}
                  size="medium"
                  sx={{
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    color: "rgb(21, 128, 61)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                />
              </Stack>
            </Box>
          </Box>

          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: {
                  debounceMs: 500,
                  placeholder: "Search classes...",
                },
              },
            }}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            sx={{
              height: 550,
              cursor: "pointer",
              width: "100%",
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(100, 43, 143, 0.03)",
                transform: "translateY(-1px)",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#642b8f",
                color: "white",
                borderRadius: 0,
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#642b8f",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  borderRight: "1px solid rgba(255,255,255,0.2)",
                  "&:focus": {
                    outline: "none",
                  },
                  "&:focus-within": {
                    outline: "none",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 700,
                  },
                },
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
                borderRight: "1px solid rgba(226, 232, 240, 0.5)",
                padding: "0px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:focus": {
                  outline: "none",
                },
                "&:focus-within": {
                  outline: "none",
                },
              },
              "& .MuiDataGrid-row": {
                minHeight: "65px !important",
                maxHeight: "65px !important",
                "&:nth-of-type(even)": {
                  backgroundColor: "rgba(248, 250, 252, 0.5)",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(100, 43, 143, 0.08)",
                  "&:hover": {
                    backgroundColor: "rgba(100, 43, 143, 0.12)",
                  },
                },
              },
              "& .MuiDataGrid-virtualScroller": {
                borderRadius: "0 0 16px 16px",
                overflowX: "hidden",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#f8fafc",
                borderTop: "1px solid rgba(226, 232, 240, 0.8)",
                borderRadius: "0 0 16px 16px",
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "& .MuiDataGrid-root": {
                border: "none",
              },
            }}
          />
        </Paper>

        {/* View Class Details Dialog - keeping the existing dialog code */}
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle
            sx={{
              backgroundColor: "#642b8f",
              color: "white",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <School />
            Class Details
          </DialogTitle>
          <DialogContent dividers>
            {selectedClass && (
              <Box sx={{ py: 2 }}>
                {/* Class Overview */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: "100%", boxShadow: 1 }}>
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 2,
                            color: "#642b8f",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <School fontSize="small" />
                          Class Information
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Class ID
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontFamily: "monospace", fontWeight: 500 }}
                            >
                              {selectedClass.classId}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Coach Name
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {selectedClass.coachName || "N/A"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Program
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {selectedClass.program || "N/A"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Level
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {selectedClass.level || "N/A"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Conducted Date
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {formatDate(selectedClass.conductedDate)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Status
                            </Typography>
                            <Chip
                              label={selectedClass.status}
                              sx={{
                                backgroundColor: "rgba(46, 204, 113, 0.2)",
                                color: "rgb(46, 204, 113)",
                                fontWeight: 600,
                                mt: 0.5,
                              }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: "100%", boxShadow: 1 }}>
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 2,
                            color: "#642b8f",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Person fontSize="small" />
                          Class Statistics
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Total Students
                            </Typography>
                            <Chip
                              label={selectedClass.totalStudents}
                              color="primary"
                              size="small"
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Present Students
                            </Typography>
                            <Chip
                              label={selectedClass.presentStudents}
                              sx={{
                                backgroundColor: "rgba(46, 204, 113, 0.2)",
                                color: "rgb(46, 204, 113)",
                              }}
                              size="small"
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Demo Students
                            </Typography>
                            <Chip
                              label={selectedClass.demoStudents}
                              color="info"
                              size="small"
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Regular Students
                            </Typography>
                            <Chip
                              label={selectedClass.regularStudents}
                              color="secondary"
                              size="small"
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Coach Feedback */}
                <Card sx={{ mb: 4, boxShadow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: "#642b8f" }}>
                      Coach Feedback
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        backgroundColor: "#f8f9fa",
                        p: 2,
                        borderRadius: 1,
                        fontStyle: selectedClass.coachClassFeedBack
                          ? "normal"
                          : "italic",
                      }}
                    >
                      {selectedClass.coachClassFeedBack ||
                        "No feedback provided"}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Students List */}
                <Card sx={{ boxShadow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, color: "#642b8f" }}>
                      Students ({selectedClass.students.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {selectedClass.students.map((student, index) => (
                        <Grid item xs={12} md={6} key={student._id}>
                          <Card variant="outlined" sx={{ p: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mb: 2,
                              }}
                            >
                              <Avatar
                                sx={{
                                  backgroundColor: "#642b8f",
                                  width: 40,
                                  height: 40,
                                }}
                              >
                                {student.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={600}
                                >
                                  {student.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ fontFamily: "monospace" }}
                                >
                                  ID: {student.studentId}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                              <Chip
                                label={student.classType}
                                size="small"
                                color={
                                  student.classType === "demo"
                                    ? "info"
                                    : "secondary"
                                }
                                sx={{ textTransform: "capitalize" }}
                              />
                              <Chip
                                label={student.attendance}
                                size="small"
                                sx={{
                                  backgroundColor:
                                    student.attendance === "Present"
                                      ? "rgba(46, 204, 113, 0.2)"
                                      : "rgba(231, 76, 60, 0.2)",
                                  color:
                                    student.attendance === "Present"
                                      ? "rgb(46, 204, 113)"
                                      : "rgb(231, 76, 60)",
                                }}
                              />
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                              >
                                Feedback:
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontStyle: student.feedback
                                    ? "normal"
                                    : "italic",
                                }}
                              >
                                {student.feedback || "No feedback provided"}
                              </Typography>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenViewDialog(false)}
              color="primary"
              variant="contained"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ConductedClassTable;
