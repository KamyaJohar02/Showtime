"use client";

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Booking {
  id: string;
  room: string;
  date: string;
  timeSlot: string;
  status: string;
  advanceAmount: number;
  dueAmount: number;
}

const MyProfileLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userDetails, setUserDetails] = useState({ name: "", email: "", mobile: "" });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const router = useRouter();

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

            const fetchedBookings = bookingsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Booking[];

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
    const [startTime] = booking.timeSlot.split("-");
    const bookingDateTime = new Date(`${booking.date} ${startTime.trim()}`);
    return bookingDateTime.getTime() - now.getTime() > 24 * 60 * 60 * 1000;
  };

  const handleCancel = async (booking: Booking) => {
    if (!isCancellable(booking)) return;
    try {
      // Delete from 'bookings'
      await deleteDoc(doc(db, "bookings", booking.id));
  
      // Format date to match 'booked' collection format (e.g., '2024-12-26')
      const formattedDate = booking.date;
  
      // Query and delete the matching record from 'booked'
      const bookedQuery = query(
        collection(db, "booked"),
        where("date", "==", formattedDate),
        where("room", "==", booking.room),
        where("timeSlot", "==", booking.timeSlot)
      );
      const snapshot = await getDocs(bookedQuery);
      snapshot.forEach(async (docSnap) => {
        await deleteDoc(doc(db, "booked", docSnap.id));
      });
  
      // Update local state
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      alert("Booking cancelled successfully.");
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
            <h1 className="text-3xl font-bold mb-4">My Bookings</h1>
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
      </main>
    </div>
  );
};

export default MyProfileLayout;
