import React from 'react';

// Define a type for the props that include children
interface ServicesProps {
  children: React.ReactNode;
}

export default function ServicesLayout({ children }: ServicesProps) {
  return (
    <div>
      <section className="p-0 bg-gray-50 min-h-screen"> {/* Added some basic padding and background */}
        {children}
      </section>
    </div>
  );
}
