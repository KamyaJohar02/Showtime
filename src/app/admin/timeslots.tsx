"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where, setDoc, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Theater {
  id: string;
  name: string;
  imageUrl: string;
  maxPeople: number;
  timeSlots: string[];
}

interface TimeSlot {
  id: string;
  time: string;
  isBooked: boolean;
}

const roomPrices: Record<string, number> = {
  "Sweet": 1999,
  "Wonder": 2199,
  "Galaxy": 2499,
};

const ManageTimeSlots = () => {
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
          const timeSlotSnapshot = await getDocs(collection(db, "rooms", theater.id, "timeSlots"));

          const roomSlots: TimeSlot[] = timeSlotSnapshot.docs.map((doc) => ({
            id: doc.id,
            time: doc.data().time,
            isBooked: bookedMap[theater.name.toLowerCase()]?.has(doc.data().time) ?? false,
          }));

          slotMap[theater.id] = roomSlots;
        }

        setSlotsMap(slotMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTheatersAndSlots();
  }, [selectedDate]);

  const handleDisableSlot = async (theaterId: string, timeSlot: string) => {
    const roomRef = collection(db, "booked");
    const selectedTheater = theaters.find((t) => t.id === theaterId);

    if (selectedTheater) {
      try {
        // Check if the slot is already booked/disabled
        const existingDocQuery = query(
          collection(db, "booked"),
          where("room", "==", selectedTheater.name),
          where("timeSlot", "==", timeSlot)
        );
        const existingDocs = await getDocs(existingDocQuery);

        if (!existingDocs.empty) {
          toast.error("This slot is already disabled!");
          return;
        }

        // Disable the slot by adding it to the booked collection
        await setDoc(doc(roomRef), {
          date: selectedDate?.toLocaleDateString("en-CA"),
          room: selectedTheater.name,
          timeSlot,
        });

        // Update UI to reflect the change
        const updatedSlots = (slotsMap[theaterId] || []).map((slot) =>
          slot.time === timeSlot ? { ...slot, isBooked: true } : slot
        );
        setSlotsMap({
          ...slotsMap,
          [theaterId]: updatedSlots,
        });

        toast.success("Slot Disabled Successfully!");
      } catch (error) {
        console.error("Error disabling slot:", error);
        toast.error("Error disabling slot.");
      }
    }
  };

  const handleEnableSlot = async (theaterId: string, timeSlot: string) => {
    // Retrieve the selected theater object using its ID
    const selectedTheater = theaters.find((theater) => theater.id === theaterId);
  
    if (selectedTheater) {
      try {
        // Create a query to find the booked slot that matches room, date, and timeSlot
        const bookedQuery = query(
          collection(db, "booked"),
          where("room", "==", selectedTheater.name),   // Match by room name
          where("date", "==", selectedDate?.toLocaleDateString("en-CA")), // Match by date
          where("timeSlot", "==", timeSlot)  // Match by time slot
        );
  
        // Execute the query
        const snapshot = await getDocs(bookedQuery);
  
        // If there are matching documents, delete them
        snapshot.forEach((doc) => {
          deleteDoc(doc.ref);  // Delete the matched document
        });
  
        // Update the UI to reflect the changes
        const updatedSlots = (slotsMap[theaterId] || []).map((slot) =>
          slot.time === timeSlot ? { ...slot, isBooked: false } : slot
        );
  
        // Update the state with the updated slot information
        setSlotsMap({
          ...slotsMap,
          [theaterId]: updatedSlots,
        });
  
        toast.success("Slot Enabled Successfully!"); // Show success message
  
      } catch (error) {
        console.error("Error enabling slot:", error);
        toast.error("Error enabling slot.");  // Show error message if the deletion fails
      }
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <header className="p-6">
        <h2 className="text-2xl font-bold mb-2">Manage Time Slots</h2>
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
              onSelect={(date) => setSelectedDate(date)}
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
            return (
              <div key={theater.id} className="border rounded-lg shadow-md p-4">
                <Image
                  src={theater.imageUrl || "/Images/Room1.jpg"}
                  alt={theater.name}
                  width={400}
                  height={200}
                  className="rounded-lg w-full h-48 object-cover mb-4"
                />

                <h3 className="text-xl font-semibold mb-1">{theater.name}</h3>
                <p className="text-red-500 text-sm mb-2">{(slotsMap[theater.id] || []).filter((slot) => !slot.isBooked).length} Slots Available</p>
                <ul className="text-sm text-gray-700 mb-2">
                  <li>👥 Max {theater.maxPeople} People</li>
                  <li>🍽️ Food & Drinks available</li>
                  <li>✅ Free Cancellation*</li>
                </ul>
                <div className="mb-2">
                  <strong>Select Time Slot:</strong>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {(slotsMap[theater.id] || []).map((slot) => (
                      <div key={slot.id}>
                        <button
                          onClick={() => {
                            setSelectedTheaterId(theater.id);
                            setSelectedSlot(slot.time);
                          }}
                          className={`text-sm p-2 rounded transition-colors duration-200 ${
                            selectedTheaterId === theater.id && selectedSlot === slot.time
                              ? "bg-green-500 text-white"
                              : slot.isBooked
                              ? "bg-red-300 text-gray-500 cursor-not-allowed"
                              : "bg-gray-100 hover:bg-blue-100"
                          }`}
                        >
                          {slot.time}
                        </button>

                        {selectedTheaterId === theater.id && selectedSlot === slot.time && (
                          <button
                            onClick={() => (slot.isBooked ? handleEnableSlot(theater.id, slot.time) : handleDisableSlot(theater.id, slot.time))}
                            className={`mt-2 p-2 rounded-full ${slot.isBooked ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                          >
                            {slot.isBooked ? "Enable Slot" : "Disable Slot"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ManageTimeSlots;
