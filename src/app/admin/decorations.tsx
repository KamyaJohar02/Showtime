"use client";

import { useEffect, useState } from "react";
import { getAllDocuments, toggleAvailability, updateDocument } from "@/lib/firestoreUtils";
import Image from "next/image";

interface Decoration {
  id: string; // Firestore document ID (used as the key)
  label: string; // Name/Label of the decoration
  rate: string; // Rate as a string to allow editing
  imageUrl: string; // Image URL for the decoration
  availability: boolean; // Boolean indicating availability
}

const ManageDecorations: React.FC = () => {
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingDecoration, setEditingDecoration] = useState<Decoration | null>(null);

  // Fetch decorations from the "decorations" collection
  useEffect(() => {
    const loadDecorations = async () => {
      try {
        setLoading(true);
        const fetchedDocuments = await getAllDocuments("decorations"); // Fetch data
        const mappedDecorations = fetchedDocuments.map((doc: any) => ({
          id: doc.id, // Map Firestore document ID to `id`
          label: doc.label,
          rate: doc.rate.toString(), // Cast rate to a string
          imageUrl: doc.imageUrl,
          availability: doc.availability,
        }));
        setDecorations(mappedDecorations as Decoration[]); // Cast to `Decoration[]` type
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load decorations.");
        setLoading(false);
      }
    };

    loadDecorations();
  }, []);

  // Handle toggle availability
  const handleToggle = async (id: string) => {
    try {
      const updatedAvailability = await toggleAvailability("decorations", id);
      setDecorations((prev) =>
        prev.map((decoration) =>
          decoration.id === id
            ? { ...decoration, availability: updatedAvailability }
            : decoration
        )
      );
    } catch (err) {
      console.error("Error toggling availability:", err);
      alert("Failed to update decoration availability.");
    }
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingDecoration) return;

    try {
      await updateDocument("decorations", editingDecoration.id, {
        label: editingDecoration.label,
        rate: editingDecoration.rate,
      });
      setDecorations((prev) =>
        prev.map((decoration) =>
          decoration.id === editingDecoration.id ? { ...editingDecoration } : decoration
        )
      );
      setEditingDecoration(null); // Exit edit mode
    } catch (err) {
      console.error("Error updating decoration:", err);
      alert("Failed to save changes.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Decorations</h1>
      {loading ? (
        <p>Loading decorations...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : decorations.length === 0 ? (
        <p>No decorations found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Label</th>
              <th className="border border-gray-300 p-2">Rate</th>
              <th className="border border-gray-300 p-2">Image</th>
              <th className="border border-gray-300 p-2">Availability</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {decorations.map((decoration) => (
              <tr key={decoration.id}> {/* Use Firestore document ID as the key */}
                <td className="border border-gray-300 p-2">
                  {editingDecoration?.id === decoration.id ? (
                    <input
                      type="text"
                      value={editingDecoration.label}
                      onChange={(e) =>
                        setEditingDecoration((prev) =>
                          prev ? { ...prev, label: e.target.value } : null
                        )
                      }
                      className="w-full border rounded p-1"
                    />
                  ) : (
                    decoration.label
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editingDecoration?.id === decoration.id ? (
                    <input
                      type="text"
                      value={editingDecoration.rate}
                      onChange={(e) =>
                        setEditingDecoration((prev) =>
                          prev ? { ...prev, rate: e.target.value } : null
                        )
                      }
                      className="w-full border rounded p-1"
                    />
                  ) : (
                    `₹${decoration.rate}`
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  <Image
                    src={decoration.imageUrl}
                    alt={decoration.label}
                    width={64} // Set appropriate width
  height={64} // Set appropriate height
                    className="h-16 w-16 object-cover rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  {decoration.availability ? "Available" : "Unavailable"}
                </td>
                <td className="border border-gray-300 p-2 space-x-2">
                  {editingDecoration?.id === decoration.id ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingDecoration(null)}
                        className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleToggle(decoration.id)}
                        className={`px-4 py-1 rounded ${
                          decoration.availability
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                      >
                        {decoration.availability ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => setEditingDecoration(decoration)}
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

export default ManageDecorations;
