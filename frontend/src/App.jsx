import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import ChangePassword from "./pages/ChangePassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify/:token",
    element: <Verify />,
  },
  {
    path: "/verify",
    element: <VerifyEmail />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verify-otp/:email",
    element: <VerifyOTP />,
  },
  {
    path: "/change-password/:email",
    element: <ChangePassword />,
  },
]);

const App = () => {
  return (
    <div>
      <Toaster />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
