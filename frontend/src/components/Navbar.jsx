import React from "react";
import { getUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../config/axiosInstance";
import toast from "react-hot-toast"

const Navbar = () => {
  let { user ,setUser} = getUser();
  let accessToken = user?.accessToken;

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      if (!accessToken) return;
      let resp = await api.post("/logout" , {} , {
        headers: {
            Authorization : `Bearer ${accessToken}`
        }
      });

      if(resp.data.success){
        setUser(null)
        localStorage.removeItem("userData")
        toast.success(resp.data.message)
        navigate("/login")
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="bg-white py-5 px-20 border-b border-b-gray-200 flex items-center justify-between w-screen sticky top-0">
      <div className="text-2xl font-extrabold text-blue-600">Notes-App</div>

      <div className="flex gap-5">
        {user ? (
          <>
            <div
              title={user.username}
              className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-blue-800 font-bold bg-gray-50 cursor-pointer"
            >
              {user.username.charAt(0).toUpperCase()}
            </div>

            <button onClick={handleLogout} className="py-1 font-semibold px-3 bg-blue-600 text-white hover:bg-blue-800 cursor-pointer rounded transition ease-in-out">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to={"/login"}>Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
