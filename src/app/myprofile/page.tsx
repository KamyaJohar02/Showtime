"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import { useRouter } from "next/navigation";

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
}

const MyProfilePage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState({ name: "", mobile: "" });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
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
          setUserDetails({
            name: userData.name,
            mobile: userData.mobile,
          });

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
    const bookingTime = new Date(`${booking.date} ${booking.timeSlot.split("-")[0].trim()}`);
    return bookingTime.getTime() - now.getTime() > 24 * 60 * 60 * 1000;
  };

  const handleCancel = async (booking: Booking) => {
    if (!isCancellable(booking)) return;
    try {
      await deleteDoc(doc(db, "bookings", booking.id));
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      alert("Booking cancelled successfully.");
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
        <h1 className="text-3xl font-semibold mb-4">Welcome, {userDetails.name}</h1>
        <p><strong>Mobile:</strong> {userDetails.mobile}</p>

        <h2 className="text-2xl font-semibold mt-6">My Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 mt-4">
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
                <th className="border border-gray-300 p-2">Amount Paid</th>
                <th className="border border-gray-300 p-2">Due Amount</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="border border-gray-300 p-2">{booking.name}</td>
                  <td className="border border-gray-300 p-2">{booking.email}</td>
                  <td className="border border-gray-300 p-2">{booking.mobile}</td>
                  <td className="border border-gray-300 p-2">{booking.people}</td>
                  <td className="border border-gray-300 p-2">{booking.room}</td>
                  <td className="border border-gray-300 p-2">{booking.date}</td>
                  <td className="border border-gray-300 p-2">{booking.timeSlot}</td>
                  <td className="border border-gray-300 p-2">{booking.decorations.join(", ")}</td>
                  <td className="border border-gray-300 p-2">{booking.cake ? "Yes" : "No"}</td>
                  <td className="border border-gray-300 p-2">₹{booking.advanceAmount}</td>
                  <td className="border border-gray-300 p-2">₹{booking.dueAmount}</td>
                  <td className="border border-gray-300 p-2">{booking.status}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowConfirmModal(true);
                      }}
                      disabled={!isCancellable(booking)}
                      className={`px-3 py-1 text-sm rounded text-white ${isCancellable(booking) ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
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
    </>
  );
};

export default MyProfilePage;