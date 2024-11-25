"use client";

import { useState, useEffect } from "react";
import { addDocument, fetchDocuments } from "@/lib/firestoreUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddBooking: React.FC = () => {
  const [rooms, setRooms] = useState<{ id: string; name: string; rate: string }[]>([]);
  const [timeSlots, setTimeSlots] = useState<{ id: string; time: string }[]>([]);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]); // For fetching disabled dates
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [advanceAmount, setAdvanceAmount] = useState<string>("");
  const [status, setStatus] = useState<string>("pending");
  const [userId, setUserId] = useState<string>("");
  const [dueAmount, setDueAmount] = useState<string>("");

  useEffect(() => {
    const loadRooms = async () => {
      const fetchedRooms = await fetchDocuments("rooms");
      setRooms(fetchedRooms.map((room: any) => ({ id: room.id, name: room.name, rate: room.rate })));
    };

    const loadTimeSlots = async () => {
      const fetchedTimeSlots = await fetchDocuments("timeSlots");
      setTimeSlots(
        fetchedTimeSlots.map((slot: any) => ({ id: slot.id, time: slot.time }))
      );
    };

    const loadDisabledDates = async () => {
      const fetchedDates = await fetchDocuments("disabledDates");
      const dates = fetchedDates.map((doc: any) => new Date(doc.date)); // Convert ISO strings to Date objects
      setDisabledDates(dates);
    };

    loadRooms();
    loadTimeSlots();
    loadDisabledDates();
  }, []);

  const handleRoomChange = (roomId: string) => {
    setSelectedRoom(roomId);
    const room = rooms.find((room) => room.id === roomId);
    if (room) {
      setAdvanceAmount(room.rate); // Autofill advance amount
    }
  };

  const handleAddBooking = async () => {
    if (!userId || !selectedRoom || !selectedDate || !selectedTimeSlot || !advanceAmount || !status) {
      alert("Please fill in all required fields.");
      return;
    }

    // Format date as YYYY-MM-DD in UTC
    const formattedDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      )
    )
      .toISOString()
      .split("T")[0];

    const newBooking = {
      userId,
      room: selectedRoom,
      date: formattedDate,
      timeSlot: selectedTimeSlot,
      advanceAmount,
      dueAmount,
      status,
    };

    try {
      await addDocument("bookings", newBooking);
      alert("Booking added successfully!");
      // Clear fields after submission
      setUserId("");
      setSelectedRoom(null);
      setSelectedDate(null);
      setSelectedTimeSlot(null);
      setAdvanceAmount("");
      setDueAmount("");
      setStatus("pending");
    } catch (err) {
      console.error("Error adding booking:", err);
      alert("Failed to add booking.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Booking</h1>

      {/* User ID */}
      <div className="mb-4">
        <label htmlFor="userId" className="block text-lg font-medium mb-2">
          User ID
        </label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Room Dropdown */}
      <div className="mb-4">
        <label htmlFor="room" className="block text-lg font-medium mb-2">
          Room
        </label>
        <select
          id="room"
          value={selectedRoom || ""}
          onChange={(e) => handleRoomChange(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="" disabled>
            Select a room
          </option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date Picker */}
      <div className="mb-4">
        <label htmlFor="date" className="block text-lg font-medium mb-2">
          Date
        </label>
        <DatePicker
          id="date"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="p-2 border rounded w-full"
          excludeDates={disabledDates} // Exclude disabled dates
        />
      </div>

      {/* Time Slot Dropdown */}
      <div className="mb-4">
        <label htmlFor="timeSlot" className="block text-lg font-medium mb-2">
          Time Slot
        </label>
        <select
          id="timeSlot"
          value={selectedTimeSlot || ""}
          onChange={(e) => setSelectedTimeSlot(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="" disabled>
            Select a time slot
          </option>
          {timeSlots.map((slot) => (
            <option key={slot.id} value={slot.time}>
              {slot.time}
            </option>
          ))}
        </select>
      </div>

      {/* Advance Amount */}
      <div className="mb-4">
        <label htmlFor="advanceAmount" className="block text-lg font-medium mb-2">
          Advance Amount
        </label>
        <input
          type="text"
          id="advanceAmount"
          value={advanceAmount}
          onChange={(e) => setAdvanceAmount(e.target.value)}
          placeholder="Enter advance amount"
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Due Amount */}
      <div className="mb-4">
        <label htmlFor="dueAmount" className="block text-lg font-medium mb-2">
          Due Amount
        </label>
        <input
          type="text"
          id="dueAmount"
          value={dueAmount}
          onChange={(e) => setDueAmount(e.target.value)}
          placeholder="Enter due amount"
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Status Dropdown */}
      <div className="mb-4">
        <label htmlFor="status" className="block text-lg font-medium mb-2">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="pending">Pending</option>
          <option value="fulfilled">Fulfilled</option>
        </select>
      </div>

      {/* Add Booking Button */}
      <div>
        <button
          onClick={handleAddBooking}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Booking
        </button>
      </div>
    </div>
  );
};

export default AddBooking;
