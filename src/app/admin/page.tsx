"use client";

import Link from "next/link";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Bookings Management */}
        <Link href="/admin/bookings">
          <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Manage Bookings</h2>
            <p className="text-gray-600">View, update, and manage all bookings.</p>
          </div>
        </Link>

        {/* Rooms Management */}
        <Link href="/admin/rooms">
          <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Manage Rooms</h2>
            <p className="text-gray-600">Add, remove, or update room details.</p>
          </div>
        </Link>

        {/* Users Management */}
        <Link href="/admin/users">
          <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
            <p className="text-gray-600">View, edit, or remove user accounts.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
