// Import necessary Firebase modules
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { toast } from "react-hot-toast";

// Firebase configuration object (Replace these with your actual Firebase credentials)
const firebaseConfig = {
  apiKey: "AIzaSyCFbESmsw2A0oxFOQKYK2AmhxJihGwAXiE",
  authDomain: "kamy-6c860.firebaseapp.com",
  projectId: "kamy-6c860",
  storageBucket: "kamy-6c860.appspot.com",
  messagingSenderId: "575194952999",
  appId: "1:575194952999:web:45b1373b02bdef76ee2502",
};

// Initialize Firebase app (check if already initialized to avoid multiple instances)
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Set persistence for Firebase Authentication
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("✅ Firebase auth persistence set to LOCAL.");
  })
  .catch((error) => {
    toast.error(`❌ Error setting persistence: ${error.message || "An unexpected error occurred."}`);

  });

// Optional: Add debug logging in development mode
if (process.env.NODE_ENV === "development") {
  console.log("Firebase initialized with app name:", app.name);
}

// Disable app verification for testing environments (Do NOT use in production)
if (process.env.NODE_ENV === "development") {
  auth.settings.appVerificationDisabledForTesting = true;
}

// Export the initialized services for use in your application
export { auth, db };

// Optional: Export the Firebase app instance if needed
export default app;
