"use client";

import React, { useState, useEffect, useRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const LoginDesktop: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    otp: ["", "", "", ""],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [passwordValid, setPasswordValid] = useState(true);
  const [otpError, setOtpError] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    } else if (timer) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password" || name === "confirmPassword") {
      setPasswordsMatch(formData.password === value || formData.confirmPassword === value);
      setPasswordValid(/^(?=.*[!@#$%^&*]).{6,}$/.test(value)); // Validate password
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", mobile: "", password: "", confirmPassword: "", otp: ["", "", "", ""] });
    setOtpSent(false);
    setOtpVerified(false);
    setCooldown(0);
  };

  const handleSendOtp = () => {
    if (formData.mobile.length === 10) {
      setOtpSent(true);
      setCooldown(30); // Start 30-second cooldown
    } else {
      alert("Please enter a valid 10-digit mobile number");
    }
  };

  const handleOtpChange = (idx: number, value: string) => {
    if (/\D/.test(value)) return; // Allow only numeric values
    const updatedOtp = [...formData.otp];
    updatedOtp[idx] = value;
    setFormData({ ...formData, otp: updatedOtp });
    if (value && idx < otpRefs.current.length - 1) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const enteredOtp = formData.otp.join("");
    if (enteredOtp === "1234") {
      setOtpVerified(true);
      setOtpError(false);
    } else {
      setOtpError(true);
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
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      {/* Left side (Image for Login and Signup) */}
      <div className={`${isLogin ? "lg:w-1/2 h-[50vh] lg:h-auto" : "hidden"} relative`}>
        <video src="/Images/login2.mp4" autoPlay loop muted className="w-full h-full object-cover" />
      </div>
      <div className={`${!isLogin ? "lg:w-1/2 h-[50vh] lg:h-[100vh]" : "hidden"} relative`}>
        <Image src="/Images/signup1.jpg" alt="Signup Visual" width={500} height={600} className="w-full h-full object-cover" />
      </div>

      {/* Right side for Form (Login/Signup) */}
      <div className="lg:w-1/2 flex flex-col items-center justify-start mt-8 lg:mt-2 p-4 sm:p-6 lg:p-12">
        {isLogin && (
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-red-600 text-center mb-4 lg:mb-8">
            Welcome to Showtime
          </h1>
        )}
        
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 lg:p-6 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-red-600 text-center mb-4">
            {isLogin ? "Login to Your Account" : "Create a New Account"}
          </h2>

          {isLogin ? (
            <>
              <div className="flex justify-center mb-2">
                <Image src="/Images/user-icon.png" alt="User Icon" width={40} height={40} />
              </div>

              {/* Login Form */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mobile Number*</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter your mobile number"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-red-500"
                  maxLength={10}
                />
              </div>

              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700">Password*</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-red-500"
                />
                <span onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </span>
              </div>

              <div className="text-right mb-4">
                <button onClick={() => setShowResetPassword(true)} className="text-sm text-red-600 hover:underline">Forgot Password?</button>
              </div>

              <button className="w-full py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700">
                Login
              </button>

              <p onClick={toggleForm} className="text-center text-sm text-gray-600 mt-4 cursor-pointer hover:text-red-600">
                Do not have an account? Sign up
              </p>
            </>
          ) : (
            <>
              {/* Signup Form */}
              <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Full Name*</label>
  <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleInputChange}
    placeholder="Enter your full name"
    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-red-500"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Email*</label>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleInputChange}
    placeholder="Enter your email"
    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-red-500"
  />
</div>

<div className="flex items-center mb-4">
  <div className="w-3/5 mr-2">
    <label className="block text-sm font-medium text-gray-700">Mobile Number*</label>
    <input
      type="text"
      name="mobile"
      value={formData.mobile}
      onChange={handleInputChange}
      placeholder="Enter your mobile number"
      className={`w-full px-3 py-2 border ${formData.mobile.length === 10 ? 'border-gray-300' : 'border-red-500'} rounded focus:outline-none focus:ring-red-500`}
      maxLength={10}
    />
  </div>
  <button
    onClick={handleSendOtp}
    disabled={cooldown > 0 || formData.mobile.length !== 10}
    className={`w-2/5 py-2 mt-6 rounded ${
      cooldown > 0 || formData.mobile.length !== 10
        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
        : "bg-red-600 text-white hover:bg-red-700"
    }`}
  >
    {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Send OTP"}
  </button>
</div>

{/* OTP Input Section */}
{otpSent && (
  <>
    <div className="grid grid-cols-4 gap-2 mt-4">
      {formData.otp.map((digit, idx) => (
        <input
          key={idx}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleOtpChange(idx, e.target.value)}
          ref={(el) => {
            otpRefs.current[idx] = el!;
          }}
          className={`w-full text-center py-2 border ${otpError ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-red-500`}
        />
      ))}
    </div>

    {/* Verify OTP Button */}
    <button onClick={verifyOtp} className="w-1/2 py-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700">
      Verify OTP
    </button>
  </>
)}

{/* Password Field */}
<div className="relative mt-4">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    value={formData.password}
    onChange={handleInputChange}
    placeholder="Create Password"
    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${!passwordValid && formData.password ? "border-red-500" : "border-gray-300"}`}
  />
  <span onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
  </span>
  {!passwordValid && formData.password && (
    <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters and contain a special character.</p>
  )}
</div>

{/* Confirm Password Field */}
<div className="relative mt-4">
  <input
    type={showConfirmPassword ? "text" : "password"}
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleInputChange}
    placeholder="Re-enter New Password"
    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${!passwordsMatch && formData.confirmPassword ? "border-red-500" : "border-gray-300"}`}
  />
  <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
  </span>
  {!passwordsMatch && formData.confirmPassword && <p className="text-red-500 text-sm mt-1">Passwords do not match.</p>}
</div>

{/* Sign Up Button (Visible, Conditionally Enabled) */}
<button
  onClick={handlePasswordReset}
  disabled={!otpVerified || !passwordsMatch}
  className={`w-full py-2 mt-4 rounded ${
    otpVerified && passwordsMatch
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-gray-400 text-gray-200 cursor-not-allowed"
  }`}
>
  Sign Up
</button>

<p onClick={toggleForm} className="text-center text-sm text-gray-600 mt-4 cursor-pointer hover:text-red-600">
  Already have an account? Log in
</p>

            </>
          )}
        </div>

        {/* Reset Password Form (Overlay) */}
        {showResetPassword && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4">
              <h2 className="text-2xl font-semibold text-red-600 text-center mb-4">Reset Password</h2>

              {/* Mobile Number Input */}
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Enter Mobile Number"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${
                  formData.mobile.length !== 10 ? "border-red-500" : "border-gray-300"
                }`}
                maxLength={10}
              />

              {/* Send OTP Button */}
              <button
                onClick={handleSendOtp}
                disabled={formData.mobile.length !== 10}
                className={`w-full py-2 rounded ${
                  formData.mobile.length !== 10 ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                Send OTP
              </button>

              {otpSent && (
                <>
                  {/* OTP Input */}
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {formData.otp.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        ref={(el) => {
                          otpRefs.current[idx] = el!;
                        }}
                        className={`w-full text-center py-2 border ${otpVerified ? "border-gray-300" : "border-red-500"} rounded focus:outline-none focus:ring-red-500`}
                      />
                    ))}
                  </div>

                  {/* Verify OTP Button */}
                  <button onClick={verifyOtp} className="w-1/2 py-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700">
                    Verify OTP
                  </button>
                </>
              )}

              {/* Create New Password Field */}
              <div className="relative mt-4">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create New Password"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${
                    !passwordValid && formData.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <span onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </span>
                {!passwordValid && formData.password && (
                  <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters and contain a special character.</p>
                )}
              </div>

              {/* Re-enter New Password Field */}
              <div className="relative mt-4">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter New Password"
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${
                    !passwordsMatch && formData.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                  {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </span>
                {!passwordsMatch && formData.confirmPassword && <p className="text-red-500 text-sm mt-1">Passwords do not match.</p>}
              </div>

              {/* Change Password Button (Always Visible, Conditionally Enabled) */}
              <button
                onClick={handlePasswordReset}
                disabled={!otpVerified || !passwordsMatch || !passwordValid || formData.password === ""}
                className={`w-full py-2 mt-4 rounded ${
                  otpVerified && passwordsMatch && passwordValid && formData.password
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Change Password
              </button>

              <button onClick={() => setShowResetPassword(false)} className="mt-4 text-sm text-red-600 hover:underline">
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginDesktop;
