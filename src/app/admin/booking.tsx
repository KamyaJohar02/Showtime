"use client";

import { useState, useEffect } from "react";
import { fetchDocuments, deleteDocument, updateDocument } from "@/lib/firestoreUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const ManageBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editedBooking, setEditedBooking] = useState<Partial<Booking> | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const fetchedBookings = await fetchDocuments("bookings");
        setBookings(fetchedBookings as Booking[]);
        setLoading(false);
      } catch (err: any) {
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
    } catch (err: any) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking.");
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setEditedBooking({ ...booking });
  };

  const handleSaveBooking = async () => {
    if (!editedBooking || !editingBooking) return;

    try {
      await updateDocument("bookings", editingBooking.id, editedBooking);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === editingBooking.id ? { ...booking, ...editedBooking } : booking
        )
      );
      setEditingBooking(null);
      setEditedBooking(null);
    } catch (err: any) {
      console.error("Error updating booking:", err);
      alert("Failed to update booking.");
    }
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
    setEditedBooking(null);
  };

  // Filter bookings by selected date
  const filteredBookings = selectedDate
    ? bookings.filter(
        (booking) =>
          new Date(booking.date).toISOString().split("T")[0] ===
          selectedDate.toISOString().split("T")[0]
      )
    : bookings;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>

      {/* Date Picker for Filtering */}
      <div className="mb-4">
        <label htmlFor="filter-date" className="block text-lg font-medium mb-2">
          Filter by Date:
        </label>
        <DatePicker
          id="filter-date"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date to filter"
          className="p-2 border rounded w-64"
        />
        <button
          onClick={() => setSelectedDate(null)}
          className="ml-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset Filter
        </button>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredBookings.length === 0 ? (
        <p>No bookings found for the selected date.</p>
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
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                {editingBooking && editingBooking.id === booking.id ? (
                  <>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={editedBooking?.userId || ""}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({ ...prev, userId: e.target.value }))
                        }
                        className="w-full border rounded"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={editedBooking?.room || ""}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({ ...prev, room: e.target.value }))
                        }
                        className="w-full border rounded"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="date"
                        value={editedBooking?.date || ""}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({ ...prev, date: e.target.value }))
                        }
                        className="w-full border rounded"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={editedBooking?.timeSlot || ""}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({
                            ...prev,
                            timeSlot: e.target.value,
                          }))
                        }
                        className="w-full border rounded"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={editedBooking?.advanceAmount || ""}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({
                            ...prev,
                            advanceAmount: e.target.value,
                          }))
                        }
                        className="w-full border rounded"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={editedBooking?.dueAmount || ""}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({
                            ...prev,
                            dueAmount: e.target.value,
                          }))
                        }
                        className="w-full border rounded"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={editedBooking?.status || ""}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        className="w-full border rounded"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={handleSaveBooking}
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border border-gray-300 p-2">{booking.userId}</td>
                    <td className="border border-gray-300 p-2">{booking.room}</td>
                    <td className="border border-gray-300 p-2">{booking.date}</td>
                    <td className="border border-gray-300 p-2">{booking.timeSlot}</td>
                    <td className="border border-gray-300 p-2">₹{booking.advanceAmount}</td>
                    <td className="border border-gray-300 p-2">₹{booking.dueAmount}</td>
                    <td className="border border-gray-300 p-2">{booking.status}</td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => handleEditBooking(booking)}
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageBookings;
