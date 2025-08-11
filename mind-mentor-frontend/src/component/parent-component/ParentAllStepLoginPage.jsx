import React, { useState } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBInput,
} from "mdb-react-ui-kit";


export default function App() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleSendOtp = () => {
    if (!mobile) return alert("Please enter mobile number");
    // Call API to send OTP here
    setStep(2);
  };

  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleVerifyOtp = () => {
    const otpCode = otp.join("");
    if (otpCode.length < 4) return alert("Enter complete OTP");
    // Call API to verify OTP here
    alert("OTP Verified! Redirecting...");
  };

  return (
    <MDBContainer fluid className="p-3 my-5">
      <MDBRow className="d-flex justify-content-center align-items-center">
        <MDBCol md="6" className="text-center">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            className="img-fluid mb-4"
            alt="Login illustration"
          />

          <h2 className="mb-4 fw-bold" style={{ color: "#6A0DAD" }}>
            Parent Login
          </h2>

          {step === 1 && (
            <>
              <MDBInput
                wrapperClass="mb-4"
                label="Mobile Number"
                id="mobileNumber"
                type="tel"
                size="lg"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <MDBBtn
                className="mb-4 w-100"
                size="lg"
                style={{ backgroundColor: "#6A0DAD" }}
                onClick={handleSendOtp}
              >
                Send OTP
              </MDBBtn>
            </>
          )}

          {step === 2 && (
            <>
              <div className="d-flex justify-content-center gap-2 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    className="text-center form-control"
                    style={{
                      width: "50px",
                      fontSize: "1.5rem",
                      border: "2px solid #6A0DAD",
                      borderRadius: "8px",
                    }}
                  />
                ))}
              </div>
              <MDBBtn
                className="mb-3 w-100"
                size="lg"
                style={{ backgroundColor: "#6A0DAD" }}
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </MDBBtn>
              <p>
                <a href="#resend" style={{ color: "#6A0DAD" }}>
                  Resend OTP
                </a>{" "}
                |{" "}
                <a href="#skip" style={{ color: "#6A0DAD" }}>
                  Skip to Dashboard
                </a>
              </p>
            </>
          )}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
