"use client";

import { useState, useEffect } from "react";
import { getAllDocuments, deleteDocument } from "@/lib/firestoreUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Booking {
  id: string;
  name: string;
  email: string;
  mobile: string;
  people: number;
  room: string;
  date: string;
  timeSlot: string;
  occasion?: string;
  occasionName?: string;
  cake?: string;
  decorations?: string[];
  advanceAmount: number;
  dueAmount: number;
  status: string;
}

const CompletedBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const fetchedBookings = (await getAllDocuments("bookings")) as Booking[];
        const fulfilledBookings = fetchedBookings.filter((booking) => booking.status === "fulfilled");
        setBookings(fulfilledBookings);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setError("Failed to load bookings.");
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleDeleteBooking = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this booking?");
    if (!confirm) return;

    try {
      await deleteDocument("bookings", id);
      setBookings((prev) => prev.filter((booking) => booking.id !== id));
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking.");
    }
  };

  const selectedDateString = selectedDate?.toLocaleDateString("en-CA");
  const filteredBookings = selectedDate
    ? bookings.filter((booking) => booking.date === selectedDateString)
    : bookings;

  return (
    <div className="p-4 text-xs">
      <h1 className="text-base font-bold mb-4">Completed Bookings</h1>

      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date to filter"
          className="p-1 border rounded w-64 text-sm"
        />
        <button
          onClick={() => setSelectedDate(null)}
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
        >
          Reset Filter
        </button>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredBookings.length === 0 ? (
        <p>No completed bookings found for the selected date.</p>
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
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-100">
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
                  <td className="p-1 border">
                    <button
                      onClick={() => handleDeleteBooking(booking.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
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

export default CompletedBookings;
