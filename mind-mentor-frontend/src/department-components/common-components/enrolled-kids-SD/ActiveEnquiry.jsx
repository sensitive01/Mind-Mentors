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
  Modal,
  Grid,
  Chip,
} from "@mui/material";

import { alpha } from "@mui/material/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import columns from "./Columns";

import DetailView from "./detailed-view/DetailView";
import {
  ClipboardList,
  Edit,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Tag,
  MessageCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import TaskAssignmentOverlay from "./detailed-view/SlideDialog";
import EnquiryRelatedTaskComponent from "../prospects/enquiry-task/EnquiryRelatedTaskComponent";
import { fechAllActiveEnrolledEnquiry } from "../../../api/service/employee/serviceDeliveryService";
import { updateEnquiryStatus } from "../.././../api/service/employee/EmployeeService";

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

// Modal style for prospect details
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 0,
  maxHeight: "90vh",
  overflow: "auto",
};

const Prospects = () => {
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
  const [isTaskOverlayOpen, setIsTaskOverlayOpen] = useState(false);
  const [enqId, setEnqId] = useState();
  const [whatsappDialog, setWhatsappDialog] = useState({
    open: false,
    phoneNumber: null,
  });

  // New state for prospect details modal
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        const data = await fechAllActiveEnrolledEnquiry();
        console.log(data);

        // Add serial numbers to rows
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

  // In Prospects.jsx
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

  const handleMessage = (phoneNumber) => {
    setWhatsappDialog({
      open: true,
      phoneNumber,
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

  // New handlers for prospect modal
  const handleRowClick = (params) => {
    setSelectedProspect(params.row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProspect(null);
  };

  const getEnquiryTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "warm":
        return "warning";
      case "cold":
        return "info";
      case "hot":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const WhatsAppDialog = ({ open, phoneNumber, onClose }) => {
    if (!phoneNumber) return null;

    const widgetUrl = `${
      import.meta.env.VITE_MSGKART_MESSAGE_WIDGET
    }&customerNumber=${phoneNumber}`;

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
          <Box sx={{ width: "100%", height: "100%", ml: "auto" }}>
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
                  handleShowLogs,
                  handleShowStatus,
                  handleMessage
                )}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                getRowId={(row) => row._id}
                onRowClick={handleRowClick}
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
                      backgroundColor: "#7b3ca8",
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

              {/* Existing Detail View Dialog */}
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
                    zIndex: isTaskOverlayOpen ? 1200 : 1300,
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
                          setViewDialog({
                            open: false,
                            rowData: null,
                            showEdit: false,
                          });
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

        {/* New Prospect Details Modal */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="prospect-details-modal"
          aria-describedby="prospect-details-description"
        >
          <Box sx={modalStyle}>
            {selectedProspect && (
              <>
                {/* Modal Header */}
                <Box
                  sx={{
                    p: 3,
                    background:
                      "linear-gradient(135deg, #642b8f 0%, #8b5a9f 100%)",
                    color: "white",
                    borderRadius: "12px 12px 0 0",
                    position: "relative",
                  }}
                >
                  <IconButton
                    onClick={handleCloseModal}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: "white",
                    }}
                  >
                    <X size={24} />
                  </IconButton>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                    Prospect Details
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Complete information about the selected prospect
                  </Typography>
                </Box>

                {/* Modal Content */}
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Basic Information */}
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: "primary.main" }}
                      >
                        Basic Information
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <User size={20} sx={{ mr: 2, color: "primary.main" }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Student Name
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedProspect.studentName || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Mail size={20} sx={{ mr: 2, color: "primary.main" }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Email Address
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedProspect.studentEmail || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Phone
                          size={20}
                          sx={{ mr: 2, color: "primary.main" }}
                        />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Mobile Number
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedProspect.studentMobile || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <MapPin
                          size={20}
                          sx={{ mr: 2, color: "primary.main" }}
                        />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Location
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedProspect.studentLocation || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {selectedProspect.course && (
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <GraduationCap
                            size={20}
                            sx={{ mr: 2, color: "primary.main" }}
                          />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Course
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {selectedProspect.course}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                    </Grid>

                    {/* Status and Type Information */}
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: "primary.main" }}
                      >
                        Enquiry Information
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Enquiry Type
                      </Typography>
                      <Chip
                        label={selectedProspect.enquiryType || "N/A"}
                        color={getEnquiryTypeColor(
                          selectedProspect.enquiryType
                        )}
                        size="small"
                      />
                    </Grid>

                    {selectedProspect.stageTag && (
                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Stage Tag
                        </Typography>
                        <Chip
                          label={selectedProspect.stageTag}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                    )}

                    {selectedProspect.source && (
                      <Grid item xs={12} sm={4}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Source
                        </Typography>
                        <Chip
                          label={selectedProspect.source}
                          color="secondary"
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                    </Grid>

                    {/* Additional Information */}
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: "primary.main" }}
                      >
                        Additional Information
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Serial Number
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedProspect.slNo}
                      </Typography>
                    </Grid>

                    {selectedProspect.createdAt && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Created At
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {new Date(
                            selectedProspect.createdAt
                          ).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    )}

                    {selectedProspect.notes && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Notes
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedProspect.notes}
                        </Typography>
                      </Grid>
                    )}

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<Edit size={18} />}
                          onClick={() => {
                            handleCloseModal();
                            setViewDialog({
                              open: true,
                              rowData: selectedProspect,
                              showEdit: true,
                            });
                          }}
                          sx={{
                            borderColor: "primary.main",
                            color: "primary.main",
                            "&:hover": {
                              borderColor: "primary.dark",
                              backgroundColor: "primary.light",
                              color: "white",
                            },
                          }}
                        >
                          Edit Details
                        </Button>

                        <Button
                          variant="outlined"
                          startIcon={<ClipboardList size={18} />}
                          onClick={() => {
                            handleCloseModal();
                            setIsTaskOverlayOpen(true);
                            setEnqId(selectedProspect._id);
                          }}
                          sx={{
                            borderColor: "secondary.main",
                            color: "secondary.main",
                            "&:hover": {
                              borderColor: "secondary.dark",
                              backgroundColor: "secondary.light",
                              color: "white",
                            },
                          }}
                        >
                          Assign Task
                        </Button>

                        {selectedProspect.studentMobile && (
                          <Button
                            variant="outlined"
                            startIcon={<MessageCircle size={18} />}
                            onClick={() => {
                              handleMessage(selectedProspect.studentMobile);
                              handleCloseModal();
                            }}
                            sx={{
                              borderColor: "success.main",
                              color: "success.main",
                              "&:hover": {
                                borderColor: "success.dark",
                                backgroundColor: "success.light",
                                color: "white",
                              },
                            }}
                          >
                            WhatsApp
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
          </Box>
        </Modal>

        {/* Existing Confirm Dialog */}
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

      {/* Task Assignment Overlay */}
      <TaskAssignmentOverlay
        isOpen={isTaskOverlayOpen}
        onClose={() => setIsTaskOverlayOpen(false)}
        sx={{
          "& .MuiDialog-container": {
            zIndex: 1400,
          },
        }}
      >
        <EnquiryRelatedTaskComponent
          id={enqId}
          onClose={() => setIsTaskOverlayOpen(false)}
        />
      </TaskAssignmentOverlay>

      {/* WhatsApp Dialog */}
      <WhatsAppDialog
        open={whatsappDialog.open}
        phoneNumber={whatsappDialog.phoneNumber}
        onClose={() => setWhatsappDialog({ open: false, phoneNumber: null })}
      />
    </>
  );
};

export default Prospects;
