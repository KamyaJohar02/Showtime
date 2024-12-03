"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const LoginMobile: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "", // Add this to handle the combined input
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    otp: ["", "", "", ""],
    emailOrMobile: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [otpError, setOtpError] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [correctOtp] = useState("1234"); // Predefined correct OTP
  
  
  const [nameTouched, setNameTouched] = useState(false);





  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  // Validate if input is a valid mobile number
  
  

// Validate if input is a valid email address
const isValidEmail = (email: string) => email.includes("@");

  

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
  if (cooldown > 0) {
    timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
  }
  return () => clearTimeout(timer); // Clean up the timer
}, [cooldown]);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value })); // Update the form data dynamically

  if (name === "name") {
    setNameTouched(true); // Mark name as touched
  }

  if (name === "email") {
    setEmailTouched(true); // Mark email as touched
  }

  if (name === "emailOrMobile") {
    const isEmailNow = isValidEmail(value); // Check if the input is a valid email
    setIsEmail(isEmailNow); // Dynamically set email mode

    if (isEmailNow) {
      // If input is an email, reset password field
      setFormData((prev) => ({
        ...prev,
        password: "", // Clear password input
      }));
      setShowPassword(false); // Hide the password visibility toggle
    } else {
      // If input is a mobile number or invalid input, reset OTP states
      setOtpSent(false);
      setOtpVerified(false);
      setOtpError(false);
      setCooldown(0); // Reset cooldown
      setFormData((prev) => ({
        ...prev,
        otp: ["", "", "", ""], // Clear OTP inputs
        password: "", // Clear password input for safety
      }));
      setShowPassword(false);
    }
  }

  if (name === "mobile") {
    // Handle changes to the mobile number field on signup
    if (value.length !== 10 || !/^\d{10}$/.test(value)) {
      // Reset OTP-related state when mobile is invalid or cleared
      setOtpSent(false);
      setOtpVerified(false);
      setOtpError(false);
      setCooldown(0); // Reset cooldown
      setFormData((prev) => ({
        ...prev,
        otp: ["", "", "", ""], // Clear OTP inputs
        password: "", // Reset password input
        confirmPassword: "", // Reset confirm password input
      }));
    }
  }
};




  

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      mobile: "",
      emailOrMobile: "", // Add this field
      password: "",
      confirmPassword: "",
      otp: ["", "", "", ""],
    });
    setOtpSent(false);
    setOtpVerified(false);
    setCooldown(0);
  };
  

  const handleSendOtp = () => {
    setOtpSent(true); // Set OTP as sent
    setCooldown(30); // Start the cooldown timer
  };
  
  const handleResendOtp = () => {
    setFormData((prev) => ({
      ...prev,
      otp: ["", "", "", ""], // Reset OTP input fields
    }));
    setOtpSent(true);
    setCooldown(30); // Restart the cooldown timer
  };
  

  const handleOtpChange = (idx: number, value: string) => {
    if (/\D/.test(value)) return; // Ignore non-numeric input
  
    const updatedOtp = [...formData.otp];
    updatedOtp[idx] = value;
  
    setFormData({ ...formData, otp: updatedOtp });
  
    if (value) {
      // Move to the next input if value is entered
      if (idx < otpRefs.current.length - 1) {
        otpRefs.current[idx + 1]?.focus();
      }
    } else {
      // Move to the previous input if value is deleted
      if (idx > 0) {
        otpRefs.current[idx - 1]?.focus();
      }
    }
  };
  

  const verifyOtp = () => {
    const enteredOtp = formData.otp.join(""); // Concatenate the entered OTP
    if (enteredOtp === correctOtp) {
      setOtpVerified(true); // Mark as verified
      setOtpError(false); // No error
    } else {
      setOtpVerified(false); // Not verified
      setOtpError(true); // Error
    }
  };
  

  const handlePasswordReset = () => {
    if (passwordsMatch && passwordValid && formData.password) {
      alert("Password reset successfully!");
      setShowResetPassword(false);
      setOtpVerified(false);
      setOtpSent(false);
      setFormData({ ...formData, password: "", confirmPassword: "", otp: ["", "", "", ""] });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white p-6">
      <h1 className="text-3xl font-bold text-red-600 self-start mt-4 mb-2">
        Welcome to Showtime
      </h1>

      <div className="mb-8">
        <Image
          src={isLogin ? "/Images/loginphone.jpg" : "/Images/signupphone.jpg"}
          alt={isLogin ? "Login Logo" : "Signup Logo"}
          width={350}
          height={320}
        />
      </div>

      <h2 className="text-4xl font-semibold text-red-600 mb-4">
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      <div className="w-full max-w-xs bg-white p-6 rounded-lg shadow-md space-y-4">





      {isLogin ? (
  <>
    <input
      type="text"
      name="emailOrMobile"
      value={formData.emailOrMobile}
      onChange={handleInputChange}
      placeholder="Enter Mobile Number or Email"
      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 border-gray-300"
      maxLength={50} // Allows long input for emails but only 10 digits for mobile numbers
    />

    {/* Show Send OTP Button for valid mobile numbers */}
    {/^\d{10}$/.test(formData.emailOrMobile) && !isEmail && (
      <button
        onClick={handleSendOtp}
        className={`w-full py-2 mt-4 rounded ${
          cooldown > 0
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Send OTP"}
      </button>
    )}

    {/* Show OTP Fields if OTP is sent */}
    {otpSent && !isEmail && (
  <div className="grid grid-cols-4 gap-2 mt-4">
    {/* OTP Input Boxes */}
    {formData.otp.map((digit, idx) => (
      <input
        key={idx}
        type="text"
        maxLength={1}
        value={digit}
        onChange={(e) => handleOtpChange(idx, e.target.value)}
        ref={(el) => {
          otpRefs.current[idx] = el;
        }}
        className={`w-full text-center py-2 border rounded focus:outline-none focus:ring-red-500 ${
          otpError ? "border-red-500" : otpVerified ? "border-green-500" : "border-gray-300"
        }`}
      />
    ))}

    {/* Verify OTP Button */}
    <button
      onClick={verifyOtp}
      className={`w-full py-2 mt-4 rounded ${
        otpVerified ? "bg-green-600 text-white" : "bg-red-600 text-white hover:bg-red-700"
      }`}
    >
      Verify OTP
    </button>

    {/* Countdown or Resend OTP */}
    
  </div>
)}


    {/* Show Password Field for Email */}
    {isEmail && (
      <div className="relative mt-4">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500"
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
        >
          {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </span>
      </div>
    )}

    {/* Forgot Password Button */}
    <p
      onClick={() => setShowResetPassword(true)}
      className="text-right text-sm text-red-600 cursor-pointer"
    >
      Forgot Password?
    </p>

    {/* Login Button */}
    <button
      disabled={!otpVerified && !isEmail} // Greyed out until OTP is verified or email/password is entered
      className={`w-full py-2 mt-4 rounded ${
        otpVerified || isEmail
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-gray-400 text-gray-200 cursor-not-allowed"
      }`}
    >
      Login
    </button>

    {/* Sign Up Button */}
    <p
      onClick={toggleForm}
      className="text-center text-sm text-gray-600 mt-4 cursor-pointer"
    >
      Don't have an account?{" "}
      <span className="text-red-600">Sign Up</span>
    </p>
  </>

        ) : (




          <>
    <input
  type="text"
  name="name"
  value={formData.name}
  onChange={handleInputChange}
  placeholder="Full Name"
  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${
    nameTouched && formData.name.trim() === "" ? "border-red-500" : "border-gray-300"
  }`}
/>
{nameTouched && formData.name.trim() === "" && (
  <p className="text-sm text-red-500 mt-1">Name is required</p>
)}

<input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleInputChange}
  placeholder="Email"
  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${
    emailTouched && (formData.email.trim() === "" || !formData.email.includes("@"))
      ? "border-red-500"
      : "border-gray-300"
  }`}
/>
{emailTouched && formData.email.trim() === "" && (
  <p className="text-sm text-red-500 mt-1">Email is required</p>
)}
{emailTouched && formData.email.trim() !== "" && !formData.email.includes("@") && (
  <p className="text-sm text-red-500 mt-1">Email must contain "@"</p>
)}


    <input
      type="text"
      name="mobile"
      value={formData.mobile}
      onChange={handleInputChange}
      placeholder="Mobile Number"
      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500"
      maxLength={10}
    />
    <button
      onClick={handleSendOtp}
      disabled={cooldown > 0 || formData.mobile.length !== 10}
      className={`w-full py-2 rounded ${
        cooldown > 0 || formData.mobile.length !== 10
          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
          : "bg-red-600 text-white hover:bg-red-700"
      }`}
    >
      {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Send OTP"}
    </button>

    {otpSent && (
      <div className="grid grid-cols-4 gap-2 mt-4">
      {formData.otp.map((digit, idx) => (
        <input
          key={idx}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleOtpChange(idx, e.target.value)}
          ref={(el) => {
            otpRefs.current[idx] = el;
          }}
          className={`w-full text-center py-2 border rounded focus:outline-none focus:ring-red-500 ${
            otpVerified
              ? "border-green-500" // Green for correct OTP
              : otpError
              ? "border-red-500" // Red for incorrect OTP
              : "border-gray-300" // Default border
          }`}
          />
        ))}
        <button
          onClick={verifyOtp}
          className="w-full py-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Verify OTP
        </button>
      </div>
    )}

<div className="relative mt-4">
  {/* Password Input */}
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    value={formData.password}
    onChange={handleInputChange}
    placeholder="Password"
    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${
      formData.password && formData.password.length < 6
        ? "border-red-500"
        : "border-gray-300"
    }`}
  />
  <span
    onClick={() => setShowPassword(!showPassword)}
    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
  >
    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
  </span>
  {formData.password && formData.password.length < 6 && (
    <p className="text-sm text-red-500 mt-1">
      Password must be at least 6 characters long
    </p>
  )}
</div>

<div className="relative mt-4">
  {/* Confirm Password Input */}
  <input
    type={showConfirmPassword ? "text" : "password"}
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleInputChange}
    placeholder="Confirm Password"
    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${
      formData.confirmPassword &&
      formData.confirmPassword !== formData.password
        ? "border-red-500"
        : "border-gray-300"
    }`}
  />
  <span
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
  >
    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
  </span>
</div>



<button
  disabled={
    formData.name.trim() === "" ||
    formData.email.trim() === "" ||
    !formData.email.includes("@") ||
    formData.password.length < 6 ||
    formData.password !== formData.confirmPassword ||
    !otpVerified
  }
  className={`w-full py-2 mt-4 rounded ${
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.email.includes("@") &&
    formData.password.length >= 6 &&
    formData.password === formData.confirmPassword &&
    otpVerified
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-gray-400 text-gray-200 cursor-not-allowed"
  }`}
>
  Sign Up
</button>


    <p onClick={toggleForm} className="text-center text-sm text-gray-600 mt-4 cursor-pointer">
      Already registered? <span className="text-red-600">Log in</span>
    </p>
  </>
)}
      </div>

      {showResetPassword && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4">
      <h2 className="text-2xl font-semibold text-red-600 text-center mb-4">Reset Password</h2>

      {/* Mobile Input */}
      <input
        type="text"
        name="mobile"
        value={formData.mobile}
        onChange={handleInputChange}
        placeholder="Enter Mobile Number"
        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${
          formData.mobile.length === 10 ? "border-gray-300" : "border-red-500"
        }`}
        maxLength={10}
      />

      {/* Send OTP Button */}
      {formData.mobile.length === 10 && (
        <button
          onClick={handleSendOtp}
          className={`w-full py-2 rounded ${
            cooldown > 0
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Send OTP"}
        </button>
      )}

      {/* OTP Input */}
      {otpSent && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {formData.otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              ref={(el) => {
                otpRefs.current[idx] = el;
              }}
              className={`w-full text-center py-2 border rounded focus:outline-none focus:ring-red-500 ${
                otpVerified
                  ? "border-green-500" // Green for correct OTP
                  : otpError
                  ? "border-red-500" // Red for incorrect OTP
                  : "border-gray-300" // Default border
              }`}
            />
          ))}
        </div>
      )}

      {/* Verify OTP Button */}
      {otpSent && (
        <button
          onClick={verifyOtp}
          className={`w-full py-2 mt-4 rounded ${
            otpVerified ? "bg-green-600 text-white" : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          Verify OTP
        </button>
      )}

      {/* Password Input */}
      {otpVerified && (
        <>
          <div className="relative mt-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create New Password"
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${
                formData.password && formData.password.length < 6
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </span>
            {formData.password && formData.password.length < 6 && (
              <p className="text-sm text-red-500 mt-1">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          <div className="relative mt-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${
                formData.confirmPassword &&
                formData.confirmPassword !== formData.password
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </span>
          </div>
        </>
      )}

      {/* Reset Password Button */}
      <button
        onClick={handlePasswordReset}
        disabled={
          !otpVerified ||
          formData.password.length < 6 ||
          formData.password !== formData.confirmPassword
        }
        className={`w-full py-2 mt-4 rounded ${
          otpVerified &&
          formData.password.length >= 6 &&
          formData.password === formData.confirmPassword
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
        }`}
      >
        Reset Password
      </button>

      {/* Close Button */}
      <button
        onClick={() => {
          setShowResetPassword(false);
          // Reset form and states when modal is closed
          setFormData({
            ...formData,
            mobile: "",
            otp: ["", "", "", ""],
            password: "",
            confirmPassword: "",
          });
          setOtpSent(false);
          setOtpVerified(false);
          setOtpError(false);
          setCooldown(0);
        }}
        className="mt-4 text-sm text-red-600 hover:underline"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default LoginMobile;
