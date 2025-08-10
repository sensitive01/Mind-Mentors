import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Phone, Mail, User, MapPin, Users, CheckCircle, Clock, Send } from 'lucide-react';

const ParentLoginSystem = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("in");
  const [isCooldown, setIsCooldown] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  // Form state matching your original structure
  const [formState, setFormState] = useState({
    mobile: "",
    email: "",
    name: "",
    childName: "",
    isMobileWhatsapp: true,
    age: "",
    gender: "",
    pincode: "",
    city: "",
    state: "",
    enqId: "",
    parentId: ""
  });

  const otpRefs = useRef([]);

  // Your original mindMentorImage - placeholder for now
  const mindMentorImage = "/api/placeholder/200/80";

  // Timer effect for OTP (from your original code)
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Auto-submit OTP when all digits are filled (from your original code)
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleOtpSubmit();
    }
  }, [otp]);

  // Your original validation and API functions (simulated)
  const validateForm = (mobile, country) => {
    const errors = {};
    const formattedNumber = `+${country === 'in' ? '91' : '1'}${mobile}`;
    
    if (!mobile || mobile.length < 10) {
      errors.mobileNumber = "Please enter a valid mobile number";
    }
    
    return { errors, formattedNumber };
  };

  const parentLogin = async (formattedNumber) => {
    console.log("Calling parentLogin API with:", formattedNumber);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          data: {
            message: "OTP sent successfully",
            value: "0",
            phoneNumber: formattedNumber,
            data: {
              enqId: "123",
              parentId: "456"
            }
          }
        });
      }, 1000);
    });
  };

  const verifyOtp = async (otpString) => {
    console.log("Calling verifyOtp API with:", otpString);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          data: {
            message: "OTP verified successfully",
            parentData: { _id: "parent123" }
          }
        });
      }, 1000);
    });
  };

  const registerKidData = async (formData) => {
    console.log("Calling registerKidData API with:", formData);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          data: { message: "Parent registration successful" }
        });
      }, 1000);
    });
  };

  const parentKidsRegistration = async (formData) => {
    console.log("Calling parentKidsRegistration API with:", formData);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 201,
          data: { 
            message: "Kids registration successful",
            data: { id: "kid123" }
          }
        });
      }, 1000);
    });
  };

  // Format timer (from your original code)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Your original mobile submit handler
  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    if (isCooldown) return;

    const { errors, formattedNumber } = validateForm(mobile, country.toUpperCase());
    if (errors?.mobileNumber) {
      alert(errors.mobileNumber);
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5000);
      return;
    }

    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 5000);

    try {
      const parentLoginResponse = await parentLogin(formattedNumber);
      console.log("parentLoginResponse", parentLoginResponse);
      
      if (parentLoginResponse.status === 200 || parentLoginResponse.status === 201) {
        alert(parentLoginResponse?.data?.message);
        setTimeout(() => {
          setCurrentPage(2);
          setTimeLeft(60);
          setIsTimerActive(true);
          setCanResend(false);
          setFormState(prev => ({
            ...prev,
            mobile: formattedNumber,
            enqId: parentLoginResponse?.data?.data?.enqId,
            parentId: parentLoginResponse?.data?.data?.parentId
          }));
        }, 1500);
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  // Your original OTP handlers
  const handleOtpChange = (index, value) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        otpRefs.current[index - 1].focus();
      } else {
        const updatedOtp = [...otp];
        updatedOtp[index] = "";
        setOtp(updatedOtp);
      }
    }
  };

  const handleOtpSubmit = async () => {
    if (!isTimerActive && !canResend) {
      alert("OTP has expired. Please request a new one.");
      return;
    }

    try {
      const otpResponse = await verifyOtp(otp.join(""));
      if (otpResponse.status === 200) {
        alert(otpResponse?.data?.message);
        
        setTimeout(() => {
          if (formState.parentId) {
            localStorage.setItem("parentId", otpResponse?.data?.parentData?._id);
            alert("Redirecting to dashboard...");
          } else {
            setCurrentPage(3);
          }
        }, 1500);
      } else {
        alert("Failed to verify OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error in verify OTP", err);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    try {
      const resendResponse = await parentLogin(formState.mobile);
      if (resendResponse.status === 200 || resendResponse.status === 201) {
        alert("OTP sent successfully!");
        setTimeLeft(60);
        setIsTimerActive(true);
        setCanResend(false);
        setOtp(["", "", "", ""]);
        if (otpRefs.current[0]) {
          otpRefs.current[0].focus();
        }
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Your original parent registration handler
  const handleParentRegistration = async (e) => {
    e.preventDefault();
    if (isCooldown) return;

    const { mobile, email, name, childName, isMobileWhatsapp } = formState;

    if (!email || !name || !childName || !mobile) {
      alert("Please fill out all fields before submitting.");
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5000);
      return;
    }

    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 5000);

    try {
      const response = await registerKidData(formState);
      if (response.status === 200) {
        alert(response.data.message);
        setTimeout(() => {
          setCurrentPage(4);
        }, 1000);
      }
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  // Your original location fetch function
  const fetchLocationFromPincode = async (pincode) => {
    if (pincode.length !== 6) return;

    setIsLoadingLocation(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0].Status === "Success" && data[0].PostOffice.length > 0) {
        const postOffice = data[0].PostOffice[0];
        setFormState(prev => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State,
        }));
        alert(`Location found: ${postOffice.District}, ${postOffice.State}`);
      } else {
        alert("Invalid pincode or location not found");
        setFormState(prev => ({
          ...prev,
          city: "",
          state: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("Failed to fetch location. Please try again.");
      setFormState(prev => ({
        ...prev,
        city: "",
        state: "",
      }));
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handlePincodeChange = (value) => {
    setFormState(prev => ({
      ...prev,
      pincode: value,
      city: "",
      state: "",
    }));

    if (value.length === 6 && /^\d{6}$/.test(value)) {
      fetchLocationFromPincode(value);
    }
  };

  // Your original kids registration handler
  const handleKidsRegistration = async (e) => {
    e.preventDefault();
    if (isCooldown) return;

    const { childName, age, gender, pincode, city, state } = formState;
    
    if (!childName || !age || !gender || !pincode || !city || !state) {
      alert("Please fill out all fields before submitting.");
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 5000);
      return;
    }

    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 5000);

    try {
      const result = await parentKidsRegistration(formState);
      if (result.status === 201) {
        alert(result?.data?.message);
        localStorage.setItem("parentId", formState.parentId);
        
        setTimeout(() => {
          alert("Registration completed! Redirecting to dashboard...");
          setCurrentPage(1);
          setFormState({
            mobile: "",
            email: "",
            name: "",
            childName: "",
            isMobileWhatsapp: true,
            age: "",
            gender: "",
            pincode: "",
            city: "",
            state: "",
            enqId: "",
            parentId: ""
          });
          setMobile("");
          setOtp(["", "", "", ""]);
        }, 2000);
      }
    } catch (err) {
      alert("Failed to submit the form. Please try again.");
    }
  };

  const handleSkipDashboard = () => {
    if (formState?.parentId) {
      localStorage.setItem("parentId", formState.parentId);
    }
    alert("Kids Registration is incomplete, moving to dashboard");
    if (isCooldown) return;
    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 5000);

    setTimeout(() => {
      alert("Redirecting to dashboard...");
    }, 1500);
  };

  // Enhanced PhoneInput component (simplified version of react-phone-input-2)
  const PhoneInput = ({ country, value, onChange, disabled, inputProps }) => (
    <div className="relative">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center z-10">
        <span className="text-sm font-medium text-gray-600 mr-2">🇮🇳 +91</span>
      </div>
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value, { countryCode: 'in' })}
        disabled={disabled}
        className="w-full pl-20 pr-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-[rgb(177,21,177)] focus:border-[rgb(177,21,177)] transition-colors disabled:bg-gray-100"
        placeholder={inputProps?.placeholder || "Enter your number"}
        {...inputProps}
      />
    </div>
  );

  // Page 1: Mobile Login
  const MobileLoginPage = () => (
    <div className="min-h-screen bg-gray-50 p-1 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-0.5rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)]">
        <div className="flex flex-col lg:flex-row h-full">
          <div className="bg-[rgb(177,21,177)] text-white w-full lg:w-2/5 flex flex-col justify-between h-[35vh] sm:h-1/2 lg:h-full px-4 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
            <div className="flex-grow flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
              <h2 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-2 sm:mb-6">
                Welcome to
              </h2>
              <img
                src={mindMentorImage}
                alt="Mind Mentorz Logo"
                className="w-full max-w-[160px] sm:max-w-xs md:max-w-sm lg:max-w-[80%] h-auto object-contain"
              />
            </div>
            <div className="flex justify-center lg:justify-start items-center w-full">
              <button
                onClick={() => alert("Back to site")}
                className="flex items-center text-xs sm:text-sm hover:underline transition-all duration-300 hover:opacity-80"
              >
                <ArrowLeft size={12} className="mr-1 sm:mr-2" />
                Back to site
              </button>
            </div>
          </div>

          <div className="w-full lg:w-3/5 flex items-center justify-center flex-grow lg:h-full p-3 sm:p-6 md:p-8 lg:p-12">
            <div className="w-full max-w-md mx-auto">
              <div className="flex flex-col items-center mb-4 sm:mb-8">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-[rgb(177,21,177)] mb-1 sm:mb-3">
                  Parents Login
                </h2>
                <p className="text-sm sm:text-lg text-black font-bold text-center">
                  Login to continue
                </p>
              </div>

              <form onSubmit={handleMobileSubmit} className="space-y-3 sm:space-y-6 w-full">
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="mobile" className="block text-xs sm:text-sm font-medium text-gray-700">
                    Enter Your WhatsApp Number
                  </label>
                  <PhoneInput
                    country={country}
                    value={mobile}
                    onChange={(value, countryData) => {
                      setMobile(value);
                      setCountry(countryData.countryCode);
                    }}
                    inputProps={{
                      name: "mobile",
                      required: true,
                      autoFocus: true,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full bg-[rgb(177,21,177)] text-white py-2.5 sm:py-3 px-4 rounded-lg border-b-4 hover:border-[rgb(177,21,177)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(177,21,177)] transition-all duration-300 text-sm sm:text-base font-medium flex items-center justify-center
                     ${isCooldown ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isCooldown}
                >
                  {isCooldown ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send OTP <ArrowRight size={14} className="ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Page 2: OTP Verification
  const OtpPage = () => (
    <div className="min-h-screen bg-gray-50 p-1 xs:p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-0.5rem)] xs:h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)]">
        <div className="flex flex-col lg:flex-row h-full">
          <div className="bg-[rgb(177,21,177)] text-white w-full lg:w-2/5 flex flex-col justify-between h-[30vh] xs:h-[32vh] sm:h-[40vh] md:h-1/2 lg:h-full px-3 py-3 xs:px-4 xs:py-4 sm:px-6 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">
            <div className="flex-grow flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
              <h2 className="text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight mb-1 xs:mb-2 sm:mb-4 md:mb-6">
                Welcome to
              </h2>
              <img
                src={mindMentorImage}
                alt="Mind Mentorz Logo"
                className="w-full max-w-[120px] xs:max-w-[140px] sm:max-w-[180px] md:max-w-sm lg:max-w-[80%] h-auto object-contain"
              />
            </div>
            <div className="flex justify-center lg:justify-start items-center w-full mt-2 xs:mt-3 sm:mt-4">
              <button
                onClick={() => setCurrentPage(1)}
                className="flex items-center text-xs xs:text-xs sm:text-sm hover:underline transition-all duration-300 hover:opacity-80"
              >
                <ArrowLeft size={14} className="mr-1 xs:mr-1 sm:mr-2" />
                Back to login
              </button>
            </div>
          </div>

          <div className="w-full lg:w-3/5 flex items-center justify-center flex-grow lg:h-full p-2 xs:p-3 sm:p-6 md:p-8 lg:p-12">
            <div className="w-full max-w-md mx-auto">
              <div className="flex flex-col items-center mb-3 xs:mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[rgb(177,21,177)] mb-1 xs:mb-1 sm:mb-2 md:mb-3">
                  Enter OTP
                </h2>
                <p className="text-xs xs:text-sm sm:text-base text-black font-bold text-center mb-1 xs:mb-1 sm:mb-2">
                  OTP sent to your WhatsApp number
                </p>
                <p className="text-xs xs:text-sm sm:text-base text-[rgb(177,21,177)] font-bold break-all">
                  {formState.mobile}
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleOtpSubmit(); }} className="space-y-3 xs:space-y-4 sm:space-y-6 w-full">
                <div className="flex justify-center gap-2 xs:gap-2 sm:gap-3 md:gap-4 mb-3 xs:mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      ref={(el) => (otpRefs.current[index] = el)}
                      className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-base xs:text-lg sm:text-xl font-bold border-2 border-gray-300 focus:outline-none rounded-md sm:rounded-lg focus:ring-2 focus:ring-[rgb(177,21,177)] focus:border-[rgb(177,21,177)] transition-colors"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/[^0-9]/g, ""))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      required
                      disabled={!isTimerActive && !canResend}
                    />
                  ))}
                </div>

                <div className="text-center mb-3 xs:mb-4">
                  {isTimerActive ? (
                    <p className="text-xs xs:text-sm sm:text-base text-gray-600 flex items-center justify-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Time remaining: <span className="font-bold text-[rgb(177,21,177)] ml-1">{formatTime(timeLeft)}</span>
                    </p>
                  ) : (
                    <p className="text-xs xs:text-sm sm:text-base text-red-600 font-medium">
                      OTP has expired
                    </p>
                  )}
                </div>

                <div className="space-y-2 xs:space-y-3">
                  <button
                    type="submit"
                    className={`w-full bg-[rgb(177,21,177)] text-white py-2 xs:py-2.5 sm:py-3 px-4 rounded-md sm:rounded-lg border-b-4 hover:border-[rgb(177,21,177)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(177,21,177)] transition-all duration-300 text-xs xs:text-sm sm:text-base font-medium flex items-center justify-center
                       ${(!isTimerActive && !canResend) || otp.some((digit) => digit === "") ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={(!isTimerActive && !canResend) || otp.some((digit) => digit === "")}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify & Continue
                    <ArrowRight size={14} className="ml-1 xs:ml-2" />
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className={`w-full bg-white text-[rgb(177,21,177)] border-2 border-[rgb(177,21,177)] py-2 xs:py-2.5 sm:py-3 px-4 rounded-md sm:rounded-lg hover:bg-[rgb(177,21,177)] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(177,21,177)] transition-all duration-300 text-xs xs:text-sm sm:text-base font-medium flex items-center justify-center
                       ${!canResend || isResending ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!canResend || isResending}
                  >
                    {isResending ? (
                      <div className="w-4 h-4 border-2 border-[rgb(177,21,177)] border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Resend OTP
                  </button>
                </div>

                <div className="text-center pt-1 xs:pt-2">
                  <p className="text-xs xs:text-xs sm:text-sm text-gray-500 leading-relaxed px-2">
                    Didn't receive the OTP? Check your WhatsApp messages or wait for the timer to resend.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Page 3: Parent Registration
  const ParentRegistrationPage = () => (
    <div className="min-h-screen bg-gray-50 p-1 xs:p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-0.5rem)] xs:h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)]">
        <div className="flex flex-col lg:flex-row h-full">
          <div className="bg-[rgb(177,21,177)] text-white w-full lg:w-2/5 flex flex-col justify-between h-[30vh] xs:h-[32vh] sm:h-[40vh] md:h-1/2 lg:h-full px-3 py-3 xs:px-4 xs:py-4 sm:px-6 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">
            <div className="flex-grow flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
              <h2 className="text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight mb-1 xs:mb-2 sm:mb-4 md:mb-6">
                Welcome to
              </h2>
              <img
                src={mindMentorImage}
                alt="Mind Mentorz Logo"
                className="w-full max-w-[120px] xs:max-w-[140px] sm:max-w-[180px] md:max-w-sm lg:max-w-[80%] h-auto object-contain"
              />
            </div>
            <div className="flex justify-center lg:justify-start items-center w-full mt-2 xs:mt-3 sm:mt-4">
              <button
                onClick={() => setCurrentPage(2)}
                className="flex items-center text-xs xs:text-xs sm:text-sm hover:underline transition-all duration-300 hover:opacity-80"
              >
                <ArrowLeft size={14} className="mr-1 xs:mr-1 sm:mr-2" />
                Back to previous
              </button>
            </div>
          </div>

          <div className="w-full lg:w-3/5 flex flex-col h-full">
            <div className="px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 pt-2 xs:pt-3 sm:pt-4 pb-2 xs:pb-3 sm:pb-4 border-b border-gray-100 flex-shrink-0">
              <div className="bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-[rgb(177,21,177)] rounded-full h-2 w-3/4 transition-all duration-500"></div>
              </div>
              <p className="text-xs text-gray-600">Step 3 of 4</p>
            </div>

            <div className="flex-1 flex flex-col justify-center px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-2 xs:py-3 sm:py-4">
              <div className="w-full max-w-3xl mx-auto">
                <div className="text-center mb-3 xs:mb-4 sm:mb-6">
                  <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[rgb(177,21,177)] mb-1 xs:mb-2">
                    Update More Details to your Profile
                  </h2>
                  <p className="text-xs xs:text-sm text-black">
                    The Details given will be kept confidential and will not be used for any marketing purposes
                  </p>
                </div>

                <form
                  onSubmit={handleParentRegistration}
                  className="space-y-3 xs:space-y-4 sm:space-y-5 border border-[rgb(177,21,177)] rounded-lg p-3 xs:p-4 sm:p-5 md:p-6"
                  noValidate
                >
                  <div className="space-y-1">
                    <div className="flex items-start mb-1 xs:mb-2">
                      <input
                        id="isMobileWhatsapp"
                        type="checkbox"
                        checked={formState.isMobileWhatsapp}
                        onChange={(e) => setFormState({
                          ...formState,
                          isMobileWhatsapp: e.target.checked,
                          mobile: e.target.checked ? formState.mobile : ""
                        })}
                        className="mt-0.5 h-3 w-3 xs:h-4 xs:w-4 text-[rgb(177,21,177)] rounded"
                      />
                      <label htmlFor="isMobileWhatsapp" className="ml-2 text-xs xs:text-sm font-medium text-[rgb(177,21,177)]">
                        Is Phone Number same as WhatsApp number
                      </label>
                    </div>

                    <PhoneInput
                      country={country}
                      value={formState.mobile}
                      onChange={(value, countryData) => {
                        setFormState({ ...formState, mobile: value });
                        setCountry(countryData.countryCode);
                      }}
                      disabled={formState.isMobileWhatsapp}
                      inputProps={{
                        name: "mobile",
                        required: true,
                        placeholder: formState.isMobileWhatsapp ? "" : "Enter your number",
                      }}
                    />

                    <p className="text-xs text-[rgb(177,21,177)]">
                      Will also be used for class notifications and to avoid calls
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full pl-10 pr-4 p-2 xs:p-2.5 sm:p-3 border border-gray-300 rounded-md text-xs xs:text-sm sm:text-base focus:ring-2 focus:ring-[rgb(177,21,177)] focus:border-[rgb(177,21,177)] transition-colors"
                        placeholder="Enter your email ID"
                        required
                      />
                    </div>
                    <p className="text-xs text-[rgb(177,21,177)]">
                      Will be used for sending payment invoices
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          className="w-full pl-10 pr-4 p-2 xs:p-2.5 sm:p-3 border border-gray-300 rounded-md text-xs xs:text-sm sm:text-base focus:ring-2 focus:ring-[rgb(177,21,177)] focus:border-[rgb(177,21,177)] transition-colors"
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      <p className="text-xs text-[rgb(177,21,177)]">
                        Guardian's name / Invoice name
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={formState.childName}
                          onChange={(e) => setFormState({ ...formState, childName: e.target.value })}
                          className="w-full pl-10 pr-4 p-2 xs:p-2.5 sm:p-3 border border-gray-300 rounded-md text-xs xs:text-sm sm:text-base focus:ring-2 focus:ring-[rgb(177,21,177)] focus:border-[rgb(177,21,177)] transition-colors"
                          placeholder="Enter your child name"
                          required
                        />
                      </div>
                      <p className="text-xs text-[rgb(177,21,177)]">Child Name</p>
                    </div>
                  </div>

                  <div className="flex w-full space-x-1 xs:space-x-2 sm:space-x-3 mt-3 xs:mt-4 sm:mt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(2)}
                      className="bg-[rgb(177,21,177)] w-1/4 py-2 xs:py-2.5 sm:py-3 px-1 xs:px-2 sm:px-4 text-white font-medium rounded-md transition duration-300 flex items-center justify-center border-b-4 hover:border-[rgb(177,21,177)] text-xs xs:text-sm"
                    >
                      <ArrowLeft size={12} className="mr-1" />
                      <span className="hidden xs:inline">Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSkipDashboard}
                      className={`bg-orange-500 w-1/2 py-2 xs:py-2.5 sm:py-3 px-1 xs:px-2 sm:px-4 text-white font-medium rounded-md transition duration-300 flex items-center justify-center border-b-4 hover:border-orange-600 text-xs xs:text-sm ${
                        isCooldown ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={isCooldown}
                    >
                      Skip to Dashboard
                    </button>

                    <button
                      type="submit"
                      className={`bg-[rgb(177,21,177)] w-1/4 py-2 xs:py-2.5 sm:py-3 px-1 xs:px-2 sm:px-4 text-white font-medium rounded-md transition duration-300 flex items-center justify-center border-b-4 hover:border-[rgb(177,21,177)] text-xs xs:text-sm ${
                        isCooldown ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={isCooldown}
                    >
                      {isCooldown ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span className="hidden xs:inline">Next</span>
                          <ArrowRight size={12} className="ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Page 4: Kids Registration
  const KidsRegistrationPage = () => (
    <div className="min-h-screen bg-gray-50 p-1 xs:p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-0.5rem)] xs:h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
        <div className="bg-[rgb(177,21,177)] text-white w-full lg:w-2/5 flex flex-col justify-between h-[30vh] xs:h-[32vh] sm:h-[40vh] md:h-1/2 lg:h-full px-3 py-3 xs:px-4 xs:py-4 sm:px-6 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">
          <div className="flex-grow flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
            <h2 className="text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight mb-1 xs:mb-2 sm:mb-4 md:mb-6">
              Welcome to
            </h2>
            <img
              src={mindMentorImage}
              alt="Mind Mentorz Logo"
              className="w-full max-w-[120px] xs:max-w-[140px] sm:max-w-[180px] md:max-w-sm lg:max-w-[80%] h-auto object-contain"
            />
          </div>
          <div className="flex justify-center lg:justify-start items-center w-full mt-2 xs:mt-3 sm:mt-4">
            <button
              onClick={() => setCurrentPage(3)}
              className="flex items-center text-xs xs:text-xs sm:text-sm hover:underline transition-all duration-300 hover:opacity-80"
            >
              <ArrowLeft size={14} className="mr-1 xs:mr-1 sm:mr-2" />
              Back to previous
            </button>
          </div>
        </div>

        <div className="lg:w-3/5 w-full p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto max-h-full flex flex-col">
          <div className="sticky top-0 z-10 bg-white pb-4">
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-[rgb(177,21,177)] rounded-full h-2 w-full transition-all duration-500"></div>
            </div>
            <p className="text-xs text-gray-600">Step 4 of 4</p>
          </div>

          <div className="w-full flex-grow overflow-y-auto">
            <h2 className="text-2xl font-bold text-[rgb(177,21,177)] mb-2 text-center">
              Student Registration Form
            </h2>

            <form onSubmit={handleKidsRegistration} className="space-y-4 pr-2">
              <div className="p-4 rounded-lg shadow-md bg-white border border-[rgb(177,21,177)] mb-4">
                <h3 className="text-lg font-semibold text-[rgb(177,21,177)] mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kids Name
                      </label>
                      <input
                        type="text"
                        value={formState.childName}
                        onChange={(e) => setFormState({ ...formState, childName: e.target.value })}
                        className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(177,21,177)] focus:border-[rgb(177,21,177)] transition-colors"
                        placeholder="Kids Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        value={formState.age}
                        onChange={(e) => setFormState({ ...formState, age: e.target.value })}
                        placeholder="Enter age"
                        className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(177,21,177)] focus:border-[rgb(177,21,177)] transition-colors"
                        min={1}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        value={formState.gender}
                        onChange={(e) => setFormState({ ...formState, gender: e.target.value })}
                        className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(177,21,177)] focus:border-[rgb(177,21,177)] transition-colors"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[rgb(177,21,177)] p-4 rounded-lg shadow-sm mb-4">
                <h3 className="text-lg font-semibold text-[rgb(177,21,177)] mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Location Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={formState.pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      placeholder="Enter 6-digit pincode"
                      className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(177,21,177)] focus:border-[rgb(177,21,177)] transition-colors"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      required
                    />
                    {isLoadingLocation && (
                      <p className="text-sm text-blue-600 mt-1 flex items-center">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Fetching location...
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formState.city}
                        readOnly
                        placeholder="City will be auto-filled"
                        className="w-full p-3 text-sm border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={formState.state}
                        readOnly
                        placeholder="State will be auto-filled"
                        className="w-full p-3 text-sm border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-4 mt-6">
                <button
                  onClick={() => setCurrentPage(3)}
                  type="button"
                  className="w-1/4 bg-[rgb(177,21,177)] text-white py-3 px-4 rounded-md border-b-4 hover:border-[rgb(177,21,177)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>

                <button
                  type="button"
                  className={`w-1/2 bg-orange-500 text-white py-3 px-4 rounded-md border-b-4 hover:border-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-300 ${
                    isCooldown ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleSkipDashboard}
                  disabled={isCooldown}
                >
                  Skip to Dashboard
                </button>

                <button
                  type="submit"
                  className={`w-1/4 bg-green-600 text-white py-3 px-4 rounded-md border-b-4 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition duration-300 flex items-center justify-center ${
                    isCooldown ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isCooldown}
                >
                  {isCooldown ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <>
                      Submit
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic
  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return <MobileLoginPage />;
      case 2:
        return <OtpPage />;
      case 3:
        return <ParentRegistrationPage />;
      case 4:
        return <KidsRegistrationPage />;
      default:
        return <MobileLoginPage />;
    }
  };

  return (
    <div className="font-sans">
      {renderPage()}
      
      {/* Demo Navigation */}
      <div className="fixed bottom-4 right-4 bg-white rounded-full shadow-lg p-2 flex space-x-2 z-50">
        {[1, 2, 3, 4].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-10 h-10 rounded-full font-semibold transition-colors ${
              currentPage === page
                ? 'bg-[rgb(177,21,177)] text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ParentLoginSystem;