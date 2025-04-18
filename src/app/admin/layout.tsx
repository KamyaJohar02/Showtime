"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import ManageBookings from "./booking";
import ManageRooms from "./rooms";
import ManageDates from "./dates";
import ManageTimeSlots from "./timeslots";
import CompletedBookings from "./completedbookings";
import TodayBookings from "./todaybooking";
import AuthGuard from "@/components/ui/AuthGuard";
import UserQueries from "./userqueries";
import Dashboard from "./dashboard"; // 👈 import your new dashboard



export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const router = useRouter();

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth); // Logs out the user
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
  return <Dashboard setActiveSection={setActiveSection} />;

      case "todayBookings":
        return <TodayBookings />;
      case "bookings":
        return <ManageBookings />;
      case "completedBookings":
        return <CompletedBookings />;
        case "userQueries":
  return <UserQueries />;

      case "rooms":
        return <ManageRooms />;
      case "dates":
        return <ManageDates />;
      case "timeSlots":
        return <ManageTimeSlots />;
        default:
          return <Dashboard setActiveSection={setActiveSection} />;
        
    }
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-40 bg-white shadow-md flex flex-col justify-between">
          <div className="p-2">
            <h2 className="text-xl font-bold text-red-600 mb-6">Admin Panel</h2>
            <nav className="space-y-3">
              <button
                onClick={() => setActiveSection("dashboard")}
                className={`block text-sm ${activeSection === "dashboard" ? "text-red-600" : "text-gray-800"} hover:text-red-600`}
              >
                Dashboard
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
  onClick={() => setActiveSection("userQueries")}
  className={`block text-sm ${activeSection === "userQueries" ? "text-red-600" : "text-gray-800"} hover:text-red-600`}
>
  User Queries
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
                onClick={() => setActiveSection("timeSlots")}
                className={`block text-sm ${activeSection === "timeSlots" ? "text-red-600" : "text-gray-800"} hover:text-red-600`}
              >
                Manage Time Slots
              </button>
            </nav>
          </div>
          {/* Logout Button */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-0">{renderActiveSection()}</main>
      </div>
    </AuthGuard>
  );
}
