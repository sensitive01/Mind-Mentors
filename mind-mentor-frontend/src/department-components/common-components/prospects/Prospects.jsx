/* eslint-disable react/prop-types */
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
  IconButton,
  Paper,
  Slide,
  ThemeProvider,
  Typography,
} from "@mui/material";

import { alpha } from "@mui/material/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import columns from "./Columns";

import {
  updateEnquiryStatus,
  fetchProspectsEnquiries,
  handleMoveToEnquiry,
} from "../../../api/service/employee/EmployeeService";
import DetailView from "./detailed-view/DetailView";
import { ClipboardList, Edit, X } from "lucide-react";
import { toast } from "react-toastify";
import TaskAssignmentOverlay from "./detailed-view/SlideDialog";
import EnquiryRelatedTaskComponent from "./enquiry-task/EnquiryRelatedTaskComponent";

const theme = createTheme({
  palette: {
    primary: {
      main: "#642b8f",

      light: "#818CF8",
      dark: "#4F46E5",
    },
    secondary: {
      main: "#EC4899",
      light: "#F472B6",
      dark: "#DB2777",
    },
    cold: {
      main: "#F59E0B",
      light: "#FCD34D",
      dark: "#D97706",
    },
    warm: {
      main: "#3B82F6",
      light: "#60A5FA",
      dark: "#2563EB",
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
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
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

const Prospects = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const department = localStorage.getItem("department");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // MUI DataGrid uses 0-based page index
    pageSize: 15, // 15 records per page
  });
  const [whatsappDialog, setWhatsappDialog] = useState({
    open: false,
    phoneNumber: null,
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    studentName: "",
    onConfirm: null,
  });
  const [isTaskOverlayOpen, setIsTaskOverlayOpen] = useState(false);
  const [enqId, setEnqId] = useState();

  const loadProspects = async (page, pageSize) => {
    try {
      setLoading(true);
      const { data, total } = await fetchProspectsEnquiries(page + 1, pageSize);
      
      const rowsWithSlNo = data.map((item, index) => ({
        ...item,
        slNo: (page * pageSize) + index + 1, // Calculate serial number based on pagination
        id: item.source + "_" + (item.kidId || item.ID || ((page * pageSize) + index)),
      }));

      setRows(rowsWithSlNo);
      setRowCount(total || 0);
    } catch (err) {
      console.error("Failed to fetch Prospects:", err);
      toast.error("Failed to load prospects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts and when pagination changes
  useEffect(() => {
    loadProspects(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel.page, paginationModel.pageSize]);

  const [viewDialog, setViewDialog] = useState({
    open: false,
    rowData: null,
    showEdit: false,
  });
  const handleMessage = (phoneNumber) => {
    setWhatsappDialog({
      open: true,
      phoneNumber,
    });
  };

  const handleStatusToggle = async (id) => {
    const rowToUpdate = rows.find((row) => row._id === id);
    const newStatus = rowToUpdate.enquiryType === "warm" ? "cold" : "warm";

    try {
      const response = await updateEnquiryStatus(id, newStatus, empId);

      if (response.success) {
        setRows(
          rows.map((row) => {
            if (row._id === id) {
              return {
                ...row,
                enquiryType: newStatus,
                stageTag: newStatus,
              };
            }
            return row;
          })
        );
      } else {
        console.error("Failed to update status:", response.message);
      }
    } catch (error) {
      console.error("Error updating enquiry status:", error);
    }
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };
  const handleProcessRowUpdate = (newRow) => {
    const updatedRows = rows.map((row) =>
      row.id === newRow.id ? newRow : row
    );
    setRows(updatedRows);
    return newRow;
  };
  const handleProcessRowUpdateError = (error) => {
    console.error("Row update error:", error);
  };

  const handleMoveBackToEnquiry = async (id) => {
    const student = rows.find((row) => row._id === id);
    if (!student) return;

    setConfirmDialog({
      open: true,
      studentName: student.kidFirstName,
      onConfirm: async () => {
        try {
          const response = await handleMoveToEnquiry(id, empId);
          if (response.status === 200 || response.success) {
            // Update the local state to reflect the change
            setRows(rows.filter((row) => row._id !== id));

            toast.success(
              `Successfully moved ${student.kidFirstName} to enquiry`
            );
          } else {
            toast.error(`Failed to move ${student.kidFirstName} to enquiry`);
          }
        } catch (error) {
          console.error("Error moving to enquiry:", error);
          toast.error(
            `Failed to move ${student.kidFirstName} to enquiry: ${error.message}`
          );
        } finally {
          setConfirmDialog({ open: false, studentName: "", onConfirm: null });
        }
      },
    });
  };

  const handleShowLogs = (id) => {
    console.log("Handle logs ", id);
    navigate(`/${department}/department/show-complete-enquiry-logs/${id}`);
  };

  const handleShowStatus = (id) => {
    console.log("Handle logs ", id);
    navigate(`/${department}/department/show-complete-status-logs/${id}`);
  };
  const WhatsAppDialog = ({ open, phoneNumber, onClose }) => {
    if (!phoneNumber) return null;

    const widgetUrl = `${
      import.meta.env.VITE_MSGKART_MESSAGE_WIDGET
    }&subId=${phoneNumber}`;

    return (
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            right: 2,
            top: "12%",
            transform: "translateY(-50%)",
            width: "580px",
            height: "550px",
            zIndex: 1300,
            display: "flex",
            flexDirection: "column",
            borderRadius: "12px 0 0 12px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "linear-gradient(#642b8f, #aa88be)",
              color: "white",
              padding: "12px 16px",
              minHeight: "56px",
              boxSizing: "border-box",
              m: 0,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              WhatsApp Chat
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "white" }} size="small">
              <X size={20} />
            </IconButton>
          </Box>
          <Box
            sx={{
              p: 0,
              height: "calc(100% - 56px)",
              overflow: "hidden",
            }}
          >
            <iframe
              src={widgetUrl}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                display: "block",
              }}
              frameBorder="0"
              allowFullScreen
              title="WhatsApp Chat"
            />
          </Box>
        </Paper>
      </Slide>
    );
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Fade in={true}>
          <Box sx={{ width: "100%", height: "100%", ml: "auto", p: 2 }}>
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
              <DataGrid
                rows={rows}
                columns={columns(
                  theme,
                  handleStatusToggle,
                  handleMoveBackToEnquiry,
                  handleShowLogs,
                  handleShowStatus,
                  handleMessage
                )}
                paginationMode="server"
                rowCount={rowCount}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[15, 30, 50]}
                pagination
                disableRowSelectionOnClick
                loading={loading}
                // editMode="row"
                getRowId={(row) => row._id || row.id}
                onRowClick={(params) => {
                  setViewDialog({ open: true, rowData: params.row });
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
                  height: 900,
                  border: "none",
                  "& .MuiDataGrid-cell:focus": {
                    outline: "none",
                  },
                  // Enhanced row hover effects
                  "& .MuiDataGrid-row": {
                    transition: "all 0.2s ease-in-out",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: alpha("#642b8f", 0.08),
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 8px rgba(100, 43, 143, 0.1)",
                    },
                  },
                  // Enhanced cell hover effects
                  "& .MuiDataGrid-cell": {
                    transition: "background-color 0.2s ease",
                    borderBottom: "1px solid rgba(100, 43, 143, 0.1)",

                    "&:hover": {
                      backgroundColor: alpha("#642b8f", 0.12),
                    },
                  },
                  // Header styling
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "#642b8f",
                    color: "white",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#7b3ca8", // Slightly lighter shade for hover
                    },
                  },
                  // Selected row styling
                  "& .MuiDataGrid-row.Mui-selected": {
                    backgroundColor: alpha("#642b8f", 0.15),
                    "&:hover": {
                      backgroundColor: alpha("#642b8f", 0.2),
                    },
                  },
                  // Footer styling
                  "& .MuiDataGrid-footerContainer": {
                    display: "flex",
                    justifyContent: "flex-end",
                    borderTop: "1px solid rgba(100, 43, 143, 0.1)",
                  },
                  // Column separator styling
                  "& .MuiDataGrid-columnSeparator": {
                    color: alpha("#642b8f", 0.2),
                  },
                  // Checkbox styling
                  "& .MuiCheckbox-root.Mui-checked": {
                    color: "#642b8f",
                  },
                  "& .MuiDataGrid-columnHeader .MuiCheckbox-root": {
                    color: "#FFFFFF",
                  },

                  "@media (hover: hover)": {
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: alpha("#642b8f", 0.08),
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 8px rgba(100, 43, 143, 0.1)",
                    },
                  },
                }}
              />

              <Dialog
                open={viewDialog.open}
                onClose={() => {
                  setViewDialog({
                    open: false,
                    rowData: null,
                    showEdit: false,
                  });
                }}
                maxWidth="md"
                fullWidth
                TransitionComponent={Slide}
                TransitionProps={{ direction: "up" }}
                sx={{
                  "& .MuiDialog-container": {
                    zIndex: isTaskOverlayOpen ? 1200 : 1300, // Lower z-index when task overlay is open
                  },
                }}
              >
                <DialogTitle
                  sx={{
                    background: "linear-gradient(#642b8f, #aa88be)",
                    color: "#ffffff",
                    fontWeight: 600,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                  }}
                >
                  <div>Student Details</div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outlined"
                      startIcon={<Edit size={18} />}
                      onClick={() => {
                        if (viewDialog.rowData) {
                          setViewDialog((prev) => ({
                            ...prev,
                            showEdit: true,
                          }));
                        }
                      }}
                      sx={{
                        borderColor: "#ffffff",
                        color: "#ffffff",
                        px: 3,
                        py: 1,
                        borderRadius: "20px",
                        fontWeight: 600,
                        textTransform: "none",
                        backgroundColor: "transparent",
                        "&:hover": {
                          backgroundColor: "#ffdb99",
                          borderColor: "#ff9f00",
                          color: "#ff9f00",
                          boxShadow: "0 4px 8px rgba(255, 158, 51, 0.3)",
                        },
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<ClipboardList size={18} />}
                      onClick={() => {
                        if (viewDialog.rowData) {
                          setIsTaskOverlayOpen(true);
                          setEnqId(viewDialog.rowData._id);
                        }
                      }}
                      sx={{
                        borderColor: "#ffffff",
                        color: "#ffffff",
                        px: 3,
                        py: 1,
                        borderRadius: "20px",
                        fontWeight: 600,
                        textTransform: "none",
                        backgroundColor: "transparent",
                        "&:hover": {
                          backgroundColor: "#a5d6a7",
                          borderColor: "#2e7d32",
                          color: "#2e7d32",
                          boxShadow: "0 4px 8px rgba(46, 125, 50, 0.3)",
                        },
                      }}
                    >
                      Assign Task
                    </Button>
                    <IconButton
                      onClick={() =>
                        setViewDialog({ open: false, rowData: null })
                      }
                      sx={{
                        color: "#ff4444",
                        "&:hover": {
                          backgroundColor: "rgba(255, 68, 68, 0.1)",
                        },
                      }}
                    >
                      <X size={24} />
                    </IconButton>
                  </div>
                </DialogTitle>

                <DialogContent>
                  <DetailView
                    data={viewDialog.rowData || {}}
                    showEdit={viewDialog.showEdit}
                    onEditClose={() =>
                      setViewDialog((prev) => ({ ...prev, showEdit: false }))
                    }
                    onEditSave={(updatedData) => {
                      setRows((prevRows) =>
                        prevRows.map((row) =>
                          row._id === updatedData._id ? updatedData : row
                        )
                      );
                      setViewDialog((prev) => ({
                        ...prev,
                        rowData: updatedData,
                        showEdit: false,
                      }));
                    }}
                  />
                </DialogContent>
              </Dialog>
            </Paper>
          </Box>
        </Fade>
        <Dialog
          open={confirmDialog.open}
          onClose={() =>
            setConfirmDialog({ open: false, studentName: "", onConfirm: null })
          }
        >
          <DialogTitle>Confirm Move to Enquiry</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to move {confirmDialog.studentName} back to
              enquiry?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setConfirmDialog({
                  open: false,
                  studentName: "",
                  onConfirm: null,
                })
              }
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => confirmDialog.onConfirm()}
              color="primary"
              variant="contained"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
      <TaskAssignmentOverlay
        isOpen={isTaskOverlayOpen}
        onClose={() => setIsTaskOverlayOpen(false)}
        sx={{
          "& .MuiDialog-container": {
            zIndex: 1400, // Higher z-index to appear on top
          },
        }}
      >
        <EnquiryRelatedTaskComponent
          id={enqId}
          onClose={() => setIsTaskOverlayOpen(false)}
        />
      </TaskAssignmentOverlay>
      <WhatsAppDialog
        open={whatsappDialog.open}
        phoneNumber={whatsappDialog.phoneNumber}
        onClose={() => setWhatsappDialog({ open: false, phoneNumber: null })}
      />
    </>
  );
};
export default Prospects;
