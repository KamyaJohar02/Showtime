"use client";

import { useState, useEffect } from "react";
import {
  getAllDocuments,
  deleteDocument,
  updateDocument,
  getDocsByMultipleFields,
} from "@/lib/firestoreUtils";

interface Booking {
  id: string;
  name: string;
  email: string;
  mobile: string;
  room: string;
  date: string;
  timeSlot: string;
  decorations: string[];
  cake: string;
  people: number;
  advanceAmount: number;
  dueAmount: number;
  status: string;
  occasion?: string;
  occasionName?: string;
}

const TodayBookings: React.FC = () => {
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTodayBookings = async () => {
      try {
        setLoading(true);
        const fetchedBookings = (await getAllDocuments("bookings")) as Booking[];
        const todayDate = new Date().toLocaleDateString("en-CA");
        const filtered = fetchedBookings.filter((b) => b.date === todayDate);
        setTodayBookings(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load today's bookings:", err);
        setError("Failed to load today's bookings.");
        setLoading(false);
      }
    };

    loadTodayBookings();
  }, []);

  const handleDeleteBooking = async (booking: Booking) => {
    const confirm = window.confirm("Are you sure you want to delete this booking?");
    if (!confirm) return;

    try {
      await deleteDocument("bookings", booking.id);

      const bookedDocs = await getDocsByMultipleFields("booked", [
        { field: "room", value: booking.room },
        { field: "date", value: booking.date },
        { field: "timeSlot", value: booking.timeSlot },
      ]);

      for (const doc of bookedDocs) {
        await deleteDocument("booked", doc.id);
      }

      setTodayBookings((prev) => prev.filter((b) => b.id !== booking.id));
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking.");
    }
  };

  const handleEditMobile = async (booking: Booking) => {
    const newMobile = prompt("Enter new mobile number:", booking.mobile);
    if (!newMobile || newMobile === booking.mobile) return;

    try {
      await updateDocument("bookings", booking.id, { mobile: newMobile });
      setTodayBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? { ...b, mobile: newMobile } : b))
      );
      alert("Mobile number updated successfully.");
    } catch (err) {
      console.error("Error updating mobile:", err);
      alert("Failed to update mobile number.");
    }
  };

  return (
    <div className="p-4 text-xs">
      <h1 className="text-base font-bold mb-4">Today's Bookings</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : todayBookings.length === 0 ? (
        <p>No bookings found for today.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="text-xs w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-1 border">Name</th>
                <th className="p-1 border">Email</th>
                <th className="p-1 border">Mobile</th>
                <th className="p-1 border">Guests</th>
                <th className="p-1 border">Room</th>
                <th className="p-1 border">Date</th>
                <th className="p-1 border">Slot</th>
                <th className="p-1 border">Occasion</th>
                <th className="p-1 border">Occasion Name</th>
                <th className="p-1 border">Cake</th>
                <th className="p-1 border">Decorations</th>
                <th className="p-1 border">Advance</th>
                <th className="p-1 border">Due</th>
                <th className="p-1 border">Status</th>
                <th className="p-1 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todayBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="p-1 border">{booking.name}</td>
                  <td className="p-1 border">{booking.email}</td>
                  <td className="p-1 border">{booking.mobile}</td>
                  <td className="p-1 border">{booking.people}</td>
                  <td className="p-1 border">{booking.room}</td>
                  <td className="p-1 border">{booking.date}</td>
                  <td className="p-1 border">{booking.timeSlot}</td>
                  <td className="p-1 border">{booking.occasion || "-"}</td>
                  <td className="p-1 border">{booking.occasionName || "-"}</td>
                  <td className="p-1 border">{booking.cake || "No"}</td>
                  <td className="p-1 border">{(booking.decorations || []).join(", ")}</td>
                  <td className="p-1 border">₹{booking.advanceAmount}</td>
                  <td className="p-1 border">₹{booking.dueAmount}</td>
                  <td className="p-1 border">{booking.status}</td>
                  <td className="p-1 border space-x-2">
                    <button
                      onClick={() => handleDeleteBooking(booking)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditMobile(booking)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Edit Mobile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TodayBookings;
