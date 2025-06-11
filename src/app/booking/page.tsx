"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

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
  imageUrl: string; 
  rating: number;
  timeSlots: string[];
  additionalImages: string[];
}

interface TimeSlot {
  id: string;
  name: string;
  time: string;
  availability: boolean;
  isBooked?: boolean;
}

const Bookingx = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [slotsMap, setSlotsMap] = useState<Record<string, TimeSlot[]>>({});
  const [selectedTheaterId, setSelectedTheaterId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  const [showPopup, setShowPopup] = useState(false);
const [currentRoom, setCurrentRoom] = useState<number | null>(null);  // Store the index of the room
const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);



const openPopup = (index: number) => {
  setCurrentRoom(index); // Set the room that was clicked
  setShowPopup(true);  // Show the popup
};

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
    // Reset selected slot whenever the selected date changes
    setSelectedSlot(null); // Deselect slot when date changes

    const fetchTheatersAndSlots = async () => {
      try {
        const theaterSnapshot = await getDocs(collection(db, "rooms"));
        const fetchedTheaters: Theater[] = theaterSnapshot.docs.map((doc) => {
          const data = doc.data();
  
          // Hardcode the additional images for each room
          const additionalImages = [
            `${data.name.toLowerCase()}1.jpg`, 
            `${data.name.toLowerCase()}2.jpg`, 
            `${data.name.toLowerCase()}3.jpg`
          ];
  
          return {
            id: doc.id,
            name: data.name,
            slots: data.slots || 0,
            maxPeople: data.maxPeople || 0,
            foodDrinks: data.foodDrinks ?? false,
            cancellation: data.cancellation ?? false,
            decoration: data.decoration || "None",
            price: data.price || 0,
            basePeople: data.basePeople || 0,
            extraPeopleNote: data.extraPeopleNote || "",
            imageUrl: data.imageUrl || "/images/default-image.jpg", // Assuming imageUrl is fetched or hardcoded
            rating: data.rating || 0,
            timeSlots: data.timeSlots || [],
            additionalImages, // Add the hardcoded additional images here
          };
        });
  
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
            name: doc.data().name,
            time: doc.data().time,
            availability: doc.data().availability,
            isBooked: !doc.data().availability ||
              (bookedMap[theater.name.toLowerCase()]?.has(doc.data().time) ?? false),
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

  const handleNext = () => {
    if (selectedTheaterId && selectedSlot && selectedDate) {
      const selectedTheater = theaters.find((t) => t.id === selectedTheaterId);
      const selectedSlotObj = (slotsMap[selectedTheaterId] || []).find(
        (slot) => slot.time === selectedSlot
      );

      if (selectedTheater && selectedSlotObj) {
        const originalPrice = selectedTheater.price; // Use the updated price from the rooms collection
        const discountedPrice = selectedTheater.name === "Sweet" ? 1499 :
                        selectedTheater.name === "Wonder" ? 1499 :
                        selectedTheater.name === "Galaxy" ? 1499 : originalPrice;
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
      toast.error("Please select a date, theater, and slot before proceeding.");
    }
  };

  const goToNextImage = () => {
    if (currentRoom !== null) {
      const nextIndex =
        currentImageIndex === theaters[currentRoom].additionalImages.length - 1
          ? 0
          : currentImageIndex + 1;  // Move to the next image, loop back to 0 if it's the last image
      setCurrentImageIndex(nextIndex);
    }
  };
  
  const goToPreviousImage = () => {
    if (currentRoom !== null) {
      const prevIndex =
        currentImageIndex === 0
          ? theaters[currentRoom].additionalImages.length - 1  // Go to the last image if it's the first one
          : currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
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
        {theaters.map((theater, index) => {  // Pass index here to map
  const availableSlots = (slotsMap[theater.id] || []).filter((slot) => !slot.isBooked).length;
  const displayPrice = theater.price; // Use the updated price from the Firestore collection

  return (
    <div key={theater.id} className="relative border rounded-lg shadow-md p-4">
      <Image
        src={theater.imageUrl || "/Images/Room1.jpg"}
        alt={theater.name}
        width={400}
        height={200}
        className="rounded-lg w-full h-48 object-cover mb-4"
      />
      {/* Show More Images Button (On the card, top-right) */}
      <button
        onClick={() => openPopup(index)}  // Use index here to open the correct popup for the room
        className="absolute top-2 right-2 bg-yellow-500 text-black p-2 rounded-full shadow-md text-sm"
      >
        Show More Images
      </button>

                <h3 className="text-xl font-semibold mb-1">{theater.name}</h3>
                <p className="text-red-500 text-sm mb-2">{availableSlots} Slots Available</p>
                <ul className="text-sm text-gray-700 mb-2">
                  <li>👥 Max {theater.maxPeople} People</li>
                  <li>🍽️ Food & Drinks available</li>
                  <li>✅ Free Cancellation*</li>
                  <li>💼 Decoration Included {theater.decoration}</li>
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
                            ? "bg-red-300 text-gray-500 cursor-not-allowed"
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
                    <p>
                      <span className="line-through text-gray-500 mr-2">₹{displayPrice}</span>
                      <span className="inline-block px-4 py-1 rounded-full bg-gray-300">
                        <span className="rainbow-text font-bold text-2xl">₹1499</span>
                      </span>
                    </p>
                  ) : (
                    <p>₹{displayPrice}</p>
                  )}
                </div>
                {selectedTheaterId === theater.id && selectedSlot && (
                  <button
                    onClick={handleNext}
                    className="bg-red-500 text-white px-4 py-2 rounded-full mt-4 w-full shadow-md hover:bg-red-600"
                  >
                    Next
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>
      {/* Slideshow Popup */}
{showPopup && currentRoom !== null && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-4 max-w-md w-full">
      <div className="relative">
        {/* Dynamically loading images for the room */}
        <Image
  src={`/Images/${theaters[currentRoom].additionalImages[currentImageIndex]}`}  // Correct path with "Images" folder capitalized
  alt={`Room ${theaters[currentRoom].name} Image`}
  width={400}
  height={250}
  className="rounded-lg"
/>
        <button
          onClick={goToPreviousImage}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full"
        >
          &lt;
        </button>
        <button
          onClick={goToNextImage}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full"
        >
          &gt;
        </button>
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
        >
          X
        </button>
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm">
          Image {currentImageIndex + 1} of {theaters[currentRoom].additionalImages.length} {/* Show total number of images */}
        </p>
      </div>
    </div>
  </div>
)}



      <footer className="mt-10 text-center text-sm text-gray-600 py-4">
        <button
          onClick={() => router.push("/")}
          className="bg-gray-400 text-black px-6 py-2 rounded-full shadow-sm mr-4 hover:bg-green-400"
        >
          ← Back to Home
        </button>
      </footer>
    </div>
  );
};

export default Bookingx;
