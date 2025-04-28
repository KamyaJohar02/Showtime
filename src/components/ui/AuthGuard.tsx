"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext"; // ✅ named import

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
  if (!loading) {
    if (!user) {
      if (pathname === "/admin") {
        router.push("/login");
      } else {
        router.push(`/login?redirect=${pathname}`);
      }
    } else if (pathname === "/admin" && !isAdmin) {
      router.push("/not-authorized");
    }
  }
}, [user, isAdmin, loading, pathname, router]);


  if (!user) {
    return <div>Loading...</div>; // Optional loading indicator
  }

  return <>{children}</>;
};

export default AuthGuard;
