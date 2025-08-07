/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
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

const DetailCard = ({ title, value }) => (
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
    <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.6 }}>
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
  console.log("DetailView - Initial Data:", data);
  const navigate = useNavigate();
  const department = localStorage.getItem("department");
  const empId = localStorage.getItem("empId")

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState(data);
  const [currentData, setCurrentData] = useState(data); // Track current display data
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [physicalCenter, setPhysicalCenter] = useState([]);
  const [programsData, setProgramsData] = useState([]);

  const [verifyPaymentDialogOpen, setIsVerifyPaymentDialogOpen] =
    useState(false);

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
    setCurrentData(data); // Update current display data when data prop changes
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
    onEditClose(); // Call the parent's onEditClose
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
      const response = await updateEnquiry(formData,empId);
      console.log("DetailView - Save response:", response);
      
      if (response.status === 200) {
        console.log("DetailView - Response data:", response.data);
        
        // Create updated data with the form data as priority
        // This ensures that what user edited is what gets displayed
        const updatedData = {
          ...currentData, // Keep existing data as fallback
          ...formData, // Use the form data that user actually edited
          ...response.data, // Override with any server-specific data
          // Ensure name fields are preserved from formData
          parentName: formData.parentName || response.data?.parentName || currentData.parentName,
          kidName: formData.kidName || response.data?.kidName || currentData.kidName,
          parentFirstName: formData.parentFirstName || response.data?.parentFirstName || currentData.parentFirstName,
          parentLastName: formData.parentLastName || response.data?.parentLastName || currentData.parentLastName,
          kidFirstName: formData.kidFirstName || response.data?.kidFirstName || currentData.kidFirstName,
          kidLastName: formData.kidLastName || response.data?.kidLastName || currentData.kidLastName,
        };
        
        console.log("DetailView - Final updated data:", updatedData);
        console.log("DetailView - Parent name will display:", getDisplayParentName(updatedData));
        console.log("DetailView - Kid name will display:", getDisplayKidName(updatedData));
        
        // Update both current display data and call parent callback
        setCurrentData(updatedData);
        setFormData(updatedData); // Also update formData to stay in sync
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

  // Use currentData for display to show updated values
  const displayData = currentData;
  console.log("DetailView - Display data:", displayData);

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
                <DetailCard
                  title="PARENT NAME"
                  value={getDisplayParentName(displayData)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="EMAIL"
                  value={formatEmail(displayData?.email)}
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
                      <div className="flex flex-col gap-3  rounded-lg">
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
                              className="w-full px-2 py-1 bg-white text-black border-2 border-primary hover:bg-primary/80 hover:text-white  hover:border-primary/80 transition-all duration-200 text-sm font-medium rounded-md shadow-sm"
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
                  <Typography variant="body1">
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
                  <Typography variant="body1">
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
                  <Typography variant="body1">
                    {displayData?.lastNoteAction || "No status updates"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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
  );
};

export default DetailView;