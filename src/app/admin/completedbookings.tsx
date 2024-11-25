"use client";

import { useState, useEffect } from "react";
import { fetchDocuments, deleteDocument } from "@/lib/firestoreUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Booking {
  id: string;
  name: string;
  email: string;
  mobile: string;
  room: string;
  date: string; // Date as a string in "YYYY-MM-DD" format
  timeSlot: string;
  decorations: string[]; // Array of decoration labels
  cake: boolean;
  advanceAmount: number;
  dueAmount: number;
  status: string;
}

const CompletedBookings: React.FC = () => {
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const loadCompletedBookings = async () => {
      try {
        setLoading(true);
        const fetchedDocuments = await fetchDocuments("bookings");
        const mappedBookings = fetchedDocuments.map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          email: doc.email,
          mobile: doc.mobile,
          room: doc.room,
          date: doc.date,
          timeSlot: doc.timeSlot,
          decorations: doc.decorations || [],
          cake: doc.cake,
          advanceAmount: doc.advanceAmount,
          dueAmount: doc.dueAmount,
          status: doc.status,
        })) as Booking[];

        const filteredBookings = mappedBookings.filter(
          (booking) => booking.status === "fulfilled"
        );

        setCompletedBookings(filteredBookings);
        setFilteredBookings(filteredBookings); // Initially, show all completed bookings
        setLoading(false);
      } catch (err) {
        console.error("Failed to load completed bookings:", err);
        setError("Failed to load completed bookings.");
        setLoading(false);
      }
    };

    loadCompletedBookings();
  }, []);

  const handleDeleteBooking = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this booking?");
    if (!confirm) return;

    try {
      await deleteDocument("bookings", id);
      setCompletedBookings((prev) => prev.filter((booking) => booking.id !== id));
      setFilteredBookings((prev) => prev.filter((booking) => booking.id !== id));
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking.");
    }
  };

  // Filter bookings by selected date
  const handleFilterByDate = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      const filtered = completedBookings.filter(
        (booking) => booking.date === formattedDate
      );
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(completedBookings); // Reset to all completed bookings
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Completed Bookings</h1>

      {/* Date Picker for Filtering */}
      <div className="mb-4">
        <label htmlFor="filter-date" className="block text-lg font-medium mb-2">
          Search by Date:
        </label>
        <DatePicker
          id="filter-date"
          selected={selectedDate}
          onChange={(date) => handleFilterByDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date to search"
          className="p-2 border rounded w-64"
        />
        <button
          onClick={() => handleFilterByDate(null)}
          className="ml-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset Filter
        </button>
      </div>

      {loading ? (
        <p>Loading completed bookings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredBookings.length === 0 ? (
        <p>No completed bookings found for the selected date.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Mobile</th>
              <th className="border border-gray-300 p-2">Room</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Time Slot</th>
              <th className="border border-gray-300 p-2">Decorations</th>
              <th className="border border-gray-300 p-2">Cake</th>
              <th className="border border-gray-300 p-2">Advance Amount</th>
              <th className="border border-gray-300 p-2">Due Amount</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{booking.name}</td>
                <td className="border border-gray-300 p-2">{booking.email}</td>
                <td className="border border-gray-300 p-2">{booking.mobile}</td>
                <td className="border border-gray-300 p-2">{booking.room}</td>
                <td className="border border-gray-300 p-2">{booking.date}</td>
                <td className="border border-gray-300 p-2">{booking.timeSlot}</td>
                <td className="border border-gray-300 p-2">
                  {(booking.decorations || []).join(", ")}
                </td>
                <td className="border border-gray-300 p-2">
                  {booking.cake ? "Yes" : "No"}
                </td>
                <td className="border border-gray-300 p-2">₹{booking.advanceAmount}</td>
                <td className="border border-gray-300 p-2">₹{booking.dueAmount}</td>
                <td className="border border-gray-300 p-2">{booking.status}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompletedBookings;
