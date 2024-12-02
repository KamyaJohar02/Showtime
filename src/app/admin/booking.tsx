"use client";

import { useState, useEffect } from "react";
import { getAllDocuments, deleteDocument, updateDocument } from "@/lib/firestoreUtils";
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
  people: number;
  advanceAmount: number;
  dueAmount: number;
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
        const fetchedBookings = (await getAllDocuments("bookings")) as Booking[];
        const currentDate = new Date();
  
        // Process bookings and update status if necessary
        const updatedPendingBookings = await Promise.all(
          fetchedBookings.map(async (booking) => {
            const bookingDate = new Date(booking.date);
  
            // If booking is pending and past its date, update status to "fulfilled"
            if (booking.status === "pending" && bookingDate < currentDate) {
              await updateDocument("bookings", booking.id, { status: "fulfilled" });
              return null; // Exclude from pending bookings
            }
  
            // Include only pending bookings
            return booking.status === "pending" ? booking : null;
          })
        );
  
        // Filter out null values (fulfilled bookings)
        const pendingBookings = updatedPendingBookings.filter(Boolean) as Booking[];
  
        setBookings(pendingBookings);
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
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("Failed to update booking.");
    }
  };

  const handleCancelEdit = () => {
    setEditingBooking(null);
    setEditedBooking(null);
  };

  const filteredBookings = selectedDate
    ? bookings.filter(
        (booking) =>
          new Date(booking.date).toISOString().split("T")[0] ===
          selectedDate.toISOString().split("T")[0]
      )
    : bookings;

    const updateBookingStatuses = async () => {
      const todayDate = new Date().toISOString().split("T")[0];
    
      // Prepare the updated bookings without overwriting the original state prematurely
      const updatedBookings = bookings.map((booking) => {
        if (booking.date < todayDate && booking.status === "pending") {
          return { ...booking, status: "fulfilled" };
        }
        return booking;
      });
    
      // Update the state only after mapping all bookings
      setBookings(updatedBookings);
    
      // Save only the necessary status changes to the database
      const bookingsToUpdate = updatedBookings.filter(
        (booking) => booking.date < todayDate && booking.status === "fulfilled"
      );
    
      try {
        await Promise.all(
          bookingsToUpdate.map(async (booking) => {
            await updateDocument("bookings", booking.id, { status: "fulfilled" });
          })
        );
      } catch (err) {
        console.error("Failed to update booking statuses:", err);
      }
    };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>

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
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Mobile</th>
              <th className="border border-gray-300 p-2">Guest Count</th>
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
              <tr key={booking.id}>
                {editingBooking && editingBooking.id === booking.id ? (
                  <>
                    <td className="border border-gray-300 p-2">{booking.name}</td>
                    <td className="border border-gray-300 p-2">{booking.email}</td>
                    <td className="border border-gray-300 p-2">{booking.mobile}</td>
                    <td className="border border-gray-300 p-2">{booking.people}</td>
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
                      <DatePicker
                        selected={new Date(editedBooking?.date || booking.date)}
                        onChange={(date) =>
                          setEditedBooking((prev) => ({
                            ...prev,
                            date: date?.toISOString().split("T")[0],
                          }))
                        }
                        dateFormat="yyyy-MM-dd"
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
                    <td className="border border-gray-300 p-2">{booking.people}</td>
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

export default ManageBookings;
