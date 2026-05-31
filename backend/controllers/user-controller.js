import { User } from "../models/user-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyMail } from "../config/verify-mail.js";
import { Session } from "../models/session-model.js";
import { sendOtpMail } from "../config/otp-mail.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All input fields are required!!",
      });
    }

    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists!!",
      });
    }

    //! password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    //! generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    //todo--> Email Verification
    verifyMail(token, email);

    newUser.token = token;
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User Created",
      data: newUser,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const verification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Token is missing or Invalid",
      });
    }

    const token = authHeader.split(" ")[1];
    let decodedInfo;
    try {
      decodedInfo = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name == "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "Token expired",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Token verification failed",
      });
    }

    const user = await User.findById(decodedInfo.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    user.isVerified = true;
    user.token = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All inputs are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does't exists",
      });
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(400).json({
        success: false,
        message: "Password mismatch",
      });
    }

    //todo ---> CHECK IF USER IS VERIFIED OR NOT
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message:
          "User not verified. Please Register first, check your email for verification",
      });
    }

    //! check exisiting session
    const existingSession = await Session.findOne({ userId: user._id });
    if (existingSession) {
      await Session.deleteOne({ userId: user._id });
    }

    //! create new session
    await Session.create({ userId: user._id });

    // ! create accessToken
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    // ! create refreshToken
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    user.isLoggedIn = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Welcome Back ${user.username}`,
      accessToken,
      refreshToken,
      user: { username: user.username },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// logout
export const logout = async (req, res) => {
  try {
    const userId = req.userId; // userId will come from -> authMiddleware
    console.log("userId --->", userId);

    const sessionPromise = Session.deleteMany({ userId });
    const userPromise = User.findByIdAndUpdate(userId, { isLoggedIn: false });

    console.log("sessionPromise", sessionPromise);
    console.log("userPromise", userPromise);

    Promise.allSettled([sessionPromise, userPromise])
      .then((data) => {
        console.log("data", data);

        return res.status(200).json({
          success: true,
          message: "Logged out successfully",
        });
      })
      .catch((err) => {
        return res.status(400).json({
          success: false,
          message: err,
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// forgotpassword
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    await sendOtpMail(email, otp);

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${email}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// verify otp
export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated or already verified",
      });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired, Please request a new one",
      });
    }

    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.otp = null;
    user.otpExpiry = null;
    user.otpVerified=ture
    user.verifiedOTPAt:Date.now()
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// confirm password
export const confirmPassword = async (req, res) => {
  try {

    // ! Sir, I think there is a serious bug in this as if some one try to do a post request with email without otp verification then also change the pass word
    /*

    example : request = http://localhost:PORT/confirm-password/xyz@gmail.com
              body={
                 newPassword:"12345678",
                 confirmPassword:"12345678"
              }

              flow Sequence:
              1. extract newPassword, confirmPassword from body
              2. email from params
              3. cheak for newPassword!==confirmPassword
              4. find user with email then update password

              Bug:
              if anyone new the email of a user then he can change the password as there is no validation that otp is verified or not in this controller

              Solution:
              1. we need to add a field while verifing otp like email verified: ture, veriied at: date
              2. then we need to cheak the emailverified is ture or not and if the window of time between otp verified and the current request if the time window is greater then 10 minutes then password change should rejected and redo the all process of change password
    
    */
    const { newPassword, confirmPassword } = req.body;
    const email = req.params.email;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password mismatch",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    if (!user.otpVerified) {
      return res.status(400).json({
        success: false,
        message: "Otp is not Verified",
      });
    }

    const now = Date.now();
    const verifiedAt = new Date(user.verifiedOTPAt).getTime();
    const tenMinutes = 10 * 60 * 1000;

    if (now - verifiedAt > tenMinutes) {
      user.otpVerified = false;
      user.verifiedOTPAt = null;
      await user.save();
      thow new Error("Session expired. Please request a new OTP");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
