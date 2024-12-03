"use client";

import { useEffect, useState } from "react";
import { getAllDocuments, toggleAvailability, updateDocument } from "@/lib/firestoreUtils";

interface Slot {
  slotId: string; // Firestore document ID
  name: string; // Slot name
  time: string; // Slot time
  availability: boolean; // Availability status
}

const ManageTimeSlots: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);

  // Fetch slots from Firestore
  useEffect(() => {
    const loadSlots = async () => {
      try {
        setLoading(true);
        const fetchedDocuments = await getAllDocuments("timeSlots"); // Fetch data from the "timeSlots" collection
        const mappedSlots = fetchedDocuments.map((doc: any) => ({
          slotId: doc.id, // Use Firestore document ID as slotId
          name: doc.name, // Map slot name
          time: doc.time, // Map slot time
          availability: doc.availability, // Map availability
        }));
        setSlots(mappedSlots as Slot[]); // Cast to `Slot[]` type
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load time slots.");
        setLoading(false);
      }
    };

    loadSlots();
  }, []);

  // Handle toggle availability
  const handleToggle = async (slotId: string) => {
    try {
      const updatedAvailability = await toggleAvailability("timeSlots", slotId);
      setSlots((prev) =>
        prev.map((slot) =>
          slot.slotId === slotId
            ? { ...slot, availability: updatedAvailability }
            : slot
        )
      );
    } catch (err) {
      console.error("Error toggling availability:", err);
      alert("Failed to update slot availability.");
    }
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingSlot) return;

    try {
      await updateDocument("timeSlots", editingSlot.slotId, {
        name: editingSlot.name,
        time: editingSlot.time,
      });
      setSlots((prev) =>
        prev.map((slot) =>
          slot.slotId === editingSlot.slotId ? { ...editingSlot } : slot
        )
      );
      setEditingSlot(null); // Exit edit mode
    } catch (err) {
      console.error("Error updating time slot:", err);
      alert("Failed to save changes.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Time Slots</h1>
      {loading ? (
        <p>Loading time slots...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : slots.length === 0 ? (
        <p>No time slots found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Slot Name</th>
              <th className="border border-gray-300 p-2">Time</th>
              <th className="border border-gray-300 p-2">Availability</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.slotId}>
                <td className="border border-gray-300 p-2">
                  {editingSlot?.slotId === slot.slotId ? (
                    <input
                      type="text"
                      value={editingSlot.name}
                      onChange={(e) =>
                        setEditingSlot((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                      className="w-full border rounded p-1"
                    />
                  ) : (
                    slot.name
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editingSlot?.slotId === slot.slotId ? (
                    <input
                      type="text"
                      value={editingSlot.time}
                      onChange={(e) =>
                        setEditingSlot((prev) =>
                          prev ? { ...prev, time: e.target.value } : null
                        )
                      }
                      className="w-full border rounded p-1"
                    />
                  ) : (
                    slot.time
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {slot.availability ? "Available" : "Unavailable"}
                </td>
                <td className="border border-gray-300 p-2 space-x-2">
                  {editingSlot?.slotId === slot.slotId ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingSlot(null)}
                        className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleToggle(slot.slotId)}
                        className={`px-4 py-1 rounded ${
                          slot.availability
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                      >
                        {slot.availability ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => setEditingSlot(slot)}
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

export default ManageTimeSlots;
