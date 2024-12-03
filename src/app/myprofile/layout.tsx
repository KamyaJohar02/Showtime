"use client";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebaseConfig"; // Adjust the import path as needed
import { collection, query, where, getDocs } from "firebase/firestore";

interface Booking {
  id: string;
  room: string;
  date: string;
  timeSlot: string;
  status: string;
}

const MyProfileLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); // Active tab state
  const [userDetails, setUserDetails] = useState({ name: "", email: "", mobile: "" });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          // Fetch user details from Firestore
          const userQuery = query(collection(db, "users"), where("email", "==", user.email));
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            setUserDetails({
              name: userData.name,
              email: userData.email,
              mobile: userData.mobile,
            });

            // Fetch bookings for the user
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

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/"; // Redirect to home after logout
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
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
            onClick={handleLogout}
            className="block w-full text-left hover:bg-red-600 p-2 rounded"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
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
                      <th className="border border-gray-300 p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="border border-gray-300 p-2">{booking.room}</td>
                        <td className="border border-gray-300 p-2">{booking.date}</td>
                        <td className="border border-gray-300 p-2">{booking.timeSlot}</td>
                        <td className="border border-gray-300 p-2">{booking.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyProfileLayout;
