"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig"; // Adjust the import path as needed
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
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          alert("You need to log in to view this page.");
          router.push("/login"); // Redirect to login if not authenticated
          return;
        }

        // Fetch user's details from Firestore
        const userQuery = query(collection(db, "users"), where("email", "==", user.email));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setUserDetails({
            name: userData.name,
            mobile: userData.mobile,
          });

          // Fetch bookings using the user's mobile number
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
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
              <th className="border border-gray-300 p-2">Advance Amount</th>
              <th className="border border-gray-300 p-2">Due Amount</th>
              <th className="border border-gray-300 p-2">Status</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyProfilePage;
