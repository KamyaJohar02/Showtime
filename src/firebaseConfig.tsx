// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFbESmsw2A0oxFOQKYK2AmhxJihGwAXiE",
  authDomain: "kamy-6c860.firebaseapp.com",
  projectId: "kamy-6c860",
  storageBucket: "kamy-6c860.appspot.com",
  messagingSenderId: "575194952999",
  appId: "1:575194952999:web:45b1373b02bdef76ee2502"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
