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
  fetchAllEnquiries,
  moveToProspects,
  updateEnquiryStatus,
} from "../../../api/service/employee/EmployeeService";
import toast from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import DetailView from "./detailed-view/DetailView";
import { ClipboardList, Edit, X } from "lucide-react";
import TaskAssignmentOverlay from "../prospects/detailed-view/SlideDialog";
import EnquiryRelatedTaskComponent from "../prospects/enquiry-task/EnquiryRelatedTaskComponent";

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
    warm: {
      main: "#F59E0B",
      light: "#FCD34D",
      dark: "#D97706",
    },
    cold: {
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

const Enquiries = () => {
  const navigate = useNavigate();
  const empId = localStorage.getItem("empId");
  const department = localStorage.getItem("department");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    studentName: "",
    onConfirm: null,
  });
  const [whatsappDialog, setWhatsappDialog] = useState({
    open: false,
    phoneNumber: null,
  });
  const [isTaskOverlayOpen, setIsTaskOverlayOpen] = useState(false);
  const [enqId, setEnqId] = useState();

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        const data = await fetchAllEnquiries();
        console.log(data);

        const rowsWithSlNo = data.map((item, index) => ({
          ...item,
          slNo: index + 1, // Serial number starts at 1
        }));

        setRows(rowsWithSlNo);
      } catch (err) {
        console.log("Failed to fetch Enquiries. Please try again later.", err);
      } finally {
        setLoading(false);
      }
    };

    loadLeaves();
  }, []);

  const [viewDialog, setViewDialog] = useState({
    open: false,
    rowData: null,
    showEdit: false,
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

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

  const handleMoveProspects = async (id) => {
    console.log("clicked", id);

    const student = rows.find((row) => row._id === id);
    console.log("clicked 2", student);
    if (!student) return;

    setConfirmDialog({
      open: true,
      studentName: student.kidFirstName,
      onConfirm: async () => {
        try {
          const response = await moveToProspects(id, empId);
          if (response.status === 200 || response.success) {
            // Update the local state to reflect the change
            setRows(rows.filter((row) => row._id !== id));

            toast.success(
              `Successfully moved ${student.kidFirstName} to prospects`
            );
          } else {
            toast.error(`Failed to move ${student.kidFirstName} to prospects`);
          }
        } catch (error) {
          console.error("Error moving to prospects:", error);
          toast.error(
            `Failed to move ${student.kidFirstName} to prospects: ${error.message}`
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
  const handleMessage = (phoneNumber) => {
    setWhatsappDialog({
      open: true,
      phoneNumber,
    });
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
    <ThemeProvider theme={theme}>
      <Fade in={true}>
        <Box sx={{ width: "100%", height: "100%", p: 2, ml: "auto" }}>
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
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            ></Box>
            <DataGrid
              rows={rows}
              columns={columns(
                theme,
                handleStatusToggle,
                handleMoveProspects,
                handleShowLogs,
                handleShowStatus,
                handleMessage
              )}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[15, 30, 50]}
              disableRowSelectionOnClick
              // editMode="row"
              getRowId={(row) => row._id}
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
                height: 500,
                border: "none",
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                // Enhanced row hover effects
                "& .MuiDataGrid-row": {
                  transition: "all 0.2s ease-in-out",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: alpha("#642b8f", 0.008),
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
                // Cell border styling
                // "& .MuiDataGrid-cell": {
                //   borderBottom: "1px solid rgba(100, 43, 143, 0.1)",
                // },
                // Additional responsive hover effects
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

              <Divider />

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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
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
              onClick={() => setViewDialog({ open: false, rowData: null })}
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

        <Divider />

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
            Prospects?
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
      <TaskAssignmentOverlay
        isOpen={isTaskOverlayOpen}
        onClose={() => setIsTaskOverlayOpen(false)}
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
    </ThemeProvider>
  );
};
export default Enquiries;
