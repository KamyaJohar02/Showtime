"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { doc, getDoc } from "firebase/firestore";  // Add this import for getDoc
import Razorpay from "razorpay";

const extraDecorations = [
  { name: "Occasion Themed Decoration", price: 450, image: "/Images/decorations/ocdeco.jpg" },
  { name: "Chocolates", price: 150, image: "/Images/decorations/chocolate.jpg" },
  /* { name: "Sparkle Candle", price: 300, image: "/Images/decorations/sparklecandle.jpg" }, */
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
const [showPaymentReminder, setShowPaymentReminder] = useState(false);

const [showLedPopup, setShowLedPopup] = useState(false);
const [ledName, setLedName] = useState("");
const [ledPrice, setLedPrice] = useState(0);

const [couponName, setCouponName] = useState<string | null>(null);

const [isAdminBookingCouponVerified, setIsAdminBookingCouponVerified] = useState(false); 




  const router = useRouter();

  const fetchSpecialCoupon = async () => {
    try {
      const couponRef = doc(db, "adminbooking", "specialcode"); // Use the 'adminbooking' collection and 'specialcode' document
      const couponSnap = await getDoc(couponRef);
  
      if (couponSnap.exists()) {
        const couponData = couponSnap.data();
        // Check if the entered coupon code matches the name field in the document
        if (couponData.name === couponCode.trim()) {
          setIsAdminBookingCouponVerified(true); // Set the coupon as verified if names match
        } else {
          setIsAdminBookingCouponVerified(false); // Hide button if coupon doesn't match
          console.log("Coupon name does not match.");
        }
      } else {
        setIsAdminBookingCouponVerified(false); // Hide button if no coupon found
        console.log("No such coupon!");
      }
    } catch (error) {
      console.error("Error fetching special coupon:", error);
      setIsAdminBookingCouponVerified(false); // Hide button on error
    }
  };
  
  
  useEffect(() => {
    if (couponCode.trim() !== "") {  // Ensure couponCode is not empty
      fetchSpecialCoupon(); // Call the function to verify coupon when couponCode changes
    } else {
      setIsAdminBookingCouponVerified(false); // If coupon code is empty, hide the button
    }
  }, [couponCode]); // Trigger when couponCode changes
  
  
  
  

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
    if (name === "LED Name" && !selectedItems.some(item => item.startsWith("LED Name:"))) {
      setShowLedPopup(true); // Show the LED Name popup if not selected yet
    } else {
      // Remove "LED Name" entry from selectedItems when deselected, else toggle other items
      if (name === "LED Name") {
        setSelectedItems((prev) => prev.filter((item) => !item.startsWith("LED Name:"))); // Remove only "LED Name" from selectedItems
        setLedName("");  // Reset the LED name
        setLedPrice(0);  // Reset the LED price
      }
        else {
          // For non-LED items, ensure no duplicates are selected
          setSelectedItems((prev) => {
            // If the item is already selected, remove it (deselect), otherwise add it
            if (prev.includes(name)) {
              return prev.filter((item) => item !== name); // Remove the item
            } else {
              return [...prev, name]; // Add the item
            }
        });
      }
    }
  };
  
  
  
  
  
  
  

  const handleLedNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLedName(event.target.value);
    setLedPrice(event.target.value.length * 100); // Calculate price based on character count
  };
  
  const handleLedPopupClose = () => {
    if (ledName.trim() !== "") {
      // Remove previous "LED Name" entries before adding a new one with updated name and price
      setSelectedItems((prev) => [
        ...prev.filter((item) => !item.startsWith("LED Name:")), // Remove old LED Name
        `LED Name: ${ledName}` // Add new LED Name with the entered name and price
      ]);
    }
    setShowLedPopup(false); // Close the LED Name popup
  };
  
  
  
  
  
  const selectedExtras = allItems.filter((item) => selectedItems.includes(item.name));
  const extrasTotal = selectedExtras.reduce((sum, item) => sum + item.price, 0);
  const cakeCost = selectedCake?.price || 0;
  const theaterCost = selectedTheater?.price || 0;
  const subtotal = theaterCost + cakeCost + extrasTotal + ledPrice;
  const discountedTotal = couponApplied
  ? Math.round(subtotal - (subtotal * discountPercent) / 100)
  : subtotal;

  const advance = 499;
  
  const balance = discountedTotal - advance;

  // Function to open the reminder popup
  const handleOpenPaymentReminder = () => {
    setShowPaymentReminder(true); // Show the reminder popup
  };

  
  {/*const handleBookingWithoutPayment = async () => {
    // Get the selected extra decorations
    const decorations = selectedExtras.map((item) => item.name);
  
    // Filter selected items to get "LED Name" (if any)
    const ledDecorations = selectedItems.filter(item => item.startsWith("LED Name:")); // Filter out LED Name from selectedItems
  
    // Combine both selected extras and LED Name items
    const allDecorations = [...decorations, ...ledDecorations]; // Merge them into one array
  
    const cakeName = selectedCake?.name || "";
    const selectedDate = new Date(localStorage.getItem("selectedDate") || new Date());
    const dateString = selectedDate.toLocaleDateString("en-CA");
  
    const bookingData = {
      name,
      mobile: phoneNumber,
      email,
      room: selectedTheater?.name?.toLowerCase() || "unknown",
      date: dateString,
      status: "pending", // Keep status as "pending" since no payment is made
      timeSlot: selectedSlot?.time || "",
      decorations: allDecorations,  // Store combined decorations, including LED Name
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
      // Save the booking data without payment (no Razorpay logic here)
      await addDoc(collection(db, "bookings"), bookingData);
      await addDoc(collection(db, "booked"), bookedData);
  
      // Show confirmation popup
      localStorage.setItem("bookingConfirmed", "true");
      router.push("/"); // Redirect to home
    } catch (err) {
      console.error("Booking without payment failed:", err);
      toast.error("Booking failed. Please try again.");
    }
  }; */}

  const handleBookingWithoutPayment = async () => {
  
    // Prepare the booking data
    const cakeName = selectedCake?.name || "";
    const selectedDate = new Date(localStorage.getItem("selectedDate") || new Date());
    const dateString = selectedDate.toLocaleDateString("en-CA");
  
    const bookingData = {
      name,
      mobile: phoneNumber,
      email,
      room: selectedTheater?.name?.toLowerCase() || "unknown",
      date: dateString,
      status: "pending", // Keep status as "pending"
      timeSlot: selectedSlot?.time || "",
      decorations: selectedItems, // Decorations list
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
      // Save the booking data without payment (no Razorpay logic here)
      await addDoc(collection(db, "bookings"), bookingData);
      await addDoc(collection(db, "booked"), bookedData);
  
      // Show confirmation popup and redirect
      localStorage.setItem("bookingConfirmed", "true");
      router.push("/"); // Redirect to home
    } catch (err) {
      console.error("Booking without payment failed:", err);
      toast.error("Booking failed. Please try again.");
    }
  };
  
  

  



  const handleApplyCoupon = async () => {
    try {
      // First, check if the coupon exists in the 'coupons' collection (for normal discount coupons)
      const couponSnapshot = await getDocs(collection(db, "coupons"));
      let matched = false;
  
      couponSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name === couponCode.trim().toUpperCase()) {
          setDiscountPercent(Number(data.percentageDiscount)); // Set discount percentage
          setCouponApplied(true); // Mark coupon as applied
          setCouponError(""); // Clear previous errors
          matched = true;
        }
      });
  
      // If no match was found in the 'coupons' collection, check the 'adminbooking' collection (for admin booking)
      if (!matched) {
        const couponRef = doc(db, "adminbooking", "specialcode"); // Reference to the document with ID "specialcode"
        const couponSnap = await getDoc(couponRef); // Get the document snapshot
  
        if (couponSnap.exists()) {
          const couponData = couponSnap.data(); // Get the data of the document
  
          // Check if the entered coupon code matches the name field in the admin booking document
          if (couponData.name === couponCode.trim()) {
            setIsAdminBookingCouponVerified(true); // Set admin coupon verified flag to true
            setCouponApplied(true); // Mark coupon as applied
            setCouponError(""); // Clear previous errors
  
          } else {
            setCouponError("Admin Coupon does not match the special code."); // Error for admin coupon mismatch
            setIsAdminBookingCouponVerified(false); // Admin coupon verification failed
          }
        } else {
          console.log("No such admin coupon!");
          setCouponError("Admin Coupon does not exist."); // Error if the specialcode coupon is not found
          setIsAdminBookingCouponVerified(false); // Admin coupon does not exist
        }
      }
  
      // If no coupon matched in both collections, show error
      if (!matched && !isAdminBookingCouponVerified) {
        setCouponError("Coupon does not exist or is invalid."); // General coupon error message
      }
    } catch (err) {
      console.error("Failed to apply coupon:", err);
      setCouponError("Something went wrong. Please try again."); // General error message
    }
  };
  
  
  
  const handleRemoveCoupon = () => {
    setCouponApplied(false); // Mark coupon as not applied
    setDiscountPercent(0); // Reset discount percentage
    setCouponCode(""); // Clear the coupon code input
    setCouponError(""); // Clear any coupon error messages
    setIsAdminBookingCouponVerified(false); // Reset admin booking coupon verification flag
  };
  
    
  
  const handlePaymentAndBooking = async () => {
    const decorations = selectedExtras.map((item) => item.name);
    // Filter selected items to get "LED Name" (if any)
  const ledDecorations = selectedItems.filter(item => item.startsWith("LED Name:")); // Filter out LED Name from selectedItems

  // Combine both selected extras and LED Name items
  const allDecorations = [...decorations, ...ledDecorations]; // Merge them into one array
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
      decorations: allDecorations,  // Store combined decorations, including LED Name      
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
  <div
  key={item.name}
  onClick={() => handleSelect(item.name)}
  className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-transform hover:scale-105 ${
    selectedItems.includes(item.name) ||
    (item.name === "LED Name" && selectedItems.some(i => i.startsWith("LED Name:"))) // Apply red border if selected
      ? "border-red-700 bg-red-100"
      : "border-gray-300"
  }`}
>
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
      
      {/* Render LED Name if selected */}
      <div className="text-sm space-y-1">
  {Array.from(new Set(selectedItems)).map((item, index) => { // Using Set to ensure no duplicates
    // Handle LED Name separately
    if (item.startsWith("LED Name:")) {
      return (
        <div key={`led-${index}`} className="flex justify-between"> {/* Use unique key */}
          <span>{item}</span>
          <span>₹ {ledPrice}</span> {/* Display the LED price */}
        </div>
      );
    }

    // For other selected items (e.g., gifts, decorations)
    const itemData = allItems.find((i) => i.name === item); // Find the item data
    if (itemData) {
      return (
        <div key={`item-${index}`} className="flex justify-between"> {/* Use unique key */}
          <span>{item}</span>
          <span>₹ {itemData.price}</span> {/* Display the price */}
        </div>
      );
    }
    return null;
  })}
</div>









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

        {/* Pre-payment Reminder Popup */}
{showPaymentReminder && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-80 text-center">
      <h3 className="text-lg font-bold text-red-600">Important Reminder For Mobile Users</h3>
      <p className="mt-2 text-sm">
        Note! After confirming your payment from PhonePe, GooglePay, PayTM, or any other external app, please return back to this page to complete your booking. 
        Make sure you take a screenshot of the "Booking Confirmed" message for your reference.
      </p>
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => {
            setShowPaymentReminder(false); // Close the popup
            handlePaymentAndBooking(); // Proceed with payment logic
          }}
          className="bg-green-600 text-white py-2 px-4 rounded-md"
        >
          Okay! I understood
        </button>
      </div>
      </div>
      </div>
      )}

{showLedPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-80 text-center">
      <h3 className="text-lg font-semibold">Enter Name for LED Sign</h3>
      <p className="mt-2 text-sm">Please enter the name for the LED sign. ₹100 per letter.</p>
      <input
        type="text"
        value={ledName}
        onChange={handleLedNameChange}
        className="mt-2 p-2 border rounded w-full"
        placeholder="Enter name"
      />
      <p className="mt-2 text-sm">Price: ₹{ledPrice}</p>
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleLedPopupClose}
          className="bg-green-600 text-white py-2 px-4 rounded-md"
        >
          Save Name
        </button>
      </div>
    </div>
  </div>
)}



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
        onClick={handleOpenPaymentReminder}
        className="py-3 px-8 rounded-full bg-red-900 text-white font-semibold shadow-md hover:bg-red-800"
      >
        Pay ₹{advance}
      </button>
      {/*<button
    onClick={handleBookingWithoutPayment}
    className="py-3 px-8 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-500"
  >
    Book without Pay
  </button> */}
  {isAdminBookingCouponVerified && (
  <button
    onClick={handleBookingWithoutPayment} // Trigger booking without payment
    className="py-3 px-8 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-500"
  >
    Make Admin Booking
  </button>
)}



    </div>
  </div>
    </div>
  );
};

export default DecorationPage;
