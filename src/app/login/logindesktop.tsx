"use client";

import React, { useState, useEffect, useRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebaseConfig"; // Adjust the relative path as needed
import { FirebaseError } from "firebase/app"; // Import FirebaseError for type checking

const LoginDesktop: React.FC = () => {
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search); // To get query parameters
  const redirectTo = searchParams.get("redirect"); // Extract the redirect parameter

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
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [correctOtp] = useState("1234");
  const [emailTouched, setEmailTouched] = useState(false);
const [nameTouched, setNameTouched] = useState(false);
const [phoneTouched, setPhoneTouched] = useState(false); // Add this line

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
  };

  const handleLogin = async () => {
    const email = formData.emailOrMobile.includes("@")
      ? formData.emailOrMobile
      : ""; // Check if it's an email
    const password = formData.password;

    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, "adminusers", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        if (userData?.role === "admin") {
          router.push("/admin");
          return;
        }
      }

      router.push(redirectTo || "/myprofile"); // Redirect after successful login
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleSignup = async () => {
    const { email, password, name, mobile } = formData;

    try {
      if (!email || !password || !name || !mobile) {
        alert("Please fill all the fields");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        mobile,
        role: "user",
        createdAt: new Date(),
      });

      alert("Signup successful! Redirecting to login page...");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        emailOrMobile: "",
        otp: ["", "", "", ""],
      });
      router.push("/");
    } catch (error) {
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

  const handleEmailPasswordReset = async () => {
    const { emailOrMobile } = formData;

    try {
      if (!emailOrMobile || !emailOrMobile.includes("@")) {
        alert("Please enter a valid email address.");
        return;
      }

      const userQuery = query(
        collection(db, "users"),
        where("email", "==", emailOrMobile)
      );
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        alert("No account found with this email address.");
        return;
      }

      await sendPasswordResetEmail(auth, emailOrMobile);
      alert("Password reset email sent! Please check your inbox.");
      setShowResetPassword(false);
      setFormData({ ...formData, emailOrMobile: "" });
    } catch (error) {
      if (error instanceof FirebaseError) {
        alert("An error occurred. Please try again later.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      <div className="lg:w-1/2 hidden lg:block">
        <video src="/Images/login2.mp4" autoPlay loop muted className="w-full h-full object-cover" />
      </div>

      <div className="lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-red-600 text-center mb-4">
          Welcome to Showtime
        </h1>
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-4xl font-semibold text-red-600 mb-4">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          {isLogin ? (
            <>
              <input
                type="text"
                name="emailOrMobile"
                value={formData.emailOrMobile}
                onChange={handleInputChange}
                placeholder="Enter Mobile Number or Email"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500 border-gray-300"
              />
              {formData.emailOrMobile.includes("@") && (
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
              <p
                onClick={() => setShowResetPassword(true)}
                className="text-right text-sm text-red-600 cursor-pointer"
              >
                Forgot Password?
              </p>
              <button
                onClick={handleLogin}
                className="w-full bg-red-600 text-white py-2 mt-4 rounded"
              >
                Login
              </button>
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
    onBlur={() => setEmailTouched(true)}
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
    onBlur={() => setPhoneTouched(true)}
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
      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
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
      {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
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
      /[^a-zA-Z\s]/.test(formData.name.trim()) ||
      formData.email.trim() === "" ||
      !formData.email.includes("@") ||
      formData.mobile.length !== 10 ||
      formData.password.length < 6 ||
      formData.password !== formData.confirmPassword
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
    Already registered?{" "}
    <span className="text-red-600">Log in</span>
  </p>
</>

          )}
        </div>
      </div>

      {showResetPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4">
            <h2 className="text-2xl font-semibold text-red-600 text-center mb-4">Reset Password</h2>
            <input
              type="email"
              name="emailOrMobile"
              value={formData.emailOrMobile}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-red-500"
            />
            <button
              onClick={handleEmailPasswordReset}
              className="w-full bg-red-600 text-white py-2 mt-4 rounded"
            >
              Submit
            </button>
            <button
              onClick={() => setShowResetPassword(false)}
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

export default LoginDesktop;
