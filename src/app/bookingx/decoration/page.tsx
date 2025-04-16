"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Razorpay from "razorpay";

const extraDecorations = [
  { name: "Rose Heart", price: 150, image: "/Images/decorations/rose_heart.png" },
  { name: "Candle Path", price: 300, image: "/Images/decorations/candle_path.png" },
  { name: "LED Numbers", price: 100, image: "/Images/decorations/led_numbers.png" },
];

const gifts = [
  { name: "Small Heart Pillow", price: 200, image: "/Images/gifts/pillow.png" },
  { name: "Event Sash", price: 100, image: "/Images/gifts/sash.png" },
  { name: "Crown", price: 150, image: "/Images/gifts/crown.png" },
  { name: "Bouquet (7 roses)", price: 350, image: "/Images/gifts/bouquet.png" },
];

const specialServices = [
  { name: "Photoshoot (15 min)", price: 300, image: "/Images/services/photo15.jpg" },
  { name: "Photoshoot (30 min)", price: 500, image: "/Images/services/photo15.jpg" },
  { name: "Fog Entry (1 pot)", price: 350, image: "/Images/services/fogg.png" },
  { name: "Fog Entry (2 pots)", price: 700, image: "/Images/services/fogg.png" },
  { name: "Fog Entry (3 pots)", price: 900, image: "/Images/services/fogg.png" },
  { name: "Fog Entry (4 pots)", price: 1100, image: "/Images/services/fogg.png" },
  { name: "Grand Fog Entry (10 pots)", price: 2500, image: "/Images/services/fogg.png" },
  { name: "Kids Car Entry", price: 300, image: "/Images/services/kids_car.png" },
];

const allItems = [...extraDecorations, ...gifts, ...specialServices];

