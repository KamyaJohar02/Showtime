"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@/components/context/UserContext"; // Replace with your actual context

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser(); // Get the user state from context

  useEffect(() => {
    if (!user) {
      // Handle redirection for /admin
      if (pathname === "/admin") {
        router.push("/login"); // No redirect query parameter
        return;
      }

      // Handle redirection for other paths (e.g., /booking)
      const redirectPath = encodeURIComponent(pathname);
      router.push(`/login?redirect=${redirectPath}`);
    }
  }, [user, pathname, router]);

  if (!user) {
    return <div>Loading...</div>; // Optional loading indicator
  }

  return <>{children}</>;
};

export default AuthGuard;
