"use client";

import { useEffect, useState } from "react";
import { getAllDocuments, toggleAvailability, updateDocument } from "@/lib/firestoreUtils";
import { toast } from "react-hot-toast";

interface Room {
  roomId: string; // Updated from `id` to `roomId`
  name: string;
  availability: boolean;
  price: string; // Changed from `rate` to `price`
  maxPeople: number; // Added maxPeople to the interface
}

const ManageRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null); // Track the room being edited

  // Fetch rooms from the "rooms" collection
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        const fetchedDocuments = await getAllDocuments("rooms"); // Fetch data
        const mappedRooms = fetchedDocuments.map((doc: any) => ({
          roomId: doc.id, // Map `id` to `roomId`
          name: doc.name,
          availability: doc.availability,
          price: doc.price.toString(), // Cast price to a string
          maxPeople: doc.maxPeople, // Map `maxPeople`
        }));
        setRooms(mappedRooms as Room[]); // Cast to `Room[]` type
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load rooms.");
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  // Handle toggle availability
  const handleToggle = async (roomId: string) => {
    try {
      const updatedAvailability = await toggleAvailability("rooms", roomId);
      setRooms((prev) =>
        prev.map((room) =>
          room.roomId === roomId
            ? { ...room, availability: updatedAvailability } // Update availability in state
            : room
        )
      );
    } catch (err) {
      console.error("Error toggling availability:", err);
      toast.error("Failed to update room availability.");
    }
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingRoom) return;

    try {
      await updateDocument("rooms", editingRoom.roomId, {
        price: editingRoom.price, // Save price
        availability: editingRoom.availability,
        maxPeople: editingRoom.maxPeople, // Save maxPeople too
      });
      setRooms((prev) =>
        prev.map((room) =>
          room.roomId === editingRoom.roomId ? { ...editingRoom } : room
        )
      );
      setEditingRoom(null); // Exit edit mode
    } catch (err) {
      console.error("Error updating room:", err);
      toast.error("Failed to save changes.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Rooms</h1>
      {loading ? (
        <p>Loading rooms...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Max People</th>
              <th className="border border-gray-300 p-2">Availability</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.roomId}>
                <td className="border border-gray-300 p-2">
                  {editingRoom?.roomId === room.roomId ? (
                    <input
                      type="text"
                      value={editingRoom.name}
                      onChange={(e) =>
                        setEditingRoom((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                      className="w-full border rounded p-1"
                    />
                  ) : (
                    room.name
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editingRoom?.roomId === room.roomId ? (
                    <input
                      type="number"
                      value={editingRoom.maxPeople}
                      onChange={(e) =>
                        setEditingRoom((prev) =>
                          prev ? { ...prev, maxPeople: Number(e.target.value) } : null
                        )
                      }
                      className="w-full border rounded p-1"
                    />
                  ) : (
                    room.maxPeople
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editingRoom?.roomId === room.roomId ? (
                    <select
                      value={editingRoom.availability ? "true" : "false"}
                      onChange={(e) =>
                        setEditingRoom((prev) =>
                          prev ? { ...prev, availability: e.target.value === "true" } : null
                        )
                      }
                      className="w-full border rounded p-1"
                    >
                      <option value="true">Available</option>
                      <option value="false">Not Available</option>
                    </select>
                  ) : (
                    (room.availability ? "Available" : "Not Available")
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editingRoom?.roomId === room.roomId ? (
                    <input
                      type="text"
                      value={editingRoom.price}
                      onChange={(e) =>
                        setEditingRoom((prev) =>
                          prev ? { ...prev, price: e.target.value } : null
                        )
                      }
                      className="w-full border rounded p-1"
                    />
                  ) : (
                    `₹${room.price}` // Display price with ₹ symbol
                  )}
                </td>
                <td className="border border-gray-300 p-2 space-x-2">
                  {editingRoom?.roomId === room.roomId ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingRoom(null)}
                        className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleToggle(room.roomId)}
                        className={`px-4 py-1 rounded ${
                          room.availability
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                      >
                        {room.availability ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => setEditingRoom(room)}
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageRooms;
