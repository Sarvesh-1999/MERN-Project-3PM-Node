import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../config/axiosInstance";
import { getUser } from "../context/UserContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();
  let { setUser } = getUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      let resp = await api.post("/login", formData);
      console.log(resp);
      if (resp.data.success) {
        navigate("/");

        let userData = {
          ...resp.data.user,
          accessToken: resp.data.accessToken,
          refreshToken: resp.data.refreshToken,
        };
        setUser(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
        toast.success(resp.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
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
            <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
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
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Forgot password link */}
            <div className="text-right">
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>

            {/* Login button (no functionality) */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition cursor-pointer"
            >
              Sign in
            </button>
          </div>

          {/* Extra text / signup link (just UI) */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
