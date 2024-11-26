"use client";

import { useState, useEffect } from "react";
import { addDocument, fetchDocuments } from "@/lib/firestoreUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // Adjust the path to where your Firebase configuration is defined


const AddBooking: React.FC = () => {
    const [rooms, setRooms] = useState<{ id: string; name: string; rate: number }[]>([]);
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
    const [people, setPeople] = useState<number>(1);
    const [timeSlots, setTimeSlots] = useState<{ id: string; time: string; isBooked?: boolean }[]>([]);


    useEffect(() => {
        const loadRooms = async () => {
            try {
                const fetchedRooms = await fetchDocuments("rooms");
                setRooms(
                    fetchedRooms.map((room: any) => ({
                        id: room.id,
                        name: room.name,
                        rate: room.rate,
                    }))
                );
            } catch (error) {
                console.error("Error loading rooms:", error);
            }
        };
        
    
        const loadTimeSlots = async () => {
            try {
                const fetchedTimeSlots = await fetchDocuments("timeSlots");
                setTimeSlots(
                    fetchedTimeSlots.map((slot: any) => ({
                        id: slot.id,
                        time: slot.time,
                        isBooked: false, // Initialize `isBooked` as false
                    }))
                );
            } catch (error) {
                console.error("Error loading time slots:", error);
            }
        };
    
        const loadDecorations = async () => {
            try {
                const fetchedDecorations = await fetchDocuments("decorations");
                setDecorations(
                    fetchedDecorations.map((decoration: any) => ({
                        id: decoration.id,
                        label: decoration.label,
                        rate: decoration.rate,
                        availability: decoration.availability,
                    }))
                );
            } catch (error) {
                console.error("Error loading decorations:", error);
            }
        };
    
        const loadDisabledDates = async () => {
            try {
                const fetchedDates = await fetchDocuments("disabledDates");
                const dates = fetchedDates.map((doc: any) => new Date(doc.date));
                setDisabledDates(dates);
            } catch (error) {
                console.error("Error loading disabled dates:", error);
            }
        };
    
        const fetchBookedSlots = async () => {
            try {
                if (!selectedRoom || !selectedDate) {
                    // Reset slots to default if no room or date is selected
                    setTimeSlots((prev) =>
                        prev.map((slot) => ({
                            ...slot,
                            isBooked: false, // Reset isBooked to false
                        }))
                    );
                    return;
                }
    
                const formattedDate = selectedDate.toLocaleDateString("en-CA"); // Format date to "YYYY-MM-DD"
                const roomName = rooms.find((room) => room.id === selectedRoom)?.name;
    
                if (!roomName) return;
    
                // Query booked collection for selected room and date
                const bookedQuery = query(
                    collection(db, "booked"),
                    where("room", "==", roomName),
                    where("date", "==", formattedDate)
                );
    
                const bookedDocs = await getDocs(bookedQuery);
    
                // Extract booked time slots
                const bookedSlots = new Set(
                    bookedDocs.docs.map((doc) => doc.data().timeSlot)
                );
    
                // Update time slots with isBooked property
                setTimeSlots((prev) =>
                    prev.map((slot) => ({
                        ...slot,
                        isBooked: bookedSlots.has(slot.time), // Compare with the time field
                    }))
                );
            } catch (error) {
                console.error("Error fetching booked slots:", error);
            }
        };
    
        // Load data on component mount
        loadRooms();
        loadTimeSlots();
        loadDecorations();
        loadDisabledDates();
    
        // Update booked slots whenever room or date changes
        fetchBookedSlots();
    }, [selectedRoom, selectedDate]); // Ensure dependencies are updated
    
    

    useEffect(() => {
        const roomRate = rooms.find((room) => room.id === selectedRoom)?.rate || 0;
        const decorationRates = selectedDecorations.reduce((sum, decorationId) => {
            const decoration = decorations.find((decoration) => decoration.id === decorationId);
            return sum + (decoration?.rate || 0);
        }, 0);
        const cakeCost = wantCake ? 500 : 0;

        setAdvanceAmount((roomRate + decorationRates + cakeCost).toString());
        setDueAmount((roomRate + decorationRates + cakeCost - Number(advanceAmount)).toString());
    }, [selectedRoom, selectedDecorations, wantCake, rooms, decorations, advanceAmount]);

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
            people,
        };
        const bookedData = {
            room: newBooking.room  , // Only the room name
            date: newBooking.date, // The formatted date in "YYYY-MM-DD"
            timeSlot: newBooking.timeSlot, // The selected time slot
        };

        try {
            await addDocument("bookings", newBooking);
            await addDoc(collection(db, "booked"), bookedData);
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
            setPeople(1);
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
        <div className="p-4 max-w-screen-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Add Booking</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="p-2 border rounded w-full"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="p-2 border rounded w-full"
                    />
                </div>

                <div>
                    <label htmlFor="mobile" className="block text-sm font-medium mb-1">
                        Mobile
                    </label>
                    <input
                        type="text"
                        id="mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Mobile"
                        className="p-2 border rounded w-full"
                    />
                </div>

                <div>
                    <label htmlFor="people" className="block text-sm font-medium mb-1">
                        Guests
                    </label>
                    <input
                        type="number"
                        id="people"
                        value={people}
                        onChange={(e) => setPeople(Number(e.target.value))}
                        placeholder="Guests"
                        className="p-2 border rounded w-full"
                        min={1}
                    />
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="room" className="block text-sm font-medium mb-1">
                    Room
                </label>
                <select
                    id="room"
                    value={selectedRoom || ""}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="p-2 border rounded w-full"
                >
                    <option value="" disabled>
                        Select Room
                    </option>
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                            {room.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                    Date
                </label>
                <DatePicker
                    id="date"
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Date"
                    className="p-2 border rounded w-full"
                    excludeDates={disabledDates}
                />
            </div>

            <div className="mb-4">
    <label htmlFor="timeSlot" className="block text-sm font-medium mb-1">
        Time Slot
    </label>
    <div className="grid grid-cols-2 gap-4">
        {timeSlots.map((slot) => (
            <button
                key={slot.id}
                onClick={() => !slot.isBooked && setSelectedTimeSlot(slot.time)} // Only allow selection if not booked
                disabled={slot.isBooked} // Disable the button if the slot is booked
                className={`p-2 rounded border ${
                    slot.isBooked
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed" // Grayed out for booked slots
                        : selectedTimeSlot === slot.time
                        ? "bg-blue-500 text-white" // Highlight for selected slot
                        : "bg-white text-black hover:bg-blue-100" // Default style
                }`}
            >
                {slot.time}
            </button>
        ))}
    </div>
</div>



            <div className="mb-4">
                <label htmlFor="decorations" className="block text-sm font-medium mb-1">
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
                            {decoration.label}
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
                <label className="block text-sm font-medium mb-1">Want Cake?</label>
                <div className="flex space-x-4">
                    <label>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label htmlFor="advanceAmount" className="block text-sm font-medium mb-1">
                        Advance
                    </label>
                    <input
                        type="text"
                        id="advanceAmount"
                        value={advanceAmount}
                        onChange={(e) => setAdvanceAmount(e.target.value)}
                        className="p-2 border rounded w-full"
                    />
                </div>

                <div>
                    <label htmlFor="dueAmount" className="block text-sm font-medium mb-1">
                        Due
                    </label>
                    <input
                        type="text"
                        id="dueAmount"
                        value={dueAmount}
                        onChange={(e) => setDueAmount(e.target.value)}
                        className="p-2 border rounded w-full"
                    />
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium mb-1">
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
            </div>

            <div>
                <button
                    onClick={handleAddBooking}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Booking
                </button>
            </div>
        </div>
    );
};

export default AddBooking;
