"use client";

import { useState, useEffect } from "react";
import { getAllDocuments, updateDocument } from "@/lib/firestoreUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

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
  razorpayPaymentId?: string;
}

const ManageBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // New state for Edit Mobile popup
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [newMobile, setNewMobile] = useState<string>("");

  const exportToCSV = () => {
    if (filteredBookings.length === 0) {
      alert("No bookings available to export.");
      return;
    }
  
    const headers = [
      "Name",
      "Email",
      "Mobile",
      "Guests",
      "Room",
      "Date",
      "Slot",
      "Occasion",
      "Occasion Name",
      "Cake",
      "Decorations",
      "Advance",
      "Due",
      "Status",
      "Payment ID",
    ];
  
    const rows = filteredBookings.map((b) => [
      b.name,
      b.email,
      b.mobile,
      b.people,
      b.room,
      b.date,
      b.timeSlot,
      b.occasion || "-",
      b.occasionName || "-",
      b.cake || "No",
      (b.decorations || []).join("; "),
      `₹${b.advanceAmount}`,
      `₹${b.dueAmount}`,
      b.status,
      b.razorpayPaymentId || "-",
    ]);
  
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `bookings_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  useEffect(() => {
    const loadAndUpdateBookings = async () => {
      try {
        setLoading(true);
        const fetchedBookings = (await getAllDocuments("bookings")) as Booking[];

        const today = new Date().toISOString().split("T")[0];

        const updatedBookings = await Promise.all(
          fetchedBookings.map(async (booking) => {
            if (booking.status === "pending" && booking.date < today) {
              await updateDocument("bookings", booking.id, { status: "fulfilled" });
              return { ...booking, status: "fulfilled" };
            }
            return booking;
          })
        );

        const pendingOnly = updatedBookings.filter((booking) => booking.status === "pending");
        setBookings(pendingOnly);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load/update bookings:", err);
        setError("Failed to load/update bookings.");
        setLoading(false);
      }
    };

    loadAndUpdateBookings();
  }, []);

  const handleEditMobileSave = async () => {
    if (!editingBooking || newMobile.trim() === "") return;

    try {
      await updateDocument("bookings", editingBooking.id, { mobile: newMobile });
      setBookings((prev) =>
        prev.map((b) => (b.id === editingBooking.id ? { ...b, mobile: newMobile } : b))
      );
      alert("Mobile number updated successfully.");
      setEditingBooking(null);
      setNewMobile("");
    } catch (err) {
      console.error("Error updating mobile:", err);
      alert("Failed to update mobile number.");
    }
  };

  const selectedDateString = selectedDate?.toLocaleDateString("en-CA");
  const filteredBookings = selectedDate
    ? bookings.filter((booking) => booking.date === selectedDateString)
    : bookings;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  return (
    <div className="p-4 text-xs">
      <h1 className="text-base font-bold mb-4">Manage Bookings</h1>

      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setCurrentPage(1);
          }}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date to filter"
          className="p-1 border rounded w-64 text-sm"
        />
        <button
          onClick={() => {
            setSelectedDate(null);
            setCurrentPage(1);
          }}
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
        >
          Reset Filter
        </button>
        <button
  onClick={exportToCSV}
  disabled={filteredBookings.length === 0}
  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
>
  Export to CSV
</button>

      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredBookings.length === 0 ? (
        <p>No bookings found for the selected date.</p>
      ) : (
        <>
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
                  <th className="p-1 border">Payment ID</th>
                  <th className="p-1 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking) => (
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
                    <td className="p-1 border">{booking.razorpayPaymentId || "-"}</td>
                    <td className="p-1 border space-x-2">
                      <button
                        onClick={() => {
                          setEditingBooking(booking);
                          setNewMobile(booking.mobile);
                        }}
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

          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Edit Mobile Popup */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Mobile Number</h2>
            <input
              type="text"
              value={newMobile}
              onChange={(e) => setNewMobile(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter new mobile number"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingBooking(null);
                  setNewMobile("");
                }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEditMobileSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
