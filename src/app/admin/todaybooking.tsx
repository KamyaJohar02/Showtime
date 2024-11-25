"use client";

import { useState, useEffect } from "react";
import { fetchDocuments, deleteDocument, updateDocument } from "@/lib/firestoreUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Booking {
  id: string;
  name: string;
  email: string;
  mobile: string;
  room: string; // Room name from database
  date: string; // Date as a string in "YYYY-MM-DD" format
  timeSlot: string;
  decorations: string[]; // Array of decoration labels
  cake: boolean;
  advanceAmount: number;
  dueAmount: number;
  status: string;
}

const TodayBookings: React.FC = () => {
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editedBooking, setEditedBooking] = useState<Partial<Booking> | null>(null);

  useEffect(() => {
    const loadTodayBookings = async () => {
      try {
        setLoading(true);
        const fetchedBookings = (await fetchDocuments("bookings")) as Booking[];
        const todayDate = new Date().toLocaleDateString("en-CA"); // Ensures local timezone format "YYYY-MM-DD"

        // Filter bookings with today's date
        const filteredBookings = fetchedBookings.filter(
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

  const handleDeleteBooking = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this booking?");
    if (!confirm) return;

    try {
      await deleteDocument("bookings", id);
      setTodayBookings((prev) => prev.filter((booking) => booking.id !== id));
    } catch (err) {
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
      setTodayBookings((prev) =>
        prev.map((booking) =>
          booking.id === editingBooking.id ? { ...booking, ...editedBooking } : booking
        )
      );
      setEditingBooking(null);
      setEditedBooking(null);
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("Failed to update booking.");
    }
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
    setEditedBooking(null);
  };

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
            {todayBookings.map((booking) => (
              <tr key={booking.id}>
                {editingBooking && editingBooking.id === booking.id ? (
                  <>
                    <td className="border border-gray-300 p-2">{booking.name}</td>
                    <td className="border border-gray-300 p-2">{booking.email}</td>
                    <td className="border border-gray-300 p-2">{booking.mobile}</td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={editedBooking?.room || ""}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({ ...prev, room: e.target.value }))
                        }
                        className="p-2 border rounded w-full"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="date"
                        value={editedBooking?.date || ""}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                        className="p-2 border rounded w-full"
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
                        className="p-2 border rounded w-full"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={(editedBooking?.decorations || []).join(", ")}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({
                            ...prev,
                            decorations: e.target.value.split(", "),
                          }))
                        }
                        className="p-2 border rounded w-full"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="checkbox"
                        checked={editedBooking?.cake || false}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({
                            ...prev,
                            cake: e.target.checked,
                          }))
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="number"
                        value={editedBooking?.advanceAmount || 0}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({
                            ...prev,
                            advanceAmount: Number(e.target.value),
                          }))
                        }
                        className="p-2 border rounded w-full"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="number"
                        value={editedBooking?.dueAmount || 0}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({
                            ...prev,
                            dueAmount: Number(e.target.value),
                          }))
                        }
                        className="p-2 border rounded w-full"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <select
                        value={editedBooking?.status || ""}
                        onChange={(e) =>
                          setEditedBooking((prev) => ({ ...prev, status: e.target.value }))
                        }
                        className="p-2 border rounded w-full"
                      >
                        <option value="pending">Pending</option>
                        <option value="fulfilled">Fulfilled</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={handleSaveBooking}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 ml-2"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
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
                                            onClick={() => handleEditBooking(booking)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            onClick={() => handleDeleteBooking(booking.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
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
                    
                    export default TodayBookings;
                    