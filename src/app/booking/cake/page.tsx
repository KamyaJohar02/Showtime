"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

const cakes = [
  { name: "Chocolate Cake", price: 500, image: "/Images/cakes/chocolate_cake.png" },
  { name: "Black Forest Cake", price: 500, image: "/Images/cakes/black_forest_cake.png" },
  { name: "Butterscotch Cake", price: 500, image: "/Images/cakes/butterscotch_cake.png" },
  { name: "Pineapple Cake", price: 500, image: "/Images/cakes/pineapple_cake.png" },
  { name: "Red Velvet Round Cake", price: 600, image: "/Images/cakes/red_velvet_round_cake.png" },
  { name: "Irish Coffee Cake", price: 650, image: "/Images/cakes/irish_coffee_cake.png" },
  { name: "Red Velvet Heart Cake", price: 750, image: "/Images/cakes/red_velvet_heart_cake.png" },
  { name: "Choco Truffle Cake", price: 750, image: "/Images/cakes/choco_truffle_cake.jpeg" },
  { name: "DBC Cake", price: 750, image: "/Images/cakes/dbc_cake.png" },
  { name: "Choco Oreo Cake", price: 750, image: "/Images/cakes/choco_oreo_cake.png" },
  { name: "Choco Chip Loaded Cake", price: 750, image: "/Images/cakes/choco_chip_loaded_cake.png" },
  { name: "Kitkat Cake", price: 1000, image: "/Images/cakes/kitkat_cake.png" },
];

const CakePage = () => {
  const router = useRouter();
  const [selectedCake, setSelectedCake] = useState<string | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [numPeople, setNumPeople] = useState<number>(2);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState("");
  const [nameToInclude, setNameToInclude] = useState("");

  useEffect(() => {
    // ✅ Clear previously selected cake on refresh/load
    localStorage.removeItem("selectedCake");

    const storedTheater = JSON.parse(localStorage.getItem("selectedTheater") || "null");
    const storedSlot = JSON.parse(localStorage.getItem("selectedSlot") || "null");
    const people = parseInt(localStorage.getItem("numPeople") || "2");
    const storedName = localStorage.getItem("name") || "";
    const storedPhone = localStorage.getItem("phoneNumber") || "";
    const storedEmail = localStorage.getItem("email") || "";
    const storedOccasion = localStorage.getItem("selectedOccasion") || "";
    const storedNameToInclude = localStorage.getItem("nameToInclude") || "";

    if (storedTheater) setSelectedTheater(storedTheater);
    if (storedSlot) setSelectedSlot(storedSlot);
    if (people) setNumPeople(people);
    setName(storedName);
    setPhoneNumber(storedPhone);
    setEmail(storedEmail);
    setOccasion(storedOccasion);
    setNameToInclude(storedNameToInclude);
  }, []);

  const selectedCakeObj = cakes.find((cake) => cake.name === selectedCake);
  const cakeCost = selectedCakeObj?.price || 0;
  const theaterCost = selectedTheater?.price || 0;
  const subtotal = theaterCost + cakeCost;
  const advance = 499;
  const balance = subtotal - advance;

  const handleNext = () => {
    if (selectedCakeObj) {
      localStorage.setItem("selectedCake", JSON.stringify(selectedCakeObj));
    }
    router.push("/booking/decoration");
  };

  const handleBack = () => {
    localStorage.removeItem("selectedCake");
    router.back();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="w-full md:w-2/3">
        <h2 className="text-2xl font-bold mb-4">
          Choose Cake <span className="text-sm text-gray-500">(optional)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {cakes.map((cake) => (
            <div
              key={cake.name}
              onClick={() => setSelectedCake(cake.name)}
              className={`relative p-3 border rounded-lg text-center transition hover:scale-105 cursor-pointer ${
                selectedCake === cake.name
                  ? "border-red-700 bg-red-100"
                  : "border-gray-300"
              }`}
            >
              <Image
                src={cake.image}
                alt={cake.name}
                width={150}
                height={150}
                className="mx-auto rounded-md"
              />
              <p className="mt-2 font-medium text-sm">{cake.name}</p>
              <p className="text-sm text-gray-600">₹ {cake.price}</p>
              {selectedCake === cake.name && (
                <div className="absolute top-2 right-2 bg-red-700 text-white text-xs px-2 py-1 rounded-full">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-10">
          <button
            onClick={handleBack}
            className="py-3 px-8 bg-gray-300 text-black font-semibold rounded hover:bg-gray-400"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="py-3 px-8 rounded-full text-white font-semibold shadow-md bg-red-900 hover:bg-red-800"
          >
            Next step
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">Booking summary</h3>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>{selectedTheater?.name || "Room"} ({numPeople} people)</span>
            <span>₹ {theaterCost}</span>
          </div>
          {selectedSlot?.time && (
            <div className="flex justify-between">
              <span>Time Slot</span>
              <span>{selectedSlot.time}</span>
            </div>
          )}
          
          {selectedCake && (
            <div className="flex justify-between">
              <span>{selectedCake}</span>
              <span>₹ {cakeCost}</span>
            </div>
          )}
          <div className="flex justify-between border-t mt-2 pt-2 font-medium">
            <span>Subtotal</span>
            <span>₹ {subtotal}</span>
          </div>
          <div className="mt-4 font-semibold">Advance amount payable</div>
          <div className="flex justify-between">
            <span>₹ {advance}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Balance amount</span>
            <span>₹ {balance}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">(Payable at the venue)</div>

          <hr className="my-3" />

          <div className="text-xs text-gray-700 space-y-1">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Phone:</strong> {phoneNumber}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Occasion:</strong> {occasion}</p>
            <p><strong>Include Name:</strong> {nameToInclude}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CakePage;
