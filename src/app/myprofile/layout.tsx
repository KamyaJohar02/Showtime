"use client";

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";


interface Booking {
  id: string;
  room: string;
  date: string;
  timeSlot: string;
  status: string;
  advanceAmount: number;
  dueAmount: number;
  razorpayPaymentId?: string;
}

const MyProfileLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userDetails, setUserDetails] = useState({ name: "", email: "", mobile: "" });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const router = useRouter();

  const [showCancelPopup, setShowCancelPopup] = useState(false);
const [cancelledPaymentId, setCancelledPaymentId] = useState<string | null>(null);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const userQuery = query(collection(db, "users"), where("email", "==", user.email));
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            setUserDetails({
              name: userData.name,
              email: userData.email,
              mobile: userData.mobile,
            });

            const bookingsQuery = query(
              collection(db, "bookings"),
              where("mobile", "==", userData.mobile)
            );
            const bookingsSnapshot = await getDocs(bookingsQuery);

            const fetchedBookings = bookingsSnapshot.docs.map((doc) => {
              const data = doc.data() as Omit<Booking, "id">;
              return { id: doc.id, ...data };
            });
            

            setBookings(fetchedBookings);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const isCancellable = (booking: Booking) => {
    const now = new Date();
    const [startTime] = booking.timeSlot.split("-"); // e.g., "11:00 AM"
  
    const isoFormattedTime = convertTo24Hour(startTime.trim()); // "13:00:00"
    const bookingDateTime = new Date(`${booking.date}T${isoFormattedTime}`); // "2024-04-28T13:00:00"
  
    return bookingDateTime.getTime() - now.getTime() > 24 * 60 * 60 * 1000;
  };
  
  // Helper: converts "11:00 AM" to "11:00:00", "01:00 PM" to "13:00:00"
  function convertTo24Hour(timeStr: string): string {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
  
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
  
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
  }
  

  const handleCancel = async (booking: Booking) => {
    if (!isCancellable(booking)) return;
  
    try {
      if (booking.razorpayPaymentId) {
        const refundRes = await fetch("/api/razorpay/refund", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId: booking.razorpayPaymentId }),
        });
  
        const refundData = await refundRes.json();
  
        if (!refundData.success) {
          alert("Failed to initiate refund. Booking not cancelled.");
          return;
        }
      }
  
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
      setCancelledPaymentId(booking.razorpayPaymentId || null); // ✅ save the payment ID
      setShowCancelPopup(true); // ✅ show the animated popup
    } catch (error) {
      console.error("Cancellation failed:", error);
      alert("Failed to cancel booking.");
    }
  };
  

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleHomeRedirect = () => {
    router.push("/");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <aside className="w-full lg:w-64 bg-gray-800 text-white p-6">
        <h2 className="text-xl font-bold mb-6 text-center lg:text-left">My Profile</h2>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`block w-full text-left hover:bg-gray-700 p-2 rounded ${
              activeTab === "dashboard" ? "bg-gray-700" : ""
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`block w-full text-left hover:bg-gray-700 p-2 rounded ${
              activeTab === "bookings" ? "bg-gray-700" : ""
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={handleHomeRedirect}
            className="block w-full text-left hover:bg-blue-600 p-2 rounded"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left hover:bg-red-600 p-2 rounded"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <div className="space-y-2 text-lg">
              <p>
                <strong>Name:</strong> {userDetails.name}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Mobile:</strong> {userDetails.mobile}
              </p>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <h1 className="text-2xl font-semibold mt-6 mb-1">My Bookings</h1>
<p className="text-sm text-gray-600 mb-4">
  For cancellations and refunds, please review our{" "}
  <a
    href="/privacy-policy"
    className="text-blue-600 underline hover:text-blue-800"
    target="_blank"
  >
    Refund Policy
  </a>.
</p>
{bookings.length === 0 ? (
  <p>No bookings found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 mt-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">Room</th>
                      <th className="border border-gray-300 p-2">Date</th>
                      <th className="border border-gray-300 p-2">Time Slot</th>
                      <th className="border border-gray-300 p-2">Advance Amount</th>
                      <th className="border border-gray-300 p-2">Due Amount</th>
                      <th className="border border-gray-300 p-2">Status</th>
                      <th className="border border-gray-300 p-2">Payment ID</th>
                      <th className="border border-gray-300 p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="border border-gray-300 p-2">{booking.room}</td>
                        <td className="border border-gray-300 p-2">{booking.date}</td>
                        <td className="border border-gray-300 p-2">{booking.timeSlot}</td>
                        <td className="border border-gray-300 p-2">₹{booking.advanceAmount}</td>
                        <td className="border border-gray-300 p-2">₹{booking.dueAmount}</td>
                        <td className="border border-gray-300 p-2">{booking.status}</td>
                        <td className="border border-gray-300 p-2">{booking.razorpayPaymentId || "-"}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          <button
                            className={`py-1 px-3 rounded text-white text-sm ${
                              isCancellable(booking)
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowConfirmModal(true);
                            }}
                            disabled={!isCancellable(booking)}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

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
                    if (selectedBooking) {
                      await handleCancel(selectedBooking);
                      setSelectedBooking(null);
                      setShowConfirmModal(false);
                    }
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


        
      </main>
    </div>
  );
};

export default MyProfileLayout;
