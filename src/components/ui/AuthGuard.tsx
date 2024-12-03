"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/components/context/UserContext"; // Ensure this is your User Context provider

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const { user } = useUser(); // Get the user state from context
  const searchParams = useSearchParams(); // To handle current query parameters

  useEffect(() => {
    if (!user) {
      // Get the current path to redirect back after login
      const currentPath = window.location.pathname;
      const redirectQuery = `?redirect=${encodeURIComponent(currentPath)}`;

      // Redirect to login page with redirect query parameter
      router.push(`/login${redirectQuery}`);
    }
  }, [user, router]);

  if (!user) {
    // Optional: Show a loading indicator while redirecting
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
