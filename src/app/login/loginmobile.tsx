"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  setDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { auth, db } from "@/firebaseConfig"; // Adjust the relative path as needed
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app"; // Import FirebaseError for type checking

const LoginMobile: React.FC = () => {
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search); // To get query parameters
  const redirectTo = searchParams.get("redirect"); // Extract the redirect parameter

  const handleLogin = async () => {
    const email = formData.emailOrMobile.includes("@")
      ? formData.emailOrMobile
      : ""; // Check if it's an email
    const password = formData.password;

    console.log("Login Email:", email); // Log email for debugging
    console.log("Login Password:", password); // Log password for debugging

    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User logged in:", user);
      router.push(redirectTo || "/myprofile"); // Redirect after successful login
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login failed:", error.message);
        alert(error.message);
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleSignup = async () => {
    const { email, password, name, mobile } = formData;
    console.log("Signup Email:", email); // Log email for debugging
    console.log("Signup Password:", password); // Log password for debugging

    try {
      // Validate required fields
      if (!email || !password || !name || !mobile) {
        alert("Please fill all the fields");
        return;
      }

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        mobile,
        role: "user",
        createdAt: new Date(),
      });

      // Success message
      alert("Signup successful! Redirecting to login page...");

      // Reset the form
      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        emailOrMobile: "",
        otp: ["", "", "", ""],
      });

      // Redirect to login page
      router.push("/"); // Update this route if your login page is on a different path
    } catch (error) {
      console.error("Error during signup:", error);

      // Narrow down error type to FirebaseError
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            alert("The email address is already in use. Please use a different email.");
            break;
          case "auth/invalid-email":
            alert("Invalid email address. Please enter a valid email.");
            break;
          case "auth/weak-password":
            alert("Password is too weak. Please enter a stronger password.");
            break;
          default:
            alert("An error occurred. Please try again.");
        }
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const [isLogin, setIsLogin] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
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
  const [correctOtp] = useState("1234");
  const [nameTouched, setNameTouched] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [phoneTouched, setPhoneTouched] = useState(false); // Add this line


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "emailOrMobile") {
      const isEmailNow = value.includes("@");
      setIsEmail(isEmailNow);
    }
  };



  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      mobile: "",
      emailOrMobile: "",
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

  const handleEmailPasswordReset = async () => {
    const { emailOrMobile } = formData;
  
    try {
      // Validate the email format
      if (!emailOrMobile || !emailOrMobile.includes("@")) {
        alert("Please enter a valid email address.");
        return;
      }
  
      // Query Firebase Authentication or Firestore to check if the email exists
      const userQuery = query(
        collection(db, "users"), // Adjust to match your Firestore collection
        where("email", "==", emailOrMobile)
      );
      const userSnapshot = await getDocs(userQuery);
  
      if (userSnapshot.empty) {
        alert("No account found with this email address.");
        return;
      }
  
      // Send password reset email
      await sendPasswordResetEmail(auth, emailOrMobile);
      alert("Password reset email sent! Please check your inbox.");
      setShowResetPassword(false); // Close the reset modal
      setFormData({ ...formData, emailOrMobile: "" }); // Clear the input field
    } catch (error) {
      console.error("Error sending reset email:", error);
  
      if (error instanceof FirebaseError) {
        alert("An error occurred. Please try again later.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
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

      <div className="w-full max-w-xs bg-white p-6 rounded-lg shadow-md space-y-4 ">



      {isLogin ? (
  <>
    <input
      type="text"
      name="emailOrMobile"
      value={formData.emailOrMobile}
      onChange={(e) => {
        handleInputChange(e);

        // Reset OTP-related states if the input is cleared or modified
        if (e.target.value.length !== 10 || !/^\d{10}$/.test(e.target.value)) {
          setOtpSent(false);
          setOtpVerified(false);
          setOtpError(false);
          setCooldown(0); // Reset the cooldown counter
          setFormData((prev) => ({
            ...prev,
            otp: ["", "", "", ""], // Clear the OTP inputs
          }));
        }
      }}
      placeholder="Enter Mobile Number or Email"
      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 border-gray-300"
      maxLength={50} // Allows long input for emails but only 10 digits for mobile numbers
    />

    {/* Show Send OTP Button for valid mobile numbers */}
    {/^\d{10}$/.test(formData.emailOrMobile) && !isEmail && !otpSent && (
      <button
        onClick={() => {
          handleSendOtp();
        }}
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
              otpError
                ? "border-red-500"
                : otpVerified
                ? "border-green-500"
                : "border-gray-300"
            }`}
          />
        ))}

        {/* Verify OTP Button */}
        <button
          onClick={verifyOtp}
          className={`w-full py-2 mt-4 rounded ${
            otpVerified
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          Verify OTP
        </button>
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
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
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
      onClick={handleLogin}
      disabled={!otpVerified && !isEmail} // Prevents the button from being clickable unless conditions are met
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
    onChange={(e) => {
      handleInputChange(e);
      setNameTouched(true);
    }}
    placeholder="Full Name"
    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${
      nameTouched && /[^a-zA-Z\s]/.test(formData.name.trim())
        ? "border-red-500"
        : "border-gray-300"
    }`}
  />
  {nameTouched && /[^a-zA-Z\s]/.test(formData.name.trim()) && (
    <p className="text-sm text-red-500 mt-1">Name must contain only alphabets.</p>
  )}

  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleInputChange}
    onBlur={() => setEmailTouched(true)} // Trigger validation after interaction
    placeholder="Email"
    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${
      emailTouched && !formData.email.includes("@")
        ? "border-red-500"
        : "border-gray-300"
    }`}
  />
  {emailTouched && !formData.email.includes("@") && (
    <p className="text-sm text-red-500 mt-1">Email must contain "@"</p>
  )}

  <input
    type="text"
    name="mobile"
    value={formData.mobile}
    onChange={(e) => {
      const value = e.target.value;
      if (/^\d{0,10}$/.test(value)) {
        handleInputChange(e);
        setPhoneTouched(true);
      }
    }}
    onBlur={() => setPhoneTouched(true)} // Trigger validation after interaction
    placeholder="Phone Number"
    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${
      phoneTouched && formData.mobile.length !== 10
        ? "border-red-500"
        : "border-gray-300"
    }`}
  />
  {phoneTouched && formData.mobile.length !== 10 && (
    <p className="text-sm text-red-500 mt-1">Phone number must be 10 digits long.</p>
  )}

  <div className="relative mt-4">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleInputChange}
      placeholder="Enter Password"
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
      {showPassword ? (
        <EyeSlashIcon className="h-5 w-5" />
      ) : (
        <EyeIcon className="h-5 w-5" />
      )}
    </span>
    {formData.password && formData.password.length < 6 && (
      <p className="text-sm text-red-500 mt-1">Password must be at least 6 characters long.</p>
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
    {formData.confirmPassword &&
      formData.confirmPassword !== formData.password && (
        <p className="text-sm text-red-500 mt-1">Passwords do not match.</p>
      )}
  </div>

  <button
    onClick={handleSignup}
    disabled={
      formData.name.trim() === "" ||
      /[^a-zA-Z\s]/.test(formData.name.trim()) || // Name validation
      formData.email.trim() === "" ||
      !formData.email.includes("@") || // Email validation
      formData.mobile.length !== 10 || // Phone number validation
      formData.password.length < 6 || // Password length validation
      formData.password !== formData.confirmPassword // Password match validation
    }
    className={`w-full py-2 mt-4 rounded ${
      formData.name &&
      !/[^a-zA-Z\s]/.test(formData.name.trim()) &&
      formData.email &&
      formData.email.includes("@") &&
      formData.mobile.length === 10 &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword
        ? "bg-red-600 text-white hover:bg-red-700"
        : "bg-gray-400 text-gray-200 cursor-not-allowed"
    }`}
  >
    Sign Up
  </button>

  <p
    onClick={toggleForm}
    className="text-center text-sm text-gray-600 mt-4 cursor-pointer"
  >
    Already registered? <span className="text-red-600">Log in</span>
  </p>
</>
        )}

      </div>


      {showResetPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4">
            <h2 className="text-2xl font-semibold text-red-600 text-center mb-4">Reset Password</h2>

            {/* Email Input */}
            <input
              type="email"
              name="emailOrMobile"
              value={formData.emailOrMobile}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 ${formData.emailOrMobile.includes("@") ? "border-gray-300" : "border-red-500"
                }`}
            />
            {!formData.emailOrMobile.includes("@") && (
              <p className="text-sm text-red-500 mt-1">Please enter a valid email address.</p>
            )}

            {/* Send Reset Email Button */}
            <button
              onClick={handleEmailPasswordReset}
              disabled={!formData.emailOrMobile.includes("@")}
              className={`w-full py-2 rounded ${formData.emailOrMobile.includes("@")
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
            >
              Submit
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                setShowResetPassword(false);
                // Reset the email input field
                setFormData({ ...formData, emailOrMobile: "" });
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
