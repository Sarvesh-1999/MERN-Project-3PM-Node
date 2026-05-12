import React from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../context/UserContext";
import { FaBolt, FaArrowRight } from "react-icons/fa";

const Hero = () => {
  const { user } = getUser();
  const navigate = useNavigate(); // uncomment if using router

  return (
    <div className="relative w-full h-screen md:h-175 bg-linear-to-br from-slate-50 to-gray-100 overflow-hidden flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Welcome Message */}
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome {user?.username}
          </h2>

          {/* Badge */}
          <div className="flex items-center gap-2 bg-blue-100 border border-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
            <FaBolt className="text-xs" />
            <span>New: AI-powered note organization</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-blue-600">
            Your thoughts, organized and accessible{" "}
            <span className="text-gray-800">everywhere</span>
          </h1>

          {/* Description */}
          <p className="max-w-175 text-gray-600 md:text-lg">
            Capture ideas, organize thoughts, and collaborate seamlessly. The
            modern note-taking app that grows with you and keeps your ideas
            secure in the cloud.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Primary Button */}
            <button
              onClick={() => navigate("/create-todo")}
              className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 h-12 rounded-lg font-semibold transition"
            >
              Start Taking Notes
              <FaArrowRight className="text-sm" />
            </button>

            {/* Secondary Button */}
            <button className="bg-white border border-blue-600 text-blue-800 px-8 h-12 rounded-lg font-semibold hover:bg-blue-50 transition">
              Watch Demo
            </button>
          </div>

          {/* Footer Text */}
          <p className="text-sm text-blue-800">
            Free forever • No credit card required • 2 minutes setup
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
