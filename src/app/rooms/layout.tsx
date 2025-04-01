import React from "react";
interface RoomsProps {
  children: React.ReactNode;
}

export default function RoomsLayout({ children }: RoomsProps) {
  return (
    <div>
      {/* Optional Header */}
      <header className="w-full bg-gray-800 text-white py-3">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg font-semibold">Welcome to Showtime's Rooms</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-white py-8">{children}</main>

      {/* Optional Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center"></div>
      </footer>
    </div>
  );
}
