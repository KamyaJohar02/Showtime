"use client";

import React from "react";

// Define a type for the props that include children
interface BookingxLayoutProps {
  children: React.ReactNode;
}

export default function BookingxLayout({ children }: BookingxLayoutProps) {
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}
