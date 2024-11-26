"use client";

import { useState } from "react";
import ManageBookings from "./booking"; // Import the Manage Bookings component
import ManageRooms from "./rooms"; // Import the Manage Rooms component
import ManageDates from "./dates"; // Import the Manage Dates component
import ManageDecorations from "./decorations"; // Import the Manage Decorations component
import ManageTimeSlots from "./timeslots"; // Import the Manage Time Slots component
import AddBooking from "./addbooking"; // Import the Add Booking component
import CompletedBookings from "./completedbookings"; // Import the Completed Bookings component
import TodayBookings from "./todaybooking"; // Import the Today's Bookings component

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<string>("dashboard"); // Default to Dashboard

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <div>Welcome to the Admin Panel!</div>; // Replace with your dashboard component if any
      case "addBookings":
        return <AddBooking />;
      case "todayBookings":
        return <TodayBookings />;
      case "bookings":
        return <ManageBookings />;
      case "completedBookings":
        return <CompletedBookings />;
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
      <aside className="w-40 bg-white shadow-md"> {/* Reduced width */}
        <div className="p-2"> {/* Reduced padding */}
          <h2 className="text-xl font-bold text-red-600 mb-6">Admin Panel</h2> {/* Smaller heading */}
          <nav className="space-y-3"> {/* Reduced vertical spacing */}
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`block text-sm ${activeSection === "dashboard" ? "text-red-600" : "text-gray-800"} hover:text-red-600`} /* Reduced text size */
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveSection("addBookings")}
              className={`block text-sm ${activeSection === "addBookings" ? "text-red-600" : "text-gray-800"} hover:text-red-600`}
            >
              Add Bookings
            </button>
            <button
              onClick={() => setActiveSection("todayBookings")}
              className={`block text-sm ${activeSection === "todayBookings" ? "text-red-600" : "text-gray-800"} hover:text-red-600`}
            >
              Today's Bookings
            </button>
            <button
              onClick={() => setActiveSection("bookings")}
              className={`block text-sm ${activeSection === "bookings" ? "text-red-600" : "text-gray-800"} hover:text-red-600`}
            >
              Manage Bookings
            </button>
            <button
              onClick={() => setActiveSection("completedBookings")}
              className={`block text-sm ${activeSection === "completedBookings" ? "text-red-600" : "text-gray-800"} hover:text-red-600`}
            >
              Completed Bookings
            </button>
            <button
              onClick={() => setActiveSection("rooms")}
              className={`block text-sm ${activeSection === "rooms" ? "text-red-600" : "text-gray-800"} hover:text-red-600`}
            >
              Manage Rooms
            </button>
            <button
              onClick={() => setActiveSection("dates")}
              className={`block text-sm ${activeSection === "dates" ? "text-red-600" : "text-gray-800"} hover:text-red-600`}
            >
              Manage Dates
            </button>
            <button
              onClick={() => setActiveSection("decorations")}
              className={`block text-sm ${activeSection === "decorations" ? "text-red-600" : "text-gray-800"} hover:text-red-600`}
            >
              Manage Decorations
            </button>
            <button
              onClick={() => setActiveSection("timeSlots")}
              className={`block text-sm ${activeSection === "timeSlots" ? "text-red-600" : "text-gray-800"} hover:text-red-600`}
            >
              Manage Time Slots
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-0">{renderActiveSection()}</main>
    </div>
  );
}
