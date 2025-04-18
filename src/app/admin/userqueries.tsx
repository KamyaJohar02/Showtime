"use client";

import { useEffect, useState } from "react";
import { getAllDocuments, deleteDocument } from "@/lib/firestoreUtils";

interface Query {
  id: string;
  name: string;
  mobile: string;
  query: string;
}

const UserQueries = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const fetched = await getAllDocuments("queries") as Query[];
        setQueries(fetched);
      } catch (error) {
        console.error("Failed to fetch queries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this query?");
    if (!confirm) return;

    try {
      await deleteDocument("queries", id);
      setQueries((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      alert("Failed to delete query.");
      console.error(error);
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentQueries = queries.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(queries.length / itemsPerPage);

  return (
    <div className="p-4 text-xs">
      <h2 className="text-base font-bold mb-4">User Queries</h2>

      {loading ? (
        <p>Loading...</p>
      ) : queries.length === 0 ? (
        <p>No queries found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Mobile</th>
                  <th className="p-2 border">Query</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentQueries.map((q) => (
                  <tr key={q.id}>
                    <td className="p-2 border">{q.name}</td>
                    <td className="p-2 border">{q.mobile}</td>
                    <td className="p-2 border">{q.query}</td>
                    <td className="p-2 border space-x-2">
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserQueries;
