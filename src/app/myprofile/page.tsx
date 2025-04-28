"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function DashboardPage() {
  const [userDetails, setUserDetails] = useState({ name: "", email: "", mobile: "" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "users"), where("email", "==", user.email));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setUserDetails({ name: data.name, email: data.email, mobile: data.mobile });
      }
    };

    fetchUser();
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-6 p-4 bg-gradient-to-b from-gray-50 to-white">
      {/* No big space on top now, just pt-6 */}

      {/* Animated container */}
      <div
        className={`transition-all duration-700 ease-out transform ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        } w-full max-w-2xl`}
      >
        {/* Welcome Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-purple-800 mb-2">
            Welcome to Showtime Studio ✨
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            "Celebrating your moments in style — one memory at a time."
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 space-y-4 w-full">
          <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">My Profile</h2>

          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between">
              <span className="font-semibold">👤 Name:</span>
              <span>{userDetails.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">📧 Email:</span>
              <span className="text-right break-words">{userDetails.email}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">📱 Mobile:</span>
              <span>{userDetails.mobile}</span>
            </div>
          </div>

          <div className="text-center text-gray-400 text-xs mt-6">
            Showtime Studio © 2025
          </div>
        </div>
      </div>
    </div>
  );
}
