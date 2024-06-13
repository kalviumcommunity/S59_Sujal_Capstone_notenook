import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OTPVerificationForm({ userData }) {
  const navigate = useNavigate();

  const [otp, setOTP] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        import.meta.env.VITE_REACT_APP_VERIFY_OTP_URL,
        { userId: userData._id, otp }
      );

      alert(res.data.message);
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data.message || "Failed to verify OTP";
      setErrorMessage(errorMessage);
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_REACT_APP_RESEND_OTP_URL,
        { email: userData.email }
      );

      setMessage(res.data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data.message || "Failed to resend OTP";
      setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="formDiv mb-24 xl:mb-0">
      <h1>OTP Verification</h1>
      <p className="mb-4 text-sm text-center">
        The OTP has been mailed to <b>{userData?.email}</b>
      </p>
      <form onSubmit={handleFormSubmit} className="grid form mb-8 xl:mb-0">
        <div className="field span2">
          <label htmlFor="otp">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            required
          />
        </div>

        {message && (
          <p className="message span2 justify-self-center">{message}</p>
        )}
        {errorMessage && (
          <p className="error span2 justify-self-center">{errorMessage}</p>
        )}
        <div className="flex span2 justify-center gap-16">
          <div className="span2 button resend" onClick={handleResendOTP}>
            Resend OTP
          </div>
          <button type="submit" className="span2 button">
            Verify OTP
          </button>
        </div>
      </form>
    </div>
  );
}

export default OTPVerificationForm;
