import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../config/axiosInstance";

const Verify = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const [type, setType] = useState("loading"); //loading | success | error
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const res = await api.post(
        "/verify",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setStatus("Email verified successfully");
        setType("success");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setStatus("Invalid or Expired Token");
        setType("error");
      }
    } catch (error) {
      console.log(error);
      setStatus("Verification failed. Please try again");
      setType("error");
    }
  };

  useEffect(() => {
    verifyEmail();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {type === "loading" && "Verifying..."}
        {type === "success" && "Success"}
        {type === "error" && "Error"}
      </h2>

      <p className="text-gray-600 mb-6">{status}</p>

      {type === "loading" && (
        <div className="flex justify-center">
          <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {type === "error" && (
        <button
          onClick={verifyEmail}
          className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
        >
          Try again
        </button>
      )}

      <p className="text-sm text-gray-400 mt-6">
        Redirecting automatically after verification
      </p>
    </div>
  );
};

export default Verify;
