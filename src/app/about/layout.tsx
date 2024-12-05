"use client";

import React from "react";

interface AboutLayoutProps {
  children: React.ReactNode;
}

const AboutLayout = ({ children }: AboutLayoutProps) => {
  return (
    <div>
      {/* Optional header */}
      <header className="w-full bg-gray-800 text-white py-3">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg font-semibold">Welcome to Showtime's About Page</h2>
        </div>
      </header>
      {/* Main Content */}
      <main className="bg-gray-100 py-8">{children}</main>
      {/* Optional Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>Copyright ©2024 Showtime - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutLayout;
