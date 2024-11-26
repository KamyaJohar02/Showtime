"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { db } from "@/firebaseConfig";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore"; 
import { useRouter } from "next/navigation";



interface Room {
  roomId: string;
  name: string;
  description: string;
  imageUrl: string;
  rate: number;
  availability: boolean;
}

interface Decoration {
  id: string;
  label: string;
  rate: number;
  image: string;
  availability: boolean;
}

interface TimeSlot {
  id: string;        // Unique identifier for the time slot
  name: string;      // Name of the time slot (e.g., "Slot 1")
  time: string;      // Time range (e.g., "10:00 AM - 12:00 PM")
  availability: boolean;
  isBooked?: boolean; // Whether the time slot is available
}

const Booking: React.FC = () => {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [step, setStep] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [numPeople, setNumPeople] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [addCake, setAddCake] = useState(false);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);



  /*const rooms: Room[] = [
    { id: 'room1', name: 'Room 1', description: 'A cozy room with a 150-inch screen.', imageUrl: '/Images/Room1.jpg', rate: 1400 },
    { id: 'room2', name: 'Room 2', description: 'A spacious room with comfortable seating.', imageUrl: '/Images/Room2.jpg', rate: 1600 },
    { id: 'room3', name: 'Room 3', description: 'A luxurious room with premium sound.', imageUrl: '/Images/Room3.jpg', rate: 1900 },
  ];

  const decorations: Decoration[] = [
    { value: 'balloons', label: 'Balloons', rate: 100, image: '/Images/balloons.jpg' },
    { value: 'flowers', label: 'Flowers', rate: 150, image: '/Images/flowers.jpeg' },
    { value: 'candles', label: 'Candles', rate: 200, image: '/Images/candles.jpg' },
    { value: 'fog', label: 'Fog', rate: 250, image: '/Images/smoke.jpg' },
  ];*/

  /*const slots = [
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM',
  ];*/


  useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch rooms
            const roomsCollection = collection(db, "rooms");
            const roomDocs = await getDocs(roomsCollection);
            const fetchedRooms = roomDocs.docs.map((doc) => ({
                roomId: doc.id,
                ...doc.data(),
            })) as Room[];
            setRooms(fetchedRooms);

            // Fetch decorations
            const decorationsCollection = collection(db, "decorations");
            const decorationDocs = await getDocs(decorationsCollection);
            const fetchedDecorations = decorationDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Decoration[];
            setDecorations(fetchedDecorations);

            // Fetch disabled dates
            const disabledDatesCollection = collection(db, "disabledDates");
            const disabledDateDocs = await getDocs(disabledDatesCollection);
            const fetchedDisabledDates = disabledDateDocs.docs.map(
                (doc) => new Date(doc.data().date)
            );
            setDisabledDates(fetchedDisabledDates);

            // Fetch time slots
            const timeSlotsCollection = collection(db, "timeSlots");
            const timeSlotDocs = await getDocs(timeSlotsCollection);
            const fetchedTimeSlots = timeSlotDocs.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
                time: doc.data().time,
                availability: doc.data().availability,
            })) as TimeSlot[];

            // Default slots without any booked information
            if (!selectedRoom || !selectedDate) {
                const defaultSlots = fetchedTimeSlots.map((slot) => ({
                    ...slot,
                    isBooked: false, // No slot is booked
                }));
                setSlots(defaultSlots);
                return; // Exit early if room or date is not selected
            }

            // Format selected date to "YYYY-MM-DD"
            const formattedDate = `${selectedDate.getFullYear()}-${String(
                selectedDate.getMonth() + 1
            ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

            // Query booked collection for selected room and date
            const bookedQuery = query(
                collection(db, "booked"),
                where(
                    "room",
                    "==",
                    rooms.find((room) => room.roomId === selectedRoom)?.name
                ),
                where("date", "==", formattedDate)
            );
            const bookedDocs = await getDocs(bookedQuery);

            // Extract booked time slots
            const bookedSlots = new Set(
                bookedDocs.docs.map((doc) => doc.data().timeSlot)
            );
            console.log("Fetched Booked Slots:", Array.from(bookedSlots));
            console.log("Fetched Time Slots:", fetchedTimeSlots);

            // Update slots with the isBooked property based on the time field
            const updatedSlots = fetchedTimeSlots.map((slot) => ({
                ...slot,
                isBooked: bookedSlots.has(slot.time), // Compare with the `time` field instead of `name`
            }));
            console.log("Updated Slots:", updatedSlots);
            setSlots(updatedSlots); // Update state with modified slots
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchData();
}, [selectedRoom, selectedDate]); // Ensure dependencies are updated



  

  const renderRoomSelection = () => (
    <div className="flex flex-col items-center min-h-screen bg-[url('/Images/stone3.jpg')] bg-cover bg-center p-4 sm:p-8">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-[Great Vibes] italic text-center text-green-800 font-serif mb-4 sm:mb-6 text-outline">
        Select a Room
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8">
        {rooms.map((room) => (
          <div
            key={room.roomId}
            onClick={() => room.availability && setSelectedRoom(room.roomId)}
            className={`border p-6 rounded-lg bg-opacity-70 bg-[#093024] transition-transform transform hover:scale-105 ${
              selectedRoom === room.roomId
                ? "border-4 border-red-500 shadow-lg"
                : room.availability
                ? "cursor-pointer border border-gray-300"
                : "cursor-not-allowed border border-gray-500 opacity-50"
            }`}
          >
            <Image
              src={room.imageUrl}
              alt={room.name}
              width={500}
              height={300}
              className="rounded-md"
            />
            <h3 className="text-2xl text-white font-bold text-center mt-4">
              {room.name}
            </h3>
            <p className="text-lg text-gray-300 text-center mt-2">
              {room.description}
            </p>
            <p className="text-lg text-red-400 text-center mt-2 font-bold">
              ₹{room.rate}
            </p>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center mt-6">
        <button
          className="bg-gray-300 text-black py-2 px-8 rounded"
          onClick={() => router.push("/")}
        >
          Back
        </button>
        <button
          className={`bg-red-500 text-white py-2 px-8 rounded ml-4 ${
            !selectedRoom ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setStep(2)}
          disabled={!selectedRoom}
        >
          Next
        </button>
      </div>
    </div>
  );

  

