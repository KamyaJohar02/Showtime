// firebase.js or firebase.tsx
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAin_wjDqzva9cZyAW1W89zmijcA3i1yHg",
  authDomain: "kamya-6aec4.firebaseapp.com",
  projectId: "kamya-6aec4",
  storageBucket: "kamya-6aec4.appspot.com",
  messagingSenderId: "538175709501",
  appId: "1:538175709501:web:d1ed6e768d8c1396162554"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((error) => {
    console.error('Analytics is not supported:', error);
  });
}

// Optional: Function to set up ReCaptchaVerifier


// Export Firebase services
export { auth};
