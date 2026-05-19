import React, { useState } from "react";
import { api } from "../config/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const { email } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword.trim() !== formData.confirmPassword.trim()) {
      toast.error("Password mismatch");
      return;
    }

    try {
      let resp = await api.post(`/confirm-password/${email}`, formData);
      console.log(resp);
      if (resp.data.success) {
        navigate("/login");
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
              Change Password
            </h2>
            <p className="text-gray-500 mt-2">create a new password</p>
          </div>

          {/* Form fields */}
          <div className="space-y-5">
            {/* Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Login button (no functionality) */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
