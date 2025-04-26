"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Theater {
  id: string;
  name: string;
  slots: number;
  maxPeople: number;
  foodDrinks: boolean;
  cancellation: boolean;
  decoration: string;
  price: number;
  basePeople: number;
  extraPeopleNote: string;
  image: string;
  rating: number;
  timeSlots: string[];
}

interface TimeSlot {
  id: string;
  name: string;
  time: string;
  availability: boolean;
  isBooked?: boolean;
}



const roomPrices: Record<string, number> = {
  "Sweet": 1999,
  "Wonder": 2199,
  "Galaxy": 2499,
};

const Bookingx = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [slotsMap, setSlotsMap] = useState<Record<string, TimeSlot[]>>({});
  const [selectedTheaterId, setSelectedTheaterId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  const router = useRouter();
  const today = new Date();
  const isOfferActive = true; // 🔁 Change to false later to remove offer


  useEffect(() => {
    const fetchDisabledDates = async () => {
      try {
        const snapshot = await getDocs(collection(db, "disabledDates"));
        const dates = snapshot.docs.map((doc) => new Date(doc.data().date));
        setDisabledDates(dates);
      } catch (error) {
        console.error("Error fetching disabled dates:", error);
      }
    };
    fetchDisabledDates();
  }, []);

  useEffect(() => {
    const fetchTheatersAndSlots = async () => {
      try {
        const theaterSnapshot = await getDocs(collection(db, "rooms"));
        const fetchedTheaters: Theater[] = theaterSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Theater[];
        setTheaters(fetchedTheaters);
  
        if (!selectedDate) return;
  
        const formattedDate = selectedDate.toLocaleDateString("en-CA");
  
        const bookedSnapshot = await getDocs(
          query(collection(db, "booked"), where("date", "==", formattedDate))
        );
        const bookedMap: Record<string, Set<string>> = {};
        bookedSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          const roomName = (data.room as string)?.toLowerCase();
          if (!bookedMap[roomName]) bookedMap[roomName] = new Set();
          bookedMap[roomName].add(data.timeSlot);
        });
  
        const slotMap: Record<string, TimeSlot[]> = {};
        for (const theater of fetchedTheaters) {
          // 🔄 Fetch timeSlots from subcollection of each room
          const timeSlotSnapshot = await getDocs(collection(db, "rooms", theater.id, "timeSlots"));
  
          const roomSlots: TimeSlot[] = timeSlotSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            time: doc.data().time,
            availability: doc.data().availability,
            isBooked: !doc.data().availability ||
              (bookedMap[theater.name.toLowerCase()]?.has(doc.data().time) ?? false),
          }));
  
          slotMap[theater.id] = roomSlots; // ✅ map per-theater subcollection
        }
  
        setSlotsMap(slotMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchTheatersAndSlots();
  }, [selectedDate]);
  

  const handleNext = () => {
    if (selectedTheaterId && selectedSlot && selectedDate) {
      const selectedTheater = theaters.find((t) => t.id === selectedTheaterId);
      const selectedSlotObj = (slotsMap[selectedTheaterId] || []).find(
        (slot) => slot.time === selectedSlot
      );

      if (selectedTheater && selectedSlotObj) {
        const originalPrice = roomPrices[selectedTheater.name] || selectedTheater.price;
const discountedPrice = selectedTheater.name === "Sweet" ? 999 :
                        selectedTheater.name === "Wonder" ? 999 :
                        selectedTheater.name === "Galaxy" ? 999 : originalPrice;
const finalPrice = isOfferActive ? discountedPrice : originalPrice;

        const fullTheaterData = {
          id: selectedTheater.id,
          name: selectedTheater.name,
          price: finalPrice,
        };

        const fullSlotData = {
          id: selectedSlotObj.id,
          time: selectedSlotObj.time,
        };

        localStorage.setItem("selectedTheater", JSON.stringify(fullTheaterData));
        localStorage.setItem("selectedSlot", JSON.stringify(fullSlotData));
        localStorage.setItem("selectedDate", selectedDate.toISOString());

        router.push("/booking/form");
      }
    } else {
      alert("Please select a date, theater, and slot before proceeding.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <header className="p-6">
        <h2 className="text-2xl font-bold mb-2">Select a Date</h2>
        <button
  onClick={() => setShowCalendar(!showCalendar)}
  className="border px-4 py-2 rounded shadow bg-white hover:bg-gray-100 flex items-center gap-2"
>
  <span>
    {selectedDate?.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) || "Pick a date"}
  </span>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-4 w-4 transition-transform duration-200 ${
      showCalendar ? "rotate-180" : "rotate-0"
    }`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
</button>

        {showCalendar && (
          <div className="mt-4">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setShowCalendar(false);
              }}
              disabled={[...disabledDates, { before: today }]}
              defaultMonth={today}
              className="rounded-md border p-4 shadow bg-white"
            />
          </div>
        )}
      </header>

      <main className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {theaters.map((theater) => {
            const availableSlots = (slotsMap[theater.id] || []).filter((slot) => !slot.isBooked).length;
            const displayPrice = roomPrices[theater.name] || theater.price;

            return (
              <div key={theater.id} className="border rounded-lg shadow-md p-4">
                <Image
  src={
    theater.image ||
    (theater.name === "Sweet"
      ? "/Images/sweetroom.jpg"
      : theater.name === "Wonder"
      ? "/Images/wondersroom.jpg"
      : theater.name === "Galaxy"
      ? "/Images/galaxyroom.jpg"
      : "/Images/Room1.jpg")
  }
  alt={theater.name}
  width={400}
  height={200}
  className="rounded-lg w-full h-48 object-cover mb-4"
/>

                <h3 className="text-xl font-semibold mb-1">{theater.name}</h3>
                <p className="text-red-500 text-sm mb-2">{availableSlots} Slots Available</p>
                <ul className="text-sm text-gray-700 mb-2">
                  <li>👥 Max {theater.maxPeople} People</li>
                  <li>🍽️ Food & Drinks available</li>
                  <li>✅ Free Cancellation*</li>
                  <li>💼 Decoration {theater.decoration}</li>
                </ul>
                <div className="mb-2">
                  <strong>Select Time Slot:</strong>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {(slotsMap[theater.id] || []).map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => {
                          setSelectedTheaterId(theater.id);
                          setSelectedSlot(slot.time);
                        }}
                        disabled={slot.isBooked}
                        className={`text-sm p-2 rounded transition-colors duration-200 ${
                          selectedTheaterId === theater.id && selectedSlot === slot.time
                            ? "bg-green-500 text-white"
                            : slot.isBooked
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gray-100 hover:bg-blue-100"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-2 text-lg font-semibold">
  {isOfferActive ? (
    theater.name === "Sweet" ? (
      <p>
        <span className="line-through text-gray-500 mr-2">₹1999</span>
        <span className="inline-block px-4 py-1 rounded-full bg-gray-300">
    <span className="rainbow-text font-bold text-2xl">₹999</span>
  </span>
      </p>
    ) : theater.name === "Galaxy" ? (
      <p>
        <span className="line-through text-gray-500 mr-2">₹2999</span>
        <span className="inline-block px-4 py-1 rounded-full bg-gray-300">
    <span className="rainbow-text font-bold text-2xl">₹999</span>
  </span>
      </p>
    ) : theater.name === "Wonder" ? (
      <p>
        <span className="line-through text-gray-500 mr-2">₹2699</span>
        <span className="inline-block px-4 py-1 rounded-full bg-gray-300">
    <span className="rainbow-text font-bold text-2xl">₹999</span>
  </span>
      </p>
    ) : (
      <p>₹{displayPrice}</p>
    )
  ) : (
    // 👇 Use this when offer is turned off
    <p>₹{displayPrice}</p>
  )}
</div>

              </div>
            );
          })}
        </div>
      </main>

      <footer className="mt-10 text-center text-sm text-gray-600 py-4">
      <button
    onClick={() => router.push("/")}
    className="bg-gray-400 text-black px-6 py-2 rounded-full shadow-sm mr-4 hover:bg-green-400"
  >
    ← Back to Home
  </button>
        {selectedTheaterId && selectedSlot && (
          <button
            onClick={handleNext}
            className="bg-red-500 text-white px-6 py-3 rounded-full mt-4 shadow-lg"
          >
            Next
          </button>
        )}
      </footer>
    </div>
  );
};

export default Bookingx;
