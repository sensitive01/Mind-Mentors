/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Box, Grid, Typography, IconButton, Divider } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { updateEnquiry } from "../../../../api/service/employee/EmployeeService";
import { useNavigate } from "react-router-dom";
import {
  formatEmail,
  formatWhatsAppNumber,
} from "../../../../utils/formatContacts";
import EditDialogBox from "./edit/EditDialogBox";
import { X, List } from "lucide-react";
import EnqRelatedTask from "../../prospects/detailed-view/EnqRelatedTask"; // Using shared component

const DetailCard = ({ title, value, isEmail = false }) => (
  <Box
    sx={{
      p: 2.5,
      borderRadius: 2,
      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 1,
    }}
  >
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.5px" }}
    >
      {title}
    </Typography>
    <Typography
      variant="body1"
      color="text.primary"
      sx={{
        lineHeight: 1.6,
        wordBreak: isEmail ? "break-all" : "normal",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: isEmail ? "normal" : "nowrap",
        fontSize: isEmail ? "0.85rem" : "1rem",
        maxWidth: "100%",
      }}
      title={isEmail ? value : undefined}
    >
      {value || "N/A"}
    </Typography>
  </Box>
);

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

const DetailView = ({ data, showEdit, onEditClose, onEditSave, openTaskDialog }) => {
  const navigate = useNavigate();
  const department = localStorage.getItem("department");
  const empId = localStorage.getItem("empId");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState(data);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // State for task assignment
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 450, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (openTaskDialog) {
      setIsTaskDialogOpen(true);
    }
  }, [openTaskDialog]);

  // Drag handlers for the task dialog
  const handleMouseDown = (e) => {
    if (e.target.closest("button") || e.target.closest("input")) {
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
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const response = await updateEnquiry(formData, empId);
    if (response.status === 200) {
      onEditSave(response.data);
    }
    handleCloseEdit();
  };

  const formatEmailForDisplay = (email) => {
    if (!email) return "N/A";
    const formattedEmail = formatEmail(email);
    if (formattedEmail.length > 30) {
      const atIndex = formattedEmail.indexOf("@");
      if (atIndex > 0) {
        const username = formattedEmail.substring(0, atIndex);
        const domain = formattedEmail.substring(atIndex);
        if (username.length > 10) {
          return `${username.substring(0, 10)}...${domain}`;
        }
      }
    }
    return formattedEmail;
  };

  if (!data) return null;

  return (
    <Box sx={{ position: "relative" }}>
      <Box>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <SectionTitle>Parent Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <DetailCard title="PARENT NAME" value={data.parentName} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="EMAIL"
                  value={formatEmailForDisplay(data.email)}
                  isEmail={true}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="WHATSAPP NUMBER"
                  value={formatWhatsAppNumber(data?.whatsappNumber)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="CONTACT NUMBER"
                  value={formatWhatsAppNumber(
                    data?.contactNumber || data?.whatsappNumber
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <SectionTitle>Kid Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <DetailCard title="KID NAME" value={data.kidName} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="AGE" value={data.kidsAge} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="GENDER" value={data.kidsGender} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="PINCODE" value={data.pincode} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <SectionTitle>Program Details</SectionTitle>
            <Grid container spacing={3}>
              {data.programs?.map((program, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <DetailCard
                    title={`PROGRAM ${index + 1}`}
                    value={`${program.program} (${program.level})`}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <SectionTitle>Status Information</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <DetailCard title="PAYMENT STATUS" value={data.paymentStatus} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="SOURCE" value={data.source} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="DISPOSITION" value={data.disposition} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="ENROLLMENT STATUS"
                  value={data.enquiryStatus}
                />
              </Grid>

              {data.enquiryStatus === "Active" && !data.classAssigned && (
                <Grid item xs={12} md={3} style={{ overflow: "visible" }}>
                  <DetailCard
                    title={"VIEW PACKAGE"}
                    value={
                      <div className="flex flex-col gap-3 border-2 border-primary rounded-lg">
                        <button
                          onClick={() =>
                            navigate(
                              `/${department}/department/view-parent-package-details/${data._id}`
                            )
                          }
                          className="w-full px-2 py-2 bg-white text-black border-2 border-primary hover:bg-primary/80 hover:border-primary/80 hover:text-white transition-all duration-800 text-sm font-medium rounded-md shadow-2xl"
                        >
                          View Package
                        </button>
                      </div>
                    }
                  />
                </Grid>
              )}
              {data.enquiryStatus === "Active" && !data.classAssigned && (
                <Grid item xs={12} md={3} style={{ overflow: "visible" }}>
                  <DetailCard
                    title={"ASSIGN CLASS"}
                    value={
                      <div className="flex flex-col gap-3 border-2 border-primary rounded-lg">
                        <button
                          onClick={() =>
                            navigate(
                              `/${department}/department/assign-whole-plan-class/${data._id}`
                            )
                          }
                          className="w-full px-2 py-2 bg-white text-black border-2 border-primary hover:bg-primary/80 hover:border-primary/80 hover:text-white transition-all duration-800 text-sm font-medium rounded-md shadow-2xl"
                        >
                          Assign Class
                        </button>
                      </div>
                    }
                  />
                </Grid>
              )}
              {data.enquiryStatus === "Active" && data.classAssigned && (
                <Grid item xs={12} md={3} style={{ overflow: "visible" }}>
                  <DetailCard
                    title={"VIEW ASSIGNED CLASS"}
                    value={
                      <div className="flex flex-col gap-3 border-2 border-primary rounded-lg">
                        <button
                          onClick={() =>
                            navigate(
                              `/${department}/department/display-whole-selectedClass/${data._id}`
                            )
                          }
                          className="w-full px-2 py-2 bg-white text-black border-2 border-primary hover:bg-primary/80 hover:border-primary/80 hover:text-white transition-all duration-800 text-sm font-medium rounded-md shadow-2xl"
                        >
                          View Assigned Class
                        </button>
                      </div>
                    }
                  />
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <SectionTitle>Messages & Notes</SectionTitle>
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
                    Messages
                  </Typography>
                  <Typography variant="body1">
                    {data.message || "No messages"}
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
                  <Typography variant="body1">
                    {data.notes || "No notes"}
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
                  <Typography variant="body1">
                    {data.lastNoteAction || "No status updates"}
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
      </Box>

      <EditDialogBox
        showEdit={showEdit}
        onEditClose={onEditClose}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
      />

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
              id={data?._id}
              onClose={() => {
                setIsTaskDialogOpen(false);
              }}
            />
          </Box>
        </Box>
      )}

    </Box>
  );
};

export default DetailView;
