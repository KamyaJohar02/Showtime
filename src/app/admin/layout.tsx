


"use client";

import { useState } from "react";
import ManageBookings from "./booking"; // Import the Manage Bookings component
import ManageRooms from "./rooms"; // Import the Manage Rooms component
import ManageDates from "./dates"; // Import the Manage Dates component
import ManageDecorations from "./decorations"; // Import the Manage Decorations component
import ManageTimeSlots from "./timeslots"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<string>("dashboard"); // Default to Dashboard

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <div>Welcome to the Admin Panel!</div>; // Replace with your dashboard component if any
      case "bookings":
        return <ManageBookings />;
      case "rooms":
        return <ManageRooms />;
      case "dates":
        return <ManageDates />;
      case "decorations":
        return <ManageDecorations />;
      case "timeSlots":
        return <ManageTimeSlots />;
      default:
        return <div>Welcome to the Admin Panel!</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-6">Admin Panel</h2>
          <nav className="space-y-4">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`block text-lg ${
                activeSection === "dashboard" ? "text-red-600" : "text-gray-800"
              } hover:text-red-600`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveSection("bookings")}
              className={`block text-lg ${
                activeSection === "bookings" ? "text-red-600" : "text-gray-800"
              } hover:text-red-600`}
            >
              Manage Bookings
            </button>
            <button
              onClick={() => setActiveSection("rooms")}
              className={`block text-lg ${
                activeSection === "rooms" ? "text-red-600" : "text-gray-800"
              } hover:text-red-600`}
            >
              Manage Rooms
            </button>
            <button
              onClick={() => setActiveSection("dates")}
              className={`block text-lg ${
                activeSection === "dates" ? "text-red-600" : "text-gray-800"
              } hover:text-red-600`}
            >
              Manage Dates
            </button>
            <button
              onClick={() => setActiveSection("decorations")}
              className={`block text-lg ${
                activeSection === "decorations" ? "text-red-600" : "text-gray-800"
              } hover:text-red-600`}
            >
              Manage Decorations
            </button>
            <button
              onClick={() => setActiveSection("timeSlots")}
              className={`block text-lg ${
                activeSection === "dates" ? "text-red-600" : "text-gray-800"
              } hover:text-red-600`}
            >
              Manage Time Slots
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{renderActiveSection()}</main>
    </div>
  );
}
