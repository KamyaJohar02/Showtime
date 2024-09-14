import React, { useState, useEffect, useCallback } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/firebaseConfig";

import toast, { Toaster } from 'react-hot-toast';
import OtpInput from "react-otp-input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaKey } from "react-icons/fa";
import { CgSpinnerTwo } from "react-icons/cg";
import { BsFillTelephoneFill } from "react-icons/bs";

const OtpLogin: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [ph, setPh] = useState<string>("");
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    if (window) {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          onSignUp();
        },
        'expired-callback': () => {
          // Handle expiration
        }
      });
      setRecaptchaVerifier(verifier);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSignUp = useCallback(() => {
    setLoading(true);
    const appVerifier = recaptchaVerifier;
    if (appVerifier) {
      const formatPh = '+' + ph;
      signInWithPhoneNumber(auth, formatPh, appVerifier)
        .then((result) => {
          setConfirmationResult(result);
          setLoading(false);
          setShowOTP(true);
          toast.success('OTP sent Successfully');
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [ph, recaptchaVerifier]);

  const onOtpVerify = () => {
    setLoading(true);
    if (confirmationResult) {
      confirmationResult.confirm(otp)
        .then((result) => {
          console.log(result.user);
          setUser(result.user);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  };

  return (
    <section className="bg-black flex flex-col items-center justify-center h-screen p-4">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div id="recaptcha-container"></div>
      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-center text-red-600 font-bold text-2xl">
            Login Successful!
          </h2>
        </div>
      ) : (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-center text-red-600 font-bold text-3xl mb-8">
            Welcome to <br /> ShowTime
          </h1>
          {showOTP ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="bg-red-600 text-white p-4 rounded-full shadow-md">
                  <FaKey size={30} />
                </div>
              </div>
              <label
                htmlFor="otp"
                className="block text-center text-red-600 font-bold text-xl mb-4"
              >
                Enter your OTP
              </label>
              <div className="flex justify-center mb-4">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span className="text-red-600">-</span>}
                  inputStyle="w-12 h-12 border border-gray-300 rounded-md text-center text-xl"
                  renderInput={(props) => <input {...props} />}
                />
              </div>
              <button
                onClick={onOtpVerify}
                className="bg-red-600 w-full flex gap-2 items-center justify-center py-2.5 text-white rounded-lg hover:bg-red-800 transition-colors"
              >
                {loading && (
                  <CgSpinnerTwo size={20} className="animate-spin" />
                )}
                <span>Verify OTP</span>
              </button>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="bg-red-800 text-white p-4 rounded-full shadow-md">
                  <BsFillTelephoneFill size={30} />
                </div>
              </div>
              <label
                htmlFor=""
                className="block text-center text-red-600 font-bold text-xl mb-4"
              >
                Verify your phone number
              </label>
              <PhoneInput country={"in"} value={ph} onChange={setPh} />
              <button
                onClick={onSignUp}
                className="bg-red-600 w-full flex gap-2 items-center justify-center py-2.5 text-white rounded-lg hover:bg-red-900 transition-colors mt-4"
              >
                {loading && (
                  <CgSpinnerTwo size={20} className="animate-spin" />
                )}
                <span>Send code via SMS</span>
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default OtpLogin;
