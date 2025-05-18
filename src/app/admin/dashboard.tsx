"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useRouter } from "next/navigation";

interface DashboardProps {
  setActiveSection: (section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveSection }) => {
  const [todayBookings, setTodayBookings] = useState<number>(0);
  const [totalRooms, setTotalRooms] = useState<number>(0);
  const [pendingQueries, setPendingQueries] = useState<number>(0);

  const router = useRouter(); // Add the router for navigation

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];

      const bookingsSnapshot = await getDocs(
        query(collection(db, "bookings"), where("date", "==", today))
      );
      setTodayBookings(bookingsSnapshot.size);

      const roomsSnapshot = await getDocs(collection(db, "rooms"));
      setTotalRooms(roomsSnapshot.size);

      const queriesSnapshot = await getDocs(collection(db, "queries"));
      setPendingQueries(queriesSnapshot.size);
    };

    fetchData();
  }, []);

  const handleAddBooking = () => {
    {/*router.push("/admin/addbooking"); */} // Navigate to the add booking page
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Admin Panel</h1>
      <p className="text-gray-600 mb-8">Manage bookings, rooms, and more from one place.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span role="img" aria-label="calendar">📅</span> Today's Bookings
          </h2>
          <p className="text-2xl font-bold text-blue-600">{todayBookings}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span role="img" aria-label="room">🛏️</span> Total Rooms
          </h2>
          <p className="text-2xl font-bold text-green-600">{totalRooms}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span role="img" aria-label="query">❓</span> Pending Queries
          </h2>
          <p className="text-2xl font-bold text-yellow-600">{pendingQueries}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md"
          onClick={() => setActiveSection("bookings")}
        >
          <h3 className="text-lg font-semibold">Manage Bookings</h3>
          <p className="text-sm text-gray-500">View, update, and manage all bookings.</p>
        </div>

        <div
          className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md"
          onClick={() => setActiveSection("rooms")}
        >
          <h3 className="text-lg font-semibold">Manage Rooms</h3>
          <p className="text-sm text-gray-500">Add, update, or remove room details.</p>
        </div>

        <div
          className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md"
          onClick={() => setActiveSection("userQueries")}
        >
          <h3 className="text-lg font-semibold">User Queries</h3>
          <p className="text-sm text-gray-500">Respond to customer questions and issues.</p>
        </div>
      </div>

      {/* Add New Booking Button */}
      <div className="mt-6">
        <button
          onClick={handleAddBooking}
          className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700"
        >
          Add New Booking
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
