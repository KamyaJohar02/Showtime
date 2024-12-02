"use client";

import { useEffect, useState } from "react";
import { getAllDocuments, addDocument, deleteDocument } from "@/lib/firestoreUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ManageDates: React.FC = () => {
  const [disabledDates, setDisabledDates] = useState<string[]>([]); // Disabled dates as YYYY-MM-DD strings
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Currently selected date
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch disabled dates from Firestore
  useEffect(() => {
    const loadDisabledDates = async () => {
      try {
        setLoading(true);
        const fetchedDates = await getAllDocuments("disabledDates");
        const dates = fetchedDates.map((doc: any) => doc.date); // Use `YYYY-MM-DD` strings directly
        setDisabledDates(dates);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load disabled dates:", err);
        setLoading(false);
      }
    };

    loadDisabledDates();
  }, []);

  // Handle disable date
  const handleDisableDate = async () => {
    if (!selectedDate) return;

    const formattedDate = selectedDate.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD

    try {
      // Add date to Firestore
      await addDocument("disabledDates", { date: formattedDate });

      // Update state
      setDisabledDates((prev) => [...prev, formattedDate]);
      setSelectedDate(null); // Clear selected date
    } catch (err) {
      console.error("Failed to disable date:", err);
    }
  };

  // Handle enable date
  const handleEnableDate = async (date: string) => {
    try {
      // Delete date from Firestore
      const fetchedDocuments = await getAllDocuments("disabledDates");
      const dateDoc = fetchedDocuments.find((doc: any) => doc.date === date);
      if (dateDoc?.id) await deleteDocument("disabledDates", dateDoc.id);

      // Update state
      setDisabledDates((prev) => prev.filter((d) => d !== date));
    } catch (err) {
      console.error("Failed to enable date:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Dates</h1>
      <div className="mb-4">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          inline
          highlightDates={disabledDates.map((d) => new Date(`${d}T00:00:00`))} // Highlight disabled dates
          dayClassName={(date) =>
            disabledDates.includes(date.toLocaleDateString("en-CA"))
              ? "text-gray-500 cursor-not-allowed" // Grey out disabled dates
              : "text-black" // Default class for enabled dates
          }
        />
      </div>
      <div className="space-x-4">
        <button
          onClick={handleDisableDate}
          disabled={
            !selectedDate || disabledDates.includes(selectedDate.toLocaleDateString("en-CA"))
          }
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
        >
          Disable Date
        </button>
        <button
          onClick={() =>
            selectedDate && handleEnableDate(selectedDate.toLocaleDateString("en-CA"))
          }
          disabled={
            !selectedDate || !disabledDates.includes(selectedDate.toLocaleDateString("en-CA"))
          }
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
        >
          Enable Date
        </button>
      </div>
    </div>
  );
};

export default ManageDates;
