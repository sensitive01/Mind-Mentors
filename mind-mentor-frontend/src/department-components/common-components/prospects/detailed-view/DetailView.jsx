/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Box, Grid, Typography, Tooltip, IconButton, Drawer, Divider } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { X, List } from "lucide-react";
import EnqRelatedTask from "./EnqRelatedTask";
import {
  fetchThePhysicalCenters,
  getAllProgrameDataEnquiry,
  getThePaymentId,
  savepaymentInfoOperation,
  updateEnquiry,
} from "../../../../api/service/employee/EmployeeService";
import { useNavigate } from "react-router-dom";
import {
  formatEmail,
  formatWhatsAppNumber,
} from "../../../../utils/formatContacts";
import PaymentDialog from "./PaymentDialog";
import EditDialogBox from "./edit/EditDialogBox";
import PaymentVerification from "./PaymentVerification";

const DetailCard = ({ title, value, isEmail = false, maxLength = 25 }) => {
  const shouldTruncate = value && value.length > maxLength && !isEmail;
  const displayValue = shouldTruncate
    ? `${value.substring(0, maxLength)}...`
    : value;

  const getTextStyles = () => {
    if (isEmail) {
      return {
        wordBreak: "break-all",
        overflowWrap: "break-word",
        whiteSpace: "pre-wrap",
        fontSize: "0.875rem",
        lineHeight: 1.4,
      };
    }
    return {
      lineHeight: 1.6,
      wordBreak: "break-word",
      overflowWrap: "break-word",
    };
  };

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        minHeight: "100px",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.5px" }}
      >
        {title}
      </Typography>

      {shouldTruncate ? (
        <Tooltip title={value} arrow placement="top">
          <Typography
            variant="body1"
            color="text.primary"
            sx={{
              ...getTextStyles(),
              cursor: "pointer",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            {displayValue}
          </Typography>
        </Tooltip>
      ) : (
        <Typography variant="body1" color="text.primary" sx={getTextStyles()}>
          {value || "N/A"}
        </Typography>
      )}
    </Box>
  );
};

const SectionTitle = ({ children }) => (
  <Typography
    variant="h6"
    sx={(theme) => ({
      mb: 3,
      color: theme.palette.primary.main,
      fontWeight: 600,
      fontSize: "1.125rem",
    })}
  >
    {children}
  </Typography>
);

const DetailView = ({ data, showEdit, onEditClose, onEditSave }) => {
  console.log("DetailView - Initial Data:", data);
  const navigate = useNavigate();
  const department = localStorage.getItem("department");
  const empId = localStorage.getItem("empId");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState(data);
  const [currentData, setCurrentData] = useState(data);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [physicalCenter, setPhysicalCenter] = useState([]);
  const [programsData, setProgramsData] = useState([]);

  const [verifyPaymentDialogOpen, setIsVerifyPaymentDialogOpen] =
    useState(false);

  // State for task assignment
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 450, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Drag handlers for the task dialog
  const handleMouseDown = (e) => {
    // Don't start dragging if clicking on buttons or interactive elements
    if (e.target.closest('button') || e.target.closest('input')) {
      return;
    }
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Helper functions for name handling
  const getCombinedName = (firstName, lastName) => {
    if (!firstName && !lastName) return "";
    return `${firstName || ""} ${lastName || ""}`.trim();
  };

  const getDisplayParentName = (data) => {
    if (data?.parentName) return data.parentName;
    return getCombinedName(data?.parentFirstName, data?.parentLastName);
  };

  const getDisplayKidName = (data) => {
    if (data?.kidName) return data.kidName;
    return getCombinedName(data?.kidFirstName, data?.kidLastName);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllProgrameDataEnquiry();
        console.log("Response", response);
        if (response.status === 200) {
          setProgramsData(response.data.programs);
        }
      } catch (error) {
        console.error("Error fetching programs data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("DetailView - Data prop changed:", data);
    setFormData(data);
    setCurrentData(data);
  }, [data]);

  useEffect(() => {
    const fetchAllCenters = async () => {
      const response = await fetchThePhysicalCenters();
      console.log(response);
      if (response.status === 200) {
        setPhysicalCenter(response.data.centerData);
      }
    };
    fetchAllCenters();
  }, []);

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    onEditClose();
  };

  const handleInputChange = (field, value) => {
    console.log("DetailView - Input changed:", { field, value });
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      console.log("DetailView - Updated formData:", updated);
      return updated;
    });
  };

  const handleSave = async () => {
    console.log("DetailView - Saving data:", formData);
    try {
      const response = await updateEnquiry(formData, empId);
      console.log("DetailView - Save response:", response);

      if (response.status === 200) {
        console.log("DetailView - Response data:", response.data);

        const updatedData = {
          ...currentData,
          ...formData,
          ...response.data,
          parentName:
            formData.parentName ||
            response.data?.parentName ||
            currentData.parentName,
          kidName:
            formData.kidName || response.data?.kidName || currentData.kidName,
          parentFirstName:
            formData.parentFirstName ||
            response.data?.parentFirstName ||
            currentData.parentFirstName,
          parentLastName:
            formData.parentLastName ||
            response.data?.parentLastName ||
            currentData.parentLastName,
          kidFirstName:
            formData.kidFirstName ||
            response.data?.kidFirstName ||
            currentData.kidFirstName,
          kidLastName:
            formData.kidLastName ||
            response.data?.kidLastName ||
            currentData.kidLastName,
        };

        console.log("DetailView - Final updated data:", updatedData);
        console.log(
          "DetailView - Parent name will display:",
          getDisplayParentName(updatedData)
        );
        console.log(
          "DetailView - Kid name will display:",
          getDisplayKidName(updatedData)
        );

        setCurrentData(updatedData);
        setFormData(updatedData);
        onEditSave(updatedData);
      }
    } catch (error) {
      console.error("Error updating enquiry:", error);
    }
    handleCloseEdit();
  };

  const handleGetPaymentId = async (id) => {
    const response = await getThePaymentId(id);
    console.log("update", response);
    if (response.status === 200) {
      navigate(
        `/${department}/department/payment-details/${response?.data?.paymentData?.paymentId}`
      );
    }
  };

  if (!data) return null;

  const displayData = currentData;
  console.log("DetailView - Display data:", displayData);

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      {/* Main Content */}
      <Box sx={{ height: '100%', overflowY: 'auto', p: 3 }}>
        <Grid container spacing={4}>
          {/* Parent Information */}
          <Grid item xs={12}>
            <SectionTitle>Parent Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="PARENT NAME"
                  value={getDisplayParentName(displayData)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="EMAIL"
                  value={formatEmail(displayData?.email)}
                  isEmail={true}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="WHATSAPP NUMBER"
                  value={formatWhatsAppNumber(displayData?.whatsappNumber)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="CONTACT NUMBER"
                  value={formatWhatsAppNumber(displayData?.contactNumber)}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Kid Information */}
          <Grid item xs={12}>
            <SectionTitle>Kid Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="KID NAME"
                  value={getDisplayKidName(displayData)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="AGE" value={displayData?.kidsAge} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="GENDER" value={displayData?.kidsGender} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="KID PINCODE" value={displayData?.pincode} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="KID CITY" value={displayData?.city} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="KID STATE" value={displayData?.state} />
              </Grid>
            </Grid>
          </Grid>

          {/* Programs */}
          <Grid item xs={12}>
            <SectionTitle>Program Details</SectionTitle>
            <Grid container spacing={3}>
              {displayData?.programs?.map((program, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <DetailCard
                    title={`PROGRAM ${index + 1}`}
                    value={`${program.program} (${program.level})`}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          {displayData?.isLevelPromoteRecomented && (
            <Grid item xs={12} md={3} style={{ overflow: "visible" }}>
              <div
                style={{
                  backgroundColor: "#FFF4E5",
                  border: "1px solid #FFA726",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                <DetailCard
                  title={
                    <span style={{ color: "#E65100", fontWeight: "bold" }}>
                      ⭐ RECOMMENDED LEVEL
                    </span>
                  }
                  value={
                    <span style={{ fontWeight: "bold", color: "#D84315" }}>
                      {displayData?.recomentedLevel}
                    </span>
                  }
                />
              </div>
            </Grid>
          )}

          {/* Status Information */}
          <Grid item xs={12}>
            <SectionTitle>Status Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="PAYMENT STATUS"
                  value={displayData?.paymentStatus}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="SOURCE" value={displayData?.source} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="DISPOSITION"
                  value={displayData?.disposition}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <DetailCard
                  title="ENQUIRY TYPE"
                  value={displayData?.enquiryType}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="ENQUIRY FIELD"
                  value={displayData?.enquiryField}
                />
              </Grid>

              {displayData?.enquiryField === "prospects" && (
                <Grid item xs={12} md={3} style={{ overflow: "visible" }}>
                  <DetailCard
                    title={
                      displayData?.scheduleDemo?.status === "Pending"
                        ? "SCHEDULE DEMO CLASS"
                        : "DEMO CLASS ACTIONS"
                    }
                    value={
                      <div className="flex flex-col gap-3 rounded-lg">
                        {displayData?.scheduleDemo?.status === "Pending" ? (
                          <button
                            onClick={() =>
                              navigate(
                                `/${department}/department/schedule-demo-class-list-individually/${displayData?._id}/false`
                              )
                            }
                            className="w-full px-3 py-1 bg-white text-black border-2 border-primary hover:bg-primary/80 hover:border-primary/80 hover:text-white transition-all duration-800 text-sm font-medium rounded-md shadow-2xl"
                          >
                            Schedule Demo
                          </button>
                        ) : (
                          <div className="flex flex-col gap-1 w-full">
                            <button
                              onClick={() =>
                                navigate(
                                  `/${department}/department/schedule-demo-class-list-individually/${displayData?._id}/true`
                                )
                              }
                              className="w-full px-2 py-1 bg-white text-black border-2 border-primary hover:bg-primary/80 hover:text-white hover:border-primary/80 transition-all duration-200 text-sm font-medium rounded-md shadow-sm"
                            >
                              View Demo
                            </button>
                          </div>
                        )}
                      </div>
                    }
                  />
                </Grid>
              )}

              {(displayData?.paymentStatus === "Pending" ||
                displayData?.paymentStatus === "Success") && (
                  <Grid item xs={12} md={3} style={{ overflow: "visible" }}>
                    <DetailCard
                      title={
                        displayData?.paymentStatus === "Pending"
                          ? "CHOOSE CLASS PACKAGE"
                          : "VIEW PAYMENT"
                      }
                      value={
                        <div className="flex flex-col gap-1 w-full">
                          {displayData?.paymentStatus === "Pending" ? (
                            <button
                              onClick={() => setIsPaymentDialogOpen(true)}
                              className="w-full px-2 py-1 bg-white text-black border-2 border-primary hover:bg-primary/80 hover:text-white hover:border-primary/80 transition-all duration-200 text-sm font-medium rounded-md shadow-sm"
                            >
                              Choose class package
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  handleGetPaymentId(displayData?._id)
                                }
                                className="w-full px-2 py-1 bg-white text-black border-2 border-primary hover:bg-primary/80 hover:text-white hover:border-primary/80 transition-all duration-200 text-sm font-medium rounded-md shadow-sm"
                              >
                                View Payment
                              </button>
                            </>
                          )}
                        </div>
                      }
                    />
                  </Grid>
                )}
            </Grid>
          </Grid>

          {/* Messages and Notes */}
          <Grid item xs={12}>
            <SectionTitle>Remarks & Notes</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box
                  sx={(theme) => ({
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  })}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Remarks
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {displayData?.message || "No messages"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={(theme) => ({
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  })}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Notes
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {displayData?.notes || "No notes"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={(theme) => ({
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  })}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Status Log
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {displayData?.lastNoteAction || "No status updates"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Assign Task Button */}
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
          <button
            onClick={() => setIsTaskDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-lg hover:bg-primary-dark transition-colors"
          >
            <List size={18} />
            Assign Tasks
          </button>
        </Box>

        <EditDialogBox
          showEdit={showEdit}
          onEditClose={handleCloseEdit}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
        />

        <PaymentDialog
          open={isPaymentDialogOpen}
          onClose={() => setIsPaymentDialogOpen(false)}
          data={displayData}
          enqId={formData?._id}
        />

        <PaymentVerification
          data={displayData?.paymentLink}
          open={verifyPaymentDialogOpen}
          onCancel={() => setIsVerifyPaymentDialogOpen(false)}
          physicalCenter={physicalCenter}
        />
      </Box>

      {/* RESTORED CUSTOM DRAGGABLE TASK DIALOG */}
      {isTaskDialogOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: position.y,
            left: position.x,
            width: '850px',
            maxWidth: '95vw',
            height: '85vh',
            maxHeight: '800px',
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid',
            borderColor: 'divider',
            transition: isDragging ? 'none' : 'box-shadow 0.3s ease',
          }}
        >
          {/* Draggable Header */}
          <Box
            className="drag-handle"
            onMouseDown={handleMouseDown}
            sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: isDragging ? 'grabbing' : 'grab',
              bgcolor: 'grey.50',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              userSelect: 'none'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                Assign New Task
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/${department}/department/list-task-assigned-me`);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium shadow-sm"
              >
                <List size={14} />
                View All Tasks
              </button>
              <IconButton
                size="small"
                onClick={() => setIsTaskDialogOpen(false)}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <X size={20} />
              </IconButton>
            </Box>
          </Box>

          {/* Scrollable Content Area */}
          <Box sx={{
            flexGrow: 1,
            overflowY: 'auto',
            minHeight: 0,
            p: 0
          }}>
            <EnqRelatedTask
              id={displayData?._id}
              onClose={() => {
                setIsTaskDialogOpen(false);
                setIsTaskDrawerOpen(false);
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DetailView;