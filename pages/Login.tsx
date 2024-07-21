// pages/login.tsx
import { useState } from 'react';
import axios from 'axios';

import 'Login.css';

const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
 

  const handleSendOtp = async () => {
    if (!phoneNumber) return;
    try {
      await axios.post('http://localhost:5000/send-otp', { phoneNumber });
      setStep(2);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    if (!phoneNumber || !otp) return;
    try {
      await axios.post('http://localhost:5000/verify-otp', { phoneNumber, otp });
      // Redirect to booking page after successful login
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="login-container">
      {step === 1 && (
        <div>
          <h2>Login with Phone Number</h2>
          <input
            type="text"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button
          type="button" onClick={handleSendOtp}>Send OTP</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Enter OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
          type="button" onClick={handleVerifyOtp}>Verify OTP</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Login;
