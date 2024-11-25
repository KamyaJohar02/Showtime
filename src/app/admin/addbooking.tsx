"use client";

import { useState, useEffect } from "react";
import { addDocument, fetchDocuments } from "@/lib/firestoreUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddBooking: React.FC = () => {
    const [rooms, setRooms] = useState<{ id: string; name: string; rate: number }[]>([]);
    const [timeSlots, setTimeSlots] = useState<{ id: string; time: string }[]>([]);
    const [decorations, setDecorations] = useState<
        { id: string; label: string; rate: number; availability: boolean }[]
    >([]);
    const [disabledDates, setDisabledDates] = useState<Date[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedDecorations, setSelectedDecorations] = useState<string[]>([]);
    const [wantCake, setWantCake] = useState<boolean>(false);
    const [advanceAmount, setAdvanceAmount] = useState<string>("0");
    const [dueAmount, setDueAmount] = useState<string>("0");
    const [status, setStatus] = useState<string>("pending");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [mobile, setMobile] = useState<string>("");

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

        const loadDecorations = async () => {
            const fetchedDecorations = await fetchDocuments("decorations");
            setDecorations(
                fetchedDecorations.map((decoration: any) => ({
                    id: decoration.id,
                    label: decoration.label,
                    rate: decoration.rate,
                    availability: decoration.availability,
                }))
            );
        };

        const loadDisabledDates = async () => {
            const fetchedDates = await fetchDocuments("disabledDates");
            const dates = fetchedDates.map((doc: any) => new Date(doc.date));
            setDisabledDates(dates);
        };

        loadRooms();
        loadTimeSlots();
        loadDecorations();
        loadDisabledDates();
    }, []);

    useEffect(() => {
        const roomRate = rooms.find((room) => room.id === selectedRoom)?.rate || 0;
        const decorationRates = selectedDecorations.reduce((sum, decorationId) => {
            const decoration = decorations.find((decoration) => decoration.id === decorationId);
            return sum + (decoration?.rate || 0);
        }, 0);
        const cakeCost = wantCake ? 500 : 0;

        setAdvanceAmount((roomRate + decorationRates + cakeCost).toString());
    }, [selectedRoom, selectedDecorations, wantCake, rooms, decorations]);

    const handleAddBooking = async () => {
        if (!name || !email || !mobile || !selectedRoom || !selectedDate || !selectedTimeSlot) {
            alert("Please fill in all required fields.");
            return;
        }

        const formattedDate = selectedDate.toLocaleDateString("en-CA");

        // Convert room.id to room.name
        const roomName = rooms.find((room) => room.id === selectedRoom)?.name || "";

        // Convert decoration IDs to decoration labels
        const decorationLabels = selectedDecorations.map(
            (id) => decorations.find((decoration) => decoration.id === id)?.label || "Unknown"
        );

        const newBooking = {
            name,
            email,
            mobile,
            room: roomName, // Store room name
            date: formattedDate,
            timeSlot: selectedTimeSlot,
            decorations: decorationLabels, // Store decoration labels
            wantCake,
            advanceAmount: Number(advanceAmount),
            dueAmount: Number(dueAmount),
            status,
        };

        try {
            await addDocument("bookings", newBooking);
            alert("Booking added successfully!");
            setName("");
            setEmail("");
            setMobile("");
            setSelectedRoom(null);
            setSelectedDate(null);
            setSelectedTimeSlot(null);
            setSelectedDecorations([]);
            setWantCake(false);
            setAdvanceAmount("0");
            setDueAmount("0");
            setStatus("pending");
        } catch (err) {
            console.error("Error adding booking:", err);
            alert("Failed to add booking.");
        }
    };

    const handleDecorationChange = (decorationId: string) => {
        if (decorationId === "none") {
            setSelectedDecorations([]);
        } else {
            setSelectedDecorations((prev) =>
                prev.includes(decorationId)
                    ? prev.filter((id) => id !== decorationId)
                    : [...prev, decorationId]
            );
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Add Booking</h1>

            <div className="mb-4">
                <label htmlFor="name" className="block text-lg font-medium mb-2">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Name"
                    className="p-2 border rounded w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block text-lg font-medium mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    className="p-2 border rounded w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="mobile" className="block text-lg font-medium mb-2">
                    Mobile Number
                </label>
                <input
                    type="text"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter Mobile Number"
                    className="p-2 border rounded w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="room" className="block text-lg font-medium mb-2">
                    Room
                </label>
                <select
                    id="room"
                    value={selectedRoom || ""}
                    onChange={(e) => setSelectedRoom(e.target.value)}
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
  excludeDates={disabledDates}
  showTimeSelect={false} // Ensure no time is involved
  calendarStartDay={0} // Start week on Sunday
/>
            </div>

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

            <div className="mb-4">
                <label htmlFor="decorations" className="block text-lg font-medium mb-2">
                    Decorations
                </label>
                <select
                    id="decorations"
                    value=""
                    onChange={(e) => handleDecorationChange(e.target.value)}
                    className="p-2 border rounded w-full"
                >
                    <option value="none">None</option>
                    {decorations.map((decoration) => (
                        <option
                            key={decoration.id}
                            value={decoration.id}
                            disabled={!decoration.availability}
                        >
                            {decoration.label} - ₹{decoration.rate}
                        </option>
                    ))}
                </select>
                    <div className="mt-2">
                    {selectedDecorations.map((id) => {
                        const decoration = decorations.find((decoration) => decoration.id === id);
                        return (
                            <span
                                key={id}
                                className="inline-block bg-blue-500 text-white text-sm rounded px-2 py-1 mr-2"
                            >
                                {decoration?.label}
                            </span>
                        );
                    })}
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-lg font-medium mb-2">Do you want a Cake?</label>
                <div>
                    <label className="mr-4">
                        <input
                            type="radio"
                            name="cake"
                            value="yes"
                            checked={wantCake}
                            onChange={() => setWantCake(true)}
                        />
                        Yes
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="cake"
                            value="no"
                            checked={!wantCake}
                            onChange={() => setWantCake(false)}
                        />
                        No
                    </label>
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="advanceAmount" className="block text-lg font-medium mb-2">
                    Advance Amount
                </label>
                <input
                    type="text"
                    id="advanceAmount"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    className="p-2 border rounded w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="dueAmount" className="block text-lg font-medium mb-2">
                    Due Amount
                </label>
                <input
                    type="text"
                    id="dueAmount"
                    value={dueAmount}
                    onChange={(e) => setDueAmount(e.target.value)}
                    className="p-2 border rounded w-full"
                />
            </div>

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
