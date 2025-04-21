"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

type UserContextType = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  isAdmin: false,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);
      setLoading(true);

      if (currentUser) {
        try {
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
    <UserContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Updated hook with correct typing
export const useAuth = () => useContext(UserContext);
