"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface DashboardProps {
  setActiveSection: (section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveSection }) => {
  const [todayBookings, setTodayBookings] = useState<number>(0);
  const [totalRooms, setTotalRooms] = useState<number>(0);
  const [pendingQueries, setPendingQueries] = useState<number>(0);

  // Updated state
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCorrect, setPasswordCorrect] = useState<boolean>(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState<boolean>(false);
  const [adminCouponCode, setAdminCouponCode] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);  // New state for copied state
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];

      const bookingsSnapshot = await getDocs(
        query(collection(db, "bookings"), where("date", "==", today))
      );
      setTodayBookings(bookingsSnapshot.size);

      const roomsSnapshot = await getDocs(collection(db, "rooms"));
      setTotalRooms(roomsSnapshot.size);

      const queriesSnapshot = await getDocs(collection(db, "queries"));
      setPendingQueries(queriesSnapshot.size);
    };

    fetchData();
  }, []);

  const handleAddBooking = () => {
    setShowPasswordPopup(true); // Show the username/password input popup
  };

  const handlePasswordSubmit = async () => {
    // Hardcoded username and password validation
    const hardcodedUsername = "admin";
    const hardcodedPassword = "Showtime@0212";

    // Check if the entered username and password match the hardcoded values
    if (username === hardcodedUsername && password === hardcodedPassword) {
      setPasswordCorrect(true);

      // Fetch the coupon code from Firestore (coupons collection, document ID = 'specialcode')
      try {
        const couponDocRef = doc(db, "adminbooking", "specialcode"); // Document ID is 'specialcode'
        const couponDocSnap = await getDoc(couponDocRef);

        if (couponDocSnap.exists()) {
          const couponData = couponDocSnap.data();
          const couponCode = couponData?.name; // Assuming 'name' contains the coupon code
          setAdminCouponCode(couponCode || "No coupon code found"); // Set the coupon code
        } else {
          setAdminCouponCode("Coupon not found");
        }
      } catch (error) {
        console.error("Error fetching coupon code:", error);
        setAdminCouponCode("Error fetching coupon code");
      }

      setShowPasswordPopup(false); // Close the password input popup
    } else {
      toast.error("Incorrect username or password.");
      setPasswordCorrect(false);
    }
  };

  const closePasswordPopup = () => {
    setShowPasswordPopup(false); // Close the popup when the close button is clicked
  };

  // Copy to clipboard function
  const handleCopyCode = () => {
    navigator.clipboard.writeText(adminCouponCode);  // Copy the code
    setCopySuccess(true);  // Set the state to indicate code was copied
    setTimeout(() => setCopySuccess(false), 2000);  // Reset after 2 seconds
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Admin Panel</h1>
      <p className="text-gray-600 mb-8">Manage bookings, rooms, and more from one place.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span role="img" aria-label="calendar">📅</span> Today's Bookings
          </h2>
          <p className="text-2xl font-bold text-blue-600">{todayBookings}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span role="img" aria-label="room">🛏️</span> Total Rooms
          </h2>
          <p className="text-2xl font-bold text-green-600">{totalRooms}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span role="img" aria-label="query">❓</span> Pending Queries
          </h2>
          <p className="text-2xl font-bold text-yellow-600">{pendingQueries}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md"
          onClick={() => setActiveSection("bookings")}
        >
          <h3 className="text-lg font-semibold">Manage Bookings</h3>
          <p className="text-sm text-gray-500">View, update, and manage all bookings.</p>
        </div>

        <div
          className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md"
          onClick={() => setActiveSection("rooms")}
        >
          <h3 className="text-lg font-semibold">Manage Rooms</h3>
          <p className="text-sm text-gray-500">Add, update, or remove room details.</p>
        </div>

        <div
          className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md"
          onClick={() => setActiveSection("userQueries")}
        >
          <h3 className="text-lg font-semibold">User Queries</h3>
          <p className="text-sm text-gray-500">Respond to customer questions and issues.</p>
        </div>
      </div>

      {/* Add New Booking Button */}
      <div className="mt-6">
        <button
          onClick={handleAddBooking}
          className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700"
        >
          Add New Booking
        </button>
      </div>

      {/* Username/Password Popup */}
      {showPasswordPopup && !passwordCorrect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 text-center">
            <h3 className="text-lg font-semibold">Enter Admin Username & Password</h3>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 p-2 border rounded w-full"
              placeholder="Enter username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 p-2 border rounded w-full"
              placeholder="Enter password"
            />
            <button
              onClick={handlePasswordSubmit}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md"
            >
              Submit
            </button>
            <button
              onClick={closePasswordPopup}
              className="mt-4 text-sm text-red-600 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Show Coupon Code if Password is Correct */}
      {passwordCorrect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 text-center">
            <h3 className="text-lg font-semibold">Booking Code</h3>
            <p>Your booking code: <span className="font-bold">{adminCouponCode}</span></p>

            {/* Button to Copy Code */}
            <button
              onClick={handleCopyCode}
              className={`mt-2 px-6 py-2 rounded-md ${copySuccess ? 'bg-green-600' : 'bg-blue-600'} text-white`}
            >
              {copySuccess ? 'Copied!' : 'Copy Code'}
            </button>

            {/* Button to Open Booking Page in New Tab */}
            <button
  onClick={() => window.open("/booking", "_blank", "width=1000,height=800")}
  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md"
>
  Open Booking Page
</button>

            {/* Close Popup */}
            <button
              onClick={closePasswordPopup}
              className="mt-4 text-sm text-red-600 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
