"use client"
import React, { useEffect, useState, useTransition } from "react";
import { RecaptchaVerifier, ConfirmationResult, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/firebase';  // Ensure this import is correct
import { Input } from "@/components/ui/input"; // Ensure Input is correctly imported
import { Button } from "../src/components/ui/button";
import { InputOTP } from "@/components/ui/input-otp";
// Ensure Button is correctly imported

function Login() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState("");
    const [resendCountdown, setResendCountdown] = useState(0);
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCountdown > 0) {
            timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCountdown]);

    useEffect(() => {
        // Create and configure RecaptchaVerifier only once
        const recaptchaVerifierInstance = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
                size: "invisible",
            }
        );
        setRecaptchaVerifier(recaptchaVerifierInstance);
        return () => {
            recaptchaVerifierInstance.clear();
        };
    }, []); // Empty dependency array means this effect runs only once

    const requestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneNumber) {
            setError("Phone number is required.");
            return;
        }

        if (recaptchaVerifier) {
            try {
                const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
                setConfirmationResult(result);
                setSuccess("OTP sent successfully.");
                setResendCountdown(60); // Start countdown for resend
            } catch (err) {
                setError("Failed to send OTP. Please try again.");
                console.error(err);
            }
        } else {
            setError("Recaptcha verifier not initialized.");
        }
    };

    const verifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (confirmationResult && otp) {
            try {
                await confirmationResult.confirm(otp);
                setSuccess("Phone number verified successfully.");
            } catch (err) {
                setError("Failed to verify OTP. Please try again.");
                console.error(err);
            }
        } else {
            setError("OTP is required.");
        }
    };

    return (
        <div>
            {!confirmationResult ? (
                <form onSubmit={requestOtp}>
                    <Input
                        className="text-black"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                        Please enter your number with country code (e.g., +91 for IN)
                    </p>
                    {error && <p className="text-red-500">{error}</p>}
                    <Button type="submit">Request OTP</Button>
                </form>
            ) : (
                <form onSubmit={verifyOtp}>
                    <Input
                        className="text-black"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                    />
                    <Button type="submit">Verify OTP</Button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            )}
            <div id="recaptcha-container" />
        </div>
    );
}

export default Login;
