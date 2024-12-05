"use client";

import React from "react";

interface GalleryLayoutProps {
  children: React.ReactNode;
}

const GalleryLayout = ({ children }: GalleryLayoutProps) => {
  return (
    <div>
      {/* Optional Header */}
      <header className="w-full bg-gray-800 text-white py-3">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg font-semibold">Welcome to Showtime's Gallery</h2>
        </div>
      </header>
      {/* Main Content */}
      <main className="bg-gray-100 py-8">{children}</main>
      {/* Optional Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          
        </div>
      </footer>
    </div>
  );
};

export default GalleryLayout;
