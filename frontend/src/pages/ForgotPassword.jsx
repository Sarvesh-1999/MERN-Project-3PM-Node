import React, { useState } from "react";
import { api } from "../config/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let resp = await api.post("/forgot-password", { email });
      if (resp.data.success) {
        navigate(`/verify-otp/${email}`);
        toast.success(resp.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Decorative top bar */}
        <div className="h-2 bg-linear-to-r from-blue-500 to-indigo-500"></div>

        <div className="p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Forgot Password
            </h2>
            <p className="text-gray-500 mt-2">
              Provide email for password reset
            </p>
          </div>

          {/* Form fields */}
          <div className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Login button (no functionality) */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition cursor-pointer"
            >
              Send OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
