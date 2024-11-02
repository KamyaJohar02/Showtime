"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const LoginMobile: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
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
  const [otpVerified, setOtpVerified] = useState(false);
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

    if (name === "confirmPassword" || name === "password") {
      setPasswordsMatch(formData.password === value || formData.confirmPassword === value);
      setPasswordValid(/^(?=.*[!@#$%^&*]).{6,}$/.test(value));
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
      setCooldown(30);
    } else {
      alert("Please enter a valid 10-digit mobile number");
    }
  };

  const handleOtpChange = (idx: number, value: string) => {
    if (/\D/.test(value)) return;
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
            <div className="flex justify-center mb-2">
              <Image src="/Images/user-icon.png" alt="User Icon" width={40} height={40} />
            </div>

            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Mobile Number"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500"
              maxLength={10}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500"
              />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </span>
            </div>
            <p onClick={() => setShowResetPassword(true)} className="text-right text-sm text-red-600 cursor-pointer">
              Forgot Password?
            </p>

            <button className="w-full py-2 mt-4 bg-red-600 text-white rounded">Login</button>
            <p onClick={toggleForm} className="text-center text-sm text-gray-600 mt-4 cursor-pointer">
              Don't have an account? <span className="text-red-600">Sign up</span>
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
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500"
            />
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
              className={`w-full py-2 rounded ${cooldown > 0 || formData.mobile.length !== 10 ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}
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
                    ref={(el) => (otpRefs.current[idx] = el)}
                    className="w-full text-center py-2 border rounded focus:outline-none focus:ring-red-500"
                  />
                ))}
                <button onClick={verifyOtp} className="w-full py-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700">Verify OTP</button>
              </div>
            )}

            <div className="relative mt-4">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${!passwordValid && formData.password ? "border-red-500" : "border-gray-300"}`}
              />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </span>
            </div>

            <div className="relative mt-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${!passwordsMatch && formData.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </span>
            </div>

            <button
              disabled={!otpVerified || !passwordsMatch || !passwordValid}
              className={`w-full py-2 mt-4 rounded ${otpVerified && passwordsMatch && passwordValid ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
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
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Enter Mobile Number"
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${formData.mobile.length !== 10 ? "border-red-500" : "border-gray-300"}`}
              maxLength={10}
            />
            <button
              onClick={handleSendOtp}
              disabled={formData.mobile.length !== 10}
              className={`w-full py-2 rounded ${formData.mobile.length !== 10 ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}
            >
              Send OTP
            </button>
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
                      ref={(el) => (otpRefs.current[idx] = el)}
                      className="w-full text-center py-2 border rounded focus:outline-none focus:ring-red-500"
                    />
                  ))}
                </div>
                <button onClick={verifyOtp} className="w-1/2 py-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700">
                  Verify OTP
                </button>
              </>
            )}

            <div className="relative mt-4">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create New Password"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${!passwordValid && formData.password ? "border-red-500" : "border-gray-300"}`}
              />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </span>
            </div>

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
            </div>

            <button
              onClick={handlePasswordReset}
              disabled={!otpVerified || !passwordsMatch || !passwordValid || formData.password === ""}
              className={`w-full py-2 mt-4 rounded ${otpVerified && passwordsMatch && passwordValid && formData.password ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
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
  );
};

export default LoginMobile;
