import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  TextField,
  Grid,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { ArrowRight, ArrowLeft, Users, Baby } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { parentKidsRegistration } from "../../api/service/parent/ParentService";
import { StepperContext } from "../completion-status-bar/StepperContext";
import { useDispatch, useSelector } from "react-redux";
import { setFormData } from "../../store/regDataParentKidsSlice";
import mindMentorImage from "../../assets/newLogo.png";

const ParentKidsRegistration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { nextStep, previousStep } = useContext(StepperContext);
  const { state } = location;
  const regFormData = useSelector((state) => state.formData);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormDatas] = useState({
    isMobileWhatsapp: regFormData?.isMobileWhatsapp,
    email: regFormData?.email,
    mobile: regFormData?.mobile,
    name: regFormData?.name,
    kidsName: regFormData?.childName || "",
    age: regFormData.age || "",
    gender: regFormData.gender || "",
    pincode: regFormData.pincode || "",
    city: regFormData.city || "",
    state: regFormData.state || "",
    enqId: regFormData.enqId || "",
    parentId: regFormData?.parentId || "",
  });

  const [isCooldown, setIsCooldown] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const steps = ['Parent Registration', 'Kids Registration', 'Enrollment'];
  const currentStep = 2; // Kids Registration is step 2

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDatas((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchLocationFromPincode = async (pincode) => {
    if (pincode.length !== 6) return;

    setIsLoadingLocation(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data[0].Status === "Success" && data[0].PostOffice.length > 0) {
        const postOffice = data[0].PostOffice[0];
        setFormDatas((prev) => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State,
        }));
        toast.success(
          `Location found: ${postOffice.District}, ${postOffice.State}`
        );
      } else {
        toast.error("Invalid pincode or location not found");
        setFormDatas((prev) => ({
          ...prev,
          city: "",
          state: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      toast.error("Failed to fetch location. Please try again.");
      setFormDatas((prev) => ({
        ...prev,
        city: "",
        state: "",
      }));
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handlePincodeChange = (e) => {
    const { value } = e.target;
    setFormDatas((prev) => ({
      ...prev,
      pincode: value,
      city: "",
      state: "",
    }));

    if (value.length === 6 && /^\d{6}$/.test(value)) {
      fetchLocationFromPincode(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCooldown) return;

    const { kidsName, age, gender, pincode, city, state } = formData;
    console.log(formData);
    if (!kidsName || !age || !gender || !pincode || !city || !state) {
      toast.error("Please fill out all fields before submitting.");
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5000);
      return;
    }

    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 5000);

    dispatch(setFormData(formData));
    try {
      const result = await parentKidsRegistration(formData, state);
      if (result.status === 201) {
        toast.success(result?.data?.message);
        localStorage.setItem("parentId", formData.parentId);

        setTimeout(() => {
          navigate("/parent/dashboard");
        }, 2000);
      }
    } catch (err) {
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      if (window.performance && performance.navigation.type === 2) {
        previousStep();
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [previousStep]);

  const handleSkipDashboard = () => {
    localStorage.setItem("parentId", formData.parentId);
    toast.info("Kids Registration is incomplete, moving to dashboard");
    if (isCooldown) return;
    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 5000);

    setTimeout(() => {
      navigate("/parent/dashboard");
    }, 1500);
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        background: '#642b8f',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: { xs: 2, sm: 3 },
          minHeight: { xs: '64px', sm: '72px' },
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={mindMentorImage}
            alt="Mind Mentorz Logo"
            style={{
              height: isMobile ? '28px' : '36px',
              width: 'auto',
              filter: 'brightness(0) invert(1)',
            }}
          />
        </Box>

        {/* Back Button */}
        <IconButton
          onClick={() => {
            previousStep();
            navigate(-1);
          }}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            width: { xs: 40, sm: 44 },
            height: { xs: 40, sm: 44 },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
            },
          }}
        >
          <ArrowLeft size={isMobile ? 18 : 20} />
        </IconButton>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          px: { xs: 2, sm: 4 },
          py: { xs: 1, sm: 2 },
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255,255,255,0.5)',
          },
        }}
      >
        {/* Main Card */}
        <Card
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '600px', md: '750px', lg: '850px' },
            minHeight: 'auto',
            backgroundColor: 'white',
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            my: { xs: 1, sm: 2 },
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
            }}
          >
            {/* Kids Registration Avatar */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: { xs: 2, sm: 3 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 60, sm: 70, md: 80 },
                  height: { xs: 60, sm: 70, md: 80 },
                  backgroundColor: '#642b8f',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Baby size={isMobile ? 24 : isTablet ? 28 : 32} style={{ color: 'white' }} />
              </Box>
            </Box>

            {/* Stepper */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Stepper activeStep={currentStep - 1} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          fontWeight: 500,
                        },
                        '& .MuiStepIcon-root': {
                          color: '#e0e0e0',
                          fontSize: { xs: '1.2rem', sm: '1.5rem' },
                        },
                        '& .MuiStepIcon-root.Mui-active': {
                          color: '#642b8f',
                        },
                        '& .MuiStepIcon-root.Mui-completed': {
                          color: '#642b8f',
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Header Text */}
            <Typography
              variant="h5"
              sx={{
                color: '#2c3e50',
                fontWeight: 700,
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                textAlign: 'center',
              }}
            >
              Student Registration Form
            </Typography>

            {/* Form Container */}
            <Box component="form" onSubmit={handleSubmit}>
              {/* Personal Information Section */}
              <Card
                sx={{
                  mb: 3,
                  border: '2px solid #642b8f',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(100, 43, 143, 0.1)',
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#642b8f',
                      fontWeight: 600,
                      mb: 2,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Users size={20} />
                    Personal Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography
                        sx={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#2c3e50',
                          mb: 1,
                        }}
                      >
                        Kids Name
                      </Typography>
                      <TextField
                        name="kidsName"
                        value={formData.kidsName || state?.childName}
                        onChange={handleChange}
                        placeholder="Kids Name"
                        fullWidth
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: '#e0e0e0',
                              borderWidth: '2px',
                            },
                            '&:hover fieldset': {
                              borderColor: '#642b8f',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#642b8f',
                            },
                          },
                          '& .MuiInputBase-input': {
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            py: { xs: 1.5, sm: 2 },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography
                        sx={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#2c3e50',
                          mb: 1,
                        }}
                      >
                        Age
                      </Typography>
                      <TextField
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Enter age"
                        fullWidth
                        required
                        inputProps={{ min: 1 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: '#e0e0e0',
                              borderWidth: '2px',
                            },
                            '&:hover fieldset': {
                              borderColor: '#642b8f',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#642b8f',
                            },
                          },
                          '& .MuiInputBase-input': {
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            py: { xs: 1.5, sm: 2 },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography
                        sx={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#2c3e50',
                          mb: 1,
                        }}
                      >
                        Gender
                      </Typography>
                      <TextField
                        select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: '#e0e0e0',
                              borderWidth: '2px',
                            },
                            '&:hover fieldset': {
                              borderColor: '#642b8f',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#642b8f',
                            },
                          },
                          '& .MuiInputBase-input': {
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            py: { xs: 1.5, sm: 2 },
                          },
                        }}
                      >
                        <MenuItem value="">Select Gender</MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Location Information Section */}
              <Card
                sx={{
                  mb: 3,
                  border: '2px solid #642b8f',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(100, 43, 143, 0.1)',
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#642b8f',
                      fontWeight: 600,
                      mb: 2,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                    }}
                  >
                    Location Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        sx={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#2c3e50',
                          mb: 1,
                        }}
                      >
                        Pincode *
                      </Typography>
                      <TextField
                        name="pincode"
                        value={formData.pincode}
                        onChange={handlePincodeChange}
                        placeholder="Enter 6-digit pincode"
                        fullWidth
                        required
                        inputProps={{
                          maxLength: 6,
                          pattern: "[0-9]{6}",
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: '#e0e0e0',
                              borderWidth: '2px',
                            },
                            '&:hover fieldset': {
                              borderColor: '#642b8f',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#642b8f',
                            },
                          },
                          '& .MuiInputBase-input': {
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            py: { xs: 1.5, sm: 2 },
                          },
                        }}
                      />
                      {isLoadingLocation && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <CircularProgress size={16} sx={{ mr: 1, color: '#642b8f' }} />
                          <Typography sx={{ fontSize: '0.85rem', color: '#642b8f' }}>
                            Fetching location...
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        sx={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#2c3e50',
                          mb: 1,
                        }}
                      >
                        City
                      </Typography>
                      <TextField
                        name="city"
                        value={formData.city}
                        placeholder="City will be auto-filled"
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#f5f5f5',
                            '& fieldset': {
                              borderColor: '#e0e0e0',
                              borderWidth: '2px',
                            },
                          },
                          '& .MuiInputBase-input': {
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            py: { xs: 1.5, sm: 2 },
                            cursor: 'not-allowed',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        sx={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#2c3e50',
                          mb: 1,
                        }}
                      >
                        State
                      </Typography>
                      <TextField
                        name="state"
                        value={formData.state}
                        placeholder="State will be auto-filled"
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#f5f5f5',
                            '& fieldset': {
                              borderColor: '#e0e0e0',
                              borderWidth: '2px',
                            },
                          },
                          '& .MuiInputBase-input': {
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            py: { xs: 1.5, sm: 2 },
                            cursor: 'not-allowed',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 1, sm: 1.5 },
                  mt: { xs: 2, sm: 3 },
                }}
              >
                <Button
                  onClick={() => {
                    previousStep();
                    navigate(-1);
                  }}
                  variant="contained"
                  sx={{
                    backgroundColor: '#642b8f',
                    flex: '0 0 auto',
                    minWidth: { xs: '70px', sm: '90px' },
                    py: { xs: 1.25, sm: 1.5 },
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#512166',
                    },
                  }}
                  startIcon={<ArrowLeft size={16} />}
                >
                  Back
                </Button>

                <Button
                  onClick={handleSkipDashboard}
                  variant="outlined"
                  disabled={isCooldown}
                  sx={{
                    borderColor: '#642b8f',
                    color: '#642b8f',
                    flex: 1,
                    py: { xs: 1.25, sm: 1.5 },
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    borderWidth: '2px',
                    '&:hover': {
                      backgroundColor: '#642b8f',
                      color: 'white',
                      borderColor: '#642b8f',
                      borderWidth: '2px',
                    },
                    '&:disabled': {
                      borderColor: '#bdc3c7',
                      color: '#bdc3c7',
                    },
                  }}
                >
                  Skip to Dashboard
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isCooldown}
                  sx={{
                    backgroundColor: '#642b8f',
                    flex: '0 0 auto',
                    minWidth: { xs: '70px', sm: '90px' },
                    py: { xs: 1.25, sm: 1.5 },
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#512166',
                    },
                    '&:disabled': {
                      backgroundColor: '#bdc3c7',
                      color: 'white',
                    },
                  }}
                  endIcon={<ArrowRight size={16} />}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <ToastContainer
        position={isMobile ? "top-center" : "top-right"}
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        toastClassName="!text-sm !rounded-lg"
      />
    </Box>
  );
};

export default ParentKidsRegistration;