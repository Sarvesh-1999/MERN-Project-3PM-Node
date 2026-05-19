import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { api } from "../config/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
const verifyOTP = () => {
  const [otp, setOtp] = useState("");
  const { email } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      let res = await api.post(`/verify-otp/${email}`, { otp });
      setTimeout(() => {
        navigate(`/change-password/${email}`);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Verify OTP</h1>
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        renderSeparator={<span>-</span>}
        renderInput={(props) => <input {...props} />}
      />
      <button onClick={handleSubmit}>Verify & Continue</button>
    </div>
  );
};

export default verifyOTP;
