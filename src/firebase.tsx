import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // Import Firebase Authentication
import { getAnalytics, isSupported } from 'firebase/analytics';  // Import getAnalytics and isSupported

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANwps7w-uFOnHV6svZgHS4zLAoqPEUCi0",
  authDomain: "showtime-6b025.firebaseapp.com",
  projectId: "showtime-6b025",
  storageBucket: "showtime-6b025.appspot.com",
  messagingSenderId: "144845027569",
  appId: "1:144845027569:web:a3963f12712b2862ad1150",
  measurementId: "G-5T2TREQ7BP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Initialize and export auth

// Initialize Analytics only on the client side
let analytics: any;

if (typeof window !== 'undefined') {  // Ensure this code runs only in the browser
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { auth, analytics };
