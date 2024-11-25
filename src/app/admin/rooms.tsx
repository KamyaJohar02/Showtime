"use client";

import { useEffect, useState } from "react";
import { fetchDocuments, toggleAvailability, updateDocument } from "@/lib/firestoreUtils";

interface Room {
  roomId: string; // Updated from `id` to `roomId`
  name: string;
  description: string;
  availability: boolean;
  imageUrl: string;
  rate: string; // Allow `rate` to be edited as a string
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
        const fetchedDocuments = await fetchDocuments("rooms"); // Fetch data
        const mappedRooms = fetchedDocuments.map((doc: any) => ({
          roomId: doc.id, // Map `id` to `roomId`
          name: doc.name,
          description: doc.description,
          availability: doc.availability,
          imageUrl: doc.imageUrl,
          rate: doc.rate.toString(), // Cast rate to a string
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

  // Handle toggle
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
      alert("Failed to update room availability.");
    }
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingRoom) return;

    try {
      await updateDocument("rooms", editingRoom.roomId, {
        description: editingRoom.description,
        rate: editingRoom.rate,
      });
      setRooms((prev) =>
        prev.map((room) =>
          room.roomId === editingRoom.roomId ? { ...editingRoom } : room
        )
      );
      setEditingRoom(null); // Exit edit mode
    } catch (err) {
      console.error("Error updating room:", err);
      alert("Failed to save changes.");
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
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Availability</th>
              <th className="border border-gray-300 p-2">Image</th>
              <th className="border border-gray-300 p-2">Rate</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.roomId}>
                <td className="border border-gray-300 p-2">{room.name}</td>
                <td className="border border-gray-300 p-2">
                  {editingRoom?.roomId === room.roomId ? (
                    <input
                      type="text"
                      value={editingRoom.description}
                      onChange={(e) =>
                        setEditingRoom((prev) =>
                          prev ? { ...prev, description: e.target.value } : null
                        )
                      }
                      className="w-full border rounded p-1"
                    />
                  ) : (
                    room.description
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {String(room.availability)} {/* Display the raw boolean value */}
                </td>
                <td className="border border-gray-300 p-2">
                  <img
                    src={room.imageUrl}
                    alt={room.name}
                    className="h-16 w-16 object-cover"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  {editingRoom?.roomId === room.roomId ? (
                    <input
                      type="text"
                      value={editingRoom.rate}
                      onChange={(e) =>
                        setEditingRoom((prev) =>
                          prev ? { ...prev, rate: e.target.value } : null
                        )
                      }
                      className="w-full border rounded p-1"
                    />
                  ) : (
                    `₹${room.rate}`
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
