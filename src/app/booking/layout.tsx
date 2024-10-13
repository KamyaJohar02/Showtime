import React from 'react';

// Define a type for the props that include children
interface BookingProps {
  children: React.ReactNode;
}

export default function Booking({ children }: BookingProps) {
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}
