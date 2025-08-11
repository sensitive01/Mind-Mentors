/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Trash2, Plus } from "lucide-react";
import { updateEnquiry } from "../../../../api/service/employee/EmployeeService";
import { useNavigate } from "react-router-dom";
import {
  formatEmail,
  formatWhatsAppNumber,
} from "../../../../utils/formatContacts";
import EditDialogBox from "./edit/EditDialogBox";

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
        // Handle email overflow
        wordBreak: isEmail ? "break-all" : "normal",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: isEmail ? "normal" : "nowrap",
        fontSize: isEmail ? "0.85rem" : "1rem",
        maxWidth: "100%",
      }}
      title={isEmail ? value : undefined} // Show full email on hover
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

const DetailView = ({ data, showEdit, onEditClose, onEditSave }) => {
  const navigate = useNavigate();
  const department = localStorage.getItem("department");
  const empId = localStorage.getItem("empId");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState(data);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

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
    console.log("Updated data:", formData);
    const response = await updateEnquiry(formData, empId);
    console.log("Response0", response);
    if (response.status === 200) {
      onEditSave(response.data);
    }
    handleCloseEdit();
  };

  // Helper function to format email for better display
  const formatEmailForDisplay = (email) => {
    if (!email) return "N/A";

    const formattedEmail = formatEmail(email);

    // If email is too long, truncate intelligently
    if (formattedEmail.length > 30) {
      const atIndex = formattedEmail.indexOf("@");
      if (atIndex > 0) {
        const username = formattedEmail.substring(0, atIndex);
        const domain = formattedEmail.substring(atIndex);

        // Show first 10 chars of username + ... + full domain
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
      {/* Content */}
      <Box>
        <Grid container spacing={4}>
          {/* Parent Information */}
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

          {/* Kid Information */}
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

          {/* Programs */}
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

          {/* Status Information */}
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

          {/* Messages and Notes */}
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
      </Box>

      <EditDialogBox
        showEdit={showEdit}
        onEditClose={onEditClose}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
      />
    </Box>
  );
};

export default DetailView;
