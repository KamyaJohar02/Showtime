import React, { useState, useEffect, useRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Firebase import
import { getFirestore, doc, getDoc, collection } from "firebase/firestore"; // Correct imports for Firestore

import { auth, db } from "@/firebaseConfig"; // Ensure your firebaseConfig is properly set up

const LoginDesktop: React.FC = () => {
  const router = useRouter();

  const [isMobileLogin, setIsMobileLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    password: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = () => {
    if (formData.mobile.length === 10) {
      alert("OTP sent to your mobile number!");
      setOtpSent(true);
    } else {
      alert("Please enter a valid 10-digit mobile number");
    }
  };

  const verifyOtp = () => {
    setOtpVerified(true);
    alert("OTP verified!");
    router.push("/profile"); // Redirect to profile on success
  };

  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
  
      // Correct way to get document reference with modular SDK
      const userRef = doc(db, "adminusers", user.uid); // Use doc() for document reference
  
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log("User data:", userData); // Log user data for debugging
  
        if (userData?.role === "admin") {
          console.log("Admin logged in");
          router.push("/admin");
        } else {
          console.log("Normal user logged in");
          // Optionally, redirect to a different page or show a message
        }
      } else {
        console.log("User not found in admin collection");
        alert("User not found in admin collection.");
      }
    } catch (error) {
      
      console.error("Error logging in: ");
      alert("Login failed. Please try again.");
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
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setIsMobileLogin(true)}
              className={`px-4 py-2 rounded ${isMobileLogin ? "bg-red-600 text-white" : "bg-gray-200"}`}
            >
              Login with Mobile
            </button>
            <button
              onClick={() => setIsMobileLogin(false)}
              className={`px-4 py-2 rounded ${!isMobileLogin ? "bg-red-600 text-white" : "bg-gray-200"}`}
            >
              Login with Email
            </button>
          </div>

          {isMobileLogin ? (
            <div>
              <label className="block text-sm font-medium mb-2">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Enter your mobile number"
                maxLength={10}
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
              />
              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full bg-red-600 text-white py-2 rounded"
                >
                  Send OTP
                </button>
              ) : (
                <button
                  onClick={verifyOtp}
                  className="w-full bg-green-600 text-white py-2 rounded"
                >
                  Verify OTP
                </button>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
              />
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </span>
              </div>
              <button
                onClick={handleEmailLogin}
                className="w-full bg-red-600 text-white py-2 mt-4 rounded"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginDesktop;
