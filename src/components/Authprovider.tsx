/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { auth, db } from "@/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

// ✅ Updated to check 'adminusers' collection

// Auth context type definition
type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
};

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
});

// AuthProvider component
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);
      setLoading(true);

      if (currentUser) {
        try {
          // 🔄 Switch to reading from 'adminusers' collection
          const adminRef = doc(db, "adminusers", currentUser.uid);
          const adminDoc = await getDoc(adminRef);

          setIsAdmin(adminDoc.exists());
        } catch (error) {
          console.error("Error checking admin role:", error);
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

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
