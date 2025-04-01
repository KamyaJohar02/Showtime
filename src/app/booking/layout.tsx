"use client";

import React from "react";

// Define a type for the props that include children
interface BookingLayoutProps {
  children: React.ReactNode;
}

export default function BookingLayout({ children }: BookingLayoutProps) {
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}