const DecorationPage = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedCake, setSelectedCake] = useState<any>(null);
  const [numPeople, setNumPeople] = useState<number>(2);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState("");
  const [nameToInclude, setNameToInclude] = useState("");
  const [displayDate, setDisplayDate] = useState("");

  const router = useRouter();

  useEffect(() => {
    const storedTheater = JSON.parse(localStorage.getItem("selectedTheater") || "null");
    const storedSlot = JSON.parse(localStorage.getItem("selectedSlot") || "null");
    const storedCake = JSON.parse(localStorage.getItem("selectedCake") || "null");
    const storedPeople = parseInt(localStorage.getItem("numPeople") || "2");
    const storedName = localStorage.getItem("name") || "";
    const storedPhone = localStorage.getItem("phoneNumber") || "";
    const storedEmail = localStorage.getItem("email") || "";
    const storedOccasion = localStorage.getItem("selectedOccasion") || "";
    const storedNameToInclude = localStorage.getItem("nameToInclude") || "";
    const storedDate = localStorage.getItem("selectedDate");
    const formattedDate = storedDate ? new Date(storedDate).toLocaleDateString("en-GB") : "";
    setDisplayDate(formattedDate);

    setSelectedTheater(storedTheater);
    setSelectedSlot(storedSlot);
    setSelectedCake(storedCake);
    setNumPeople(storedPeople);
    setName(storedName);
    setPhoneNumber(storedPhone);
    setEmail(storedEmail);
    setOccasion(storedOccasion);
    setNameToInclude(storedNameToInclude);
  }, []);

  const handleSelect = (name: string) => {
    setSelectedItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const selectedExtras = allItems.filter((item) => selectedItems.includes(item.name));
  const extrasTotal = selectedExtras.reduce((sum, item) => sum + item.price, 0);
  const cakeCost = selectedCake?.price || 0;
  const theaterCost = selectedTheater?.price || 0;
  const subtotal = theaterCost + cakeCost + extrasTotal;
  const advance = 750;
  const balance = subtotal - advance;

  const handlePaymentAndBooking = async () => {
    const decorations = selectedExtras.map((item) => item.name);
    const cakeName = selectedCake?.name || "";
    const selectedDate = new Date(localStorage.getItem("selectedDate") || new Date());
    const dateString = selectedDate.toLocaleDateString("en-CA");
  
    const bookingData = {
      name,
      mobile: phoneNumber,
      email,
      room: selectedTheater?.name?.toLowerCase() || "unknown",
      date: dateString,
      status: "pending",
      timeSlot: selectedSlot?.time || "",
      decorations,
      cake: cakeName,
      advanceAmount: advance,
      dueAmount: balance,
      people: numPeople,
      occasion,
      occasionName: nameToInclude,
    };
  
    const bookedData = {
      date: dateString,
      room: selectedTheater?.name?.toLowerCase() || "unknown",
      timeSlot: selectedSlot?.time || "",
    };
  
    try {
      // ✅ Dynamically load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
  
      script.onload = async () => {
        const res = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: advance * 100, name, email, phone: phoneNumber }),
        });
        const data = await res.json();
  
        if (!data.id) throw new Error("Failed to create Razorpay order");
  
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: "INR",
          name: "Showtime Booking",
          description: "Advance Booking Payment",
          order_id: data.id,
          handler: async (response: any) => {
            try {
              await addDoc(collection(db, "bookings"), bookingData);
              await addDoc(collection(db, "booked"), bookedData);
              alert("Payment successful and booking saved!");
              router.push("/");
            } catch (err) {
              console.error("Firestore save failed after payment:", err);
              alert("Payment succeeded but booking save failed.");
            }
          },
          prefill: {
            name,
            email,
            contact: phoneNumber,
          },
          theme: {
            color: "#8B5CF6",
          },
          modal: {
            ondismiss: () => {
              alert("Payment cancelled.");
              router.push("/");
            },
          },
        };
  
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      };
  
      script.onerror = () => {
        alert("Failed to load Razorpay script.");
      };
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert("Something went wrong. Please try again.");
    }
  };
  
  
  

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="w-full md:w-2/3">
        <h2 className="text-2xl font-bold mb-4">Extra Decoration <span className="text-sm text-gray-500">(optional)</span></h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {extraDecorations.map((item) => (
            <div key={item.name} onClick={() => handleSelect(item.name)} className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-transform hover:scale-105 ${selectedItems.includes(item.name) ? "border-purple-700 bg-purple-100" : "border-gray-300"}`}>
              <Image src={item.image} alt={item.name} width={100} height={100} className="mx-auto" />
              <p className="mt-2 font-medium">{item.name}</p>
              <p className="text-sm">₹ {item.price}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">Choose Gifts <span className="text-sm text-gray-500">(optional)</span></h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {gifts.map((item) => (
            <div key={item.name} onClick={() => handleSelect(item.name)} className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-transform hover:scale-105 ${selectedItems.includes(item.name) ? "border-purple-700 bg-purple-100" : "border-gray-300"}`}>
              <Image src={item.image} alt={item.name} width={100} height={100} className="mx-auto" />
              <p className="mt-2 font-medium">{item.name}</p>
              <p className="text-sm">₹ {item.price}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">Special Services <span className="text-sm text-gray-500">(optional)</span></h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {specialServices.map((item) => (
            <div key={item.name} onClick={() => handleSelect(item.name)} className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-transform hover:scale-105 ${selectedItems.includes(item.name) ? "border-purple-700 bg-purple-100" : "border-gray-300"}`}>
              <Image src={item.image} alt={item.name} width={100} height={100} className="mx-auto" />
              <p className="mt-2 font-medium">{item.name}</p>
              <p className="text-sm">₹ {item.price}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-10">
          <button onClick={() => router.back()} className="py-3 px-8 bg-gray-300 text-black font-semibold rounded hover:bg-gray-400">Back</button>
          <button
            onClick={handlePaymentAndBooking}
            className="py-3 px-8 rounded-full bg-purple-900 text-white font-semibold shadow-md hover:bg-purple-800"
          >
            Pay ₹{advance}
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">Booking summary</h3>
        <div className="text-sm space-y-1">
          <div className="flex justify-between"><span>{selectedTheater?.name || "Room"} ({numPeople} ppl)</span><span>₹ {theaterCost}</span></div>
          {selectedSlot?.time && <div className="flex justify-between"><span>Time Slot</span><span>{selectedSlot.time}</span></div>}
          {selectedCake && <div className="flex justify-between"><span>{selectedCake.name}</span><span>₹ {cakeCost}</span></div>}
          {selectedExtras.map((item) => (
            <div key={item.name} className="flex justify-between"><span>{item.name}</span><span>₹ {item.price}</span></div>
          ))}
          <div className="flex justify-between border-t mt-2 pt-2 font-medium"><span>Subtotal</span><span>₹ {subtotal}</span></div>
          <div className="mt-4 font-semibold">Advance amount payable</div>
          <div className="flex justify-between"><span>₹ {advance}</span></div>
          <div className="flex justify-between text-xs text-gray-500"><span>Balance amount</span><span>₹ {balance}</span></div>
          <div className="text-xs text-gray-400 mt-1">(Payable at the venue)</div>
          <hr className="my-3" />
          <div className="text-xs text-gray-700 space-y-1">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Phone:</strong> {phoneNumber}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Occasion:</strong> {occasion}</p>
            <p><strong>Include Name:</strong> {nameToInclude}</p>
            <p><strong>Date:</strong> {displayDate}</p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DecorationPage;
