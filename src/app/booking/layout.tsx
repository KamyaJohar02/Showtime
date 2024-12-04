"use client";

import React from "react";
import AuthGuard from "@/components/ui/AuthGuard";

// Define a type for the props that include children
interface BookingLayoutProps {
  children: React.ReactNode;
}

export default function BookingLayout({ children }: BookingLayoutProps) {
  return (
    <AuthGuard>
      <div>
        <section>{children}</section>
      </div>
    </AuthGuard>
  );
}
