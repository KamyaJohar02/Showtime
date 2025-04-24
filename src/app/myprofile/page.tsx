"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function DashboardPage() {
  const [userDetails, setUserDetails] = useState({ name: "", email: "", mobile: "" });

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
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-2 text-lg">
        <p><strong>Name:</strong> {userDetails.name}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
        <p><strong>Mobile:</strong> {userDetails.mobile}</p>
      </div>
    </div>
  );
}