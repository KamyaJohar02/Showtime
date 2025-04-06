/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { auth, db } from "@/firebaseConfig"; // Import Firestore
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore for user role fetching
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null; // Firebase User object
  isAdmin: boolean; // Whether the user is an admin
  loading: boolean; // Loading state for auth/role
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // For showing loaders during async actions

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);
      setLoading(true);

      if (currentUser) {
        // Fetch user role from Firestore
        const userRef = doc(db, "users", currentUser.uid); // Assumes user roles are stored in Firestore `users` collection
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.role === "admin"); // Check if the user is an admin
        } else {
          console.warn("No role found for user.");
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