const renderCalendar = () => {
  const today = new Date();

  return (
    <div className="flex flex-col items-center min-h-screen bg-[url('/Images/stone3.jpg')] bg-cover bg-center p-4 sm:p-8">
      {/* Title Above the Card */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-[Great Vibes] italic text-center text-green-900 font-serif mb-4 sm:mb-6 text-outline">
        Select a Date
      </h2>
      
      {/* Calendar Card */}
      <div className="bg-[#093024] bg-opacity-70 rounded-lg shadow-lg p-6 sm:p-8 md:p-10 lg:p-12 w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] max-w-lg h-[50vh] sm:h-[60vh] md:h-[65vh] flex flex-col items-center">
      <DayPicker
  mode="single"
  selected={selectedDate}
  onSelect={(date) => setSelectedDate(date)}
  disabled={[...disabledDates, { before: today }]} // Include fetched dates
  defaultMonth={today} // Start on current month
  className="bg-[#093024] rounded-lg text-white w-full flex justify-center"
  styles={{
    caption: { textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" },
    day: { justifyContent: "center", fontSize: "1.1rem" },
  }}
/>
        
        {/* Navigation Buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          <button className="bg-gray-300 text-black py-2 px-6 sm:px-8 rounded" onClick={() => setStep(1)}>Back</button>
          <button className="bg-red-500 text-white py-2 px-6 sm:px-8 rounded" onClick={() => setStep(3)}>Next</button>
        </div>
      </div>
    </div>
  );
};
  
        

const renderTimeSlots = () => (
  <div className="flex flex-col items-center min-h-screen bg-[url('/Images/stone3.jpg')] bg-cover bg-center p-6 sm:p-8">
    <h2 className="text-4xl sm:text-5xl md:text-6xl font-[Great Vibes] italic text-center text-green-900 font-serif mb-4 sm:mb-6 text-outline">
      Select a Time Slot
    </h2>
    <div className="bg-[#093024] bg-opacity-70 p-8 sm:p-10 rounded-lg shadow-lg w-[80vw] sm:w-[70vw] md:w-[50vw] lg:w-[45vw] max-w-xl h-auto flex flex-col items-center">
      <div className="flex flex-col gap-4 w-full">
        {slots.map((slot) => (
          <div
          key={slot.id}
          className={`p-4 rounded-lg text-center text-lg sm:text-xl md:text-2xl transition-transform duration-300 transform hover:scale-105 ${
            selectedSlot === slot.time
              ? "bg-red-500 text-white" // Highlight selected slot
              : slot.isBooked
              ? "bg-gray-500 text-gray-700 cursor-not-allowed" // Grey out booked slots
              : "bg-[#0c3b2e] text-gray-300 cursor-pointer" // Default style
          }`}
            onClick={() => !slot.isBooked && setSelectedSlot(slot.time)}
          >
            {slot.time}
          </div>
        ))}
      </div>
    </div>
    <div className="flex justify-center mt-6 space-x-4">
      <button
        className="bg-gray-300 text-black py-2 px-6 sm:px-8 rounded"
        onClick={() => setStep(2)}
      >
        Back
      </button>
      <button
        className={`py-2 px-6 sm:px-8 rounded ${
          selectedSlot ? "bg-red-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        onClick={() => selectedSlot && setStep(4)}
        disabled={!selectedSlot}
      >
        Next
      </button>
    </div>
  </div>
);

  
   

const renderDecorations = () => (
  <div className="relative min-h-screen bg-[url('/Images/stone3.jpg')] bg-cover bg-center p-8">
    <h2 className="text-4xl sm:text-5xl md:text-6xl font-[Great Vibes] italic text-center text-green-900 font-serif mb-4 sm:mb-6 text-outline">
      Choose Decorations
    </h2>

    {/* Decorations Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
      {decorations.map((decoration) => (
        <div
          key={decoration.id}
          onClick={() =>
            decoration.availability &&
            setSelectedDecorations((prev) =>
              prev.includes(decoration.id)
                ? prev.filter((d) => d !== decoration.id)
                : [...prev, decoration.id]
            )
          }
          className={`flex flex-col items-center border p-4 rounded-lg bg-opacity-70 bg-[#093024] text-white transition-all duration-200 transform hover:scale-105 ${
            selectedDecorations.includes(decoration.id)
              ? "border-red-500 shadow-lg"
              : decoration.availability
              ? "cursor-pointer border-gray-300"
              : "cursor-not-allowed border-gray-500 opacity-50"
          }`}
          style={{ height: "250px" }}
        >
          {/* Decoration Image */}
          <Image
            src={decoration.image}
            alt={decoration.label}
            width={80}
            height={80}
            className="rounded-md object-cover mb-4"
          />

          {/* Decoration Details */}
          <h3 className="text-xl font-bold text-center mb-1">
            {decoration.label}
          </h3>
          <p className="text-lg font-semibold">₹{decoration.rate}</p>
        </div>
      ))}
    </div>

    {/* Navigation Buttons */}
    <div className="flex justify-center mt-6 space-x-4">
      <button
        className="bg-gray-300 text-black py-2 px-8 rounded"
        onClick={() => setStep(3)}
      >
        Back
      </button>
      <button
        className="bg-red-500 text-white py-2 px-8 rounded"
        onClick={() => setStep(5)}
      >
        Next
      </button>
    </div>
  </div>
);
  

  const renderUserDetailsForm = () => {
    const handleNextStep = () => {
      // Check for required fields and valid formats
      if (!name || !/^[A-Za-z\s]+$/.test(name)) {
        alert("Please enter a valid name");
        return;
      }
      if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
        alert("Please enter a valid phone number");
        return;
      }
      // Email validation to match specific domains
      const emailRegex = /^[\w.-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|aol\.com|yandex\.com|protonmail\.com|mail\.com|zoho\.com|gmx\.com)$/i;
      if (!email || !emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }
      if (numPeople < 1) {
        alert("Please specify the number of people.");
        return;
      }
      if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
        alert("Please enter a valid 10-digit phone number");
        return;
      }
    
      setStep(6); // Proceed to the next step if all validations pass
    };
    
  
    return (
      <div className="flex flex-col items-center min-h-screen bg-[url('/Images/stone3.jpg')] bg-cover bg-center p-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-[Great Vibes] italic text-center text-green-900 font-serif mb-4 sm:mb-6 text-outline">Enter Your Details</h2>
  
        {/* Form Container */}
        <div className="bg-[#093024] bg-opacity-70 p-8 sm:p-10 rounded-lg shadow-lg w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] max-w-md">
          
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-white text-lg mb-2">Full Name<span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => /^[A-Za-z\s]*$/.test(e.target.value) && setName(e.target.value)}
              className="w-full p-2 rounded text-black" 
              placeholder="Enter your full name" 
            />
          </div>
  
          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-white text-lg mb-2">Phone Number<span className="text-red-500">*</span></label>
            <input 
              type="tel" 
              value={phoneNumber} 
              onChange={(e) => /^\d*$/.test(e.target.value) && setPhoneNumber(e.target.value)}
              className="w-full p-2 rounded text-black" 
              placeholder="Enter your phone number" 
            />
          </div>
  
          {/* Email */}
          <div className="mb-4">
            <label className="block text-white text-lg mb-2">Email ID<span className="text-red-500">*</span></label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-2 rounded text-black" 
              placeholder="Enter your email" 
            />
          </div>
  
          {/* Number of People with Counter */}
          <div className="mb-4">
            <label className="block text-white text-lg mb-2">Number of People for the Gathering<span className="text-red-500">*</span></label>
            <div className="flex items-center">
              <button 
                type="button" 
                onClick={() => setNumPeople(Math.max(1, numPeople - 1))} 
                className="p-2 bg-gray-300 rounded-l"
              >
                -
              </button>
              <input 
                type="text" 
                value={numPeople} 
                readOnly // Prevent manual typing
                className="w-16 text-center p-2 border"
              />
              <button 
                type="button" 
                onClick={() => setNumPeople(numPeople + 1)} 
                className="p-2 bg-gray-300 rounded-r"
              >
                +
              </button>
            </div>
          </div>
  
          {/* Add Cake Option */}
          <div className="flex items-center mt-4">
            <input 
              type="checkbox" 
              id="add-cake" 
              className="mr-2" 
              onChange={(e) => setAddCake(e.target.checked)} 
            />
            <label htmlFor="add-cake" className="text-white text-lg">Do you wish to add cake? (₹500)</label>
          </div>
  
          {/* Navigation Buttons */}
          <div className="flex justify-center mt-6 space-x-4">
            <button 
              className="bg-gray-300 text-black py-2 px-8 rounded" 
              onClick={() => setStep(4)}
            >
              Back
            </button>
            <button 
              className="bg-red-500 text-white py-2 px-8 rounded" 
              onClick={handleNextStep}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const handleBookingSubmit = async () => {
    try {
      
      const bookingData = {
        name,
        mobile: phoneNumber,
        email,
        room: rooms.find((room) => room.roomId === selectedRoom)?.name || "",
        date: selectedDate
  ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
  : "",
        status: "pending",
        timeSlot: selectedSlot,
        decorations: selectedDecorations.map((d) =>
          decorations.find((dec) => dec.id === d)?.label
        ),
        wantCake: addCake,
        advanceAmount: 500,
        dueAmount:
  (rooms.find((room) => room.roomId === selectedRoom)?.rate || 0) +
  selectedDecorations.reduce((total, d) => {
    const decoration = decorations.find((dec) => dec.id === d);
    return total + (decoration ? decoration.rate : 0);
  }, 0) +
  (addCake ? 500 : 0) -
  500,

        people: numPeople,
      };
  
      await addDoc(collection(db, "bookings"), bookingData);

      // Add minimal data to the booked collection
      const bookedData = {
        room: bookingData.room,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
    };
    await addDoc(collection(db, "booked"), bookedData);
  
      alert("Booking submitted successfully!");
      router.push("/"); // Navigate to another page or reset the form
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Failed to submit booking. Please try again.");
    }
  };
  

  const renderSummary = () => {
    // Calculate total amount
    const roomCost = rooms.find((room) => room.roomId === selectedRoom)?.rate || 0;
    const decorationCost = selectedDecorations.reduce((total, d) => {
      const decoration = decorations.find((dec) => dec.id === d);
      return total + (decoration ? decoration.rate : 0);
    }, 0);
    const cakeCost = addCake ? 500 : 0;
    const totalAmount = roomCost + decorationCost + cakeCost;
    const advanceAmount = 500;
    const dueAmount = totalAmount - advanceAmount;
  
    return (
      <div className="min-h-screen flex flex-col items-center bg-[url('/Images/stone3.jpg')] bg-cover bg-center p-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-[Great Vibes] italic text-center text-green-900 font-serif mb-4 sm:mb-6 text-outline">
          Booking Summary
        </h2>
        <div className="bg-[#093024] bg-opacity-70 text-black p-6 rounded-lg w-full max-w-md shadow-lg space-y-3">
          {/* Detail Boxes */}
          <div className="bg-[#093024] bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-sm">
            <p className="font-semibold text-lg">Name:</p>
            <p className="text-base">{name}</p>
          </div>
          <div className="bg-[#093024] bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-sm">
            <p className="font-semibold text-lg">Phone Number:</p>
            <p className="text-base">{phoneNumber}</p>
          </div>
          <div className="bg-[#093024] bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-sm">
            <p className="font-semibold text-lg">Email:</p>
            <p className="text-base">{email}</p>
          </div>
          <div className="bg-[#093024] bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-sm">
            <p className="font-semibold text-lg">Room:</p>
            <p className="text-base">
              {rooms.find((room) => room.roomId === selectedRoom)?.name}
            </p>
          </div>
          <div className="bg-[#093024] bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-sm">
  <p className="font-semibold text-lg">Date:</p>
  <p className="text-base">
  {selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : "Not Selected"}
</p> {/* Display as "YYYY-MM-DD" */}
</div>
          <div className="bg-[#093024] bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-sm">
            <p className="font-semibold text-lg">Time Slot:</p>
            <p className="text-base">{selectedSlot}</p>
          </div>
          <div className="bg-[#093024] bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-sm">
            <p className="font-semibold text-lg">Decorations:</p>
            <p className="text-base">
              {selectedDecorations
                .map((d) => decorations.find((dec) => dec.id === d)?.label)
                .join(", ") || "None"}
            </p>
          </div>
          <div className="bg-[#093024] bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-sm">
            <p className="font-semibold text-lg">Cake:</p>
            <p className="text-base">{addCake ? "Yes" : "No"}</p>
          </div>
          {/* Total Amount, Advance, and Due */}
          <div className="bg-[#093024] bg-opacity-90 text-white px-4 py-4 rounded-lg shadow-md border-t-4 border-red-500">
            <p className="font-bold text-xl">Total Amount: ₹{totalAmount}</p>
            <p className="text-sm mt-1">Advance: ₹{advanceAmount}</p>
            <p className="text-sm">Due: ₹{dueAmount}</p>
          </div>
        </div>
        {/* Navigation Buttons */}
        <div className="flex justify-center mt-10 space-x-6">
          <button
            className="bg-gray-300 text-black py-2 px-8 rounded-full shadow-md"
            onClick={() => setStep(5)}
          >
            Back
          </button>
          <button
  className="bg-red-500 text-white py-2 px-8 rounded-full shadow-md"
  onClick={handleBookingSubmit} // Call the function here
>
  Submit and Pay
</button>
        </div>
      </div>
    );
  };
  
  
  

  return (
    <div>
      {step === 1 && renderRoomSelection()}
      {step === 2 && renderCalendar()}
      {step === 3 && renderTimeSlots()}
      {step === 4 && renderDecorations()}
      {step === 5 && renderUserDetailsForm()}
      {step === 6 && renderSummary()}
    </div>
  );
};

export default Booking;