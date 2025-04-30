"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { toast } from "react-hot-toast";
import Razorpay from "razorpay";

const extraDecorations = [
  { name: "Occasion Themed Decoration", price: 450, image: "/Images/decorations/ocdeco.jpg" },
  { name: "Chocolates", price: 150, image: "/Images/decorations/chocolate.jpg" },
  { name: "Sparkle Candle", price: 300, image: "/Images/decorations/sparklecandle.jpg" },
  { name: "LED Name", price: 100, image: "/Images/decorations/ledname.jpg" },
  { name: "Candle Path", price: 300, image: "/Images/decorations/candle_path.png" },

];

const gifts = [
  { name: "Teddy Bear 2 feet", price: 500, image: "/Images/gifts/teddybear.webp" },
  { name: "Teddy Bear 5 feet", price: 1000, image: "/Images/gifts/teddybear.webp" },
  { name: "Event Sash", price: 100, image: "/Images/gifts/sash.png" },
  { name: "Crown", price: 150, image: "/Images/gifts/crown.png" },
  { name: "Single Rose Bouquet", price: 300, image: "/Images/gifts/bouquet.png" },
  { name: "Propose Rings", price: 300, image: "/Images/gifts/proposerings.jpg" },
];

const specialServices = [
  { name: "Bubbles", price: 300, image: "/Images/services/bubbles.jpg" },
  { name: "Photoshoot (30 min)", price: 500, image: "/Images/services/photo15.jpg" },
  { name: "Fog Entry (1 pot)", price: 300, image: "/Images/services/fogg.png" },
  { name: "Fog Entry (2 pots)", price: 500, image: "/Images/services/fogg.png" },
  { name: "Fog Entry (3 pots)", price: 800, image: "/Images/services/fogg.png" },
  { name: "Fog Entry (4 pots)", price: 1000, image: "/Images/services/fogg.png" },
  { name: "Grand Fog Entry (10 pots)", price: 2100, image: "/Images/services/fogg.png" },
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

  const [couponCode, setCouponCode] = useState("");
const [couponApplied, setCouponApplied] = useState(false);
const [discountPercent, setDiscountPercent] = useState(0);
const [couponError, setCouponError] = useState("");

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
  const discountedTotal = couponApplied
  ? Math.round(subtotal - (subtotal * discountPercent) / 100)
  : subtotal;

  const advance = 499;
  const balance = subtotal - advance;

  



  const handleApplyCoupon = async () => {
    try {
      const snapshot = await getDocs(collection(db, "coupons"));
      let matched = false;
  
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name === couponCode.trim().toUpperCase()) {
          setDiscountPercent(Number(data.percentageDiscount));
          setCouponApplied(true);
          setCouponError("");
          matched = true;
        }
      });
  
      if (!matched) {
        setCouponError("Sorry, the code is invalid.");
      }
    } catch (err) {
      console.error("Failed to apply coupon:", err);
      setCouponError("Something went wrong. Try again.");
    }
  };
  
  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setDiscountPercent(0);
    setCouponCode("");
    setCouponError("");
  };
    
  
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
              const { razorpay_payment_id } = response;
          
              // Add payment ID to your booking object
              const bookingWithPaymentId = {
                ...bookingData,
                razorpayPaymentId: razorpay_payment_id,
              };
          
              await addDoc(collection(db, "bookings"), bookingWithPaymentId);
              await addDoc(collection(db, "booked"), bookedData);
          
              // ✅ Show confirmation popup on homepage
    localStorage.setItem("bookingConfirmed", "true");
    localStorage.setItem("paymentId", razorpay_payment_id);

    router.push("/"); // Redirect to home
  } catch (err) {
    console.error("Firestore save failed after payment:", err);
    toast.error("Payment succeeded but booking save failed.");
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
              toast.error("Payment cancelled.");
              router.push("/");
            },
          },
        };
  
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      };
  
      script.onerror = () => {
        toast.error("Failed to load Razorpay script.");
      };
    } catch (err) {
      console.error("Payment initiation failed:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };
  
  
  

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
  <div className="w-full md:w-2/3">
    <h2 className="text-2xl font-bold mb-4">Extra Decoration <span className="text-sm text-gray-500">(optional)</span></h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
      {extraDecorations.map((item) => (
        <div key={item.name} onClick={() => handleSelect(item.name)} className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-transform hover:scale-105 ${selectedItems.includes(item.name) ? "border-red-700 bg-red-100" : "border-gray-300"}`}>
          <Image src={item.image} alt={item.name} width={100} height={100} className="mx-auto" />
          <p className="mt-2 font-medium">{item.name}</p>
          <p className="text-sm">₹ {item.price}</p>
        </div>
      ))}
    </div>

    <h2 className="text-2xl font-bold mb-4">Choose Gifts <span className="text-sm text-gray-500">(optional)</span></h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
      {gifts.map((item) => (
        <div key={item.name} onClick={() => handleSelect(item.name)} className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-transform hover:scale-105 ${selectedItems.includes(item.name) ? "border-red-700 bg-red-100" : "border-gray-300"}`}>
          <Image src={item.image} alt={item.name} width={100} height={100} className="mx-auto" />
          <p className="mt-2 font-medium">{item.name}</p>
          <p className="text-sm">₹ {item.price}</p>
        </div>
      ))}
    </div>

    <h2 className="text-2xl font-bold mb-4">Special Services <span className="text-sm text-gray-500">(optional)</span></h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {specialServices.map((item) => (
        <div key={item.name} onClick={() => handleSelect(item.name)} className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-transform hover:scale-105 ${selectedItems.includes(item.name) ? "border-red-700 bg-red-100" : "border-gray-300"}`}>
          <Image src={item.image} alt={item.name} width={100} height={100} className="mx-auto" />
          <p className="mt-2 font-medium">{item.name}</p>
          <p className="text-sm">₹ {item.price}</p>
        </div>
      ))}
    </div>
  </div>

  <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow">
    <h3 className="text-lg font-bold mb-2">Booking Summary</h3>
    <div className="text-sm space-y-1">
      <div className="flex justify-between"><span>{selectedTheater?.name || "Room"} ({numPeople} ppl)</span><span>₹ {theaterCost}</span></div>
      {selectedSlot?.time && <div className="flex justify-between"><span>Time Slot</span><span>{selectedSlot.time}</span></div>}
      {selectedCake && <div className="flex justify-between"><span>{selectedCake.name}</span><span>₹ {cakeCost}</span></div>}
      {selectedExtras.map((item) => (
        <div key={item.name} className="flex justify-between"><span>{item.name}</span><span>₹ {item.price}</span></div>
      ))}
      <div className="flex justify-between border-t mt-2 pt-2 font-medium"><span>Subtotal</span><span>₹ {discountedTotal}</span></div>
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

        {/* Coupon Input */}
        <div className="mt-4">
          <label className="block font-bold mb-1">Apply Coupon</label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter your coupon code"
              className="px-4 py-2 rounded-md border border-gray-300 w-full sm:w-auto text-sm focus:outline-none focus:ring-2 focus:ring-red-500 uppercase"
            />
            {!couponApplied ? (
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
              >
                Apply
              </button>
            ) : (
              <button
                onClick={handleRemoveCoupon}
                className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 transition"
              >
                Remove
              </button>
            )}
          </div>
          {couponError && (
            <p className="text-sm text-red-500 mt-1">{couponError}</p>
          )}
          {couponApplied && (
            <p className="text-xs text-green-600 mt-2 italic">
              NOTE: Prices have been reduced
            </p>
          )}
        </div>
      </div>
    </div>
    {/* Moved the Pay button after the summary */}
    <div className="flex justify-between mt-10">
      <button onClick={() => router.back()} className="py-3 px-8 bg-gray-300 text-black font-semibold rounded hover:bg-gray-400">Back</button>
      <button
        onClick={handlePaymentAndBooking}
        className="py-3 px-8 rounded-full bg-red-900 text-white font-semibold shadow-md hover:bg-red-800"
      >
        Pay ₹{advance}
      </button>
    </div>
  </div>
    </div>
  );
};

export default DecorationPage;
