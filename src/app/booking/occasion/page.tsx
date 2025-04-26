"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const occasions = [
  { label: "Birthday", image: "/Images/occasions/birthday.WEBP" },
  { label: "Anniversary", image: "/Images/occasions/anniversary.WEBP" },
  { label: "Romantic Date", image: "/Images/occasions/romantic.WEBP" },
  { label: "Marriage Proposal", image: "/Images/occasions/proposal.WEBP" },
  { label: "Bride to be", image: "/Images/occasions/bride.WEBP" },
  { label: "Farewell", image: "/Images/occasions/farewell.WEBP" },
  { label: "Congratulations", image: "/Images/occasions/congrats.WEBP" },
  { label: "Baby Shower", image: "/Images/occasions/babyshower.WEBP" },
  /*{ label: "Groom To Be", image: "/Images/occasions/groom.WEBP" }, */
];

const OccasionPage = () => {
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [nameToInclude, setNameToInclude] = useState<string>("");

  const [selectedTheater, setSelectedTheater] = useState<any>(null);
  const [selectedCake, setSelectedCake] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [numPeople, setNumPeople] = useState<number>(2);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const storedTheater = JSON.parse(localStorage.getItem("selectedTheater") || "null");
    const storedCake = JSON.parse(localStorage.getItem("selectedCake") || "null");
    const storedSlot = JSON.parse(localStorage.getItem("selectedSlot") || "null");
    const storedNumPeople = Number(localStorage.getItem("numPeople")) || 2;
    const storedName = localStorage.getItem("name") || "";
    const storedEmail = localStorage.getItem("email") || "";
    const storedPhone = localStorage.getItem("phoneNumber") || "";

    setSelectedTheater(storedTheater);
    setSelectedCake(storedCake);
    setSelectedSlot(storedSlot);
    setNumPeople(storedNumPeople);
    setName(storedName);
    setEmail(storedEmail);
    setPhoneNumber(storedPhone);
  }, []);

  const handleNext = () => {
    if (!selectedOccasion || !nameToInclude.trim()) {
      alert("Please select an occasion and enter a name to be included.");
      return;
    }

    localStorage.setItem("selectedOccasion", selectedOccasion);
    localStorage.setItem("nameToInclude", nameToInclude.trim());
    router.push("/booking/cake");
  };

  const renderBookingSummary = () => {
    const theaterCost = selectedTheater?.price || 0;
    const cakeCost = selectedCake?.price || 0;
    const total = theaterCost + cakeCost;
    const advance = 500;
    const due = total - advance;

    return (
      <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">Booking summary</h3>
        <div className="text-sm space-y-2">
          {name && (
            <div className="flex justify-between">
              <span>Name</span>
              <span>{name}</span>
            </div>
          )}
          {phoneNumber && (
            <div className="flex justify-between">
              <span>Phone</span>
              <span>{phoneNumber}</span>
            </div>
          )}
          {email && (
            <div className="flex justify-between">
              <span>Email</span>
              <span>{email}</span>
            </div>
          )}
          {selectedTheater && (
            <div className="flex justify-between">
              <span>{selectedTheater.name}</span>
              <span>₹ {theaterCost}</span>
            </div>
          )}
          {selectedSlot?.time && (
            <div className="flex justify-between">
              <span>Time Slot</span>
              <span>{selectedSlot.time}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Number of People</span>
            <span>{numPeople}</span>
          </div>
          {selectedCake && (
            <div className="flex justify-between">
              <span>{selectedCake.name}</span>
              <span>₹ {cakeCost}</span>
            </div>
          )}
          {selectedOccasion && (
            <div className="flex justify-between">
              <span>Occasion</span>
              <span>{selectedOccasion}</span>
            </div>
          )}
          {nameToInclude && (
            <div className="flex justify-between">
              <span>Name to Include</span>
              <span>{nameToInclude}</span>
            </div>
          )}
          <div className="flex justify-between border-t mt-2 pt-2 font-medium">
            <span>Subtotal</span>
            <span>₹ {total}</span>
          </div>
          <div className="mt-4 font-semibold">Advance amount payable</div>
          <div className="flex justify-between">
            <span>₹ {advance}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Balance amount</span>
            <span>₹ {due}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">(Payable at the venue)</div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 p-6 min-h-screen bg-white">
      {/* Left - Occasion Selection */}
      <div className="w-full md:w-2/3">
        <h2 className="text-2xl font-bold mb-6">Select the Occasion</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
          {occasions.map((item) => (
            <div
              key={item.label}
              onClick={() => setSelectedOccasion(item.label)}
              className={`cursor-pointer p-3 rounded-lg border-2 text-center transition-transform hover:scale-105 ${
                selectedOccasion === item.label
                  ? "border-red-700 bg-red-100"
                  : "border-gray-300"
              }`}
            >
              <Image
                src={item.image}
                alt={item.label}
                width={100}
                height={100}
                className="mx-auto"
              />
              <p className="mt-2 font-medium">{item.label}</p>
            </div>
          ))}
        </div>

        {selectedOccasion && (
          <div className="mt-4">
            <label className="block text-md mb-2 font-semibold">
              Name to be included <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nameToInclude}
              onChange={(e) => setNameToInclude(e.target.value)}
              placeholder="Enter name"
              className="w-full border border-gray-300 px-4 py-2 rounded"
            />
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => router.back()}
            className="bg-gray-300 text-black py-2 px-6 rounded hover:bg-gray-400 transition"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-red-700 text-white py-2 px-6 rounded hover:bg-red-800 transition"
          >
            Next
          </button>
        </div>
      </div>

      {/* Right - Booking Summary */}
      {renderBookingSummary()}
    </div>
  );
};

export default OccasionPage;
