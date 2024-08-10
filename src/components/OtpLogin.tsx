import React, { useState, useEffect, useCallback } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, UserCredential } from "firebase/auth";
import { auth } from "@/firebaseConfig";

import toast, { Toaster } from 'react-hot-toast';
import OtpInput from "react-otp-input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaKey } from "react-icons/fa";
import { CgSpinnerTwo } from "react-icons/cg";
import { BsFillTelephoneFill } from "react-icons/bs";
import '../../pages/Login.css'; // Import your updated CSS file

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
    <section className="bg-emerald-500 flex flex-col items-center justify-center h-screen">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div id="recaptcha-container"></div>
      {user ? (
        <h2 className="text-center text-white font-bold text-2xl">
          Login Success
        </h2>
      ) : (
        <div className="w-full max-w-md p-4 flex flex-col gap-4 rounded-lg bg-white">
          <h1 className="text-center text-black font-bold text-3xl mb-6">
            Welcome to <br /> ShowTime
          </h1>
          {showOTP ? (
            <>
              <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                <FaKey size={30} />
              </div>
              <label
                htmlFor="otp"
                className="font-bold text-2xl text-white text-center"
              >
                Enter your OTP
              </label>
              <div className="otp-container">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span>-</span>}
                  inputStyle="otp-input"
                  renderInput={(props) => <input {...props} />}
                />
              </div>
              <button
                onClick={onOtpVerify}
                className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded cursor-pointer"
              >
                {loading && (
                  <CgSpinnerTwo size={20} className="mt-1 animate-spin" />
                )}
                <span>Verify OTP</span>
              </button>
            </>
          ) : (
            <>
              <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                <BsFillTelephoneFill size={30} />
              </div>
              <label
                htmlFor=""
                className="font-bold text-xl text-white text-center"
              >
                Verify your phone number
              </label>
              <PhoneInput country={"in"} value={ph} onChange={setPh} />
              <button
                onClick={onSignUp}
                className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded cursor-pointer"
              >
                {loading && (
                  <CgSpinnerTwo size={20} className="mt-1 animate-spin" />
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
