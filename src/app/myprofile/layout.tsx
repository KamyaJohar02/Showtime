"use client";

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function MyProfileLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userDetails, setUserDetails] = useState({ name: "", email: "", mobile: "" });
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, "users"), where("email", "==", user.email));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setUserDetails({ name: data.name, email: data.email, mobile: data.mobile });
        }
      } else {
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <aside className="w-full lg:w-64 bg-gray-800 text-white p-6">
        <h2 className="text-xl font-bold mb-6 text-center lg:text-left">My Profile</h2>
        <nav className="space-y-4">
          <button
            onClick={() => router.push("/myprofile")}
            className="block w-full text-left hover:bg-gray-700 p-2 rounded"
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push("/myprofile/bookings")}
            className="block w-full text-left hover:bg-gray-700 p-2 rounded"
          >
            My Bookings
          </button>
          <button
            onClick={() => router.push("/")}
            className="block w-full text-left hover:bg-blue-600 p-2 rounded"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left hover:bg-red-600 p-2 rounded"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}