"use client";

import { useState, useEffect } from "react";
import { fetchDocuments } from "@/lib/firestoreUtils";

interface Booking {
  id: string;
  userId: string;
  room: string;
  date: string; // Date as a string in "YYYY-MM-DD" format
  timeSlot: string;
  advanceAmount: string;
  dueAmount: string;
  status: string;
}

const TodayBookings: React.FC = () => {
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTodayBookings = async () => {
      try {
        setLoading(true);
        const fetchedBookings = await fetchDocuments("bookings");
        const todayDate = new Date().toISOString().split("T")[0];

        // Filter bookings with today's date
        const filteredBookings = (fetchedBookings as Booking[]).filter(
          (booking) => booking.date === todayDate
        );

        setTodayBookings(filteredBookings);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load today's bookings:", err);
        setError("Failed to load today's bookings.");
        setLoading(false);
      }
    };

    loadTodayBookings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Today's Bookings</h1>

      {loading ? (
        <p>Loading today's bookings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : todayBookings.length === 0 ? (
        <p>No bookings found for today.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">User ID</th>
              <th className="border border-gray-300 p-2">Room</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Time Slot</th>
              <th className="border border-gray-300 p-2">Advance Amount</th>
              <th className="border border-gray-300 p-2">Due Amount</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {todayBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="border border-gray-300 p-2">{booking.userId}</td>
                <td className="border border-gray-300 p-2">{booking.room}</td>
                <td className="border border-gray-300 p-2">{booking.date}</td>
                <td className="border border-gray-300 p-2">{booking.timeSlot}</td>
                <td className="border border-gray-300 p-2">₹{booking.advanceAmount}</td>
                <td className="border border-gray-300 p-2">₹{booking.dueAmount}</td>
                <td className="border border-gray-300 p-2">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TodayBookings;
