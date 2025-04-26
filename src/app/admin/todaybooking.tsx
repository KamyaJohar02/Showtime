"use client";

import { useState, useEffect } from "react";
import { getAllDocuments, updateDocument } from "@/lib/firestoreUtils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [newMobile, setNewMobile] = useState<string>("");

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

  const handleEditMobileSave = async () => {
    if (!editingBooking || newMobile.trim() === "") return;

    try {
      await updateDocument("bookings", editingBooking.id, { mobile: newMobile });
      setTodayBookings((prev) =>
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

  const generateBillPDF = (booking: Booking) => {
    const doc = new jsPDF() as any;
  
    // Business Header
    doc.setFontSize(22);
    doc.text("THE SHOWTIME STUDIO", 15, 20);
    doc.setFontSize(11);
    doc.text("A-87/3, Block A, Wazirpur Industrial Area, Delhi", 15, 28);
    doc.text("Phone: +91-9220433244", 15, 34);
  
    // Invoice Info (right side)
    const todayDate = new Date().toLocaleDateString("en-GB");
    doc.setFontSize(12);
    doc.text(`Invoice No: ________`, 150, 20);
    doc.text(`Date: ${todayDate}`, 150, 28);
  
    // Billed To
    doc.setFontSize(14);
    doc.text("BILLED TO:", 15, 50);
    doc.setFontSize(12);
    doc.text(booking.name, 15, 58);
    doc.text(booking.mobile, 15, 64);
    doc.text(booking.email, 15, 70);
  
    // Booking Details (Guests, Slot, Occasion, Occasion Name)
    autoTable(doc, {
      startY: 80,
      theme: "grid",
      head: [["Guests", "Slot", "Occasion", "Occasion Name"]],
      body: [[
        booking.people,
        booking.timeSlot,
        booking.occasion || "-",
        booking.occasionName || "-"
      ]],
      styles: { fontSize: 10 },
    });
  
    // Items Table (Cake + Decorations + Room Booking)
    const tableY = doc.lastAutoTable.finalY + 10;
  
    const items: [string, string][] = [];
  
    if (booking.cake) {
      items.push([`Cake: ${booking.cake}`, "1"]);
    }
    if (booking.decorations && booking.decorations.length > 0) {
      items.push([`Decorations: ${booking.decorations.join(", ")}`, "1"]);
    }
    items.push([`Room Booking: ${booking.room}`, "1"]);
  
    autoTable(doc, {
      startY: tableY,
      head: [["Item", "Quantity"]],
      body: items,
      theme: "grid",
      styles: { fontSize: 10 },
    });
  
    // Payment Summary
    const summaryY = doc.lastAutoTable.finalY + 10;
  
    autoTable(doc, {
      startY: summaryY,
      head: [["Subtotal", "Advance Paid", "Due Amount"]],
      body: [[
        `₹${booking.advanceAmount + booking.dueAmount}`,
        `₹${booking.advanceAmount}`,
        `₹${booking.dueAmount}`
      ]],
      theme: "grid",
      styles: { fontSize: 10 },
    });
  
    // Footer
    doc.setFontSize(11);
    doc.text("Thank you for choosing The Showtime Studio!", 105, 285, { align: "center" });
  
    doc.save(`invoice_booking_${booking.name}.pdf`);
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
                      onClick={() => {
                        setEditingBooking(booking);
                        setNewMobile(booking.mobile);
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Edit Mobile
                    </button>
                    <button
                      onClick={() => generateBillPDF(booking)}
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      Print Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default TodayBookings;
