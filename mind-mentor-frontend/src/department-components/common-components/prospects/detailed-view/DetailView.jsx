/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  fetchThePhysicalCenters,
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
import Swal from "sweetalert2";

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;
import logo from "../../../../assets/mindmentorz.png";
import { savepaymentInfo } from "../../../../api/service/parent/ParentService";

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
  const navigate = useNavigate();
  const department = localStorage.getItem("department");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState(data);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [physicalCenter, setPhysicalCenter] = useState([]);
  const [verifyPaymentDialogOpen, setIsVerifyPaymentDialogOpen] =
    useState(false);

  useEffect(() => {
    setFormData(data);
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
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    console.log("Updated data:", formData);
    const response = await updateEnquiry(formData);
    console.log("Response0", response);
    if (response.status === 200) {
      onEditSave(response.data);
    }
    handleCloseEdit();
  };

  // const handleUpdatePayment = async (link) => {
  //   try {
  //     console.log(link);

  //     const cleanUrl = link?.replace("/payment-details/", "") || "";
  //     if (!cleanUrl) return null;

  //     const parsedData = JSON.parse(atob(cleanUrl));
  //     console.log("parsedData", parsedData);

  //     const paymentData = {
  //       enqId: parsedData.enqId || null,
  //       kidId: parsedData.kidId,
  //       kidName: parsedData.kidName,
  //       amount: parsedData.totalAmount,
  //       classDetails: {
  //         name:
  //           parsedData.selectionType === "class"
  //             ? `${parsedData.selectedCenter} - ${parsedData.selectedClass}`
  //             : parsedData.kitItem,
  //         coach: "Not Specified",
  //         day: parsedData.selectedClass || "Not Specified",
  //         classType: parsedData.selectedPackage,
  //         numberOfClasses: parsedData.offlineClasses + parsedData.onlineClasses,
  //         centerId: parsedData.centerId,
  //         centerName: parsedData.centerName,
  //         classMode:parsedData.classMode
  //       },
  //       whatsappNumber: parsedData.whatsappNumber,
  //       selectionType: parsedData.selectionType,
  //       kitItem: parsedData.kitItem,
  //       baseAmount: parsedData.baseAmount,
  //       gstAmount: parsedData.gstAmount,
  //       programs: parsedData.programs,
  //       offlineClasses: parsedData.offlineClasses,
  //       onlineClasses: parsedData.onlineClasses,
  //       selectedCenter: parsedData.selectedCenter,
  //       selectedClass: parsedData.selectedClass,
  //       selectedPackage: parsedData.selectedPackage,
  //     };

  //     console.log("paymentData", paymentData);

  //     const amountInPaise = Math.round(paymentData.amount * 100);
  //     console.log(amountInPaise);

  //     const options = {
  //       key: RAZORPAY_KEY,
  //       amount: amountInPaise,
  //       currency: "INR",
  //       name: "MindMentorz",
  //       description:
  //         paymentData.selectionType === "class"
  //           ? "Class Payment"
  //           : `Kit Payment - ${paymentData.kitItem}`,
  //       image: logo,
  //       handler: async (response) => {
  //         try {
  //           console.log("Response", response);
  //           const { razorpay_payment_id } = response;

  //           const savepayment = await savepaymentInfoOperation(
  //             {
  //               ...paymentData,
  //               razorpay_payment_id: razorpay_payment_id,
  //             },
  //             razorpay_payment_id
  //           );
  //           console.log("Payment save response:", savepayment);

  //           if (savepayment.status === 201) {
  //             Swal.fire({
  //               title: "Payment Done Successfully",
  //               icon: "success",
  //               confirmButtonText: "OK",
  //             }).then(() => {
  //               navigate(`/${department}/department/enrollment-data`);
  //             });
  //           } else {
  //             Swal.fire({
  //               title: "Payment Success, but failed to record!",
  //               text: "Please contact support.",
  //               icon: "warning",
  //               confirmButtonText: "OK",
  //             });
  //           }
  //         } catch (err) {
  //           console.error(
  //             "Error in verifying payment or updating status:",
  //             err
  //           );
  //           Swal.fire({
  //             title: "Payment Success, but an error occurred!",
  //             text: "Please contact support.",
  //             icon: "error",
  //             confirmButtonText: "OK",
  //           });
  //         }
  //       },
  //       theme: {
  //         color: "#3399cc",
  //       },
  //     };

  //     const razorpay = new window.Razorpay(options);

  //     razorpay.on("payment.failed", (response) => {
  //       Swal.fire({
  //         title: "Payment Failed",
  //         text: `Reason: ${response.error.description}`,
  //         icon: "error",
  //         confirmButtonText: "Retry",
  //       });
  //     });

  //     razorpay.open();
  //   } catch (error) {
  //     console.error("Error in fetching order URL:", error);
  //     Swal.fire({
  //       title: "Error",
  //       text: "Unable to initiate payment. Please try again later.",
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };

  const handleGetPaymentId = async(id)=>{
    const response = await getThePaymentId(id)
    console.log("update",response)
    if(response.status===200){
      navigate(`/super-admin/department/payment-details/${response?.data?.paymentData?.paymentId}`)
    }
  }

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
                <DetailCard title="EMAIL" value={formatEmail(data.email)} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="WHATSAPP NUMBER"
                  value={formatWhatsAppNumber(data.whatsappNumber)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard
                  title="CONTACT NUMBER"
                  value={formatWhatsAppNumber(data.contactNumber)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="ADDRESS" value={data.address} />
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
                <DetailCard title="KID PINCODE" value={data.pincode} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="KID CITY" value={data.city} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="KID STATE" value={data.state} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="SCHOOL NAME" value={data.schoolName} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="SCHOOL PINCODE" value={data.schoolPincode} />
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

              <Grid item xs={12} md={3}>
                <DetailCard title="ENQUIRY TYPE" value={data.enquiryType} />
              </Grid>
              <Grid item xs={12} md={3}>
                <DetailCard title="ENQUIRY FIELD" value={data.enquiryField} />
              </Grid>
              {data.enquiryField === "prospects" && (
                <Grid item xs={12} md={3} style={{ overflow: "visible" }}>
                  <DetailCard
                    title={
                      data.scheduleDemo?.status === "Pending"
                        ? "SCHEDULE DEMO CLASS"
                        : "DEMO CLASS ACTIONS"
                    }
                    value={
                      <div className="flex flex-col gap-3  rounded-lg">
                        {data.scheduleDemo?.status === "Pending" ? (
                          <button
                            onClick={() =>
                              navigate(
                                `/${department}/department/schedule-demo-class-list-individually/${data._id}/false`
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
                                  `/${department}/department/schedule-demo-class-list-individually/${data._id}/true`
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

              {( data.paymentStatus === "Pending"|| data.paymentStatus === "Success") && (
                <Grid item xs={12} md={3} style={{ overflow: "visible" }}>
                  <DetailCard
                    title={
                      data.paymentStatus === "Pending"
                        ? "CHOOSE CLASS PACKAGE"
                        : "VIEW PAYMENT"
                    }
                    value={
                      <div className="flex flex-col gap-1 w-full">
                        {data.paymentStatus === "Pending" ? (
                          <button
                            onClick={() => setIsPaymentDialogOpen(true)}
                            className="w-full px-2 py-1 bg-white text-black border-2 border-primary hover:bg-primary/80 hover:text-white hover:border-primary/80 transition-all duration-200 text-sm font-medium rounded-md shadow-sm"
                          >
                            Choose class package
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleGetPaymentId(data._id)}
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

      <PaymentDialog
        open={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        data={data}
        enqId={formData._id}
      />

      <PaymentVerification
        data={data.paymentLink}
        open={verifyPaymentDialogOpen}
        onCancel={() => setIsVerifyPaymentDialogOpen(false)}
        physicalCenter={physicalCenter}
      />
    </Box>
  );
};

export default DetailView;
