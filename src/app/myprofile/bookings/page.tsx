"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Booking {
  id: string;
  name: string;
  email: string;
  mobile: string;
  room: string;
  date: string;
  timeSlot: string;
  decorations: string[];
  cake: boolean;
  people: number;
  advanceAmount: number;
  dueAmount: number;
  status: string;
  razorpayPaymentId?: string;
}

const MyProfileBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelledPaymentId, setCancelledPaymentId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          alert("You need to log in to view this page.");
          router.push("/login");
          return;
        }

        const userQuery = query(collection(db, "users"), where("email", "==", user.email));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          const bookingsQuery = query(
            collection(db, "bookings"),
            where("mobile", "==", userData.mobile)
          );
          const bookingsSnapshot = await getDocs(bookingsQuery);

          const userBookings = bookingsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Booking[];

          setBookings(userBookings);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  const isCancellable = (booking: Booking) => {
    const now = new Date();
    const [startTime] = booking.timeSlot.split("-");
    const isoTime = convertTo24Hour(startTime.trim());
    const bookingDateTime = new Date(`${booking.date}T${isoTime}`);
    return bookingDateTime.getTime() - now.getTime() > 24 * 60 * 60 * 1000;
  };

  function convertTo24Hour(timeStr: string): string {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":" as const).map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
  }

  const handleCancel = async (booking: Booking) => {
    if (!isCancellable(booking)) return;
    try {
      await deleteDoc(doc(db, "bookings", booking.id));

      const bookedQuery = query(
        collection(db, "booked"),
        where("date", "==", booking.date),
        where("room", "==", booking.room),
        where("timeSlot", "==", booking.timeSlot)
      );
      const snapshot = await getDocs(bookedQuery);
      snapshot.forEach(async (docSnap) => {
        await deleteDoc(doc(db, "booked", docSnap.id));
      });

      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      setCancelledPaymentId(booking.razorpayPaymentId || null);
      setShowCancelPopup(true);
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      alert("Failed to cancel booking.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mt-6 mb-1">My Bookings</h1>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Mobile</th>
                <th className="border p-2">Room</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Time Slot</th>
                <th className="border p-2">Guest Count</th>
                <th className="border p-2">Advance</th>
                <th className="border p-2">Due</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="border p-2">{booking.name}</td>
                  <td className="border p-2">{booking.email}</td>
                  <td className="border p-2">{booking.mobile}</td>
                  <td className="border p-2">{booking.room}</td>
                  <td className="border p-2">{booking.date}</td>
                  <td className="border p-2">{booking.timeSlot}</td>
                  <td className="border p-2">{booking.people}</td>
                  <td className="border p-2">₹{booking.advanceAmount}</td>
                  <td className="border p-2">₹{booking.dueAmount}</td>
                  <td className="border p-2">{booking.status}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowConfirmModal(true);
                      }}
                      disabled={!isCancellable(booking)}
                      className={`px-3 py-1 text-sm rounded text-white ${
                        isCancellable(booking)
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showConfirmModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6">Do you really want to cancel your booking?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Close
              </button>
              <button
                onClick={async () => {
                  await handleCancel(selectedBooking);
                  setShowConfirmModal(false);
                  setSelectedBooking(null);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Yes, Cancel My Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full animate-fade-in scale-95">
            <Image
              src="/Images/tick.png"
              alt="Booking Cancelled"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-center mb-2">Booking Cancelled</h2>
            <p className="text-center text-sm text-gray-700 mb-1">
              Your booking has been successfully cancelled.
            </p>
            <p className="text-center text-xs text-gray-600 mb-3">
              Refund will be processed within 7 business days to the original payment method.
            </p>
            {cancelledPaymentId && (
              <p className="text-center text-xs text-gray-500 mb-4">
                Payment ID: <strong>{cancelledPaymentId}</strong>
              </p>
            )}
            <div className="flex justify-center">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-6 rounded"
                onClick={() => setShowCancelPopup(false)}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyProfileBookingsPage;
